import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class ChairView extends Component{
    constructor(props){
        super(props);
        this.state = {chair: props.chair, factor: props.factor, occupied: props.occupied}
    }

    componentDidUpdate(prevProps) {
        if (this.props.chair !== prevProps.chair || this.props.occupied !== prevProps.occupied) {
            this.setState({chair: this.props.chair, factor: this.props.factor, occupied: this.props.occupied});
        }
    }

    render(){
        if (this.state.chair.coords != null){
            return(
                <div style={{
                    position: 'absolute',
                    zIndex: "2",
                    left: this.state.chair.coords[0]*this.state.factor,
                    top: this.state.chair.coords[1]*this.state.factor,
                    width: this.state.chair.width*this.state.factor,
                    height: this.state.chair.height*this.state.factor,
                    backgroundColor: this.state.occupied ? "#B6DACD" : 'green'
                }}/>
            );
        } else {return null;}
    }
}
