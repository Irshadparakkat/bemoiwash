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

const createSubscriptionUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strName,
            strType,
            intSedanPrice,
            intSUVPrice,
            intHatchbackPrice,
            intCoupePrice,
            intWagonPrice,
            intMinivanPrice,
            intPickupPrice,
            intConvertiblePrice,
            arrServices,
            intNofDays,
            strImageUrl
        } = body;



        const arrServicesData = arrServices.map(service => ({
            strServiceId: new ObjectId(service._id),
            intAvailableCount: service.intServiceCount || 0,
        }));

        let objResult = await insertOneDB({
            objDocument: {
                strName,
                strType,
                arrServices: arrServicesData,
                intSedanPrice: intSedanPrice || 0,
                intSUVPrice: intSUVPrice || 0,
                intHatchbackPrice: intHatchbackPrice || 0,
                intCoupePrice: intCoupePrice || 0,
                intWagonPrice: intWagonPrice || 0,
                intMinivanPrice: intMinivanPrice || 0,
                intPickupPrice: intPickupPrice || 0,
                intConvertiblePrice: intConvertiblePrice || 0,
                intNofDays,
                strImageUrl,
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_subscription"
        });


        if (!objResult?.insertedId) {
            throw new errHandler("Subscription Plan creation failed").set();
        }

        return {
            strMessage: "Successfully created an subscription"
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};

const getListSubscriptionUseCase = async function ({ source, body }) {
    let arrAndConditions = [{ chrStatus: 'N' }];
    let { page } = body;

    try {
        let arrQuery = [
            {
                $match: {
                    $and: arrAndConditions,
                },
            },
            {
                $lookup: {
                    from: "cln_services",
                    localField: "arrServices.strServiceId",
                    foreignField: "_id",
                    as: "arrServicesDetails",
                },
            },
            {
                $unwind: "$arrServicesDetails",
            },
            {
                $lookup: {
                    from: "cln_package",
                    localField: "arrServicesDetails.strPackageId",
                    foreignField: "_id",
                    as: "packageDetails",
                },
            },
            {
                $unwind: { path: "$packageDetails", preserveNullAndEmptyArrays: true },
            },
            {
                $group: {
                    _id: "$_id",
                    strName: { $first: "$strName" },
                    strType: { $first: "$strType" },
                    intSedanPrice: { $first: "$intSedanPrice" },
                    intSUVPrice: { $first: "$intSUVPrice" },
                    intWagonPrice: { $first: "$intWagonPrice" },
                    intMinivanPrice: { $first: "$intMinivanPrice" },
                    intPickupPrice: { $first: "$intPickupPrice" },
                    intConvertiblePrice: { $first: "$intConvertiblePrice" },
                    intHatchbackPrice: { $first: "$intHatchbackPrice" },
                    intCoupePrice: { $first: "$intCoupePrice" },
                    strServiceIds: { $first: "$strServiceIds" },
                    intNofDays: { $first: "$intNofDays" },
                    strImageUrl: { $first: "$strImageUrl" },
                    arrServices: {
                        $push: {
                            strServiceId: "$arrServicesDetails._id",
                            strPackageId: "$arrServicesDetails.strPackageId",
                            serviceName: "$arrServicesDetails.strServiceName",
                            packageName: "$packageDetails.strName",
                            intAvailableCount: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$arrServices",
                                            as: "count",
                                            cond: {
                                                $eq: ["$$count.strServiceId", "$arrServicesDetails._id"],
                                            },
                                        },
                                    },
                                    as: "service",
                                    in: {
                                        strServiceId: "$$service.strServiceId",
                                        strPackageId: "$$service.strPackageId",
                                        serviceName: "$$service.serviceName",
                                        intAvailableCount: {
                                            $cond: {
                                                if: { $isArray: "$$service.intAvailableCount" },
                                                then: {
                                                    $arrayElemAt: [
                                                        "$$service.intAvailableCount",
                                                        0
                                                    ]
                                                },
                                                else: "$$service.intAvailableCount"
                                            }
                                        },
                                    },
                                },
                            },
                        },

                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    strName: 1,
                    strType: 1,
                    intSedanPrice: 1,
                    intSUVPrice: 1,
                    intHatchbackPrice: 1,
                    intWagonPrice: 1,
                    intMinivanPrice: 1,
                    intPickupPrice: 1,
                    intConvertiblePrice: 1,
                    intCoupePrice: 1,
                    strServiceIds: 1,
                    intNofDays: 1,
                    strImageUrl: 1,
                    arrServices: 1,
                },
            },
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_subscription",
        });

        arrList = arrList.map((subscription) => {
            const modifiedServices = subscription.arrServices.map((service) => ({
                strServiceId: service.strServiceId,
                serviceName: service.serviceName,
                strPackageId: service.strPackageId,
                strPackageName: service.packageName,
                intAvailableCount: Array.isArray(service.intAvailableCount) ? service.intAvailableCount[0].intAvailableCount : null,
            }));

            return {
                ...subscription,
                arrServices: modifiedServices,
            };
        });

        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100,
            },
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};







const updateSubscriptionUsecase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};

        let {
            strName,
            strType,
            intSedanPrice,
            intCoupePrice,
            intHatchbackPrice,
            intSUVPrice,
            intWagonPrice,
            intMinivanPrice,
            intPickupPrice,
            intConvertiblePrice,
            arrServices,
            intNofDays,
            strImageUrl
        } = body;


        let arrServicesData;

        if (arrServices) {

            arrServicesData = arrServices.map(service => ({
                strServiceId: new ObjectId(service._id),
                intAvailableCount: service.intServiceCount || 0,
            }));
        }

        if (strName) objDocument.strName = strName;
        if (strType) objDocument.strType = strType;
        if (intSedanPrice) objDocument.intSedanPrice = intSedanPrice;
        if (intCoupePrice) objDocument.intCoupePrice = intCoupePrice;
        if (intHatchbackPrice) objDocument.intHatchbackPrice = intHatchbackPrice;
        if (intSUVPrice) objDocument.intSUVPrice = intSUVPrice;
        if (intWagonPrice) objDocument.intWagonPrice = intWagonPrice;
        if (intMinivanPrice) objDocument.intMinivanPrice = intMinivanPrice;
        if (arrServices) objDocument.arrServices = arrServicesData
        if (intPickupPrice) objDocument.intPickupPrice = intPickupPrice;
        if (intConvertiblePrice) objDocument.intConvertiblePrice = intConvertiblePrice;

        if (intNofDays) objDocument.intNofDays = intNofDays;
        if (strImageUrl) objDocument.strImageUrl = strImageUrl;


        await updateOneKeyDB({
            _id: new ObjectId(body._id),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_subscription"
        });

        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const deleteSubscriptionUsecase = async function ({
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
            strCollection: "cln_subscription"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



module.exports = {
    createSubscriptionUsecase,
    getListSubscriptionUseCase,
    updateSubscriptionUsecase,
    deleteSubscriptionUsecase,
}