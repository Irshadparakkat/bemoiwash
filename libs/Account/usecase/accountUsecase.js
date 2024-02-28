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
    updateOneKeyTransDB,
    getOneTransDB
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');
const {
    sendFirebaseNotification
} = require('../../notification/usecase/firbaseUsecase')
const createAccountUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strAccountName,
            strAccountType,
            strRemarks
        } = body;


        let objResult = await insertOneDB({
            objDocument: {
                strAccountName,
                strAccountType,
                strRemarks: strRemarks || '',
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_account"
        });


        if (!objResult?.insertedId) {
            throw new errHandler("ACCOUNT CREATION FAILED").set()
        }

        return {
            strMessage: "Success fully Entered Account"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}

const updateAccountUsecase = async function ({
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
            strAccountName,
            strAccountType,
            strRemarks
        } = body;
        const objBooking = await getOneTransDB({
            objConnection,
            strCollection: 'cln_account',
            objQuery: {
                _id: new ObjectId(_id),
            }
        });
        if (!objBooking)
            throw new errHandler("ACCOUNT NOT FOUND").set()
        if (strAccountType) objDocument.strAccountType = strAccountType;
        if (strAccountName) objDocument.strAccountName = strAccountName;
        if (strRemarks) objDocument.strRemarks = strRemarks;

        let objResult = await updateOneKeyTransDB({
            _id: new ObjectId(_id),
            session,
            objConnection,
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_account"
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



const getListAccountUseCase = async function ({
    source,
    body
}) {
    let arrAndConditions = [{
        chrStatus: 'N'
    }];

    let {
        page,
        isNoFilterList,
        filters
    } = body;


    let objFilterList = isNoFilterList ? {} : {
        "1": [
            {
                "text": "USER",
                "value": "USER"
            },
            {
                "text": "Employee",
                "value": "Employee"
            },
            {
                "text": "Company Revenue",
                "value": "Company Revenue"
            },
            {
                "text": "Fuel",
                "value": "Fuel"
            },
            {
                "text": "Salik",
                "value": "Salik"
            },
            {
                "text": "Parking",
                "value": "Parking"
            },
            {
                "text": "Water",
                "value": "Water"
            },
            {
                "text": "Material Purchasing",
                "value": "Material Purchasing"
            },
            {
                "text": "Fines",
                "value": "Fines"
            },
            {
                "text": "Accommodation",
                "value": "Accommodation"
            },
            {
                "text": "Sim Charge",
                "value": "Sim Charge"
            },
            {
                "text": "Salary",
                "value": "Salary"
            },
            {
                "text": "Vehicle Services",
                "value": "Vehicle Services"
            },
            {
                "text": "Trade License Renewal",
                "value": "Trade License Renewal"
            },
            {
                "text": "Labour Visa",
                "value": "Labour Visa"
            },
            {
                "text": "Labour Insurance",
                "value": "Labour Insurance"
            },
            {
                "text": "Other",
                "value": "Other"
            }
        ],

    }


    if (filters) {
        const { strAccountType } = filters;
        if (strAccountType && Array.isArray(strAccountType) && strAccountType.length > 0) {
            arrAndConditions.push({
                strAccountType: { $in: strAccountType },
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
                    from: "cln_user",
                    localField: "strUserId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $addFields: {
                    strAccountName: {
                        $ifNull: [
                            { $arrayElemAt: ['$userData.strName', 0] },
                            '$strAccountName'
                        ]
                    },
                    strContactNumber: {
                        $ifNull: [
                            { $arrayElemAt: ['$userData.strMobileNo', 0] },
                            '$strContactNumber'
                        ]
                    },
                }
            },
            {
                $project: {
                    _id: 1,
                    strAccountType: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1,
                    strRemarks: 1,
                    strAccountName: 1,
                    strContactNumber: 1,
                    accountDetails: 1,
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_account"
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






const deleteAccountUsecase = async function ({
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
            strCollection: "cln_account"
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
    createAccountUsecase,
    getListAccountUseCase,
    updateAccountUsecase,
    deleteAccountUsecase
}