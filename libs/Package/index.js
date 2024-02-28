const { 
    createPackageUsecase,
    createServicesUsecase,

    createPackageLocationUsecase,
    getListPackageUseCase,
    updateGroupUsecase,
    updateGroupAdminStatusUsecase,
    exitGroupStatusUsecase,
    getListGroupDetailsUsecase,
    createVehicleModelUsecase,
    getListServiceUseCase,
    deletePackagesUsecase,
    deleteServicesUsecase,
    updatePackageUsecase,
    updateServiceUsecase,
    getListAllPackageUseCase
} = require("./usecase/packageUseCase")


const {
    errHandler
} = require('../core/helpers')


const createPackageController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createPackageUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const createServicesController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createServicesUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const createPackageLocationController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createPackageLocationUsecase({
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

const getListPackagesController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListPackageUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const getListAllPackagesController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListAllPackageUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




const getListServiceController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListServiceUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const deletePackagesController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deletePackagesUsecase
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



const deleteServicesController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteServicesUsecase
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


const updatePackageController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updatePackageUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const updateServiceController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateServiceUsecase({
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
    getListAllPackagesController,
    getListPackagesController,
    updateServiceController,
    createServicesController,
    createPackageLocationController,
    getListServiceController,
    deletePackagesController,
    deleteServicesController,
    updatePackageController
}