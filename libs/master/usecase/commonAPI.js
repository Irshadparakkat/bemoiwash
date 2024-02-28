const {
    errHandler,
    getMongoDbConnection,
    hashString,
    // setRedisData
} = require('../../core/helpers');

const {
    getListDB,
    getOneDB,
    insertManyDB,
    insertOneDB,
    insertOneTransaction,
    updateOneKeyDB,
    deleteOneDB,
} = require('../../common/functions')

const commonDelete = async ({
    source,
    body
}) => {
    try {
        const objColloection = {
            user: "cln_user",
            package: "cln_package",
            levels: "cln_levels",
            milestone: "cln_milestone"
        }
        if (!objColloection[body.strType])
            throw new errHandler("INVALID TYPE").set()

        let objResult = await deleteOneDB({
            _id: body._id,
            ...source,
            strCollection: objColloection[body.strType]
        })
        if (!objResult) {
            return {
                strMessage: "Failed"
            }
        }
        return {
            objResult,
            strMessage: "Deleted"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const commonCreate = async ({
    source,
    body
}) => {
    try {
        const objColloection = {
            settings: "cln_settings",
            milestone: "cln_milestone"
        }
        if (!objColloection[body.strType])
            throw new errHandler("INVALID TYPE").set()
        if (body.arrInsertDocuments) {
            await insertManyDB({
                ...source,
                arrInsertDocuments: body.arrInsertDocuments,
                strCollection: objColloection[body.strType]
            })
        }
        if (body.objDocument) {
            await insertOneDB({
                ...source,
                objDocument: body.objDocument,
                strCollection: objColloection[body.strType]
            })
        }
        return {
            strMessage: "Created Item"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const commonList = async ({
    source,
    body
}) => {
    try {
        const objColloection = {
            settings: "cln_settings",
            milestone: "cln_milestone"
        }
        if (!objColloection[body.strType])
            throw new errHandler("INVALID TYPE").set()
        let arrQuery = [{
            $match: {
                chrStatus: 'N',
                ...body ?.objMatch || {}
            },

        }, ]

        if (body.strType == 'milestone') {
            await arrQuery.push({
                $sort: {
                    intAmount: 1
                }
            })
        }
        let arrList = await getListDB({
            arrQuery,
            strCollection: objColloection[body.strType]
        })
        return {
            arrList: arrList || []
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const allTypes = async ({
    source,
    body
}) => {
    try {

        let arrAndConditions = [{ strType: body?.strType }];

        let arrQuery = [{
            $match: {
                $and: arrAndConditions
            },
        },
        {
            $project: {
                strName: 1,
                strType: 1,
            }
        }];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_all_type"
        });

        return {
            arrList
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const commonUpdate = async ({
    source,
    body
}) => {
    try {
        const objColloection = {
            settings: "cln_settings",
            milestone: "cln_milestone"
        }
        if (!objColloection[body.strType])
            throw new errHandler("INVALID TYPE").set()
        let {
            _id,
            objDocument
        } = body;
        let objResult = await updateOneKeyDB({
            _id,
            objDocument,
            strModifiedTime: new Date(source.timReceived),
            strModifiedUser: source.strUserId,
            strCollection: objColloection[body.strType]
        })
        if (!objResult) {
            return {
                strMessage: "Failed"
            }
        }
        return {
            objResult,
            strMessage: "Updated"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}
module.exports = {
    commonDelete,
    allTypes,
    commonCreate,
    commonList,
    commonUpdate
}