import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Restaurant, {Group, Objection, SittingArea} from './restaurantClasses.js';
import PopUp, { buttonPress, reversePress } from './popUpView.jsx';

export default class RightInformation extends Component{
    constructor(props){
        super(props);
        if (props.obj != null){
            this.state = {obj: props.obj, factor: this.calculateFactor(props.obj.width, props.obj.height), paddingChanger: props.paddingChanger, changeDetails: props.changeDetails, changePassword: props.changePassword, endMeal: props.endMeal}
        } else {
            this.state = {obj: props.obj, factor: 0, paddingChanger: props.paddingChanger, changeDetails: props.changeDetails, changePassword: props.changePassword, endMeal: props.endMeal}
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.obj !== prevProps.obj || this.props.changeDetails.details !== prevProps.changeDetails.details
        || this.props.changePassword.password !== prevProps.changePassword.password) {
            this.setState({obj: this.props.obj, factor: this.calculateFactor(this.props.obj.width, this.props.obj.height), paddingChanger: this.props.paddingChanger, changeDetails: this.props.changeDetails, changePassword: this.props.changePassword, endMeal: this.props.endMeal});
        }
    }


    calculateFactor(width, height){
        var proportion = 100/100; // width: height :: 662: 542
        if (width>height*proportion){
            return 100/width;
        } else if (height>width/proportion){
            return 100/height;
        } else {
            width = 100
            height = height*100/width;
            return 100/height;
        }
    }

    handleHover(but){
        but.target.style.background = '#3C9F7C';
    }

    handleHoverOp(but){
        but.target.style.background = "rgba(7, 7, 7, 0.25)";
    }


    render(){
        var ls=[]; var chr; var obj = this.state.obj; var factor = this.state.factor;
        var fur; var sa; var objection;

        if (obj == null){
            return(
                <div id="rightDiv" style={rightStyle.mainDiv}>
                    <p style={rightStyle.heading}>Kiosk</p>
                </div>
                );
        }

        if (obj instanceof Group){
            if (obj.table.coords==null){return null;}
            ls.push(<div style={{
                position: 'absolute',
                left: (obj.table.coords[0]-obj.coords[0])*factor,
                top: (obj.table.coords[1]-obj.coords[1])*factor,
                width: (obj.table.width)*factor,
                height: (obj.table.height)*factor,
                backgroundColor: 'brown',
            }}/>);
            for (chr of obj.chairs){
                ls.push(<div style={{
                    position: 'absolute',
                    left: (chr.coords[0]-obj.coords[0])*factor,
                    top: (chr.coords[1]-obj.coords[1])*factor,
                    width: (chr.width)*factor,
                    height: (chr.height)*factor,
                    backgroundColor: 'green',
                }}/>)
            }
            if (obj.occupied.occupied){
                var till = (Number(obj.occupied.reservation.time.substring(0,2))*60 + Number(obj.occupied.reservation.time.substring(3,5))) + obj.occupied.reservation.duration;
                var hours = Math.floor(till/60)%24;
                var mins = till%60
                var till = hours+":"+mins
                return(
                <div id="rightDiv" style={rightStyle.mainDiv}>

                    <p style={rightStyle.heading}>Kiosk</p>

                    <div style = {{position: "relative", width: obj.width*factor, height: obj.height*factor, background:"white", borderRadius: "5px"}}>
                        <ul name = "objDisp" style={rightStyle.furnitureList}>
                            {ls.map(item => (<li key={ls.indexOf(item)}>{item}</li>))}
                        </ul>
                    </div>

                    <div style={rightStyle.infoDiv}>
                        <p style={rightStyle.paragraph}>Table Number: {obj.table.id}</p>
                        <p style={rightStyle.paragraph}>Orientation: {obj.orientation==="vertical" ? "Vertical" : "Horizontal"}</p>
                        <p style={rightStyle.paragraph}>Occupied By: {obj.occupied.reservation.lastName}</p>
                        <p style={rightStyle.paragraph}>Party Size: {obj.occupied.reservation.number}</p>
                        <p style={rightStyle.paragraph}>Occupied Till: {till}</p>

                        <button id = {"detailsButton"} name = {"button"} style = {rightStyle.button}
                        onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                        onClick = {()=>this.state.endMeal(obj)}>
                        End Meal
                        </button>

                    </div>

                </div>
                );
            } else {
                return(
                <div id="rightDiv" style={rightStyle.mainDiv}>

                    <p style={rightStyle.heading}>Kiosk</p>

                    <div style = {{position: "relative", width: obj.width*factor, height: obj.height*factor, background:"white", borderRadius: "5px"}}>
                        <ul name = "objDisp" style={rightStyle.furnitureList}>
                            {ls.map(item => (<li key={ls.indexOf(item)}>{item}</li>))}
                        </ul>
                    </div>

                    <div style={rightStyle.infoDiv}>
                        <p style={rightStyle.paragraph}>Table Number: {obj.table.id}</p>
                        <p style={rightStyle.paragraph}>Orientation: {obj.orientation==="vertical" ? "Vertical" : "Horizontal"}</p>
                        <p style={rightStyle.paragraph}> Padding: <input id="paddingInputField" type="number"
                        value = {obj.padding} style={rightStyle.input} onChange={event=>this.state.paddingChanger(obj, Number(event.target.value))}/></p>
                        <p style={rightStyle.paragraph}>Capacity: {obj.capacity}</p>
                        <p style={rightStyle.paragraph}> Type: {obj.table.type==null ? "None": obj.table.type}</p>
                    </div>

                </div>
                );
            }
        } else if (obj instanceof Objection){
            return(
                <div id="rightDiv" style={rightStyle.mainDiv}>

                    <p style={rightStyle.heading}>Kiosk</p>

                    <div style = {{position: "relative", width: obj.width*factor, height: obj.height*factor, background:"black", borderRadius: "5px"}}/>

                    <div style={rightStyle.infoDiv}>
                        <p style={rightStyle.paragraph}>Objection Number: {obj.id}</p>
                        <p style={rightStyle.paragraph}>Width: {obj.width.toFixed(2)}</p>
                        <p style={rightStyle.paragraph}>Height: {obj.height.toFixed(2)}</p>
                        <p style={rightStyle.paragraph}> Type: {obj.type==null ? "None": obj.type}</p>
                    </div>

                </div>
                );

        } else if (obj instanceof SittingArea){
            for (fur of obj.furniture){
                ls.push(<div style={{
                    position: 'absolute',
                    left: (fur.table.coords[0]-obj.coords[0])*factor,
                    top: (fur.table.coords[1]-obj.coords[1])*factor,
                    width: (fur.table.width)*factor,
                    height: (fur.table.height)*factor,
                    backgroundColor: 'brown',
                }}/>)
                for (chr of fur.chairs){
                    ls.push(<div style={{
                        position: 'absolute',
                        left: (chr.coords[0]-obj.coords[0])*factor,
                        top: (chr.coords[1]-obj.coords[1])*factor,
                        width: (chr.width)*factor,
                        height: (chr.height)*factor,
                        backgroundColor: 'green',
                    }}/>)
                }
            }
            return(
                <div id="rightDiv" style={rightStyle.mainDiv}>

                    <p style={rightStyle.heading}>Kiosk</p>

                    <div style = {{position: "relative", width: obj.width*factor, height: obj.height*factor, background:"rgba(196, 196, 196, 1)", borderRadius: "5px"}}>
                        <ul name = "objDisp" style={rightStyle.furnitureList}>
                            {ls.map(item => (<li key={ls.indexOf(item)}>{item}</li>))}
                        </ul>
                    </div>

                    <div style={rightStyle.infoDiv}>
                        <p style={rightStyle.paragraph}>Area Number: {obj.id}</p>
                        <p style={rightStyle.paragraph}>Width: {obj.width.toFixed(2)}</p>
                        <p style={rightStyle.paragraph}>Height: {obj.height.toFixed(2)}</p>
                        <p style={rightStyle.paragraph}> Type: {obj.type==null ? "None": obj.type}</p>
                    </div>

                </div>
                );
        }

        for (sa of obj.sittingAreas){
            for (fur of sa.furniture){
                if (fur.table.coords != null){
                    ls.push(<div style={{
                        position: 'absolute',
                        left: (fur.table.coords[0])*factor,
                        top: (fur.table.coords[1])*factor,
                        width: (fur.table.width)*factor,
                        height: (fur.table.height)*factor,
                        backgroundColor: 'brown',
                    }}/>);
                }
                for (chr of fur.chairs){
                    if (chr.coords != null){
                        ls.push(<div style={{
                            position: 'absolute',
                            left: (chr.coords[0])*factor,
                            top: (chr.coords[1])*factor,
                            width: (chr.width)*factor,
                            height: (chr.height)*factor,
                            backgroundColor: 'green',
                        }}/>)
                    }
                }
            }
            for (objection of obj.objections){
                ls.push(<div style={{
                    position: 'absolute',
                    left: objection.coords[0]*factor,
                    top: objection.coords[1]*factor,
                    width: objection.width*factor,
                    height: objection.height*factor,
                    backgroundColor: 'black',
                }}/>)
            }
        }
        return(
            <div id="rightDiv" style={rightStyle.mainDiv}>

                <p style={rightStyle.heading}>Kiosk</p>

                <div style = {{position: "relative", width: obj.width*factor, height: obj.height*factor, background:"rgba(196, 196, 196, 1)", borderRadius: "5px"}}>
                    <ul name = "objDisp" style={rightStyle.furnitureList}>
                        {ls.map(item => (<li key={ls.indexOf(item)}>{item}</li>))}
                    </ul>
                </div>

                <div style={rightStyle.infoDiv}>
                    <p style={rightStyle.paragraph}>Unique ID: {obj.id}</p>
                    <p style={rightStyle.paragraph}>Name: {obj.name}</p>
                    <p style={rightStyle.paragraph}>Width: {obj.width.toFixed(2)}</p>
                    <p style={rightStyle.paragraph}>Height: {obj.height.toFixed(2)}</p>
                    <p style={rightStyle.paragraph}>Average Padding: {obj.padding}</p>
                </div>

                <button id = {"detailsButton"} name = {"button"} style = {rightStyle.button}
                onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                onClick = {() => buttonPress(this.state.changeDetails.func, "changeDetails", this.state.changeDetails.details)}>
                Edit Details
                </button>

                <button id = {"detailsButton"} name = {"button"} style = {rightStyle.button}
                onMouseOver={this.handleHover} onMouseLeave = {this.handleHoverOp}
                onClick = {() => buttonPress(this.state.changePassword.func, "changePassword", this.state.changePassword.password)}>
                Change Password
                </button>

            </div>
            );
    }
}


const rightStyle = { mainDiv: {
        width: "178px",
        height: "542px",
        display: 'flex',
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        justifyContent: "center",
        marginLeft:"2%",
        background: "#4AC598",
        boxSizing: "border-box",
        borderRadius: "25px 0 0 25px",
        overflow: "scroll"
    }, infoDiv: {
        minWidth:"170px",
        display: 'flex',
        flexDirection: "column",
        gap: "5px",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "250",
        fontStyle: "normal",
        fontSize: "14px"
    }, furnitureList: {
        position: 'relative',
        listStyleType:'none',
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        top: "0",
        left: "0"
    }, paragraph: {
        height: "20px",
        overflow: "scroll",
        textOverflow: "ellipsis",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0
    }, input: {
        width: "70px",
        height: "100%",
        border: "none",
        borderRadius: "2px",
        backgroundColor: "rgba(7, 7, 7, 0.25)",
        overflow: "scroll"
    }, button: {
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
    }, heading: {
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "200",
        fontStyle: "normal",
        fontSize: "32px",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
        borderWidth: "0 0 1px 0",
        borderStyle: "solid",
        borderColor: "white"
    }
}
