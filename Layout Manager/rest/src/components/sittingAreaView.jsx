import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class SittingAreaView extends Component{
    constructor(props){
        super(props);
        this.state = {sittingArea: props.sittingArea, factor: props.factor, selected: props.selected}
    }

    componentDidMount() {
        if (document.getElementById("saButton").innerHTML === "Quit Edit"){
            document.getElementById(this.state.sittingArea.id).style.cursor = "move";
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.sittingArea !== prevProps.sittingArea || this.props.selected !== prevProps.selected) {
            this.setState({sittingArea: this.props.sittingArea, factor: this.props.factor, selected: this.props.selected});
        }
    }

    render(){
        return(
            <div id = {this.state.sittingArea.id} name = "sittingArea" style={{
                position: 'absolute',
                boxSizing: "border-box",
                zIndex: "1",
                left: this.state.sittingArea.coords[0]*this.state.factor,
                top: this.state.sittingArea.coords[1]*this.state.factor,
                width: this.state.sittingArea.width*this.state.factor,
                height: this.state.sittingArea.height*this.state.factor,
                backgroundColor: "rgba(196, 196, 196, 0.38)",
                border: this.state.selected ? "medium dashed blue" : "medium solid black"
            }}></div>
        );
    }
}
