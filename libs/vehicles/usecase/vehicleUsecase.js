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

const createVehicleUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strName,
        } = body;

        let objResult = await insertOneDB({
            objDocument: {
                strCreatedBy: new ObjectId(source.strUserId),
                strName,
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_vehicle"
        });

        if (!objResult?.insertedId) {
            // Handle the error if the insertion failed
            throw new errHandler("VEHICLE CREATION FAILED").set()
        }

        // Get the inserted data including the _id
        const insertedData = await getOneDB({
            strCollection: "cln_vehicle",
            objQuery: { _id: objResult.insertedId },
        });

        return {
            strMessage: "Successfully Added New Vehicle",
            ...insertedData, // Include the inserted data in the response
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
}



const createVehicleModelUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strName,
            strModelType,
            strVehicleId
        } = body;

        let objResult = await insertOneDB({
            objDocument: {
                strCreatedBy: new ObjectId(source?.strUserId),
                strName,
                strModelType,
                strVehicleId: new ObjectId(strVehicleId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_vehicle_model"
        });
        if (!objResult?.insertedId) {
            //await session.abortTransaction()
            throw new errHandler("VEHICLE MODEL CREATION FAILED").set()
        }

        return {
            strMessage: "Success fully Added New Vehicle Model "
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}




const getListVehicleUsecase = async function ({
    source,
    body
}) {
    let arrAndCondtions = [{
        chrStatus: 'N'
    }];

    let {
        page
    } = body


    try {
        let arrQuery = [
            {
                $match: {
                    $and: arrAndCondtions
                }
            },
            {
                $lookup: {
                    from: 'cln_vehicle_model',
                    localField: '_id',
                    foreignField: 'strVehicleId',
                    as: 'objModel'
                },
            },
            {
                $unwind: {
                    path: '$objModel',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $group: {
                    _id: '$_id',
                    strName: { $first: '$strName' },
                    strType: { $first: '$strType' },
                    modelData: {
                        $push: {
                            strModelName: '$objModel.strName',
                            strModelType: '$objModel.strModelType'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    strName: 1,
                    strType: 1,
                    strModelData: '$modelData',
                    strModelName: '$objModel.strName',
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_vehicle"
        });


        arrList = arrList.filter(item => item.strModelData.some(model => model.strModelName));


        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const deleteVehicleModelUsecase = async function ({
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
            strCollection: "cln_vehicle_model"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const getVehicleModelListUseCase = async function ({
    source,
    body
}) {
    let arrAndCondtions = [{
        chrStatus: 'N'
    }];

    let {
        page
    } = body

    let {
        strVehicleId
    } = body.filters


    if (strVehicleId) {
        arrAndCondtions.push({ strVehicleId: new ObjectId(strVehicleId) })
    }


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
                    strModelType: 1,
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_vehicle_model"
        });

        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const deleteVehicleUsecase = async function ({
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
            strCollection: "cln_vehicle"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}






module.exports = {
    createVehicleUsecase,
    createVehicleModelUsecase,
    getListVehicleUsecase,
    deleteVehicleModelUsecase,
    getVehicleModelListUseCase,
    deleteVehicleUsecase
}