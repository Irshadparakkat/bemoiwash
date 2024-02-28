const { 
    createPurchaseUsecase,
    checkPaymentPurchaseUsecase,
    getListPurchasedPlansUseCase,
    getPurchasedBookingListUsecase
} = require("./usecase/purchaseUsecase")


const {
    errHandler
} = require('../core/helpers')


const createPurchaseController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createPurchaseUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const checkPaymentPurchaseController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await checkPaymentPurchaseUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const getListPurchasedController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListPurchasedPlansUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const getUserPurchasedBookingListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getPurchasedBookingListUsecase({
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
    createPurchaseController,
    getListPurchasedController,
    getUserPurchasedBookingListController,
    checkPaymentPurchaseController
}