var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var host = "";

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

function SearchItem(props) {
    return React.createElement(
        "div",
        { className: "searchItem", onClick: props.onPress },
        props.firstName,
        " ",
        props.lastName
    );
}

var SearchList = function (_React$Component) {
    _inherits(SearchList, _React$Component);

    function SearchList(props) {
        _classCallCheck(this, SearchList);

        var _this = _possibleConstructorReturn(this, (SearchList.__proto__ || Object.getPrototypeOf(SearchList)).call(this, props));

        _this.state = {
            found: false,
            foundName: ""
        };
        return _this;
    }

    _createClass(SearchList, [{
        key: "handleClick",
        value: function handleClick(e) {
            this.props.inputBox.current.value = e.target.innerHTML;

            this.setState({
                found: true,
                foundName: e.target.innerHTML
            });
        }
    }, {
        key: "render",
        value: function render() {
            var name = this.props.searchInput;

            var searchItems = [];

            if (!this.state.found) {
                var main = this;
                if (name != "") {
                    this.props.pilots.forEach(function (pilot) {
                        //Check if full name is equal to searched
                        //Check if only part of searched name is found
                        var fullName = pilot.firstName + " " + pilot.lastName;
                        if (fullName.toLowerCase() == name.toLowerCase()) {
                            main.props.inputBox.current.value = fullName;
                        } else if (pilot.firstName.startsWith(name) || pilot.firstName.toLowerCase().startsWith(name.toLowerCase()) || fullName.startsWith(name) || fullName.toLowerCase().startsWith(name.toLowerCase())) {
                            searchItems.push(React.createElement(SearchItem, { key: pilot.id, firstName: pilot.firstName, lastName: pilot.lastName, onPress: main.handleClick.bind(main) }));
                        }
                    });

                    //Check last names at the end
                    this.props.pilots.forEach(function (pilot) {
                        if (pilot.lastName.startsWith(name) || pilot.lastName.toLowerCase().startsWith(name.toLowerCase())) {
                            searchItems.push(React.createElement(SearchItem, { key: pilot.id, firstName: pilot.firstName, lastName: pilot.lastName, onPress: main.handleClick.bind(main) }));
                        }
                    });
                }
            } else {
                this.state.found = false;
            }

            return React.createElement(
                "div",
                { id: "searchList" },
                searchItems
            );
        }
    }]);

    return SearchList;
}(React.Component);

var App = function (_React$Component2) {
    _inherits(App, _React$Component2);

    function App(props) {
        _classCallCheck(this, App);

        var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this2.state = {
            pilots: [],
            flight: { id: 0, aircraftId: 0, started: false, completed: false },
            loggedIn: false,
            pilotName: "",
            pilotId: 0,
            searchInput: ""
        };

        _this2.inputBox = React.createRef();

        _this2.loadData();
        _this2.loadFlightInfo();
        return _this2;
    }

    _createClass(App, [{
        key: "loadData",
        value: function loadData() {
            var _this3 = this;

            var pilotSocket = new WebSocket('ws://' + window.location.host + "/ws/pilots");

            pilotSocket.onmessage = function (message) {
                var pilotList = JSON.parse(message.data);
                var newPilots = [];
                pilotList.forEach(function (pilot) {
                    newPilots.push(pilot);
                });

                _this3.setState({
                    pilots: newPilots
                });
            };
        }
    }, {
        key: "loadFlightInfo",
        value: function loadFlightInfo() {
            var _this4 = this;

            flightSocket = new WebSocket('ws://' + window.location.host + "/ws/flights");

            flightSocket.onmessage = function (message) {
                var flightList = JSON.parse(message.data);

                // Reverse for loop to get latest flight
                for (var i = flightList.length - 1; i >= 0; i--) {
                    if (flightList[i].pilotId == _this4.state.pilotId) {
                        _this4.setState({
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

            // Get name and pilot_id
            var name = this.inputBox.current.value;

            // Check if pilot name is valid
            var found = false;
            var id = 0;
            this.state.pilots.forEach(function (pilot) {
                var fullName = pilot.firstName + " " + pilot.lastName;
                console.log(fullName + " vs " + name);
                if (fullName == name) {
                    found = true;
                    id = pilot.id;
                }
            });

            if (found) {
                // Reset the input field
                e.target.value = "";

                this.setState({
                    pilotName: name,
                    pilodId: id,
                    loggedIn: true
                });

                this.loadFlightInfo();
            }
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
        key: "searchInput",
        value: function searchInput(e) {
            this.setState({
                searchInput: e.target.value
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
                            React.createElement("input", { ref: this.inputBox, type: "text", name: "name", id: "name", placeholder: "Enter name", onChange: this.searchInput.bind(this) }),
                            React.createElement(SearchList, { searchInput: this.state.searchInput, pilots: this.state.pilots, inputBox: this.inputBox }),
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