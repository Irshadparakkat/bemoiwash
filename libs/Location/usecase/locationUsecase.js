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

const createLocationUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strCity,
            intLatitude,
            intLongitude,
            intZipCode,
            strRadius,
        } = body;

        let objResult = await insertOneDB({
            objDocument: {
                strCity,
                intZipCode,
                strLocation: {
                    type: "Point",
                    coordinates: [intLongitude, intLatitude]
                },
                strRadius,
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_locations"
        });
        if (!objResult?.insertedId) {
            throw new errHandler("LOCATION CREATION FAILED").set()
        }

        return {
            strMessage: "Success fully Added New Location"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}




const getListLocationUseCase = async function ({
    source,
    body
}) {
    let arrAndCondtions = [{
        chrStatus: 'N'
    }]

    let {
        page
    } = body


    try {
        let arrQuery = [
            {
                $match: {
                    $and: arrAndCondtions
                },

            },
            {
                $project: {
                    _id: 1,
                    strCity: 1,
                    intZipCode: 1,
                    strLocation: 1,
                    strRadius: 1
                }
            }
        ];
        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_locations"
        })
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



const updateLocationUseCase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};

        let {
            strCity,
            intLatitude,
            intLongitude,
            intZipCode,
            strRadius,
        } = body;

        let objDocument1 = {}

        if (strCity) objDocument.strCity = strCity;
        if (intLatitude && intLongitude) objDocument.strLocation = {
            type: "Point",
            coordinates: [intLongitude, intLatitude]
        }
        if (strRadius) objDocument.strRadius = strRadius;

        await updateOneKeyDB({
            _id: new ObjectId(body.id),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_locations"
        });

       
        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}

const deleteLocationUseCase = async function ({
    source,
    body
}) {
    try {

        const { id } = body

        let objDocument = {};
        objDocument.chrStatus = 'D';

        await updateOneKeyDB({
            _id: new ObjectId(id),
            objDocument: {
                strDeletedBy: new ObjectId(source.strUserId),
                strDeletedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_locations"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}






module.exports = {
    createLocationUsecase,
    getListLocationUseCase,
    deleteLocationUseCase,
    updateLocationUseCase
}