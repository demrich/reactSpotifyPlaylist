import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
let textColor = '#fff';

let fakeServerData = {
  user: {
    name: 'Matthew',
    playlists: [
      {
        name: 'My favorites',
        songs: [{name:'beat off', duration:12345}, {name:'what the fuck', duration:23415}, {name: 'woah holy shit', duration:945374} ]
      },
      {
        name: 'Weekly Shit',
        songs: [{name:'beating', duration:12345}, {name:'awesome', duration:23415}, {name: 'woah holy shit', duration:92374} ]
      },
      {
        name: 'Off the Charts',
        songs: [{name:'off', duration:12345}, {name:'cool', duration:23415}, {name: 'whatever', duration:92244} ]
      },
      {
        name: 'Indie Goth Bois',
        songs: [{name:' fuck boi', duration:12345}, {name:'xanban', duration:23415}, {name: 'go away', duration:2342374} ]
      }
    ]
  }
};


class PlayListCounter extends Component {
  render() {
    return (
      <div style ={{width : '40%', display: 'inline-block'}}>
      <h2>{this.props.playlists.length}</h2>
      </div>
    );
    }
}

class HourCounter extends Component {
  render() {
    let totalSongs = this.props.playlists.reduce((songs, eachPlaylist) =>{
      return songs.concat(eachPlaylist.songs)
    }, [])

    let totalDuration = totalSongs.reduce((sum, eachSong) =>{
      return Math.round((sum + eachSong.duration)/60)
    }, 0)

    return (
      <div style ={{width : '40%', display: 'inline-block'}}>
      <h2>{totalDuration} hours</h2>
      </div>
    );
    }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <img />
        <input type="text" onKeyUp={event => 
          this.props.onTextChange(event.target.value)} />
      </div>
    );
  }
}

class PlayList extends Component {
  render() {
    let playlist = this.props.playlist;

    return (
      <div style = {{width : '25%', display : 'inline-block'}}>
      <img />
      <h3>{playlist.name}</h3>
      <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
      </ul>
      </div>
    );
  }
}

class App extends Component {
constructor() {
    super();
    this.state = {
      serverData: {},
      filterString:''
   }
}
componentDidMount = () => {
  setTimeout(() => {
    this.setState({serverData: fakeServerData})
  }, 1000);
};

  render() {
let playlistsToRender = this.state.serverData.user ? this.state.serverData.user.playlists.filter( playlist =>
  playlist.name.toLowerCase().includes(
    this.state.filterString.toLowerCase())
) : []
    return (
      <div className="App">
      
        {this.state.serverData.user ? 
          <div>
          <h1 className="App-title">Hello, 
        {this.state.serverData.user.name}
         </h1>
        <PlayListCounter playlists={
            playlistsToRender
        }/>    
        <HourCounter  playlists ={
            playlistsToRender

        }/> 
        
        <Filter onTextChange={text => this.setState({filterString: text})} /> 

        {playlistsToRender.map((playlist) => 
        <PlayList playlist={playlist} />)}

        </div> : <h1 className="App-title">Loading...</h1>

      }
      </div>
    );
  }

  
}

export default App;
