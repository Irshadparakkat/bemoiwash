const { 
    getHomeUseCase
} = require("./usecase")


const {
    errHandler
} = require('../core/helpers')





const getHomePageController = async function({
    body,
    ...source
}) {
    try {
        return {
            body: await getHomeUseCase({
                source,
                body
            })
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}








module.exports = { 
    getHomePageController
}