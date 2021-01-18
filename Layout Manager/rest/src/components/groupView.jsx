import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class GroupView extends Component{
    constructor(props){
        super(props);
        this.state = {group: props.group, factor: props.factor, selected: props.selected}
    }

    componentDidMount() {
        var elems = document.getElementsByName("group"); var elem = null; var e;
        for (e of elems){
            if (e.getAttribute("id")==this.state.group.id){elem = e;}
        }
        if (elem !== null){
            if (document.getElementById("moveButton").innerHTML === "Quit Edit"){
                elem.style.cursor = "move";
                elem.style.border = "thin solid black";
                elem.style.borderRadius = "5px";
            } else {
                elem.style.cursor = "auto";
            }
            if (document.getElementById("showBorderButton").innerHTML === "Hide Furniture Borders"){
                elem.style.border = "thin solid black";
                elem.style.borderRadius = "5px";
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.group !== prevProps.group || this.props.selected !== prevProps.selected){
            this.setState({group: this.props.group, selected: this.props.selected});
        }
    }

    render(){
        if (this.state.group.coords == null){return null;}
        return(
            <div id = {this.state.group.id} name = "group" style={{
                position: 'absolute',
                boxSizing: "border-box",
                zIndex: "3",
                left: this.state.group.coords[0]*this.state.factor,
                top: this.state.group.coords[1]*this.state.factor,
                width: this.state.group.width*this.state.factor,
                height: this.state.group.height*this.state.factor,
                border: this.state.selected ? "thin dashed blue" : "none",
                borderRadius: "5px"
            }}></div>
        );
    }
}
