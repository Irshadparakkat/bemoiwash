const {
    createBookingUsecase,
    getListBookingUseCase,
    updateBookingUsecase,
    rescheduleBookingUsecase,
    checkPaymentUsecase,
    getListServiceForUnitUseCase,
    getUserBookingListUseCase
} = require("./usecase/bookingUsecase")


const {
    errHandler
} = require('../core/helpers')


const createBookingController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await createBookingUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error", error);
        throw new errHandler(error).set()
    }
}


const checkPaymentController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await checkPaymentUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error", error);
        throw new errHandler(error).set()
    }
}



const rescheduleBookingController = async function ({
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
        console.log("error", error);
        throw new errHandler(error).set()
    }
}


const getListBookingController = async function ({
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
        console.log("error", error);
        throw new errHandler(error).set()
    }
}


const getUserBookingListController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await getUserBookingListUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error", error);
        throw new errHandler(error).set()
    }
}




const updateBookingController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await updateBookingUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error", error);
        throw new errHandler(error).set()
    }
}



const getListServiceUnitController = async function ({ body, ...source }) {
    try {
        if (source.strType === 'ADMIN') {
            return {
                body: await getListBookingUseCase({ source, body })
            };
        } else {
            return {
                body: await getListServiceForUnitUseCase({ source, body })
            };
        }
    } catch (error) {
        console.log("error", error);
        throw new errHandler(error).set();
    }
}




module.exports = {
    createBookingController,
    getListBookingController,
    updateBookingController,
    checkPaymentController,
    rescheduleBookingController,
    getListServiceUnitController,
    getUserBookingListController
}