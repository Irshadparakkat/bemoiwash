const { 
    createCheckListUsecase,
    getListCheckListUseCase,
    updateBookingUsecase,
    rescheduleBookingUsecase,
    getListServiceForUnitUseCase
} = require("./usecase/CheckListUsecase")


const {
    errHandler
} = require('../core/helpers')


const createCheckingListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await createCheckListUsecase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}


// const rescheduleBookingController = async function({
//     body,
//     ...source
// }) {
//     try {
//         return {
//             body: await rescheduleBookingUsecase({
//                 source,
//                 body
//             })
//         };
//     } catch (error) {
//         console.log("error",error);
//         throw new errHandler(error).set()
//     }
// }


const getCheckListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getListCheckListUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




// const updateBookingController = async function({
//     body,
//     ...source
// }) {
//     try {
//         return {
//             body: await updateBookingUsecase({
//                 source,
//                 body
//             })
//         };
//     } catch (error) {
//         console.log("error",error);
//         throw new errHandler(error).set()
//     }
// }



// const getListServiceUnitController = async function({
//     body,
//     ...source
// }) {
//     try {
//         return {
//             body: await getListServiceForUnitUseCase({
//                 source,
//                 body
//             })
//         };
//     } catch (error) {
//         console.log("error",error);
//         throw new errHandler(error).set()
//     }
// }




module.exports = { 
    createCheckingListController,
    getCheckListController
}