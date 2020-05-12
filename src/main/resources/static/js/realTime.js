var stompClient = null;

function setConnected(connected) {

    if (connected) {
        alertify.success("Conectado al servidor...");
    }
    else {
        alertify.error("Desconectado del servidor...");
    }
}

function connect() {
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/syncup', function (response) {
            showMessage(JSON.parse(response.body));
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

async function sendRequest(funcion, seller) {
    alertify.success("Enviando solicitud...");
    await stompClient.send("/webStore/upgrade", {}, JSON.stringify({ 'userNickname': localStorage.Actual, "function": funcion, "seller": seller }));
}

function showMessage(message) {
    console.log("Recibiendo Solicitud...");
    alertify.success("Recibiendo Solicitud...");
    //alertify.success(message.userNickname + '-' + message.function);

    console.log('Mensaje guardado ');

    console.log("retrona: " + message.function + " - " + message.seller);
    var pathname = window.location.pathname;
    if (message.function == "newProduct") {
        if (message.userNickname == localStorage.Actual) {
            document.getElementById("tableYourAds").innerHTML = "";
            updateAds();
            alertify.success("Success, Registered Product");
        } else {
            alertify.message("User <b>" + message.userNickname + "</b> has published a new product!");
            if (pathname == '/dashboard.html') {
                document.getElementById("divAllProducts").innerHTML = "";
                agregarProductos({});
            }
        }
    } else if (message.function == "deleteProduct") {
        if (message.userNickname == localStorage.Actual) {
            document.getElementById("tableYourAds").innerHTML = "";
            updateAds();
            alertify.success("Success, Deleted Product");
        } else {
            if (pathname == '/dashboard.html') {
                document.getElementById("divAllProducts").innerHTML = "";
                agregarProductos({});
            }
        }

    } else if (message.function == "newTransaction") {
        if (message.seller == localStorage.Actual) {

            if (pathname == '/profile.html') {
                document.getElementById("tableInProcessSeller").innerHTML = "";
                document.getElementById("tableHistorySeller").innerHTML = "";
                updateOthersTablesSeller();
            }
            document.getElementById('notifications').innerHTML += '<a class="dropdown-item" href="#"><b>' + message.userNickname + '</b> wants to buy a product!</a>';
            var notificaiones = document.getElementById('alertNotify').innerHTML
            document.getElementById('alertNotify').innerHTML = parseInt(notificaiones) + 1;
            alertify.success("<b>" + message.userNickname + "</b> wants to buy a product!");
        }
    } else if (message.function == "newMessage") {
        if (message.seller == localStorage.Actual) {
            if (pathname != '/transaction.html') {
                alertify.success("<b>" + message.userNickname + "</b> wrote to you in one of your sales!");
                document.getElementById('notifications').innerHTML += '<a class="dropdown-item" href="#"><b>' + message.userNickname + '</b> wrote to you in one of your sales!</a>';
                var notificaiones = document.getElementById('alertNotify').innerHTML
                document.getElementById('alertNotify').innerHTML = parseInt(notificaiones) + 1;
            }
        }

    }
}


$(function () {
    console.log(">>> Servidor Sincronizado...");
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    connect();
    //$( "#connect" ).click(function() { connect(); });
    //$( "#disconnect" ).click(function() { disconnect(); });
    $("#send").click(function () { sendRequest("tabla prueba2 2"); });
});

