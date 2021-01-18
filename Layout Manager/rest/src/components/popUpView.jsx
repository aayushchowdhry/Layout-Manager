import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class PopUp extends Component{
    constructor(props){
        super(props);
        if (props.type==="addTables"){
            this.state = {func: props.function, inputs: ["Input Table Length",
            "Input Table Width", "Input Table Capacity", "Number of Tables to Add",
            "Optional Input: Tables' Type"]}
        } else if (props.type==="addChairs") {
            this.state = {func: props.function, inputs: ["Input Chair Length",
            "Input Chair Width", "Number of Chairs to Add", "Optional Input: Chairs' Type"]}
        } else if (props.type==="login"){
            this.state = {func: props.function, inputs: ["Restaurant ID",
            "Password"]}
        } else if (props.type==="createRest"){
            this.state = {func: props.function, inputs: ["Restaurant Name",
            "Length", "Width", "Password"]}
        } else if (props.type==="changeDetails"){
            this.state = {func: props.function, inputs: ["Current Name: "+props.details.name, "Current Length: " +props.details.width, "Current Width: " +props.details.height,
            "Current Average Padding: " +props.details.padding], details: props.details}
        } else if (props.type==="changePassword"){
            this.state = {func: props.function, inputs: ["Current Password", "New Password", "Verify New Password"], details: props.details}
        } else if (props.type==="handleWalkIn"){
            this.state = {func: props.function, inputs: ["Number of People", "Last Name", "Mobile Number"]}
        } else {
            this.state = {func: null, inputs: []}
        }
        this.done = this.done.bind(this);
    }

    done(){
        if(this.props.type==="changeDetails"){
            var inputs = document.getElementsByName("inputField"); var obj; var params = []; var val;
            var inp;
            for (obj of inputs){
                val = obj.value;
                if (val === ''){inp = null}
                else {
                    inp = isNaN(val) ? String(val) : Number(val);
                    if (typeof(inp)== "number" && inp<=0){return;}
                }
                params.push(inp);
            }
            this.state.func(params[0], params[1], params[2], params[3]);
            document.getElementById("navBar").style.filter = "none";
            document.getElementById("restDisplay").style.filter = "none";
            document.getElementById("GUIButtonList").style.filter = "none";
            document.getElementById("restButtonList").style.filter = "none";
        } else {
            var inputs = document.getElementsByName("inputField"); var obj; var params = [];
            var typeInput = document.getElementById("inputType"); var inp;
            for (obj of inputs){
                if (obj.value === ''){return;}
                inp = isNaN(obj.value) ? String(obj.value) : Number(obj.value);
                if (typeof(inp)== "number" && inp<=0){return;}
                params.push(inp);
            }
            if (typeInput != null){params.push(typeInput.value);}
            if (this.props.type==="addChairs"){
                this.state.func(params[0],params[1],params[2],params[3])
                document.getElementById("navBar").style.filter = "none";
                document.getElementById("restDisplay").style.filter = "none";
                document.getElementById("GUIButtonList").style.filter = "none";
                document.getElementById("restButtonList").style.filter = "none";
                document.getElementById("rightDiv").style.filter = "none";
                document.getElementById("leftDiv").style.filter = "none";
            } else if(this.props.type==="addTables"){
                this.state.func(params[0],params[1],params[2],params[3], params[4])
                document.getElementById("navBar").style.filter = "none";
                document.getElementById("restDisplay").style.filter = "none";
                document.getElementById("GUIButtonList").style.filter = "none";
                document.getElementById("restButtonList").style.filter = "none";
                document.getElementById("rightDiv").style.filter = "none";
                document.getElementById("leftDiv").style.filter = "none";
            } else if(this.props.type==="changePassword"){
                if (params[0]!==this.state.details){alert("Current Password is Incorrect!"); return;}
                if (params[1]!==params[2]){alert("Passwords don't match!"); return;}
                this.state.func(params[1])
                document.getElementById("navBar").style.filter = "none";
                document.getElementById("restDisplay").style.filter = "none";
                document.getElementById("GUIButtonList").style.filter = "none";
                document.getElementById("restButtonList").style.filter = "none";
                document.getElementById("rightDiv").style.filter = "none";
                document.getElementById("leftDiv").style.filter = "none";
            } else if(this.props.type==="handleWalkIn"){
                if (!(9999999999>=params[2] && params[2]>=1000000000)){alert("Mobile Number is Invalid!"); return;}
                this.state.func(params[0], params[1], params[2])
                document.getElementById("navBar").style.filter = "none";
                document.getElementById("restDisplay").style.filter = "none";
                document.getElementById("GUIButtonList").style.filter = "none";
                document.getElementById("restButtonList").style.filter = "none";
                document.getElementById("rightDiv").style.filter = "none";
                document.getElementById("leftDiv").style.filter = "none";
            } else if(this.props.type==="login"){
                this.state.func(params[0],params[1])
                document.getElementById("rightDiv").style.filter = "none";
                document.getElementById("leftDiv").style.filter = "none";
            } else if(this.props.type==="createRest"){
                this.state.func(params[0], params[1], params[2], params[3])
                document.getElementById("rightDiv").style.filter = "none";
                document.getElementById("leftDiv").style.filter = "none";
            }
        }
        ReactDOM.unmountComponentAtNode(document.getElementById("popUpContainer"))
        document.getElementById("wholeScreen").removeEventListener('click', reversePress);
    }


    render(){
        var ls = []; var txt;
        if (this.props.type==="changeDetails"){
            for (txt of this.state.inputs){
                if (txt.includes("Name")){
                    ls.push(<input name="inputField" type="text" placeholder = {txt} style={popUpStyle.inputs}/>)
                } else {
                    ls.push(<input name="inputField" type="number" min={1} placeholder = {txt} style={popUpStyle.inputs}/>)
                }
            }
        } else {
            for (txt of this.state.inputs){
                if (txt.substring(0,8) === "Optional"){
                    ls.push(<input id="inputType" type="text" placeholder = {txt} style={popUpStyle.inputs}/>)
                } else if (txt.includes("Name")){
                    ls.push(<input name="inputField" type="text" placeholder = {txt} style={popUpStyle.inputs} required/>)
                } else if (txt.includes("Password")){
                    ls.push(<input name="inputField" type="password" placeholder = {txt} style={popUpStyle.inputs} required/>)
                } else if (txt==="Mobile Number"){
                    ls.push(<input name="inputField" type="number" min={1000000000} max={9999999999} placeholder = {txt} style={popUpStyle.inputs} required/>)
                } else {
                    ls.push(<input name="inputField" type="number" min={1} placeholder = {txt} style={popUpStyle.inputs} required/>)
                }
            }
        }
        return (
            <div style={popUpStyle.wholeScreen}>
            <div id="popUpBox" style={popUpStyle.popUpBox}>

            <form id="popUpForm" onSubmit={(event)=>{event.preventDefault();}}style={{display:'flex', flexDirection: "column", gap: "16px"}}>
                {ls.map(item => (item))}
                <div style={popUpStyle.buttonLayer}>
                <button id="popUpSubmitBut" style={popUpStyle.checkButton} onClick={this.done}>
                    <svg id="popUpSubmitSVG" style ={popUpStyle.checkSvg}
                    xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24"
                    width="24"><path id="popUpSubmitPath1" d="M0 0h24v24H0z" fill="none"/>
                    <path id="popUpSubmitPath2" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                </button>
                <button style={popUpStyle.closeButton}>
                    <svg style={popUpStyle.closeSvg} xmlns="http://www.w3.org/2000/svg"
                    height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                </div>
            </form>
            </div>
            </div>
        )
    }
}

function buttonPress(func=null, type=null, details=null){
    var elem = document.getElementById("popUpContainer")
    ReactDOM.render(<PopUp function={func} type={type} details={details}/>, elem);
    document.getElementById("wholeScreen").addEventListener('click', reversePress);
    document.getElementById("navBar").style.filter = "blur(4px)";
    document.getElementById("restDisplay").style.filter = "blur(4px)";
    document.getElementById("GUIButtonList").style.filter = "blur(4px)";
    document.getElementById("restButtonList").style.filter = "blur(4px)";
    document.getElementById("rightDiv").style.filter = "blur(4px)";
    document.getElementById("leftDiv").style.filter = "blur(4px)";
}

function reversePress(event){
    if (event.target.id === "popUpBox" || event.target.name === "inputField" || event.target.id === "popUpForm"
        || event.target.id === "popUpSubmitBut" || event.target.id === "popUpSubmitSVG"
        || event.target.id === "popUpSubmitPath1" || event.target.id === "popUpSubmitPath2"
        || event.target.id === "inputType"){return;}
    ReactDOM.unmountComponentAtNode(document.getElementById("popUpContainer"))
    document.getElementById("wholeScreen").removeEventListener('click', reversePress);
    document.getElementById("navBar").style.filter = "none";
    document.getElementById("restDisplay").style.filter = "none";
    document.getElementById("GUIButtonList").style.filter = "none";
    document.getElementById("restButtonList").style.filter = "none";
    document.getElementById("rightDiv").style.filter = "none";
    document.getElementById("leftDiv").style.filter = "none";
}

export {
    buttonPress,
    reversePress
}

const popUpStyle = {wholeScreen:{
        position: "absolute",
        display:"flex",
        top:"0",
        left:"0",
        height: "100%",
        width:"100%",
        alignItems: "center",
        justifyContent: "center"
    }, popUpBox: {
        width: "415px",
        height: "395px",
        backgroundColor: "#FFFFFF",
        border: "2px solid rgba(0, 0, 0, 0.25)",
        boxSizing: "border-box",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        display: "flex",
        flexDirection: "column",
        overflow: "scroll",
        justifyContent: "center",
        alignItems: "center",
    }, buttonLayer: {
        display:"flex",
        flexWrap: "wrap",
        width:"100%",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px"
    }, checkButton: {
        position: "relative",
        width: "24px",
        height: "24px",
        backgroundColor: "#FFFFFF",
        borderWidth: "0"
    }, checkSvg:{
        position: "absolute",
        left: "0",
        right: "0%",
        top: "0%",
        bottom: "0%",
        fill: "#4AC598"
    }, closeButton: {
        position: "relative",
        width: "24px",
        height: "24px",
        backgroundColor: "#FFFFFF",
        borderWidth: "0"
    }, closeSvg:{
        position: "absolute",
        left: "0",
        right: "0%",
        top: "0%",
        bottom: "0%",
        //background: 'rgba(7, 7, 7, 0.65)'
    }, inputs:{
        width: "338px",
        height: "50px",
        textAlign: "center",
        backgroundColor: "#E5E5E5",
        boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "11px",
        borderWidth: "0",
    }
}
