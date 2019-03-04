import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './css/baseStyle.css';
import './css/checkinStyle.css';
import logo from './images/logo.png';
import SearchList from './searchList.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pilots: [],
            availabilities: [],
            searchInput: "",
            message: "",
            messageType: "",
            showMessage: false,
            action: "",
            validName: false,
            pilotId: 0,
        }

        this.inputBox = React.createRef();

        this.loadData();
    }

    loadData() {
        var pilotSocket = new WebSocket('ws://' + window.location.host + "/ws/pilots");
        var availabilitySocket = new WebSocket('ws://' + window.location.host + "/ws/availability");

        pilotSocket.onmessage = (message) => {
            var pilotList = JSON.parse(message.data);
            const newPilots = [];
            pilotList.forEach(function (pilot) {
                newPilots.push(pilot);
            });

            this.setState({
                pilots: newPilots,
            });
        }

        availabilitySocket.onmessage = (message) => {
            var availabilityList = JSON.parse(message.data);
            const newAvailabilities = [];
            availabilityList.forEach(function (availability) {
                newAvailabilities.push(availability);
            });

            this.setState({
                availabilities: newAvailabilities,
            });
        }
    }

    searchInput(e) {
        this.setState({
            searchInput: e.target.value,
        });

        // Get pilot name
        var name = e.target.value;

        // Check if pilot name is valid
        var found = false;
        var id = 0;
        this.state.pilots.forEach((pilot) => {
            const fullName = pilot.firstName + " " + pilot.lastName;
            if (fullName == name) {
                found = true;
                id = pilot.id;
            }
        });

        if (found) {
            this.setState({
                validName: true,
                pilotId: id,
            });

            // Determine if they should checkin or checkout
            var availabilityFound = false;
            this.state.availabilities.forEach((avail) => {
                if (avail.pilotId == id) {
                    availabilityFound = true;
                }
            });

            if (availabilityFound) {
                this.setState({
                    action: "checkout",
                });
            } else {
                this.setState({
                    action: "checkin",
                });
            }
        } else {
            this.setState({
                action: "",
                validName: false,
            });
        }
    }

    loginHandler(e) {
        e.preventDefault();

        if (this.state.validName) {
            // Check the user check in or out
            if (this.state.action == "checkin") {
                this.checkIn();
            } else {
                this.checkOut();
            }

            // Reset the input field
            this.inputBox.current.value = "";

            // Reset the action and searchInput variables
            this.setState({
                action: "",
                searchInput: "",
            });
        } else {
            this.setMessage("Your name was not found in the system", "bad");
        }
    }

    checkIn() {
        const main = this;

        $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/availability',
            data: JSON.stringify({
                pilotId: this.state.pilotId
            }),
            success: function () {
                // Send a message if the ajax call is successful
                main.setMessage("You have checked in successfully", "good");
            }
        });
    }

    checkOut() {
        const main = this;

        $.ajax({
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/availability',
            data: JSON.stringify({
                pilotId: this.state.pilotId
            }),
            success: function () {
                // Send a message if the ajax call is successful
                main.setMessage("You have checked out successfully", "good");
            }
        });
    }

    setMessage(message, messageType) {
        this.setState({
            message: message,
            messageType: messageType,
            showMessage: true,
        });

        // Fade out message after 5 seconds
    }

    render() {
        return (
            <div className="middleDiv">
                <div id="header">
                    <img src={logo} className="logo" />
                    <h1 id="headerText">Check In/Out</h1>
                </div>
                <div id="formFields">
                    <form action="#" method="POST" id="checkinForm" autoComplete="off" onSubmit={this.loginHandler.bind(this)}>
                        <input ref={this.inputBox} type="text" name="name" id="name" placeholder="Enter name" onChange={this.searchInput.bind(this)} />
                        <SearchList searchInput={this.state.searchInput} pilots={this.state.pilots} inputBox={this.inputBox} />
                        <input type="submit" id="checkin" value={this.state.action == "" ? "Enter a valid name" :
                            this.state.action == "checkin" ? "Check In" : "Check Out"} />
                    </form>
                </div>
                <CSSTransition
                    in={this.state.showMessage}
                    timeout={6000}
                    classNames="message"
                    unmountOnExit
                    onEntered={() => {
                        this.setState({
                            showMessage: false,
                        });
                    }}>
                    <div className="message" id={this.state.messageType == "good" ? "goodMessage" : "badMessage"}>{this.state.message}</div>
                </CSSTransition>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);