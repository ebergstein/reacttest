// /client/App.js
import React, { Component } from "react";
import axios from "axios";
import { askForPermissioToReceiveNotifications } from './push-notification';

class App extends Component {
  // initialize our state 
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };


  // our delete method that uses our backend api 
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };
  
  	/*urlBase64ToUint8Array(base64String){
	  const padding = "=".repeat((4 - base64String.length % 4) % 4)
	  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

	  const rawData = window.atob(base64)
	  const outputArray = new Uint8Array(rawData.length)

	  for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	  }
	  return outputArray
	}*/
  

	subscribePush(key){
  navigator.serviceWorker.ready.then(registration => {
    if (!registration.pushManager) {
      alert("Push Unsupported")
      return
    }
    
    registration.pushManager
      .subscribe({
        userVisibleOnly: true, //Always display notifications
        applicationServerKey: key
      })
      .then(subscription => axios.post("http://localhost:3001/api/subscribe", subscription))
      .catch(err => console.error("Push subscription error: ", err))
})
}
	
	
  


  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data } = this.state;
   /* const vapidPublicKey =
	"BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo"
	const converted = urlBase64ToUint8Array(vapidPublicKey)*/
    return (
      <div>
      	<button onClick={askForPermissioToReceiveNotifications} >
      		Click Here
   		</button>
      </div>
    );
  }
}

export default App;