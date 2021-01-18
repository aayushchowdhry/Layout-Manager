import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class NavBar extends Component{
    constructor(props){
        super(props);
        this.state = {name: props.restName}
    }

    render(){
        return (
            <div id="navBar" style = {navBarStyle.navBar}>
                <div id="navBarText"style={navBarStyle.titleText}>{this.state.name}</div>
            </div>
        )
    }
}

const navBarStyle = {navBar: {
        float: "bottom",
        width: "100%",
        display: "flex",
        height:"57px",
        alignItems: "center",
        justifyContent: "center",
        left: "0px",
        top: "0px",
        backgroundColor: "#B6DACD"
    }, titleText:{
        position: "absolute",
        fontWeight: "100",
        fontStyle: "normal",
        fontSize: "46px",
        lineHeight: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(7, 7, 7, 0.65)"
    }
}
