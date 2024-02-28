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

const createUserVehicleUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strName,
            strModelName,
            strModelType,
            strVehicleEmirate,
            strVehicleNumber,
            strVehicleCode
        } = body;

        let objResult = await insertOneDB({
            objDocument: {
                strName,
                strModelName,
                strModelType,
                strVehicleEmirate,
                strVehicleNumber,
                strVehicleCode,
                strCreatedBy: new ObjectId(body.strUserId?body.strUserId:source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_user_vehicle"
        });

        if (!objResult?.insertedId) {
            throw new errHandler("VEHICLE CREATION FAILED").set();
        }

        const addedVehicle = await getOneDB({
            strCollection: "cln_user_vehicle",
            objQuery: { _id: objResult.insertedId },
        });

        if (!addedVehicle) {
            throw new errHandler("Failed to retrieve added vehicle details").set();
        }

        return {
            strMessage: "Successfully Added New Vehicle",
            addedVehicle,
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
}




const getUserListVehicleUsecase = async function ({
    source,
    body
}) {

    let arrAndCondtions = [{
        chrStatus: 'N'
    }, { strCreatedBy: new ObjectId(body.strUserId? body.strUserId :source.strUserId) }];

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
                    strName: 1,
                    strModelName: 1,
                    strModelType: 1,
                    strVehicleEmirate: 1,
                    strVehicleNumber: 1,
                    strCreatedBy:1,
                    strVehicleCode:1,
                    strCreatedTime:1
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_user_vehicle"
        });

        return {
            arrList
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const deleteUservehicleUsecase = async function ({
    source,
    body
}) {
    try {
        const { strVehicleId } = body

        let objDocument = {};
        objDocument.chrStatus = 'D';

        await updateOneKeyDB({
            _id: new ObjectId(strVehicleId),
            objDocument: {
                strDeletedBy: new ObjectId(source.strUserId),
                strDeletedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_user_vehicle"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


module.exports = {
    createUserVehicleUsecase,
    getUserListVehicleUsecase,
    deleteUservehicleUsecase
   
}