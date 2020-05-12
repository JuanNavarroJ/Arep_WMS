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


function iniciarSesion() {
    var nullAlert = false;
    var alerta;
    if (document.getElementById("inUsername").value === '') {
        nullAlert = true;
        alerta = ' Enter your username.';
        alertify.error(alerta);
    }
    if (document.getElementById("inPassword").value === '') {
        nullAlert = true;
        alerta = ' Enter your password.';
        alertify.error(alerta);
    }
    if (!nullAlert) {

        axios.get('/api/v1/users/' + document.getElementById("inUsername").value)
            .then(function (response) {

                if (response.data["userPassword"] === document.getElementById("inPassword").value) {
                    iniciarLocalStorageUser(document.getElementById("inUsername").value);
                    location.href = "profile.html";

                } else {
                    alerta = ' Incorrect username or password.';
                    alertify.error(alerta);
                }

            })
            .catch(function (error) {
                alerta = ' Incorrect username or password.';
                alertify.error(alerta);

            })
    }

}


function registrarUsuario() {
    var nullAlert = false;
    //document.getElementById("alertDiv").innerHTML = "";
    var alerta;
    if (document.getElementById("upUsername").value === '') {
        nullAlert = true;

        alerta = ' Enter your username.';
        alertify.error(alerta);
        //document.getElementById("alertDiv").innerHTML += divAlerta(alerta);
    }
    if (document.getElementById("upEmail").value === '') {
        nullAlert = true;
        alerta = ' Enter your Email.';
        alertify.error(alerta);

    }
    if (document.getElementById("upPassword").value === '') {
        nullAlert = true;
        alerta = ' Enter your Password.';
        alertify.error(alerta);
    }

    if (document.getElementById("upPassword2").value === '') {
        nullAlert = true;
        alerta = ' Please, Repeat the Password.';
        alertify.error(alerta);

    }
    if (document.getElementById("upPassword2").value !== document.getElementById("upPassword").value) {
        nullAlert = true;
        alerta = ' The Passwords not similars.';
        alertify.error(alerta);

    }

    if (!nullAlert) {
        axios.post('/api/v1/users/', {
            "1": {
                userEmail: document.getElementById("upEmail").value,
                userPassword: document.getElementById("upPassword").value,
                userNickname: document.getElementById("upUsername").value
            }


        })
            .then(function (response) {
                console.log(response.data);
                var text = ["Success", "Registered User"];
                var web = "login.html";
                //alertify.success(text[0]);
                //alert(text[1]);
                alertify.alert(text[0], text[1]).set('label', 'OK');
                alert(text[1]);
                callAlert(text, web);

            })
    } else {
        alertify.error("<b>>>Please, fill in all the required fields.<<</b>");
    }

}



function cerrarSesion() {
    cerrarLocalStorageUsuario();
    location.href = "index.html";
}



/// funciones para cargar datos del front profile


function loadProfile() {
    axios.get('/api/v1/users/' + localStorage.getItem('Actual'))
        .then(function (response) {

            document.getElementById("usernameP").innerHTML = "Hi, " + response.data["userNickname"];

            document.getElementById("emailP").innerHTML = response.data["userEmail"];
            document.getElementById("balanceP").innerHTML = response.data["userBalance"];


            document.getElementById("nameP").innerHTML = response.data["userName"];
            document.getElementById("lastnameP").innerHTML = response.data["userLastName"];
            document.getElementById("phoneP").innerHTML = response.data["codeCountry"] + " " + response.data["userPhone"];
            document.getElementById("nProductsP").innerHTML = response.data["products"].length;

            if (response.data["userImage"] === "") {
                document.getElementById("userImageP").src = "./img/noImageUser.jpg";
            }
            else {
                document.getElementById("userImageP").src = CLOUDINARY_URL_PREVIEW + response.data["userImage"];
            }

            //Feedback
            var ul = document.getElementById("feedbackView");
            var feedback = response.data["userFeedback"];
            for (var i = 0; i < feedback; i++) {
                var li = document.createElement("li");
                var star = '<a href="#"><img src="./img/star.png" style="width: 100%; top: -7px; position: relative; filter: drop-shadow(2px 2px 6px #444);"></i></a>';
                li.innerHTML = star;
                ul.appendChild(li);
            }

            //document.getElementById("feedbackView").appendChild(' <li><a href="#"><img src="./img/star.png" style="width: 50px; top: -7px; position: relative; filter: drop-shadow(2px 2px 6px #444);"></i></a></li>');



            //llamar otras funciones
            updateAds();
            updateOthersTablesSeller();
        })
        .catch(function (error) {
            alert("Error, No se pudo cargar usuario");
        })

}

async function updateAds() {
    var tabla = document.getElementById("tableYourAds");
    tabla.innerHTML = "<th>#</th><th>ID</th><th>Name</th><th>Description</th><th>Price</th><th></th>" +
        "<tbody id='tbodyTableAds'></tbody>";

    var tbody = document.getElementById("tbodyTableAds");

    await axios.get('/api/v1/products/' + localStorage.getItem('Actual'))
        .then(function (response) {

            for (var x in response.data) {
                //alert(response.data[x]['productName']);
                var filatr = document.createElement("tr");

                var productId = "'" + String(response.data[x]["productId"]) + "'";
                var numeroFila = parseInt(x) + 1;
                filatr.innerHTML = '<td>' + numeroFila + '</td>' +
                    '<td id="productId' + response.data[x]["productId"] + '">' + response.data[x]["productId"] + '</td>' +
                    '<td>' + response.data[x]["productName"] + '</td>' +
                    '<td>' + response.data[x]["productDescription"] + '</td>' +
                    '<td>$' + response.data[x]["productPrice"] + ' USD</td>' +
                    '<td> <div class="btn-group"><button onclick="editarProducto(' + productId + ')" class="btn btn-primary"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button> ' +
                    ' <button onclick="eliminarProducto(' + productId + ')" class="btn btn-danger"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></button></div> </td>';
                tbody.appendChild(filatr);
            }
        })
}

async function updateOthersTablesSeller() {
    var tabla = document.getElementById("tableInProcessSeller");
    tabla.innerHTML = "<th>#</th><th>ID</th><th>Product</th><th>Buyer</th><th>Price</th><th>Status</th><th>Date</th><th></th>" +
        "<tbody id='tbodyTableInProcessSeller'></tbody>";

    var tbody = document.getElementById("tbodyTableInProcessSeller");

    var tablaHistoria = document.getElementById("tableHistorySeller");
    tablaHistoria.innerHTML = "<th>#</th><th>ID</th><th>Product</th><th>Buyer</th><th>Price</th><th>Status</th><th>Date</th><th></th>" +
        "<tbody id='tbodytableHistorySeller'></tbody>";

    var tbodyHistory = document.getElementById("tbodytableHistorySeller");

    await axios.get('/api/v1/transactions/user/' + localStorage.getItem('Actual'))
        .then(function (response) {
            console.log(response.data);

            for (var x in response.data) {
                if (response.data[x]["seller"] == localStorage.Actual) {
                    if (response.data[x]["transactionActive"] == true) {
                        //alert(response.data[x]['productName']);
                        var filatr = document.createElement("tr");

                        var transactionID = "'" + String(response.data[x]["transactionId"]) + "'";
                        var numeroFila = parseInt(x) + 1;
                        filatr.innerHTML = '<td>' + numeroFila + '</td>' +
                            '<td id="productId' + response.data[x]["transactionId"] + '">' + response.data[x]["transactionId"] + '</td>' +
                            '<td>' + response.data[x]["product"] + '</td>' +
                            '<td>' + response.data[x]["buyer"] + '</td>' +
                            '<td>$' + response.data[x]["transactionPrice"] + ' USD</td>' +
                            '<td>' + response.data[x]["TransactionState"] + '</td>' +
                            '<td>' + response.data[x]["transactionDate"] + '</td>' +
                            '<td> <div class="btn-group"><button onclick="goToTransaction(' + transactionID + ')" class="btn btn-primary"><span class="glyphicon glyphicon-log-in" aria-hidden="true"></span></button> ' +
                            '</div> </td>';
                        tbody.appendChild(filatr);
                    } else {
                        var filatr = document.createElement("tr");

                        var transactionID = "'" + String(response.data[x]["transactionId"]) + "'";
                        var numeroFila = parseInt(x) + 1;
                        filatr.innerHTML = '<td>' + numeroFila + '</td>' +
                            '<td id="productId' + response.data[x]["transactionId"] + '">' + response.data[x]["transactionId"] + '</td>' +
                            '<td>' + response.data[x]["product"] + '</td>' +
                            '<td>' + response.data[x]["buyer"] + '</td>' +
                            '<td>$' + response.data[x]["transactionPrice"] + ' USD</td>' +
                            '<td>' + response.data[x]["TransactionState"] + '</td>' +
                            '<td>' + response.data[x]["transactionDate"] + '</td>' +
                            '<td> <div class="btn-group"><button onclick="goToTransaction(' + transactionID + ')" class="btn btn-primary"><span class="glyphicon glyphicon-log-in" aria-hidden="true"></span></button> ' +
                            '</div> </td>';
                        tbodyHistory.appendChild(filatr);
                    }

                }

            }
        })
}

function registrarProducto() {
    var nullAlert = false;
    //document.getElementById("alertDiv").innerHTML = "";
    var alerta;
    if (document.getElementById("upProductName").value === '') {
        nullAlert = true;

        alerta = ' Enter the Product Name.';
        alertify.error(alerta);
        //document.getElementById("alertDiv").innerHTML += divAlerta(alerta);
    }
    if (document.getElementById("upDescription").value === '') {
        nullAlert = true;
        alerta = ' Enter the Product Description.';
        alertify.error(alerta);

    }
    if (document.getElementById("upPrice").value === '') {
        nullAlert = true;
        alerta = ' Enter the Product Price.';
        alertify.error(alerta);
    }

    if (document.getElementById("upMainImage").value === '') {
        nullAlert = true;
        alerta = ' Please, Select at least one image .';
        alertify.error(alerta);

    }

    console.log("UsuARIO: " + localStorage.getItem('Actual'));
    console.log("producto: " + document.getElementById("upProductName").value);
    console.log("descripcion: " + document.getElementById("upDescription").value);
    console.log("precio: " + document.getElementById("upPrice").value);
    console.log("Imagen Principal: " + document.getElementById("upMainImage").value);
    var imagenes = document.getElementById("upMainImage").value;

    if (document.getElementById("upSecondImage").value !== '') {
        console.log("Imagen 2: " + document.getElementById("upSecondImage").value);
        imagenes += ',' + document.getElementById("upSecondImage").value;
    }
    if (document.getElementById("upThirdImage").value !== '') {
        console.log("Imagen 3: " + document.getElementById("upThirdImage").value);
        imagenes += ',' + document.getElementById("upThirdImage").value;
    }

    console.log("imagenes: " + imagenes);

    if (!nullAlert) {
        axios.post('/api/v1/products/', {
            "1": {
                productName: document.getElementById("upProductName").value,
                productDescription: document.getElementById("upDescription").value,
                productPrice: document.getElementById("upPrice").value,
                productUser: localStorage.getItem('Actual'),
                productImage: imagenes
            }


        })
            .then(function (response) {
                console.log(response.data);
                var text = "Success, Registered Product";
                var web = "#sectionList";
                //alertify.success(text);
                //Actualizar tabal demas usuarios

                document.getElementById("upProductName").value = "";
                document.getElementById("upDescription").value = "";
                document.getElementById("upPrice").value = "";
                //
                document.getElementById('img-preview').src = "img/noImage.png";
                document.getElementById('mainImageLabel').innerHTML = "Choose Image";
                document.getElementById('selectMainImage').value = "";
                document.getElementById('main-bar').setAttribute('aria-valuenow', 0);
                document.getElementById('main-bar').style = ('width', 0);
                //
                document.getElementById('imgSecond-preview').src = "img/noImage.png";
                document.getElementById('secondImageLabel').innerHTML = "Choose Image";
                document.getElementById('selectSecondImage').value = "";
                document.getElementById('second-bar').setAttribute('aria-valuenow', 0);
                document.getElementById('second-bar').style = ('width', 0);
                //
                document.getElementById('imgThird-preview').src = "img/noImage.png";
                document.getElementById('thirdImageLabel').innerHTML = "Choose Image";
                document.getElementById('selectThirdImage').value = "";
                document.getElementById('third-bar').setAttribute('aria-valuenow', 0);
                document.getElementById('third-bar').style = ('width', 0);
                sendRequest("newProduct","");
                location.href = web;

            })

    } else {
        alertify.error("<b>>>Please, fill in all the required fields.<<</b>");
    }
}

async function goToTransaction(transactionId) {
    var web = "transaction.html?txnId=" + transactionId;
    location.href = web;
}

async function eliminarProducto(productId) {
    await axios.delete('api/v1/products/' + localStorage.getItem('Actual') + '/' + productId)
        .then(function (response) {
            console.log(response.data);
            console.log("se elimino...");
            sendRequest("deleteProduct","");

        });


}




/// Funcion para llamar las alertas de alertify

function callAlert(text, web) {
    if (web !== null) {
        alertify.alert(text[0], text[1]).set('label', 'OK');
        location.href = web;
    } else {
        alertify.alert(text[0], text[1]).set('label', 'OK');
    }

}
