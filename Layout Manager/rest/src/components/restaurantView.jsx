import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Restaurant, {Group, Objection, SittingArea} from './restaurantClasses.js';
import {CustomButtonListGUI, CustomButtonListRest} from './buttonLists.jsx';
import ObjectionView from './objectionView.jsx';
import GroupView from './groupView.jsx';
import SittingAreaView from './sittingAreaView.jsx';
import TableView from './tableView.jsx';
import ChairView from './chairView.jsx';
import RightInformation from './rightInformation.jsx';
import LeftInventory from './leftInventory.jsx';
const assert = require('assert');

export default class RestaurantView extends Component{
    constructor(props){
        super(props);
        this.state = {eventHandler: {x: null, y: null, selected: null}, ogPos: null, factor: null, width: 662, height: 542, restaurant: null};
        this.loadRest = this.loadRest.bind(this);
        this.calculateFactor = this.calculateFactor.bind(this);
        this.getReservations = this.getReservations.bind(this);
        this.loadRest(props.id);

        this.addTables = this.addTables.bind(this);
        this.addChairs = this.addChairs.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.changeDetails = this.changeDetails.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.setLayout = this.setLayout.bind(this);
        this.handleWalkIn = this.handleWalkIn.bind(this);
        this.endMeal = this.endMeal.bind(this);

        this.handleDraw = this.handleDraw.bind(this);
        this.startDraw = this.startDraw.bind(this);
        this.endDraw = this.endDraw.bind(this);

        this.handleSittingAreaEdit = this.handleSittingAreaEdit.bind(this);
        this.startEdit = this.startEdit.bind(this);
        this.endEdit = this.endEdit.bind(this);

        this.handleMoveFurniture = this.handleMoveFurniture.bind(this);
        this.startGroupMove = this.startGroupMove.bind(this);
        this.endGroupMove = this.endGroupMove.bind(this);

        this.delete = this.delete.bind(this);
        this.rotate = this.rotate.bind(this);
        this.changePadding = this.changePadding.bind(this);
        this.generalDown = this.generalDown.bind(this);

        this.handleDownObj = this.handleDownObj.bind(this);
        this.deleteObjection = this.deleteObjection.bind(this);

        this.handleDownSA = this.handleDownSA.bind(this);
        this.deleteSittingArea = this.deleteSittingArea.bind(this);

        this.handleDownGroup = this.handleDownGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);

        this.handleMoveObj = this.handleMoveObj.bind(this);
        this.moveObjection = this.moveObjection.bind(this);

        this.handleMoveSA = this.handleMoveSA.bind(this);
        this.moveSittingArea = this.moveSittingArea.bind(this);

        this.handleMoveGroup = this.handleMoveGroup.bind(this);
        this.moveGroup = this.moveGroup.bind(this);

        this.handleUpObj = this.handleUpObj.bind(this);
        this.handleUpSA = this.handleUpSA.bind(this);
        this.handleUpGroup = this.handleUpGroup.bind(this);
        this.findSittingAreas = this.findSittingAreas.bind(this);

        this.save = this.save.bind(this);
        this.post = this.post.bind(this);
        this.saveObjections = this.saveObjections.bind(this);
        this.saveSittingAreas = this.saveSittingAreas.bind(this);
        this.saveGroups = this.saveGroups.bind(this);
    }


    componentDidMount(){
        document.getElementById("restDisplay").addEventListener("mousedown", this.generalDown);
        this.getReservations();
        setInterval(this.getReservations, 5000*12)
    }


    calculateFactor(width, height){
        var proportion = (this.state.width-70)/this.state.height; // width: height :: 662: 542
        if (width>height*proportion){
            return (this.state.width-70)/width;
        } else if (height>width/proportion){
            return this.state.height/height;
        } else {
            width = this.state.width-70
            return this.state.height/height;
        }
    }


    loadRest(id){
        var restData; var tb; var chr; var obj; var sa; var grp; var char;
        var chrIDList = []; var group; var table; var chair; var res;

        fetch("http://127.0.0.1:5000/restaurants/"+id+"/",{method: 'GET'})
        .then(response => response.json())
        .then((jsonData) => {
            restData = jsonData.data;
            var rest = new Restaurant(restData.id, restData.name, restData.password, restData.width, restData.height, restData.padding)
            for (tb of restData.tables){
                table = rest.addTableToInventory(tb.id, tb.width, tb.height, tb.capacity, tb.type);
                table.coords = tb.topLeft
            }
            for (chr of restData.chairs){
                chair = rest.addChairToInventory(chr.id, chr.width, chr.height, chr.type);
                chair.coords = chair.topLeft
            }
            for (obj of restData.objections){
                rest.addObjectionToInventory(obj.id, obj.topLeft[0], obj.topLeft[1], obj.topLeft[0]+obj.width, obj.topLeft[1]+obj.height, obj.type);
            }
            for (sa of restData.sittingAreas){
                rest.addSittingArea(sa.id, sa.topLeft[0], sa.topLeft[1], sa.topLeft[0]+sa.width, sa.topLeft[1]+sa.height, sa.type);
            }
            for (grp of restData.groups){
                chrIDList = [];
                for (char of grp.chairs){chrIDList.push(char.id)}
                group = rest.addGroupToInventory(grp.id, grp.table.id, chrIDList, grp.padding, grp.orientation, grp.sittingArea);
                group.coords = grp.topLeft
            }
            for (res of restData.reservations){
                rest.addReservation(res.id, res.number, res.lastName, res.mobileNumber, res.date, res.time, res.duration, res.grp, res.grp2);
            }
            this.setState({restaurant: rest, factor: this.calculateFactor(restData.width, restData.height)});
        }).catch((error) => {console.error(error)})
    }


    getReservations(){
        if (this.state.restaurant != null){
            fetch("http://127.0.0.1:5000/restaurants/"+this.state.restaurant.id+"/reservations/",{method: 'GET'})
            .then(response => response.json())
            .then((jsonData) => {
                var rest = this.state.restaurant; var res; var grp;
                rest.reservations = [];
                for (grp of rest.groups){grp.occupied = {occupied: false, reservation: null};}
                for (res of jsonData.data){
                    rest.addReservation(res.id, res.number, res.lastName, res.mobileNumber, res.date, res.time, res.duration, res.grp, res.grp2);
                }
                this.setState({restaurant: rest});
            }).catch((error) => {console.error(error)})
        }
    }


    handleWalkIn(number, lastName, mobileNumber){
        var today = new Date(); var now; var grps; var res; var duration;
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var hours = today.getHours();
        var mins = today.getMinutes();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        if(hours<10){
            hours='0'+hours
        }
        if(mins<10){
            mins='0'+mins
        }
        duration = 60
        today = yyyy+'-'+mm+'-'+dd;
        now = hours+":"+mins;
        grps = this.state.restaurant.getTableFor(number);
        if (grps==null){
            alert("This walk-in cannot be accepted!")
        } else {
            var grpIDs = []; var grp;
            for (grp of grps){grpIDs.push(grp.id)}
            res = this.state.restaurant.addReservation(null, number, lastName, mobileNumber, today, now, duration, grpIDs)
            var url = "http://127.0.0.1:5000/restaurants/"+this.state.restaurant.id+"/reservations/";
            if (grpIDs.length === 2){
                var body = JSON.stringify({number: number, lastName: lastName, mobileNumber: mobileNumber, date: today, time: now, duration: duration, grpID: grpIDs[0], grp2ID: grpIDs[1]});
            } else {
                var body = JSON.stringify({number: number, lastName: lastName, mobileNumber: mobileNumber, date: today, time: now, duration: duration, grpID: grpIDs[0]});
            }
            fetch(url,{method: 'POST', body: body}).then(response => response.json()).then((jsonData) =>{
                res.id=jsonData.data.id;
                //this.setState({});
                this.save();
            });
        }
    }

    endMeal(grp){
        var res = grp.occupied.reservation;
        var today = new Date();
        var mins = today.getHours()*60+today.getMinutes();
        var resStart = Number(res.time.substring(0,2))*60+Number(res.time.substring(3,5));
        res.duration = mins-resStart;
        var url = "http://127.0.0.1:5000/restaurants/"+this.state.restaurant.id+"/reservations/"+res.id+"/";
        var body = JSON.stringify({duration: res.duration});
        fetch(url,{method: 'POST', body: body}).then(response => response.json()).then((jsonData) =>{
            this.getReservations();
        });
    }


    addTables(width, height, capacity, number, type = null){
        var rest = this.state.restaurant; var tabData; var tb;
        var url = "http://127.0.0.1:5000/restaurants/"+this.state.restaurant.id+"/tables/"
        var body = JSON.stringify({width: width, height: height, capacity: capacity, number: number, type: type})
        fetch(url,{method: 'POST', body: body})
        .then(response => response.json())
        .then((jsonData) => {
            tabData = jsonData.data
            for (tb of tabData){
                rest.addTableToInventory(tb.id, tb.width, tb.height, tb.capacity, tb.type);
            }
            this.setState({restaurant: rest});
        })
    }


    addChairs(width, height, number, type = null){
        var rest = this.state.restaurant; var chrData; var chr;
        var url = "http://127.0.0.1:5000/restaurants/"+this.state.restaurant.id+"/chairs/"
        var body = JSON.stringify({width: width, height: height, number: number, type: type})
        fetch(url,{method: 'POST', body: body})
        .then(response => response.json())
        .then((jsonData) => {
            chrData = jsonData.data
            for (chr of chrData){
                rest.addChairToInventory(chr.id, chr.width, chr.height, chr.type);
            }
            this.setState({restaurant: rest});
        })
    }


    changeDetails(name, width, height, padding){
        if (name==null){name = this.state.restaurant.name}
        if (width==null){width = this.state.restaurant.width}
        if (height==null){height = this.state.restaurant.height}
        if (padding==null){padding = this.state.restaurant.padding}
        if (width!==this.state.restaurant.width || height!==this.state.restaurant.height){
            if (window.confirm("Changing dimensions will remove your existing layout and furniture placement.\nDo you want to proceed?")){
                this.state.restaurant.groups = [];
                this.state.restaurant.objections = [];
                this.state.restaurant.sittingAreas = [];
                document.getElementById("navBarText").innerHTML = name;
                this.state.restaurant.name = name;
                this.state.restaurant.width = width;
                this.state.restaurant.height = height;
                this.state.restaurant.padding = padding;
                this.save();
            }
        } else {
            if (padding!==this.state.restaurant.padding){
                if (window.confirm("Changing average padding will remove your existing furniture placement.\nDo you want to proceed?")){
                    this.state.restaurant.groups = []; var sa;
                    for (sa of this.state.restaurant.sittingAreas){sa.furniture = [];}
                    document.getElementById("navBarText").innerHTML = name;
                    this.state.restaurant.name = name;
                    this.state.restaurant.width = width;
                    this.state.restaurant.height = height;
                    this.state.restaurant.padding = padding;
                    this.save();
                }
            } else {
                document.getElementById("navBarText").innerHTML = name;
                this.state.restaurant.name = name;
                this.state.restaurant.width = width;
                this.state.restaurant.height = height;
                this.state.restaurant.padding = padding;
                this.save();
            }
        }
    }


    changePassword(password){
        this.state.restaurant.password = password;
        this.save();
    }


    setLayout(){
        this.state.restaurant.setLayout();
        this.setState({eventHandler: {x: this.state.eventHandler.x, y:this.state.eventHandler.y,
                                        selected: null}});
    }


    handleDraw(){
        if (document.getElementById("drawButton").innerHTML === "Edit Objections"){
            this.startDraw();
        } else {
            this.endDraw();
            this.loadRest(this.state.restaurant.id);
        }
    }


    startDraw(){
        this.state.restaurant.sittingAreas = [];
        this.state.restaurant.groups = [];
        document.getElementById("showButton").innerHTML = "Hide Sitting Area Borders";
        var elem = document.getElementById("drawButton");
        var saveElem = document.getElementById("saveButton");
        var restElem = document.getElementById("restArea");
        var buttons =  document.getElementsByName("button");
        var objections = document.getElementsByName("objection"); var item;
        document.getElementById("restDisplay").removeEventListener('mousedown', this.generalDown);
        restElem.addEventListener('mousedown', this.handleDownObj);
        restElem.addEventListener('mouseup', this.handleUpObj);
        restElem.addEventListener('mousemove', this.handleMoveObj);
        restElem.style.cursor = "crosshair";
        saveElem.innerHTML = "Save and Quit";
        elem.innerHTML = "Quit Edit";
        for (item of objections){item.style.cursor = "move";}
        for (item of buttons){
            if (!(item.id === "drawButton" || item.id === "saveButton")){
                item.disabled=true; item.style.filter="blur(4px)";
            }
        }
        this.setState({eventHandler: {x: null, y: null, selected: null}});
    }


    endDraw(){
        var elem = document.getElementById("drawButton");
        var saveElem = document.getElementById("saveButton");
        var restElem = document.getElementById("restArea");
        var buttons =  document.getElementsByName("button");
        var objections = document.getElementsByName("objection"); var item;
        restElem.removeEventListener('mousedown', this.handleDownObj);
        restElem.removeEventListener('mouseup', this.handleUpObj);
        restElem.removeEventListener('mousemove', this.handleMoveObj);
        document.getElementById("restDisplay").addEventListener('mousedown', this.generalDown);
        restElem.style.cursor = "auto";
        saveElem.innerHTML = "Save Changes"
        elem.innerHTML = "Edit Objections";
        for (item of objections){item.style.cursor = "auto";}
        for (item of buttons){item.disabled=false; item.style.filter="none";}
        this.setState({eventHandler: {x: null, y: null, selected: null}});
    }


    handleSittingAreaEdit(){
        if (document.getElementById("saButton").innerHTML === "Edit Sitting Areas"){
            this.startEdit();
        } else {
            this.endEdit();
            this.loadRest(this.state.restaurant.id);
        }
    }


    startEdit(){
        this.state.restaurant.groups = []; var sa;
        for (sa of this.state.restaurant.sittingAreas){sa.furniture = [];}
        var elem = document.getElementById("saButton");
        var saveElem = document.getElementById("saveButton");
        var restElem = document.getElementById("restArea");
        var buttons =  document.getElementsByName("button");
        var sittingAreas = document.getElementsByName("sittingArea"); var item;
        document.getElementById("restDisplay").removeEventListener('mousedown', this.generalDown);
        restElem.addEventListener('mousedown', this.handleDownSA);
        restElem.addEventListener('mouseup', this.handleUpSA);
        restElem.addEventListener('mousemove', this.handleMoveSA);
        restElem.style.cursor = "crosshair";
        saveElem.innerHTML = "Save and Quit";
        elem.innerHTML = "Quit Edit";
        for (item of sittingAreas){item.style.cursor = "move"; item.style.border = "medium solid black";}
        document.getElementById("showButton").innerHTML = "Hide Sitting Area Borders";
        for (item of buttons){
            if (!(item.id === "saButton" || item.id === "saveButton")){
                item.disabled=true; item.style.filter="blur(4px)";
            }
        }
        this.setState({eventHandler: {x: null, y: null, selected: null}});
    }


    endEdit(){
        var elem = document.getElementById("saButton");
        var saveElem = document.getElementById("saveButton");
        var restElem = document.getElementById("restArea");
        var buttons =  document.getElementsByName("button");
        var sittingAreas = document.getElementsByName("sittingArea"); var item;
        restElem.removeEventListener('mousedown', this.handleDownSA);
        restElem.removeEventListener('mouseup', this.handleUpSA);
        restElem.removeEventListener('mousemove', this.handleMoveSA);
        document.getElementById("restDisplay").addEventListener('mousedown', this.generalDown);
        restElem.style.cursor = "auto";
        saveElem.innerHTML = "Save Changes"
        elem.innerHTML = "Edit Sitting Areas";
        for (item of sittingAreas){item.style.cursor = "auto";}
        for (item of buttons){item.disabled=false; item.style.filter="none";}
        this.setState({eventHandler: {x: null, y: null, selected: null}});
    }


    handleMoveFurniture(){
        if (document.getElementById("moveButton").innerHTML === "Edit Furniture"){
            this.startGroupMove();
        } else {
            this.endGroupMove();
        }
    }


    startGroupMove(){
        var elem = document.getElementById("moveButton");
        var groups =  document.getElementsByName("group");
        var restElem = document.getElementById("restArea"); var item;
        document.getElementById("saButton").disabled = true;
        document.getElementById("saButton").style.filter = "blur(4px)";
        document.getElementById("drawButton").disabled = true;
        document.getElementById("drawButton").style.filter = "blur(4px)";
        document.getElementById("showBorderButton").disabled = true;
        document.getElementById("showBorderButton").style.filter = "blur(4px)";
        document.getElementById("restDisplay").removeEventListener('mousedown', this.generalDown);
        restElem.addEventListener('mousedown', this.handleDownGroup);
        restElem.addEventListener('mouseup', this.handleUpGroup);
        restElem.addEventListener('mousemove', this.handleMoveGroup);
        elem.innerHTML = "Quit Edit";
        for (item of groups){
            item.style.cursor = "move";
            item.style.border = "thin solid black";
            item.style.borderRadius = "5px";
        }
        this.setState({eventHandler: {x: null, y: null, selected: this.state.eventHandler.selected}});
    }


    endGroupMove(){
        var elem = document.getElementById("moveButton");
        var groups =  document.getElementsByName("group");
        var restElem = document.getElementById("restArea"); var item;
        document.getElementById("saButton").disabled = false;
        document.getElementById("saButton").style.filter = "none";
        document.getElementById("drawButton").disabled = false;
        document.getElementById("drawButton").style.filter = "none";
        document.getElementById("showBorderButton").disabled = false;
        document.getElementById("showBorderButton").style.filter = "none";
        restElem.removeEventListener('mousedown', this.handleDownGroup);
        restElem.removeEventListener('mouseup', this.handleUpGroup);
        restElem.removeEventListener('mousemove', this.handleMoveGroup);
        document.getElementById("restDisplay").addEventListener('mousedown', this.generalDown);
        elem.innerHTML = "Edit Furniture";
        for (item of groups){
            item.style.cursor = "auto";
            item.style.border = "none";
        }
        this.setState({eventHandler: {x: null, y: null, selected: null}});
    }


    generalDown(event){
        var sel = null;
        if (event.target.getAttribute("name") === "group"){
            sel = this.state.restaurant.getGroupByID(event.target.getAttribute("id"));
        } else if (event.target.getAttribute("name") === "sittingArea"){
            sel = this.state.restaurant.getSittingAreaByID(event.target.getAttribute("id"));
        } else if (event.target.getAttribute("name") === "objection"){
            sel = this.state.restaurant.getObjectionByID(event.target.getAttribute("id"));
        }
        this.setState({eventHandler: {x: this.state.eventHandler.x, y:this.state.eventHandler.y,
                                        selected: sel}});
    }


    handleDownObj(event){
        this.state.restaurant.sittingAreas = [];
        this.state.restaurant.groups = [];
        var elem = document.getElementById("restArea");
        var top = elem.offsetTop; var left = elem.offsetLeft;
        this.setState({eventHandler: {x: event.x-left, y: event.y-top,
            selected: this.state.restaurant.getObjectionByID(event.target.getAttribute("id"))}});
    }


    handleDownSA(event){
        this.state.restaurant.groups = []; var sa;
        for (sa of this.state.restaurant.sittingAreas){sa.furniture = [];}
        var elem = document.getElementById("restArea");
        var top = elem.offsetTop; var left = elem.offsetLeft;
        this.setState({eventHandler: {x: event.x-left, y: event.y-top,
        selected: this.state.restaurant.getSittingAreaByID(event.target.getAttribute("id"))}});
    }

    handleDownGroup(event){
        if (event.target.getAttribute("name") === "group"){
            var elem = document.getElementById("restArea");
            var top = elem.offsetTop; var left = elem.offsetLeft;
            var grp= this.state.restaurant.getGroupByID(event.target.getAttribute("id"));
            var pos= grp.coords.slice();
            this.setState({eventHandler: {x: event.x-left, y: event.y-top,
            selected: grp}, ogPos: pos});
        } else {
            this.setState({eventHandler: {x: null, y: null,
            selected: null}, ogPos: null});
        }
    }


    delete(){
        if (this.state.eventHandler.selected == null){
        } else if (this.state.eventHandler.selected instanceof Group){
            this.deleteGroup(this.state.eventHandler.selected);
        } else if (this.state.eventHandler.selected instanceof SittingArea){
            this.deleteSittingArea(this.state.eventHandler.selected);
        } else if (this.state.eventHandler.selected instanceof Objection){
            this.deleteObjection(this.state.eventHandler.selected);
        }
    }


    deleteGroup(grp){
        if(window.confirm("Are you sure you want to delete this Group?")){
            grp.coords = null;
            var index = this.state.restaurant.groups.indexOf(grp); var chr;
            this.state.restaurant.groups.splice(index, 1);
            var sa = this.state.restaurant.getSittingAreaByID(grp.sittingArea);
            sa.furniture.splice(sa.furniture.indexOf(grp), 1);
            if (grp.orientation == "vertical"){
                var tmp = grp.table.width
                grp.table.width = grp.table.height
                grp.table.height = tmp
            }
            this.setState({eventHandler: {x: null, y: null, selected: null}});
        }
    }


    deleteObjection(obj){
        if(window.confirm("Are you sure you want to delete this Objection?")){
            var index = this.state.restaurant.objections.indexOf(obj);
            this.state.restaurant.objections.splice(index, 1);
            this.state.restaurant.sittingAreas = [];
            this.state.restaurant.setSittingAreas();
            this.setState({eventHandler: {x: null, y: null, selected: null}});
        }
    }


    deleteSittingArea(sa){
        if(window.confirm("Are you sure you want to delete this Sitting Area?")){
            var index = this.state.restaurant.sittingAreas.indexOf(sa);
            this.state.restaurant.sittingAreas.splice(index, 1);
            this.setState({eventHandler: {x: null, y: null, selected: null}});
        }
    }

    rotate(){
        var grp = this.state.eventHandler.selected;
        if (grp != null){
            grp.switchOrientation();
            var newPos = grp.coords;
            var list = this.state.restaurant.groups.concat(this.state.restaurant.objections);
            var canRotate = (!(this.doesOverLap(newPos, list, grp.id))) && (newPos[0]>=0 && newPos[2]<this.state.restaurant.width) && (newPos[1]>=0 && newPos[3]<=this.state.restaurant.height);
            if (canRotate){
                var sas = this.findSittingAreas(grp);
                if (sas.length === 1){
                    var sa = this.state.restaurant.getSittingAreaByID(grp.sittingArea);
                    var index = sa.furniture.indexOf(grp);
                    sa.furniture.splice(index, 1);
                    grp.sittingArea = sas[0].id;
                    sas[0].furniture.push(grp);
                } else {grp.switchOrientation();}
            } else {grp.switchOrientation();}
        }
        this.setState({eventHandler: {x: null, y: null, selected: grp},
                    ogPos: null})
    }


    addGroup(event, table, fromLeft, fromTop){
        var padding = 0.00000000000000000000000001;
        var elem = document.getElementById("restArea");
        var top = elem.offsetTop; var left = elem.offsetLeft;
        var factor = this.state.factor; var rest = this.state.restaurant;
        var usedChairs = []; var chr;
        for (chr of rest.chairs){
            if (!(chr.coords==null)){usedChairs.push(chr);}
        }
        var chrList = rest.findChairs(table, usedChairs);
        var chairHeight = 0;
        for (chr of chrList){
            chairHeight = Math.max(chairHeight, chr.height);
        }
        var newPos = [(event.clientX - fromLeft - left)/factor-padding, (event.clientY - fromTop - top)/factor-padding- chairHeight,(event.clientX - fromLeft - left)/factor + padding + table.width,
        (event.clientY - fromTop - top)/factor + padding + chairHeight + table.height]
        var list = rest.groups.concat(rest.objections);
        var canPlace = (!(this.doesOverLap(newPos, list, null))) && (newPos[0]>=0 && newPos[2]<rest.width) && (newPos[1]>=0 && newPos[3]<=rest.height);
        if (canPlace){
            var sas = this.findSittingAreas({coords: newPos});
            if (sas.length === 1){
                var chrIDs = [];
                for (chr of chrList){
                    chrIDs.push(chr.id)
                }
                var grp = rest.addGroupToInventory(rest.nextGroupID, table.id, chrIDs, padding, "horizontal", sas[0].id)
                grp.coords = [newPos[0], newPos[1]];
                sas[0].furniture.push(grp);
                this.setState({eventHandler: {x: null, y: null, selected: grp},
                            ogPos: null})
            } else {
                alert("Sorry this table cannot be placed here!")
            }
        } else {
            alert("Sorry this table cannot be placed here!")
        }
    }


    changePadding(grp, newPadding){
        if (newPadding>0){
            const ogPadding = grp.padding;
            grp.padding = newPadding;
            var newPos = grp.coords;
            var list = this.state.restaurant.groups.concat(this.state.restaurant.objections);
            var canRotate = (!(this.doesOverLap(newPos, list, grp.id))) && (newPos[0]>=0 && newPos[2]<this.state.restaurant.width)  && (newPos[1]>=0 && newPos[3]<=this.state.restaurant.height);
            if (canRotate){
                var sas = this.findSittingAreas(grp);
                if (sas.length === 1){
                    var sa = this.state.restaurant.getSittingAreaByID(grp.sittingArea);
                    var index = sa.furniture.indexOf(grp);
                    sa.furniture.splice(index, 1);
                    grp.sittingArea = sas[0].id;
                    sas[0].furniture.push(grp);
                } else {grp.padding = ogPadding;}
            } else {grp.padding = ogPadding;}
        }
        document.getElementById("paddingInputField").value = grp.padding;
        this.setState({eventHandler: {x: null, y: null, selected: grp},
                    ogPos: null})
    }


    handleMoveObj(event){
        if (this.state.eventHandler.selected instanceof Objection &&
            this.state.eventHandler.x != null && this.state.eventHandler.y != null){
            this.moveObjection(event);
        }
    }


    handleMoveSA(event){
        if (this.state.eventHandler.selected instanceof SittingArea &&
            this.state.eventHandler.x != null && this.state.eventHandler.y != null){
                this.moveSittingArea(event);
        }
    }


    handleMoveGroup(event){
        if (this.state.eventHandler.selected instanceof Group &&
            this.state.eventHandler.x != null && this.state.eventHandler.y != null){
            this.moveGroup(event);
        }
    }


    moveObjection(event){
        var elem = document.getElementById("restArea");
        var top = elem.offsetTop; var left = elem.offsetLeft;
        var width = elem.offsetWidth; var height = elem.offsetHeight;
        var factor = this.state.factor;
        var changeX = event.x-left - this.state.eventHandler.x;
        var changeY = event.y-top - this.state.eventHandler.y;
        var element = event.target;
        var objection = element.getAttribute("name")==="objection" ? this.state.restaurant.getObjectionByID(element.getAttribute("id")) : null;
        if (objection == null){
            this.state.restaurant.setSittingAreas()
            this.setState({eventHandler: {x: null, y: null, selected: null}});
        } else {
            var topLeft = [objection.coords[0]*factor+changeX, objection.coords[1]*factor+changeY];
            if (topLeft[0]>=0 && topLeft[0]+objection.width*factor<=width
                && topLeft[1]>=0 && topLeft[1]+objection.height*factor<=height){
                    objection.coords = [topLeft[0]/factor, topLeft[1]/factor];
                    element.style.left = topLeft[0]+"px";
                    element.style.top = topLeft[1]+"px";
                    this.setState({eventHandler: {x: event.x-left, y: event.y-top, selected: objection}});
            } else {
                this.state.restaurant.setSittingAreas()
                this.setState({eventHandler: {x: null, y: null, selected: null}});
            }
        }
    }


    moveSittingArea(event){
        var elem = document.getElementById("restArea");
        var top = elem.offsetTop; var left = elem.offsetLeft;
        var width = elem.offsetWidth; var height = elem.offsetHeight;
        var factor = this.state.factor;
        var changeX = event.x-left - this.state.eventHandler.x;
        var changeY = event.y-top - this.state.eventHandler.y;
        var element = event.target;
        var sittingArea = element.getAttribute("name")==="sittingArea" ? this.state.restaurant.getSittingAreaByID(element.getAttribute("id")) : null;
        var list = this.state.restaurant.sittingAreas.concat(this.state.restaurant.objections);
        if (sittingArea == null){
            this.setState({eventHandler: {x: null, y: null, selected: null}});
        } else {
            var topLeft;
            var diagonalMove = [sittingArea.coords[0]+changeX/factor,
                                sittingArea.coords[1]+changeY/factor,
                                sittingArea.coords[0]+changeX/factor+sittingArea.width,
                                sittingArea.coords[1]+changeY/factor+sittingArea.height,
                                ];
            var horizontalMove = [sittingArea.coords[0]+changeX/factor,
                                sittingArea.coords[1],
                                sittingArea.coords[0]+changeX/factor+sittingArea.width,
                                sittingArea.coords[1]+sittingArea.height,
                                ];
            var verticalMove = [sittingArea.coords[0],
                                sittingArea.coords[1]+changeY/factor,
                                sittingArea.coords[0]+sittingArea.width,
                                sittingArea.coords[1]+changeY/factor+sittingArea.height,
                                ];

            if (!this.doesOverLap(diagonalMove, list, sittingArea.id)){
                topLeft = [sittingArea.coords[0]*factor+changeX, sittingArea.coords[1]*factor+changeY];
            } else if (!this.doesOverLap(horizontalMove, list, sittingArea.id)){
                topLeft = [sittingArea.coords[0]*factor+changeX, sittingArea.coords[1]*factor];
            } else if (!this.doesOverLap(verticalMove, list, sittingArea.id)){
                topLeft = [sittingArea.coords[0]*factor, sittingArea.coords[1]*factor+changeY];
            } else {
                topLeft = [sittingArea.coords[0]*factor, sittingArea.coords[1]*factor];
            }

            if (topLeft[0]>=0 && topLeft[0]+sittingArea.width*factor<=width
                && topLeft[1]>=0 && topLeft[1]+sittingArea.height*factor<=height){
                    sittingArea.coords = [topLeft[0]/factor, topLeft[1]/factor];
                    element.style.left = topLeft[0]+"px";
                    element.style.top = topLeft[1]+"px";
                    this.setState({eventHandler: {x: event.x-left, y: event.y-top, selected: sittingArea}});
            } else {
                this.setState({eventHandler: {x: null, y: null, selected: null}});
            }
        }
    }


    moveGroup(event){
        var elem = document.getElementById("restArea");
        var top = elem.offsetTop; var left = elem.offsetLeft;
        var width = elem.offsetWidth; var height = elem.offsetHeight;
        var factor = this.state.factor;
        var changeX = event.x-left - this.state.eventHandler.x;
        var changeY = event.y-top - this.state.eventHandler.y;
        var element = event.target;
        var group = element.getAttribute("name")==="group" ? this.state.restaurant.getGroupByID(element.getAttribute("id")) : null;
        var list = this.state.restaurant.groups.concat(this.state.restaurant.objections);
        if (group == null){
            this.setState({eventHandler: {x: null, y: null, selected: null}});
        } else {
            var topLeft;
            var diagonalMove = [group.coords[0]+changeX/factor,
                                group.coords[1]+changeY/factor,
                                group.coords[0]+changeX/factor+group.width,
                                group.coords[1]+changeY/factor+group.height,
                                ];
            var horizontalMove = [group.coords[0]+changeX/factor,
                                group.coords[1],
                                group.coords[0]+changeX/factor+group.width,
                                group.coords[1]+group.height,
                                ];
            var verticalMove = [group.coords[0],
                                group.coords[1]+changeY/factor,
                                group.coords[0]+group.width,
                                group.coords[1]+changeY/factor+group.height,
                                ];

            if (!this.doesOverLap(diagonalMove, list, group.id)){
                topLeft = [group.coords[0]*factor+changeX, group.coords[1]*factor+changeY];
            } else if (!this.doesOverLap(horizontalMove, list, group.id)){
                topLeft = [group.coords[0]*factor+changeX, group.coords[1]*factor];
            } else if (!this.doesOverLap(verticalMove, list, group.id)){
                topLeft = [group.coords[0]*factor, group.coords[1]*factor+changeY];
            } else {
                topLeft = [group.coords[0]*factor, group.coords[1]*factor];
            }

            if (topLeft[0]>=0 && topLeft[0]+group.width*factor<=width
                && topLeft[1]>=0 && topLeft[1]+group.height*factor<=height){
                    group.coords = [topLeft[0]/factor, topLeft[1]/factor];
                    element.style.left = topLeft[0]+"px";
                    element.style.top = topLeft[1]+"px";
                    this.state.eventHandler.x = event.x-left;
                    this.state.eventHandler.y = event.y-top;
                    this.state.eventHandler.selected = group;
                    element.border = "thin dashed blue";
                    document.getElementById("deleteButton").style.visibility = "visible";
                    document.getElementById("deleteButton").disabled = false;
                    document.getElementById("rotateButton").style.visibility = "visible";
                    document.getElementById("rotateButton").disabled = false;
            } else {
                this.setState({eventHandler: {x: event.x-left, y: event.y-top, selected: group}});
            }
        }
    }


    doesOverLap(coords, list, id=null){
        var item;
        for (item of list){
            if (item.id !== id && this.isOverLapping(coords, item.coords)){return true;}
        }
        return false;
    }


    isOverLapping(coords1, coords2){
        if (coords1==null || coords2==null){return false;}
        if ( ((coords2[0]<=coords1[0] && coords1[0]<coords2[2]) || (coords2[0]<coords1[2] && coords1[2]<coords2[2]))
            && ((coords2[1]<=coords1[1] && coords1[1]<coords2[3]) || (coords2[1]<coords1[3] && coords1[3]<coords2[3]))
        ){return true;}

        if (((coords1[0]<=coords2[0] && coords2[0]<coords1[2]) || (coords1[0]<coords2[2] && coords2[2]<coords1[2]))
            && ((coords1[1]<=coords2[1] && coords2[1]<coords1[3]) || (coords1[1]<coords2[3] && coords2[3]<coords1[3]))
        ){return true;}

        return false;
    }


    handleUpObj(event){
        if (this.state.eventHandler.selected != null && this.state.eventHandler.selected instanceof Objection){
            this.state.restaurant.setSittingAreas()
            this.setState({eventHandler: {x: null, y: null,
                selected: this.state.eventHandler.selected}});
        } else if (this.state.eventHandler.x != null && this.state.eventHandler.y != null){
            var elem = document.getElementById("restArea");
            var top = elem.offsetTop; var left = elem.offsetLeft;
            var factor = this.state.factor;
            var x1 = this.state.eventHandler.x;
            var y1 = this.state.eventHandler.y;
            var x2 = event.x-left;
            var y2 = event.y-top;
            if (x1!==x2 && y1!==y2){
                var obj = this.state.restaurant.addObjectionToInventory("O",x1/factor,y1/factor,x2/factor,y2/factor);
            }
            this.state.restaurant.setSittingAreas();
            this.setState({eventHandler: {x: null, y: null, selected: obj}});
        }
    }


    handleUpSA(event){
        if (this.state.eventHandler.selected != null &&
            this.state.eventHandler.selected instanceof SittingArea){
            this.setState({eventHandler: {x: null, y: null,
            selected: this.state.eventHandler.selected}});
        } else if (this.state.eventHandler.x != null && this.state.eventHandler.y != null){
            var elem = document.getElementById("restArea");
            var top = elem.offsetTop; var left = elem.offsetLeft;
            var factor = this.state.factor;
            var x1 = this.state.eventHandler.x/factor;
            var y1 = this.state.eventHandler.y/factor;
            var x2 = (event.x-left)/factor;
            var y2 = (event.y-top)/factor;
            var list = this.state.restaurant.sittingAreas.concat(this.state.restaurant.objections);
            var tmp;
            if (x2<x1){tmp=x1; x1=x2; x2=tmp;} if (y2<y1){tmp=y1; y1=y2; y2=tmp;}

            if (x1!==x2 && y1!==y2 && !this.doesOverLap([x1,y1,x2,y2], list) ){
                var sa = this.state.restaurant.addSittingArea("nw",x1,y1,x2,y2);
            }
            this.setState({eventHandler: {x: null, y: null, selected: sa}});
        }
    }


    handleUpGroup(event){
        var grp = this.state.eventHandler.selected;
        var grps = document.getElementsByName("group"); var element;
        if (grp != null && grp instanceof Group){
            var sas = this.findSittingAreas(grp);
            if (sas.length !== 1){
                for (element of grps){
                    if(element.getAttribute("id")==grp.id){break;}else{element=null;}
                }
                var factor = this.state.factor;
                var topLeft = [this.state.ogPos[0], this.state.ogPos[1]];
                grp.coords = topLeft;
                element.style.left = topLeft[0]*factor+"px";
                element.style.top = topLeft[1]*factor+"px";
            } else {
                var sa = this.state.restaurant.getSittingAreaByID(grp.sittingArea);
                var index = sa.furniture.indexOf(grp);
                sa.furniture.splice(index, 1);
                grp.sittingArea = sas[0].id;
                sas[0].furniture.push(grp);
            }
            this.setState({eventHandler: {x: null, y: null,
            selected: grp}, ogPos: null});
        }
        var elem;
        for (elem of grps){
            elem.style.border = grp != null && elem.id == grp.id ? "thin dashed blue" : "thin solid black";
            elem.style.borderRadius = "5px";
            elem.style.cursor = "move";
        }
        var sittingAreas = document.getElementsByName("sittingArea");
        var showButton =  document.getElementById("showButton");
        for (elem of sittingAreas){
            elem.style.border = showButton.innerHTML === "Hide Sitting Area Borders" ? "medium solid black" : "none";
        }
    }


    findSittingAreas(grp){
        var sa; var res = [];
        for (sa of this.state.restaurant.sittingAreas){
            if (this.isOverLapping(grp.coords, sa.coords)){res.push(sa);}
        } return res;
    }


    save(){
        const buffer = <div style={restaurantStyle.saveScreen}/>;
        const container = document.getElementById("saveContainer");
        ReactDOM.render(buffer, container);

        var drawElem = document.getElementById("saveButton");
        var url = "http://127.0.0.1:5000/restaurants/"+this.state.restaurant.id+"/"
        if (drawElem.innerHTML === "Save and Quit"){
            if(window.confirm("Saving a changed layout will remove your existing furniture placement.\nDo you want to proceed?")){
                this.endDraw(); this.endEdit();

                fetch(url,{method: 'GET'}).then(response => response.json())
                    .then(jsonData => this.post(url, jsonData))
                    .then(() => {this.props.history.go(0);
                });
                } else {ReactDOM.unmountComponentAtNode(document.getElementById("saveContainer"));}
        } else {
            fetch(url,{method: 'GET'}).then(response => response.json())
                .then(jsonData => this.post(url, jsonData))
                .then(()=> {this.props.history.go(0)
                });
        }
    }


    async post(url, jsonData){
        await this.saveRestaurantDetails(url, jsonData);
        await this.saveObjections(url, jsonData);
        await this.saveSittingAreas(url, jsonData);
        await this.saveGroups(url, jsonData);
        ReactDOM.unmountComponentAtNode(document.getElementById("saveContainer"));
    }


    async saveRestaurantDetails(url, jsonData){
        if (this.state.restaurant.padding==jsonData.data.padding && this.state.restaurant.name==jsonData.data.name && this.state.restaurant.password==jsonData.data.password && this.state.restaurant.width==jsonData.data.width && this.state.restaurant.height==jsonData.data.height){
        } else {
            var body = JSON.stringify({padding: this.state.restaurant.padding,
                name: this.state.restaurant.name,
                password: this.state.restaurant.password,
                width: this.state.restaurant.width,
                height: this.state.restaurant.height,
            }); var data;
            await fetch(url,{method: 'POST', body: body}).then(response => response.json())
            .then((jsonData) => {data=jsonData.data;})
        }
    }



    async saveObjections(url, jsonData){
        var element; var body; var data;

        var toDeleteObj = this.subtractLists(jsonData.data.objections, this.state.restaurant.objections)
        var toSaveObj = this.subtractLists(this.state.restaurant.objections, jsonData.data.objections)

        for (element of toDeleteObj){
            await fetch(url+"objections/"+element.id+"/",{method: 'DELETE'}).then(response => response.json())
            .then((jsonData) => {data=jsonData.data;})
        }
        for (element of toSaveObj){
            body = JSON.stringify({coords: element.coords, type: element.type})
            await fetch(url+"objections/",{method: 'POST', body: body}).then(response => response.json())
            .then((jsonData) => {data=jsonData.data; element.id=data.id;})
        }
        for (element of this.state.restaurant.objections){
            if (this.toSave(element, jsonData.data.objections)){
                body = JSON.stringify({coords: element.coords})
                await fetch(url+"objections/"+element.id+"/",{method: 'POST', body: body}).then(response => response.json())
                .then((jsonData) => {data=jsonData.data;})
            }
        }
    }


    async saveSittingAreas(url, jsonData){
        var element; var body; var data;

        var toSaveSA = this.subtractLists(this.state.restaurant.sittingAreas, jsonData.data.sittingAreas)
        var toDeleteSA = this.subtractLists(jsonData.data.sittingAreas, this.state.restaurant.sittingAreas)

        for (element of toDeleteSA){
            await fetch(url+"sittingAreas/"+element.id+"/",{method: 'DELETE'}).then(response => response.json())
            .then((jsonData) => {data=jsonData.data;})
        }
        for (element of toSaveSA){
            body = JSON.stringify({coords: element.coords, padding: element.padding, type: element.type})
            await fetch(url+"sittingAreas/",{method: 'POST', body: body}).then(response => response.json())
            .then((jsonData) => {data=jsonData.data; element.id=data.id;})
        }
        for (element of this.state.restaurant.sittingAreas){
            if (this.toSave(element, jsonData.data.sittingAreas)){
                body = JSON.stringify({coords: element.coords})
                await fetch(url+"sittingAreas/"+element.id+"/",{method: 'POST', body: body}).then(response => response.json())
                .then((jsonData) => {data=jsonData.data;})
            }
        }
    }


    async saveGroups(url, jsonData){
        var element; var body; var data; var chrIDList = []; var chr; var tl;

        var toSaveGroups = this.subtractLists(this.state.restaurant.groups, jsonData.data.groups)
        var toDeleteGroups = this.subtractLists(jsonData.data.groups, this.state.restaurant.groups)

        for (element of toDeleteGroups){
            await fetch(url+"groups/"+element.id+"/",{method: 'DELETE'}).then(response => response.json())
            .then((jsonData) => {data=jsonData.data;})
        }
        for (element of toSaveGroups){
            chrIDList = []
            for (chr of element.chairs){chrIDList.push(chr.id)}
            body = JSON.stringify({table: element.table.id, chairs: chrIDList, coords: element.coords, padding: element.padding, orientation: element.orientation, sittingArea: element.sittingArea})
            await fetch(url+"groups/",{method: 'POST', body: body}).then(response => response.json())
            .then((jsonData) => {data=jsonData.data; element.id=data.id;})
        }
        for (element of this.state.restaurant.groups){
            if (this.toSave(element, jsonData.data.groups)){
                tl = element.coords != null ? [element.coords[0], element.coords[1]] : null;
                body = JSON.stringify({topLeft: tl, padding: element.padding, orientation: element.orientation, sittingArea: element.sittingArea})
                await fetch(url+"groups/"+element.id+"/",{method: 'POST', body: body}).then(response => response.json())
                .then((jsonData) => {data=jsonData.data;})
            }
        }
    }

    subtractLists(list1, list2){
        var res = []; var item; var didFind; var elem;
        for (item of list1){
            didFind = false;
            for (elem of list2){
                if (item.id === elem.id){didFind=true; break;};
            }
            if (!didFind){res.push(item);}
        } return res;
    }


    topLeftEqual(a, b) {
        if (a === b) {return true;}
        if ((a == null || a.includes(null)) && (b == null || b.includes(null))) {return true;}
        if (a == null || b == null) {return false;}
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]){return false;}
        }
        return true;
    }


    toSave(item, dataList){
        var element; var toCompare;
        toCompare = null;
        for (element of dataList){
            if (element.id === item.id){toCompare = element; break;}
        }
        if (toCompare == null){return true;}
        if (item instanceof Group){
            if (!(this.topLeftEqual(toCompare.topLeft, item.coords)) || toCompare.padding!==item.padding || toCompare.orientation!==item.orientation || toCompare.sittingArea!==item.sittingArea){return true;}
            return false;
        } else {
            if (!(this.topLeftEqual(toCompare.topLeft, item.coords))){return true;}
            return false;
        }
    }


    render(){
        var obj; var ls = []; var ls = []; var fur; var chr; var restHeight = "0px"; var restWidth = "0px";
        var details = null; var password = null;
        if (this.state.restaurant != null){
            for (obj of this.state.restaurant.sittingAreas){
                ls.push(<SittingAreaView sittingArea={obj} factor={this.state.factor}
                    selected= {obj === this.state.eventHandler.selected}/>)
                for (fur of obj.furniture){
                    ls.push(<TableView table={fur.table} factor={this.state.factor} occupied={fur.occupied.occupied}/>)
                    for (chr of fur.chairs){
                        ls.push(<ChairView chair={chr} factor={this.state.factor} occupied={fur.occupied.occupied}/>)
                    }
                    ls.push(<GroupView group={fur} coords={fur.coords} factor={this.state.factor}
                        selected= {fur === this.state.eventHandler.selected}/>)
                }
            }
            for (obj of this.state.restaurant.objections){
                ls.push(<ObjectionView objection={obj} factor={this.state.factor}
                    selected= {obj === this.state.eventHandler.selected}/>)
            }
            restHeight = this.state.restaurant.height*this.state.factor
            restWidth = this.state.restaurant.width*this.state.factor
            details = {
                name: this.state.restaurant.name,
                width: this.state.restaurant.width,
                height: this.state.restaurant.height,
                padding: this.state.restaurant.padding,
            };
            password = this.state.restaurant.password
        }
        var isDeleteDisabled = this.state.eventHandler.selected == null ||
            ((document.getElementById("moveButton").innerHTML == "Edit Furniture") && (document.getElementById("drawButton").innerHTML == "Edit Objections") &&
            (document.getElementById("saButton").innerHTML == "Edit Sitting Areas"));
        var isRotateDisabled = isDeleteDisabled ? true : !(this.state.eventHandler.selected instanceof Group);
        return (
        <div style={restaurantStyle.mainDiv}>

            <LeftInventory restaurant={this.state.restaurant} ondragend={this.addGroup}/>

            <CustomButtonListRest handleDraw = {this.handleDraw} handleSittingAreaEdit = {this.handleSittingAreaEdit}
            addTable = {this.addTables} addChair = {this.addChairs} handleWalkIn={this.handleWalkIn} save={this.save}/>

            <div id="restDisplay" style = {restaurantStyle.restaurantDisplay}>

                <div id= "restArea" name = "restaurantArea"
                style = {{position: 'relative',
                        width: restWidth,
                        height: restHeight,
                        minWidth: restWidth,
                        minHeight: restHeight,
                        backgroundColor: "rgba(196, 196, 196, 0.38)",
                        marginLeft: "30px"
                    }}>

                    <ul name = "restaurantArea" style={restaurantStyle.furnitureList}>
                        {ls.map(item => (<li key={ls.indexOf(item)}>{item}</li>))}
                    </ul>
                </div>
                <div style={restaurantStyle.buttons}>
                <button id= "deleteButton" style={{
                                marginTop: "5px",
                                width: "30px",
                                height: "30px",
                                float: "bottom",
                                backgroundColor: "#FFFFFF",
                                borderWidth: "0",
                                visibility: isDeleteDisabled ? "hidden" : "visible"}}
                                disabled= {isDeleteDisabled} onClick = {this.delete}>
                    <svg style={restaurantStyle.deleteSvg} xmlns="http://www.w3.org/2000/svg"
                    height="30" viewBox="0 0 24 24" width="30">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
                <button id= "rotateButton" style={{
                                marginTop: "5px",
                                width: "30px",
                                height: "30px",
                                backgroundColor: "#FFFFFF",
                                borderWidth: "0",
                                float: "bottom",
                                visibility: isRotateDisabled ? "hidden" : "visible"}}
                                disabled= {isRotateDisabled} onClick = {this.rotate}>
                    <svg style={restaurantStyle.rotateSvg} xmlns="http://www.w3.org/2000/svg"
                     height="30" viewBox="0 0 24 24" width="30">
                     <path d="M0 0h24v24H0z" fill="none"/>
                     <path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/>
                     </svg>
                </button>
                </div>
            </div>

            <CustomButtonListGUI setLayout={this.setLayout} handleMoveFurniture ={this.handleMoveFurniture}/>

            <RightInformation obj={this.state.eventHandler.selected != null ? this.state.eventHandler.selected : this.state.restaurant} paddingChanger = {this.changePadding} changeDetails={{func: this.changeDetails, details: details}} changePassword={{func: this.changePassword, password: password}} endMeal={this.endMeal}/>

            <div id="popUpContainer" style={{top:"100%", left:"100%"}}/>

        </div>
        );
    }
}

const restaurantStyle = { mainDiv:{
        float: "bottom",
        display: "flex",
        flexDirection: "row",
        marginTop: "3%",
        left: "0px",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        overflow: "scroll"
    }, restaurantDisplay: {
        width: "662px",
        height: "542px",
        float: "left",
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        marginRight:"2%",
        marginLeft:"2%",
        background: "#FFFFFF",
        border: "2px solid rgba(7, 7, 7, 0.65)",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        boxSizing: "border-box",
        borderRadius: "25px",
        overflow: "scroll"
    },  furnitureList: {
        position: 'relative',
        listStyleType:'none',
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        top: "0",
        left: "0"
    }, buttons: {
        position: "relative",
        marignLeft: "10px",
        height:"100%",
        width:"30px",
        minWidth: "30px",
        display: "flex",
        flexDirection:"column",
        alignItems: "center",
        gap: "5px"
    }, rotateSvg: {
        top: 0,
        left: 0,
        fill: "lightblue"
    }, deleteSvg: {
        fill: "lightblue"
    }, saveScreen: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        cursor: "progress",
        filter: "blur(4px)"
    }
}
