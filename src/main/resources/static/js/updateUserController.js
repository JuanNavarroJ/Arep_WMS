const CLOUDINARY_URL_PREVIEW = 'https://res.cloudinary.com/dja8smkgx/image/upload/v';

$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});


/**
 * @param {username} nickname del usuraio actual 
 * @returns {undefined}
 */
function iniciarLocalStorageUser(username) {

    localStorage.setItem('Actual', username);
    //localStorage.removeItem('key');
    //localStorage.clear();
}


function cerrarLocalStorageUsuario() {
    //localStorage.removeItem('key');
    localStorage.clear();
}



async function actualizarUsuario() {
    var nullAlert = false;
    //document.getElementById("alertDiv").innerHTML = "";
    var alerta;
    if (document.getElementById("upName").value === '') {
        nullAlert = true;

        alerta = ' Enter your Name.';
        alertify.error(alerta);
        //document.getElementById("alertDiv").innerHTML += divAlerta(alerta);
    }
    if (document.getElementById("upLastname").value === '') {
        nullAlert = true;
        alerta = ' Enter your Last Name.';
        alertify.error(alerta);

    }
    if (document.getElementById("upCode").value === '') {
        nullAlert = true;
        alerta = ' Enter your Code Country.';
        alertify.error(alerta);
    }

    if (document.getElementById("upPhone").value === '') {
        nullAlert = true;
        alerta = ' Enter your Phone';
        alertify.error(alerta);

    }
    if (document.getElementById("upPassword").value === '') {
        nullAlert = true;
        alerta = ' Please, Enter your Password.';
        alertify.error(alerta);

    }
    if (document.getElementById("upPassword2").value !== document.getElementById("upPassword").value) {
        nullAlert = true;
        alerta = ' The Passwords not similars.';
        alertify.error(alerta);

    }

    if (document.getElementById("upProfileImage").value === '') {
        nullAlert = true;
        alerta = ' Please, Select other Image.';
        alertify.error(alerta);

    }

    

    if (!nullAlert) {
        if(cpd===document.getElementById("upPassword").value){
            await axios.put('/api/v1/users/', {
                "1": {
                    userNickname: localStorage.getItem('Actual'),
                    userName: document.getElementById("upName").value,
                    userLastName: document.getElementById("upLastname").value,
                    userImage: document.getElementById("upProfileImage").value,
                    codeCountry: document.getElementById("upCode").value,
                    userPhone: parseInt(document.getElementById("upPhone").value)
                }
    
    
            })
                .then(function (response) {
                    console.log(response.data);
                    var text = "Success, Update Info";
                    var web = "profile.html";
                    alertify.success(text);
                    document.getElementById("upPassword").value = ""
                    document.getElementById("upPassword2").value = ""
                    loadData();
                    
                    //callAlert(text, web);
    
                })
        }else{
            alertify.error("<b>Incorrect Password </b>");
        }
        
    } else {
        alertify.error("<b>Something happened, check the data you want to change</b>");
    }
}

function cerrarSesion() {
    cerrarLocalStorageUsuario();
    location.href = "index.html";
}


var cpd = '';


function loadData() {
    var alertDiv = document.getElementById("alertDiv");
    var alertMust = '<a class="panel-close close" data-dismiss="alert">×</a>'+
        '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>'+
        'You must fill out <strong>personal information</strong> in order to'+
        '<strong>sell</strong> products.';
    var alertChange = ' <a class="panel-close close" data-dismiss="alert">×</a>'+
        '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>'+
        'If you want to change any personal information, <strong>please click here</strong>.';
   

    axios.get('/api/v1/users/' + localStorage.getItem('Actual'))
        .then(function (response) {
            console.log(response.data);
            cpd = response.data["userPassword"];
            document.getElementById("usernameU").innerHTML = response.data["userNickname"];
            document.getElementById("userIdU").value = response.data["idUser"];
            document.getElementById("upNickname").value = "@" + response.data["userNickname"];

            document.getElementById("upEmail").value = response.data["userEmail"];

            if (response.data["userName"] !== "") {
                alertDiv.innerHTML = alertChange;
                alertDiv.style.visibility = "visible";

                document.getElementById("upName").value = response.data["userName"];
                document.getElementById("upLastname").value = response.data["userLastName"];
                document.getElementById("upCode").value = response.data["codeCountry"];
                document.getElementById("upPhone").value = response.data["userPhone"];
                document.getElementById("imgProfile-preview").src = CLOUDINARY_URL_PREVIEW+response.data["userImage"];

                //disabled inputs
                document.getElementById("upName").disabled = true;
                document.getElementById("upLastname").disabled = true;
                document.getElementById("upCode").disabled = true;
                document.getElementById("upPhone").disabled = true;
            }
            else {
                document.getElementById("imgProfile-preview").src = "./img/noImage.png";
                alertDiv.innerHTML = alertMust;
                alertDiv.style.visibility = "visible";
            }

        })
        .catch(function (error) {
            console.log(error);
            alert("Error, No se pudo cargar usuario");
        })

}

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dja8smkgx/image/upload';

const CLOUDINARY_PRESETS = 'b059hpk6';

const CLOUDINARY_PRESETS_2 = 'ml_default';

/**
 * Subir imagen principal del producto
 * 
 */
const imagePreview = document.getElementById('imgProfile-preview');
const mainImageUploader = document.getElementById('selectImageProfile');
const mainUploadBar = document.getElementById('main-bar');

mainImageUploader.addEventListener('change', async (e) => {
    var file = e.target.files[0];

    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESETS);

    var res = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress(e) {

            var progress = (e.loaded * 100) / e.total;
            mainUploadBar.setAttribute('aria-valuenow', progress);
            mainUploadBar.style.width = progress + "%";


        }
    });

    mainUploadBar.className = "progress-bar bg-success";
    imagePreview.src = res.data.secure_url;
    document.getElementById('upProfileImage').value = res.data.version + "/" + res.data.public_id + "." + res.data.format;
});
/// Funcion para llamar las alertas de alertify

function callAlert(text, web) {
    if (web !== null) {
        alertify.alert(text[0], text[1]).set('label', 'OK');
        location.href = web;
    } else {
        alertify.alert(text[0], text[1]).set('label', 'OK');
    }

}
