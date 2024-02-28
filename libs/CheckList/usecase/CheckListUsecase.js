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
const createCheckListUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strServiceId,
           strArrCheckList
        } = body;
       
      
        let objResult = await insertOneDB({
            objDocument: {
                strServiceId: new ObjectId(strServiceId),
                strArrCheckList,
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_service_checklist"
        });

        if (!objResult?.insertedId) {
            throw new errHandler("CHECKLIST CREATION FAILED").set()
        }

        return {
            strMessage: "Success fully Created Checklist"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const getListCheckListUseCase = async function ({
    source,
    body
}) {
    let {
        page
    } = body;

    try {
        // Input Validation
        if (!body || !body.strServiceId) {
            throw new errHandler("Invalid input. Service ID is required.").set();
        }

        // Define Query Conditions
        let arrAndConditions = [
            { chrStatus: 'N' },
            { strServiceId: new ObjectId(body.strServiceId) }
        ];

        // Define Aggregation Pipeline Stages
        let arrQuery = [
            {
                $match: {
                    $and: arrAndConditions
                },
            },
            // Add other pipeline stages based on your requirements
        ];

        // Execute MongoDB Query
        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_service_checklist"
        });

        // Handle any additional processing or formatting of the result

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








module.exports = {
    createCheckListUsecase,
    getListCheckListUseCase
}