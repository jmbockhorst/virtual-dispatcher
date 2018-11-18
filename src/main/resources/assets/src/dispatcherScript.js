
var host = "http://lvh.me:8080";
// host = "";

function getTimeDiff(oldTime){
    var time = new Date().getTime();

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
class InfoImage extends React.Component {
    render(){
        return <img className="infoImg" src={'images/' + this.props.name}/>
    }
}

class InfoText extends React.Component {
    render(){
        return (
            <div className="infoText" id={this.props.id}>{this.props.text}</div>
        );
    }
}

class Plane extends React.Component {
    maintenanceChanged(planeId, event){
        //Change maintenance mode
        $.ajax({
            type: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            url: host + '/api/aircraft/' + planeId,
            data: JSON.stringify({
                
                operational: (event.target.checked ? false : true),
            })
        });
    }

    render(){
        return (
            <div className="plane">
                <div className="planeBox">
                    {
                        this.props.pilot != null ?
                        //Render this code if there is a flight
                        [
                            <div className="planeInfoBox" key='1'>
                                <InfoImage name="pilot.png"/>
                                <InfoText id="pilotName" text={this.props.pilot}/>
                            </div>,
                            <div className="planeInfoBox" key='2'>
                                <InfoImage name="zone.png"/>
                                <InfoText id="zone" text={'Zone ' + this.props.zone}/>
                            </div>
                        ]
                        :
                        //Else render this code
                        <div className="planeInfoBox" id="maintenanceBox">
                            <InfoImage name="maintenance.png"/>
                            <InfoText id="maintenance" text="Maintenance"/>
                            <form action="#" method="POST">
                                {
                                    this.props.plane.operational ? 
                                    <input type="checkbox" id="maintenanceTrigger" onChange={(e) => this.maintenanceChanged(this.props.plane.id, e)} />
                                    :
                                    <input type="checkbox" id="maintenanceTrigger" onChange={(e) => this.maintenanceChanged(this.props.plane.id, e)} defaultChecked="true"/>
                                }
                            </form>
                        </div>
                    }

                    {
                        this.props.pilot != null &&
                        //Show status if there is a flight
                        <div className="planeInfoBox">
                            <InfoImage name="status.png"/>
                            <InfoText text={this.props.started ? "In the air" : "On the ground"}/>
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
                for(i = 0; i < this.props.pilots.length; i++) {
                    if(this.props.pilots[i].id === flight.pilotId){
                        pilot = this.props.pilots[i].firstName + " " + this.props.pilots[i].lastName;
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

//Waiting list React code
class WaitingPilot extends React.Component {
    render(){
        const timeDiff = getTimeDiff(this.props.timeCreated);

        return (
            <div className = "pilot">
                <div className = "pilotBox">
                    <div className = "pilotInfoBoxBig">
                        <InfoImage name="pilot.png"/>
                        <div id="pilotName" className="bigInfoText">{this.props.pilotName}</div>
                    </div>
                    <div className = "pilotInfoBox">
                        <InfoImage name="time.png"/>
                        <InfoText id="waitTime" text={'Has been waiting for ' + timeDiff}/>
                    </div>
                </div>
            </div>
        );
    }
}

class WaitingList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            waitingPilots: [],
        };
    }

    loadData() {
        var url = host + "/api/availability"; 
        $.getJSON(url, (pilotList) => {
            const newAvailabilities = [];
            
            //Sort by time
            pilotList.sort(function(a, b) {
                return a.timeCreated - b.timeCreated;
            });

            pilotList.forEach(function(pilot){
            const newAvails = [];
                newAvailabilities.push(pilot);
            });

            this.setState({
                waitingPilots: newAvailabilities,
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
        const waitingList = this.state.waitingPilots.map((p, i) => {
            var pilotName = "";
            for(i = 0; i < this.props.pilots.length; i++) {
                if(this.props.pilots[i].id === p.pilotId){
                    pilotName = this.props.pilots[i].firstName + " " + this.props.pilots[i].lastName;
                    break;
                }
            }

            return <WaitingPilot key={p.pilotId} pilotName={pilotName} timeCreated={p.timeCreated}/>
        });

        return waitingList;
    }
}

class ListHeader extends React.Component {
    render(){
        return <p class="listHeader">{this.props.text}</p>
    }
}


class MenuItem extends React.Component {
    render(){
        return (
            <tr>
                <td class="tipCellImg">
                    <InfoImage name={this.props.imageName}/>
                </td>
                <td>{this.props.text}</td>
            </tr>
        );
    }
}

class HelpMenu extends React.Component {
    render(){
        return (
            <div id="toolTipInitiator">
                <table id="toolTipTable" class="hidden">
                    <tr>
                        <th colspan="2">Help</th>
                    </tr>
                    <MenuItem text="Assigned Pilot" imageName="pilot.png" />
                    <MenuItem text="Assigned Zone" imageName="zone.png" />
                    <MenuItem text="In/Out Maintenance" imageName="maintenance.png" />
                    <MenuItem text="Plane Status" imageName="status.png" />
                    <MenuItem text="Time Waiting" imageName="time.png" />
                    <tr>
                        <td class="tipCellImg" id="tipColorGreen"></td>
                        <td>Avaliable</td>
                    </tr>
                    <tr>
                        <td class="tipCellImg" id="tipColorGold"></td>
                        <td>In Use</td>
                    </tr>
                    <tr>
                        <td class="tipCellImg" id="tipColorRed"></td>
                        <td>Under Maintenance</td>
                    </tr>
                </table>
                <img id="toolTipImg" src="images/question.png"/>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pilots: [],
        };
    }

    loadData() {
        var url = host + "/api/pilots";
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
        return (
            [
            <div id="planeInfo" class="column">
                <ListHeader text="Planes" />
                <PlaneList pilots={this.state.pilots} />
            </div>
            ,
            <div id="waitingList" class="column">
                <ListHeader text="Waiting List" />
                <WaitingList pilots={this.state.pilots} />
            </div>
            ,
            <HelpMenu />
            ]
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);