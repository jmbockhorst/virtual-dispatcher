var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var host = "http://lvh.me:8080";
// host = "";

$(document).ready(function () {
    loadWaitingList();
});

$("#planesList").on('change', '#maintenanceTrigger', function () {
    var planeId = $(this).attr("data-id");
    if ($(this).is(':checked')) {
        //Maintenance mode is now on
        $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: host + '/api/aircraft/' + planeId,
            data: JSON.stringify({
                operational: false
            })
        });
    } else {
        //Maintenance mode is now off
        $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: host + '/api/aircraft/' + planeId,
            data: JSON.stringify({
                operational: true
            })
        });
    }
});

function loadWaitingList() {
    var waitingList = [];

    setInterval(function () {
        var url = host + "/api/availability";
        $.getJSON(url, function (waitingPilots) {
            waitingPilots.sort(function (a, b) {
                return a.timeCreated - b.timeCreated;
            });

            var waitList = "";

            var counter = 0;
            waitingPilots.forEach(function (pilot) {
                var timeDiff = getTimeDiff(pilot.timeCreated);

                var url = host + "/api/pilots";
                $.getJSON(url, function (p) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = p[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var pilotInfo = _step.value;

                            if (pilotInfo.id == pilot.pilotId) {
                                var name = pilotInfo.firstName + " " + pilotInfo.lastName;
                                var newList = '<div class = "pilot"><div class = "pilotBox"><div class = "pilotInfoBoxBig">';
                                newList += '<img class="infoImg" src="images/pilot.png"/> <div id="pilotName" class="bigInfoText">';
                                newList += name;
                                newList += '</div></div><div class = "pilotInfoBox"><img class="infoImg" src="images/time.png"/>';
                                newList += '<div id="waitTime" class="infoText">';
                                newList += 'Has been waiting for ' + timeDiff;
                                newList += '</div> </div></div></div>';

                                waitingList[counter++] = newList;
                                break;
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

                    var htmlList = "";
                    waitingList.forEach(function (item) {
                        htmlList += item;
                    });

                    $("#pilotList").html(htmlList);
                });
            });

            waitingList = waitingList.slice(0, waitingPilots.length);

            var htmlList = "";
            waitingList.forEach(function (item) {
                htmlList += item;
            });

            $("#pilotList").html(htmlList);
        });
    }, 1000);
}

function getTimeDiff(oldTime) {
    var time = Date.now();
    var timeOffset = new Date().getTimezoneOffset() * 60 * 1000;
    time -= timeOffset;

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

var Plane = function (_React$Component) {
    _inherits(Plane, _React$Component);

    function Plane() {
        _classCallCheck(this, Plane);

        return _possibleConstructorReturn(this, (Plane.__proto__ || Object.getPrototypeOf(Plane)).apply(this, arguments));
    }

    _createClass(Plane, [{
        key: "render",
        value: function render() {
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
                        React.createElement("img", { className: "infoImg", src: "images/pilot.png" }),
                        React.createElement(
                            "div",
                            { className: "infoText", id: "pilotName" },
                            this.props.pilot
                        )
                    ), React.createElement(
                        "div",
                        { className: "planeInfoBox", key: "2" },
                        React.createElement("img", { className: "infoImg", src: "images/zone.png" }),
                        React.createElement(
                            "div",
                            { className: "infoText", id: "zone" },
                            "Zone ",
                            this.props.zone
                        )
                    )] :
                    //Else render this code
                    React.createElement(
                        "div",
                        { className: "planeInfoBox", id: "maintenanceBox" },
                        React.createElement("img", { className: "infoImg", src: "images/maintenance.png" }),
                        React.createElement(
                            "div",
                            { id: "maintenance", className: "infoText" },
                            "Maintenance"
                        ),
                        React.createElement(
                            "form",
                            { action: "#", method: "POST" },
                            this.props.plane.operational ? React.createElement("input", { type: "checkbox", id: "maintenanceTrigger", "data-id": this.props.plane.id }) : React.createElement("input", { type: "checkbox", id: "maintenanceTrigger", "data-id": this.props.plane.id, defaultChecked: "true" })
                        )
                    ),
                    this.props.pilot != null &&
                    //Show status if there is a flight
                    React.createElement(
                        "div",
                        { className: "planeInfoBox" },
                        React.createElement("img", { className: "infoImg", src: "images/status.png" }),
                        React.createElement(
                            "div",
                            { className: "infoText" },
                            this.props.started ? "In the air" : "On the ground"
                        )
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

var PlaneList = function (_React$Component2) {
    _inherits(PlaneList, _React$Component2);

    function PlaneList(props) {
        _classCallCheck(this, PlaneList);

        var _this2 = _possibleConstructorReturn(this, (PlaneList.__proto__ || Object.getPrototypeOf(PlaneList)).call(this, props));

        _this2.state = {
            planes: [],
            flights: [],
            pilots: []
        };
        return _this2;
    }

    _createClass(PlaneList, [{
        key: "loadData",
        value: function loadData() {
            var _this3 = this;

            var url = host + "/api/aircraft";
            $.getJSON(url, function (planesList) {
                var newPlanes = [];
                planesList.forEach(function (plane) {
                    newPlanes.push(plane);
                });

                _this3.setState({
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

                _this3.setState({
                    flights: newFlights
                });
            });

            url = host + "/api/pilots";
            $.getJSON(url, function (pilotList) {
                var newPilots = [];
                pilotList.forEach(function (pilot) {
                    newPilots.push(pilot);
                });

                _this3.setState({
                    pilots: newPilots
                });
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this4 = this;

            this.timerID = setInterval(function () {
                return _this4.loadData();
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
            var _this5 = this;

            var planesList = this.state.planes.map(function (p, i) {
                var flight = _this5.state.flights[i];
                var pilot = null;
                var zone = null;
                var started = null;

                if (flight != null) {
                    for (i = 0; i < _this5.state.pilots.length; i++) {
                        if (_this5.state.pilots[i].id === flight.pilotId) {
                            pilot = _this5.state.pilots[i].firstName + " " + _this5.state.pilots[i].lastName;
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

ReactDOM.render(React.createElement(PlaneList, null), document.getElementById("planesList"));