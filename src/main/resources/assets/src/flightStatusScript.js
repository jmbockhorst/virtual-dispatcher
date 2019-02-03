var pilots = [];
var pilotName = "";
var pilotId = "";
var currentFlight;

var host = "";

$(document).ready(function(){
    var loggedIn  = false;

    //Show correct page based on login status
    if(!loggedIn){
        showLogin()
    } else {
        showFlight();
    }

    var pilotSocket = new WebSocket('ws://' + window.location.host + "/api/pilots");

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

    //When checkin/out button is clicked
    $("#loginForm").submit(function(event){
        event.preventDefault();

        //Get name and pilot_id
        var name = $("#name").val();
        var pilot_id = $("#name").attr("data-id");
        $("#name").val("");

        pilotName = name;
        pilotId = pilot_id;
        refreshStatus();
    });

    function showLogin(){
        $("#loginView").addClass("visible");
        $("#loginView").removeClass("hidden");
        $("#flightView").addClass("hidden");
        $("#flightView").removeClass("visible");
    }

    function refreshStatus(){
        loadFlightInfo();

        setInterval(function(){
            loadFlightInfo();
        }, 1000);
    }
    
    function showFlight(){
        $("#loginView").addClass("hidden");
        $("#loginView").removeClass("visible");
        $("#flightView").addClass("visible");
        $("#flightView").removeClass("hidden");
    }

    function loadFlightInfo(){
        var flightSocket = new WebSocket('ws://' + window.location.host + "/api/flights");

        flightSocket.onmessage = (message) => {
            var flightList = JSON.parse(message.data);

            for(let flight of flightList){
                if(flight.pilotId == pilotId){
                    currentFlight = flight;

                    $("#flightNumber").html("Flight# " + flight.id);
                    $("#aircraftNumber").html("Aircraft " + flight.aircraftId);
                    $("#pilotName").html(pilotName);

                    if(flight.completed){
                        //Flight is completed
                        $("#status").html("Flight Completed");

                        $("#options").addClass("hidden");
                        $("#options").removeClass("visible");
                    } else {
                        $("#options").addClass("visible");
                        $("#options").removeClass("hidden");

                        if(flight.started){
                            //Flight is started but not completed
                            $("#status").html("Flight in progress");

                            $("#flightStarted").addClass("hidden");
                            $("#flightStarted").removeClass("visible")

                            $("#flightFinished").addClass("visible");
                            $("#flightFinished").removeClass("hidden")

                        } else {
                            //Flight is not started
                            $("#status").html("Flight not started");

                            $("#flightStarted").addClass("visible");
                            $("#flightStarted").removeClass("hidden")

                            $("#flightFinished").addClass("hidden");
                            $("#flightFinished").removeClass("visible");
                        }
                    }

                    showFlight();
                }
            }
        }
    }

    $("#flightStarted").on("click", function(){
        $.ajax({
            type: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            url: host + '/api/flights/' + currentFlight.id,
            data: JSON.stringify({
                started: true
            })
        });
    });

    $("#flightFinished").on("click", function(){
        $.ajax({
            type: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            url: host + '/api/flights/' + currentFlight.id,
            data: JSON.stringify({
                completed: true
            })
        });
    });

    $("#needsMaintenance").on("click", function(){
        $.ajax({
            type: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            url: host + '/api/aircraft/' + currentFlight.aircraftId,
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
            url: host + '/api/flights/' + currentFlight.id,
            data: JSON.stringify({
                completed: true
            })
        });
    });
});

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pilots: [],
        }

        this.loadData();
    }

    loadData(){
        var pilotSocket = new WebSocket('ws://' + window.location.host + "/api/pilots");

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

    render(){
        return (
            <div className="middleDiv">
                <div id="header">
                    <img src="images/logo.png" className="logo"/>
                    <h1 id="headerText">Flight Status</h1>
                </div>

                <div id="formFields">
                    <div id="loginView" className="hidden">
                        <form id="loginForm" action="#" autoComplete="off" method="POST">
                            <input type="text" name="name" id="name" placeholder="Enter name"/>
                            <div id="searchList"></div>
                            <input type="submit" id = "login" value="Login"/>
                        </form>
                    </div>

                    <div id="flightView" className="hidden">
                        <div id="flightInfo">
                            <p className="infoItem" id="pilotName"></p>
                            <p className="infoItem" id="flightNumber"></p>
                            <p className="infoItem" id="aircraftNumber"></p>
                            <p className="infoItem" id="status"></p>
                        </div>

                        <div id="options">
                            <div className="statusOption" id="flightStarted">
                                <p>Starting Flight</p>
                            </div>
                            <div className="statusOption" id="flightFinished">
                                <p>Flight Finished</p>
                            </div>
                            <div className="statusOption" id="needsMaintenance">
                                <p>Needs maintenance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);