const CLOUDINARY_URL_PREVIEW = 'https://res.cloudinary.com/dja8smkgx/image/upload/v';

var contraTransaction = "";

var txnId = getParameterById('txnId');
var stompClient = null;

/**
 * @param String name
 * @return String
 */
function getParameterById(transactionId) {
    transactionId = transactionId.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + transactionId + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

console.log("Transaction: " + txnId)

"use strict"
jQuery(document).ready(function () {

    var navListItems = $('ul.setup-panel li a'),
        allWells = $('.setup-content');

    allWells.hide();

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this).closest('li');

        if (!$item.hasClass('disabled')) {
            navListItems.closest('li').removeClass('active');
            $item.addClass('active');
            allWells.hide();
            $target.show();
        }
    });

    $('ul.setup-panel li.active a').trigger('click');

    // DEMO ONLY //
    $('#activate-step-2').on('click', function (e) {
        $('ul.setup-panel li:eq(1)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-2"]').trigger('click');
        $(this).remove();
    })

    $('#activate-step-3').on('click', function (e) {
        $('ul.setup-panel li:eq(2)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-3"]').trigger('click');
        $(this).remove();
    })
});



function cerrarLocalStorageUsuario() {
    //localStorage.removeItem('key');
    localStorage.clear();
}




function cerrarSesion() {
    cerrarLocalStorageUsuario();
    location.href = "index.html";
}



/// funciones para cargar datos del front dashboard

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
            loadTransaction()
        })
        .catch(function (error) {
            alert("Error, No se pudo cargar usuario");
        })

}

async function loadTransaction() {
    if (txnId != '') {
        //verificar que usuarios hagan parte de la transaccion (comprador y vendedor)

        //consultar transacction
        var response = await axios.get('/api/v1/transactions/' + txnId)

        console.log(response.data);

        //>>> response.data 0 = transaction, 1 = comprador, 2 = vendedor, 3 = producto
        var product = response.data[3];
        var buyer = response.data[1];
        var seller = response.data[2];
        var transaction = response.data[0];
        //Colocar datos
        /// Transacccion
        document.title = "Transaction #" + transaction['transactionId'];

        /// Producto
        document.getElementById("productName").value = product["productName"];
        document.getElementById("productDescription").value = product["productDescription"];
        document.getElementById("productPrice").value = product["productPrice"];
        document.getElementById("totalPrice").value = (parseFloat(product["productPrice"]) * 0.005) + product["productPrice"];

        ///imagenes
        var imagenes = product['productImage'].split(",");
        var ol = '';
        var divCareusel = '';

        for (let img in imagenes) {
            if (img == 0) {
                ol += '<li data-target="#myCarousel' + product['productId'] + '" data-slide-to="' + img + '" class="active"></li>';
                divCareusel += '<div class="item active">' +
                    '<img class="card-img-top rounded-0" src="' + CLOUDINARY_URL_PREVIEW + imagenes[img] + '" alt="' + imagenes[img] + '">' +
                    '</div>';
            } else {
                ol += '<li data-target="#myCarousel' + product['productId'] + '" data-slide-to="' + img + '"></li>';
                divCareusel += '<div class="item">' +
                    '<img class="card-img-top rounded-0" src="' + CLOUDINARY_URL_PREVIEW + imagenes[img] + '" alt="' + imagenes[img] + '">' +
                    '</div>';
            }

        }
        var carousel = document.getElementById('photosDiv');
        carousel.innerHTML = '<div class="view overlay">' +
            '<div id="myCarousel' + product['productId'] + '" class="carousel slide" data-ride="carousel">' +
            '<ol class="carousel-indicators">' + ol + '</ol>' +
            '<div class="carousel-inner">' + divCareusel + '</div>' +

            '<a class="left carousel-control" href="#myCarousel' + product['productId'] + '" data-slide="prev">' +
            '<span class="glyphicon glyphicon-chevron-left"></span>' +
            '<span class="sr-only">Previous</span>' +
            '</a>' +
            '<a class="right carousel-control" href="#myCarousel' + product['productId'] + '"  data-slide="next">' +
            '<span class="glyphicon glyphicon-chevron-right"></span>' +
            '<span class="sr-only">Next</span>' +
            '</a>' +
            '</div>' +
            '</div>';



        ///Comprador
        document.getElementById("buyerNickname").innerHTML = buyer["userNickname"];

        document.getElementById("buyerName").value = buyer["userName"];
        document.getElementById("buyerLastname").value = buyer["userLastName"];
        document.getElementById("buyerAddress").value = "Cr 19";
        document.getElementById("buyerPhone").value = "+" + buyer["codeCountry"] + " " + buyer["userPhone"];


        ///Vendedor
        document.getElementById("sellerNickname").value = seller["userNickname"];

        ///Feedback
        var div = document.getElementById("sellerReputation");
        var feedback = seller["userFeedback"];
        var images = '';
        for (var i = 0; i < feedback; i++) {
            //var img = document.createElement("");
            images += '<img src="./img/star.png" style="width: 35px; position: relative; top: -8px">';
            //li.innerHTML = star;

        }
        div.innerHTML = images;
        //// Guardar Imagen de vendedor y comprador
        if (localStorage.Actual == seller['userNickname']) {
            localStorage.avatarActual = seller["userImage"];
            contraTransaction = buyer["userNickname"];
        } else {
            localStorage.avatarActual = buyer["userImage"];
            contraTransaction = seller["userNickname"];
        }



        ///Mensajes CHAT
        messages();

    } else {
        alert("Error, there is no transaction")
    }
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

async function messages() {
    //consultar Mensajes
    var response = await axios.get('/api/v1/messages/' + txnId)
    for (var i = 0; i < response.data.length; i++) {

        var mensaje = response.data[i];
        var control = '';
        if (mensaje.user == localStorage.Actual) {
            control = '<li style="width:100%;">' +
                '<div class="msj-rta macro">' +
                '<div class="text text-r">' +
                '<p>' + mensaje.data + '</p>' +
                '<p><small>' + mensaje.user + '</small></p>' +
                '</div>' +
                '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + CLOUDINARY_URL_PREVIEW + mensaje.userImage + '" /></div>' +
                '</li>';
        } else {
            control = '<li style="width:100%">' +
                '<div class="msj macro">' +
                '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + CLOUDINARY_URL_PREVIEW + mensaje.userImage + '" /></div>' +
                '<div class="text text-l">' +
                '<p>' + mensaje.data + '</p>' +
                '<p><small>' + mensaje.user + '</small></p>' +
                '</div>' +
                '</div>' +
                '</li>';
        }

        $("#chat").append(control);
    }
}

function registrarMensaje() {
    var nullAlert = false;
    //document.getElementById("alertDiv").innerHTML = "";
    var alerta;

    if (document.getElementById("mensaje").value === '') {
        nullAlert = true;

        alerta = ' Add message.';
        alertify.error(alerta);
    }

    if (!nullAlert) {

        axios.post('/api/v1/messages/', {
            "1": {
                idTransaction: txnId,
                user: localStorage.Actual,
                data: document.getElementById("mensaje").value,
                userImage: localStorage.avatarActual
            }

        })
            .then(function (response) {
                var text = "Success, message";
                var web = "#sectionList";
                alertify.success(text);
                sendRequest('newMessage',contraTransaction);
            })
        var mensaje = new Message(txnId, localStorage.Actual, $("#mensaje").val(), localStorage.avatarActual);
        $("#mensaje").val("");
        stompClient.send("/topic/transactions." + txnId, {}, JSON.stringify(mensaje));

    } else {
        alertify.error("<b>>>Please, fill in all the required fields.<<</b>");
    }
}

function connectAndSubscribe() {
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/transactions.' + txnId, function (response) {
            var mensaje = JSON.parse(response.body);
            var control = '';
            if (mensaje.user == localStorage.Actual) {
                control = '<li style="width:100%;">' +
                    '<div class="msj-rta macro">' +
                    '<div class="text text-r">' +
                    '<p>' + mensaje.data + '</p>' +
                    '<p><small>' + mensaje.user + '</small></p>' +
                    '</div>' +
                    '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + CLOUDINARY_URL_PREVIEW + mensaje.userImage + '" /></div>' +
                    '</li>';
            } else {
                control = '<li style="width:100%">' +
                    '<div class="msj macro">' +
                    '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + CLOUDINARY_URL_PREVIEW + mensaje.userImage + '" /></div>' +
                    '<div class="text text-l">' +
                    '<p>' + mensaje.data + '</p>' +
                    '<p><small>' + mensaje.user + '</small></p>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            }

            $("#chat").append(control);
        });
    });
}

class Message {
    constructor(idTransaction, user, data, userImage) {
        this.idTransaction = idTransaction;
        this.user = user;
        this.data = data;
        this.userImage = userImage;
    }
}