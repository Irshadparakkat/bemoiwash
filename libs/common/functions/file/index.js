const AWS = require('aws-sdk');
const CryptoJS = require('crypto-js');
const base64ToFile = () => {

}

let fileMimeType = {
  JVB: {
    strType: "pdf",
    strMime: "application/pdf"
  },
  R0l: {
    strType: "gif",
    strMime: "image/gif"
  },
  iVB: {
    strType: "png",
    strMime: "image/png"
  },
  "/9j": {
    strType: "jpg",
    strMime: "image/jpg"
  },
  RIFF: {
    strType: "avi",
    strMime: "video/avi"
  },
  OggS: {
    strType: "ogg",
    strMime: "audio/ogg"
  },
  ID3: {
    strType: "mp3",
    strMime: "audio/mp3"
  },
  "fmt ": {
    strType: "wav",
    strMime: "audio/wav"
  },
  ftypisom: {
    strType: "mp4",
    strMime: "video/mp4"
  },
  ftypmqt: {
    strType: "mov",
    strMime: "video/mov"
  },
  ftypwebm: {
    strType: "webm",
    strMime: "video/webm"
  },
  "//F": {
    strType: "aac",
    strMime: "audio/aac"
  }
};

let objContentType = {
  "pdf": "application/pdf",
  "gif": "image/gif",
  "png": "image/png",
  "jpg": "image/jpg",
  "avi": "video/avi",
  "ogg": "audio/ogg",
  "mp3": "audio/mp3",
  "wav": "audio/wav",
  "mp4": "video/mp4",
  "mov": "video/mov",
  "webm": "video/webm",
  "aac": "audio/aac",
  "m4a": "audio/mp4",
  "m4a1": "audio/x-m4a",
  "m4a2": "audio/m4a",

}

let data = 'U2FsdGVkX1+h+eL9BMFg3sG3KyBBaDEtSwU0gAnzx1BJbMMNuqTsmRptaOq7VBQYRCpNHAN/jhMDCwwCBsY7JaUYJvLNGfWNzY1ydj1WopqTCtqlFY+pqyntkVA5RhE0mluEW8ZU/UsIDQBo/trTXv5Flu3DSafLd7TvdHWYwE17R2Sz11TDg0Q0yZ2aRFNu'; // Replace this with your own secret key (make sure to keep it secure and don't share it!)
const secretKey = 'your-secret-key';

function decryptJSON(encryptedJSON) {
  const bytes = CryptoJS.AES.decrypt(encryptedJSON, secretKey);
  const decryptedJSON = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedJSON;
}
const decryptedData = decryptJSON(data);

AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update(decryptedData);
const s3 = new AWS.S3();


const imageUpload = async (base64, module = 'all', fileName = null, strFileExtension = null) => {

  const base64Data = await new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  let fType = await base64.toString().substring(0, 3)
  const params = {
    Bucket: "moii",
    Key: `${module}_${fileName || new Date().getTime()}.${strFileExtension||fileMimeType[fType]?.strType}`, // type is not required
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64', // required
    ContentType: `${strFileExtension?objContentType[strFileExtension] : fileMimeType[fType]?.strMime}` // required. Notice the back ticks
  }
  try {
    const {
      Location,
      Key
    } = await s3.upload(params).promise();

    console.log(Location, Key);
    return Location;
  } catch (error) {
    console.log(error)
  }
}

// const fileUploadStream = async (file, module = 'all', fileName = null, strFileExtension = null) => {
//   const key = `${module}_${fileName || new Date().getTime()}.${strFileExtension || 'bin'}`;
//  const contentType = strFileExtension ? objContentType[strFileExtension] :'application/octet-stream';

//   const fileStream = fs.createReadStream(file.path);

//   const params = {
//     Bucket: "moii",
//     Key: key,
//     Body: fileStream,
//     ContentType: contentType,
//     ACL: 'public-read', // Adjust permissions as needed
//   };

//   try {
//     const data = await s3.upload(params).promise();
//     return data.Location;
//   } catch (error) {
//     console.error('File upload error:', error);
//     throw error;
//   }
// };



module.exports = {
  base64ToFile,
  imageUpload,
}