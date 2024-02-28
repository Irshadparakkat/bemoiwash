const {
    errHandler, getMongoTransConnection
} = require('../../core/helpers')

const converter = require('number-to-words');

const {
    insertManyDB,
    insertOneDB,
    getListDB,
    imageUpload,
    updateOneKeyDB,
    deleteHardOneDB,
    getOneDB,
    getOneTransDB,
    insertOneTransDB,
    updateOneKeyTransDB,
    insertManyTransDB,
    generateInvoicePdf
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');
const { createNotification } = require('../../notification/usecase/notificationServices');
const { sendFirebaseNotification } = require('../../notification/usecase/firbaseUsecase');
const { createTransaction } = require('../../Transaction/usecase/transactionUsecase');
const { updateManyKeysTransDB } = require('../../common/functions/DB/mongoTransQueries');
const { generateBookingId } = require('../../booking/usecase/bookingUsecase');



const stripe = require('stripe')('sk_test_51OEx9UHFT74bwQ1W6rLSTwrGIg0daJjKHxoI8NtiK0tDOzpb6D1u6UFEjijUpzQMiPwcqPZxgl4QbjS4iRu3GGWF00e3xCVvvY');
const createPurchaseUsecase = async function ({ source, body }) {
    const { session, objConnection } = await getMongoTransConnection();

    try {
        let { strSubscriptionId,
            strVehicleId,
            IntCheckoutAmount,
            strInstruction,
            IntCoinsUsed,
            IntCoinDiscount,
            arrBookingData,
            strSecurityNo,
            IntRewardCoinCount } = body;

        let paymentIntent = await stripe.paymentIntents.create({
            amount: IntCheckoutAmount * 100,
            currency: 'aed',
        });

        IntRewardCoinCount = parseInt(IntRewardCoinCount, 10);
        IntCoinsUsed = parseInt(IntCoinsUsed, 10);


        let clientSecret = paymentIntent.client_secret;

        let UserVehicle = await getOneTransDB({
            objConnection,
            objQuery: { chrStatus: 'N', _id: new ObjectId(strVehicleId) },
            strCollection: 'cln_user_vehicle'
        });

        let strVehicle = UserVehicle.strName;
        let strVehicleModel = UserVehicle.strModelName;
        let strVehicleType = UserVehicle.strModelType;
        let strVehicleEmirate = UserVehicle.strVehicleEmirate;
        let strVehicleNumber = UserVehicle.strVehicleNumber

        let bulkInsertDocuments = [];

        for (const booking of arrBookingData) {
            const strServiceId = booking.strServiceId;
            let strPackageId = booking.strPackageId;
            let strServiceName = booking.strServiceName;
            let strPackageName = booking.strPackageName;


            // let serviceData = await getOneTransDB({
            //     objConnection,
            //     objQuery: { chrStatus: 'N', _id: new ObjectId(strServiceId) },
            //     strCollection: 'cln_services',
            // });

            // let PackageData = await getOneTransDB({
            //     objConnection,
            //     objQuery: { chrStatus: 'N', _id: new ObjectId(serviceData.strPackageId) },
            //     strCollection: 'cln_package',
            // });



            for (const serviceDetail of booking.arrServicesDetails) {
                const strScheduleId = serviceDetail.strScheduleId;
                const strAddressId = serviceDetail.strAddressId;
                const strCity = serviceDetail.strCity;
                const strAddress = serviceDetail.strAddress;
                const intZipCode = serviceDetail.intZipCode;
                const strCountry = serviceDetail.strCountry;
                const strLocation = serviceDetail.strLocation;


                let strUnitId = serviceDetail.strUnitId;

                let bookingId = generateBookingId();

                const bookingDocument = {
                    strServiceId: new ObjectId(strServiceId),
                    strPackageId: new ObjectId(strPackageId),
                    strScheduleId: strScheduleId ? new ObjectId(strScheduleId) : null,
                    strUnitId: strUnitId ? new ObjectId(strUnitId) : null,
                    strAddressId: strAddressId ? new ObjectId(strAddressId) : null,
                    strPromocode: '',
                    IntPromocodeDiscount: 0,
                    IntCoinsUsed: IntCoinsUsed || 0,
                    IntCoinDiscount: IntCoinDiscount || 0,
                    IntTotalAmount: IntCheckoutAmount || 0,
                    IntCheckoutAmount: IntCheckoutAmount || 0,
                    BookingId: bookingId,
                    IntTotalDiscount: 0,
                    strVehicle,
                    strVehicleNumber,
                    strVehicleEmirate,
                    intRating: null,
                    strFeedback: null,
                    strCity: strCity,
                    strAddress: strAddress || '',
                    intZipCode: intZipCode || '',
                    strCountry: strCountry || '',
                    strLocation: strLocation || null,
                    strSecurityNo: strSecurityNo || '',
                    strInstruction: strInstruction || '',
                    strVehicleModel: strVehicleModel || '',
                    strVehicleType: strVehicleType || '',
                    strServiceName: strServiceName || '',
                    strPackageName: strPackageName || '',
                    strType: 'subscription',
                    strStatus: 'Pending',
                    strPaymentStatus: 'Pending',
                    chrStatus: 'P',
                    paymentIntent,
                    strCreatedBy: new ObjectId(source.strUserId),
                    strUserId: new ObjectId(body.strUserId || source.strUserId),
                    strCreatedTime: new Date(source?.timReceived),
                };

                bulkInsertDocuments.push(bookingDocument);

                let objDocument1 = {}

                // objDocument1.strStatus = 'BOOKED',
                //     objDocument1.chrStatus = 'B',
                //     await updateOneKeyTransDB({
                //         _id: new ObjectId(strScheduleId),
                //         session,
                //         objConnection,
                //         strCollection: "cln_schedule",
                //         objDocument: {
                //             strUpdatedBy: new ObjectId(source.strUserId),
                //             strUpdatedTime: new Date(source.timReceived),
                //             ...objDocument1,
                //         },
                //     });
            }

        }

        let uniqueScheduleIds = Array.from(new Set(bulkInsertDocuments.map(bookingDocument => bookingDocument.strScheduleId)));

        await updateManyKeysTransDB({
            query: { _id: { $in: uniqueScheduleIds } },
            objDocument: {
                strStatus: 'BOOKED',
                chrStatus: 'B',
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
            },
            strCollection: "cln_schedule",
            objConnection,
            session,
        });


        const objResultBooking = await insertManyTransDB({
            arrInsertDocuments: bulkInsertDocuments,
            strCollection: "cln_booking",
            objConnection,
            session,
        });


        let BookingIds = Object.values(objResultBooking.result.insertedIds);

        let PurchaseResult = await insertOneTransDB({
            objDocument: {
                strSubscriptionId: new ObjectId(strSubscriptionId),
                paymentIntent,
                IntCheckoutAmount,
                strBookingIds: BookingIds.map((id) => new ObjectId(id)),
                chrStatus: 'P',
                strUserId: body?.strUserId ? new ObjectId(body?.strUserId) : new ObjectId(source?.strUserId),
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_sub_plan",
            objConnection,
            session,
        });


        if (IntCoinsUsed > 0) {
            const rewardResult = await insertOneTransDB({
                objDocument: {
                    userEarnedCoin: -IntCoinsUsed,
                    chrStatus: 'P',
                    strBookingId: new ObjectId(BookingIds[0]),
                    strCreatedBy: new ObjectId(body.strUserId || source.strUserId),
                    strCreatedTime: new Date(source?.timReceived),
                },
                strCollection: "cln_user_coin",
                objConnection,
                session
            });

            if (!rewardResult?.insertedId) {
                throw new errHandler("NO COIN IS ADDED").set();
            }
        }

        if (IntRewardCoinCount > 0) {
            let rewardResult = await insertOneTransDB({
                objDocument: {
                    userEarnedCoin: IntRewardCoinCount,
                    chrStatus: 'P',
                    strBookingId: new ObjectId(BookingIds[0]),
                    strCreatedBy: new ObjectId(body.strUserId || source.strUserId),
                    strCreatedTime: new Date(source?.timReceived),
                },
                strCollection: "cln_user_coin",
                objConnection,
                session
            })

            if (!rewardResult?.insertedId) {
                throw new errHandler("NO COIN IS  ADDED").set()
            }
        }

        await session.commitTransaction();

        return {
            strMessage: "Successfully Subscribed",
            strPurchaseId: PurchaseResult.insertedId,
            clientSecret,
            paymentIntent
        };
    } catch (error) {
        await session.abortTransaction();
        throw new errHandler(error).set();
    } finally {
        session.endSession();
    }
};


//     strServiceId: new ObjectId(strServiceId),
//     strPackageId: new ObjectId(strPackageId),
//     strScheduleId: new ObjectId(strScheduleId),
//     strAddressId: new ObjectId(strAddressId),
//     strUnitId: new ObjectId(strUnitId),
//     IntCoinsUsed: IntCoinsUsed || 0,
// IntCoinDiscount: IntCoinDiscount || 0,
//     IntCheckoutAmount: IntCheckoutAmount || 0,
//     IntTotalDiscount: IntTotalDiscount || 0,
//     strVehicle,
//     chrStatus: 'P',
//     
//     strServiceName: strServiceName || '',
//     strPackageName: strPackageName || '',
//     strSecurityNo: strSecurityNo || '',
//     strInstruction: strInstruction || '',
//     strVehicleModel: strVehicleModel || '',
//     strStatus: 'Pending',
//     strPaymentStatus: 'Pending',
//     paymentIntent,
//     intRating: null,
//     strFeedback: null,
//     strCreatedBy: new ObjectId(source.strUserId),
//     strUserId: new ObjectId(body.strUserId || source.strUserId),
//     strCreatedTime: new Date(source?.timReceived),





const checkPaymentPurchaseUsecase = async function ({
    source,
    body
}) {

    const {
        session,
        objConnection
    } = await getMongoTransConnection();


    try {

        let {
            paymentIntentId,
            strPurchaseId
        } = body;

        let planData = await getOneTransDB({
            objConnection,
            strCollection: 'cln_sub_plan',
            objQuery: {
                chrStatus: 'P',
                _id: new ObjectId(strPurchaseId)
            }
        });
        let BookingIds = planData.strBookingIds;


        let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);


        if (paymentIntent && paymentIntent.status === 'succeeded') {
            let objDocument = {
                strPaymentStatus: 'Payment Successful',
                chrStatus: 'N',
            };



            await updateOneKeyTransDB({
                _id: new ObjectId(strPurchaseId),
                session,
                objConnection,
                objDocument: {
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    ...objDocument,
                },
                strCollection: "cln_sub_plan"
            });



            const bookedUser = await getOneTransDB({
                objConnection,
                strCollection: 'cln_user',
                objQuery: {
                    _id: new ObjectId(source?.strUserId),
                }
            });


            const subscription = await getOneTransDB({
                objConnection,
                strCollection: 'cln_subscription',
                objQuery: {
                    strSubscriptionId: new ObjectId(planData?.strSubscriptionId),
                }
            });

            const invoiceDetails = {
                ClientInfo: {
                    bookingNumber: planData?.strSubscriptionId,
                    invoiceDate: source?.timReceived || '',
                    dueAmt: '',
                    bookingType: 'Subscription Booking',

                    strClientName: bookedUser.strFullName || '',
                    strClientContact: bookedUser.strMobileNo || '',
                    strAddress: '',

                },
                VehicleInfo: {
                    strVehicle: '',
                    strVehicleNumber: '',
                    strVehicleEmirate: '',
                    strVehicleModel: '',
                    strVehicleType: ''
                },
                InvoiceItems: [{
                    strServiceName: `Subscription Booking ${subscription?.strName}`,
                    intPricePerItem: planData.IntTotalAmount,
                    strCGST: ``,
                    strSGST: ``,
                    intDiscount: planData?.IntTotalDiscount,
                    intSubAmt: planData.IntCheckoutAmount
                }],
                invoiceNumber: planData?.strSubscriptionId,
                invoiceDate: source?.timReceived || '',
                objInvoice: {
                    intSubTotal: planData.IntTotalAmount,
                    intTotalPayAmt: planData.IntCheckoutAmount,
                    strTotalInWords: converter.toWords(planData.IntCheckoutAmount),
                },
                CompanyInfo: {
                    strName: 'MoiiWash',
                    strContact: 'Contact : +971 581072101',
                    strAddress: 'Dubai',
                    strPlace: 'Dubai',
                },
                objCompanyBankAcc: {
                    strAccHolder: 'Moii PVT LTD',
                    strBankName: 'Bank',
                    strAccNo: '50200073074035',
                    strIFC: ''
                }
            };


            let strFileName = `${planData?._id}+${source?.timReceived}`;

            let invoice = await generateInvoicePdf(invoiceDetails, strFileName);


            if (invoice) {
                objDocument.strInvoiceUrl = invoice;

            }

            const bookingUpdateResult = await updateManyKeysTransDB({
                objMatch: {
                    _id: { $in: BookingIds.map(id => new ObjectId(id)) }
                },
                strCollection: "cln_booking",
                session,
                objConnection,
                objDocument: {
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    ...objDocument,
                },
            });

            if (!bookingUpdateResult?.acknowledged) {
                throw new errHandler("Failed to update cln_booking collection").set();
            }


            for (const strBookingId of BookingIds) {
                let BookingData = await getOneTransDB({
                    objConnection,
                    strCollection: 'cln_booking',
                    objQuery: {
                        _id: new ObjectId(strBookingId)
                    }
                });


                let unitData = await getOneTransDB({
                    objConnection,
                    strCollection: 'cln_unit',
                    objQuery: {
                        chrStatus: 'N',
                        _id: new ObjectId(BookingData?.strUnitId)
                    }
                });

                let UnitUserDetails = await getOneTransDB({
                    objConnection,
                    strCollection: 'cln_user',
                    objQuery: {
                        chrStatus: 'N',
                        _id: new ObjectId(unitData?.strUserId)
                    }
                });

                if (UnitUserDetails) {
                    sendFirebaseNotification({
                        strFcmToken: UnitUserDetails?.strFcmToken,
                        strTittle: "New Booking",
                        strBody: `New ${BookingData?.strServiceName} is Booked`,
                        strCollapsKey: 'booking',
                        strPage: 'booking',
                        strId: strBookingId,
                    });

                    await createNotification({
                        ...source,
                        strType: 'booking',
                        createdForUserId: UnitUserDetails._id,
                        strNotification: `New Booking is created for ${BookingData?.strServiceName}`,
                    });
                }
            }


            let companyAccount = await getOneTransDB({
                objConnection,
                strCollection: 'cln_account',
                objQuery: {
                    chrStatus: 'N',
                    strAccountType: 'Company Revenue',
                }
            });


            await createTransaction({
                ...source,
                strTransactionType: 'Booking Credit Entry',
                strTransactionId: strPurchaseId,
                strDebitAcc: new ObjectId(source.strUserId),
                strCreditAcc: new ObjectId(companyAccount?._id),
                intDebitAmt: 0,
                intCreditAmt: planData?.IntCheckoutAmount,
            })

            await createTransaction({
                ...source,
                strTransactionType: 'Booking Debit Entry',
                strDebitAcc: new ObjectId(companyAccount?._id),
                strCreditAcc: new ObjectId(source.strUserId),
                strTransactionId: strPurchaseId,
                intDebitAmt: planData?.IntCheckoutAmount,
                intCreditAmt: 0
            })

            await session.commitTransaction();

            return {
                strMessage: "Payment Successful",
            };
        } else {


            for (const strBookingId of BookingIds) {


                let BookingData = await getOneTransDB({
                    objConnection,
                    strCollection: 'cln_booking',
                    objQuery: {
                        _id: new ObjectId(strBookingId)
                    }
                });

                let objDocument = {
                    strPaymentStatus: 'Payment Failed',
                    chrStatus: 'D',
                };


                await updateOneKeyTransDB({
                    _id: new ObjectId(strBookingId),
                    session,
                    objConnection,
                    objDocument: {
                        strUpdatedBy: new ObjectId(source.strUserId),
                        strUpdatedTime: new Date(source.timReceived),
                        ...objDocument,
                    },
                    strCollection: "cln_booking"
                });



                await updateOneKeyTransDB({
                    _id: new ObjectId(strPurchaseId),
                    session,
                    objConnection,
                    objDocument: {
                        strUpdatedBy: new ObjectId(source.strUserId),
                        strUpdatedTime: new Date(source.timReceived),
                        ...objDocument,
                    },
                    strCollection: "cln_sub_plan"
                });




                if (BookingData?.strScheduleId) {

                    let objDocument1 = {
                        strStatus: 'ACTIVE',
                        chrStatus: 'N',
                    };

                    await updateOneKeyTransDB({
                        _id: new ObjectId(BookingData?.strScheduleId),
                        session,
                        objConnection,
                        objDocument: {
                            strUpdatedBy: new ObjectId(source.strUserId),
                            strUpdatedTime: new Date(source.timReceived),
                            ...objDocument1,
                        },
                        strCollection: "cln_schedule"
                    });


                }

            }

            await session.commitTransaction();


            return {
                strMessage: "Payment Failed",
            };
        }
    } catch (error) {
        await session.abortTransaction();

        throw new errHandler(error).set();
    } finally {
        session.endSession();
    }
};



const isReschedulable = (booking) => {
    let currentTime = new Date();
    const scheduledStartTime = new Date(booking.scheduleDetails.dtScheduleStartDateTime);

    if (scheduledStartTime > new Date(currentTime.getTime() + 2 * 60 * 60 * 1000)) {
        return true
    }
    else {
        return false
    }

};


const getListPurchasedPlansUseCase = async function ({ source, body }) {
    let arrAndConditions = [
        {
            chrStatus: 'N'
        },
        {
            strUserId: new ObjectId(source.strUserId)
        }
    ];

    let { page } = body;

    try {
        let arrQuery = [
            {
                $match: {
                    $and: arrAndConditions
                },
            },

            {
                $lookup: {
                    from: "cln_subscription",
                    localField: "strSubscriptionId",
                    foreignField: "_id",
                    as: "subscriptionDetails"
                },
            },
            {
                $unwind: "$subscriptionDetails"
            },
            {
                $project: {
                    _id: 1,
                    strUserId: 1,
                    strSubscriptionId: 1,
                    strBookingIds: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1,
                    IntCheckoutAmount: 1,
                    strSubscriptionName: "$subscriptionDetails.strName",
                    strSubscriptionType: "$subscriptionDetails.strType",
                    intNofDays: "$subscriptionDetails.intNofDays",
                },
            },
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_sub_plan",
        });


        const currentDate = new Date();
        arrList = arrList.map(plan => {
            const createdTime = new Date(plan.strCreatedTime);
            const expirationDate = new Date(createdTime.getTime() + plan.intNofDays * 24 * 60 * 60 * 1000);
            const daysLeft = Math.ceil((expirationDate - currentDate) / (24 * 60 * 60 * 1000));

            return {
                ...plan,
                daysLeft
            };
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


const getPurchasedBookingListUsecase = async function ({
    source,
    body
}) {
    let arrAndConditions = [
        { chrStatus: 'N' },
        { strUserId: new ObjectId(source.strUserId) },
        { strType: 'subscription' }
    ];

    let {
        page,
        strBookingIds,
    } = body;

    if (strBookingIds && strBookingIds.length > 0) {
        arrAndConditions.push({
            _id: { $in: strBookingIds.map(id => new ObjectId(id)) }
        });
    }

    try {
        let arrQuery = [
            {
                $match: {
                    $and: arrAndConditions
                },
            },
            {
                $lookup: {
                    from: "cln_schedule",
                    localField: "strScheduleId",
                    foreignField: "_id",
                    as: "scheduleDetails"
                }
            },
            {
                $lookup: {
                    from: "cln_user",
                    localField: "strUserId",
                    foreignField: "_id",
                    as: "userData"
                }
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
                $lookup: {
                    from: "cln_unit",
                    localField: "strUnitId",
                    foreignField: "_id",
                    as: "unitDetails"
                }
            },
            {
                $sort: {
                    'scheduleDetails.date': 1,
                    'scheduleDetails.slot': 1
                }
            },
            {
                $project: {
                    _id: 1,
                    strServiceId: 1,
                    strVehicle: 1,
                    strPackageId: 1,
                    strServiceName: 1,
                    strPackageName: 1,
                    strVehicleType: 1,
                    strVehicleModel: 1,
                    strInstruction: 1,
                    strSecurityNo: 1,
                    strStatus: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1,
                    strInvoiceUrl: 1,
                    strPromocode: 1,
                    IntPromocodeDiscount: 1,
                    IntTotalAmount: 1,
                    IntCoinsUsed: 1,
                    IntCoinDiscount: 1,
                    IntCheckoutAmount: 1,

                    strVehicleNumber: 1,
                    strVehicleEmirate: 1,
                    intRating: 1,
                    strFeedback: 1,
                    strCity: 1,
                    strAddress: 1,
                    intZipCode: 1,
                    strCountry: 1,
                    strLocation: 1,
                    BookingId: 1,
                    IntTotalDiscount: 1,
                    strName: { $arrayElemAt: ['$userData.strName', 0] },
                    strMobileNo: { $arrayElemAt: ['$userData.strMobileNo', 0] },
                    scheduleDetails: { $arrayElemAt: ['$scheduleDetails', 0] },
                    unitDetails: { $arrayElemAt: ['$unitDetails', 0] },
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_booking"
        });



        arrList = arrList.map(booking => {
            const isReschedulableValue = booking.scheduleDetails
                ? isReschedulable(booking)
                : true;

            return {
                ...booking,
                isReschedulable: isReschedulableValue
            };
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





module.exports = {
    createPurchaseUsecase,
    checkPaymentPurchaseUsecase,
    getListPurchasedPlansUseCase,
    getPurchasedBookingListUsecase
};
