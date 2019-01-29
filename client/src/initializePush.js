import messaging from 'config/firebase'

export function initializePush() {
    messaging
        .requestPermission()
        .then(() => {
           return messaging.getToken();
        })
        .then(token => {
            console.log("FCM Token:", token);
            //send the token to the server to be able to send notifications in the future
           sendTokenToServer(token);
        })
        .catch(error => {
            if (error.code === "messaging/permission-blocked") {
                console.log("Please Unblock Notification Request Manually");
            } else {
                console.log("Error Occurred", error);
            }
        });

    messaging.onMessage(payload => {
        toastr.info(payload.body, payload.title)
    });
}