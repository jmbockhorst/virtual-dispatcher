var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var host = "";

$(document).ready(function () {
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

    $("#needsMaintenance").on("click", function () {});
});

function StatusOption(props) {
    return React.createElement(
        "div",
        { className: "statusOption", id: props.id, onClick: props.onPress },
        React.createElement(
            "p",
            null,
            props.name
        )
    );
}

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            pilots: [],
            flight: { id: 0, aircraftId: 0, started: false, completed: false },
            loggedIn: false,
            pilotName: "",
            pilotId: null
        };

        _this.loadData();
        _this.loadFlightInfo();
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
        key: "loadFlightInfo",
        value: function loadFlightInfo() {
            var _this3 = this;

            flightSocket = new WebSocket('ws://' + window.location.host + "/ws/flights");

            flightSocket.onmessage = function (message) {
                var flightList = JSON.parse(message.data);

                // Reverse for loop to get latest flight
                for (var i = flightList.length - 1; i >= 0; i--) {
                    if (flightList[i].pilotId == _this3.state.pilotId) {
                        _this3.setState({
                            flight: flightList[i]
                        });

                        break;
                    }
                }
            };
        }
    }, {
        key: "loginHandler",
        value: function loginHandler(e) {
            e.preventDefault();

            //Get name and pilot_id
            var name = $("#name").val();
            var pilot_id = $("#name").attr("data-id");
            $("#name").val("");

            this.setState({
                pilotName: name,
                pilotId: pilot_id,
                loggedIn: true
            });

            this.loadFlightInfo();
        }
    }, {
        key: "startFlight",
        value: function startFlight() {
            $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: host + '/api/flights/' + this.state.flight.id,
                data: JSON.stringify({
                    started: true
                })
            });
        }
    }, {
        key: "finishFlight",
        value: function finishFlight() {
            $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: host + '/api/flights/' + this.state.flight.id,
                data: JSON.stringify({
                    completed: true
                })
            });
        }
    }, {
        key: "needsMaintenance",
        value: function needsMaintenance() {
            $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: host + '/api/aircraft/' + this.state.flight.aircraftId,
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
                url: host + '/api/flights/' + this.state.flight.id,
                data: JSON.stringify({
                    completed: true
                })
            });
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

                    // Chose the login or flight view based on login status
                    !this.state.loggedIn ? React.createElement(
                        "div",
                        { id: "loginView" },
                        React.createElement(
                            "form",
                            { id: "loginForm", action: "#", autoComplete: "off", method: "POST", onSubmit: this.loginHandler.bind(this) },
                            React.createElement("input", { type: "text", name: "name", id: "name", placeholder: "Enter name" }),
                            React.createElement("div", { id: "searchList" }),
                            React.createElement("input", { type: "submit", id: "login", value: "Login" })
                        )
                    ) : React.createElement(
                        "div",
                        { id: "flightView" },
                        React.createElement(
                            "div",
                            { id: "flightInfo" },
                            React.createElement(
                                "p",
                                { className: "infoItem", id: "pilotName" },
                                this.state.pilotName
                            ),
                            React.createElement(
                                "p",
                                { className: "infoItem", id: "flightNumber" },
                                "Flight# ",
                                this.state.flight.id
                            ),
                            React.createElement(
                                "p",
                                { className: "infoItem", id: "aircraftNumber" },
                                "Aircraft ",
                                this.state.flight.aircraftId
                            ),
                            React.createElement(
                                "p",
                                { className: "infoItem", id: "status" },
                                this.state.flight.completed ? "Flight completed" : this.state.flight.started ? "Flight in progress" : "Flight not started"
                            )
                        ),

                        // Show the options only if the flight is not completed
                        !this.state.flight.completed && React.createElement(
                            "div",
                            { id: "options" },

                            // Show the proper buton based on the flight status
                            !this.state.flight.started ? React.createElement(StatusOption, { id: "flightStarted", name: "Starting Flight", onPress: this.startFlight.bind(this) }) : React.createElement(StatusOption, { id: "flightFinished", name: "Flight Finished", onPress: this.finishFlight.bind(this) }),
                            React.createElement(StatusOption, { id: "needsMaintenance", name: "Needs Maintenance", onPress: this.needsMaintenance.bind(this) })
                        )
                    )
                )
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));