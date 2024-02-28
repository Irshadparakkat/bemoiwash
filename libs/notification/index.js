const {
    
    getListChatMessagesUsecase,
    deleteMessageUseCase,
    clearMessageUseCase,
    getNotificationListUsecase
} = require("./usecase/notificationGetting")


const {
    errHandler
} = require('../core/helpers');
const { sendFireBaseNotificationUseCase } = require("./usecase/notificationServices");

const  sendNotificationFirebaseController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await sendFireBaseNotificationUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error", error);
        throw new errHandler(error).set()
    }
}

const getNotificationMessagesController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await getNotificationListUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error", error);
        throw new errHandler(error).set()
    }
}



const deleteMessageController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteMessageUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const clearMessageController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await clearMessageUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




const  getNotifyUrl = async function ({
    body,
    ...source
}) {
    try {
        return {
            body:{Success:true}
        };
    } catch (error) {
        console.log("error", error);
        throw new errHandler(error).set()
    }
}


module.exports = {
    getNotificationMessagesController,
    sendNotificationFirebaseController,
    getNotifyUrl
}