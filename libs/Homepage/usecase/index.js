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


const getHomeUseCase = async function ({
    source,
    body
}) {

    try {

    } catch (error) {
        throw new errHandler(error).set()
    }
}








module.exports = {
    getHomeUseCase
}