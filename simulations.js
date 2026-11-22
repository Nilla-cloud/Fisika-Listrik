/**
 * simulations.js
 * Physics Simulation Engines for Inductance Chapter 32
 * Includes:
 * 1. Solenoid & Iron Core (Self-Inductance & Back EMF)
 * 2. RL Circuit (Switch A/B, current flow, dynamic graph)
 * 3. Mutual Inductance (Dual coil, wireless charging coupling, bulb)
 * 4. LC Oscillation vs Spring-Mass Mechanical Analogy (Dual split canvas)
 * 5. RLC Damped Oscillations (Digital Oscilloscope)
 */

const MU_0 = 4 * Math.PI * 1e-7;

// =========================================================================
// 1. SOLENOID & BACK EMF SIMULATION
// =========================================================================
class SolenoidSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.N = 300;
    this.lengthM = 0.25; // 25 cm
    this.radiusM = 0.0113; // Area = 4.0 cm2 -> r = sqrt(A/pi) = ~1.13 cm
    this.didt = 50.0; // A/s
    this.hasIronCore = false;
    this.ironPermeability = 500;
    this.current = 1.0;
    this.animOffset = 0;
    
    this.initControls();
    this.updateValues();
    this.animate();
  }

  initControls() {
    const sliderN = document.getElementById('sliderN');
    const sliderLen = document.getElementById('sliderLen');
    const sliderRadius = document.getElementById('sliderRadius');
    const sliderDidt = document.getElementById('sliderDidt');
    const toggleIron = document.getElementById('toggleIronCore');
    const btnPulse = document.getElementById('btnPulseCurrent');

    if (sliderN) {
      sliderN.addEventListener('input', (e) => {
        this.N = parseInt(e.target.value);
        document.getElementById('lblN').textContent = this.N;
        this.updateValues();
      });
    }

    if (sliderLen) {
      sliderLen.addEventListener('input', (e) => {
        const cm = parseFloat(e.target.value);
        this.lengthM = cm / 100.0;
        document.getElementById('lblLen').textContent = cm.toFixed(0) + ' cm';
        this.updateValues();
      });
    }

    if (sliderRadius) {
      sliderRadius.addEventListener('input', (e) => {
        const cm = parseFloat(e.target.value);
        this.radiusM = cm / 100.0;
        document.getElementById('lblRadius').textContent = cm.toFixed(2) + ' cm';
        this.updateValues();
      });
    }

    if (sliderDidt) {
      sliderDidt.addEventListener('input', (e) => {
        this.didt = parseFloat(e.target.value);
        const sign = this.didt >= 0 ? '+' : '';
        document.getElementById('lblDidt').textContent = sign + this.didt.toFixed(1) + ' A/s';
        this.updateValues();
      });
    }

    if (toggleIron) {
      toggleIron.addEventListener('change', (e) => {
        this.hasIronCore = e.target.checked;
        this.updateValues();
      });
    }

    if (btnPulse) {
      btnPulse.addEventListener('click', () => {
        let p = 0;
        const interval = setInterval(() => {
          p += 0.1;
          this.didt = Math.sin(p * Math.PI) * 100;
          this.updateValues();
          if (p >= 2) {
            clearInterval(interval);
            this.didt = 50;
            this.updateValues();
          }
        }, 30);
      });
    }
  }

  updateValues() {
    const area = Math.PI * this.radiusM * this.radiusM;
    const mu = this.hasIronCore ? MU_0 * this.ironPermeability : MU_0;
    
    // L = mu * N^2 * A / ell
    this.L = (mu * Math.pow(this.N, 2) * area) / this.lengthM;
    
    // emf = -L * dI/dt
    this.emf = -this.L * this.didt;

    // Update HUD
    const hudL = document.getElementById('hudL');
    const hudEmf = document.getElementById('hudEmf');
    if (hudL) {
      if (this.L >= 1) {
        hudL.textContent = this.L.toFixed(3) + ' H';
      } else {
        hudL.textContent = (this.L * 1000).toFixed(2) + ' mH';
      }
    }
    if (hudEmf) {
      const v = Math.abs(this.emf);
      if (v < 0.001) {
        hudEmf.textContent = (this.emf * 1000000).toFixed(1) + ' µV';
      } else if (v < 1) {
        hudEmf.textContent = (this.emf * 1000).toFixed(2) + ' mV';
      } else {
        hudEmf.textContent = this.emf.toFixed(2) + ' V';
      }
    }
  }

  animate() {
    this.render();
    this.animOffset = (this.animOffset + 1) % 60;
    requestAnimationFrame(() => this.animate());
  }

  render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);

    const centerY = height / 2 + 10;
    const coilW = Math.min(width - 120, Math.max(160, this.lengthM * 600));
    const startX = (width - coilW) / 2;
    const coilH = Math.min(70, Math.max(30, this.radiusM * 1800));

    // 1. Draw Iron Core if active
    if (this.hasIronCore) {
      ctx.fillStyle = '#475569';
      ctx.fillRect(startX - 20, centerY - coilH/2 + 6, coilW + 40, coilH - 12);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(startX - 20, centerY - coilH/2 + 6, coilW + 40, coilH - 12);
      
      // Label Inti Besi
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('INTI FEROMAGNETIK (km = 500)', startX + 10, centerY + 3);
    }

    // 2. Draw Magnetic Field Lines (B inside coil)
    const numLines = this.hasIronCore ? 7 : 4;
    ctx.strokeStyle = this.hasIronCore ? 'rgba(168, 85, 247, 0.7)' : 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = this.hasIronCore ? 2.5 : 1.5;

    for (let i = 0; i < numLines; i++) {
      const y = centerY - coilH/2 + 10 + (i * (coilH - 20)) / (numLines - 1);
      ctx.beginPath();
      ctx.moveTo(startX - 40, y);
      ctx.lineTo(startX + coilW + 40, y);
      ctx.stroke();

      // Field arrow head
      const arrowX = startX + coilW/2 + ((this.animOffset * 2) % 60) - 30;
      ctx.beginPath();
      ctx.moveTo(arrowX + 8, y);
      ctx.lineTo(arrowX, y - 4);
      ctx.lineTo(arrowX, y + 4);
      ctx.fillStyle = this.hasIronCore ? '#c084fc' : '#22d3ee';
      ctx.fill();
    }

    // 3. Draw Solenoid Windings (Helical 3D coil illusion)
    const turnsToDraw = Math.min(32, Math.max(10, Math.floor(this.N / 12)));
    const turnSpacing = coilW / turnsToDraw;

    for (let i = 0; i < turnsToDraw; i++) {
      const x = startX + i * turnSpacing;

      // Back of turn
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x + turnSpacing * 0.3, centerY, turnSpacing * 0.35, coilH / 2, 0, Math.PI, 0, false);
      ctx.stroke();

      // Front of turn (brighter copper)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(x + turnSpacing * 0.7, centerY, turnSpacing * 0.35, coilH / 2, 0, 0, Math.PI, false);
      ctx.stroke();
    }

    // 4. Connection Wires
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, centerY + coilH / 2);
    ctx.lineTo(startX - 40, centerY + coilH / 2);
    ctx.lineTo(startX - 40, centerY + 80);
    ctx.lineTo(width / 2 - 30, centerY + 80);

    ctx.moveTo(startX + coilW, centerY + coilH / 2);
    ctx.lineTo(startX + coilW + 40, centerY + coilH / 2);
    ctx.lineTo(startX + coilW + 40, centerY + 80);
    ctx.lineTo(width / 2 + 30, centerY + 80);
    ctx.stroke();

    // 5. Back EMF Vector Indicator (Lenz's Law)
    const isIncreasing = this.didt > 0;
    const isDecreasing = this.didt < 0;

    if (Math.abs(this.didt) > 1) {
      const arrowStartX = isIncreasing ? width / 2 + 60 : width / 2 - 60;
      const arrowEndX = isIncreasing ? width / 2 - 60 : width / 2 + 60;
      const emfY = centerY - coilH / 2 - 25;

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(arrowStartX, emfY);
      ctx.lineTo(arrowEndX, emfY);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      const dir = isIncreasing ? -1 : 1;
      ctx.moveTo(arrowEndX, emfY);
      ctx.lineTo(arrowEndX - dir * 10, emfY - 5);
      ctx.lineTo(arrowEndX - dir * 10, emfY + 5);
      ctx.fill();

      // Label Back EMF & Polarity
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(
        isIncreasing
          ? 'GGL Lawan (Back EMF) menentang dI/dt > 0'
          : 'GGL Induksi searah arus mempertahankan arus dI/dt < 0',
        width / 2,
        emfY - 10
      );

      // Battery analogy polarity signs
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.fillStyle = isIncreasing ? '#f43f5e' : '#10b981';
      ctx.fillText(isIncreasing ? '(+) a' : '(-) a', startX - 10, centerY - coilH/2 - 8);
      ctx.fillText(isIncreasing ? '(-) b' : '(+) b', startX + coilW + 10, centerY - coilH/2 - 8);
    }
  }
}

// =========================================================================
// 2. RL CIRCUIT DYNAMIC SIMULATION & REAL-TIME GRAPH
// =========================================================================
class RLCircuitSimulation {
  constructor(circuitCanvasId, graphCanvasId) {
    this.cCanvas = document.getElementById(circuitCanvasId);
    this.gCanvas = document.getElementById(graphCanvasId);
    if (!this.cCanvas || !this.gCanvas) return;

    this.cCtx = this.cCanvas.getContext('2d');
    this.gCtx = this.gCanvas.getContext('2d');

    this.emf = 12.0; // V
    this.R = 6.0;    // Ohm
    this.L = 0.030;  // 30 mH = 0.030 H
    this.state = 'a'; // 'a' (charge) or 'b' (decay)
    
    this.time = 0;
    this.currentI = 0;
    this.history = []; // { t, I, VR, VL }
    this.particles = [];
    this.initParticles();

    this.initControls();
    this.animate();
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 28; i++) {
      this.particles.push({
        pos: i / 28.0,
      });
    }
  }

  initControls() {
    const btnA = document.getElementById('btnSwitchA');
    const btnB = document.getElementById('btnSwitchB');
    const btnReset = document.getElementById('btnResetRL');

    const sEmf = document.getElementById('sliderEmfRL');
    const sR = document.getElementById('sliderRRL');
    const sL = document.getElementById('sliderLRL');

    if (btnA && btnB) {
      btnA.addEventListener('click', () => {
        this.state = 'a';
        btnA.className = 'px-2.5 py-1 text-xs rounded font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition';
        btnB.className = 'px-2.5 py-1 text-xs rounded font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition';
      });

      btnB.addEventListener('click', () => {
        this.state = 'b';
        btnB.className = 'px-2.5 py-1 text-xs rounded font-semibold bg-rose-600 hover:bg-rose-500 text-white transition';
        btnA.className = 'px-2.5 py-1 text-xs rounded font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition';
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.time = 0;
        this.currentI = 0;
        this.history = [];
      });
    }

    if (sEmf) {
      sEmf.addEventListener('input', (e) => {
        this.emf = parseFloat(e.target.value);
        document.getElementById('lblEmfRL').textContent = this.emf.toFixed(1) + ' V';
        this.updateStats();
      });
    }

    if (sR) {
      sR.addEventListener('input', (e) => {
        this.R = parseFloat(e.target.value);
        document.getElementById('lblRRL').textContent = this.R.toFixed(1) + ' Ω';
        this.updateStats();
      });
    }

    if (sL) {
      sL.addEventListener('input', (e) => {
        const mH = parseFloat(e.target.value);
        this.L = mH / 1000.0;
        document.getElementById('lblLRL').textContent = mH.toFixed(0) + ' mH';
        this.updateStats();
      });
    }

    this.updateStats();
  }

  updateStats() {
    const tau = (this.L / this.R) * 1000; // ms
    const Imax = this.emf / this.R;
    const vTau = document.getElementById('valTau');
    const vImax = document.getElementById('valImax');
    if (vTau) vTau.textContent = tau.toFixed(2) + ' ms';
    if (vImax) vImax.textContent = Imax.toFixed(2) + ' A';
  }

  animate() {
    this.updatePhysics();
    this.renderCircuit();
    this.renderGraph();
    requestAnimationFrame(() => this.animate());
  }

  updatePhysics() {
    const dt = 0.0002; // 0.2 ms per frame
    this.time += dt;

    const tau = this.L / this.R;
    const I0 = this.emf / this.R;

    if (this.state === 'a') {
      // Growth: I(t) = I0 * (1 - e^(-t/tau))
      this.currentI = I0 * (1 - Math.exp(-this.time / tau));
    } else {
      // Decay: I(t) = I_prev * e^(-t/tau)
      this.currentI = I0 * Math.exp(-this.time / tau);
    }

    const VR = this.currentI * this.R;
    const didt = (this.state === 'a') 
      ? (this.emf / this.L) * Math.exp(-this.time / tau)
      : -(I0 * this.R / this.L) * Math.exp(-this.time / tau);
    const VL = -this.L * didt;

    this.history.push({
      t: this.time * 1000, // in ms
      I: this.currentI,
      VR: VR,
      VL: Math.abs(VL),
    });

    if (this.history.length > 280) {
      this.history.shift();
    }

    // Update electron particles along circuit wire
    const speed = Math.max(0.001, (this.currentI / I0) * 0.015);
    for (let p of this.particles) {
      p.pos = (p.pos + speed) % 1.0;
    }
  }

  renderCircuit() {
    const ctx = this.cCtx;
    const w = this.cCanvas.width;
    const h = this.cCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Circuit coordinates
    const leftX = 80;
    const rightX = w - 80;
    const topY = 40;
    const botY = h - 40;
    const midX = (leftX + rightX) / 2;

    // Draw main loop wires
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;

    // Bottom wire with Resistor
    ctx.beginPath();
    ctx.moveTo(leftX, botY);
    ctx.lineTo(midX - 40, botY);
    ctx.stroke();

    // Resistor zigzag
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const rx = midX - 40;
    const rw = 80;
    ctx.moveTo(rx, botY);
    for (let i = 0; i < 6; i++) {
      const zx = rx + (i + 0.5) * (rw / 6);
      const zy = botY + (i % 2 === 0 ? -10 : 10);
      ctx.lineTo(zx, zy);
    }
    ctx.lineTo(rx + rw, botY);
    ctx.stroke();

    // Resistor label
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.fillText(`R = ${this.R.toFixed(1)} Ω`, midX - 25, botY + 26);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(midX + 40, botY);
    ctx.lineTo(rightX, botY);
    ctx.stroke();

    // Right wire with Inductor L
    ctx.beginPath();
    ctx.moveTo(rightX, botY);
    ctx.lineTo(rightX, (topY + botY) / 2 + 35);
    ctx.stroke();

    // Inductor Coils
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3.5;
    const indY = (topY + botY) / 2 - 35;
    const indH = 70;
    const loops = 4;
    for (let i = 0; i < loops; i++) {
      const ly = indY + i * (indH / loops);
      ctx.beginPath();
      ctx.arc(rightX, ly + (indH / loops) / 2, 12, -Math.PI / 2, Math.PI / 2, false);
      ctx.stroke();
    }

    // Inductor label
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.fillText(`L = ${(this.L * 1000).toFixed(0)} mH`, rightX - 65, (topY + botY) / 2 + 5);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rightX, indY);
    ctx.lineTo(rightX, topY);
    ctx.lineTo(midX, topY);
    ctx.stroke();

    // Middle branch (Decay position b)
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(midX, topY);
    ctx.lineTo(midX, botY);
    ctx.stroke();

    // Left wire with Battery (Charge position a)
    ctx.beginPath();
    ctx.moveTo(midX, topY);
    ctx.lineTo(leftX, topY);
    ctx.lineTo(leftX, botY);
    ctx.stroke();

    // Battery symbol on left
    const batY = (topY + botY) / 2;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(leftX - 15, batY - 20, 30, 40);
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 4;
    // Long plate (+)
    ctx.beginPath();
    ctx.moveTo(leftX - 16, batY - 10);
    ctx.lineTo(leftX + 16, batY - 10);
    ctx.stroke();
    // Short thick plate (-)
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(leftX - 8, batY + 10);
    ctx.lineTo(leftX + 8, batY + 10);
    ctx.stroke();
    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.fillText(`ε = ${this.emf.toFixed(0)}V`, leftX - 45, batY + 5);

    // Draw Switch Knife S
    const switchX = midX;
    const switchY = topY;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(switchX, switchY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Switch contact arm
    ctx.strokeStyle = this.state === 'a' ? '#38bdf8' : '#f43f5e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(switchX, switchY);
    if (this.state === 'a') {
      ctx.lineTo(switchX - 35, switchY - 15);
    } else {
      ctx.lineTo(switchX + 5, switchY + 25);
    }
    ctx.stroke();

    // Switch terminals
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText('a (Bat)', switchX - 45, switchY - 20);
    ctx.fillText('b (Decay)', switchX + 10, switchY + 30);

    // Incandescent Bulb on right loop to visually indicate current
    const bulbX = rightX;
    const bulbY = topY + 25;
    const brightness = Math.min(1.0, Math.pow(this.currentI / (this.emf / this.R), 2));
    
    // Glow aura
    if (brightness > 0.05) {
      const grad = ctx.createRadialGradient(bulbX, bulbY, 2, bulbX, bulbY, 25 * brightness);
      grad.addColorStop(0, `rgba(251, 191, 36, ${0.9 * brightness})`);
      grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 25 * brightness, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Bulb glass & filament
    ctx.fillStyle = brightness > 0.2 ? '#fef08a' : '#334155';
    ctx.beginPath();
    ctx.arc(bulbX, bulbY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Live Current Readout
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px JetBrains Mono';
    ctx.fillText(`I(t) = ${this.currentI.toFixed(3)} A`, w / 2 - 40, (topY + botY) / 2);
  }

  renderGraph() {
    const ctx = this.gCtx;
    const w = this.gCanvas.width;
    const h = this.gCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const padL = 45;
    const padR = 20;
    const padT = 25;
    const padB = 25;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // Draw Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x <= plotW; x += plotW / 6) {
      ctx.beginPath();
      ctx.moveTo(padL + x, padT);
      ctx.lineTo(padL + x, padT + plotH);
      ctx.stroke();
    }
    for (let y = 0; y <= plotH; y += plotH / 4) {
      ctx.beginPath();
      ctx.moveTo(padL, padT + y);
      ctx.lineTo(padL + plotW, padT + y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // 63.2% dashed benchmark line if charging
    if (this.state === 'a') {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.setLineDash([4, 4]);
      const y63 = padT + plotH - (plotH * 0.632);
      ctx.beginPath();
      ctx.moveTo(padL, y63);
      ctx.lineTo(padL + plotW, y63);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText('0.632 ε/R (τ)', padL + plotW - 75, y63 - 3);
    }

    if (this.history.length < 2) return;

    const maxI = Math.max(0.1, this.emf / this.R);

    // Plot Current I(t) in Cyan
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < this.history.length; i++) {
      const pt = this.history[i];
      const x = padL + (i / 280) * plotW;
      const y = padT + plotH - (pt.I / maxI) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Plot Voltage VR in Amber
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < this.history.length; i++) {
      const pt = this.history[i];
      const x = padL + (i / 280) * plotW;
      const y = padT + plotH - (pt.VR / this.emf) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText('0', padL - 15, padT + plotH + 3);
    ctx.fillText('I max', padL - 38, padT + 8);
    ctx.fillText('Waktu t →', padL + plotW - 50, padT + plotH + 18);
  }
}

// =========================================================================
// 3. MUTUAL INDUCTANCE & WIRELESS CHARGING SIMULATION
// =========================================================================
class MutualInductanceSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.distance = 1.5; // cm
    this.freq = 150;     // kHz
    this.animTime = 0;

    this.initControls();
    this.animate();
  }

  initControls() {
    const sDist = document.getElementById('sliderDist');
    const selF = document.getElementById('selFreqAC');

    if (sDist) {
      sDist.addEventListener('input', (e) => {
        this.distance = parseFloat(e.target.value);
        document.getElementById('lblDist').textContent = this.distance.toFixed(1) + ' cm';
        this.updateCoupling();
      });
    }

    if (selF) {
      selF.addEventListener('change', (e) => {
        this.freq = parseInt(e.target.value);
        this.updateCoupling();
      });
    }
    this.updateCoupling();
  }

  updateCoupling() {
    // Mutual inductance decreases rapidly with distance: M ~ 1 / (1 + d^2)
    const coupling = Math.max(0.05, 1.0 / (1 + Math.pow(this.distance / 1.8, 2)));
    const emfSec = 12.0 * coupling;

    const statusEl = document.getElementById('txtCouplingStatus');
    const valEmfEl = document.getElementById('valEmfSec');

    if (statusEl) {
      if (coupling > 0.6) {
        statusEl.textContent = 'Kopling Sangat Kuat';
        statusEl.className = 'text-[11px] font-mono text-emerald-400 font-bold';
      } else if (coupling > 0.25) {
        statusEl.textContent = 'Kopling Moderat';
        statusEl.className = 'text-[11px] font-mono text-cyan-400 font-bold';
      } else {
        statusEl.textContent = 'Kopling Lemah (Fluks Hilang)';
        statusEl.className = 'text-[11px] font-mono text-rose-400 font-bold';
      }
    }

    if (valEmfEl) {
      valEmfEl.textContent = `${emfSec.toFixed(2)} V (${coupling > 0.4 ? 'Lampu Terang' : 'Lampu Redup/Mati'})`;
    }
  }

  animate() {
    this.animTime += 0.05;
    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    const midY = h / 2;
    const primaryX = 120;
    // Distance mapped to canvas pixels: 1.5 cm -> 60px, 8.0 cm -> 220px
    const secondaryX = primaryX + 50 + this.distance * 24;

    // 1. Draw Primary Coil (Base Transmitter)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(primaryX - 35, midY - 60, 40, 120);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    for (let i = 0; i < 7; i++) {
      const y = midY - 45 + i * 15;
      ctx.beginPath();
      ctx.ellipse(primaryX - 15, y, 12, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 11px Plus Jakarta Sans';
    ctx.fillText('Koil 1 (Base)', primaryX - 45, midY + 75);

    // 2. Draw Secondary Coil (Receiver / Toothbrush)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(secondaryX - 5, midY - 60, 40, 120);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    for (let i = 0; i < 7; i++) {
      const y = midY - 45 + i * 15;
      ctx.beginPath();
      ctx.ellipse(secondaryX + 15, y, 12, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px Plus Jakarta Sans';
    ctx.fillText('Koil 2 (Beban)', secondaryX - 5, midY + 75);

    // 3. Draw Alternating Magnetic Flux Lines Φ12
    const coupling = Math.max(0.05, 1.0 / (1 + Math.pow(this.distance / 1.8, 2)));
    const wave = Math.sin(this.animTime * 4);
    
    ctx.strokeStyle = `rgba(168, 85, 247, ${0.3 + 0.6 * coupling * Math.abs(wave)})`;
    ctx.lineWidth = 2;
    for (let r = 20; r <= 80; r += 20) {
      ctx.beginPath();
      ctx.ellipse(primaryX - 15, midY, r + this.distance * 8, r * 0.7, 0, -Math.PI / 2, Math.PI / 2, false);
      ctx.stroke();
    }

    // 4. Load Bulb connected to Coil 2
    const bulbX = secondaryX + 80;
    const bulbY = midY;
    const brightness = coupling * Math.abs(wave);

    if (brightness > 0.05) {
      const grad = ctx.createRadialGradient(bulbX, bulbY, 2, bulbX, bulbY, 30 * brightness);
      grad.addColorStop(0, `rgba(16, 185, 129, ${0.9 * brightness})`);
      grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 30 * brightness, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bulb icon
    ctx.fillStyle = brightness > 0.2 ? '#6ee7b7' : '#334155';
    ctx.beginPath();
    ctx.arc(bulbX, bulbY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a7f3d0';
    ctx.stroke();

    // Wires from coil 2 to bulb
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(secondaryX + 35, midY - 40);
    ctx.lineTo(bulbX, midY - 40);
    ctx.lineTo(bulbX, bulbY - 10);
    ctx.moveTo(secondaryX + 35, midY + 40);
    ctx.lineTo(bulbX, midY + 40);
    ctx.lineTo(bulbX, bulbY + 10);
    ctx.stroke();
  }
}

// =========================================================================
// 4. LC OSCILLATIONS & SPRING-MASS MECHANICAL ANALOGY (DUAL SPLIT)
// =========================================================================
class LCOscillationSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.L = 0.00281; // 2.81 mH
    this.C = 9.0e-6;  // 9.0 uF
    this.omega = 1.0 / Math.sqrt(this.L * this.C);
    this.Qmax = 1.0;
    
    this.time = 0;
    this.isRunning = true;

    this.initControls();
    this.animate();
  }

  initControls() {
    const btnPlay = document.getElementById('btnPlayPauseLC');
    const btnReset = document.getElementById('btnResetLC');
    const sL = document.getElementById('sliderL_LC');
    const sC = document.getElementById('sliderC_LC');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        this.isRunning = !this.isRunning;
        const icon = document.getElementById('iconPlayPauseLC');
        const text = document.getElementById('textPlayPauseLC');
        if (this.isRunning) {
          text.textContent = 'Pause';
          if (icon) icon.setAttribute('data-lucide', 'pause');
        } else {
          text.textContent = 'Play';
          if (icon) icon.setAttribute('data-lucide', 'play');
        }
        if (window.lucide) lucide.createIcons();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.time = 0;
      });
    }

    if (sL) {
      sL.addEventListener('input', (e) => {
        const mH = parseFloat(e.target.value);
        this.L = mH / 1000.0;
        document.getElementById('lblL_LC').textContent = mH.toFixed(2) + ' mH';
        this.updateFreq();
      });
    }

    if (sC) {
      sC.addEventListener('input', (e) => {
        const uF = parseFloat(e.target.value);
        this.C = uF * 1e-6;
        document.getElementById('lblC_LC').textContent = uF.toFixed(1) + ' µF';
        this.updateFreq();
      });
    }

    this.updateFreq();
  }

  updateFreq() {
    this.omega = 1.0 / Math.sqrt(this.L * this.C);
    const f = this.omega / (2 * Math.PI);
    const el = document.getElementById('lblFreqLC');
    if (el) {
      if (f > 1000) {
        el.textContent = (f / 1000).toFixed(2) + ' kHz';
      } else {
        el.textContent = f.toFixed(0) + ' Hz';
      }
    }
  }

  animate() {
    if (this.isRunning) {
      this.time += 0.04;
      this.render();
      this.updateEnergyBars();
    }
    requestAnimationFrame(() => this.animate());
  }

  updateEnergyBars() {
    // LC Circuit
    const Q = this.Qmax * Math.cos(this.time);
    const I = -this.Qmax * Math.sin(this.time);

    // Energy proportions
    const Uc = Math.pow(Math.cos(this.time), 2);
    const Ul = Math.pow(Math.sin(this.time), 2);

    const bUc = document.getElementById('barUc');
    const bUl = document.getElementById('barUl');
    if (bUc && bUl) {
      bUc.style.width = (Uc * 100).toFixed(1) + '%';
      bUl.style.width = (Ul * 100).toFixed(1) + '%';
    }

    // Spring Mechanical Analogy
    // Up = 1/2 k x^2 (proportional to cos^2)
    // Ek = 1/2 m v^2 (proportional to sin^2)
    const bUp = document.getElementById('barUp');
    const bEk = document.getElementById('barEk');
    if (bUp && bEk) {
      bUp.style.width = (Uc * 100).toFixed(1) + '%';
      bEk.style.width = (Ul * 100).toFixed(1) + '%';
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    const halfW = w / 2;

    // Divider line between Electrical (Left) and Mechanical (Right)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(halfW, 10);
    ctx.lineTo(halfW, h - 10);
    ctx.stroke();

    // Headers
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px Plus Jakarta Sans';
    ctx.fillText('⚡ SIKLUS RANGKAIAN ELEKTRIK LC', 30, 25);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px Plus Jakarta Sans';
    ctx.fillText('⚙️ ANALOGI MEKANIK: PEGAS-MASSA', halfW + 30, 25);

    // Physics state
    const phase = this.time;
    const Q = Math.cos(phase);
    const I = -Math.sin(phase);

    // ============================================
    // LEFT: LC Circuit Render
    // ============================================
    const capX = 100;
    const indX = 260;
    const topY = 70;
    const botY = 220;

    // Connecting wires
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(capX, topY);
    ctx.lineTo(indX, topY);
    ctx.lineTo(indX, botY);
    ctx.lineTo(capX, botY);
    ctx.lineTo(capX, topY);
    ctx.stroke();

    // Capacitor Plates (Horizontal plates)
    const plateW = 50;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(capX - plateW/2, (topY + botY)/2 - 25, plateW, 50);

    // Top plate
    ctx.fillStyle = Q > 0 ? '#38bdf8' : '#f43f5e';
    ctx.fillRect(capX - plateW/2, (topY + botY)/2 - 18, plateW, 6);
    // Bottom plate
    ctx.fillStyle = Q > 0 ? '#f43f5e' : '#38bdf8';
    ctx.fillRect(capX - plateW/2, (topY + botY)/2 + 12, plateW, 6);

    // Charge signs on plates (+ / -)
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.fillStyle = '#ffffff';
    const numSigns = Math.min(4, Math.floor(Math.abs(Q) * 4));
    for (let i = 0; i < numSigns; i++) {
      const sx = capX - plateW/2 + 8 + i * 11;
      ctx.fillText(Q > 0 ? '+' : '–', sx, (topY + botY)/2 - 22);
      ctx.fillText(Q > 0 ? '–' : '+', sx, (topY + botY)/2 + 28);
    }

    // E-field arrows between capacitor plates
    if (Math.abs(Q) > 0.15) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        const ex = capX - 15 + i * 15;
        ctx.beginPath();
        if (Q > 0) {
          ctx.moveTo(ex, (topY + botY)/2 - 10);
          ctx.lineTo(ex, (topY + botY)/2 + 10);
        } else {
          ctx.moveTo(ex, (topY + botY)/2 + 10);
          ctx.lineTo(ex, (topY + botY)/2 - 10);
        }
        ctx.stroke();
      }
    }

    // Inductor Coils on Right Wire
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    const lY = (topY + botY) / 2 - 30;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(indX, lY + i * 15 + 7.5, 10, -Math.PI/2, Math.PI/2, false);
      ctx.stroke();
    }

    // Magnetic Field B in Inductor if current flows
    if (Math.abs(I) > 0.15) {
      ctx.strokeStyle = `rgba(168, 85, 247, ${Math.abs(I)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(indX, (topY + botY)/2 - 35);
      ctx.lineTo(indX, (topY + botY)/2 + 35);
      ctx.stroke();
    }

    // Status readout below circuit
    ctx.font = '11px JetBrains Mono';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`Muatan Q: ${Q.toFixed(2)} Qmax`, 60, h - 25);
    ctx.fillText(`Arus I: ${I.toFixed(2)} Imax`, 200, h - 25);

    // ============================================
    // RIGHT: Spring-Mass Oscillator
    // ============================================
    const wallX = halfW + 40;
    const springY = (topY + botY) / 2;
    const blockMass = 35;
    
    // Equilibrium center
    const xEq = halfW + 180;
    // Position x = A * cos(phase)
    const amplitude = 55;
    const currentX = xEq + amplitude * Q;

    // Draw rigid wall
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(wallX, springY - 40);
    ctx.lineTo(wallX, springY + 40);
    ctx.stroke();

    // Floor
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wallX, springY + 30);
    ctx.lineTo(w - 20, springY + 30);
    ctx.stroke();

    // Draw Spring zig-zag
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(wallX, springY);
    const coils = 12;
    const totalDist = currentX - wallX;
    for (let i = 0; i < coils; i++) {
      const zx = wallX + (i + 0.5) * (totalDist / coils);
      const zy = springY + (i % 2 === 0 ? -12 : 12);
      ctx.lineTo(zx, zy);
    }
    ctx.lineTo(currentX, springY);
    ctx.stroke();

    // Draw Block m
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(currentX, springY - 20, blockMass, 40);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(currentX, springY - 20, blockMass, 40);

    // Block label
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px JetBrains Mono';
    ctx.fillText('m (L)', currentX + 4, springY + 4);

    // Velocity vector arrow v
    if (Math.abs(I) > 0.1) {
      const vLen = I * 30; // v proportional to current
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(currentX + blockMass / 2, springY - 30);
      ctx.lineTo(currentX + blockMass / 2 + vLen, springY - 30);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      const s = vLen > 0 ? 1 : -1;
      ctx.moveTo(currentX + blockMass / 2 + vLen, springY - 30);
      ctx.lineTo(currentX + blockMass / 2 + vLen - s * 5, springY - 34);
      ctx.lineTo(currentX + blockMass / 2 + vLen - s * 5, springY - 26);
      ctx.fill();

      ctx.fillStyle = '#f472b6';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('v ~ I', currentX + blockMass / 2 - 10, springY - 40);
    }

    // Status readout below spring
    ctx.font = '11px JetBrains Mono';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`Posisi x: ${Q.toFixed(2)} A`, halfW + 60, h - 25);
    ctx.fillText(`Kecepatan v: ${I.toFixed(2)} vmax`, halfW + 200, h - 25);
  }
}

// =========================================================================
// 5. RLC DAMPED OSCILLATIONS (DIGITAL OSCILLOSCOPE)
// =========================================================================
class RLCOscilloscopeSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.R = 10.0;    // Ohm
    this.L = 0.0025;  // 2.5 mH
    this.C = 2.0e-6;  // 2.0 uF
    this.timeOffset = 0;

    this.initControls();
    this.animate();
  }

  initControls() {
    const sR = document.getElementById('sliderR_RLC');
    const sL = document.getElementById('sliderL_RLC');
    const sC = document.getElementById('sliderC_RLC');

    const btnUnder = document.getElementById('btnPresetUnder');
    const btnCrit = document.getElementById('btnPresetCrit');
    const btnOver = document.getElementById('btnPresetOver');

    if (sR) {
      sR.addEventListener('input', (e) => {
        this.R = parseFloat(e.target.value);
        document.getElementById('lblR_RLC').textContent = this.R.toFixed(1) + ' Ω';
        this.updateState();
      });
    }

    if (sL) {
      sL.addEventListener('input', (e) => {
        const mH = parseFloat(e.target.value);
        this.L = mH / 1000.0;
        document.getElementById('lblL_RLC').textContent = mH.toFixed(1) + ' mH';
        this.updateState();
      });
    }

    if (sC) {
      sC.addEventListener('input', (e) => {
        const uF = parseFloat(e.target.value);
        this.C = uF * 1e-6;
        document.getElementById('lblC_RLC').textContent = uF.toFixed(1) + ' µF';
        this.updateState();
      });
    }

    // Presets
    if (btnUnder) {
      btnUnder.addEventListener('click', () => {
        this.R = 10.0;
        if (sR) sR.value = 10;
        document.getElementById('lblR_RLC').textContent = '10.0 Ω';
        this.updateState();
      });
    }

    if (btnCrit) {
      btnCrit.addEventListener('click', () => {
        const Rc = Math.sqrt((4 * this.L) / this.C);
        this.R = Math.round(Rc);
        if (sR) sR.value = this.R;
        document.getElementById('lblR_RLC').textContent = this.R.toFixed(1) + ' Ω';
        this.updateState();
      });
    }

    if (btnOver) {
      btnOver.addEventListener('click', () => {
        const Rc = Math.sqrt((4 * this.L) / this.C);
        this.R = Math.min(150, Math.round(Rc * 1.8));
        if (sR) sR.value = this.R;
        document.getElementById('lblR_RLC').textContent = this.R.toFixed(1) + ' Ω';
        this.updateState();
      });
    }

    this.updateState();
  }

  updateState() {
    // Critical resistance Rc = sqrt(4L/C)
    const Rc = Math.sqrt((4 * this.L) / this.C);
    const gamma = this.R / (2 * this.L);
    const omega0 = 1.0 / Math.sqrt(this.L * this.C);

    const modeEl = document.getElementById('scopeMode');
    const rcEl = document.getElementById('scopeRc');
    const wdEl = document.getElementById('scopeWd');

    if (rcEl) rcEl.textContent = Rc.toFixed(1) + ' Ω';

    if (this.R < Rc * 0.98) {
      // Underdamped
      const wd = Math.sqrt(Math.pow(omega0, 2) - Math.pow(gamma, 2));
      if (modeEl) {
        modeEl.textContent = 'Underdamped (Teredam Kurang)';
        modeEl.className = 'text-cyan-400 font-bold';
      }
      if (wdEl) wdEl.textContent = wd.toFixed(0) + ' rad/s';
    } else if (Math.abs(this.R - Rc) <= Rc * 0.04) {
      // Critically Damped
      if (modeEl) {
        modeEl.textContent = 'Critically Damped (Kritis)';
        modeEl.className = 'text-emerald-400 font-bold';
      }
      if (wdEl) wdEl.textContent = '0 (Non-Osilasi Tercepat)';
    } else {
      // Overdamped
      if (modeEl) {
        modeEl.textContent = 'Overdamped (Teredam Lebih)';
        modeEl.className = 'text-rose-400 font-bold';
      }
      if (wdEl) wdEl.textContent = 'Non-Osilasi (Peluruhan Lambat)';
    }
  }

  animate() {
    this.timeOffset += 0.01;
    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Oscilloscope Grid Lines (Phosphor green/cyan grid)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.lineWidth = 1;

    const divSize = 25;
    for (let x = 0; x <= w; x += divSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += divSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Center Crosshair Axis
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    // 2. Calculate waveform points
    const Rc = Math.sqrt((4 * this.L) / this.C);
    const gamma = this.R / (2 * this.L);
    const omega0 = 1.0 / Math.sqrt(this.L * this.C);

    const ampMax = h * 0.38;
    const tSpan = 0.005; // 5 milliseconds across scope

    // Draw Envelope curves (± e^(-gamma*t)) in dashed magenta if underdamped
    if (this.R < Rc) {
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.5;

      // Positive envelope
      ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const t = (x / w) * tSpan;
        const env = Math.exp(-gamma * t);
        const y = h / 2 - env * ampMax;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Negative envelope
      ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const t = (x / w) * tSpan;
        const env = Math.exp(-gamma * t);
        const y = h / 2 + env * ampMax;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Main Oscilloscope Waveform Q(t) in Glowing Cyan/Green
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.beginPath();

    for (let x = 0; x < w; x += 2) {
      const t = (x / w) * tSpan;
      let val = 0;

      if (this.R < Rc) {
        // Underdamped
        const wd = Math.sqrt(Math.pow(omega0, 2) - Math.pow(gamma, 2));
        val = Math.exp(-gamma * t) * Math.cos(wd * t);
      } else if (Math.abs(this.R - Rc) <= Rc * 0.02) {
        // Critically Damped: Q(t) = Q0 * (1 + gamma * t) * e^(-gamma*t)
        val = (1.0 + gamma * t) * Math.exp(-gamma * t);
      } else {
        // Overdamped: Q(t) = Q0/(2*beta) * ((gamma+beta)*e^(-(gamma-beta)*t) - ...)
        const beta = Math.sqrt(Math.pow(gamma, 2) - Math.pow(omega0, 2));
        val = (Math.exp(-(gamma - beta) * t) + Math.exp(-(gamma + beta) * t)) / 2.0;
      }

      const y = h / 2 - val * ampMax;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // reset glow
  }
}

// Instantiate simulations on window load
window.addEventListener('DOMContentLoaded', () => {
  new SolenoidSimulation('solenoidCanvas');
  new RLCircuitSimulation('rlCircuitCanvas', 'rlGraphCanvas');
  new MutualInductanceSimulation('mutualCanvas');
  new LCOscillationSimulation('lcDualCanvas');
  new RLCOscilloscopeSimulation('rlcScopeCanvas');
});
