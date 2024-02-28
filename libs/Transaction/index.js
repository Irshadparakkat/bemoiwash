
const {
    errHandler
} = require('../core/helpers');
const { getListTransactionUsecase, createTransaction } = require('./usecase/transactionUsecase');


const createTransactionController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createTransaction({
                ...source,
                ...body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const getListTransactionController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListTransactionUsecase({
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
    createTransactionController,
    getListTransactionController,
    updateSubscriptionController,
    deleteSubscriptionController,
}