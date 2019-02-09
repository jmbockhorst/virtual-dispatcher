import React from 'react';
import ReactDOM from 'react-dom';
import './css/baseStyle.css';
import './css/statusStyle.css';
import logo from './images/logo.png';

const host = "localhost:8080";

function StatusOption(props){
    return (
        <div className="statusOption" id={props.id} onClick={props.onPress}>
            <p>{props.name}</p>
        </div>
    );
}

function SearchItem(props){
    return (
        <div className='searchItem' onClick={props.onPress}>{props.firstName} {props.lastName}</div>
    );
}

class SearchList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            found: false,
            foundName: "",
        }
    }

    handleClick(e){
        this.props.inputBox.current.value = e.target.innerHTML;

        this.setState({
            found: true,
            foundName: e.target.innerHTML,
        })
    }

    render() {
        const name = this.props.searchInput;

        var searchItems = [];

        if(!this.state.found){
            const main = this;
            if(name != ""){
                this.props.pilots.forEach(function(pilot){
                    //Check if full name is equal to searched
                    //Check if only part of searched name is found
                    var fullName = pilot.firstName + " " + pilot.lastName;
                    if(fullName.toLowerCase() == name.toLowerCase()){
                        main.props.inputBox.current.value = fullName;
                    } else if(pilot.firstName.startsWith(name) || 
                            pilot.firstName.toLowerCase().startsWith(name.toLowerCase()) || 
                            fullName.startsWith(name) || 
                            fullName.toLowerCase().startsWith(name.toLowerCase())){
                        searchItems.push(<SearchItem key={pilot.id} firstName={pilot.firstName} lastName={pilot.lastName} onPress={main.handleClick.bind(main)}/>);
                    }
                });

                //Check last names at the end
                this.props.pilots.forEach(function(pilot){
                    if(pilot.lastName.startsWith(name) || pilot.lastName.toLowerCase().startsWith(name.toLowerCase())){
                        searchItems.push(<SearchItem key={pilot.id} firstName={pilot.firstName} lastName={pilot.lastName} onPress={main.handleClick.bind(main)}/>);
                    }
                });
            }
        } else {
            this.state.found = false;
        }

        return <div id="searchList">{searchItems}</div>;
    }
}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pilots: [],
            flight: {id: 0, aircraftId: 0, started: false, completed: false},
            loggedIn: false,
            pilotName: "",
            pilotId: 0,
            searchInput: "",
        }

        this.inputBox = React.createRef();

        this.loadData();
        this.loadFlightInfo();
    }

    loadData(){
        var pilotSocket = new WebSocket('ws://' + window.location.host + "/ws/pilots");

        pilotSocket.onmessage = (message) => {
            var pilotList = JSON.parse(message.data);
            const newPilots = [];
            pilotList.forEach(function(pilot){
                newPilots.push(pilot);
            });
    
            this.setState({
                pilots: newPilots,
            });
        }
    }

    loadFlightInfo(){
        var flightSocket = new WebSocket('ws://' + window.location.host + "/ws/flights");

        flightSocket.onmessage = (message) => {
            var flightList = JSON.parse(message.data);

            // Reverse for loop to get latest flight
            for(let i = flightList.length - 1; i >= 0; i--){
                if(flightList[i].pilotId == this.state.pilotId){
                    this.setState({
                        flight: flightList[i],
                    });

                    break;
                }
            }
        }
    }

    loginHandler(e){
        e.preventDefault();

        // Get name and pilot_id
        var name = this.inputBox.current.value;
        
        // Check if pilot name is valid
        var found = false;
        var id = 0;
        this.state.pilots.forEach((pilot) => {
            const fullName = pilot.firstName + " " + pilot.lastName;
            if(fullName == name){
                found = true;
                id = pilot.id;
                console.log(id);
            }
        });

        if(found){
            // Reset the input field
            e.target.value = "";

            this.setState({
                pilotName: name,
                pilotId: id,
                loggedIn: true,
            });

            this.loadFlightInfo();
        }
    }

    startFlight(){
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

    finishFlight(){
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

    needsMaintenance(){
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

    searchInput(e){
        this.setState({
            searchInput: e.target.value,
        });
    }

    render(){
        return (
            <div className="middleDiv">
                <div id="header">
                    <img src={logo} className="logo"/>
                    <h1 id="headerText">Flight Status</h1>
                </div>

                <div id="formFields">
                    {
                        // Chose the login or flight view based on login status
                        !this.state.loggedIn ?
                        <div id="loginView">
                            <form id="loginForm" action="#" autoComplete="off" method="POST" onSubmit={this.loginHandler.bind(this)}>
                                <input ref={this.inputBox} type="text" name="name" id="name" placeholder="Enter name" onChange={this.searchInput.bind(this)}/>
                                
                                <SearchList searchInput={this.state.searchInput} pilots={this.state.pilots} inputBox={this.inputBox}/>
                            
                               <input type="submit" id="login" value="Login"/>
                            </form>
                        </div>
                        :
                        <div id="flightView">
                            <div id="flightInfo">
                                <p className="infoItem" id="pilotName">{this.state.pilotName}</p>
                                <p className="infoItem" id="flightNumber">Flight# {this.state.flight.id}</p>
                                <p className="infoItem" id="aircraftNumber">Aircraft {this.state.flight.aircraftId}</p>
                                <p className="infoItem" id="status">
                                    {
                                        this.state.flight.completed ?
                                        "Flight completed"
                                        :
                                        (
                                            this.state.flight.started ?
                                            "Flight in progress"
                                            :
                                            "Flight not started"
                                        )
                                    }
                                </p>
                            </div>
                            {
                                // Show the options only if the flight is not completed
                                !this.state.flight.completed &&
                                <div id="options">
                                    {
                                        // Show the proper buton based on the flight status
                                        !this.state.flight.started ?
                                        <StatusOption id="flightStarted" name="Starting Flight" onPress={this.startFlight.bind(this)}/>
                                        :
                                        <StatusOption id="flightFinished" name="Flight Finished" onPress={this.finishFlight.bind(this)}/>
                                    }

                                    <StatusOption id="needsMaintenance" name="Needs Maintenance" onPress={this.needsMaintenance.bind(this)}/>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);