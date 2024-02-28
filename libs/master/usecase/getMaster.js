const {
    findMany
} = require("../../common/functions");
const {
    errHandler,
    // setRedisData
} = require('../../core/helpers')
const {
    strQueryMasterModule,
    strQueryMasterItems
} = require("../db")
const getMaster = async ({
    source,
    body
}) => {
    try {
        const arrList = await findMany(
            body["strModuleId"] ?
            strQueryMasterItems.replace(/{MODULE_ID}/, body["strModuleId"]) :
            strQueryMasterModule, null, source["strTenantId"]
        );
        return {
            arrList: arrList || []
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}

module.exports = {
    getMaster
}