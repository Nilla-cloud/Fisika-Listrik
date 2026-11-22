/**
 * app.js
 * Main UI Controller, Tab Management, Interactive Quick Quizzes & Physics Calculators
 */

// Global Switch Tab function
function switchTab(tabId) {
  // Hide all tab contents
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(el => el.classList.add('hidden'));

  // Show target tab
  const target = document.getElementById(tabId);
  if (target) {
    target.classList.remove('hidden');
  }

  // Update button active state
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Re-render KaTeX if available
  if (window.renderMathInElement && target) {
    renderMathInElement(target, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false }
      ]
    });
  }

  // Re-create lucide icons if any
  if (window.lucide) {
    lucide.createIcons();
  }

  // Scroll to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================================================================
// QUICK QUIZ DATA FROM SERWAY CHAPTER 32
// =========================================================================
const QUIZ_DATA = [
  {
    id: 'qq-32-1',
    title: 'Quick Quiz 32.1: Beda Potensial & Arah Arus pada Koil',
    question: `Sebuah koil dengan resistansi nol memiliki ujung yang diberi label $a$ dan $b$. Potensial listrik pada titik $a$ lebih tinggi daripada titik $b$ ($V_a > V_b$). Manakah dari situasi berikut yang konsisten dengan kondisi tersebut?`,
    options: [
      { id: 'a', text: '(a) Arus bernilai konstan dan mengalir dari a ke b' },
      { id: 'b', text: '(b) Arus bernilai konstan dan mengalir dari b ke a' },
      { id: 'c', text: '(c) Arus meningkat terhadap waktu dan mengalir dari a ke b', correct: true },
      { id: 'd', text: '(d) Arus menurun terhadap waktu dan mengalir dari a ke b' },
      { id: 'e', text: '(e) Arus meningkat terhadap waktu dan mengalir dari b ke a' },
      { id: 'f', text: '(f) Arus menurun terhadap waktu dan mengalir dari b ke a', correct: true }
    ],
    explanation: `<strong>Jawaban Benar: (c) dan (f)</strong><br>
    Untuk arus konstan, $dI/dt = 0$, sehingga tidak ada GGL induksi pada induktor tanpa hambatan ($V_a = V_b$).<br>
    • Pada opsi <strong>(c)</strong>: Arus mengalir dari $a$ ke $b$ dan meningkat ($dI/dt > 0$). Koil menghasilkan GGL lawan yang menentang pertambahan ini, mengarahkan kutub positif ke $a$, sehingga potensial $a$ lebih tinggi daripada $b$.<br>
    • Pada opsi <strong>(f)</strong>: Arus mengalir dari $b$ ke $a$ dan menurun ($dI/dt < 0$). Koil berusaha mempertahankan arus dengan menginduksi GGL searah arus (menuju ke $a$), sehingga ujung $a$ menjadi kutub positif berpotensial lebih tinggi.`
  },
  {
    id: 'qq-32-2',
    title: 'Quick Quiz 32.2: Tegangan Sesaat vs Waktu Lama pada Rangkaian RL',
    question: `Rangkaian pada Gambar 32.8 terdiri dari resistor, induktor, dan baterai ideal. Tepat sesaat setelah sakelar ditutup ($t = 0^+$), pada elemen manakah beda potensialnya sama dengan GGL baterai? Lalu setelah waktu yang sangat lama ($t \\to \\infty$), pada elemen manakah tegangannya sama dengan GGL baterai?`,
    options: [
      { id: 'a', text: 'Tepat saat ditutup: Resistor; Setelah waktu lama: Induktor' },
      { id: 'b', text: 'Tepat saat ditutup: Induktor; Setelah waktu lama: Resistor', correct: true },
      { id: 'c', text: 'Keduanya sama-sama membagi tegangan secara merata di kedua kondisi' },
      { id: 'd', text: 'Resistor pada kedua kondisi waktu' }
    ],
    explanation: `<strong>Jawaban Benar: Induktor pada $t = 0^+$, dan Resistor pada $t \\to \\infty$</strong><br>
    • Pada $t = 0^+$, arus belum sempat mengalir ($I = 0$). Karena $I = 0$, maka drop tegangan resistor $\\Delta V_R = IR = 0$. Oleh karena itu seluruh tegangan baterai muncul pada induktor sebagai GGL lawan: $\\Delta V_L = \\varepsilon$.<br>
    • Pada $t \\to \\infty$, arus telah mencapai nilai tunak konstan ($I = \\varepsilon/R$) sehingga $dI/dt = 0$. Akibatnya $\\Delta V_L = 0$ dan seluruh tegangan baterai jatuh pada resistor: $\\Delta V_R = IR = \\varepsilon$.`
  },
  {
    id: 'qq-32-3',
    title: 'Quick Quiz 32.3: Memasukkan Batang Besi ke Dalam Solenoida Ber-AC',
    question: `Sebuah rangkaian sumber AC dihubungkan ke solenoida berinti udara dan sebuah bohlam lampu yang menyala stabil. Sebuah batang besi lunak kemudian dimasukkan ke dalam solenoida. Apa yang terjadi pada kecerahan nyala lampu?`,
    options: [
      { id: 'a', text: '(a) Kecerahan lampu meningkat' },
      { id: 'b', text: '(b) Kecerahan lampu menurun (semakin redup)', correct: true },
      { id: 'c', text: '(c) Kecerahan lampu tidak terpengaruh' }
    ],
    explanation: `<strong>Jawaban Benar: (b) Menurun (semakin redup)</strong><br>
    Ketika batang besi dimasukkan ke dalam solenoida, permeabilitas magnetik meningkat drastis (hingga ratusan kali $\\mu_0$), sehingga induktansi diri $L$ membesar secara signifikan. Peningkatan $L$ memperbesar reaktansi induktif ($X_L = \\omega L$) dan menghasilkan GGL lawan yang lebih besar, sehingga arus yang mengalir ke lampu berkurang drastis dan lampu menjadi redup.`
  },
  {
    id: 'qq-32-4',
    title: 'Quick Quiz 32.4: Membandingkan Konstanta Waktu Rangkaian A dan B',
    question: `Dua rangkaian RL identik memiliki nilai induktansi $L_A$ dan $L_B$. Sakelar dinyalakan lalu dimatikan pada $t = 10\\text{ s}$. Kurva grafik menunjukkan bahwa arus pada Rangkaian B membutuhkan waktu lebih lama untuk naik ke maksimum dan lebih lama meluruh ke nol dibanding Rangkaian A. Manakah pernyataan yang benar?`,
    options: [
      { id: 'a', text: '(a) LA > LB' },
      { id: 'b', text: '(b) LA < LB (Induktansi B lebih besar)', correct: true },
      { id: 'c', text: '(c) Informasi tidak cukup' }
    ],
    explanation: `<strong>Jawaban Benar: (b) $L_A < L_B$</strong><br>
    Konstanta waktu didefinisikan sebagai $\\tau = L/R$. Karena nilai resistansi kedua rangkaian identik ($R_A = R_B$), maka rangkaian yang memiliki respons lebih lambat (arus naik/turun lebih lamban) memiliki konstanta waktu $\\tau$ yang lebih besar. Dari grafik terlihat $\\tau_B > \\tau_A$, yang membuktikan bahwa $L_B > L_A$.`
  },
  {
    id: 'qq-32-5',
    title: 'Quick Quiz 32.5: Memaksimalkan Rapat Energi Magnetik Solenoida',
    question: `Anda ingin memperoleh rapat energi medan magnet ($u_B$) setinggi mungkin di dalam solenoida. Manakah tindakan berikut yang akan menaikkan nilai rapat energi? (Pilihan bisa lebih dari satu)`,
    options: [
      { id: 'a', text: '(a) Menambah jumlah lilitan per satuan panjang (n)', correct: true },
      { id: 'b', text: '(b) Memperbesar luas penampang solenoida (A)' },
      { id: 'c', text: '(c) Memperpanjang panjang solenoida saja dengan n tetap' },
      { id: 'd', text: '(d) Meningkatkan arus listrik (I) yang mengalir', correct: true }
    ],
    explanation: `<strong>Jawaban Benar: (a) dan (d)</strong><br>
    Rapat energi magnetik diberikan oleh $u_B = \\frac{B^2}{2\\mu_0}$. Untuk solenoida ideal, medan magnet di dalamnya adalah $B = \\mu_0 n I$. Oleh karena itu $u_B = \\frac{1}{2}\\mu_0 n^2 I^2$. Rapat energi hanya bergantung kuadratik pada kerapatan lilitan $n$ dan kuat arus $I$, dan tidak dipengaruhi oleh luas penampang $A$ maupun panjang solenoida jika $n$ konstan.`
  },
  {
    id: 'qq-32-6',
    title: 'Quick Quiz 32.6: Jarak Antar Koil pada Induktansi Silang',
    question: `Pada Gambar 32.14, Koil 1 digerakkan mendekati Koil 2 dengan orientasi sumbu yang tetap. Akibat pergerakan ini, nilai induktansi silang ($M$) antara kedua koil akan:`,
    options: [
      { id: 'a', text: '(a) Meningkat', correct: true },
      { id: 'b', text: '(b) Menurun' },
      { id: 'c', text: '(c) Tidak terpengaruh' }
    ],
    explanation: `<strong>Jawaban Benar: (a) Meningkat</strong><br>
    Induktansi silang bergantung pada seberapa banyak garis-garis fluks magnetik dari koil primer yang memotong/menembus koil sekunder ($M = \\frac{N_2 \\Phi_{12}}{I_1}$). Ketika jarak kedua koil diperpendek, kerapatan fluks bersama semakin besar, sehingga nilai $M$ meningkat.`
  },
  {
    id: 'qq-32-7',
    title: 'Quick Quiz 32.7: Kondisi Tegangan Saat Arus Maksimum pada Rangkaian LC',
    question: `Pada suatu saat selama osilasi rangkaian LC, arus berada pada nilai maksimumnya ($I = I_{\\max}$). Pada saat tersebut, tegangan pada kapasitor bernilai:`,
    options: [
      { id: 'a', text: '(a) Berbeda dengan tegangan pada induktor' },
      { id: 'b', text: '(b) Nol (0 Volt)', correct: true },
      { id: 'c', text: '(c) Memiliki nilai maksimum' },
      { id: 'd', text: '(d) Tidak dapat ditentukan' }
    ],
    explanation: `<strong>Jawaban Benar: (b) Nol</strong><br>
    Ketika arus mencapai nilai maksimum, seluruh energi rangkaian tersimpan sebagai energi magnetik pada induktor ($U_L = \\frac{1}{2}LI_{\\max}^2$). Oleh karena itu energi pada kapasitor harus nol ($U_C = 0$), yang berarti muatan $Q = 0$ dan beda potensial kapasitor $\\Delta V_C = Q/C = 0$.`
  },
  {
    id: 'qq-32-8',
    title: 'Quick Quiz 32.8: Kondisi Tegangan Saat Arus Nol pada Rangkaian LC',
    question: `Pada saat arus sesaat pada rangkaian LC bernilai nol ($I = 0$), berapakah tegangan pada kapasitor?`,
    options: [
      { id: 'a', text: '(a) Berbeda dengan tegangan pada induktor' },
      { id: 'b', text: '(b) Nol' },
      { id: 'c', text: '(c) Memiliki nilai maksimum', correct: true },
      { id: 'd', text: '(d) Tidak dapat ditentukan' }
    ],
    explanation: `<strong>Jawaban Benar: (c) Memiliki nilai maksimum</strong><br>
    Ketika arus berhenti sesaat ($I = 0$), energi magnetik di induktor bernilai nol. Seluruh energi berpindah ke medan listrik kapasitor ($U = \\frac{Q_{\\max}^2}{2C}$), sehingga muatan kapasitor dan tegangannya mencapai nilai maksimum ($\\Delta V_{C,\\max} = Q_{\\max}/C$). Pada saat ini muatan siap berbalik arah.`
  }
];

// Initialize Quick Quiz Cards
function initQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  container.innerHTML = '';

  QUIZ_DATA.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3';
    card.id = item.id;

    let optionsHtml = '';
    item.options.forEach((opt, optIdx) => {
      optionsHtml += `
        <button onclick="checkAnswer('${item.id}', '${opt.id}', ${!!opt.correct})" 
          class="quiz-opt-btn w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 transition text-xs text-slate-300 flex items-center justify-between group">
          <span>${opt.text}</span>
          <span class="status-icon w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]"></span>
        </button>
      `;
    });

    card.innerHTML = `
      <div class="flex items-center justify-between border-b border-slate-800/60 pb-2">
        <h3 class="font-bold text-white text-sm flex items-center gap-2">
          <span class="w-5 h-5 rounded-md bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold">${index + 1}</span>
          ${item.title}
        </h3>
        <span class="text-[11px] font-mono text-slate-500">Serway Bab 32</span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed">${item.question}</p>
      <div class="space-y-2 pt-1" id="opts-${item.id}">
        ${optionsHtml}
      </div>
      <div id="exp-${item.id}" class="hidden p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 leading-relaxed mt-3">
        ${item.explanation}
      </div>
    `;

    container.appendChild(card);
  });
}

function checkAnswer(quizId, optId, isCorrect) {
  const optsContainer = document.getElementById(`opts-${quizId}`);
  const expContainer = document.getElementById(`exp-${quizId}`);
  if (!optsContainer || !expContainer) return;

  const buttons = optsContainer.querySelectorAll('.quiz-opt-btn');
  buttons.forEach(btn => {
    btn.classList.remove('border-emerald-500', 'bg-emerald-950/30', 'border-rose-500', 'bg-rose-950/30');
  });

  const clickedBtn = event.currentTarget;
  if (isCorrect) {
    clickedBtn.classList.add('border-emerald-500', 'bg-emerald-950/40', 'text-emerald-300');
    clickedBtn.querySelector('.status-icon').innerHTML = '✓';
    clickedBtn.querySelector('.status-icon').className = 'status-icon w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold';
  } else {
    clickedBtn.classList.add('border-rose-500', 'bg-rose-950/40', 'text-rose-300');
    clickedBtn.querySelector('.status-icon').innerHTML = '✗';
    clickedBtn.querySelector('.status-icon').className = 'status-icon w-4 h-4 rounded-full bg-rose-500 text-slate-950 flex items-center justify-center text-[10px] font-bold';
  }

  expContainer.classList.remove('hidden');

  // Trigger KaTeX for explanation if needed
  if (window.renderMathInElement) {
    renderMathInElement(expContainer, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ]
    });
  }
}

// =========================================================================
// PHYSICS CALCULATORS
// =========================================================================

// 1. Solenoid Calculator
function calculateSolenoid() {
  const N = parseFloat(document.getElementById('calcSolN').value);
  const lenCm = parseFloat(document.getElementById('calcSolLen').value);
  const areaCm2 = parseFloat(document.getElementById('calcSolArea').value);
  const km = parseFloat(document.getElementById('calcSolMu').value) || 1.0;

  const lenM = lenCm / 100.0;
  const areaM2 = areaCm2 * 1e-4;
  const mu = km * (4 * Math.PI * 1e-7);

  // L = mu * N^2 * A / ell
  const L = (mu * Math.pow(N, 2) * areaM2) / lenM;

  const resEl = document.getElementById('resSol');
  if (L < 0.001) {
    resEl.innerHTML = `L = ${(L * 1000).toFixed(3)} mH (${(L * 1e6).toFixed(1)} µH)`;
  } else if (L < 1) {
    resEl.innerHTML = `L = ${(L * 1000).toFixed(3)} mH (${L.toExponential(3)} H)`;
  } else {
    resEl.innerHTML = `L = ${L.toFixed(3)} H`;
  }
}

// 2. RL Circuit Calculator
function calculateRL() {
  const emf = parseFloat(document.getElementById('calcRLEmf').value);
  const R = parseFloat(document.getElementById('calcRLR').value);
  const LmH = parseFloat(document.getElementById('calcRLL').value);
  const tMs = parseFloat(document.getElementById('calcRLt').value);

  const L = LmH / 1000.0;
  const t = tMs / 1000.0;

  const tau = L / R;
  const Imax = emf / R;
  const I = Imax * (1 - Math.exp(-t / tau));

  const resEl = document.getElementById('resRL');
  resEl.innerHTML = `
    <div>Konstanta Waktu (τ): <strong>${(tau * 1000).toFixed(2)} ms</strong></div>
    <div>Arus Maksimum (I_max = ε/R): <strong>${Imax.toFixed(3)} A</strong></div>
    <div class="text-amber-400 font-bold mt-1">Arus pada t = ${tMs} ms: I(t) = ${I.toFixed(3)} A (${((I / Imax) * 100).toFixed(1)}% dari I_max)</div>
  `;
}

// 3. LC Resonant Frequency Calculator
function calculateLCOsc() {
  const LmH = parseFloat(document.getElementById('calcLCOscL').value);
  const Cpf = parseFloat(document.getElementById('calcLCOscC').value);

  const L = LmH / 1000.0;
  const C = Cpf * 1e-12;

  const omega0 = 1.0 / Math.sqrt(L * C);
  const f0 = omega0 / (2 * Math.PI);
  const Rc = Math.sqrt((4 * L) / C);

  const resEl = document.getElementById('resLCOsc');
  resEl.innerHTML = `
    <div>Frekuensi Sudut (ω0 = 1/√LC): <strong>${omega0.toExponential(3)} rad/s</strong></div>
    <div class="text-emerald-400 font-bold">Frekuensi Resonansi (f0): ${(f0 / 1e6).toFixed(3)} MHz (${f0.toExponential(3)} Hz)</div>
    <div class="text-slate-400 text-[11px] mt-1">Resistansi Redaman Kritis (Rc = √4L/C): <strong>${(Rc / 1000).toFixed(2)} kΩ</strong> (${Rc.toFixed(1)} Ω)</div>
  `;
}

// 4. Energy Density Calculator
function calculateEnergyDensity() {
  const bVal = parseFloat(document.getElementById('calcEnergyB').value);
  const unit = parseFloat(document.getElementById('calcEnergyBUnit').value);
  const B = bVal * unit; // in Tesla

  const mu0 = 4 * Math.PI * 1e-7;
  const uB = Math.pow(B, 2) / (2 * mu0);

  const resEl = document.getElementById('resEnergy');
  resEl.innerHTML = `Rapat Energi Magnetik u_B = ${uB.toExponential(3)} J/m³`;
}

// =========================================================================
// EVENT LISTENERS & SETUP
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Setup tab buttons
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      if (targetId) switchTab(targetId);
    });
  });

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
    });
  }

  // Initialize Quick Quizzes
  initQuiz();

  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Initial KaTeX Render
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false }
      ]
    });
  }
});
