import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class TableView extends Component{
    constructor(props){
        super(props);
        this.state = {table: props.table, factor: props.factor, occupied: props.occupied}
    }

    componentDidUpdate(prevProps) {
        if (this.props.table !== prevProps.table || this.props.occupied !== prevProps.occupied) {
            this.setState({table: this.props.table, factor: this.props.factor, occupied: this.props.occupied});
        }
    }

    render(){
        if (this.state.table.coords == null){return null;}
        return(
            <div style={{
                position: 'absolute',
                zIndex: "2",
                left: this.state.table.coords[0]*this.state.factor,
                top: this.state.table.coords[1]*this.state.factor,
                width: this.state.table.width*this.state.factor,
                height: this.state.table.height*this.state.factor,
                backgroundColor: this.state.occupied ? "rgba(160, 98, 72, 1.0)" :'brown',
            }}/>
        );
    }
}
