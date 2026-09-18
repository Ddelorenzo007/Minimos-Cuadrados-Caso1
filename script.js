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
    const exampleData = [{"x": 0, "y": 87.2, "tamb": 22.51}, {"x": 2, "y": 85.13, "tamb": 22.51}, {"x": 4, "y": 83.05, "tamb": 22.5}, {"x": 6, "y": 80.6, "tamb": 22.5}, {"x": 8, "y": 78.24, "tamb": 22.49}, {"x": 10, "y": 76.77, "tamb": 22.49}, {"x": 12, "y": 74.68, "tamb": 22.48}, {"x": 14, "y": 72.66, "tamb": 22.48}, {"x": 16, "y": 70.74, "tamb": 22.47}, {"x": 18, "y": 69.16, "tamb": 22.46}, {"x": 20, "y": 67.18, "tamb": 22.46}, {"x": 22, "y": 65.52, "tamb": 22.45}, {"x": 24, "y": 64.14, "tamb": 22.44}, {"x": 26, "y": 62.96, "tamb": 22.44}, {"x": 28, "y": 61.01, "tamb": 22.43}, {"x": 30, "y": 59.87, "tamb": 22.42}, {"x": 32, "y": 58.6, "tamb": 22.41}, {"x": 34, "y": 57.18, "tamb": 22.41}, {"x": 36, "y": 56.42, "tamb": 22.4}, {"x": 38, "y": 55.0, "tamb": 22.39}, {"x": 40, "y": 53.97, "tamb": 22.38}, {"x": 42, "y": 52.75, "tamb": 22.37}, {"x": 44, "y": 51.87, "tamb": 22.37}, {"x": 46, "y": 50.81, "tamb": 22.36}, {"x": 48, "y": 49.65, "tamb": 22.35}, {"x": 50, "y": 48.55, "tamb": 22.35}, {"x": 52, "y": 47.68, "tamb": 22.34}, {"x": 54, "y": 46.85, "tamb": 22.33}, {"x": 56, "y": 45.91, "tamb": 22.33}, {"x": 58, "y": 45.32, "tamb": 22.32}, {"x": 60, "y": 44.17, "tamb": 22.31}, {"x": 62, "y": 43.75, "tamb": 22.31}, {"x": 64, "y": 42.41, "tamb": 22.3}, {"x": 66, "y": 41.97, "tamb": 22.3}, {"x": 68, "y": 41.28, "tamb": 22.3}, {"x": 70, "y": 40.25, "tamb": 22.29}, {"x": 72, "y": 39.64, "tamb": 22.29}, {"x": 74, "y": 39.16, "tamb": 22.29}, {"x": 76, "y": 38.59, "tamb": 22.28}, {"x": 78, "y": 38.26, "tamb": 22.28}, {"x": 80, "y": 37.57, "tamb": 22.28}, {"x": 82, "y": 37.01, "tamb": 22.28}, {"x": 84, "y": 36.61, "tamb": 22.28}, {"x": 86, "y": 36.24, "tamb": 22.28}, {"x": 88, "y": 35.27, "tamb": 22.28}, {"x": 90, "y": 35.09, "tamb": 22.28}, {"x": 92, "y": 34.61, "tamb": 22.28}, {"x": 94, "y": 34.62, "tamb": 22.29}, {"x": 96, "y": 33.78, "tamb": 22.29}, {"x": 98, "y": 33.66, "tamb": 22.29}, {"x": 100, "y": 32.87, "tamb": 22.3}, {"x": 102, "y": 33.06, "tamb": 22.3}, {"x": 104, "y": 32.49, "tamb": 22.3}, {"x": 106, "y": 32.16, "tamb": 22.31}, {"x": 108, "y": 31.54, "tamb": 22.31}, {"x": 110, "y": 31.48, "tamb": 22.32}, {"x": 112, "y": 30.88, "tamb": 22.33}, {"x": 114, "y": 30.61, "tamb": 22.33}, {"x": 116, "y": 30.45, "tamb": 22.34}, {"x": 118, "y": 29.92, "tamb": 22.34}, {"x": 120, "y": 29.74, "tamb": 22.35}];
    exampleData.forEach(pt => addRow(pt.x, pt.y, pt.tamb));
  }

  function det3x3(m) {
    return m[0][0]*(m[1][1]*m[2][2] - m[1][2]*m[2][1])
         - m[0][1]*(m[1][0]*m[2][2] - m[1][2]*m[2][0])
         + m[0][2]*(m[1][0]*m[2][1] - m[1][1]*m[2][0]);
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
    return { type: "Lineal", eq: `y = ${a2.toFixed(4)}x + ${a1.toFixed(4)}`, r2: calculateR2(points, calc), calcLine: calc };
  }

  function fitExponential(points) {
    let n = points.length;
    let sx = 0, slny = 0, sx2 = 0, sxlny = 0;
    for(let p of points) {
      if(p.y <= 0) return null; 
      let lny = Math.log(p.y);
      sx += p.x; slny += lny; sx2 += p.x*p.x; sxlny += p.x*lny;
    }
    let d = n*sx2 - sx*sx;
    if (d === 0) return null;
    let b = (n*sxlny - sx*slny) / d;
    let a = Math.exp((slny - b*sx) / n);
    let calc = (x) => a * Math.exp(b*x);
    return { type: "Exponencial Crudo", eq: `y = ${a.toFixed(4)} · e^(${b.toFixed(4)}x)`, r2: calculateR2(points, calc), calcLine: calc };
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
    return { type: "Exponencial Desplazado", eq: `y = T_amb + ${a.toFixed(4)} · e^(${b.toFixed(4)}x)`, r2: calculateR2(points, calcExact), calcLine: calcLine };
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
    return { type: "Polinómico Grado 2", eq: `y = ${a3.toFixed(5)}x² + ${a2.toFixed(4)}x + ${a1.toFixed(4)}`, r2: calculateR2(points, calc), calcLine: calc };
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
    let mExp = fitExponential(points); if(mExp) models.push(mExp);

    if (models.length === 0) return alert("Error matemático: revisá valores de Temperatura (y) vs T_amb.");

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
          { type: 'line', label: `Curva: ${bestModel.type}`, data: lineData, borderColor: '#0D6EFD', borderWidth: 3, fill: false, pointRadius: 0, tension: 0.2, order: 1 }
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