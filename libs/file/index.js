
const {
    errHandler
} = require('../core/helpers')
const {imageUpload} = require('../common/functions');
const uploadBase64FileController = async function({
    body,
    ...source
}) {
    if(!body.strFileBase64 )
    throw new errHandler("FILE NOT FOUND").set()
    try {
        return {
            body: {strUrl:await imageUpload(body.strFileBase64,body.strModule || 'all',body.strFileName,body.strFileExtension || null)}
        };
    } catch (error) {
        console.log("error",error);
        throw new errHandler(error).set()
    }
}



// const uploadFileStreamController = async function({
//     body,
//     ...source
// }) {
//     try {
//         return {
//             body: {strUrl:await fileUploadStream(body.file,body.strModule || 'all',body.strFileName,body.strFileExtension || null)}
//         };
//     } catch (error) {
//         console.log("error",error);
//         throw new errHandler(error).set()
//     }
// }



module.exports = {
    uploadBase64FileController,
}