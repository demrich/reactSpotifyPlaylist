import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
let textColor = '#fff';

class Aggregate extends Component {
  render() {
    return (
      <div style ={{width : '40%', display: 'inline-block'}}>
      <h2>Number Text</h2>
      </div>
    );
    }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <img />
        <input type="text" />
        Filter
      </div>
    );
  }
}

class PlayList extends Component {

  render() {
    return (
      <div style = {{width : '25%', display : 'inline-block'}}>
      <img />
      <h3>PlayList Name</h3>
      <ul>
        <li>Song 1</li>
        <li>Song 2</li>
        <li>Song 3</li>

      </ul>
      </div>
    );
  }
}

class App extends Component {
  render() {

    let name = "Dave"
    
    return (
      <div className="App">
        <h1 className="App-title">Hello, {name}</h1>   
        <Aggregate />    
        <Aggregate />    
        <Filter /> 
        <PlayList />
        <PlayList />
        <PlayList />


      </div>
    );
  }
}

export default App;
