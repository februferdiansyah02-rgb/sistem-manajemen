let transaksi =
JSON.parse(localStorage.getItem("transaksi")) || [];

function simpanData(){

    localStorage.setItem(
        "transaksi",
        JSON.stringify(transaksi)
    );

}

function tambahData(){

    let keterangan =
    document.getElementById("keterangan").value;

    let jenis =
    document.getElementById("jenis").value;

    let nominal =
    Number(document.getElementById("nominal").value);

    let tanggal =
    document.getElementById("tanggal").value;

    if(
        keterangan === "" ||
        nominal <= 0 ||
        tanggal === ""
    ){
        alert("Lengkapi semua data!");
        return;
    }

    transaksi.push({

        id:Date.now(),

        keterangan,

        jenis,

        nominal,

        tanggal

    });

    simpanData();

    document.getElementById("keterangan").value="";
    document.getElementById("nominal").value="";
    document.getElementById("tanggal").value="";

    tampilkanData();
}

function hapusData(id){

    transaksi =
    transaksi.filter(item => item.id !== id);

    simpanData();

    tampilkanData();
}

function tampilkanData(){

    let totalMasuk = 0;
    let totalKeluar = 0;

    let list =
    document.getElementById("listTransaksi");

    list.innerHTML = "";

    transaksi.forEach(item => {

        if(item.jenis === "pemasukan"){
            totalMasuk += item.nominal;
        }else{
            totalKeluar += item.nominal;
        }

        list.innerHTML += `
            <div class="item">

                <div>
                    <h3>${item.keterangan}</h3>
                    <p>${item.tanggal}</p>
                    <small>${item.jenis}</small>
                </div>

                <div>
                    <strong>
                        Rp ${item.nominal.toLocaleString('id-ID')}
                    </strong>
                </div>

                <button
                    class="hapus"
                    onclick="hapusData(${item.id})">

                    Hapus

                </button>

            </div>
        `;
    });

    document.getElementById("totalMasuk").innerText =
    "Rp " +
    totalMasuk.toLocaleString("id-ID");

    document.getElementById("totalKeluar").innerText =
    "Rp " +
    totalKeluar.toLocaleString("id-ID");

    document.getElementById("saldo").innerText =
    "Rp " +
    (totalMasuk - totalKeluar)
    .toLocaleString("id-ID");
}

tampilkanData();
