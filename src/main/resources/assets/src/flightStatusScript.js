var host = "";

$(document).ready(function(){
    var pilotSocket = new WebSocket('ws://' + window.location.host + "/ws/pilots");

    pilotSocket.onmessage = (message) => {
        var pilotList = JSON.parse(message.data);
        const newPilots = [];
        pilotList.forEach(function(pilot){
            newPilots.push(pilot);
        });

        pilots = newPilots;
    }

    //When name box is typed into
    $("#name").on("input", function() {
        $("#searchList").empty();
        var name = this.value;
        if(name != ""){
            pilots.forEach(function(pilot){
                //Check if full name is equal to searched
                //Check if only part of searched name is found
                var fullName = pilot.firstName + " " + pilot.lastName;
                if(fullName.toLowerCase() == name.toLowerCase()){
                    $("#name").val(fullName);
                    $("#name").attr("data-id", pilot.id);
                } else if(pilot.firstName.startsWith(name) || pilot.firstName.toLowerCase().startsWith(name.toLowerCase()) || 
                   fullName.startsWith(name) || fullName.toLowerCase().startsWith(name.toLowerCase())
                ){
                    $("#searchList").append("<div class='searchItem' data-id=" + pilot.id + ">" + pilot.firstName + " " + pilot.lastName + "</div>");
                }
            });

            //Check last names at the end
            pilots.forEach(function(pilot){
                if(pilot.lastName.startsWith(name) || pilot.lastName.toLowerCase().startsWith(name.toLowerCase())){
                    $("#searchList").append("<div class='searchItem' data-id=" + pilot.id + ">" + pilot.firstName + " " + pilot.lastName + "</div>");
                }
            });
        }

        $(".searchItem").on("click", function() {
            $("#name").val($(this).html());
            var id = $(this).attr("data-id");
            $("#name").attr("data-id", id);
            $("#searchList").empty();
        });
    });

    $("#needsMaintenance").on("click", function(){
        
    });
});

function StatusOption(props){
    return (
        <div className="statusOption" id={props.id} onClick={props.onPress}>
            <p>{props.name}</p>
        </div>
    );
}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pilots: [],
            flight: {id: 0, aircraftId: 0, started: false, completed: false},
            loggedIn: false,
            pilotName: "",
            pilotId: null,
        }

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
        flightSocket = new WebSocket('ws://' + window.location.host + "/ws/flights");

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

        //Get name and pilot_id
        var name = $("#name").val();
        var pilot_id = $("#name").attr("data-id");
        $("#name").val("");

        this.setState({
            pilotName: name,
            pilotId: pilot_id,
            loggedIn: true,
        });

        this.loadFlightInfo();
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

    render(){
        return (
            <div className="middleDiv">
                <div id="header">
                    <img src="images/logo.png" className="logo"/>
                    <h1 id="headerText">Flight Status</h1>
                </div>

                <div id="formFields">
                    {
                        // Chose the login or flight view based on login status
                        !this.state.loggedIn ?
                        <div id="loginView">
                            <form id="loginForm" action="#" autoComplete="off" method="POST" onSubmit={this.loginHandler.bind(this)}>
                                <input type="text" name="name" id="name" placeholder="Enter name"/>
                                <div id="searchList"></div>
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