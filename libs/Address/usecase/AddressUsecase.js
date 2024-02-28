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
const createUserAddressUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strName,
            strAddress,
            strCity,
            intZipCode,
            strCountry,
            coordinates
        } = body;

        let objResult = await insertOneDB({
            objDocument: {
                strName,
                strAddress,
                strCity,
                intZipCode,
                strCountry,
                location: { type: 'Point', coordinates: coordinates },
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_user_address"
        });

        if (!objResult?.insertedId) {
            throw new errHandler("ADDRESS CREATION FAILED").set();
        }

        const addedAddress = await getOneDB({
            strCollection: "cln_user_address",
            objQuery: { _id: objResult.insertedId },
        });

        if (!addedAddress) {
            throw new errHandler("Failed to retrieve added address details").set();
        }

        return {
            strMessage: "Successfully Added New Address",
            addedAddress,
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
}


const getUserAddressListUsecase = async function ({ source, body }) {
    try {
        const arrAndCondtions = [
            { chrStatus: 'N' },
            { strCreatedBy: new ObjectId(body.strUserId ? body.strUserId : source.strUserId) }
        ];

        const arrQuery = [
            {
                $match: {
                    $and: arrAndCondtions
                }
            },
            {
                $project: {
                    _id: 1,
                    strName: 1,
                    strAddress: 1,
                    strCity: 1,
                    intZipCode: 1,
                    strCountry: 1,
                    location: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1
                }
            }
        ];

        const arrList = await getListDB({
            arrQuery,
            strCollection: "cln_user_address"
        });

        for (const address of arrList) {
            address.isPremium = address.location ? await checkUserPremium(address.location.coordinates) : false;
        }

        return {
            arrList
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
}


async function checkUserPremium(userLocation) {
    const availableLocations = await getListDB({
        strCollection: 'cln_locations',
        objQuery: {
            chrStatus: 'N',
        }
    });

    for (const location of availableLocations) {
        const locationCoordinates = location.strLocation.coordinates;
        const locationRadius = location.strRadius;
        const distance = calculateDistance(userLocation, locationCoordinates);
        if (distance <= locationRadius) {
            return false;
        }
    }

    return true;
}


const EARTH_RADIUS = 6371000; // Earth's radius in meters

function calculateDistance(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = EARTH_RADIUS * c; // Distance in meters

    return distance;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}



const updateAddressUseCase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};
       
        let {
            strName,
            strAddress,
            strCity,
            intZipCode,
            strCountry,
            coordinates,
            strAddressId
        } = body;
        const objBooking = await getOneDB({
            strCollection: 'cln_user_address',
            objQuery: {
                _id: new ObjectId(strAddressId),
            }
        });
        if (!objBooking)
            throw new errHandler("ADDRESS NOT FOUND").set()
        if (strName) objDocument.strName = strName;
        if (strAddress) objDocument.strAddress = strAddress;
        if (strCity) objDocument.strCity = strCity
        if (intZipCode) objDocument.intZipCode = intZipCode
        if (strCountry) objDocument.strCountry = strCountry;
        if (coordinates) objDocument.location = { type: 'Point', coordinates: coordinates };

        let objResult = await updateOneKeyDB({
            _id: new ObjectId(strAddressId),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_user_address"
        });
        if (!objResult) {
            throw new errHandler("Updation failed").set()
        }
        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}





module.exports = {
    createUserAddressUsecase,
    getUserAddressListUsecase,
    updateAddressUseCase
}