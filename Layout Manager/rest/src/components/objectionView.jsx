import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class ObjectionView extends Component{
    constructor(props){
        super(props);
        this.state = {objection: props.objection, factor: props.factor, selected: props.selected}
    }

    componentDidMount() {
        if (document.getElementById("drawButton").innerHTML === "Quit Edit"){
            document.getElementById(this.state.objection.id).style.cursor = "move";
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.objection !== prevProps.objection || this.props.selected !== prevProps.selected) {
            this.setState({objection: this.props.objection, factor: this.props.factor, selected: this.props.selected});
        }
    }

    render(){
        return(
            <div id={this.state.objection.id} name = "objection" style={{
                position: 'absolute',
                boxSizing: "border-box",
                zIndex: "2",
                left: this.state.objection.coords[0]*this.state.factor,
                top: this.state.objection.coords[1]*this.state.factor,
                width: this.state.objection.width*this.state.factor,
                height: this.state.objection.height*this.state.factor,
                backgroundColor: 'black',
                border: this.state.selected ? "medium dashed lightblue" : "none"
            }}/>
        );
    }
}
