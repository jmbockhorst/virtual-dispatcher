var host = "";

function ListItem(props){
    return (
        <div className="listItem" id={props.id}>
            <p>{props.name} can now fly Aircraft {props.aircraftId} in Zone {props.zoneId}</p>
        </div>
    );
}

class FlightList extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            lastName: "",
        }
    }

    getPilotName(id){
        for(let pilot of this.props.pilots){
            if(pilot.id == id){
                return pilot.firstName + " " + pilot.lastName;
            }
        }

        return "Unknown Pilot";
    }

    render(){
        var flightList = [];

        const main = this;

        var currentName = "";
        this.props.flights.forEach(function(flight, i){
            //Get pilot name of that flight
            const name = main.getPilotName(flight.pilotId);

            //Add the flight to the waiting room board
            if(i == main.props.flights.length - 1){
                flightList.unshift(<ListItem key={flight.pilotId} name={name} aircraftId={flight.aircraftId} zoneId={flight.zoneId} id="last"/>);
                currentName = name;
            } else {
                flightList.unshift(<ListItem key={flight.pilotId} name={name} aircraftId={flight.aircraftId} zoneId={flight.zoneId} id=""/>);
            }
        });

        if(currentName != this.state.lastName){
            $("#last").effect('highlight', {color: "rgb(150, 0, 0)"}, 1000);
        }

        this.state.lastname = currentName;

        return <div id="flightList">{flightList}</div>;
    }
}

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            pilots: [],
            flights: [],
        }

        this.loadData();
    }

    loadData(){
        var pilotSocket = new WebSocket('ws://' + window.location.host + "/ws/pilots");
        var flightSocket = new WebSocket('ws://' + window.location.host + "/ws/flights");

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

        flightSocket.onmessage = (message) => {
            var flightList = JSON.parse(message.data);
            const newFlights = [];
            flightList.forEach(function(flight){
                //Put each flight in array spot associated with plane
                if(!flight.completed && !flight.started){
                    newFlights.push(flight);
                }
            });

            this.setState({
                flights: newFlights,
            });
        }
    }

    render(){
        return (
            <div className="middleDiv">
                <div id="header">
                    <h1 id="headerText">Next Flights</h1>
                </div>

                <FlightList flights={this.state.flights} pilots={this.state.pilots}/>
                
                <img src="images/logo.png" className="logo"/>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);