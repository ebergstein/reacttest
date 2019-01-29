import firebase from 'firebase';
import axios from "axios";

export const initializeFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: "299005012032"
  });
}

navigator.serviceWorker
    .register('/my-sw.js')
    .then((registration) => {
      firebase.messaging().useServiceWorker(registration);
});

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log('using token:', token);
    var postData = {
    	notification: {
			title: "Firebase",
			body: "Firebase Notification",
			click_action: "http://localhost:3000/",
			icon: "http://clipart-library.com/images/ATbjLLGpc.jpg"
		},
		to: token
    }
    let axiosConfig = {
    	headers: {
			'Content-Type': "application/json",
    		Authorization: "key=AAAARZ4WaEA:APA91bGkZYnoso_miTTh5O_hIQSEYIbrA0p1eZwite4hRgmYIbDLZTBxwI-m5RafkBPCQEikoc8CDerFIlD0VoilZgoNJHLcPrYZqZ1yxb0MW9W4FkPUMlBSfO5D8BHrO1gFlpuup4kZ",
    		"Access-Control-Allow-Origin": "*"
    	}
    }
    axios.post('https://fcm.googleapis.com/fcm/send', postData, axiosConfig)
    return token;
  } catch (error) {
    console.error(error);
  }
}