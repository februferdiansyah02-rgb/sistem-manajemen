let jadwal =
JSON.parse(localStorage.getItem("jadwal")) || [];

function simpanData(){
    localStorage.setItem(
        "jadwal",
        JSON.stringify(jadwal)
    );
}

function tampilkanData(){

    const tbody =
    document.getElementById("tbody");

    tbody.innerHTML="";

    jadwal.forEach((item,index)=>{

        tbody.innerHTML += `
        <tr>
            <td>${item.tanggal}</td>
            <td>${item.jam}</td>
            <td>${item.kegiatan}</td>
            <td>
                <button
                class="hapus"
                onclick="hapusJadwal(${index})">
                Hapus
                </button>
            </td>
        </tr>
        `;
    });
}

function tambahJadwal(){

    const tanggal =
    document.getElementById("tanggal").value;

    const jam =
    document.getElementById("jam").value;

    const kegiatan =
    document.getElementById("kegiatan").value;

    if(
        tanggal === "" ||
        jam === "" ||
        kegiatan === ""
    ){
        alert("Lengkapi semua data!");
        return;
    }

    jadwal.push({
        tanggal,
        jam,
        kegiatan
    });

    simpanData();
    tampilkanData();

    document.getElementById("tanggal").value="";
    document.getElementById("jam").value="";
    document.getElementById("kegiatan").value="";

    const popup =
    document.getElementById("popup");

    popup.style.display="block";

    setTimeout(()=>{
        popup.style.display="none";
    },3000);
}

function hapusJadwal(index){

    jadwal.splice(index,1);

    simpanData();

    tampilkanData();
}

if(Notification.permission !== "granted"){
    Notification.requestPermission();
}

setInterval(()=>{

    const sekarang = new Date();

    const tahun =
    sekarang.getFullYear();

    const bulan =
    String(sekarang.getMonth()+1)
    .padStart(2,"0");

    const hari =
    String(sekarang.getDate())
    .padStart(2,"0");

    const tanggalSekarang =
    `${tahun}-${bulan}-${hari}`;

    const jamSekarang =
    String(sekarang.getHours())
    .padStart(2,"0")
    + ":" +
    String(sekarang.getMinutes())
    .padStart(2,"0");

    jadwal.forEach(item=>{

        if(
            item.tanggal === tanggalSekarang &&
            item.jam === jamSekarang
        ){

            if(Notification.permission==="granted"){

                new Notification(
                    "⏰ Pengingat Jadwal",
                    {
                        body:item.kegiatan
                    }
                );
            }

            alert(
                "⏰ Waktunya: " +
                item.kegiatan
            );
        }
    });

},60000);

tampilkanData();