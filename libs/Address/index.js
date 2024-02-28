const { 
    createUserAddressUsecase,
    getUserAddressListUsecase,
    updateAddressUseCase
} = require("./usecase/AddressUsecase")


const {
    errHandler
} = require('../core/helpers')


const createUserAddressController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createUserAddressUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const updateUserAddressController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateAddressUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const getListUserAddressListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getUserAddressListUsecase({
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
    createUserAddressController,
    getListUserAddressListController,
    updateUserAddressController
}