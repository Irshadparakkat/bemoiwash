const admin = require("firebase-admin");
const serviceAccount = require("../../../moiiwash-firebase-adminsdk-qzh5a-6203f60ab1.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), 
}); 
const FCM = require('fcm-node')
//const certPath = admin.credential.cert(serviceAccount);
const fcm = new FCM(serviceAccount)

const sendFirebaseNotification = ({
    strFcmToken,
    strTittle,
    strBody,
    strCollapsKey,
    strPage,
    strId,
}) => {
    // admin.messaging().send({
    //     token: strFcmToken,
    //     notification: {
    //         title: strTittle,
    //         body: strBody
    //     }
    // })

    const message = {  
        to: strFcmToken, 
       // token: strFcmToken,
        notification: {
            title: strTittle, 
            body: strBody ,
            content_available : "true",
        }, 
        data: { 
            strPage: strPage,
            strId:strId ? strId:null,
        }
    }
    const options = {
        priority: "high"
      }
    // admin.messaging().sendToDevice(strFcmToken, message, options)
    // .then(function (response) {
    //   res.send('message succesfully sent !')
    // })
    // .catch(function (error) {
    //   res.send(error).status(500)
    // });
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!",err)
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
} 
module.exports = {
    sendFirebaseNotification
}
sendFirebaseNotification({
    strFcmToken:"c6OeCNDGRnO7lAUDC9BWbk:APA91bFHRLv73YTMP0xOjAZv5oJbUHx4rX-JQ4WBTz6tLD3sT28LTQWRajJKe1yGEcbCrNnwoc98GSU_kJV3ms9STMvXDyZAwIL6L69Kf3_p4mKUCl0XYhvIpBV2Yfn3XdyXsIWC_-pq",
    strTittle:"Test Tittle",
    strBody:"Test body",
    strCollapsKey:'booking',
    strPage:'booking_details'
})