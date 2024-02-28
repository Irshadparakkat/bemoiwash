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
} = require('../../notification/usecase/firbaseUsecase');
const { createNotification } = require('../../notification/usecase/notificationServices');



const createTransaction = async function ({
    strTransactionType,
    fkDebitAccId,
    fkCreditAccId,
    strRemarks,
    intDebitAmt,
    intCreditAmt,
    strDebitAcc,
    strCreditAcc,
    strTransactionId,
    timReceived,
    strUserId,
    strType
}) {
    try {



        let objResult = await insertOneDB({
            objDocument: {
                strDebitAcc: strDebitAcc,
                strCreditAcc: strCreditAcc,
                intDebitAmt: intDebitAmt || 0,
                intCreditAmt: intCreditAmt || 0,
                strTransactionId: strTransactionId,
                strRemarks: strRemarks || '',
                strTransactionType: strTransactionType,
                strCreatedBy: new ObjectId(strUserId),
                strCreatedTime: new Date(timReceived),
            },
            strCollection: "cln_transaction"
        });
        if (!objResult?.insertedId) {
            throw new errHandler("Transaction Creation failed").set();
        }

        return {
            strMessage: "Successfully created an Transaction"
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};

const getListTransactionUsecase = async function ({ source, body }) {
    let arrAndConditions = [{ chrStatus: 'N' }];
   
    let {
        arrFiltersReq,
        filters,
        sorter,
        pageSize,
        page,
        strStatus,
        isNoFilterList
    } = body;


    let objFilterList = isNoFilterList ? {} : {
        "1": [
            {
                "text": "Booking Credit Entry",
                "value": "Booking Credit Entry"
            },
            {
                "text": "Booking Debit Entry",
                "value": "Booking Debit Entry"
            },
            {
                "text": "Expense Credit Entry",
                "value": "Expense Credit Entry"
            },
            {
                "text": "Expense Debit Entry",
                "value": "Expense Debit Entry"
            },
        ],

    }


    if (filters) {
        const { strTransactionType } = filters;
        if (strTransactionType && Array.isArray(strTransactionType) && strTransactionType.length > 0) {
            arrAndConditions.push({
                strTransactionType: { $in: strTransactionType },
            });
        }
    }


    try {
        let arrQuery = [
            {
                $match: {
                    $and: arrAndConditions,
                },
            },
            {
                $lookup: {
                    from: "cln_account",
                    localField: "strDebitAcc",
                    foreignField: "_id",
                    as: "debitAccount",
                },
            },
            {
                $lookup: {
                    from: "cln_account",
                    localField: "strCreditAcc",
                    foreignField: "_id",
                    as: "creditAccount",
                },
            },
            {
                $sort: {
                    'strCreatedTime': -1,
                }
            },
            {
                $project: {
                    _id: 1,
                    debitAccount: { $arrayElemAt: ['$debitAccount', 0] },
                    creditAccount: { $arrayElemAt: ['$creditAccount', 0] },
                    intDebitAmt: 1,
                    intCreditAmt: 1,
                    strTransactionId: 1,
                    strRemarks: 1,
                    strTransactionType: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1,
                },
            },
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_transaction",
        });

        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100,
            },
            objFilterList
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};




module.exports = {
    createTransaction,
    getListTransactionUsecase
}