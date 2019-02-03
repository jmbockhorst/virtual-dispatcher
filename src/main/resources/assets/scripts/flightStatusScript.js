var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pilots = [];
var pilotName = "";
var pilotId = "";
var currentFlight;

var host = "";

$(document).ready(function () {
    var loggedIn = false;

    //Show correct page based on login status
    if (!loggedIn) {
        showLogin();
    } else {
        showFlight();
    }

    var pilotSocket = new WebSocket('ws://' + window.location.host + "/ws/pilots");

    pilotSocket.onmessage = function (message) {
        var pilotList = JSON.parse(message.data);
        var newPilots = [];
        pilotList.forEach(function (pilot) {
            newPilots.push(pilot);
        });

        pilots = newPilots;
    };

    //When name box is typed into
    $("#name").on("input", function () {
        $("#searchList").empty();
        var name = this.value;
        if (name != "") {
            pilots.forEach(function (pilot) {
                //Check if full name is equal to searched
                //Check if only part of searched name is found
                var fullName = pilot.firstName + " " + pilot.lastName;
                if (fullName.toLowerCase() == name.toLowerCase()) {
                    $("#name").val(fullName);
                    $("#name").attr("data-id", pilot.id);
                } else if (pilot.firstName.startsWith(name) || pilot.firstName.toLowerCase().startsWith(name.toLowerCase()) || fullName.startsWith(name) || fullName.toLowerCase().startsWith(name.toLowerCase())) {
                    $("#searchList").append("<div class='searchItem' data-id=" + pilot.id + ">" + pilot.firstName + " " + pilot.lastName + "</div>");
                }
            });

            //Check last names at the end
            pilots.forEach(function (pilot) {
                if (pilot.lastName.startsWith(name) || pilot.lastName.toLowerCase().startsWith(name.toLowerCase())) {
                    $("#searchList").append("<div class='searchItem' data-id=" + pilot.id + ">" + pilot.firstName + " " + pilot.lastName + "</div>");
                }
            });
        }

        $(".searchItem").on("click", function () {
            $("#name").val($(this).html());
            var id = $(this).attr("data-id");
            $("#name").attr("data-id", id);
            $("#searchList").empty();
        });
    });

    //When checkin/out button is clicked
    $("#loginForm").submit(function (event) {
        event.preventDefault();

        //Get name and pilot_id
        var name = $("#name").val();
        var pilot_id = $("#name").attr("data-id");
        $("#name").val("");

        pilotName = name;
        pilotId = pilot_id;
        refreshStatus();
    });

    function showLogin() {
        $("#loginView").addClass("visible");
        $("#loginView").removeClass("hidden");
        $("#flightView").addClass("hidden");
        $("#flightView").removeClass("visible");
    }

    function refreshStatus() {
        loadFlightInfo();

        setInterval(function () {
            loadFlightInfo();
        }, 1000);
    }

    function showFlight() {
        $("#loginView").addClass("hidden");
        $("#loginView").removeClass("visible");
        $("#flightView").addClass("visible");
        $("#flightView").removeClass("hidden");
    }

    function loadFlightInfo() {
        var flightSocket = new WebSocket('ws://' + window.location.host + "/ws/flights");

        flightSocket.onmessage = function (message) {
            var flightList = JSON.parse(message.data);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = flightList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var flight = _step.value;

                    if (flight.pilotId == pilotId) {
                        currentFlight = flight;

                        $("#flightNumber").html("Flight# " + flight.id);
                        $("#aircraftNumber").html("Aircraft " + flight.aircraftId);
                        $("#pilotName").html(pilotName);

                        if (flight.completed) {
                            //Flight is completed
                            $("#status").html("Flight Completed");

                            $("#options").addClass("hidden");
                            $("#options").removeClass("visible");
                        } else {
                            $("#options").addClass("visible");
                            $("#options").removeClass("hidden");

                            if (flight.started) {
                                //Flight is started but not completed
                                $("#status").html("Flight in progress");

                                $("#flightStarted").addClass("hidden");
                                $("#flightStarted").removeClass("visible");

                                $("#flightFinished").addClass("visible");
                                $("#flightFinished").removeClass("hidden");
                            } else {
                                //Flight is not started
                                $("#status").html("Flight not started");

                                $("#flightStarted").addClass("visible");
                                $("#flightStarted").removeClass("hidden");

                                $("#flightFinished").addClass("hidden");
                                $("#flightFinished").removeClass("visible");
                            }
                        }

                        showFlight();
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        };
    }

    $("#flightStarted").on("click", function () {
        $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: host + '/api/flights/' + currentFlight.id,
            data: JSON.stringify({
                started: true
            })
        });
    });

    $("#flightFinished").on("click", function () {
        $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: host + '/api/flights/' + currentFlight.id,
            data: JSON.stringify({
                completed: true
            })
        });
    });

    $("#needsMaintenance").on("click", function () {
        $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: host + '/api/aircraft/' + currentFlight.aircraftId,
            data: JSON.stringify({
                operational: false
            })
        });

        $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: host + '/api/flights/' + currentFlight.id,
            data: JSON.stringify({
                completed: true
            })
        });
    });
});

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            pilots: []
        };

        _this.loadData();
        return _this;
    }

    _createClass(App, [{
        key: "loadData",
        value: function loadData() {
            var _this2 = this;

            var pilotSocket = new WebSocket('ws://' + window.location.host + "/ws/pilots");

            pilotSocket.onmessage = function (message) {
                var pilotList = JSON.parse(message.data);
                var newPilots = [];
                pilotList.forEach(function (pilot) {
                    newPilots.push(pilot);
                });

                _this2.setState({
                    pilots: newPilots
                });
            };
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "middleDiv" },
                React.createElement(
                    "div",
                    { id: "header" },
                    React.createElement("img", { src: "images/logo.png", className: "logo" }),
                    React.createElement(
                        "h1",
                        { id: "headerText" },
                        "Flight Status"
                    )
                ),
                React.createElement(
                    "div",
                    { id: "formFields" },
                    React.createElement(
                        "div",
                        { id: "loginView", className: "hidden" },
                        React.createElement(
                            "form",
                            { id: "loginForm", action: "#", autoComplete: "off", method: "POST" },
                            React.createElement("input", { type: "text", name: "name", id: "name", placeholder: "Enter name" }),
                            React.createElement("div", { id: "searchList" }),
                            React.createElement("input", { type: "submit", id: "login", value: "Login" })
                        )
                    ),
                    React.createElement(
                        "div",
                        { id: "flightView", className: "hidden" },
                        React.createElement(
                            "div",
                            { id: "flightInfo" },
                            React.createElement("p", { className: "infoItem", id: "pilotName" }),
                            React.createElement("p", { className: "infoItem", id: "flightNumber" }),
                            React.createElement("p", { className: "infoItem", id: "aircraftNumber" }),
                            React.createElement("p", { className: "infoItem", id: "status" })
                        ),
                        React.createElement(
                            "div",
                            { id: "options" },
                            React.createElement(
                                "div",
                                { className: "statusOption", id: "flightStarted" },
                                React.createElement(
                                    "p",
                                    null,
                                    "Starting Flight"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "statusOption", id: "flightFinished" },
                                React.createElement(
                                    "p",
                                    null,
                                    "Flight Finished"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "statusOption", id: "needsMaintenance" },
                                React.createElement(
                                    "p",
                                    null,
                                    "Needs maintenance"
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));