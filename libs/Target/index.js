const { 
    createUserVehicleUsecase,
    deleteUservehicleUsecase,
    updateMonthlyTargetUseCase,
    getMonthlyTargetUsecase,
    getPercentageValueOfMonthlyAmountWise,
    getDashbordSurvicesDataUsecase,
} = require("./usecase/monthlyTargetUseCase")


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

const getListMonthlyTargetListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getMonthlyTargetUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const updateMOnthlyTargetController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateMonthlyTargetUseCase
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


const getPercentageOfMonthlyTarget = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getPercentageValueOfMonthlyAmountWise({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const getAllServicesDatasForDashbordController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getDashbordSurvicesDataUsecase({
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
    getListMonthlyTargetListController,
    updateMOnthlyTargetController,
    getPercentageOfMonthlyTarget,
    getAllServicesDatasForDashbordController
}