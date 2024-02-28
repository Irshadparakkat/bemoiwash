const {
    errHandler,
} = require('../../core/helpers')
const {
    insertManyDB,
    insertOneDB,
    getListDB,
    imageUpload,
    updateOneKeyDB,
    deleteHardOneDB,
    getOneDB
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');
const {
    sendFirebaseNotification
} = require('../../notification/usecase/firbaseUsecase')


const getCoinlistUseCase = async function ({
    source,
    body
}) {
    let {
        page
    } = body;

    let arrAndCondtions = [{
        chrStatus: 'N'
    }, { strCreatedBy: new ObjectId(body.strUserId ? body.strUserId:source.strUserId) }];



    try {

        let arrQuery = [
            {
                $match: {
                    $and: arrAndCondtions
                }
            },
            {
                $project: {
                    _id: 1,
                    userGettingCoin:1
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_user_coin"
        });
      return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};



const getCoinValueUseCase = async function ({
    source,
    body
}) {
    let {
        page
    } = body;




    try {

        let arrQuery = [
            {
                $project: {
                    _id: 1,
                    strName:1,
                    intOneCoinValue:1,
                    intToGetOneCoin:1
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_coin_value"
        });
      return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};



const updateCoinUseCase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};

        let {
            strName,
            intOneCoinValue,
            intToGetOneCoin,
        } = body;

      
        if (strName) objDocument.strName = strName;

        if (intOneCoinValue) objDocument.intOneCoinValue = intOneCoinValue;

        if (intToGetOneCoin) objDocument.intToGetOneCoin = intToGetOneCoin;
       
        await updateOneKeyDB({
            _id: new ObjectId(body._id),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_coin_value"
        });


        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}






module.exports = {
    getCoinlistUseCase,
    updateCoinUseCase,
    getCoinValueUseCase
}