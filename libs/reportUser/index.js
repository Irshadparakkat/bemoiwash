const { 
    createReportUserUsecase,
    removeReportUseCase,
    getReportedUserListUseCase,
} = require("./usecase/reportUserUseCase")


const {

    errHandler
} = require('../core/helpers')


const createReportUserController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createReportUserUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const removeReportController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await removeReportUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const getReportedUserController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getReportedUserListUseCase({
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
    createReportUserController,
    removeReportController, 
    getReportedUserController 
}