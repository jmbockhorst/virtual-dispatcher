
var host = "http://lvh.me:8080";
// host = "";

$(document).ready(function(){
    loadWaitingList();
});
    
$("#planesList").on('change', '#maintenanceTrigger', function() {
    var planeId = $(this).attr("data-id");
    if($(this).is(':checked')){
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

function loadWaitingList(){
    var waitingList = [];
    
    setInterval(function(){
        var url = host + "/api/availability"; 
        $.getJSON(url, function(waitingPilots) {
            waitingPilots.sort(function(a, b) {
                return a.timeCreated - b.timeCreated;
            });

            var waitList = "";

            var counter = 0;
            waitingPilots.forEach(function(pilot){
                var timeDiff = getTimeDiff(pilot.timeCreated); 
                
                var url = host + "/api/pilots"; 
                $.getJSON(url, function(p) {
                    for(let pilotInfo of p){
                        if(pilotInfo.id == pilot.pilotId){
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

                    var htmlList = "";
                    waitingList.forEach(function(item){
                        htmlList += item;
                    });

                    $("#pilotList").html(htmlList);
                });
            });

            waitingList = waitingList.slice(0, waitingPilots.length);

            var htmlList = "";
            waitingList.forEach(function(item){
                htmlList += item;
            });

            $("#pilotList").html(htmlList);
        });
    }, 1000);
}

function getTimeDiff(oldTime){
    var time = Date.now();
    var timeOffset = (new Date).getTimezoneOffset() * 60 * 1000;
    time -= timeOffset;

    var timeDiff;
    var hoursDiff = 0;

    var millsDiff = time - oldTime;
    var secondsDiff = millsDiff / 1000;
    var minutesDiff = Math.floor(secondsDiff / 60) % 60;
    var hoursDiff = Math.floor(secondsDiff / 60 / 60);
    
    if(hoursDiff == 0){
        timeDiff = minutesDiff + " minutes";
    } else {
        timeDiff = hoursDiff + " hours and " + minutesDiff + " minutes";
    }

    //Take off last s if minute is 1
    if(minutesDiff == 1){
        timeDiff = timeDiff.substr(0, timeDiff.length - 1);
    }

    return timeDiff;
}

$(document).ready(function(){
    $("#toolTipTable").hide();
    $("#toolTipTable").removeClass("hidden");

    $("#toolTipImg").on("mouseenter", function(){
        $("#toolTipTable").fadeIn("fast");
    });

    $("#toolTipTable").on("mouseleave", function(){
        $("#toolTipTable").fadeOut("fast");
    });

    $("#toolTipImg").on("mouseleave", function(event){
        //Dont hide if leaving up
        if(event.pageY > $("#toolTipImg").offset().top){
            $("#toolTipTable").fadeOut("fast");
        }
    });
});

//New React code
class Plane extends React.Component {
    render(){
        return (
            <div className="plane">
                <div className="planeBox">
                    {
                        this.props.pilot != null ?
                        //Render this code if there is a flight
                        [
                            <div className="planeInfoBox" key='1'>
                                <img className="infoImg" src="images/pilot.png"/>
                                <div className="infoText" id="pilotName">{this.props.pilot}</div>
                            </div>,
                            <div className="planeInfoBox" key='2'>
                                <img className="infoImg" src="images/zone.png"/>
                                <div className="infoText" id="zone">Zone {this.props.zone}</div>
                            </div>
                        ]
                        :
                        //Else render this code
                        <div className="planeInfoBox" id="maintenanceBox">
                            <img className="infoImg" src="images/maintenance.png"/>
                            <div id="maintenance" className="infoText">Maintenance</div>
                            <form action="#" method="POST">
                                {
                                    this.props.plane.operational ? 
                                    <input type="checkbox" id="maintenanceTrigger" data-id={this.props.plane.id}/>
                                    :
                                    <input type="checkbox" id="maintenanceTrigger" data-id={this.props.plane.id} defaultChecked="true"/>
                                }
                            </form>
                        </div>
                    }

                    {
                        this.props.pilot != null &&
                        //Show status if there is a flight
                        <div className="planeInfoBox">
                            <img className="infoImg" src="images/status.png"/>
                            <div className="infoText">
                                {
                                    this.props.started ? "In the air" : "On the ground"
                                }
                            </div>
                        </div>
                    }
                </div>
                {
                    this.props.plane.operational ? 
                        this.props.pilot != null ?
                            <img className="tailBottom" src="images/tail_inuse.png"/>
                        :
                            <img className="tailBottom" src="images/tail_available.png"/>
                    :
                        <img className="tailBottom" src="images/tail_maintenance.png"/>
                }
                
                <img className="tailTop" src="images/tail_top.png"/>
                <div id="planeNumber">{this.props.plane.id}</div>
            </div>
        );
    }
}

class PlaneList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            planes: [],
            flights: [],
            pilots: [],
        };
    }

    loadData() {
        var url = host + "/api/aircraft"; 
        $.getJSON(url, (planesList) => {
            const newPlanes = [];
            planesList.forEach(function(plane){
                newPlanes.push(plane);
            });

            this.setState({
                planes: newPlanes,
            });
        });

        url = host + "/api/flights?completed=false";
        $.getJSON(url, (flightList) => {
            const newFlights = [];
            flightList.forEach(function(flight){
                //Put each flight in array spot associated with plane
                newFlights[flight.aircraftId - 1] = flight;
            });

            this.setState({
                flights: newFlights,
            });
        });

        url = host + "/api/pilots";
        $.getJSON(url, (pilotList) => {
            const newPilots = [];
            pilotList.forEach(function(pilot){
                newPilots.push(pilot);
            });

            this.setState({
                pilots: newPilots,
            });
        });
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.loadData(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render(){
        const planesList = this.state.planes.map((p, i) => {
            const flight = this.state.flights[i];
            var pilot = null;
            var zone = null;
            var started = null;

            if(flight != null){
                for(i = 0; i < this.state.pilots.length; i++) {
                    if(this.state.pilots[i].id === flight.pilotId){
                        pilot = this.state.pilots[i].firstName + " " + this.state.pilots[i].lastName;
                        break;
                    }
                }

                zone = flight.zoneId;
                started = flight.started;
            }

            return <Plane key={p.id} plane={p} pilot={pilot} zone={zone} started={started}/>
        });

        return planesList;
    }
}

ReactDOM.render(
    <PlaneList />,
    document.getElementById("planesList")
);