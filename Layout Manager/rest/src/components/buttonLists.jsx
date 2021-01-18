import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PopUp, { buttonPress, reversePress } from './popUpView.jsx';

class CustomButtonListGUI extends Component{
    constructor(props){
        super(props);
        this.state = {setLayout: props.setLayout, handleDelete: props.handleDelete,
                    handleMoveFurniture: props.handleMoveFurniture}
    }

    handleHover(but){
        but.target.style.background = '#3C9F7C';
    }

    handleHoverOp(but){
        but.target.style.background = "#4AC598";
    }

    showSeatingAreas(){
        var sas = document.getElementsByName("sittingArea"); var sa;
        var elem = document.getElementById("showButton");
        if (elem.innerHTML === "Show Sitting Area Borders"){
            elem.innerHTML = "Hide Sitting Area Borders";
            for (sa of sas){sa.style.border = "medium solid black";}
        } else {
            elem.innerHTML = "Show Sitting Area Borders";
            for (sa of sas){sa.style.border = "none";}
        }
    }

    showFurnitureBorders(){
        var grps = document.getElementsByName("group"); var grp;
        var elem = document.getElementById("showBorderButton");
        if (elem.innerHTML === "Show Furniture Borders"){
            elem.innerHTML = "Hide Furniture Borders";
            for (grp of grps){
                grp.style.border = "thin solid black";
                grp.style.borderRadius = "5px";
            }
        } else {
            elem.innerHTML = "Show Furniture Borders";
            for (grp of grps){grp.style.border = "none";}
        }
    }

    render(){
        return (
            <div id="GUIButtonList" style={buttonStyle.buttonList}>

                View Operations

                <button name = {"button"} style = {buttonStyle.buttonGUI} onMouseOver={this.handleHover}
                onMouseLeave = {this.handleHoverOp} onClick = {this.state.setLayout}>
                Generate Suggested Layout
                </button>

                <button id = {"moveButton"} name = {"button"} style = {buttonStyle.buttonGUI}
                onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                onClick={this.state.handleMoveFurniture}>
                Edit Furniture
                </button>

                <button id = {"showButton"} name = {"button"} style = {buttonStyle.buttonGUI}
                onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                onClick={this.showSeatingAreas}>
                Hide Sitting Area Borders
                </button>

                <button id = {"showBorderButton"} name = {"button"} style = {buttonStyle.buttonGUI}
                onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                onClick={this.showFurnitureBorders}>
                Show Furniture Borders
                </button>

            </div>
        )
    }
}

class CustomButtonListRest extends Component{
    constructor(props){
        super(props);
        this.state = {handleDraw: props.handleDraw,
            handleSittingAreaEdit: props.handleSittingAreaEdit,
            addTable: props.addTable,
            addChair: props.addChair,
            handleWalkIn: props.handleWalkIn,
            save: props.save}
    }

    handleHover(but){
        but.target.style.background = '#3C9F7C';
    }

    handleHoverOp(but){
        but.target.style.background = "rgba(7, 7, 7, 0.25)";
    }

    render(){
        return (
            <div id="restButtonList" style={buttonStyle.buttonList}>

                Restaurant Operations

                <button id = {"drawButton"} name = {"button"} style = {buttonStyle.buttonRest}
                onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                onClick = {this.state.handleDraw}>
                Edit Objections
                </button>

                <button id = {"saButton"} name = {"button"} style = {buttonStyle.buttonRest}
                onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                onClick = {this.state.handleSittingAreaEdit}>
                Edit Sitting Areas
                </button>

                <button name = {"button"} style = {buttonStyle.buttonRest}
                onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                onClick = {() => buttonPress(this.state.addTable, "addTables")}>
                Add Tables
                </button>

                <button name = {"button"} style = {buttonStyle.buttonRest}
                onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                onClick = {() => buttonPress(this.state.addChair, "addChairs")}>
                Add Chairs
                </button>

                <button name = {"button"} style = {buttonStyle.buttonRest}
                onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                onClick = {() => buttonPress(this.state.handleWalkIn, "handleWalkIn")}>
                Customer Walk-In
                </button>

                <button id = {"saveButton"} name = {"button"} style = {buttonStyle.buttonRest}
                 onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                 onClick = {this.state.save}>
                 Save Changes
                 </button>

            </div>
        )
    }
}


const buttonStyle = {buttonList: {
        float: "left",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",

        color: "rgba(7, 7, 7, 0.65)",
        fontWeight: "200",
        fontStyle: "normal",
        fontSize: "18px",
        lineHeight: "17px"
    },buttonGUI: {
        width: "131px",
        height: "32px",
        backgroundColor: "#4AC598",
        borderRadius: "7px",
        borderWidth: "0",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        color: "rgba(7, 7, 7, 0.65)",
        fontWeight: "200",
        fontStyle: "normal",
        fontSize: "14px",
        lineHeight: "17px",
        alignItems: "center",
        justifyContent: "center",
    },buttonRest: {
        width: "131px",
        height: "32px",
        backgroundColor: "rgba(7, 7, 7, 0.25)",
        borderRadius: "7px",
        borderWidth: "0",
        boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
        color: "rgba(7, 7, 7, 0.65)",
        fontWeight: "200",
        fontStyle: "normal",
        fontSize: "14px",
        lineHeight: "17px",
        alignItems: "center",
        justifyContent: "center",
    }
}

export {
    CustomButtonListGUI,
    CustomButtonListRest
}
