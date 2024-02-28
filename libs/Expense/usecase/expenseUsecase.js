const {
    errHandler, getMongoTransConnection
} = require('../../core/helpers')
const {
    insertManyDB,
    insertOneDB,
    getListDB,
    imageUpload,
    updateOneKeyDB,
    deleteHardOneDB,
    getOneDB,
    updateOneKeyTransDB
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');
const {
    sendFirebaseNotification
} = require('../../notification/usecase/firbaseUsecase');
const { createTransaction } = require('../../Transaction/usecase/transactionUsecase');

const createExpenseUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strToAccountId,
            strExpenseType,
            strPaymentMode,
            strUnitId,
            strLabourId,
            strBillDate,
            strBillNo,
            strImageUrl,
            strRemarks,
            intTotalAmt,
            strFromAccountId,
            intDiscountAmt,
            intTotalTax,
            intTax,
            intSubAmt,
            intPayAmt,
            intBalanceAmt
        } = body;


        let objResult = await insertOneDB({
            objDocument: {
                strFromAccountId: new ObjectId(strFromAccountId),
                strToAccountId: new ObjectId(strToAccountId),
                strExpenseType,
                strUnitId: new ObjectId(strUnitId) || null,
                strLabourId: new ObjectId(strLabourId) || null,
                strBillDate: strBillDate || null,
                strBillNo: strBillNo || null,
                strImageUrl: strImageUrl || '',
                strPaymentMode: strPaymentMode || '',
                strRemarks: strRemarks || '',
                intTotalAmt: intTotalAmt || 0,
                intDiscountAmt: intDiscountAmt || 0,
                intTotalTax: intTotalTax || 0,
                intTax: intTax || 0,
                intSubAmt: intSubAmt || 0,
                intPayAmt: intPayAmt || 0,
                intBalanceAmt: intBalanceAmt || 0,
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_expenses"
        });


        if (!objResult?.insertedId) {
            throw new errHandler("EXPENSE CREATION FAILED").set()
        }


        await createTransaction({
            ...source,
            strTransactionType: 'Expense Credit Entry',
            strTransactionId: objResult?.insertedId,
            strDebitAcc: new ObjectId(strFromAccountId),
            strCreditAcc:new ObjectId(strToAccountId) ,
            intDebitAmt: 0,
            intCreditAmt: intPayAmt
        })

        await createTransaction({
            ...source,
            strTransactionType: 'Expense Debit Entry',
            strTransactionId: objResult?.insertedId,
            strDebitAcc: new ObjectId(strToAccountId),
            strCreditAcc:new ObjectId(strFromAccountId) ,
            intDebitAmt: intPayAmt,
            intCreditAmt: 0
        })

        return {
            strMessage: "Success fully Entered Expenses"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}

const updateExpenseUsecase = async function ({
    source,
    body
}) {

    const {
        session,
        objConnection
    } = await getMongoTransConnection();


    try {
        let objDocument = {};

        let {
            _id,
            strToAccountId,
            strExpenseType,
            strPaymentMode,
            strRemarks,
            intTotalAmt,
            intDiscountAmt,
            intTotalTax,
            intTax,
            intSubAmt,
            intPayAmt,
            intBalanceAmt,
            strUnitId,
            strLabourId,
            strBillDate,
            strBillNo,
            strImageUrl
        } = body;
        const objBooking = await getOneTransDB({
            objConnection,
            strCollection: 'cln_expenses',
            objQuery: {
                _id: new ObjectId(_id),
            }
        });
        if (!objBooking)
            throw new errHandler("BOOKING NOT FOUND").set()
        if (strToAccountId) objDocument.strToAccountId = new ObjectId(strToAccountId);
        if (strExpenseType) objDocument.strExpenseType = strExpenseType;
        if (strPaymentMode) objDocument.strPaymentMode = strPaymentMode;
        if (strRemarks) objDocument.strRemarks = strRemarks;
        if (intTotalAmt) objDocument.intTotalAmt = intTotalAmt;
        if (intDiscountAmt) objDocument.intDiscountAmt = intDiscountAmt;
        if (intTotalTax) objDocument.intTotalTax = intTotalTax;
        if (intTax) objDocument.intTax = intTax;
        if (intSubAmt) objDocument.intSubAmt = intSubAmt;
        if (intPayAmt) objDocument.intPayAmt = intPayAmt;
        if (intBalanceAmt) objDocument.intBalanceAmt = intBalanceAmt;
        if (strImageUrl) objDocument.strImageUrl = strImageUrl;
        if (strBillNo) objDocument.strBillNo = strBillNo;
        if (strBillDate) objDocument.strBillDate = strBillDate;
        if (strLabourId) objDocument.strLabourId = new ObjectId(strLabourId);
        if (strUnitId) objDocument.strUnitId = new ObjectId(strUnitId);



        let objResult = await updateOneKeyTransDB({
            _id: new ObjectId(_id),
            session,
            objConnection,
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_expenses"
        });
        if (!objResult) {
            throw new errHandler("Updation failed").set()
        }


        await session.commitTransaction();

        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        await session.abortTransaction();
        throw new errHandler(error).set()
    } finally {
        session.endSession();
    }
}



const getListExpenseUseCase = async function ({ source, body }) {
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
        "4": [
            {
                "text": "fuel",
                "value": "fuel"
            },
            {
                "text": "salik",
                "value": "salik"
            },
            {
                "text": "parking",
                "value": "parking"
            },
            {
                "text": "water",
                "value": "water"
            },
            {
                "text": "material purchasing",
                "value": "material purchasing"
            },
            {
                "text": "fines",
                "value": "fines"
            },
            {
                "text": "accommodation",
                "value": "accommodation"
            },
            {
                "text": "sim charge",
                "value": "sim charge"
            },
            {
                "text": "salary",
                "value": "salary"
            },
            {
                "text": "vehicle services",
                "value": "vehicle services"
            },
            {
                "text": "Trade license renewal",
                "value": "Trade license renewal"
            },
            {
                "text": "labour insurance",
                "value": "labour insurance"
            },
            {
                "text": "other",
                "value": "other"
            },
        ]
    }

    if (filters) {
        const { strExpenseType } = filters;
        if (strExpenseType && Array.isArray(strExpenseType) && strExpenseType.length > 0) {
            arrAndConditions.push({
                strExpenseType: { $in: strExpenseType },
            });
        }
    }
    
    try {
        let arrQuery = [
            {
                $match: {
                    $and: arrAndConditions
                },
            },
            {
                $lookup: {
                    from: "cln_account",
                    localField: "strToAccountId",
                    foreignField: "_id",
                    as: "fromAccountDetails"
                }
            },
            
            {
                $lookup: {
                    from: "cln_account",
                    localField: "strFromAccountId",
                    foreignField: "_id",
                    as: "toAccountDetails"
                }
            },

            {
                $lookup: {
                    from: "cln_user",
                    localField: "strCreatedBy",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $project: {
                    _id: 1,
                    strUnitId: 1,
                    strLabourId: 1,
                    strBillDate: 1,
                    strBillNo: 1,
                    strImageUrl: 1,
                    strRemarks: 1,
                    intTotalAmt: 1,
                    intDiscountAmt: 1,
                    intTotalTax: 1,
                    intTax: 1,
                    intSubAmt: 1,
                    intPayAmt: 1,
                    intBalanceAmt: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1,
                    strName: '$userData.strName',
                    strMobileNo: '$userData.strMobileNo',
                    fromAccountDetails: 1,
                    toAccountDetails: 1,
                    strToAccountId: 1,
                    strExpenseType: 1,
                    strPaymentMode: 1
                }
            },
            {
                $unwind: "$fromAccountDetails"
            },
            {
                $unwind: "$toAccountDetails"
            },
            {
                $project: {
                    _id: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1,
                    strName: 1,
                    strMobileNo: 1,
                    fromAccountDetails: 1,
                    toAccountDetails:1,
                    strToAccountId: 1,
                    strExpenseType: 1,
                    strPaymentMode: 1,
                    strUnitId: 1,
                    strLabourId: 1,
                    strBillDate: 1,
                    strBillNo: 1,
                    strImageUrl: 1,
                    strRemarks: 1,
                    intTotalAmt: 1,
                    intDiscountAmt: 1,
                    intTotalTax: 1,
                    intTax: 1,
                    intSubAmt: 1,
                    intPayAmt: 1,
                    intBalanceAmt: 1
                }
            }
        ];


        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_expenses"
        });

        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            },
            objFilterList
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};




const deleteExpenseUsecase = async function ({
    source,
    body
}) {
    try {

        const { _id } = body

        let objDocument = {};
        objDocument.chrStatus = 'D';

        await updateOneKeyDB({
            _id: new ObjectId(_id),
            objDocument: {
                strDeletedBy: new ObjectId(source.strUserId),
                strDeletedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_expenses"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



function formatTime(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}




module.exports = {
    createExpenseUsecase,
    getListExpenseUseCase,
    updateExpenseUsecase,
    deleteExpenseUsecase
}