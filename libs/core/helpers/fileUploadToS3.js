const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
let data = 'U2FsdGVkX18EXBj6CtqI2pYsKjCfTupBc0miGKP7+6ldlh62CCvQA18+WDBI2baf0qixVXdgJuQn/qu6B24mkNXJ5Yrkl+/Acto7TfSbh//6UUv8sHf6ib6G9p+VUKFapr6+5/0OSnSAwbyNrNspoL67QBYC19/VeHIhCPGrhV/RKnTMp8q9/DBOo3uO4wX1'; // Replace this with your own secret key (make sure to keep it secure and don't share it!)
const secretKey = 'your-secret-key';

function decryptJSON(encryptedJSON) {
    const bytes = CryptoJS.AES.decrypt(encryptedJSON, secretKey);
    const decryptedJSON = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedJSON;
}
const decryptedData = decryptJSON(data);
let strImgName = `mdlmaster${Date.now()}.jpg`
AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update(decryptedData);
let objAwsS3 = new AWS.S3()
let fileUploadToS3 = multer({
    storage: multerS3({
        s3: objAwsS3,
        bucket: AWS_S3_MASTER_BUCKET,

        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: strImgName
            });
        },
        key: function (req, file, cb) {
            cb(null, strImgName)
            req["body"][strImgName] = "https://masteraxef.s3.ap-south-1.amazonaws.com/" + strImgName
        }
    })
})
export {
    fileUploadToS3
}