var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var host = "";

function ListItem(props) {
    return React.createElement(
        "div",
        { className: "listItem", id: props.id },
        React.createElement(
            "p",
            null,
            props.name,
            " can now fly Aircraft ",
            props.aircraftId,
            " in Zone ",
            props.zoneId
        )
    );
}

var FlightList = function (_React$Component) {
    _inherits(FlightList, _React$Component);

    function FlightList(props) {
        _classCallCheck(this, FlightList);

        var _this = _possibleConstructorReturn(this, (FlightList.__proto__ || Object.getPrototypeOf(FlightList)).call(this, props));

        _this.state = {
            lastName: ""
        };
        return _this;
    }

    _createClass(FlightList, [{
        key: "getPilotName",
        value: function getPilotName(id) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.props.pilots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var pilot = _step.value;

                    if (pilot.id == id) {
                        return pilot.firstName + " " + pilot.lastName;
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

            return "Unknown Pilot";
        }
    }, {
        key: "render",
        value: function render() {
            var flightList = [];

            var main = this;

            var currentName = "";
            this.props.flights.forEach(function (flight, i) {
                //Get pilot name of that flight
                var name = main.getPilotName(flight.pilotId);

                //Add the flight to the waiting room board
                if (i == main.props.flights.length - 1) {
                    flightList.unshift(React.createElement(ListItem, { key: flight.pilotId, name: name, aircraftId: flight.aircraftId, zoneId: flight.zoneId, id: "last" }));
                    currentName = name;
                } else {
                    flightList.unshift(React.createElement(ListItem, { key: flight.pilotId, name: name, aircraftId: flight.aircraftId, zoneId: flight.zoneId, id: "" }));
                }
            });

            if (currentName != this.state.lastName) {
                $("#last").effect('highlight', { color: "rgb(150, 0, 0)" }, 1000);
            }

            this.state.lastname = currentName;

            return React.createElement(
                "div",
                { id: "flightList" },
                flightList
            );
        }
    }]);

    return FlightList;
}(React.Component);

var App = function (_React$Component2) {
    _inherits(App, _React$Component2);

    function App(props) {
        _classCallCheck(this, App);

        var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this2.state = {
            pilots: [],
            flights: []
        };

        _this2.loadData();
        return _this2;
    }

    _createClass(App, [{
        key: "loadData",
        value: function loadData() {
            var _this3 = this;

            var pilotSocket = new WebSocket('ws://' + window.location.host + "/ws/pilots");
            var flightSocket = new WebSocket('ws://' + window.location.host + "/ws/flights");

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

            flightSocket.onmessage = function (message) {
                var flightList = JSON.parse(message.data);
                var newFlights = [];
                flightList.forEach(function (flight) {
                    //Put each flight in array spot associated with plane
                    if (!flight.completed && !flight.started) {
                        newFlights.push(flight);
                    }
                });

                _this3.setState({
                    flights: newFlights
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
                    React.createElement(
                        "h1",
                        { id: "headerText" },
                        "Next Flights"
                    )
                ),
                React.createElement(FlightList, { flights: this.state.flights, pilots: this.state.pilots }),
                React.createElement("img", { src: "images/logo.png", className: "logo" })
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));