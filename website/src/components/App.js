import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home/Home';
import Dashboard from './dashboard/Dashboard';
import './App.scss';

function App() {

  return (
    <div className="app">
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/dash' component={Dashboard}/>
      </Switch>
    </div>
  );
}

export default App;
