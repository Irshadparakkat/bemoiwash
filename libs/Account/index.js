
const {
    errHandler
} = require('../core/helpers');
const { createAccountUsecase, getListAccountUseCase, updateAccountUsecase, deleteAccountUsecase } = require("./usecase/accountUsecase");


const createAccountController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createAccountUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




const getListAccountController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListAccountUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




const updateAccountController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateAccountUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




const deleteAccountController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteAccountUsecase
            ({
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
    createAccountController,
    getListAccountController,
    updateAccountController,
    deleteAccountController
}