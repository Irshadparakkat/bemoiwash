const {
    getMaster
} = require("./usecase/getMaster")
const commonAPI = require('./usecase/commonAPI')
const {
    autoCompleteUsecase,
    multiDropDown
} = require("./usecase/autoComplete")
const {
    errHandler,
    multiFilesToS3
} = require('../core/helpers')

const commonUsecase = require('./usecase/commonAPI')

const scripts = require('../core/scripts')
const getMasterController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await getMaster({
                source,
                body
            })
        };
    } catch (error) {
        throw new errHandler(error).set()
    }
}

const multiTypeDropDownController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await multiDropDown({
                source,
                body
            })
        };
    } catch (error) {
        throw new errHandler(error).set()
    }
}
const asyncSearchController = async function ({
    body,
    query,
    ...source
}) {
    try {
        return {
            body: await autoCompleteUsecase({
                source,
                query,
                body
            })
        };
    } catch (error) {
        throw new errHandler(error).set()
    }
}
const autoCompleteController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await commonUsecase[body.type]({
                source,
                body
            })
        };
    } catch (error) {
        throw new errHandler(error).set()
    }
}

const commonDeleteController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await commonAPI[body.type]({
                source,
                body
            })
        };
    } catch (error) {
        throw new errHandler(error).set()
    }
}

const scriptRunnerController = async function ({
    body,
    ...source
}) {
    try {
        return {
            body: await scripts[body.type]({
                ...source,
                ...body
            })
        };
    } catch (error) {
        throw new errHandler(error).set()
    }
}
async function fileUploadeToS3Controller({
    files: objFiles,
    ...source
}) {
    try {
        let arrFileUrls
        if (objFiles && objFiles["arrFiles"]) {
            if (objFiles["arrFiles"].length >= 2) {
                arrFileUrls = await multiFilesToS3({
                    arrFiles: objFiles["arrFiles"]
                });

                return {
                    body: arrFileUrls
                };
            } else {
                arrFileUrls = await multiFilesToS3({
                    arrFiles: [objFiles["arrFiles"]],
                });

                return {
                    body: arrFileUrls
                };
            }
        } else
            throw new errHandler("FILES_MISSING", "errModuleWise")

    } catch (error) {
        throw new errHandler(error).set()
    }
}

module.exports = {
    getMasterController,
    scriptRunnerController,
    commonDeleteController,
    autoCompleteController,
    asyncSearchController,
    multiTypeDropDownController,
    fileUploadeToS3Controller
}