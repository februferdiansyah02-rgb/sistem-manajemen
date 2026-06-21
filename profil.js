function cekData(){

    const data = localStorage.getItem("user");

    if(data){
        editData();
    }else{
        inputData();
    }

}

function inputData(){

    Swal.fire({
        title:'Masukkan Data Kamu',
        html:`
            <input id="nama" class="swal2-input" placeholder="Nama">
            <input id="hobi" class="swal2-input" placeholder="Hobi">
            <input id="tentangmu" class="swal2-input" placeholder="Tentang Saya">
            <input id="foto" type="file" class="swal2-file" accept="image/*">
        `,
        showCancelButton:true,
        confirmButtonText:'Simpan',

        preConfirm:()=>{

            const nama=document.getElementById('nama').value;
            const hobi=document.getElementById('hobi').value;
            const tentangmu=document.getElementById('tentangmu').value;
            const foto=document.getElementById('foto').files[0];

            if(!nama || !hobi || !tentangmu || !foto){
                Swal.showValidationMessage('Semua data harus diisi');
                return false;
            }

            return {
                nama,
                hobi,
                tentangmu,
                foto
            };
        }

    }).then((result)=>{

        if(result.isConfirmed){

            const reader = new FileReader();

            reader.onload = function(e){

                const user = {
                    nama: result.value.nama,
                    hobi: result.value.hobi,
                    tentangmu: result.value.tentangmu,
                    foto: e.target.result
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                tampilData();

                Swal.fire(
                    'Berhasil!',
                    'Data berhasil disimpan',
                    'success'
                );
            };

            reader.readAsDataURL(result.value.foto);
        }

    });

}

function editData(){

    const data = JSON.parse(
        localStorage.getItem("user")
    );

    Swal.fire({
        title:'Edit profil',
        html:`
            <input id="nama" class="swal2-input" value="${data.nama}">
            <input id="hobi" class="swal2-input" value="${data.hobi}">
            <input id="tentangmu" class="swal2-input" value="${data.tentangmu}">
            <input id="foto" type="file" class="swal2-file" accept="image/*">
        `,
        showCancelButton:true,
        confirmButtonText:'Update',

        preConfirm:()=>{

            const nama=document.getElementById('nama').value;
            const hobi=document.getElementById('hobi').value;
            const tentangmu=document.getElementById('tentangmu').value;
            const foto=document.getElementById('foto').files[0];

            if(!nama || !hobi || !tentangmu){
                Swal.showValidationMessage('Semua data harus diisi');
                return false;
            }

            return {
                nama,
                hobi,
                tentangmu,
                foto
            };
        }

    }).then((result)=>{

        if(result.isConfirmed){

            if(result.value.foto){

                const reader = new FileReader();

                reader.onload = function(e){

                    data.nama = result.value.nama;
                    data.hobi = result.value.hobi;
                    data.tentangmu = result.value.tentangmu;
                    data.foto = e.target.result;

                    localStorage.setItem(
                        "user",
                        JSON.stringify(data)
                    );

                    tampilData();

                    Swal.fire(
                        'Berhasil!',
                        'Data berhasil diperbarui',
                        'success'
                    );
                };

                reader.readAsDataURL(result.value.foto);

            }else{

                data.nama = result.value.nama;
                data.hobi = result.value.hobi;
                data.tentangmu = result.value.tentangmu;

                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );

                tampilData();

                Swal.fire(
                    'Berhasil!',
                    'Data berhasil diperbarui',
                    'success'
                );
            }

        }

    });

}

function tampilData(){

    const data = JSON.parse(
        localStorage.getItem("user")
    );

    if(data){

        document.getElementById("hasil").innerHTML = `
            <div class="card">

     <div class="card">

    <div class="info-area">
        <h2>Hai I'M <br> ${data.nama}</h2>

        <p><b>Hobi aku adalah  ${data.hobi}</p>

        <p>
            <b>Cerita aku</b><br>
            ${data.tentangmu}
        </p>
    </div>

    <div class="foto-area">
        <img src="${data.foto}" alt="Foto Profil">

        <button class="edit-btn" onclick="editData()">
            Edit Data
        </button>
    </div>

</div>
        `;

        document.getElementById("btnData").style.display = "none";
    }
}

tampilData();
