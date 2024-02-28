const {
    errHandler,
    compareHashAndText,
    jwtSignIn,
    encryptString,
    getMongoTransConnection,
    hashString
    // setRedisData
} = require('../../core/helpers')
const {
    getOneDB,
    insertOneTransDB,
    imageUpload,
    insertOneDB,
    getListDB,
    updateOneKeyDB
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');
const uuid = require('uuid');
const QRCode = require('qrcode');
const { getCountDB } = require('../../common/functions/DB/mongoQueries');
const { sendSms } = require('../../core/otpservices');



const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};


const logInUserUsecase = async function ({
    source,
    body: objUserBody
}) {

    if (!objUserBody["strPassword"] && objUserBody["strMobileNo"]) {
        const strOTPToken = await uuid.v4();

        const otp = generateOTP();
        await sendSms(objUserBody["strMobileNo"], otp);

        const objUser = await getOneDB({
            strCollection: 'cln_user',
            objQuery: {
                chrStatus: 'N',
                strMobileNo: objUserBody["strMobileNo"]
            }
        });

        if (!objUser) {
            let objUserInsert = await insertOneDB({
                objDocument: {
                    strOTPToken,
                    strOtp: otp,
                    chrStatus: "P",
                    strName: objUserBody.strName || '',
                    strFullName: objUserBody.strFullName || objUserBody.strName || '',
                    strMobileNo: objUserBody.strMobileNo || '',
                    strEmail: objUserBody.strEmail || '',
                    strSignupMethode: objUserBody.strSignupMethode || '',
                    strType: objUserBody.strType || 'USER',
                    strProfileUrl: objUserBody.strProfileUrl || null,
                    strHashPassword: '',
                    location: {
                        type: 'Point',
                        coordinates: objUserBody.coordinates
                    } || {},
                    strCreatedTime: new Date(source.timReceived),
                },
                strCollection: "cln_user"
            });
            if (!objUserInsert?.insertedId) {
                throw new errHandler("USER CREATION FAILED").set()
            }

            return {
                _id: objUserInsert?.insertedId,
                strOTPToken,
                strMessage: "Success fully registered "
            }
        }

        let strToken = await jwtSignIn({
            "strUserId": objUser["_id"]?.toString(),
            "strType": objUser["strType"]?.toString(),
            strFullName: objUser['strFullName']
        }, {
            issuer: "issuer",
            subject: "IP",
            audience: "ABDU"
        })
        let strEncryptToken = await encryptString(source.strTenantId, strToken)
        await delete objUser["strHashPassword"];


        let update = await updateOneKeyDB({
            _id: objUser["_id"]?.toString(),
            strCollection: "cln_user",
            objDocument: {
                strOTPToken,
                strOtp: otp
            }
        });
        return {
            _id:objUser._id,
            strOTPToken,
        }
    }

    const objUser = await getOneDB({
        strCollection: 'cln_user',
        objQuery: {
            $or: [{
                strName: objUserBody["strLoginId"]
            },
            {
                strMobileNo: objUserBody["strLoginId"]
            },
            {
                strEmail: objUserBody["strLoginId"]
            }
            ]
        }
    });
    if (!objUser) {
        throw new errHandler("USER NOT FOUND").set()
    }
    if (objUser["chrStatus"] === 'B')
        throw new errHandler("USER IS  BLOCKED FOR LOGIN!!\nKINDLY PLEASE CONNECT TO ADMIN").set()
    let strToken = "",
        strEncryptToken = ""
    if (await compareHashAndText(source.strTenantId, objUserBody["strPassword"], objUser["strHashPassword"])) {
        strToken = await jwtSignIn({
            "strUserId": objUser["_id"]?.toString(),
            "strType": objUser["strType"]?.toString(),
            strFullName: objUser['strFullName']
        }, {
            issuer: "issuer",
            subject: "IP",
            audience: "ABDU"
        })
        strEncryptToken = await encryptString(source.strTenantId, strToken)
        //   await setRedisData(strEncryptToken, objUser["strUserId"].toString())
        await delete objUser["strPassword"]

        await updateOneKeyDB
            ({
                _id: objUser._id,
                strCollection: "cln_user",
                objDocument: {
                    strFcmToken: objUserBody?.strFcmToken || ''
                }
            });

    } else {
        throw new errHandler("CREDENTIAL_INVALID").set()
    }
    return {
        "strToken": strEncryptToken,
        ...objUser
    }
}

const createUserUsecase = async function ({
    source,
    body
}) {
    if (body.strType == 'ADMIN') {
        const strHashPassword = await hashString('source.strTenantId', body["strPassword"]);
        const strOTPToken = await uuid.v4();

        let objUserInsert = await insertOneDB({
            objDocument: {
                strName: body.strName,
                strFullName: body.strFullName || '',
                strMobileNo: body.strMobileNo || '',
                strEmail: body.strEmail || '',
                strType: body.strType,
                strHashPassword,
                strCreatedTime: new Date(source.timReceived),
                strCreatedUser: source.strUserId,
                otpToken: strOTPToken,
            },
            strCollection: "cln_user",
        });

        let objResult = await insertOneDB({
            objDocument: {
                strUserId: objUserInsert?.insertedId,
                strAccountType: body.strType,
                strRemarks: body.strRemarks || '',
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_account"
        });

        if (!objResult?.insertedId) {
            throw new errHandler("ACCOUNT CREATION FAILED").set()
        }

        return {
            strMessage: "Success fully new  Admin  created "
        }
    }
    return Promise.all([
        body.strProfileBase64 ? imageUpload(body.strProfileBase64, 'USER', null, null) : 'https://tamilnaducouncil.ac.in/wp-content/uploads/2020/04/dummy-avatar.jpg'
    ]).then(async ([strProfileUrl]) => {
        const strHashPassword = await hashString('source.strTenantId', body["strPassword"]);
        try {
            if (!body["strPassword"]) {
                throw new errHandler("PASSWORD_MISSING").set()
            }
            const strOTPToken = await uuid.v4();
            let objUserInsert = await insertOneDB({
                objDocument: {
                    strOTPToken,
                    chrStatus: body.strType == 'Employee' ? 'N' : 'P',
                    strName: body.strName,
                    strFullName: body.strFullName || '',
                    strMobileNo: body.strMobileNo || '',
                    strEmail: body.strEmail || '',
                    strSignupMethode: body.strSignupMethode || '',
                    strQRCodeUrls: '',
                    strType: body.strType || 'USER',
                    strProfileUrl,
                    strHashPassword,
                    strBirthday: body.strBirthday || '',
                    location: {
                        type: 'Point',
                        coordinates: body.coordinates,
                    } || {},
                    strCreatedTime: new Date(source.timReceived),
                },
                strCollection: "cln_user"
            });
            if (!objUserInsert?.insertedId) {
                throw new errHandler("USER CREATION FAILED").set()
            }
            let _id = objUserInsert?.insertedId.toString();
            let QRbase64 = await QRCode.toDataURL(_id);
            let strQRCodeUrls = await imageUpload(QRbase64.split(',')[1], 'QRCODE', null, null);
            await updateOneKeyDB({
                _id,
                strCollection: "cln_user",
                objDocument: {
                    strQRCodeUrls
                }
            });



            let objResult = await insertOneDB({
                objDocument: {
                    strUserId: objUserInsert?.insertedId,
                    strAccountType: body.strType,
                    strRemarks: body.strRemarks || '',
                    strCreatedBy: new ObjectId(source.strUserId),
                    strCreatedTime: new Date(source?.timReceived),
                },
                strCollection: "cln_account"
            });

            if (!objResult?.insertedId) {
                throw new errHandler("ACCOUNT CREATION FAILED").set()
            }

            return {
                _id: objUserInsert?.insertedId,
                strOTPToken,
                strMessage: "Success fully created "
            }
        } catch (error) {
            throw new errHandler(error).set()
        }
    }).catch(err => {
        console.log("err", err);
        throw new errHandler(err).set()
    })
}



const createCustomerUsecase = async function ({
    source,
    body
}) {
    try {
        const strOTPToken = await uuid.v4();

        let objUserInsert = await insertOneDB({
            objDocument: {
                strOTPToken,
                chrStatus: 'N',
                strName: body.strName,
                strFullName: body.strFullName || body.strName,
                strMobileNo: body.strMobileNo,
                strEmail: body.strEmail || '',
                strSignupMethode: body.strSignupMethode || '',
                strType: 'USER',
                strProfileUrl: '',
                strHashPassword: '',
                strBirthday: body.strBirthday || '',
                location: {
                    type: 'Point',
                    coordinates: body.coordinates,
                } || {},
                strCreatedTime: new Date(source.timReceived),
            },
            strCollection: "cln_user"
        });


        let objResult = await insertOneDB({
            objDocument: {
                strUserId: new ObjectId(objUserInsert?.insertedId),
                strAccountType: 'USER',
                strRemarks: body.strRemarks || '',
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_account"
        });

        if (!objResult?.insertedId) {
            throw new errHandler("ACCOUNT CREATION FAILED").set()
        }

        if (!objUserInsert?.insertedId) {
            throw new errHandler("USER CREATION FAILED").set()
        }
        let _id = objUserInsert?.insertedId.toString();

        return {
            _id: objUserInsert?.insertedId,
            strOTPToken,
            strMessage: "Success fully created "
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const getListUserUsecase = async function ({
    source,
    body
}) {
    let arrAndConditions = [{ chrStatus: 'N' }, { strType: 'USER' }];


    let {
        page,

    } = body

    if (body.strSearch) {
        const regexCondition = {
            $regex: `^${body.strSearch}`,
            $options: 'i'
        };

        arrAndConditions.push({
            $or: [
                { strMobileNo: regexCondition },
                { strFullName: regexCondition },
                { strName: regexCondition },
            ]
        });
    }


    try {
        let arrQuery = [{
            $match: {
                $and: arrAndConditions
            },
        },
        {
            $project: {
                _id: 1,
                strFullName: 1,
                strMobileNo: 1,
                strProfileUrl: 1,
                strEmail: 1,
                location: 1,
                strName: 1,
            }
        }];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_user"
        });

        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}

const getUserByIdUsecase = async function ({ source, body }) {
    try {
        const objUser = await getUserDetails(source?.strUserId);
        const objBasicCoinData = await getBasicCoinData();
        const userCoins = await getUserCoins(source?.strUserId);

        let isUserPremium = false;

        if (objUser.location) {
            isUserPremium = objUser.location?.coordinates ? await checkUserPremium(objUser.location.coordinates) : false;
        }



        if(body.strFcmToken){
            await updateOneKeyDB
            ({
                _id: source?.strUserId,
                strCollection: "cln_user",
                objDocument: {
                    strFcmToken: objUserBody?.strFcmToken || ''
                }
            });
        }


        let arrQuery = [
            {
                $project: {
                    strZoneName: 1,
                    strZonePolygon: 1
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_zone"
        });

        const result = {
            ...objUser,
            strZoneName: arrList[0].strZoneName,
            strZonePolygon: arrList[0].strZonePolygon,
            userCoins,
            isUserPremium,
            intToGetOneCoin: objBasicCoinData?.intToGetOneCoin,
            intOneCoinValue: objBasicCoinData?.intOneCoinValue
        };

        return result;
    } catch (error) {
        throw new errHandler(error).set();
    }
}

async function getUserDetails(userId) {
    return getOneDB({
        strCollection: 'cln_user',
        objQuery: { _id: new ObjectId(userId) }
    });
}

async function getBasicCoinData() {
    return getOneDB({
        strCollection: 'cln_coin_value',
        objQuery: {}
    });
}


async function getUserCoins(userId) {
    const arrQuery = [
        {
            $match: {
                strCreatedBy: new ObjectId(userId),
                chrStatus: "N",
            }
        },
        {
            $group: {
                _id: null,
                userGettingCoin: { $sum: "$userEarnedCoin" }
            }
        }
    ];

    const arrList = await getListDB({
        arrQuery,
        strCollection: "cln_user_coin"
    });

    return arrList.length > 0 ? arrList[0].userGettingCoin : 0;
}

// Rest of your code remains unchanged

async function checkUserPremium(userLocation) {
    const availableLocations = await getListDB({
        strCollection: 'cln_locations',
        objQuery: {
            chrStatus: 'N',
        }
    });

    for (const location of availableLocations) {
        const locationCoordinates = location.strLocation.coordinates;
        const locationRadius = location.strRadius;
        const distance = calculateDistance(userLocation, locationCoordinates);
        if (distance <= locationRadius) {
            return false;
        }
    }
    return true;
}


const EARTH_RADIUS = 6371000; // Earth's radius in meters

function calculateDistance(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = EARTH_RADIUS * c; // Distance in meters

    return distance;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}




const OTPVerifyUsecase = async function ({
    source,
    body
}) {
    try {
        let strOTPToken = body.strOTPToken;
        let strOtp = body.strOtp;

        const objUser = await getOneDB({
            strCollection: 'cln_user',
            objQuery: {
                strOTPToken,
                strOtp
            }
        });

        if (!objUser)
            throw new errHandler("OTP VERIFICATION FAILED").set();
        if (objUser.chrStatus !== 'N') {
            await updateOneKeyDB
                ({
                    _id: objUser._id,
                    strCollection: "cln_user",
                    objDocument: {
                        chrStatus: "N",
                        strFcmToken: body?.strFcmToken || ''
                    }
                });

            let objResult = await insertOneDB({
                objDocument: {
                    strUserId: objUser._id,
                    strAccountType: 'USER',
                    strRemarks: body.strRemarks || '',
                    strCreatedBy: new ObjectId(source.strUserId),
                    strCreatedTime: new Date(source?.timReceived),
                },
                strCollection: "cln_account"
            });

            if (!objResult?.insertedId) {
                throw new errHandler("ACCOUNT CREATION FAILED").set()
            }

        } else {
            await updateOneKeyDB
                ({
                    _id: objUser._id,
                    strCollection: "cln_user",
                    objDocument: {
                        strFcmToken: body?.strFcmToken || ''
                    }
                });
        }

        let strToken = await jwtSignIn({
            "strUserId": objUser["_id"]?.toString(),
            "strType": objUser["strType"]?.toString(),
            "strUserType": objUser["strType"]?.toString(),
            "strMobileNo": objUser["strMobileNo"],
            strFullName: objUser['strFullName']
        }, {
            issuer: "issuer",
            subject: "IP",
            audience: "ABDU"
        });
        let strEncryptToken = await encryptString(source.strTenantId, strToken)
        return {
            strToken: strEncryptToken,
            ...objUser
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const resendeOtpUseCase = async function ({
    source,
    body
}) {
    try {
        let strOTPToken = body.strOTPToken;
        let strMobileNo = body.strMobileNo;

        const otp = generateOTP();


        await sendSms(strMobileNo, otp);

        const objUser = await getOneDB({
            strCollection: 'cln_user',
            objQuery: {
                strOTPToken,
                strMobileNo
            }
        });
        const strNewOTPToken = await uuid.v4();
        if (!objUser)
            throw new errHandler("OTP VERIFICATION FAILED").set();
        if (objUser) {
            await updateOneKeyDB
                ({
                    _id: objUser._id,
                    strCollection: "cln_user",
                    objDocument: {
                        chrStatus: "N",
                        strOtp: otp,
                        strOTPToken: strNewOTPToken
                    }
                });
        }

        return {
            strOTPToken: strNewOTPToken,
            otp
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const updateUserUsecase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};
        if (body.strProfileBase64) {
            const strProfileUrl = await imageUpload(body.strProfileBase64, 'USER', null, null);
            objDocument.strProfileUrl = strProfileUrl;
        }

        let {
            strName,
            strFullName,
            strMobileNo,
            strAddress,
            strEmail,
            strLocation,
            coordinates,
        } = body;

        if (strName) objDocument.strName = strName;
        if (strFullName) objDocument.strFullName = strFullName;
        if (strAddress) objDocument.strAddress = strAddress;
        if (strMobileNo) objDocument.strMobileNo = strMobileNo;
        if (strEmail) objDocument.strEmail = strEmail;
        if (strLocation) objDocument.strLocation = strLocation;
        if (coordinates) objDocument.location = { type: 'Point', coordinates: coordinates };

        await updateOneKeyDB({
            _id: new ObjectId(source.strUserId),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_user"
        });

        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const deleteUserUsecase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};
        objDocument.chrStatus = 'D';

        await updateOneKeyDB({
            _id: new ObjectId(source.strUserId),
            objDocument: {
                strDeletedBy: new ObjectId(source.strUserId),
                strDeletedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_user"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}





const deleteEmployeeUsecase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};
        objDocument.chrStatus = 'D';



        await updateOneKeyDB({
            _id: new ObjectId(body.id),
            objDocument: {
                strDeletedBy: new ObjectId(source.strUserId),
                strDeletedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_user"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const updateEmployeeUsecase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};
        if (body.strProfileBase64) {
            const strProfileUrl = await imageUpload(body.strProfileBase64, 'USER', null, null);
            objDocument.strProfileUrl = strProfileUrl;
        }

        if (body.strPassword) {
            const strHashPassword = await hashString('source.strTenantId', body["strPassword"]);

            objDocument.strHashPassword = strHashPassword
        }

        let {
            strName,
            strFullName,
            strMobileNo,
            strAddress,
            strEmail,
            strLocation,
            coordinates,
        } = body;

        if (strName) objDocument.strName = strName;
        if (strFullName) objDocument.strFullName = strFullName;
        if (strAddress) objDocument.strAddress = strAddress;
        if (strMobileNo) objDocument.strMobileNo = strMobileNo;
        if (strEmail) objDocument.strEmail = strEmail;
        if (strLocation) objDocument.strLocation = strLocation;
        if (coordinates) objDocument.location = { type: 'Point', coordinates: coordinates };


        await updateOneKeyDB({
            _id: new ObjectId(body.id),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_user"
        });

        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}




const getListEmployeeUsecase = async function ({
    source,
    body
}) {
    let arrAndConditions = [{ chrStatus: 'N' }, { strType: 'Employee' }];



    let {
        page,

    } = body

    if (body.strSearch) {
        const regexCondition = {
            $regex: `^${body.strSearch}`,
            $options: 'i'
        };

        arrAndConditions.push({
            $or: [
                { strMobileNo: regexCondition },
                { strFullName: regexCondition },
                { strName: regexCondition },
            ]
        });
    }

    try {
        let arrQuery = [{
            $match: {
                $and: arrAndConditions
            },
        },
        {
            $project: {
                _id: 1,
                strFullName: 1,
                strMobileNo: 1,
                strProfileUrl: 1,
                strEmail: 1,
                location: 1,
                strName: 1,
            }
        }];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_user"
        });

        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }

        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


module.exports = {
    logInUserUsecase,
    createUserUsecase,
    getListUserUsecase,
    getListEmployeeUsecase,
    deleteEmployeeUsecase,
    updateEmployeeUsecase,
    getUserByIdUsecase,
    OTPVerifyUsecase,
    updateUserUsecase,
    createCustomerUsecase,
    deleteUserUsecase,
    resendeOtpUseCase
}