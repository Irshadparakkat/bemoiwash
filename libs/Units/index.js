const { 
    createUnitUsecase,
    updateUnitUsecase,
    createUnitLocationUsecase,
    getListUnitUseCase,
    getUnitByIdUsecase,
    getScheduleListUseCase,
    getScheduleByIdUseCase,
    deleteUnitLocationUsecase,
    createScheduleUseCase,
    deleteScheduleUseCase,
    updateScheduleUseCase,
    deleteUnitUseCase,
    getListUnitLocationUseCase
} = require("./usecase/unitUseCase")


const {
    errHandler
} = require('../core/helpers')


const createUnitController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createUnitUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const updateUnitController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateUnitUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const createScheduleController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createScheduleUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const createUnitLocationController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createUnitLocationUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const getListUnitController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListUnitUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const getListUnitByIdController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getUnitByIdUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const getScheduleListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getScheduleListUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const getScheduleByIdController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getScheduleByIdUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}

const getListUnitLocationController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListUnitLocationUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const deleteUnitLocationController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteUnitLocationUsecase
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


const deleteScheduleController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteScheduleUseCase
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


const updateScheduleController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateScheduleUseCase
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



const deleteUnitController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteUnitUseCase
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
    createUnitController,
    updateUnitController,
    getListUnitController,
    updateScheduleController,
    createUnitLocationController,
    getScheduleListController,
    getScheduleByIdController,
    getListUnitLocationController,
    deleteUnitLocationController,
    createScheduleController,
    deleteScheduleController,
    deleteUnitController,
    getListUnitByIdController
}