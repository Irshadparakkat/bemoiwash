const {
    errHandler,
} = require('../../core/helpers')
const {
    insertManyDB,
    insertOneDB,
    getListDB,
    imageUpload,
    updateOneKeyDB,
    getOneDB,
    getOneTransDB
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');
const { sendFirebaseNotification } = require('../../notification/usecase/firbaseUsecase');

const createMessage = async function ({
    _id,
    strChatId,
    strType,
    strUserType,
    strUserId,
    timReceived,
    strCreatedTime,
    ...objData
}) {
    try {

        let objMessage = {
            strUserId:strUserType == 'ADMIN'? 'Admin' : new ObjectId(strUserId),
            strChatId:strUserType == 'ADMIN'? new ObjectId(strChatId) :strChatId,
            strCreatedTime: new Date(timReceived),
            chrStatus: 'N',
            chrUserIdStatus :'N',
            chrChatIdStatus:'N',
            strType,
            ...objData
        };

        // If _id is provided, it means you're updating an existing message
        if (_id) {
            objMessage = {
                _id: new ObjectId(_id),
                ...objMessage
            };
        }

        let objResult = await insertOneDB({
            strCollection: "cln_messages",
            objDocument: objMessage,
        });

        let objHistory = {};

        // Retrieve additional chat/group information for history
        // objHistory = await getOneDB({
        //     strCollection:"cln_user",
        //     objQuery: {
        //         chrStatus: 'N',
        //         _id: new ObjectId(strChatId),
        //     },
        //     objProject: {  
        //         strGroupName: 1,
        //         strIconURL: 1,
        //         strFullName: 1,
        //         strProfileUrl: 1
        //     }
        // });

       
        if(strUserType == 'ADMIN'){
            let UserDetails = await getOneDB({
                strCollection: 'cln_user',
                objQuery: {
                    chrStatus: 'N',
                    _id: new ObjectId(strChatId)
                }
            });

            if (UserDetails?.strFcmToken !='') {
                sendFirebaseNotification({
                    strFcmToken: UserDetails?.strFcmToken,
                    strTittle: "New Message",
                    strBody: `${objMessage?.strMessage}`,
                    strCollapsKey: 'message',
                    strPage: 'message',
                    strId: 'help',
                })

            }
        }else{

            let UserDetails = await getOneDB({
                strCollection: 'cln_user',
                objQuery: {
                    chrStatus: 'N',
                    strType: 'ADMIN'
                }
            });

            if (UserDetails?.strFcmToken !='') {
                sendFirebaseNotification({
                    strFcmToken: UserDetails?.strFcmToken,
                    strTittle: "New Message",
                    strBody: `${objMessage?.strMessage}`,
                    strCollapsKey: 'message',
                    strPage: 'message',
                    strId: 'help',
                })
            }

        }


        return {
            // objHistory: {
            //     ...objHistory,   
            //     ...objMessage,
            //     strCreatedTime,
            //     strName: objHistory?.strGroupName || objHistory?.strFullName,
            //     strIconURL: objHistory?.strIconURL || objHistory?.strProfileUrl
            // },
            objMessage: {
                ...objMessage,
                strCreatedTime,
                _id: objResult?.insertedId
            }
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};

module.exports = {
    createMessage
}