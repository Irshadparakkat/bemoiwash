const { 
    createOfferUsecase,
    getListOfferUseCase,
    updateOfferUsecase,
    deleteOfferUsecase,
    getPromocodeCheckUseCase
} = require("./usecase/offerUsecase")


const {
    errHandler
} = require('../core/helpers')


const createOfferController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createOfferUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const getListOfferController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListOfferUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const getListByPromoController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getPromocodeCheckUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const updateOfferController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateOfferUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const deleteOfferController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteOfferUsecase
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
    createOfferController,
    getListOfferController,
    updateOfferController,
    deleteOfferController,
    getListByPromoController
}