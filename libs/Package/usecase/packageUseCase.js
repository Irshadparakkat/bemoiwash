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

const createPackageUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strName,
            strDescription,
            strCommonImageUrl,
            strLocationType,
            strLocation
        } = body;

        let objResult = await insertOneDB({
            objDocument: {
                strName,
                strDescription: strDescription || '',
                strCommonImageUrl,
                strLocationType,
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_package"
        });
        if (!objResult?.insertedId) {
            throw new errHandler("PACKAGE CREATION FAILED").set()
        }
        const strPackageId = objResult?.insertedId

        if (strLocationType !== 'All') {
            let objLocationResult = await insertOneDB({
                objDocument: {
                    strLocation,
                    strPackageId: new ObjectId(strPackageId),
                    strCreatedBy: new ObjectId(source.strUserId),
                    strCreatedTime: new Date(source?.timReceived),
                },
                strCollection: "cln_package_locations"
            });
            if (!objLocationResult?.insertedId) {
                throw new errHandler("Location Adding FAILED").set()
            }
        }


        // Get the inserted data including the _id
        const insertedData = await getOneDB({
            strCollection: "cln_package",
            objQuery: { _id: objResult.insertedId },
        });

        return {
            strMessage: "Success fully Added New Package",
            ...insertedData
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const updatePackageUsecase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};

        let {
            strName,
            strDescription,
            strCommonImageUrl,
            strLocationType,
            strLocation
        } = body;

        let objDocument1 = {}

        if (strName) objDocument.strName = strName;
        if (strDescription) objDocument.strDescription = strDescription;
        if (strCommonImageUrl) objDocument.strCommonImageUrl = strCommonImageUrl;

        await updateOneKeyDB({
            _id: new ObjectId(body.id),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_package"
        });

        const insertedData = await getOneDB({
            strCollection: "cln_package",
            objQuery: { _id: new ObjectId(body.id) },
        });

        return {
            strMessage: "Successfully updated",
            ...insertedData
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}




const createServicesUsecase = async function ({
    source,
    body
}) {
    try {

        let {
            strPackageId,
            strServiceName,
            strSedanUrl,
            strSuvUrl,
            strCoupeUrl,
            strHatchbackUrl,
            strConvertibleUrl,
            strCrossoverUrl,
            strMinivanUrl,
            strPickupUrl,
            strWagonUrl,
            strLuxuryCarUrl,
            intSedanPrice,
            intSUVPrice,
            intCoupePrice,
            intHatchbackPrice,
            intConvertiblePrice,
            intCrossoverPrice,
            intMinivanPrice,
            intPickupPrice,
            intWagonPrice,
            intLuxuryCarPrice,
            strSlotHour,
            isClosed,
            strArrCheckList,
            strPercentage,
            isPremium,
            arrDescription,
        } = body;



        arrDescription = arrDescription.filter(desc => desc !== null);


        let ObjServices = await insertOneDB({
            objDocument: {
                strServiceName: strServiceName,
                strPackageId: new ObjectId(strPackageId),
                strSedanUrl: strSedanUrl || '',
                strSuvUrl: strSuvUrl || '',
                strCoupeUrl: strCoupeUrl || '',
                strHatchbackUrl: strHatchbackUrl || '',
                strConvertibleUrl: strConvertibleUrl || '',
                strCrossoverUrl: strCrossoverUrl || '',
                strMinivanUrl: strMinivanUrl || '',
                strPickupUrl: strPickupUrl || '',
                strWagonUrl: strWagonUrl || '',
                strLuxuryCarUrl: strLuxuryCarUrl || '',
                intSedanPrice: intSedanPrice || 0,
                intSUVPrice: intSUVPrice || 0,
                intCoupePrice: intCoupePrice || 0,
                intHatchbackPrice: intHatchbackPrice || 0,
                intConvertiblePrice: intConvertiblePrice || 0,
                intCrossoverPrice: intCrossoverPrice || 0,
                intMinivanPrice: intMinivanPrice || 0,
                intPickupPrice: intPickupPrice || 0,
                intWagonPrice: intWagonPrice || 0,
                intLuxuryCarPrice: intLuxuryCarPrice || 0,
                strSlotHour: strSlotHour || '',
                isClosed: isClosed || false,
                arrDescription: arrDescription,
                strPercentage: strPercentage || 0,
                isPremium: isPremium,
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_services"
        });
        if (!ObjServices?.insertedId) {
            throw new errHandler("SERVICE CREATION FAILED").set()
        }

        if (strArrCheckList) {
            let objCheckList = await insertOneDB({
                objDocument: {
                    strServiceId: new ObjectId(ObjServices?.insertedId),
                    strArrCheckList,
                    strCreatedBy: new ObjectId(source.strUserId),
                    strCreatedTime: new Date(source?.timReceived),
                },
                strCollection: "cln_service_checklist"
            });

            if (!objCheckList?.insertedId) {
                throw new errHandler("CHECKLIST CREATION FAILED").set()
            }
        }

        return {
            strMessage: "Success fully Added New Service"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}

const updateServiceUsecase = async function ({
    source,
    body
}) {
    try {

        let {
            strServiceId,
            strPackageId,
            strServiceName,
            strSedanUrl,
            strSuvUrl,
            strCoupeUrl,
            strHatchbackUrl,
            strConvertibleUrl,
            strCrossoverUrl,
            strMinivanUrl,
            strPickupUrl,
            strWagonUrl,
            strLuxuryCarUrl,
            intSedanPrice,
            intSUVPrice,
            intCoupePrice,
            intHatchbackPrice,
            intConvertiblePrice,
            intCrossoverPrice,
            intMinivanPrice,
            intPickupPrice,
            intWagonPrice,
            intLuxuryCarPrice,
            strSlotHour,
            isClosed,
            strArrCheckList,
            strPercentage,
            isPremium,
            arrDescription,
        } = body;

        let objDocument = {}

        if (strPackageId) objDocument.strPackageId = new ObjectId(strPackageId);
        if (strServiceName) objDocument.strServiceName = strServiceName;
        if (strSedanUrl) objDocument.strSedanUrl = strSedanUrl;
        if (strSuvUrl) objDocument.strSuvUrl = strSuvUrl;
        if (strCoupeUrl) objDocument.strCoupeUrl = strCoupeUrl;
        if (strHatchbackUrl) objDocument.strHatchbackUrl = strHatchbackUrl;
        if (strConvertibleUrl) objDocument.strConvertibleUrl = strConvertibleUrl;
        if (strCrossoverUrl) objDocument.strCrossoverUrl = strCrossoverUrl;
        if (strMinivanUrl) objDocument.strMinivanUrl = strMinivanUrl;
        if (strPickupUrl) objDocument.strPickupUrl = strPickupUrl;
        if (strWagonUrl) objDocument.strWagonUrl = strWagonUrl;
        if (strLuxuryCarUrl) objDocument.strLuxuryCarUrl = strLuxuryCarUrl;
        if (intSedanPrice !== undefined) objDocument.intSedanPrice = intSedanPrice;
        if (intSUVPrice !== undefined) objDocument.intSUVPrice = intSUVPrice;
        if (intCoupePrice !== undefined) objDocument.intCoupePrice = intCoupePrice;
        if (intHatchbackPrice !== undefined) objDocument.intHatchbackPrice = intHatchbackPrice;
        if (intConvertiblePrice !== undefined) objDocument.intConvertiblePrice = intConvertiblePrice;
        if (intCrossoverPrice !== undefined) objDocument.intCrossoverPrice = intCrossoverPrice;
        if (intMinivanPrice !== undefined) objDocument.intMinivanPrice = intMinivanPrice;
        if (intPickupPrice !== undefined) objDocument.intPickupPrice = intPickupPrice;
        if (intWagonPrice !== undefined) objDocument.intWagonPrice = intWagonPrice;
        if (intLuxuryCarPrice !== undefined) objDocument.intLuxuryCarPrice = intLuxuryCarPrice;
        if (strSlotHour !== undefined) objDocument.strSlotHour = strSlotHour;
        if (isClosed !== undefined) objDocument.isClosed = isClosed;
        if (strArrCheckList !== undefined) objDocument.strArrCheckList = strArrCheckList;
        if (strPercentage !== undefined) objDocument.strPercentage = strPercentage;
        if (isPremium !== undefined) objDocument.isPremium = isPremium;
        if (arrDescription !== undefined) objDocument.arrDescription = arrDescription;


        await updateOneKeyDB({
            _id: new ObjectId(strServiceId),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_services"
        });

        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const getListPackageUseCase = async function ({
    source,
    body
}) {
    let arrAndCondtions = [{
        chrStatus: 'N'
    }];

    let {
        page, isOffers
    } = body

    try {
        let arrOfferList = [];
        let arrQuery = [
            {
                $match: {
                    $and: arrAndCondtions
                },
            },
            {
                $lookup: {
                    from: 'cln_services',
                    localField: '_id',
                    foreignField: 'strPackageId',
                    as: 'services',
                },
            },
            {
                $unwind: "$services"
            },
            {
                $match: {
                    "services.chrStatus": 'N'
                }
            },
            {
                $lookup: {
                    from: 'cln_offer',
                    let: { serviceId: "$services._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$strServiceId", "$$serviceId"] },
                                        { $gte: ["$strExpireDate", new Date()] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                intPercentageDiscount: 1,
                                strPromoCode: 1,
                                intMinAmount: 1,
                                intMaxAmount: 1,
                                strOfferImageUrl: 1,
                                strExpireDate: 1,
                                strCreatedBy: 1,
                                strCreatedTime: 1,
                                arrBannerContent: 1,
                                strBannerImageUrl: 1,
                            }
                        }
                    ],
                    as: 'coupondata',
                },
            },
            {
                $lookup: {
                    from: 'cln_package_locations',
                    localField: '_id',
                    foreignField: 'strPackageId',
                    as: 'location',
                },
            },
            {
                $project: {
                    _id: 1,
                    strName: 1,
                    strDescription: 1,
                    strCommonImageUrl: 1,
                    strLocationType: 1,
                    strLocation: '$location.strLocation',
                    services: {
                        _id: 1,
                        strServiceName: 1,
                        strSedanUrl: 1,
                        strSuvUrl: 1,
                        strCoupeUrl: 1,
                        strHatchbackUrl: 1,
                        strConvertibleUrl: 1,
                        strCrossoverUrl: 1,
                        strMinivanUrl: 1,
                        strPickupUrl: 1,
                        strWagonUrl: 1,
                        strLuxuryCarUrl: 1,
                        intSedanPrice: 1,
                        intSUVPrice: 1,
                        intCoupePrice: 1,
                        intHatchbackPrice: 1,
                        intConvertiblePrice: 1,
                        intCrossoverPrice: 1,
                        intMinivanPrice: 1,
                        intPickupPrice: 1,
                        intWagonPrice: 1,
                        intLuxuryCarPrice: 1,
                        strSlotHour: 1,
                        isClosed: 1,
                        isPremium: 1,
                        arrDescription: 1,
                        intPercentageDiscount: { $arrayElemAt: ["$coupondata.intPercentageDiscount", 0] },
                        strPromoCode: { $arrayElemAt: ["$coupondata.strPromoCode", 0] },
                        intMinAmount: { $arrayElemAt: ["$coupondata.intMinAmount", 0] },
                        arrBannerContent: { $arrayElemAt: ["$coupondata.arrBannerContent", 0] },
                        strOfferImageUrl: { $arrayElemAt: ["$coupondata.strOfferImageUrl", 0] },
                        strBannerImageUrl: { $arrayElemAt: ["$coupondata.strBannerImageUrl", 0] }
                    },
                },
            },
            {
                $group: {
                    _id: '$_id',
                    strName: { $first: '$strName' },
                    strDescription: { $first: '$strDescription' },
                    strCommonImageUrl: { $first: '$strCommonImageUrl' },
                    strLocationType: { $first: '$strLocationType' },
                    strLocation: { $first: '$strLocation' },
                    services: { $push: '$services' }
                }
            },
            {
                $project: {
                    _id: 1,
                    strName: 1,
                    strDescription: 1,
                    strCommonImageUrl: 1,
                    strLocationType: 1,
                    strLocation: 1,
                    services: {
                        $map: {
                            input: '$services',
                            as: 'service',
                            in: {
                                _id: '$$service._id',
                                strServiceName: '$$service.strServiceName',
                                strSedanUrl: '$$service.strSedanUrl',
                                strSUVUrl: '$$service.strSuvUrl',
                                strCoupeUrl: '$$service.strCoupeUrl',
                                strHatchbackUrl: '$$service.strHatchbackUrl',
                                strConvertibleUrl: '$$service.strConvertibleUrl',
                                strCrossoverUrl: '$$service.strCrossoverUrl',
                                strMinivanUrl: '$$service.strMinivanUrl',
                                strPickupUrl: '$$service.strPickupUrl',
                                strWagonUrl: '$$service.strWagonUrl',
                                strLuxuryCarUrl: '$$service.strLuxuryCarUrl',
                                intSedanPrice: '$$service.intSedanPrice',
                                intSUVPrice: '$$service.intSUVPrice',
                                intCoupePrice: '$$service.intCoupePrice',
                                intHatchbackPrice: '$$service.intHatchbackPrice',
                                intConvertiblePrice: '$$service.intConvertiblePrice',
                                intCrossoverPrice: '$$service.intCrossoverPrice',
                                intMinivanPrice: '$$service.intMinivanPrice',
                                intPickupPrice: '$$service.intPickupPrice',
                                intWagonPrice: '$$service.intWagonPrice',
                                intLuxuryCarPrice: '$$service.intLuxuryCarPrice',
                                strSlotHour: '$$service.strSlotHour',
                                isClosed: '$$service.isClosed',
                                isPremium: '$$service.isPremium',
                                arrDescription: '$$service.arrDescription',
                                intPercentageDiscount: '$$service.intPercentageDiscount',
                                strOfferImageUrl: '$$service.strOfferImageUrl',
                                arrBannerContent: '$$service.arrBannerContent',
                                strBannerImageUrl: '$$service.strBannerImageUrl',
                                strPromoCode: '$$service.strPromoCode',
                                strCommonImageUrl: '$strCommonImageUrl',
                            }
                        }
                    },
                },
            },
            {
                $skip: page ? (page - 1) * 100 : 0
            },
            {
                $limit: 100
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_package",
        });
        if (isOffers) {

            let arrOfferQuery = [{
                $match: {
                    $and: [{
                        chrStatus: 'N'
                    }]
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
                    intMaxAmount: 1,
                    strOfferImageUrl: 1,
                    strExpireDate: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1,
                    arrBannerContent: 1,
                    strBannerImageUrl: 1,
                    serviceDetails: 1,
                    strServiceName: "$serviceDetails.strServiceName"
                }
            },
            {
                $match: {
                    strExpireDate: { $gte: new Date() }
                }

            }
            ];


            await arrList.sort((a, b) => {
                if (a.strName < b.strName) return -1;
                if (a.strName > b.strName) return 1;
                return 0;
            });

            arrOfferList = await getListDB({
                arrQuery: arrOfferQuery,
                strCollection: "cln_offer"
            });

        }
        return {
            arrList,
            arrOfferList,
            objAdBanner: { imgUrl: "https://moii.s3.me-central-1.amazonaws.com/0_Group 80we_1707724715600.png" },
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
}


const getListAllPackageUseCase = async function ({
    source,
    body
}) {
    let arrAndCondtions = [{
        chrStatus: 'N'
    }];

    let {
        page
    } = body

    try {
        let arrQuery = [
            {
                $match: {
                    $and: arrAndCondtions
                },
            },
            {
                $project: {
                    _id: 1,
                    strName: 1,
                    strDescription: 1,
                    strCommonImageUrl: 1,
                },
            },
            {
                $skip: page ? (page - 1) * 100 : 0
            },
            {
                $limit: 100
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_package",
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
}

const getListServiceUseCase = async function ({
    source,
    body
}) {

    let {
        page,
    } = body

    let arrAndCondtions = [
        { chrStatus: 'N' },
    ];

    if (body.filters) {
        let {
            strPackageId
        } = body.filters;
        arrAndCondtions.push({ strPackageId: new ObjectId(strPackageId) });
    }

    try {
        let arrQuery = [
            {
                $match: {
                    $and: arrAndCondtions
                },
            },
            {
                $lookup: {
                    from: "cln_package",
                    localField: "strPackageId",
                    foreignField: "_id",
                    as: "package",
                },
            },
            {
                $unwind: {
                    path: "$package",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    "package.chrStatus": 'N',
                },
            },
            {
                $project: {
                    _id: 1,
                    strServiceName: 1,
                    strSedanUrl: 1,
                    strSUVUrl: "$strSuvUrl",
                    strCoupeUrl: 1,
                    strPackageId: 1,
                    strHatchbackUrl: 1,
                    strConvertibleUrl: 1,
                    strCrossoverUrl: 1,
                    strMinivanUrl: 1,
                    strPickupUrl: 1,
                    strWagonUrl: 1,
                    strLuxuryCarUrl: 1,
                    intSedanPrice: 1,
                    intSUVPrice: 1,
                    intCoupePrice: 1,
                    intHatchbackPrice: 1,
                    intConvertiblePrice: 1,
                    intCrossoverPrice: 1,
                    intMinivanPrice: 1,
                    intPickupPrice: 1,
                    intWagonPrice: 1,
                    intLuxuryCarPrice: 1,
                    strSlotHour: 1,
                    arrDescription: 1,
                    isClosed: 1,
                },
            },
        ];


        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_services",
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
}


const createPackageLocationUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strPackageId,
            strLocation,
        } = body;

        let objResult = await insertOneDB({
            objDocument: {
                strLocation,
                strPackageId: new ObjectId(strPackageId),
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_locations"
        });
        if (!objResult?.insertedId) {
            //await session.abortTransaction()
            throw new errHandler("VEHICLE CREATION FAILED").set()
        }

        return {
            strMessage: "Success fully Added Package Location"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const deletePackagesUsecase = async function ({
    source,
    body
}) {
    try {

        const { id } = body

        let objDocument = {};
        objDocument.chrStatus = 'D';

        await updateOneKeyDB({
            _id: new ObjectId(id),
            objDocument: {
                strDeletedBy: new ObjectId(source.strUserId),
                strDeletedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_package"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const deleteServicesUsecase = async function ({
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
            strCollection: "cln_services"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}












module.exports = {
    createPackageUsecase,
    createServicesUsecase,
    getListAllPackageUseCase,
    getListPackageUseCase,
    updatePackageUsecase,
    createPackageLocationUsecase,
    getListServiceUseCase,
    deletePackagesUsecase,
    deleteServicesUsecase,
    updateServiceUsecase
}