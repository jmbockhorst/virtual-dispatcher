var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pilots = [];

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

                    //Set button if checking in or out
                    setAction(pilot.id);
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

            //Set button if checking in or out
            setAction(id);
        });
    });

    //When checkin/out button is clicked
    $("#checkinForm").submit(function (event) {
        event.preventDefault();

        //Get name and pilot_id
        var name = $("#name").val();
        var pilot_id = $("#name").attr("data-id");
        $("#name").val("");

        //Get checkin or checkout
        var type = $("#checkin").attr("name");

        if (type == "checkin") {
            $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/availability',
                data: JSON.stringify({
                    pilotId: pilot_id
                }),
                success: function success() {
                    var good = true;
                    //Test if good message
                    if (good) {
                        //Try to schedule flight
                        $(".message").html("You have checked in successfully");
                        $(".message").attr("id", "goodMessage");
                    } else {
                        $(".message").html("Your name was not found in the system");
                        $(".message").attr("id", "badMessage");
                    }
                    //Check if plane is available
                    //Create flight and give info if there is
                    //If not, put on waiting list
                    //Set message id for good or bad message

                    //Fade out message after 3 seconds
                    setTimeout(function () {
                        $(".message").fadeOut("slow", function () {
                            $(".message").html("");
                            $(".message").fadeIn("fast");
                        });
                    }, 3000);
                }
            });
        } else {
            $.ajax({
                type: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/availability',
                data: JSON.stringify({
                    pilotId: pilot_id
                }),
                success: function success() {
                    var good = true;
                    //Test if good message
                    if (good) {
                        //Try to schedule flight
                        $(".message").html("You have checked out successfully");
                        $(".message").attr("id", "goodMessage");
                    } else {
                        $(".message").html("Your name was not found in the system");
                        $(".message").attr("id", "badMessage");
                    }

                    //Fade out message after 10 seconds
                    setTimeout(function () {
                        $(".message").fadeOut("slow", function () {
                            $(".message").html("");
                            $(".message").fadeIn("fast");
                        });
                    }, 10000);
                }
            });
        }

        //Reset checkin/out button
        $("#checkin").attr("name", "checkin/out");
        $("#checkin").val("Enter a valid name");
        $("#checkin").attr("disabled", true);
    });
});

function setAction(id) {
    var availabilitySocket = new WebSocket('ws://' + window.location.host + "/ws/availability");

    availabilitySocket.onmessage = function (message) {
        var availabilityList = JSON.parse(message.data);

        var action = "checkin";
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = availabilityList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var pilot = _step.value;

                if (pilot.pilotId == id) {
                    action = "checkout";
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

        $("#checkin").attr("name", action);

        if (action == "checkin") {
            $("#checkin").val("Check In");
        } else {
            $("#checkin").val("Check Out");
        }

        $("#checkin").attr("disabled", false);
    };
}

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
                        "Check In/Out"
                    )
                ),
                React.createElement(
                    "div",
                    { id: "formFields" },
                    React.createElement(
                        "form",
                        { action: "#", method: "POST", id: "checkinForm", autoComplete: "off" },
                        React.createElement("input", { type: "text", name: "name", id: "name", placeholder: "Enter name" }),
                        React.createElement("div", { id: "searchList" }),
                        React.createElement("input", { type: "submit", id: "checkin", name: "checkin/out", value: "Enter a valid name", disabled: true })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "message" },
                    " "
                )
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));