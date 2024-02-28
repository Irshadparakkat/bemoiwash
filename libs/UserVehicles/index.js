const { 
    createUserVehicleUsecase,
    getUserListVehicleUsecase,
    updateGroupUsecase,
    updateGroupAdminStatusUsecase,
    exitGroupStatusUsecase,
    getListGroupDetailsUsecase,
    deleteUservehicleUsecase,
} = require("./usecase/vehicleUsecase")


const {
    errHandler
} = require('../core/helpers')


const createUserVehicleController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createUserVehicleUsecase({
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

const getListUserVehicleListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getUserListVehicleUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const deleteUserVehicleController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteUservehicleUsecase
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
    createUserVehicleController,
    getListUserVehicleListController,
    deleteUserVehicleController
}