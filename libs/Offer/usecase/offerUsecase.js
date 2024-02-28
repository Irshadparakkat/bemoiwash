const {
    errHandler,
} = require('../../core/helpers')
const {
    insertManyDB,
    insertOneDB,
    getListDB,
    imageUpload,
    updateOneKeyDB,
    deleteHardOneDB,
    getOneDB
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');
const {
    sendFirebaseNotification
} = require('../../notification/usecase/firbaseUsecase');
const { createNotification } = require('../../notification/usecase/notificationServices');

const createOfferUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            intPercentageDiscount,
            intMinAmount,
            intMaxAmount,
            strServiceId,
            strOfferImageUrl,
            strExpireDate,
            strPromoCode,
            arrBannerContent,
            strBannerImageUrl
        } = body;



        const expireDate = new Date(strExpireDate);

        // Check if the date parsing was successful
        if (isNaN(expireDate.getTime())) {
            throw new errHandler("Invalid date format").set();
        }

        let objResult = await insertOneDB({
            objDocument: {
                intPercentageDiscount,
                intMinAmount,
                intMaxAmount,
                strServiceId:strServiceId? new ObjectId(strServiceId):null,
                strOfferImageUrl,
                strExpireDate: expireDate,
                strPromoCode,
                strBannerImageUrl,
                arrBannerContent,
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_offer"
        });

        if (!objResult?.insertedId) {
            throw new errHandler("Offer creation failed").set();
        }

        let serviceData = await getOneDB({
            strCollection: 'cln_services',
            objQuery: {
                chrStatus: 'N',
                _id: new ObjectId(strServiceId)
            }
        });


        let arrAndConditions = [{ chrStatus: 'N' }, { strType: 'USER' }];

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
                strFcmToken: 1,
                strName: 1,
            }
        }];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_user"
        });

       
        const fcmTokens = arrList
            .filter(user => user.strFcmToken)
            .map(user => user.strFcmToken);

        await Promise.all([
            ...fcmTokens.map(fcmToken => sendFirebaseNotification({
                strFcmToken: fcmToken,
                strTittle: "New Offer",
                strBody: `New Offer is created for ${serviceData?.strServiceName || "All Services"}`,
                strCollapseKey: 'services',
                strPage: 'offer',
                strId: objResult?.insertedId
            })),
            ...arrList.map(user => createNotification({
                ...source,
                strType: 'offer',
                createdForUserId: user._id,
                strNotification: `New Offer is created for ${serviceData?.strServiceName || "All Services"}`,
            })),
        ]);

        return {
            strMessage: "Successfully created an offer"
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};



const getListOfferUseCase = async function ({
    source,
    body
}) {
    let arrAndConditions = [{
        chrStatus: 'N'
    }];

    let {
        page
    } = body

    try {
        let arrQuery = [
            {
                $match: {
                    $and: arrAndConditions
                },
            },
            {
                $lookup: {
                    from: "cln_services",
                    localField: "strServiceId",
                    foreignField: "_id",
                    as: "serviceDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    intPercentageDiscount: 1,
                    strPromoCode: 1,
                    intMinAmount: 1,
                    intMaxAmount:1,
                    strOfferImageUrl: 1,
                    strExpireDate: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1,
                    arrBannerContent:1,
                    strBannerImageUrl:1,
                    serviceDetails:1,
                    strServiceName: "$serviceDetails.strServiceName"
                }
            },
            {
                $match: {
                    strExpireDate: { $gte: new Date() }
                }

            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_offer"
        });

        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};



const updateOfferUsecase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};

        let {
            intPercentageDiscount,
            intMinAmount,
            intMaxAmount,
            strServiceId,
            strOfferImageUrl,
            strExpireDate,
            strPromoCode,
            arrBannerContent,
            strBannerImageUrl
        } = body;


        let expireDate;
        if (strExpireDate) {


             expireDate = new Date(strExpireDate);

            // Check if the date parsing was successful
            if (isNaN(expireDate.getTime())) {
                throw new errHandler("Invalid date format").set();
            }

        }


        if (intPercentageDiscount) objDocument.intPercentageDiscount = intPercentageDiscount;
        if (strServiceId) objDocument.strServiceId = new ObjectId(strServiceId);
        if (strOfferImageUrl) objDocument.strOfferImageUrl = strOfferImageUrl;
        if (strExpireDate) objDocument.strExpireDate = expireDate;
        if (intMinAmount) objDocument.intMinAmount = intMinAmount;
        if (intMaxAmount) objDocument.intMaxAmount = intMaxAmount;
        if (strPromoCode) objDocument.strPromoCode = strPromoCode;
        if (arrBannerContent) objDocument.arrBannerContent = arrBannerContent;
        if (strBannerImageUrl) objDocument.strBannerImageUrl = strBannerImageUrl;


        await updateOneKeyDB({
            _id: new ObjectId(body._id),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_offer"
        });

        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const deleteOfferUsecase = async function ({
    source,
    body
}) {
    try {

        const { _id } = body

        let objDocument = {};
        objDocument.chrStatus = 'D';

        await updateOneKeyDB({
            _id: new ObjectId(_id),
            objDocument: {
                strDeletedBy: new ObjectId(source.strUserId),
                strDeletedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_offer"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const getPromocodeCheckUseCase = async function ({ source, body }) {
    try {
        const { strPromoCode, strServiceId } = body;

        let currentDate = new Date(source.timReceived);

        const promoCodeOffer = await getOneDB({
            strCollection: 'cln_offer',
            objQuery: {
                chrStatus: 'N',
                strPromoCode: {
                    $regex: new RegExp(`^${strPromoCode}$`, 'i'),
                },
                strExpireDate: { $gte: currentDate },
            }
        });

        if (!promoCodeOffer) {
            return {
                success: false,
                message: "success",
                statusCode: 208,
                strMessage: "Promo code is invalid",
            };
        }

        return {
            intDiscountPercentage: promoCodeOffer.intPercentageDiscount,
            intMinAmount:0,
            intMaxAmount:0,
            ...promoCodeOffer,
            strMessage: "Valid Promo Code",
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};


module.exports = {
    createOfferUsecase,
    getListOfferUseCase,
    updateOfferUsecase,
    deleteOfferUsecase,
    getPromocodeCheckUseCase
}