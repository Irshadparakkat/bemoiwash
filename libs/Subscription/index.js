
const {
    errHandler
} = require('../core/helpers');
const { createSubscriptionUsecase, getListSubscriptionUseCase, updateSubscriptionUsecase, deleteSubscriptionUsecase } = require('./usecase/subscriptionUsecase');


const createSubscriptionController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createSubscriptionUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const getListSubscriptionController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListSubscriptionUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}






const updateSubscriptionController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateSubscriptionUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const deleteSubscriptionController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteSubscriptionUsecase
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
    createSubscriptionController,
    getListSubscriptionController,
    updateSubscriptionController,
    deleteSubscriptionController,
}