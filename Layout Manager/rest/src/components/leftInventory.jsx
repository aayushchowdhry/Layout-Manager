import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Restaurant, {Table, Chair} from './restaurantClasses.js';

export default class LeftInventory extends Component{
    constructor(props){
        super(props);
        this.state = {restaurant: props.restaurant, ondragend: props.ondragend}
    }


    componentDidUpdate(prevProps) {
        if (this.props.restaurant != prevProps.restaurant){
            this.setState({restaurant: this.props.restaurant, ondragend: this.props.ondragend});
        } else if (this.props.restaurant == null){
        } else {
            var prevInv = this.getInventory(prevProps.restaurant);
            var inv = this.getInventory(this.props.restaurant);
            var obj; var object; var found;
            for (obj of prevInv){
                found = false;
                for (object of inv){
                    if ((obj.fur.isSame(object.fur) && obj.count===object.count)){found = true; break}
                }
                if (!found) {
                    this.setState({restaurant: this.props.restaurant, ondragend: this.props.ondragend});
                }
            }
        }
    }


    getInventory(rest){
        var count;
        var ls = []; var countedTb = []; var countedChr = []; var tb; var chr;
        if (rest != null){
            for (tb of rest.tables){
                if (tb.coords != null){countedTb.push(tb);}
            }
            for (chr of rest.chairs){
                if (chr.coords != null){countedChr.push(chr);}
            }
            for (tb of rest.tables){
                if (!(countedTb.includes(tb))){
                    count = this.findNumberOfSimilarTables(tb, countedTb);
                    ls.push({fur: tb, count: count})
                }
            }
            for (chr of rest.chairs){
                if (!(countedChr.includes(chr))){
                    count = this.findNumberOfSimilarChairs(chr, countedChr);
                    ls.push({fur: chr, count: count})
                }
            }
        }
        return ls;
    }


    getReservations(rest){
        var today = new Date();
        var bookings = [];
        if (rest != null){
            var res; var date=[]; var time=[]; var dateObj;
            for (res of rest.reservations){
                date= res.date.split("-")
                time= res.time.split(":")
                dateObj = new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]), Number(time[0]), Number(time[1]));
                if (dateObj>=today){bookings.push(res);}
            }
        }
        bookings.sort(function(a,b){
            if (a.date === b.date){
                var minsA = Number(a.time.substring(0,2))*60+Number(a.time.substring(3,5));
                var minsB = Number(b.time.substring(0,2))*60+Number(b.time.substring(3,5));
                return minsA - minsB;
            } else {
                var dateA= a.date.split("-");
                var dateB= b.date.split("-");
                if (dateA[0]===dateB[0]){
                    if (dateA[1]===dateB[1]){
                        return dateA[2]-dateB[2];
                    } else {
                        return dateA[1]-dateB[1];
                    }
                } else {
                    return dateA[0]-dateB[0];
                }
            }
        });
        return bookings;
    }


    findNumberOfSimilarTables(table, counted){
        var tb; var count = 0;
        for (tb of this.state.restaurant.tables){
            if (tb.coords==null && table.isSame(tb)){count++; counted.push(tb)}
        } return count;
    }


    findNumberOfSimilarChairs(chair, counted){
        var chr; var count = 0;
        for (chr of this.state.restaurant.chairs){
            if (chr.coords==null && chair.isSame(chr)){count++; counted.push(chr);}
        } return count;
    }


    render(){
        var inv = this.getInventory(this.state.restaurant);
        var bookings = this.getReservations(this.state.restaurant);
        var obj; var res; var ls = []; var rls = [];
        for (obj of inv){
            ls.push(<CellView fur={obj.fur} count={obj.count} ondragend={this.state.ondragend}/>)
        }
        for (res of bookings){
            rls.push(<ReservationView res={res}/>)
        }
        return (
            <div id="leftDiv" style={leftStyle.mainDiv}>
                <div style={leftStyle.halfDiv}>
                    <p style={leftStyle.heading}>Inventory</p>
                    <ul name = "invDisp" style={leftStyle.cellList}>
                        {ls.map(item => (<li key={ls.indexOf(item)}>{item}</li>))}
                    </ul>
                </div>
                <div style={leftStyle.halfDiv}>
                    <p style={leftStyle.heading}>Reservations</p>
                    <ul name = "resDisp" style={leftStyle.cellList}>
                        {rls.map(item => (<li key={rls.indexOf(item)}>{item}</li>))}
                    </ul>
                </div>
            </div>
        );
    }
}


class CellView extends Component{
    constructor(props){
        super(props);
        this.state = {fur: props.fur, count: props.count, factor: this.calculateFactor(props.fur.width, props.fur.height),
                        ondragend: props.ondragend, fromLeft: null, fromTop:null}
        this.startDrag = this.startDrag.bind(this)
    }


    componentDidUpdate(prevProps) {
        if (this.props.fur !== prevProps.fur || this.props.count !== prevProps.count) {
            this.setState({fur: this.props.fur, count: this.props.count, factor: this.calculateFactor(this.props.fur.width, this.props.fur.height), ondragend: this.props.ondragend, fromLeft: null, fromTop:null});
        }
    }


    calculateFactor(width, height){
        var proportion = 50/50; // width: height :: 662: 542
        if (width>height*proportion){
            return 50/width;
        } else if (height>width/proportion){
            return 50/height;
        } else {
            width = 50
            height = height*50/width;
            return 50/height;
        }
    }


    startDrag(event){
        var rect = event.target.getBoundingClientRect();
        this.state.fromLeft = event.clientX-rect.left;
        this.state.fromTop = event.clientY-rect.top;
    }


    render(){
        var fur = this.state.fur; var factor = this.state.factor;
        if (fur instanceof Table){
            return(
                <div style={leftStyle.cellDiv}>
                    <div style={leftStyle.containerDiv}>
                    <div style={{
                        width: (fur.width)*factor,
                        height: (fur.height)*factor,
                        boxSizing: "border-box",
                        backgroundColor: 'brown',
                    }} draggable onDragStart={this.startDrag} onDragEnd={(event)=>this.state.ondragend(event, fur, this.state.fromLeft, this.state.fromTop)}/>
                    </div>
                <div style={leftStyle.infoDiv}>
                    <p style={leftStyle.paragraph}>Number: {this.state.count}</p>
                    <p style={leftStyle.paragraph}>Width: {fur.width.toFixed(2)}</p>
                    <p style={leftStyle.paragraph}>Height: {fur.height.toFixed(2)}</p>
                    <p style={leftStyle.paragraph}>Type: {fur.type}</p>
                </div>
                </div>
            );
        } else if (fur instanceof Chair){
            return(
                <div style={leftStyle.cellDiv}>
                    <div style={leftStyle.containerDiv}>
                    <div style={{
                        width: (fur.width)*factor/2,
                        height: (fur.height)*factor/2,
                        backgroundColor: 'green',
                    }}/>
                    </div>
                    <div style={leftStyle.infoDiv}>
                        <p style={leftStyle.paragraph}>Number: {this.state.count}</p>
                        <p style={leftStyle.paragraph}>Width: {fur.width.toFixed(2)}</p>
                        <p style={leftStyle.paragraph}>Height: {fur.height.toFixed(2)}</p>
                        <p style={leftStyle.paragraph}>Type: {fur.type}</p>
                    </div>
                </div>
            );
        }
    }
}


class ReservationView extends Component{
    constructor(props){
        super(props);
        this.state = {res: props.res}
    }


    render(){
        var res = this.state.res;
        return(
            <div style={leftStyle.resDiv}>
                <div style={leftStyle.resInfoDiv}>
                    <p style={leftStyle.paragraph}>Number of People: {res.number}</p>
                    <p style={leftStyle.paragraph}>Last Name: {res.lastName}</p>
                    <p style={leftStyle.paragraph}>Mobile: {res.mobileNumber}</p>
                    <p style={leftStyle.paragraph}>Time: {res.time}</p>
                    <p style={leftStyle.paragraph}>Date: {res.date}</p>
                </div>
            </div>
        );
    }
}

const leftStyle = {mainDiv: {
        width: "178px",
        height: "542px",
        display: 'flex',
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginRight:"2%",
        background: "#4AC598",
        boxSizing: "border-box",
        borderRadius: "0 25px 25px 0",
        overflow: "scroll"
    }, halfDiv: {
        width: "100%",
        minWidth: "178px",
        height: "50%",
        display: 'flex',
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
        boxSizing: "border-box",
        overflow: "scroll"
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
    }, cellDiv: {
        width: "100%",
        height: "75px",
        display: 'flex',
        flexDirection: "row",
        gap: "5px",
        marginBottom: "5px",
        marginLeft: "3px",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
    }, cellList: {
        listStyleType:'none',
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        top: "0",
        left: "0",
    }, infoDiv: {
        width: "92px",
        height: "95%",
        minWidth:"50px",
        display: 'flex',
        flexDirection: "column",
        marginRight: "3px",
        alignItems: "left",
        justifyContent: "center",
        fontWeight: "300",
        fontStyle: "normal",
        fontSize: "10px",
    }, resDiv: {
        width: "100%",
        height: "75px",
        display: 'flex',
        flexDirection: "row",
        gap: "5px",
        marginBottom: "5px",
        marginLeft: "3px",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
    }, resInfoDiv: {
        width: "100%",
        height: "75px",
        display: 'flex',
        flexDirection: "column",
        marginBottom: "5px",
        marginLeft: "3px",
        marginRight: "3px",
        alignItems: "left",
        justifyContent: "center",
        boxSizing: "border-box",
        fontWeight: "300",
        fontStyle: "normal",
        fontSize: "10px",
        border: "0 0 1px 0",
        borderWidth: "0 0 1px 0",
        borderStyle: "solid",
        borderColor: "black"
    }, containerDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "75px",
        height: "75px",
        background:"white",
        borderRadius: "5px"
    }, paragraph: {
        height: "20px",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0
    }
}
