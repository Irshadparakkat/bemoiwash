const { 
    createVehicleUsecase,
    deleteVehicleModelUsecase,
    deleteVehicleUsecase,
    getListVehicleUsecase,
    getVehicleModelListUseCase,
    createVehicleModelUsecase
} = require("./usecase/vehicleUsecase")


const {
    errHandler
} = require('../core/helpers')


const createVehicleController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createVehicleUsecase({
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




const updateGroupController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateGroupUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const getListGroupController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListGroupUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const getListVehicleListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListVehicleUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const getVehicleModelListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getVehicleModelListUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const deleteVehicleModelController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteVehicleModelUsecase
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



const deleteVehicleController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteVehicleUsecase
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
    createVehicleController,
    createVehicleModelController,
    getListGroupController,
    getListVehicleListController,
    getVehicleModelListController,
    deleteVehicleModelController,
    deleteVehicleController
}