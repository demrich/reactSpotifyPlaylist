import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';


let fakeServerData = {
  user: {
    name: 'Matthew',
    playlists: [
      {
        name: 'My favorites',
        songs: [{name:'beat off', duration:12345}, {name:'what the fuck', duration:23415}, {name: 'woah holy shit', duration:945374} ]
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
      <img src={playlist.image} />
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
      filterString:'',
      image:''
   }
}
componentDidMount(){
  let parsed = queryString.parse(window.location.search);
  let accessToken = parsed.access_token;
  if(!accessToken)
  return;

{/* Pulls the Username */}
  fetch('https://api.spotify.com/v1/me', {
    headers: {
    'Authorization': 'Bearer ' + accessToken
    }})
    .then((response) =>response.json())
    .then(data => {
      console.log(data)
     this.setState({
       user: {
        name: data.display_name,
        id: data.id
      }
      })
    });
    
  fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
    'Authorization': 'Bearer ' + accessToken
    }})
    .then((response) =>response.json())
    .then(data => this.setState({
      playlists: data.items.map(item => {
        return {
        name: item.name,
        id: item.id, 
        songs: [],
        image: 'https://fakeimg.pl/60/',
        }
      })
     })
    )



};

  render() {
let playlistsToRender = 
  this.state.user && this.state.playlists ? 
  this.state.playlists.filter( playlist =>
  playlist.name.toLowerCase().includes(
  this.state.filterString.toLowerCase())
  ) : []

    return (
      <div className="App">
        {this.state.user ? 
          <div>
            <h1 className="App-title">Hello, {this.state.user.name}
            </h1>
            <PlayListCounter playlists={playlistsToRender}/> 
            <HourCounter  playlists ={playlistsToRender}/> 
            <Filter onTextChange={text => this.setState({filterString: text})} /> 

            { /* maps out playlist */ }
            {playlistsToRender.map((playlist) => 
            <PlayList key={playlist.id} playlist={playlist} />)}
          </div> : <h1 className="App-title"><button onClick={ ()=> window.location = 'http://localhost:8888/login' }>Sign in with Spotify</button></h1>

      }
      </div>
    );
  }

  
}

export default App;
