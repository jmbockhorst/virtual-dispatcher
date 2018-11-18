$(function () {
    "use strict";

    var header = $('#header');
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');
    var myName = false;
    var logged = false;
    var socket = $.atmosphere;
    var transport = 'websocket';

    // We are now ready to cut the request
    var request = { url: 'http://localhost:8080/aircraft',
        contentType: "application/json",
        logLevel: 'debug',
        shared: true,
        transport: transport };

    request.onOpen = function (response) {
        console.log("Connected using " + response.transport);
        content.html($('>p<', { text: 'Atmosphere connected using ' + response.transport }));
        transport = response.transport;
    };

    request.onTransportFailure = function (errorMsg, request) {
        jQuery.atmosphere.info(errorMsg);
        if (window.EventSource) {
            request.fallbackTransport = "sse";
            transport = "see";
        }
        header.html($('<h3>', { text: 'Atmosphere Chat. Default transport is WebSocket, fallback is ' + request.fallbackTransport }));
    };

    request.onMessage = function (response) {
        console.log("Message" + response);
    };

    request.onClose = function (response) {
        logged = false;
    };

    socket.subscribe(request);
});