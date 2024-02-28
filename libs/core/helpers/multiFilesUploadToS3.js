 const AWS = require('aws-sdk');
 const CryptoJS = require('crypto-js');
 let data = 'U2FsdGVkX19oN6WPXNAIxXqkWXNReh/ZBJjUv2tPt/9um4HaQqTw4qRrla58hncuYsPvT+26edFIErzAIyqGWAA+YrEh677r8VZf/1qeTOGodwKPwr4L8ZNlvu7aQnb211w3XRZeiHoe1lAaMv+mIsUesaM/9GaEaDyzrLa0SWLY7J+Rdm5C4FCBd4JEzRnV'; // Replace this with your own secret key (make sure to keep it secure and don't share it!)
 const secretKey = 'your-secret-key';

 function decryptJSON(encryptedJSON) {
     const bytes = CryptoJS.AES.decrypt(encryptedJSON, secretKey);
     const decryptedJSON = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
     return decryptedJSON;
 }
 const decryptedData = decryptJSON(data);
 AWS.config.setPromisesDependency(require('bluebird'));
 AWS.config.update(decryptedData);
 async function multiFilesToS3({
     arrFiles
 }) {
     try {
         let objAwsS3 = await new AWS.S3()
         let objUrlResponse = {}
         let strFileType = ''
         // await arrFiles.forEach((objItem, intIndex) => {
         //     console.log(objItem["name"]);

         //     let arrFilename = objItem["name"].split('.')
         //     console.log("arrFilename");
         //     console.log(arrFilename);
         //     strFileType = arrFilename[arrFilename.length - 1]
         //     objUrlResponse['strImgUrl_' + intIndex] = `${objConfig.jsnDetails.AWS_BUCKET_URL}${intIndex}${strImgName}.${strFileType}`
         //     objAwsS3.putObject({
         //         Bucket: AWS_S3_MASTER_BUCKET,
         //         Body: objItem.data,
         //         Key: `${intIndex}${strImgName}.${strFileType}`,
         //         ACL: "public-read",
         //     }, function (perr, pres) {
         //         if (perr) {
         //             console.log("Error uploading data: ", perr);
         //         } else {
         //         }
         //     });
         // });
         let arrUrls= [];
         for (let intIndex = 0; intIndex < arrFiles ?.length; intIndex++) {
             let objItem = arrFiles[intIndex]
             console.log(objItem["name"]);
             let arrFilename = await objItem["name"].split('.')
             console.log("arrFilename");
             console.log(arrFilename);
             strFileType = await arrFilename[arrFilename.length - 1]
             let strFileName = arrFilename[0]
             let key =await  `${intIndex}_${strFileName}_${new Date().getTime()}.${strFileType}`
            console.log("key",key);
             let objResult =  await objAwsS3.putObject({
                 Bucket: "moii",
                 Body: objItem.data,
                 Key:key,
                 ACL: "public-read",
             },function (perr, pres) {
                if (perr) {
                    console.log("Error uploading data: ", perr);
                } else {
                 
                    console.log("Error uploading data: ", pres);   
                }
            });
             await arrUrls.push(`https://moii.s3.me-central-1.amazonaws.com/${key}`);
         }
         // const arrUrls = await arrFiles.map(async (objItem, intIndex) => {
         //     console.log(objItem["name"]);
         //     let arrFilename = await objItem["name"].split('.')
         //     console.log("arrFilename");
         //     console.log(arrFilename);
         //     strFileType = await arrFilename[arrFilename.length - 1] 
         //     let strFileName = arrFilename[0]
         //     return await objAwsS3.putObject({ 
         //         Bucket: "moii",         
         //         Body: objItem.data,
         //         Key: `${intIndex}_${strFileName}_${new Date().getTime()}.${strFileType}`,
         //         ACL: "public-read",
         //     });

         // });
         return {
             arrUrls,
             ...objUrlResponse
         }
     } catch (error) {
         console.log("error", error)
     }
 }

 module.exports = multiFilesToS3;