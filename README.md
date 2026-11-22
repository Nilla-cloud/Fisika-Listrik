# Laboratorium Interaktif Fisika: Induktansi & Rangkaian RLC (Bab 32)

Aplikasi web edukasi interaktif komprehensif berdasarkan materi **Chapter 32: Inductance** dari buku *Physics for Scientists and Engineers* karya Serway & Jewett (Edisi 6).

---

## 🌟 Fitur Utama & Modul Pembelajaran

Website ini dirancang dengan antarmuka modern bernuansa *Sci-Fi Physics Lab* (Dark Slate, Cyan, Amber, dan Emerald) yang dilengkapi dengan:

1. **32.1 Induktansi Diri (Self-Inductance) & GGL Lawan (Back EMF)**
   - Rangkuman konsep fluks magnetik, Hukum Faraday, dan Hukum Lenz.
   - **Simulasi Interaktif Solenoida**: Mengatur jumlah lilitan ($N$), panjang kawat ($\ell$), radius ($r$), dan laju perubahan arus ($dI/dt$).
   - Fitur sakelar inti besi lunak ($\kappa_m = 500$) yang mendemonstrasikan pelipatgandaan induktansi secara langsung.

2. **32.2 Rangkaian RL (Resistor-Induktor)**
   - Persamaan diferensial Kirchhoff loop: $\varepsilon - IR - L \frac{dI}{dt} = 0$.
   - Penurunan rumus pengisian arus $I(t) = \frac{\varepsilon}{R}(1 - e^{-t/\tau})$ dan peluruhan arus $I(t) = I_0 e^{-t/\tau}$.
   - **Simulasi Rangkaian & Lampu Virtual**: Sakelar dua arah (Posisi a: Pengisian baterai, Posisi b: Peluruhan induktif). Dilengkapi aliran partikel elektron dan lampu pijar yang menyala sesuai kuadrat arus ($I^2$).
   - **Grafik Real-time**: Plot dinamis arus $I(t)$, tegangan resistor $V_R(t)$, dan tegangan induktor $V_L(t)$ dengan penanda konstanta waktu $\tau = L/R$ (63.2%).

3. **32.3 Energi dalam Medan Magnetik**
   - Penurunan usaha baterai melawan back EMF: $U = \frac{1}{2}LI^2$.
   - Pembuktian rapat energi universal: $u_B = \frac{B^2}{2\mu_0}$.
   - Analisis mendalam Contoh 32.5: Kabel Koaksial dengan integral fluks magnetik radial $\Phi_B = \int_a^b \frac{\mu_0 I}{2\pi r}\ell dr$.

4. **32.4 Induktansi Silang (Mutual Inductance)**
   - Hubungan timbal balik dua koil berdekatan: $M_{12} = M_{21} = M$.
   - **Simulasi Wireless Battery Charger (Sikat Gigi Elektrik Braun / Mobil Listrik)**: Menggeser jarak pemisah koil ($d$) untuk melihat pengaruh kerapatan garis fluks magnetik terhadap GGL sekunder dan nyala lampu beban.

5. **32.5 Osilasi Rangkaian LC & Analogi Mekanik Pegas**
   - Penurunan persamaan osilator harmonik sederhana: $\frac{d^2Q}{dt^2} = -\frac{1}{LC} Q$.
   - **Simulasi Sinkron Berdampingan (Side-by-Side)**: Visualisasi bersamaan antara rangkaian tangki LC (muatan pelat kapasitor dan medan magnet koil) dengan balok pegas horizontal ($m$ dan $k$).
   - **Bilah Keseimbangan Energi Real-time**: Pertukaran energi listrik $U_C$ & magnetik $U_L$ serta energi potensial $U_p$ & kinetik $E_k$.

6. **32.6 Rangkaian RLC & Redaman**
   - Tiga rezim redaman berdasarkan hambatan kritis $R_c = \sqrt{4L/C}$:
     - *Underdamped* ($R < R_c$)
     - *Critically Damped* ($R = R_c$)
     - *Overdamped* ($R > R_c$)
   - **Simulator Osiloskop Digital**: Mengamati bentuk gelombang sinusoidal teredam dengan garis selubung eksponensial $e^{-Rt/2L}$.

7. **Quick Quiz Interaktif (32.1 - 32.8)**
   - Seluruh kuis cepat resmi dari buku Serway disajikan secara interaktif lengkap dengan feedback otomatis benar/salah dan pembahasan konsep yang mendalam.

8. **Kalkulator & Solver Rumus Fisika**
   - Kalkulator Induktansi Solenoida Ideal.
   - Kalkulator Konstanta Waktu & Arus Rangkaian RL.
   - Kalkulator Resonansi LC & Hambatan Kritis RLC.
   - Kalkulator Rapat Energi Medan Magnetik ($u_B$).

---

## 🚀 Cara Membuka & Menjalankan Aplikasi

Aplikasi ini bersifat *client-side* (tanpa ketergantungan server khusus) dan dapat langsung dibuka di browser mana saja:

### Cara 1: Buka Langsung (Rekomendasi)
Cukup buka file `index.html` menggunakan browser favorit Anda:
- Klik dua kali file `index.html` di folder `C:\Users\lumba\.gemini\antigravity\scratch\inductance-web-app\`
- Atau klik kanan -> **Open with** -> **Google Chrome** / **Microsoft Edge** / **Firefox**

### Cara 2: Akses via Path URL Browser
Salin dan tempel alamat berikut pada bilah alamat (address bar) browser Anda:
```
file:///C:/Users/lumba/.gemini/antigravity/scratch/inductance-web-app/index.html
```

---

## 🛠️ Teknologi yang Digunakan
- **HTML5 & Vanilla JavaScript**: Mesin fisika kanvas 60 FPS real-time.
- **Tailwind CSS**: Antarmuka modern, responsif, dan elegan dengan dark mode.
- **KaTeX**: Rendering rumus-rumus matematika dan fisika berkualitas tipografi LaTeX.
- **Lucide Icons**: Ikon visual yang intuitif.
