import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Switch, Route} from "react-router-dom";
import ManagerScreen from './components/managerScreen.jsx';
import StartScreen from './components/startScreen.jsx';

function App() {
  return (
    <HashRouter>
        <div>
            <Switch>
                <Route path={"/:name/:id"} exact component={ManagerScreen} />
                <Route path={""} exact component={StartScreen}/>
            </Switch>
        </div>
    </HashRouter>
  );
}

export default App;
