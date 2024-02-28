const {
    errHandler,
} = require('../../core/helpers')
const {
    insertManyDB,
    insertOneDB,
    getListDB,
    imageUpload,
    updateOneKeyDB,
    getOneDB
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');
const { sendFirebaseNotification } = require('./firbaseUsecase');

const createNotification = async function ({
    strUserId,
    timReceived,
    strType,
    strNotification,
    createdForUserId,
}) {
    try {
        let objMessage = {
            strCreatedTime: new Date(timReceived),
            strCreatedBy :new ObjectId(strUserId),
            strCreatedFor: new ObjectId(createdForUserId),
            chrStatus: 'N',
            strType,
            strNotification
        };


        let objResult = await insertOneDB({
            strCollection: "cln_notification",
            objDocument: objMessage,
        });


        return {
            objMessage: {
                ...objMessage,
                strCreatedTime:timReceived,
                _id: objResult?.insertedId
            }
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};


const sendFireBaseNotificationUseCase = async function ({
    source,
    body
}) {
    try {
        let {
            strUserId,
            strPage,
            strTitle,
            strBody,
            strId,
        } = body;

        let userDetails = await getOneDB({
            strCollection: 'cln_user',
            objQuery: {
                chrStatus: 'N',
                _id: new ObjectId(strUserId)
            }
        });      

        if (userDetails?.strFcmToken) {
         await sendFirebaseNotification({
                strFcmToken: userDetails?.strFcmToken,
                strTittle: strTitle,
                strBody: strBody,
                strCollapseKey: 'booking', 
                strPage: strPage,
                strId:strId
            });
            console.log( "Notification sent successfully");
        } else {
            throw new errHandler("User does not have an FCM token. Notification not sent.").set();
        }

        return {
            strMessage: "Successfully Sended Message",
        }
    } catch (error) {
        // Log the error and rethrow it for centralized error handling
        console.error('Error in sendFireBaseNotificationUseCase:', error);
        throw new errHandler(error).set();
    }
};



const getNOtifyUrlNotification = async function ({
    source,
    body
}) {
    try {
        let {
            ApiId,
            Success,
            Message,
            MessageUUID,
        } = body;


        console.log(body,"there owooo");
     return {
            strMessage: "Successfully Sended Message",
        }
    } catch (error) {
        // Log the error and rethrow it for centralized error handling
        console.error('Error in sendFireBaseNotificationUseCase:', error);
        throw new errHandler(error).set();
    }
};

module.exports = {
    createNotification,
    sendFireBaseNotificationUseCase,
    getNOtifyUrlNotification
}