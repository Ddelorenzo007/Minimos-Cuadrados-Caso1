(function(){
  "use strict";

  // --- 1. LÓGICA DE LA MATRIZ DE CLÚSTERES (DATOS EXPERIMENTALES) ---
  
  // Datos exactos extraídos del Caso de Estudio
  const clusterData = {
    "ceramica": [{"x": 0, "tamb": 22.2, "y": 87.25}, {"x": 2, "tamb": 22.21, "y": 84.81}, {"x": 4, "tamb": 22.22, "y": 81.33}, {"x": 6, "tamb": 22.22, "y": 78.88}, {"x": 8, "tamb": 22.23, "y": 76.3}, {"x": 10, "tamb": 22.24, "y": 73.9}, {"x": 12, "tamb": 22.25, "y": 71.63}, {"x": 14, "tamb": 22.25, "y": 69.42}, {"x": 16, "tamb": 22.26, "y": 67.22}, {"x": 18, "tamb": 22.27, "y": 65.09}, {"x": 20, "tamb": 22.27, "y": 63.46}, {"x": 22, "tamb": 22.28, "y": 60.98}, {"x": 24, "tamb": 22.28, "y": 59.33}, {"x": 26, "tamb": 22.29, "y": 57.71}, {"x": 28, "tamb": 22.29, "y": 56.35}, {"x": 30, "tamb": 22.3, "y": 54.1}, {"x": 32, "tamb": 22.3, "y": 52.71}, {"x": 34, "tamb": 22.31, "y": 51.66}, {"x": 36, "tamb": 22.31, "y": 50.06}, {"x": 38, "tamb": 22.31, "y": 48.82}, {"x": 40, "tamb": 22.32, "y": 47.77}, {"x": 42, "tamb": 22.32, "y": 46.38}, {"x": 44, "tamb": 22.32, "y": 45.41}, {"x": 46, "tamb": 22.32, "y": 44.76}, {"x": 48, "tamb": 22.32, "y": 43.58}, {"x": 50, "tamb": 22.32, "y": 42.73}, {"x": 52, "tamb": 22.32, "y": 41.92}, {"x": 54, "tamb": 22.32, "y": 40.58}, {"x": 56, "tamb": 22.32, "y": 39.78}, {"x": 58, "tamb": 22.31, "y": 38.89}, {"x": 60, "tamb": 22.31, "y": 38.36}, {"x": 62, "tamb": 22.31, "y": 37.72}, {"x": 64, "tamb": 22.31, "y": 36.84}, {"x": 66, "tamb": 22.3, "y": 36.35}, {"x": 68, "tamb": 22.3, "y": 35.59}, {"x": 70, "tamb": 22.29, "y": 34.76}, {"x": 72, "tamb": 22.29, "y": 34.38}, {"x": 74, "tamb": 22.28, "y": 33.82}, {"x": 76, "tamb": 22.28, "y": 33.14}, {"x": 78, "tamb": 22.27, "y": 32.71}, {"x": 80, "tamb": 22.26, "y": 32.48}, {"x": 82, "tamb": 22.26, "y": 31.48}, {"x": 84, "tamb": 22.25, "y": 31.17}, {"x": 86, "tamb": 22.24, "y": 30.6}, {"x": 88, "tamb": 22.24, "y": 30.18}, {"x": 90, "tamb": 22.23, "y": 30.05}, {"x": 92, "tamb": 22.22, "y": 29.57}, {"x": 94, "tamb": 22.21, "y": 29.24}, {"x": 96, "tamb": 22.21, "y": 28.91}, {"x": 98, "tamb": 22.2, "y": 28.32}, {"x": 100, "tamb": 22.19, "y": 28.36}, {"x": 102, "tamb": 22.18, "y": 28.28}, {"x": 104, "tamb": 22.17, "y": 27.77}, {"x": 106, "tamb": 22.17, "y": 27.87}, {"x": 108, "tamb": 22.16, "y": 27.45}, {"x": 110, "tamb": 22.15, "y": 27.1}, {"x": 112, "tamb": 22.15, "y": 27.16}, {"x": 114, "tamb": 22.14, "y": 26.78}, {"x": 116, "tamb": 22.13, "y": 26.53}, {"x": 118, "tamb": 22.13, "y": 26.34}, {"x": 120, "tamb": 22.12, "y": 26.03}],
    "vidrio": [{"x": 0, "tamb": 22.1, "y": 88.01}, {"x": 2, "tamb": 22.1, "y": 83.7}, {"x": 4, "tamb": 22.11, "y": 80.32}, {"x": 6, "tamb": 22.11, "y": 76.81}, {"x": 8, "tamb": 22.11, "y": 74.18}, {"x": 10, "tamb": 22.12, "y": 70.85}, {"x": 12, "tamb": 22.12, "y": 67.71}, {"x": 14, "tamb": 22.12, "y": 65.09}, {"x": 16, "tamb": 22.12, "y": 62.62}, {"x": 18, "tamb": 22.12, "y": 60.03}, {"x": 20, "tamb": 22.12, "y": 57.68}, {"x": 22, "tamb": 22.12, "y": 55.14}, {"x": 24, "tamb": 22.12, "y": 53.69}, {"x": 26, "tamb": 22.12, "y": 51.73}, {"x": 28, "tamb": 22.11, "y": 49.93}, {"x": 30, "tamb": 22.11, "y": 48.01}, {"x": 32, "tamb": 22.11, "y": 46.91}, {"x": 34, "tamb": 22.1, "y": 45.12}, {"x": 36, "tamb": 22.1, "y": 43.65}, {"x": 38, "tamb": 22.1, "y": 42.48}, {"x": 40, "tamb": 22.09, "y": 41.69}, {"x": 42, "tamb": 22.08, "y": 40.34}, {"x": 44, "tamb": 22.08, "y": 39.29}, {"x": 46, "tamb": 22.07, "y": 38.18}, {"x": 48, "tamb": 22.07, "y": 37.55}, {"x": 50, "tamb": 22.06, "y": 36.41}, {"x": 52, "tamb": 22.05, "y": 35.58}, {"x": 54, "tamb": 22.05, "y": 34.71}, {"x": 56, "tamb": 22.04, "y": 34.22}, {"x": 58, "tamb": 22.03, "y": 33.09}, {"x": 60, "tamb": 22.02, "y": 32.97}, {"x": 62, "tamb": 22.02, "y": 31.82}, {"x": 64, "tamb": 22.01, "y": 31.14}, {"x": 66, "tamb": 22.0, "y": 30.66}, {"x": 68, "tamb": 21.99, "y": 30.2}, {"x": 70, "tamb": 21.99, "y": 29.95}, {"x": 72, "tamb": 21.98, "y": 29.25}, {"x": 74, "tamb": 21.97, "y": 28.35}, {"x": 76, "tamb": 21.96, "y": 28.37}, {"x": 78, "tamb": 21.96, "y": 28.15}, {"x": 80, "tamb": 21.95, "y": 27.88}, {"x": 82, "tamb": 21.94, "y": 27.17}, {"x": 84, "tamb": 21.94, "y": 27.05}, {"x": 86, "tamb": 21.93, "y": 26.72}, {"x": 88, "tamb": 21.92, "y": 26.02}, {"x": 90, "tamb": 21.92, "y": 25.97}, {"x": 92, "tamb": 21.91, "y": 25.73}, {"x": 94, "tamb": 21.91, "y": 25.46}, {"x": 96, "tamb": 21.9, "y": 25.48}, {"x": 98, "tamb": 21.9, "y": 25.06}, {"x": 100, "tamb": 21.89, "y": 24.6}, {"x": 102, "tamb": 21.89, "y": 24.87}, {"x": 104, "tamb": 21.89, "y": 24.89}, {"x": 106, "tamb": 21.89, "y": 24.49}, {"x": 108, "tamb": 21.88, "y": 24.32}, {"x": 110, "tamb": 21.88, "y": 24.05}, {"x": 112, "tamb": 21.88, "y": 24.13}, {"x": 114, "tamb": 21.88, "y": 23.34}, {"x": 116, "tamb": 21.88, "y": 23.86}, {"x": 118, "tamb": 21.88, "y": 23.41}, {"x": 120, "tamb": 21.88, "y": 23.42}],
    "papel": [{"x": 0, "tamb": 22.51, "y": 87.2}, {"x": 2, "tamb": 22.51, "y": 85.13}, {"x": 4, "tamb": 22.5, "y": 83.05}, {"x": 6, "tamb": 22.5, "y": 80.6}, {"x": 8, "tamb": 22.49, "y": 78.24}, {"x": 10, "tamb": 22.49, "y": 76.77}, {"x": 12, "tamb": 22.48, "y": 74.68}, {"x": 14, "tamb": 22.48, "y": 72.66}, {"x": 16, "tamb": 22.47, "y": 70.74}, {"x": 18, "tamb": 22.46, "y": 69.16}, {"x": 20, "tamb": 22.46, "y": 67.18}, {"x": 22, "tamb": 22.45, "y": 65.52}, {"x": 24, "tamb": 22.44, "y": 64.14}, {"x": 26, "tamb": 22.44, "y": 62.96}, {"x": 28, "tamb": 22.43, "y": 61.01}, {"x": 30, "tamb": 22.42, "y": 59.87}, {"x": 32, "tamb": 22.41, "y": 58.6}, {"x": 34, "tamb": 22.41, "y": 57.18}, {"x": 36, "tamb": 22.4, "y": 56.42}, {"x": 38, "tamb": 22.39, "y": 55.0}, {"x": 40, "tamb": 22.38, "y": 53.97}, {"x": 42, "tamb": 22.37, "y": 52.75}, {"x": 44, "tamb": 22.37, "y": 51.87}, {"x": 46, "tamb": 22.36, "y": 50.81}, {"x": 48, "tamb": 22.35, "y": 49.65}, {"x": 50, "tamb": 22.35, "y": 48.55}, {"x": 52, "tamb": 22.34, "y": 47.68}, {"x": 54, "tamb": 22.33, "y": 46.85}, {"x": 56, "tamb": 22.33, "y": 45.91}, {"x": 58, "tamb": 22.32, "y": 45.32}, {"x": 60, "tamb": 22.31, "y": 44.17}, {"x": 62, "tamb": 22.31, "y": 43.75}, {"x": 64, "tamb": 22.3, "y": 42.41}, {"x": 66, "tamb": 22.3, "y": 41.97}, {"x": 68, "tamb": 22.3, "y": 41.28}, {"x": 70, "tamb": 22.29, "y": 40.25}, {"x": 72, "tamb": 22.29, "y": 39.64}, {"x": 74, "tamb": 22.29, "y": 39.16}, {"x": 76, "tamb": 22.28, "y": 38.59}, {"x": 78, "tamb": 22.28, "y": 38.26}, {"x": 80, "tamb": 22.28, "y": 37.57}, {"x": 82, "tamb": 22.28, "y": 37.01}, {"x": 84, "tamb": 22.28, "y": 36.61}, {"x": 86, "tamb": 22.28, "y": 36.24}, {"x": 88, "tamb": 22.28, "y": 35.27}, {"x": 90, "tamb": 22.28, "y": 35.09}, {"x": 92, "tamb": 22.28, "y": 34.61}, {"x": 94, "tamb": 22.29, "y": 34.62}, {"x": 96, "tamb": 22.29, "y": 33.78}, {"x": 98, "tamb": 22.29, "y": 33.66}, {"x": 100, "tamb": 22.3, "y": 32.87}, {"x": 102, "tamb": 22.3, "y": 33.06}, {"x": 104, "tamb": 22.3, "y": 32.49}, {"x": 106, "tamb": 22.31, "y": 32.16}, {"x": 108, "tamb": 22.31, "y": 31.54}, {"x": 110, "tamb": 22.32, "y": 31.48}, {"x": 112, "tamb": 22.33, "y": 30.88}, {"x": 114, "tamb": 22.33, "y": 30.61}, {"x": 116, "tamb": 22.34, "y": 30.45}, {"x": 118, "tamb": 22.34, "y": 29.92}, {"x": 120, "tamb": 22.35, "y": 29.74}],
    "termico": [{"x": 0, "tamb": 22.12, "y": 88.03}, {"x": 2, "tamb": 22.11, "y": 86.85}, {"x": 4, "tamb": 22.1, "y": 85.96}, {"x": 6, "tamb": 22.09, "y": 85.25}, {"x": 8, "tamb": 22.09, "y": 83.97}, {"x": 10, "tamb": 22.08, "y": 83.19}, {"x": 12, "tamb": 22.07, "y": 82.37}, {"x": 14, "tamb": 22.06, "y": 81.57}, {"x": 16, "tamb": 22.06, "y": 80.58}, {"x": 18, "tamb": 22.05, "y": 79.71}, {"x": 20, "tamb": 22.04, "y": 79.12}, {"x": 22, "tamb": 22.04, "y": 78.45}, {"x": 24, "tamb": 22.03, "y": 77.65}, {"x": 26, "tamb": 22.02, "y": 76.78}, {"x": 28, "tamb": 22.02, "y": 75.79}, {"x": 30, "tamb": 22.01, "y": 75.18}, {"x": 32, "tamb": 22.01, "y": 74.7}, {"x": 34, "tamb": 22.0, "y": 73.83}, {"x": 36, "tamb": 22.0, "y": 73.13}, {"x": 38, "tamb": 21.99, "y": 72.65}, {"x": 40, "tamb": 21.99, "y": 72.31}, {"x": 42, "tamb": 21.99, "y": 71.26}, {"x": 44, "tamb": 21.99, "y": 70.56}, {"x": 46, "tamb": 21.98, "y": 70.22}, {"x": 48, "tamb": 21.98, "y": 69.48}, {"x": 50, "tamb": 21.98, "y": 68.63}, {"x": 52, "tamb": 21.98, "y": 68.29}, {"x": 54, "tamb": 21.98, "y": 67.4}, {"x": 56, "tamb": 21.98, "y": 66.62}, {"x": 58, "tamb": 21.98, "y": 66.17}, {"x": 60, "tamb": 21.98, "y": 65.52}, {"x": 62, "tamb": 21.98, "y": 64.89}, {"x": 64, "tamb": 21.99, "y": 64.32}, {"x": 66, "tamb": 21.99, "y": 63.74}, {"x": 68, "tamb": 21.99, "y": 63.01}, {"x": 70, "tamb": 22.0, "y": 62.33}, {"x": 72, "tamb": 22.0, "y": 61.87}, {"x": 74, "tamb": 22.01, "y": 61.5}, {"x": 76, "tamb": 22.01, "y": 60.98}, {"x": 78, "tamb": 22.02, "y": 60.33}, {"x": 80, "tamb": 22.02, "y": 60.01}, {"x": 82, "tamb": 22.03, "y": 59.33}, {"x": 84, "tamb": 22.03, "y": 58.89}, {"x": 86, "tamb": 22.04, "y": 58.34}, {"x": 88, "tamb": 22.05, "y": 58.12}, {"x": 90, "tamb": 22.06, "y": 57.63}, {"x": 92, "tamb": 22.06, "y": 57.15}, {"x": 94, "tamb": 22.07, "y": 56.77}, {"x": 96, "tamb": 22.08, "y": 56.33}, {"x": 98, "tamb": 22.09, "y": 55.73}, {"x": 100, "tamb": 22.09, "y": 55.38}, {"x": 102, "tamb": 22.1, "y": 54.94}, {"x": 104, "tamb": 22.11, "y": 54.54}, {"x": 106, "tamb": 22.12, "y": 54.13}, {"x": 108, "tamb": 22.12, "y": 53.71}, {"x": 110, "tamb": 22.13, "y": 53.07}, {"x": 112, "tamb": 22.14, "y": 52.58}, {"x": 114, "tamb": 22.15, "y": 52.39}, {"x": 116, "tamb": 22.15, "y": 51.86}, {"x": 118, "tamb": 22.16, "y": 51.43}, {"x": 120, "tamb": 22.17, "y": 50.89}]
  };

  // Colores para los gráficos
  const colors = {
    "ceramica": "#0D6EFD",
    "vidrio": "#DC3545",
    "papel": "#198754",
    "termico": "#FFC107"
  };

  // Inicialización de Gráficos y Tablas para el Layout 2x2
  Object.keys(clusterData).forEach(key => {
    const data = clusterData[key];
    const tbody = document.getElementById(`tbody-${key}`);
    const ctx = document.getElementById(`chart-${key}`).getContext('2d');
    
    // Poblar la tabla correspondiente
    data.forEach(pt => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${pt.x}</td><td>${pt.tamb}</td><td>${pt.y}</td>`;
      tbody.appendChild(tr);
    });

    // Crear la gráfica correspondiente
    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Datos Experimentales',
          data: data,
          backgroundColor: colors[key],
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { title: { display: true, text: 'Minutos' } },
          y: { title: { display: true, text: 'Temperatura (°C)' } }
        }
      }
    });
  });

  // Lógica para cambiar entre pestañas (Gráfica / Tabla) en cada Clúster
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.cluster-card');
      // Quitar clase active a los botones de esta card
      card.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      // Ocultar los contenidos de esta card
      card.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      
      // Activar el botón y contenido clickeado
      e.target.classList.add('active');
      document.getElementById(e.target.dataset.target).style.display = 'block';
    });
  });


  // --- 2. LÓGICA DE LA CALCULADORA INTERACTIVA DE AJUSTE ---

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

  let calcChartInstance = null;

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
    // Precargamos los datos del recipiente térmico de nuestro Caso
    clusterData["termico"].forEach(pt => addRow(pt.x, pt.y, pt.tamb));
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

    drawCalcChart(points, best);
  }

  function drawCalcChart(points, bestModel) {
    const ctx = document.getElementById('calcChart').getContext('2d');
    if (calcChartInstance) calcChartInstance.destroy();
    points.sort((a, b) => a.x - b.x);
    let span = points[points.length-1].x - points[0].x;
    let lineData = [];
    for(let i=0; i<=50; i++) {
      let x = points[0].x + (span/50)*i;
      lineData.push({x: x, y: bestModel.calcLine(x)});
    }
    calcChartInstance = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          { label: 'Puntos Cargados', data: points, backgroundColor: '#212529', pointRadius: 4, order: 2 },
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

  // Navegación Activa en Scroll
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('nav.rail a');
  window.addEventListener('scroll', () => {
    let pos = window.scrollY + 120;
    let current = sections[0] ? sections[0].id : '';
    sections.forEach(sec => { if (sec.offsetTop <= pos) current = sec.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }, {passive:true});

  // Inicializar Calculadora
  clearTable();
  loadExample(); // Cargamos el termo por defecto
  runCalculation();

})();