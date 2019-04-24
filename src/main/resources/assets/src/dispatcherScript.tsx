import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

import * as pilotImage from './images/pilot.png';
import * as zoneImage from './images/zone.png';
import * as maintenanceImage from './images/maintenance.png';
import * as statusImage from './images/status.png';
import * as timeImage from './images/time.png';
import * as questionImage from './images/question.png';
import * as tailTop from './images/tail_top.png';
import * as tailInUse from './images/tail_inuse.png';
import * as tailAvailable from './images/tail_available.png';
import * as tailMaintenance from './images/tail_maintenance.png';

import './css/baseStyle.css';
import './css/dispatcherStyle.css';
import { Availability, Aircraft, Flight, Pilot } from './models';

var host = "http://lvh.me:8080";
host = "";

function getTimeDiff(oldTime: number) {
    const time = new Date().getTime();

    let timeDiff;

    const millsDiff = time - oldTime;
    const secondsDiff = millsDiff / 1000;
    const minutesDiff = Math.floor(secondsDiff / 60) % 60;
    const hoursDiff = Math.floor(secondsDiff / 60 / 60);

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

interface InfoImageProps {
    image: any;
}

class InfoImage extends React.Component<InfoImageProps> {
    render() {
        return <img className="infoImg" src={this.props.image} />
    }
}

interface InfoTextProps {
    text: string;
    class?: string;
}

class InfoText extends React.Component<InfoTextProps> {
    render() {
        return (
            <div className="infoText" id={this.props.class}>{this.props.text}</div>
        );
    }
}

interface PlaneProps {
    pilot: string;
    plane: Aircraft;
    zone: number;
    started: boolean;
}

class Plane extends React.Component<PlaneProps> {
    maintenanceChanged(planeId: number, event: React.ChangeEvent<HTMLInputElement>) {
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

    render() {
        return (
            <div className="plane">
                <div className="planeBox">
                    {
                        this.props.pilot != null ?
                            //Render this code if there is a flight
                            [
                                <div className="planeInfoBox" key='1'>
                                    <InfoImage image={pilotImage} />
                                    <InfoText class="pilotName" text={this.props.pilot} />
                                </div>,
                                <div className="planeInfoBox" key='2'>
                                    <InfoImage image={zoneImage} />
                                    <InfoText class="zone" text={'Zone ' + this.props.zone} />
                                </div>
                            ]
                            :
                            //Else render this code
                            <div className="planeInfoBox" id="maintenanceBox">
                                <InfoImage image={maintenanceImage} />
                                <InfoText class="maintenance" text="Maintenance" />
                                <form action="#" method="POST">
                                    {
                                        this.props.plane.operational ?
                                            <input type="checkbox" id="maintenanceTrigger" onChange={(e) => this.maintenanceChanged(this.props.plane.id, e)} />
                                            :
                                            <input type="checkbox" id="maintenanceTrigger" onChange={(e) => this.maintenanceChanged(this.props.plane.id, e)} defaultChecked={true} />
                                    }
                                </form>
                            </div>
                    }

                    {
                        this.props.pilot != null &&
                        //Show status if there is a flight
                        <div className="planeInfoBox">
                            <InfoImage image={statusImage} />
                            <InfoText text={this.props.started ? "In the air" : "On the ground"} />
                        </div>
                    }
                </div>
                {
                    this.props.plane.operational ?
                        this.props.pilot != null ?
                            <img className="tailBottom" src={tailInUse} />
                            :
                            <img className="tailBottom" src={tailAvailable} />
                        :
                        <img className="tailBottom" src={tailMaintenance} />
                }

                <img className="tailTop" src={tailTop} />
                <div id="planeNumber">{this.props.plane.id}</div>
            </div>
        );
    }
}

interface PlaneListProps {
    pilots: Pilot[];
}

interface PlaneListState {
    planes: Aircraft[];
    flights: Flight[];
}

class PlaneList extends React.Component<PlaneListProps, PlaneListState> {
    constructor(props: PlaneListProps) {
        super(props);
        this.state = {
            planes: [],
            flights: [],
        };

        this.loadData();
    }

    loadData() {
        const aircraftSocket = new WebSocket('ws://' + window.location.host + "/ws/aircraft");
        const flightSocket = new WebSocket('ws://' + window.location.host + "/ws/flights");

        aircraftSocket.onmessage = (message) => {
            const planesList: Aircraft[] = JSON.parse(message.data);
            const newPlanes: Aircraft[] = [];
            planesList.forEach(plane => {
                newPlanes.push(plane);
            });

            this.setState({
                planes: newPlanes,
            });
        }

        flightSocket.onmessage = (message) => {
            const flightList: Flight[] = JSON.parse(message.data);
            const newFlights: Flight[] = [];
            flightList.forEach(flight => {
                //Put each flight in array spot associated with plane
                if (!flight.completed) {
                    newFlights[flight.aircraftId - 1] = flight;
                }
            });

            this.setState({
                flights: newFlights,
            });
        }
    }

    render() {
        const planesList = this.state.planes.map((p, i) => {
            const flight = this.state.flights[i];
            let pilotName = null;
            let zone = null;
            let started = null;

            if (flight != null) {
                for (const pilot of this.props.pilots) {
                    if (pilot.id === flight.pilotId) {
                        pilotName = pilot.firstName + " " + pilot.lastName;
                        break;
                    }
                }

                zone = flight.zoneId;
                started = flight.started;
            }

            return <Plane key={p.id} plane={p} pilot={pilotName} zone={zone} started={started} />
        });

        return planesList;
    }
}

interface WaitingPilotProps {
    timeCreated: number;
    pilotName: string;
}

//Waiting list React code
class WaitingPilot extends React.Component<WaitingPilotProps> {
    render() {
        const timeDiff = getTimeDiff(this.props.timeCreated);

        return (
            <div className="pilot">
                <div className="pilotBox">
                    <div className="pilotInfoBoxBig">
                        <InfoImage image={pilotImage} />
                        <div id="pilotName" className="bigInfoText">{this.props.pilotName}</div>
                    </div>
                    <div className="pilotInfoBox">
                        <InfoImage image={timeImage} />
                        <InfoText class="waitTime" text={'Has been waiting for ' + timeDiff} />
                    </div>
                </div>
            </div>
        );
    }
}

interface WaitingListProps {
    pilots: Pilot[];
}

interface WaitingListState {
    waitingPilots: Availability[];
}

class WaitingList extends React.Component<WaitingListProps, WaitingListState> {
    constructor(props: WaitingListProps) {
        super(props);
        this.state = {
            waitingPilots: [],
        };

        this.loadData();
    }

    loadData() {
        const availabilitySocket = new WebSocket('ws://' + window.location.host + "/ws/availability");

        availabilitySocket.onmessage = (message) => {
            const availabilityList: Availability[] = JSON.parse(message.data);
            const newAvailabilities: Availability[] = [];

            //Sort by time
            availabilityList.sort((a, b) => {
                return a.timeCreated - b.timeCreated;
            });

            availabilityList.forEach(function (pilot) {
                newAvailabilities.push(pilot);
            });

            this.setState({
                waitingPilots: newAvailabilities,
            });
        }
    }

    render() {
        return this.state.waitingPilots.map(availability => {
            var pilotName = "";
            for (const pilot of this.props.pilots) {
                if (pilot.id === availability.pilotId) {
                    pilotName = pilot.firstName + " " + pilot.lastName;
                    break;
                }
            }

            return <WaitingPilot key={availability.pilotId} pilotName={pilotName} timeCreated={availability.timeCreated} />
        });
    }
}

interface ListHeaderProps {
    text: string;
}

class ListHeader extends React.Component<ListHeaderProps> {
    render() {
        return <p className="listHeader">{this.props.text}</p>
    }
}

interface MenuItemProps {
    image: any;
    text: string;
}

class MenuItem extends React.Component<MenuItemProps> {
    render() {
        return (
            <tr>
                <td className="tipCellImg">
                    <InfoImage image={this.props.image} />
                </td>
                <td>{this.props.text}</td>
            </tr>
        );
    }
}

class HelpMenu extends React.Component {
    render() {
        return (
            <div id="toolTipInitiator">
                <table id="toolTipTable" className="hidden">
                    <tbody>
                        <tr>
                            <th colSpan={2}>Help</th>
                        </tr>
                        <MenuItem text="Assigned Pilot" image={pilotImage} />
                        <MenuItem text="Assigned Zone" image={zoneImage} />
                        <MenuItem text="In/Out Maintenance" image={maintenanceImage} />
                        <MenuItem text="Plane Status" image={statusImage} />
                        <MenuItem text="Time Waiting" image={timeImage} />
                        <tr>
                            <td className="tipCellImg" id="tipColorGreen"></td>
                            <td>Avaliable</td>
                        </tr>
                        <tr>
                            <td className="tipCellImg" id="tipColorGold"></td>
                            <td>In Use</td>
                        </tr>
                        <tr>
                            <td className="tipCellImg" id="tipColorRed"></td>
                            <td>Under Maintenance</td>
                        </tr>
                    </tbody>
                </table>
                <img id="toolTipImg" src={questionImage} />
            </div>
        );
    }
}

interface AppState {
    pilots: Pilot[];
}

class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            pilots: [],
        };

        this.loadData();
    }

    loadData() {
        var pilotSocket = new WebSocket('ws://' + window.location.host + "/ws/pilots");

        pilotSocket.onmessage = (message) => {
            var pilotList: Pilot[] = JSON.parse(message.data);
            const newPilots: Pilot[] = [];
            pilotList.forEach(pilot => {
                newPilots.push(pilot);
            });

            this.setState({
                pilots: newPilots,
            });
        }
    }

    render() {
        return (
            <>
                <div id="planeInfo" className="column">
                    <ListHeader text="Planes" />
                    <PlaneList pilots={this.state.pilots} />
                </div>
                <div id="waitingList" className="column">
                    <ListHeader text="Waiting List" />
                    <WaitingList pilots={this.state.pilots} />
                </div>
                <HelpMenu />
            </>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);