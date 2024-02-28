const {
    getListChatHistoryUsecase,
    getListChatMessagesUsecase,
    deleteMessageUseCase,
    clearMessageUseCase
} = require("./usecase/chatUsecase")


const {
    errHandler
} = require('../core/helpers')

const getListChatHistoryController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await getListChatHistoryUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error", error);
        throw new errHandler(error).set()
    }
}

const getListChatMessagesController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await getListChatMessagesUsecase({
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


module.exports = {
    getListChatHistoryController,
    getListChatMessagesController,
    deleteMessageController,
    clearMessageController
}