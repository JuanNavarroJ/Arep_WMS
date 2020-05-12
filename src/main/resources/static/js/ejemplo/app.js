var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        console.log(">>> Esta conectado");
        $("#conversation").show();
    }
    else {
        console.log(">>> Esta desconectado");
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/syncup', function (response) {
            showMessage(JSON.parse(response.body).content);
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

function sendName(tabla) {
    console.log(">>> Enviando mensaje...");
    stompClient.send("/webStore/upgrade", {}, JSON.stringify({'userNickname': $("#name").val(),"tableName": tabla}));
}

function showMessage(message) {
    console.log(">>> Mostrando mensaje...");
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    console.log(">>> Funcion principal ejecutando...");
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    connect();
    //$( "#connect" ).click(function() { connect(); });
    //$( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName("tabla prueba2 2"); });
});

