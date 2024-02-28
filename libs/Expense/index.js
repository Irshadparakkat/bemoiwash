const { 
    createExpenseUsecase,
    getListBookingUseCase,
    updateExpenseUsecase,
    rescheduleBookingUsecase,
    getListServiceForUnitUseCase,
    getListExpenseUseCase,
    deleteExpenseUsecase
} = require("./usecase/expenseUsecase")


const {
    errHandler
} = require('../core/helpers')


const createExpenseController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createExpenseUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const rescheduleBookingController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await rescheduleBookingUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


const getListBookingController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListBookingUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




const updateExpenseController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateExpenseUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const getListExpenseController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListExpenseUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const deleteExpenseController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await deleteExpenseUsecase
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
    createExpenseController,
    getListBookingController,
    updateExpenseController,
    rescheduleBookingController,
    getListExpenseController,
    deleteExpenseController
}