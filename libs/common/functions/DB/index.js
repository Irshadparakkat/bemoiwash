
const {
    createUserActivity,
} = require('./dataLog');
const {createErrorLog} = require('./errorLog')
const {
    getListDB,
    getOneDB,
    insertManyDB,
    insertOneDB,
    insertOneTransaction,
    deleteHardOneDB,
    updateOneKeyDB,
    deleteDB,
    deleteOneDB,
    updateFindOneKeyDB
} = require('./mongoQueries')
const{
    getListTransDB,
    getOneTransDB,
    insertManyTransDB,
    insertOneTransDB,
    updateOneKeyTransDB,
    deleteTransDB,
    deleteOneTransDB
} = require("./mongoTransQueries")
module.exports = {
    createUserActivity,
    getListDB,
    getOneDB,
    insertManyDB,
    insertOneDB,
    insertOneTransaction,
    deleteHardOneDB,
    updateOneKeyDB,
    deleteDB,
    createErrorLog,
    deleteOneDB,
    updateFindOneKeyDB,
    getListTransDB,
    getOneTransDB,
    insertManyTransDB,
    insertOneTransDB,
    updateOneKeyTransDB,
    deleteTransDB,
    deleteOneTransDB
}