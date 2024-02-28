const { 
    createPackageUseCase,
    getListContactsUsecase,
    getContactsToAddUseCase
} = require("./usecase/contactUsecase")


const {
    errHandler
} = require('../core/helpers')


const createPackageController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createPackageUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const getListContactController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListContactsUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




const getContactsToAddGroupController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getContactsToAddUseCase({
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
    createPackageController,
    getListContactController,
    getContactsToAddGroupController
}