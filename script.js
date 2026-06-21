let daftarTarget = JSON.parse(localStorage.getItem('data_target_pribadi')) || [];

const gridTarget = document.getElementById('target-grid');
const modalTarget = document.getElementById('target-modal');
const formTarget = document.getElementById('target-form');
const btnTambah = document.getElementById('btn-tambah');
const btnBatal = document.getElementById('btn-batal');

// Menentukan Evolusi Tanaman berdasarkan Persentase
function tentukanIkonTanaman(persen) {
    if (persen >= 100) return '🌸'; // Mekar Sempurna
    if (persen >= 75) return '🌷';  // Hampir Mekar
    if (persen >= 50) return '🌾';  // Berkembang
    if (persen >= 25) return '🌿';  // Tumbuh Berdaun
    return '🌱';                    // Tunas Baru
}

// Menggambar Kartu ke Layar
function tampilkanTarget(filterKategori = 'semua') {
    gridTarget.innerHTML = ''; 

    const dataTerfilter = filterKategori === 'semua' 
        ? daftarTarget 
        : daftarTarget.filter(item => item.kategori === filterKategori);

    dataTerfilter.forEach(item => {
        const goal = parseInt(item.goal) || 1;
        const current = parseInt(item.current) || 0;
        
        // Kalkulasi Persentase & Sisa Otomatis
        const persentase = Math.min(Math.round((current / goal) * 100), 100);
        const sisa = Math.max(goal - current, 0);
        const ikonTanaman = tentukanIkonTanaman(persentase);
        const apakahSelesai = persentase >= 100;

        const card = document.createElement('div');
        card.className = `target-card ${apakahSelesai ? 'target-done' : ''}`;
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <span class="badge">${item.kategori}</span>
                    <h4 style="margin-top: 10px; font-size: 1.2rem; font-weight: 600;">${item.nama}</h4>
                </div>
                <div class="plant-image-container">${ikonTanaman}</div>
            </div>

            <div class="progress-container">
                <div class="progress-labels">
                    <span>Progress: <b>${current}</b> / ${goal} kali</span>
                    <strong>${persentase}%</strong>
                </div>
                <div class="progress-bg">
                    <div class="progress-fill" style="width: ${persentase}%"></div>
                </div>
            </div>

            <div class="card-footer">
                <span>⏳ Sisa: <b>${sisa}</b> | ${item.periode}</span>
                <div class="card-actions">
                    <button class="btn-check" onclick="tambahProgress('${item.id}')" ${apakahSelesai ? 'disabled' : ''}>
                        ${apakahSelesai ? '☑️ Selesai' : '✔️ Selesai'}
                    </button>
                    <button class="btn-icon-action" onclick="bukaEditTarget('${item.id}')" title="Edit">✏️</button>
                    <button class="btn-icon-action" onclick="hapusTarget('${item.id}')" title="Hapus" style="color: #F87171;">🗑️</button>
                </div>
            </div>
        `;
        gridTarget.appendChild(card);
    });
}

// Fungsi utama tombol "✔️ Selesai" (+1 Counter Logic)
window.tambahProgress = function(id) {
    daftarTarget = daftarTarget.map(item => {
        if (item.id === id) {
            let progressBaru = parseInt(item.current) + 1;
            let targetGoal = parseInt(item.goal);

            if (progressBaru >= targetGoal) {
                progressBaru = targetGoal; // Kunci angka di batas max goal
                setTimeout(() => {
                    alert(`🎉 Hore! Target "${item.nama}" kamu telah tercapai penuh! Bunganya mekar dengan indah 🌸!`);
                }, 100);
            }
            return { ...item, current: progressBaru };
        }
        return item;
    });

    localStorage.setItem('data_target_pribadi', JSON.stringify(daftarTarget));
    tampilkanTarget();
}

// Simpan Data Form (Aksi Tambah Baru / Edit Update)
formTarget.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const id = document.getElementById('target-id').value;
    const nama = document.getElementById('target-name').value;
    const kategori = document.getElementById('target-category').value;
    const periode = document.getElementById('target-period').value;
    const goal = parseInt(document.getElementById('target-goal').value);
    const current = parseInt(document.getElementById('target-current').value);
    const deadline = document.getElementById('target-deadline').value;

    if (id) {
        daftarTarget = daftarTarget.map(item => item.id === id 
            ? { id, nama, kategori, periode, goal, current, deadline } : item
        );
    } else {
        const targetBaru = { id: Date.now().toString(), nama, kategori, periode, goal, current, deadline };
        daftarTarget.push(targetBaru);
    }

    localStorage.setItem('data_target_pribadi', JSON.stringify(daftarTarget));
    modalTarget.classList.add('hidden');
    formTarget.reset();
    tampilkanTarget();
});

// Kontrol Pembukaan Pop-up Box
btnTambah.addEventListener('click', () => {
    document.getElementById('modal-title').innerText = "➕ Tambah Target Baru";
    document.getElementById('target-id').value = ''; 
    formTarget.reset();
    modalTarget.classList.remove('hidden');
});
btnBatal.addEventListener('click', () => { modalTarget.classList.add('hidden'); });

// Load Data untuk di-Edit
window.bukaEditTarget = function(id) {
    const item = daftarTarget.find(t => t.id === id);
    if (item) {
        document.getElementById('modal-title').innerText = "✏️ Edit Parameter Target";
        document.getElementById('target-id').value = item.id;
        document.getElementById('target-name').value = item.nama;
        document.getElementById('target-category').value = item.kategori;
        document.getElementById('target-period').value = item.periode;
        document.getElementById('target-goal').value = item.goal;
        document.getElementById('target-current').value = item.current;
        document.getElementById('target-deadline').value = item.deadline;
        modalTarget.classList.remove('hidden');
    }
}

// Hapus Target
window.hapusTarget = function(id) {
    if (confirm('Apakah kamu yakin ingin menghapus data target ini?')) {
        daftarTarget = daftarTarget.filter(item => item.id !== id);
        localStorage.setItem('data_target_pribadi', JSON.stringify(daftarTarget));
        tampilkanTarget();
    }
}

// Filter Kategori Listener
document.querySelectorAll('.btn-filter').forEach(tombol => {
    tombol.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        tampilkanTarget(e.target.dataset.filter);
    });
});

tampilkanTarget();