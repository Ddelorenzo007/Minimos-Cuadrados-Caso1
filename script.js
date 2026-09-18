(function(){
  "use strict";

  const tableBody = document.querySelector('#data-table tbody');
  const btnAdd = document.getElementById('btn-add');
  const btnClear = document.getElementById('btn-clear');
  const btnExample = document.getElementById('btn-example');
  const btnCalculate = document.getElementById('btn-calculate');
  const inputTamb = document.getElementById('input-tamb');
  
  const boxBestFit = document.getElementById('best-fit-box');
  const resType = document.getElementById('res-type');
  const resEq = document.getElementById('res-eq');
  const resR2 = document.getElementById('res-r2');
  
  const allModelsTable = document.getElementById('all-models-table');
  const allModelsBody = document.getElementById('all-models-body');

  let chartInstance = null;

  function addRow(x = '', y = '', tamb = '') {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="number" step="any" class="in-x" value="${x}"></td>
      <td><input type="number" step="any" class="in-y" value="${y}"></td>
      <td><input type="number" step="any" class="in-tamb" placeholder="Global" value="${tamb}"></td>
      <td style="text-align:center;"><button class="btn-del" tabindex="-1">×</button></td>
    `;
    tr.querySelector('.btn-del').addEventListener('click', () => tr.remove());
    tableBody.appendChild(tr);
  }

  function clearTable() {
    tableBody.innerHTML = '';
    for(let i=0; i<5; i++) addRow();
  }

  function loadExample() {
    tableBody.innerHTML = '';
    // Puntos del vaso térmico de la cafetería
    const exampleData = [{"x": 0, "y": 88.03, "tamb": 22.1}, {"x": 10, "y": 83.19, "tamb": 22.09}, {"x": 20, "y": 79.12, "tamb": 22.08}, {"x": 30, "y": 75.18, "tamb": 22.07}, {"x": 40, "y": 72.31, "tamb": 22.06}, {"x": 50, "y": 68.63, "tamb": 22.05}, {"x": 60, "y": 65.52, "tamb": 22.04}, {"x": 70, "y": 62.33, "tamb": 22.03}, {"x": 80, "y": 60.01, "tamb": 22.02}, {"x": 90, "y": 57.63, "tamb": 22.01}, {"x": 100, "y": 55.38, "tamb": 22.00}, {"x": 110, "y": 53.07, "tamb": 21.99}, {"x": 120, "y": 50.89, "tamb": 21.98}];
    exampleData.forEach(pt => addRow(pt.x, pt.y, pt.tamb));
  }

  function det3x3(m) {
    return m[0][0]*(m[1][1]*m[2][2] - m[1][2]*m[2][1]) - m[0][1]*(m[1][0]*m[2][2] - m[1][2]*m[2][0]) + m[0][2]*(m[1][0]*m[2][1] - m[1][1]*m[2][0]);
  }

  function solve3x3(A, B) {
    const D = det3x3(A);
    if (Math.abs(D) < 1e-10) return null;
    let res = [];
    for(let i=0; i<3; i++) {
      let Ai = [ [...A[0]], [...A[1]], [...A[2]] ];
      Ai[0][i] = B[0]; Ai[1][i] = B[1]; Ai[2][i] = B[2];
      res.push(det3x3(Ai) / D);
    }
    return res;
  }

  function calculateR2(points, calcFn) {
    let sumY = 0;
    points.forEach(p => sumY += p.y);
    const meanY = sumY / points.length;
    let ST = 0, SR = 0;
    points.forEach(p => {
      ST += Math.pow(p.y - meanY, 2);
      SR += Math.pow(p.y - calcFn(p.x, p.tAmbReal), 2);
    });
    return ST === 0 ? 0 : (1 - (SR / ST));
  }

  function fitLinear(points) {
    let n = points.length;
    let sx = 0, sy = 0, sx2 = 0, sxy = 0;
    points.forEach(p => { sx += p.x; sy += p.y; sx2 += p.x*p.x; sxy += p.x*p.y; });
    let d = n*sx2 - sx*sx;
    if (d === 0) return null;
    let a2 = (n*sxy - sx*sy) / d; 
    let a1 = (sy - a2*sx) / n;    
    let calc = (x) => a1 + a2*x;
    return { type: "Ajuste Lineal", eq: `y = ${a2.toFixed(4)}x + ${a1.toFixed(4)}`, r2: calculateR2(points, calc), calcLine: calc };
  }

  function fitExponentialShifted(points, globalTamb) {
    let shiftedPoints = [];
    let sumTamb = 0;
    for(let p of points) {
      let tAmbActual = isNaN(p.tamb) ? globalTamb : p.tamb;
      if(p.y <= tAmbActual) return null; 
      shiftedPoints.push({ x: p.x, y: p.y - tAmbActual });
      sumTamb += tAmbActual;
    }
    let avgTamb = sumTamb / points.length;
    let n = shiftedPoints.length;
    let sx = 0, slny = 0, sx2 = 0, sxlny = 0;
    shiftedPoints.forEach(p => {
      let lny = Math.log(p.y);
      sx += p.x; slny += lny; sx2 += p.x*p.x; sxlny += p.x*lny;
    });
    let d = n*sx2 - sx*sx;
    if (d === 0) return null;
    let b = (n*sxlny - sx*slny) / d;
    let a = Math.exp((slny - b*sx) / n);
    let calcExact = (x, specificTamb) => (specificTamb !== undefined ? specificTamb : avgTamb) + a * Math.exp(b*x);
    let calcLine = (x) => avgTamb + a * Math.exp(b*x);
    return { type: "Exponencial (Linealizado)", eq: `y = T_amb + ${a.toFixed(4)} · e^(${b.toFixed(4)}x)`, r2: calculateR2(points, calcExact), calcLine: calcLine };
  }

  function fitPoly2(points) {
    let n = points.length;
    let sx = 0, sx2 = 0, sx3 = 0, sx4 = 0;
    let sy = 0, sxy = 0, sx2y = 0;
    points.forEach(p => {
      let x2 = p.x*p.x;
      sx += p.x; sx2 += x2; sx3 += x2*p.x; sx4 += x2*x2;
      sy += p.y; sxy += p.x*p.y; sx2y += x2*p.y;
    });
    let coefs = solve3x3([[n, sx, sx2], [sx, sx2, sx3], [sx2, sx3, sx4]], [sy, sxy, sx2y]);
    if (!coefs) return null;
    let [a1, a2, a3] = coefs;
    let calc = (x) => a1 + a2*x + a3*x*x;
    return { type: "Polinómico de Grado 2", eq: `y = ${a3.toFixed(5)}x² + ${a2.toFixed(4)}x + ${a1.toFixed(4)}`, r2: calculateR2(points, calc), calcLine: calc };
  }

  function runCalculation() {
    let points = [];
    document.querySelectorAll('#data-table tbody tr').forEach(tr => {
      let x = parseFloat(tr.querySelector('.in-x').value);
      let y = parseFloat(tr.querySelector('.in-y').value);
      let tamb = parseFloat(tr.querySelector('.in-tamb').value);
      let tAmbReal = isNaN(tamb) ? parseFloat(inputTamb.value) : tamb;
      if (!isNaN(x) && !isNaN(y)) points.push({x, y, tamb, tAmbReal});
    });

    if (points.length < 3) return alert("Ingresá al menos 3 puntos válidos.");
    let globalTamb = parseFloat(inputTamb.value) || 0;

    let models = [];
    let mLin = fitLinear(points); if(mLin) models.push(mLin);
    let mExpS = fitExponentialShifted(points, globalTamb); if(mExpS) models.push(mExpS);
    let mPol = fitPoly2(points); if(mPol) models.push(mPol);

    if (models.length === 0) return alert("Error matemático: revisá valores ingresados.");

    models.sort((a, b) => b.r2 - a.r2);
    let best = models[0];

    boxBestFit.style.display = 'block';
    resType.textContent = best.type;
    resEq.textContent = best.eq;
    resR2.textContent = best.r2.toFixed(4);

    allModelsTable.style.display = 'table';
    allModelsBody.innerHTML = '';
    models.forEach((m, idx) => {
      const tr = document.createElement('tr');
      if (idx === 0) tr.className = 'best-row';
      tr.innerHTML = `<td>${m.type}</td><td class="mono" style="font-size:0.85rem;">${m.eq}</td><td>${m.r2.toFixed(4)}</td>`;
      allModelsBody.appendChild(tr);
    });

    drawChart(points, best);
  }

  function drawChart(points, bestModel) {
    const ctx = document.getElementById('calcChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    points.sort((a, b) => a.x - b.x);
    let span = points[points.length-1].x - points[0].x;
    let lineData = [];
    for(let i=0; i<=50; i++) {
      let x = points[0].x + (span/50)*i;
      lineData.push({x: x, y: bestModel.calcLine(x)});
    }
    chartInstance = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          { label: 'Puntos Experimentales', data: points, backgroundColor: '#212529', pointRadius: 4, order: 2 },
          { type: 'line', label: `Mejor Curva (${bestModel.type})`, data: lineData, borderColor: '#0D6EFD', borderWidth: 3, fill: false, pointRadius: 0, tension: 0.2, order: 1 }
        ]
      },
      options: { responsive: true, plugins: { legend: { position: 'top' } } }
    });
  }

  btnAdd.addEventListener('click', () => addRow());
  btnClear.addEventListener('click', clearTable);
  btnExample.addEventListener('click', () => { loadExample(); runCalculation(); });
  btnCalculate.addEventListener('click', runCalculation);

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('nav.rail a');
  window.addEventListener('scroll', () => {
    let pos = window.scrollY + 120;
    let current = sections[0] ? sections[0].id : '';
    sections.forEach(sec => { if (sec.offsetTop <= pos) current = sec.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }, {passive:true});

  clearTable();
})();