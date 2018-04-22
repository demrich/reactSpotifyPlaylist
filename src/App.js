import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';


// let fakeServerData = {
//   user: {
//     name: 'Matthew',
//     playlists: [
//       {
//         name: 'My favorites',
//         songs: [{name:'beat off', duration:12345}, {name:'what the fuck', duration:23415}, {name: 'woah holy shit', duration:945374} ]
//       }
//     ]
//   }
// };

function ProfilePic(props) {
  return(
    <a href={props.profile} target="_blank"><img src={props.image} alt='profile pic' /></a>
  )
}

function ProfileName(props) {
  return(
    <h1>Hello, {props.name}</h1>
  )
}

class PlayListCounter extends Component {
  render() {
    return (
      <div style ={{width : '40%', display: 'inline-block'}}>
      <h2>{this.props.playlists.length} Playlists</h2>
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
      return sum + eachSong.duration
    }, 0)

    return (
      <div style ={{width : '40%', display: 'inline-block'}}>
      <h2>{Math.round(totalDuration/60)} Hours</h2>
      </div>
    );
    }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <input type="text" onKeyUp={event => 
          this.props.onTextChange(event.target.value)} />
      </div>
    );
  }
}
// Image for Playlists
function PlaylistImage(props) {
  return( 
    <a href={props.link} target="_blank"><img src={props.image} alt="playlist pic" /> </a>
  )
}

// Songs and Titles 
function PlaylistListing(props) {
  return(
   <div>
    <h3>{props.name}</h3>
    <ul>
    {props.songs.map(song =>
      <li>{song.name} - {song.artist}</li>
    )}
    </ul>
   </div>
  )
}

class PlayList extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div style = {{width : '25%', display : 'inline-block'}}>
      <PlaylistImage link={playlist.link} image="https://fakeimg.pl/60/" />
      <PlaylistListing name={playlist.name} songs={playlist.songs} />
      </div>
    );
  }
}
 
class App extends Component {
constructor(props) {
    super(props);
    this.state = {
      serverData: {},
      filterString:'',
    }
}
componentDidMount(){
  let parsed = queryString.parse(window.location.search);
  let accessToken = parsed.access_token;
  if(!accessToken)
  return;

// Pull User Info
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
        id: data.id,
        image: data.images[0].url,
        profile: data.external_urls.spotify
      }
      })
    });
    
  //Pull Playlist Info
  fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {'Authorization': 'Bearer ' + accessToken}
  })
    .then((response) =>response.json())

    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises = playlists.map(playlist =>{
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromise = responsePromise
        .then((response) =>response.json())
        return trackDataPromise
      })

      let allTracksDatasPromises =  Promise.all(trackDataPromises)

      let playlistsPromise = allTracksDatasPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items
          .map(item => item.track)
          .map(trackData => {
            return ({
            artist: trackData.artists[0].name,
            name: trackData.name,
            duration: trackData.duration_ms/1000

          })})
        })
        return playlists
      })
      return playlistsPromise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(item => {
        console.log(item.name)
        return {
        name: item.name,
        id: item.id, 
        link: item.external_urls.spotify,
        songs: item.trackDatas.slice(0,3)
        }
      })
     })
    )
};

  render() {
let playlistsToRender = 
  this.state.user && this.state.playlists ? 
  this.state.playlists.filter( playlist =>{
    let matchesPlaylist = playlist.name.toLowerCase().includes(
      this.state.filterString.toLowerCase())
    let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
    .includes(this.state.filterString.toLowerCase()))
    let matchesArtist = playlist.songs.find(song => song.artist.toLowerCase()
    .includes(this.state.filterString.toLowerCase()))
  return  matchesPlaylist || matchesSong || matchesArtist
  }) : []

    return (
      <div className="App">
        {this.state.user ? 
          <div>
            <ProfilePic image={this.state.user.image} profile={this.state.user.profile} />
            <ProfileName name={this.state.user.name} />
            <PlayListCounter playlists={playlistsToRender}/> 
            <HourCounter  playlists ={playlistsToRender}/> 
            <Filter onTextChange={text => this.setState({filterString: text})} /> 

            { /* maps out playlist */ }
            {playlistsToRender.map((playlist) => 
            <PlayList key={playlist.id} playlist={playlist} />)}
          </div> : <button onClick={()=> {
            window.location = window.location.href.includes('localhost') 
            ? 'http://localhost:8888/login' 
            : 'https://spotify-playlist-backend.herokuapp.com/login'}
            }>Sign in with Spotify</button>
      }
      </div>
    );
  }

  
}

export default App;
