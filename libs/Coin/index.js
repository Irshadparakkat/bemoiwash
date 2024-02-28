const { 
    getCoinlistUseCase,
    updateCoinUseCase,
    getCoinValueUseCase,
} = require("./usecase/CoinListUsecase")


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


const getCoinListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getCoinlistUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}




const updateCoinController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await updateCoinUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



const getCoinValueListController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getCoinValueUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



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
    getCoinListController,
    updateCoinController,
    getCoinValueListController
}