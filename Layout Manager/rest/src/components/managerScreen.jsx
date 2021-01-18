import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Restaurant from './restaurantClasses.js'
import RestaurantView from './restaurantView.jsx'
import NavBar from './navBar.jsx'
import {useHistory} from 'react-router-dom'

function ManagerScreen({match}){
    const history = useHistory();
    return (
        <div id="wholeScreen" style={{width:"100%",
                        height:"100%",
                        overflow: "scroll",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"}}>
            <NavBar restName={match.params.name}/>
            <RestaurantView id={match.params.id} history={history}/>
            <div id="saveContainer" style={{width:0, height:0, zIndex: "4"}}/>
            <p style={{alignItems: "center",
            justifyContent: "center",
            fontWeight: "300",
            fontStyle: "normal",
            fontSize: "10px",}}>*Drag tables from inventory to add furniture.</p>
        </div>
    );
}

export default ManagerScreen;
