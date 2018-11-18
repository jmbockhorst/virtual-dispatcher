var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var host = "http://lvh.me:8080";
// host = "";

function getTimeDiff(oldTime) {
    var time = new Date().getTime();

    var timeDiff;
    var hoursDiff = 0;

    var millsDiff = time - oldTime;
    var secondsDiff = millsDiff / 1000;
    var minutesDiff = Math.floor(secondsDiff / 60) % 60;
    var hoursDiff = Math.floor(secondsDiff / 60 / 60);

    if (hoursDiff == 0) {
        timeDiff = minutesDiff + " minutes";
    } else {
        timeDiff = hoursDiff + " hours and " + minutesDiff + " minutes";
    }

    //Take off last s if minute is 1
    if (minutesDiff == 1) {
        timeDiff = timeDiff.substr(0, timeDiff.length - 1);
    }

    return timeDiff;
}

$(document).ready(function () {
    $("#toolTipTable").hide();
    $("#toolTipTable").removeClass("hidden");

    $("#toolTipImg").on("mouseenter", function () {
        $("#toolTipTable").fadeIn("fast");
    });

    $("#toolTipTable").on("mouseleave", function () {
        $("#toolTipTable").fadeOut("fast");
    });

    $("#toolTipImg").on("mouseleave", function (event) {
        //Dont hide if leaving up
        if (event.pageY > $("#toolTipImg").offset().top) {
            $("#toolTipTable").fadeOut("fast");
        }
    });
});

//New React code

var InfoImage = function (_React$Component) {
    _inherits(InfoImage, _React$Component);

    function InfoImage() {
        _classCallCheck(this, InfoImage);

        return _possibleConstructorReturn(this, (InfoImage.__proto__ || Object.getPrototypeOf(InfoImage)).apply(this, arguments));
    }

    _createClass(InfoImage, [{
        key: "render",
        value: function render() {
            return React.createElement("img", { className: "infoImg", src: 'images/' + this.props.name });
        }
    }]);

    return InfoImage;
}(React.Component);

var InfoText = function (_React$Component2) {
    _inherits(InfoText, _React$Component2);

    function InfoText() {
        _classCallCheck(this, InfoText);

        return _possibleConstructorReturn(this, (InfoText.__proto__ || Object.getPrototypeOf(InfoText)).apply(this, arguments));
    }

    _createClass(InfoText, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "infoText", id: this.props.id },
                this.props.text
            );
        }
    }]);

    return InfoText;
}(React.Component);

var Plane = function (_React$Component3) {
    _inherits(Plane, _React$Component3);

    function Plane() {
        _classCallCheck(this, Plane);

        return _possibleConstructorReturn(this, (Plane.__proto__ || Object.getPrototypeOf(Plane)).apply(this, arguments));
    }

    _createClass(Plane, [{
        key: "maintenanceChanged",
        value: function maintenanceChanged(planeId, event) {
            //Change maintenance mode
            $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: host + '/api/aircraft/' + planeId,
                data: JSON.stringify({

                    operational: event.target.checked ? false : true
                })
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            return React.createElement(
                "div",
                { className: "plane" },
                React.createElement(
                    "div",
                    { className: "planeBox" },
                    this.props.pilot != null ?
                    //Render this code if there is a flight
                    [React.createElement(
                        "div",
                        { className: "planeInfoBox", key: "1" },
                        React.createElement(InfoImage, { name: "pilot.png" }),
                        React.createElement(InfoText, { id: "pilotName", text: this.props.pilot })
                    ), React.createElement(
                        "div",
                        { className: "planeInfoBox", key: "2" },
                        React.createElement(InfoImage, { name: "zone.png" }),
                        React.createElement(InfoText, { id: "zone", text: 'Zone ' + this.props.zone })
                    )] :
                    //Else render this code
                    React.createElement(
                        "div",
                        { className: "planeInfoBox", id: "maintenanceBox" },
                        React.createElement(InfoImage, { name: "maintenance.png" }),
                        React.createElement(InfoText, { id: "maintenance", text: "Maintenance" }),
                        React.createElement(
                            "form",
                            { action: "#", method: "POST" },
                            this.props.plane.operational ? React.createElement("input", { type: "checkbox", id: "maintenanceTrigger", onChange: function onChange(e) {
                                    return _this4.maintenanceChanged(_this4.props.plane.id, e);
                                } }) : React.createElement("input", { type: "checkbox", id: "maintenanceTrigger", onChange: function onChange(e) {
                                    return _this4.maintenanceChanged(_this4.props.plane.id, e);
                                }, defaultChecked: "true" })
                        )
                    ),
                    this.props.pilot != null &&
                    //Show status if there is a flight
                    React.createElement(
                        "div",
                        { className: "planeInfoBox" },
                        React.createElement(InfoImage, { name: "status.png" }),
                        React.createElement(InfoText, { text: this.props.started ? "In the air" : "On the ground" })
                    )
                ),
                this.props.plane.operational ? this.props.pilot != null ? React.createElement("img", { className: "tailBottom", src: "images/tail_inuse.png" }) : React.createElement("img", { className: "tailBottom", src: "images/tail_available.png" }) : React.createElement("img", { className: "tailBottom", src: "images/tail_maintenance.png" }),
                React.createElement("img", { className: "tailTop", src: "images/tail_top.png" }),
                React.createElement(
                    "div",
                    { id: "planeNumber" },
                    this.props.plane.id
                )
            );
        }
    }]);

    return Plane;
}(React.Component);

var PlaneList = function (_React$Component4) {
    _inherits(PlaneList, _React$Component4);

    function PlaneList(props) {
        _classCallCheck(this, PlaneList);

        var _this5 = _possibleConstructorReturn(this, (PlaneList.__proto__ || Object.getPrototypeOf(PlaneList)).call(this, props));

        _this5.state = {
            planes: [],
            flights: []
        };
        return _this5;
    }

    _createClass(PlaneList, [{
        key: "loadData",
        value: function loadData() {
            var _this6 = this;

            var url = host + "/api/aircraft";
            $.getJSON(url, function (planesList) {
                var newPlanes = [];
                planesList.forEach(function (plane) {
                    newPlanes.push(plane);
                });

                _this6.setState({
                    planes: newPlanes
                });
            });

            url = host + "/api/flights?completed=false";
            $.getJSON(url, function (flightList) {
                var newFlights = [];
                flightList.forEach(function (flight) {
                    //Put each flight in array spot associated with plane
                    newFlights[flight.aircraftId - 1] = flight;
                });

                _this6.setState({
                    flights: newFlights
                });
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this7 = this;

            this.timerID = setInterval(function () {
                return _this7.loadData();
            }, 1000);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            clearInterval(this.timerID);
        }
    }, {
        key: "render",
        value: function render() {
            var _this8 = this;

            var planesList = this.state.planes.map(function (p, i) {
                var flight = _this8.state.flights[i];
                var pilot = null;
                var zone = null;
                var started = null;

                if (flight != null) {
                    for (i = 0; i < _this8.props.pilots.length; i++) {
                        if (_this8.props.pilots[i].id === flight.pilotId) {
                            pilot = _this8.props.pilots[i].firstName + " " + _this8.props.pilots[i].lastName;
                            break;
                        }
                    }

                    zone = flight.zoneId;
                    started = flight.started;
                }

                return React.createElement(Plane, { key: p.id, plane: p, pilot: pilot, zone: zone, started: started });
            });

            return planesList;
        }
    }]);

    return PlaneList;
}(React.Component);

//Waiting list React code


var WaitingPilot = function (_React$Component5) {
    _inherits(WaitingPilot, _React$Component5);

    function WaitingPilot() {
        _classCallCheck(this, WaitingPilot);

        return _possibleConstructorReturn(this, (WaitingPilot.__proto__ || Object.getPrototypeOf(WaitingPilot)).apply(this, arguments));
    }

    _createClass(WaitingPilot, [{
        key: "render",
        value: function render() {
            var timeDiff = getTimeDiff(this.props.timeCreated);

            return React.createElement(
                "div",
                { className: "pilot" },
                React.createElement(
                    "div",
                    { className: "pilotBox" },
                    React.createElement(
                        "div",
                        { className: "pilotInfoBoxBig" },
                        React.createElement(InfoImage, { name: "pilot.png" }),
                        React.createElement(
                            "div",
                            { id: "pilotName", className: "bigInfoText" },
                            this.props.pilotName
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "pilotInfoBox" },
                        React.createElement(InfoImage, { name: "time.png" }),
                        React.createElement(InfoText, { id: "waitTime", text: 'Has been waiting for ' + timeDiff })
                    )
                )
            );
        }
    }]);

    return WaitingPilot;
}(React.Component);

var WaitingList = function (_React$Component6) {
    _inherits(WaitingList, _React$Component6);

    function WaitingList(props) {
        _classCallCheck(this, WaitingList);

        var _this10 = _possibleConstructorReturn(this, (WaitingList.__proto__ || Object.getPrototypeOf(WaitingList)).call(this, props));

        _this10.state = {
            waitingPilots: []
        };
        return _this10;
    }

    _createClass(WaitingList, [{
        key: "loadData",
        value: function loadData() {
            var _this11 = this;

            var url = host + "/api/availability";
            $.getJSON(url, function (pilotList) {
                var newAvailabilities = [];

                //Sort by time
                pilotList.sort(function (a, b) {
                    return a.timeCreated - b.timeCreated;
                });

                pilotList.forEach(function (pilot) {
                    var newAvails = [];
                    newAvailabilities.push(pilot);
                });

                _this11.setState({
                    waitingPilots: newAvailabilities
                });
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this12 = this;

            this.timerID = setInterval(function () {
                return _this12.loadData();
            }, 1000);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            clearInterval(this.timerID);
        }
    }, {
        key: "render",
        value: function render() {
            var _this13 = this;

            var waitingList = this.state.waitingPilots.map(function (p, i) {
                var pilotName = "";
                for (i = 0; i < _this13.props.pilots.length; i++) {
                    if (_this13.props.pilots[i].id === p.pilotId) {
                        pilotName = _this13.props.pilots[i].firstName + " " + _this13.props.pilots[i].lastName;
                        break;
                    }
                }

                return React.createElement(WaitingPilot, { key: p.pilotId, pilotName: pilotName, timeCreated: p.timeCreated });
            });

            return waitingList;
        }
    }]);

    return WaitingList;
}(React.Component);

var ListHeader = function (_React$Component7) {
    _inherits(ListHeader, _React$Component7);

    function ListHeader() {
        _classCallCheck(this, ListHeader);

        return _possibleConstructorReturn(this, (ListHeader.__proto__ || Object.getPrototypeOf(ListHeader)).apply(this, arguments));
    }

    _createClass(ListHeader, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "p",
                { "class": "listHeader" },
                this.props.text
            );
        }
    }]);

    return ListHeader;
}(React.Component);

var MenuItem = function (_React$Component8) {
    _inherits(MenuItem, _React$Component8);

    function MenuItem() {
        _classCallCheck(this, MenuItem);

        return _possibleConstructorReturn(this, (MenuItem.__proto__ || Object.getPrototypeOf(MenuItem)).apply(this, arguments));
    }

    _createClass(MenuItem, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "tr",
                null,
                React.createElement(
                    "td",
                    { "class": "tipCellImg" },
                    React.createElement(InfoImage, { name: this.props.imageName })
                ),
                React.createElement(
                    "td",
                    null,
                    this.props.text
                )
            );
        }
    }]);

    return MenuItem;
}(React.Component);

var HelpMenu = function (_React$Component9) {
    _inherits(HelpMenu, _React$Component9);

    function HelpMenu() {
        _classCallCheck(this, HelpMenu);

        return _possibleConstructorReturn(this, (HelpMenu.__proto__ || Object.getPrototypeOf(HelpMenu)).apply(this, arguments));
    }

    _createClass(HelpMenu, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "toolTipInitiator" },
                React.createElement(
                    "table",
                    { id: "toolTipTable", "class": "hidden" },
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "th",
                            { colspan: "2" },
                            "Help"
                        )
                    ),
                    React.createElement(MenuItem, { text: "Assigned Pilot", imageName: "pilot.png" }),
                    React.createElement(MenuItem, { text: "Assigned Zone", imageName: "zone.png" }),
                    React.createElement(MenuItem, { text: "In/Out Maintenance", imageName: "maintenance.png" }),
                    React.createElement(MenuItem, { text: "Plane Status", imageName: "status.png" }),
                    React.createElement(MenuItem, { text: "Time Waiting", imageName: "time.png" }),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement("td", { "class": "tipCellImg", id: "tipColorGreen" }),
                        React.createElement(
                            "td",
                            null,
                            "Avaliable"
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement("td", { "class": "tipCellImg", id: "tipColorGold" }),
                        React.createElement(
                            "td",
                            null,
                            "In Use"
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement("td", { "class": "tipCellImg", id: "tipColorRed" }),
                        React.createElement(
                            "td",
                            null,
                            "Under Maintenance"
                        )
                    )
                ),
                React.createElement("img", { id: "toolTipImg", src: "images/question.png" })
            );
        }
    }]);

    return HelpMenu;
}(React.Component);

var App = function (_React$Component10) {
    _inherits(App, _React$Component10);

    function App(props) {
        _classCallCheck(this, App);

        var _this17 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this17.state = {
            pilots: []
        };
        return _this17;
    }

    _createClass(App, [{
        key: "loadData",
        value: function loadData() {
            var _this18 = this;

            var url = host + "/api/pilots";
            $.getJSON(url, function (pilotList) {
                var newPilots = [];
                pilotList.forEach(function (pilot) {
                    newPilots.push(pilot);
                });

                _this18.setState({
                    pilots: newPilots
                });
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this19 = this;

            this.timerID = setInterval(function () {
                return _this19.loadData();
            }, 1000);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            clearInterval(this.timerID);
        }
    }, {
        key: "render",
        value: function render() {
            return [React.createElement(
                "div",
                { id: "planeInfo", "class": "column" },
                React.createElement(ListHeader, { text: "Planes" }),
                React.createElement(PlaneList, { pilots: this.state.pilots })
            ), React.createElement(
                "div",
                { id: "waitingList", "class": "column" },
                React.createElement(ListHeader, { text: "Waiting List" }),
                React.createElement(WaitingList, { pilots: this.state.pilots })
            ), React.createElement(HelpMenu, null)];
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));