const { 
    createLocationUsecase,
    getListGroupUsecase,
    getListLocationUseCase,
    updateGroupUsecase,
    updateGroupAdminStatusUsecase,
    exitGroupStatusUsecase,
    getListGroupDetailsUsecase,
    createVehicleModelUsecase,
    deleteLocationUseCase,
    updateLocationUseCase
} = require("./usecase/locationUsecase")


const {
    errHandler
} = require('../core/helpers')


const createLocationController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createLocationUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




const updateLocationController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateLocationUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const createVehicleModelController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createVehicleModelUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}





const getListLocationsController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListLocationUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const deleteLocationController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteLocationUseCase
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
    createLocationController,
    getListLocationsController,
    deleteLocationController,
    updateLocationController
}