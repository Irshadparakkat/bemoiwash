const {
    errHandler,
} = require('../../../core/helpers');
const {
    ObjectId
} = require('mongodb');
const condition = [{
    $match: {
        chrStatus: 'N'
    },
}, ]
async function getListTransDB({
    strCollection,
    objConnection,
    arrQuery = condition
}) {
    try {

        return objConnection.collection(strCollection).aggregate(arrQuery).toArray()
    } catch (error) {
        throw new errHandler(error)
    }
}

async function getOneTransDB({
    strCollection,
    objConnection,
    objQuery = {
        chrStatus: 'N'
    }
}) {
    try {

        return objConnection.collection(strCollection).findOne(objQuery)
    } catch (error) {
        throw new errHandler(error)
    }
}

async function insertManyTransDB({
    strCollection,
    session,
    objConnection,
    arrInsertDocuments
}) {
    try {

     let result=   await objConnection.collection(strCollection).insertMany(arrInsertDocuments, {
            session
        })
        return {
            "strMessage": "Success",
            result
        }
    } catch (error) {
        throw new errHandler(error)
    }
}

async function insertOneTransDB({
    objDocument,
    strCollection,
    session,
    objConnection
}) {
    try {

        return objConnection.collection(strCollection).insertOne({
            chrStatus: 'N',
            ...objDocument,
        }, {
            session
        });
    } catch (error) {
        throw new errHandler(error)
    }
}



async function updateManyKeysTransDB({
    objMatch,
    strCollection,
    session,
    objConnection,
    objDocument
    
}) {
    try {
        if (!objMatch) {
            return {};
        }
        let objResult = await objConnection.collection(strCollection).updateMany(objMatch, {
            $set: objDocument
        }, {
            session
        });
        return objResult;
    } catch (error) {
        throw new errHandler(error);
    }
}


async function updateOneKeyTransDB({
    _id,
    objMatch,
    strCollection,
    session,
    objConnection,
    objDocument
}) {
    try {
        let objResult = await objConnection.collection(strCollection).updateOne(_id ? {
            ...objMatch || {},
            _id: new ObjectId(_id),
        } : objMatch, {
            $set: objDocument
        }, {
            session
        });
        return objResult
    } catch (error) {
        throw new errHandler(error)
    }
}

async function deleteOneTransDB({
    strCollection,
    session,
    objConnection,
    _id,
    timReceived,
    strUserId,
    chrStatus
}) {
    try {
        let objResult = await objConnection.collection(strCollection).updateOne({
            _id: new ObjectId(_id)
        }, {
            $set: {
                "chrStatus": chrStatus || "D",
                strModifiedTime: timReceived,
                strModifiedUser: strUserId
            }
        }, {
            session
        });
        return objResult;
    } catch (error) {
        throw new errHandler(error)
    }
}

async function deleteTransDB({
    strCollection,
    session,
    objConnection,
    arrDeleteId,
    strModifiedTime,
    strModifiedUser
}) {
    try {
        let arrOldItem = await objConnection.collection(strCollection).find({
            "_id": {
                $in: arrDeleteId
            }
        }).toArray()
        if (arrOldItem.length != arrDeleteId.length) {
            throw new errHandler("ITEM_MISMACTH")
        }
        await objConnection.collection(strCollection).updateMany({
            "_id": {
                $in: arrDeleteId
            }
        }, {
            $set: {
                "chrStatus": "D",
                strModifiedTime,
                strModifiedUser
            }
        }, {
            session
        });
        return {}
    } catch (error) {
        throw new errHandler(error)
    }
}

module.exports = {
    getListTransDB,
    getOneTransDB,
    insertManyTransDB,
    insertOneTransDB,
    updateOneKeyTransDB,
    updateManyKeysTransDB,
    deleteTransDB,
    deleteOneTransDB
}