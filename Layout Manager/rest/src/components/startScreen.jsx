import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link, useHistory} from "react-router-dom";
import PopUp from './popUpView.jsx';

function buttonPress(func=null, type=null){
    var elem = document.getElementById("popUpContainer")
    ReactDOM.render(<PopUp function={func} type={type}/>, elem);
    document.getElementById("wholeScreen").addEventListener('click', reversePress);
    document.getElementById("leftDiv").style.filter = "blur(4px)";
    document.getElementById("rightDiv").style.filter = "blur(4px)";
}

function reversePress(event){
    if (event.target.id === "popUpBox" || event.target.name === "inputField" || event.target.id === "popUpForm"
        || event.target.id === "popUpSubmitBut" || event.target.id === "popUpSubmitSVG"
        || event.target.id === "popUpSubmitPath1" || event.target.id === "popUpSubmitPath2"
        || event.target.id === "inputType"){return;}
    ReactDOM.unmountComponentAtNode(document.getElementById("popUpContainer"))
    document.getElementById("wholeScreen").removeEventListener('click', reversePress);
    document.getElementById("leftDiv").style.filter = "none";
    document.getElementById("rightDiv").style.filter = "none";
}

export default class StartScreen extends Component{
    constructor(props){
        super(props);
        this.state = {restaurants: []};
        this.loadList = this.loadList.bind(this);
        this.loadList();
        this.login = this.login.bind(this);
        this.createRest = this.createRest.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.submitReservation = this.submitReservation.bind(this);
    }

    loadList(){
        fetch("http://127.0.0.1:5000/restaurants/",{method: 'GET'})
        .then(response => response.json())
        .then((jsonData) => {
            this.setState({restaurants: jsonData.data});
        })
        .catch((error) => {console.error(error)})
    }


    createRest(name, width, height, password){
        var restaurant = null;
        var body = JSON.stringify({name: name, width: width, height: height, password: password});
        fetch("http://127.0.0.1:5000/restaurants/",{method: 'POST', body: body})
        .then(response => response.json())
        .then((jsonData) => {
            restaurant = jsonData.data;
            this.loadList();
            this.props.history.push("/"+restaurant.name+"/"+restaurant.id);
        })
        .catch((error) => {console.error(error)})
    }


    loginMouseIn(but){
        but.target.style.background = '#3C9F7C';
    }

    loginMouseOut(but){
        but.target.style.background = "#4AC598";
    }

    createMouseIn(but){
        but.target.style.background = 'lightgray';
    }

    createMouseOut(but){
        but.target.style.background = "#FFFFFF";
    }

    submitReservation(event){
        event.preventDefault();
        var inputs = document.getElementsByName("reservationInput"); var obj; var params = [];
        var val;  var inp; var rest; var found; var index; var id; var data;
        for (obj of inputs){
            if (obj.value === ''){return;}
            if (obj.id === "restInput"){
                index = obj.value.indexOf(", ");
                if (index === -1){alert("Invalid Restaurant Input!"); return;}
                id = obj.value.substring(index+2);
                if (isNaN(id)){alert("Invalid Restaurant Input!"); return;}
                inp = Number(id);
                found = false;
                for (rest of this.state.restaurants){
                    if (rest.id === inp){found = true; break;}
                }
                if (!found){alert("Restaurant not found!"); return;}
                params.push(inp)
            } else {
                inp = isNaN(obj.value) ? String(obj.value) : Number(obj.value);
                if (typeof(inp)== "number" && inp<=0){return;}
                params.push(inp);
            }
        }
        if (this.canMakeReservation() && window.confirm("Make this reservation?")){
            var url = "http://192.168.2.51:8077/restaurants/"+params[0]+"/reservations/";
            var body = JSON.stringify({number: params[1], lastName: params[2], mobileNumber: params[3], date: params[4], time:  params[5]});
            fetch(url,{method: 'POST', body: body}).then(response => response.json())
            .then((jsonData) => {data=jsonData.data;});
            for (obj of inputs){
                obj.value = '';
            }
        }
    }

    canMakeReservation(){
        return true;
    }

    getToday(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        today = yyyy+'-'+mm+'-'+dd;
        return today;
    }


    dateChange(){
        document.getElementById("timeInput").min = this.getMinTime();
    }

    getMinTime(){
        var date= String(document.getElementById("dateInput").value);
        if (date == this.getToday()){
            var today = new Date();
            var hours = today.getHours()+1;
            var mins = today.getMinutes();
            if(hours<10){
                hours='0'+hours
            }
            if(mins<10){
                mins='0'+mins
            }
            return hours+":"+mins;
        } else {
            return "11:00";
        }
    }


    login(id, password){
        var restaurant = null; var rest;
        for (rest of this.state.restaurants){
            if (rest.id === id){restaurant=rest; break;}
        }
        if (restaurant === null){alert("No restaurant with this id was found."); return;}
        if (restaurant.password !== password){alert("Incorrect password."); return;}
        this.props.history.push("/"+rest.name+"/"+rest.id)
    }

    render(){
        var rest; var ls = [];
        for (rest of this.state.restaurants){
            ls.push(<Link to={"/"+rest.name+"/"+rest.id}>{rest.name}</Link>)
        }
    return (
        <div id="wholeScreen" style={startStyle.mainDiv}>
            <div id="leftDiv" style={startStyle.leftDiv}>
            <p style={startStyle.heading}>Make A Reservation!</p>
            <form onSubmit={this.submitReservation} style={startStyle.form}>
                <input id="restInput" name="reservationInput" placeholder = "Select Restaurant" list="rests" style={startStyle.inputs} required/>
                <datalist id= "rests">
                    {this.state.restaurants.map(item => (<option id={item.id} value={item.name+", "+item.id}/>))}
                </datalist>
                <input name="reservationInput" type="number" placeholder = "Number of People" style={startStyle.inputs} min={1} required/>
                <input name="reservationInput" type="text" placeholder = "Last Name" style={startStyle.inputs} required/>
                <input name="reservationInput" type="number" placeholder = "Mobile Number" style={startStyle.inputs} min={1000000000} max={9999999999} required/>
                <input id="dateInput" name="reservationInput" type="date" min={this.getToday()} style={startStyle.inputs} onChange={this.dateChange} required/>
                <input id="timeInput" name="reservationInput" type="time" max="22:30" style={startStyle.inputs} required/>
                <input type="Submit" style={startStyle.submitButton} onMouseOver={this.loginMouseIn} onMouseLeave={this.loginMouseOut}/>
            </form>
            </div>
            <div id="rightDiv" style={startStyle.rightDiv}>
                <svg xmlns="http://www.w3.org/2000/svg" height="300" viewBox="0 0 24 24" width="300">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
                </svg>
                <button style={startStyle.goButton} onMouseOver={this.loginMouseIn} onMouseLeave={this.loginMouseOut} onClick={()=>buttonPress(this.login, "login")}>My Restaurant</button>
                <button style={startStyle.newButton} onMouseOver={this.createMouseIn} onMouseLeave={this.createMouseOut} onClick={()=>buttonPress(this.createRest, "createRest")}>Create New Restaurant</button>
            </div>
            <div id="popUpContainer" style={{top:"100%", left:"100%"}}/>
        </div>
        );
    }
}

const startStyle = { mainDiv:{
        width:"100%",
        height:"100%",
        overflow: "scroll",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }, leftDiv: {
        width: "50%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: "url('https://i.pinimg.com/564x/3b/06/ae/3b06aea61d8380191bf636cfcc471827.jpg')",
        backgroundSize: "100% 100%",
        alignItems: "center",
        justifyContent: "center",
    }, heading: {
        color: "rgba(7, 7, 7, 0.65)",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "200",
        fontStyle: "normal",
        fontSize: "32px",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: "0 0 1px 0",
        borderStyle: "solid",
        borderColor: "rgba(7, 7, 7, 0.65)"
    }, rightDiv: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "50px",
        width: "50%",
        height: "100vh",
        backgroundColor: "#4AC598"
    }, goButton: {
        width: "293px",
        height: "60px",
        backgroundColor: "#4AC598",
        borderRadius: "7px",
        border: "medium solid white",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        color: "#FFFFFF",
        fontWeight: "200",
        fontStyle: "normal",
        fontSize: "20px",
        lineHeight: "17px",
    }, newButton: {
        width: "293px",
        height: "60px",
        backgroundColor: "#FFFFFF",
        borderRadius: "7px",
        borderWidth: "0",
        boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
        color: "#4AC598",
        fontWeight: "200",
        fontStyle: "normal",
        fontSize: "20px",
        lineHeight: "17px",
    }, submitButton: {
        height: "40px",
        backgroundColor: "#4AC598",
        borderRadius: "7px",
        borderWidth: "0",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        color: "rgba(7, 7, 7, 0.65)",
        fontWeight: "200",
        fontStyle: "normal",
        fontSize: "20px",
        lineHeight: "17px",
    }, form:{
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    }, inputs:{
        width: "338px",
        height: "50px",
        textAlign: "center",
        backgroundColor: "#E5E5E5",
        boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "11px",
        borderWidth: "0",
        fontWeight: "100",
        fontStyle: "normal",
        fontSize: "18px",
    }
}
