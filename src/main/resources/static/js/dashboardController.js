const CLOUDINARY_URL_PREVIEW = 'https://res.cloudinary.com/dja8smkgx/image/upload/v';

function cerrarLocalStorageUsuario() {
    //localStorage.removeItem('key');
    localStorage.clear();
}




function cerrarSesion() {
    cerrarLocalStorageUsuario();
    location.href = "index.html";
}



/// funciones para cargar datos del front dashboard



async function agregarProductos(productos) {
    // idProducto -> {detallesProducto} y {detalles vendedor}

    await axios.get('/api/v1/products/')
        .then(function (response) {
            for (var x in response.data) {
                if (response.data[x]["productUser"] != localStorage.getItem('Actual')) {
                    //console.log(response.data[x]);
                    productos[response.data[x]["productId"]] = [response.data[x], ""];

                }
            }

        })
    //console.log(productos);
    agregarVendedor(productos);

}

async function agregarVendedor(productos) {
    var div = document.getElementById("divAllProducts");
    var divRow = document.createElement("div");
    divRow.className = "row";
    //console.log(productos);
    for (let x in productos) {
        var producto = productos[x][0];
        await axios.get('/api/v1/users/' + producto["productUser"])
            .then(function (response) {
                //console.log(response.data);
                vendedor = response.data;

                if (producto['productImage'] === undefined) {
                    var imagenes = ["1586761913/zs3opsk3zujqjjoym2z4.jpg", "1586761911/fyz3wskpl2chznqyq7p8.jpg"];
                    //console.log("Imagenes: "+imagenes);
                } else {
                    var imagenes = producto['productImage'].split(",");
                    //console.log("Imagenes: "+imagenes);
                }

                //var ol = '<ol class="carousel-indicators">';
                //var divCareusel = '<div class="carousel-inner">';

                var ol = '';
                var divCareusel = '';

                for (let img in imagenes) {
                    img.height = 50;
                    img.width = 50;
                    if (img == 0) {
                        ol += '<li data-target="#myCarousel' + producto['productId'] + '" data-slide-to="' + img + '" class="active"></li>';
                        divCareusel += '<div class="item active">' +
                            '<img class="card-img-top rounded-0" src="' + CLOUDINARY_URL_PREVIEW + imagenes[img] + '" alt="' + imagenes[img] + '" style="height: 200px; height: 200px;">' +
                            '</div>';
                    } else {
                        ol += '<li data-target="#myCarousel' + producto['productId'] + '" data-slide-to="' + img + '"></li>';
                        divCareusel += '<div class="item">' +
                            '<img class="card-img-top rounded-0" src="' + CLOUDINARY_URL_PREVIEW + imagenes[img] + '" alt="' + imagenes[img] + '" style="height: 200px; height: 200px;">' +
                            '</div>';
                    }

                }


                //console.log("ol: "+ol);
                //console.log("divCar: "+divCareusel);

                var carousel = '<div class="view overlay">' +
                    '<div id="myCarousel' + producto['productId'] + '" class="carousel slide" data-ride="carousel">' +
                    '<ol class="carousel-indicators">' + ol + '</ol>' +
                    '<div class="carousel-inner">' + divCareusel + '</div>' +

                    '<a class="left carousel-control" href="#myCarousel' + producto['productId'] + '" data-slide="prev">' +
                    '<span class="glyphicon glyphicon-chevron-left"></span>' +
                    '<span class="sr-only">Previous</span>' +
                    '</a>' +
                    '<a class="right carousel-control" href="#myCarousel' + producto['productId'] + '"  data-slide="next">' +
                    '<span class="glyphicon glyphicon-chevron-right"></span>' +
                    '<span class="sr-only">Next</span>' +
                    '</a>' +
                    '</div>' +
                    '</div>';

                //console.log("carosel: "+carousel);
                var productId = "'" + producto["productId"] + "'";
                var vendedorId = "'" + vendedor['idUser'] + "'";
                var vendedorNick = "'" + vendedor['userNickname'] + "'";
                var divCardProfile = document.createElement("div");

                ///Feedback
                var divFeedback = document.createElement("div");
                var feedback = vendedor['userFeedback'];
                var images = '';
                for (var i = 0; i < feedback; i++) {
                    //var img = document.createElement("");
                    images += '<img src="./img/star.png" style="width: 20%; position: relative; top: -8px">';
                    //li.innerHTML = star;

                }
                divFeedback.innerHTML = images;

                divCardProfile.innerHTML = '<div class="col-sm-3" style="max-width:100%">' +
                    '<div class="card promoting-card">' +
                    '<div class="card-body d-flex flex-row">' +
                    '<img src="' + CLOUDINARY_URL_PREVIEW + vendedor['userImage'] + '" class="rounded-circle mr-5" width="35%"  alt="avatar">' +
                    '<div>' +
                    '<h4 class="card-title font-weight-bold mb-2">' + vendedor['userNickname'] + '</h4>' +
                    '<div>' + images + '</div>'+
                    '</div>' +
                    '</div>' +
                    '<hr>' +
                    '<h5 class="card-title">' + producto["productName"] + '</h5>' +
                    carousel +
                    '<div class="card-body">' +
                    '<p>' + producto["productDescription"] + '</p>' +
                    '<p class="price">$' + producto["productPrice"] + '</p>' +
                    '<button class="btn btn-success" onclick="comprar(' + productId + "," + vendedorId + "," + vendedorNick + ')">buy</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                divRow.appendChild(divCardProfile);



            }).catch(function (error) {
                console.log(error);
            })
    }

    div.appendChild(divRow);
    /**/
    //console.log(productos);
}

async function loadProfile() {
    await axios.get('/api/v1/users/' + localStorage.getItem('Actual'))
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

            //llamar otras funciones
            agregarProductos({});
            updateOthersTablesBuyer();

        })
        .catch(function (error) {
            alert("Error, No se pudo cargar usuario");
        })

}

async function updateOthersTablesBuyer() {
    var tabla = document.getElementById("tableInProcessBuyer");
    tabla.innerHTML = "<th>#</th><th>ID</th><th>Product</th><th>Seller</th><th>Price</th><th>Status</th><th>Date</th><th></th>" +
        "<tbody id='tbodytableInProcessBuyer'></tbody>";

    var tbody = document.getElementById("tbodytableInProcessBuyer");

    var tablaHistoria = document.getElementById("tableHistoryBuyer");
    tablaHistoria.innerHTML = "<th>#</th><th>ID</th><th>Product</th><th>Seller</th><th>Price</th><th>Status</th><th>Date</th><th></th>" +
        "<tbody id='tbodytableHistoryBuyer'></tbody>";

    var tbodyHistory = document.getElementById("tbodytableHistoryBuyer");

    await axios.get('/api/v1/transactions/user/' + localStorage.getItem('Actual'))
        .then(function (response) {
            console.log(response.data);

            for (var x in response.data) {
                if (response.data[x]["buyer"] == localStorage.Actual) {
                    if (response.data[x]["transactionActive"]==true) {
                        //alert(response.data[x]['productName']);
                        var filatr = document.createElement("tr");

                        var transactionID = "'" + String(response.data[x]["transactionId"]) + "'";
                        var numeroFila = parseInt(x) + 1;
                        filatr.innerHTML = '<td>' + numeroFila + '</td>' +
                            '<td id="productId' + response.data[x]["transactionId"] + '">' + response.data[x]["transactionId"] + '</td>' +
                            '<td>' + response.data[x]["product"] + '</td>' +
                            '<td>' + response.data[x]["seller"] + '</td>' +
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
                            '<td>' + response.data[x]["seller"] + '</td>' +
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

async function comprar(productoId, vendedorId, sellerNickname) {
    //crear trasnaccion
    await axios.post('/api/v1/transactions/', {
        "1": {
            buyer: localStorage.Actual,
            seller: vendedorId,
            product: productoId
        }
    })
        .then(function (response) {
            var text = "Successm, Registered Product";
            var web = "transaction.html?txnId="+response.data;
            alertify.success(text);
            sendRequest("newTransaction",sellerNickname);
            location.href = web;

        })

}

async function goToTransaction(transactionId) {
    var web = "transaction.html?txnId=" + transactionId;
    location.href = web;
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
