const {
    errHandler, getMongoTransConnection,
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
    generateInvoicePdf
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');
const moment = require('moment'); // Import the moment library for date/time operations

const {
    sendFirebaseNotification
} = require('../../notification/usecase/firbaseUsecase');
const { updateManyDB } = require('../../common/functions/DB/mongoQueries');
const { createNotification } = require('../../notification/usecase/notificationServices');
const { updateManyKeysTransDB } = require('../../common/functions/DB/mongoTransQueries');
const { createTransaction } = require('../../Transaction/usecase/transactionUsecase');
const io = require('socket.io-client');
const stripe = require('stripe')('sk_test_51OEx9UHFT74bwQ1W6rLSTwrGIg0daJjKHxoI8NtiK0tDOzpb6D1u6UFEjijUpzQMiPwcqPZxgl4QbjS4iRu3GGWF00e3xCVvvY');
const socket = io('https://chat.be.moii.ae', {
    query: {
        token: 'U2FsdGVkX1+3crx3HMHRQd6aDF6MrCaoNZAx/dfM+YjAKt2PnGQl9lrOi3EgrsgGvwS6a19R5/fDkQiUsHB0tXW+GWDxBfgyrcJKBDwHhGxRzWO475iL4l+fK7ErkZROIbVjtTm957HY3qU0Zqc4prfQ0h8diOOasRJY/fwvs92cYvarF6qn+ogUtZ6FbdM3v3q1JqhsbgTKWLPYUSiefxGmRDMG9ujTRsgemi8Rt7UoyCMQIUYoIBc0fptCzLsbeb+jUTTf29xs2LBrfiFfnA0bvqOCPgrlFvmvX/ZSixoeA7bjc9dAXlBJjjug1/jIvUEUX63t8ZefcR4gmnZsp1mDbfoFnR1uVvYvMiraJ9vhow3Xb/KgKmscurra8H5dC24g5dpnqNZDo5rxCGFxWQ4w8bpnJ/s6u5+UUX7T6QclDnyIhP71s2YJJvt8UubOuSv8G5+yPGsU/OvGA6seIcFGrpUhxwa2KMwFEMv1vJv6m/uoAtTFeOxcIYXNHx7ZklafTF/1FCS6euAUvHvhwJ/BDuQ3Sixx7cgCpcEHw2WJxz6E9oyVsvAy0hKFD7AbPby5imBb21fkhcf5dWOv4n5magJTmLKfYenvFe6kIhdd17+0fbRbnJWAL4KNwcPU3waeHb4mUiNHpDxdkGs2tzMpHRE49Dz0UjVaPQNXJtdZYkUF9pnNTa9BU60jaQ4YgEfclpEtG0MQuXto9mhZejy0UGr2i+zxqvCvr5J2lF7oRxq0f9oRI2SdhNLbRQpsqdK+vRX7bhCRu3a6wIaQOKGTJprzGquBRwLM4OGn3actL8ODmaejQD4S3Gw1yP2WxYNm+oPDArwXZjUgzJaNhnDiqVhDraRsloqUigb89FDKYB0iEsg8RR8b8H/aI8N0Eqxl70GJ0qGniyiVhTGJ/h90yeOO4AwX1948vwt74F3hQ54yzrJjXd29g0HiBay7dLkwMIcUAqRtVWT5D+deOCi4ya9++YUVmFBvPbgqITjWcnN+U3BLIIlSBCpnMWZwX47C+jjBhO8u58t8azJXhcIlmaMjGfh5MWT+HMW3qDL7Z5+m5DaSz3bJRGlPD1b+8cZ0uzdIzRrOP5XvH+R1ImnFj+tS9iqaLhz7MF1sTShy7xkSm51ChYva7/Ef0OCXymOGQUvrZD/OrwAm9gGY9vIC9pHQ8FTJ+AVVJmOwNVS0sJQuNbqzBx2MLa55n93ZgmoZ9+JqZ/PXQPXDkVZPiw=='
    },
});

socket.on('connect', () => {
    console.log('Connected to the Socket.io server');

});

const { v4: uuidv4 } = require('uuid');
const { getListServiceUseCase } = require('../../Package/usecase/packageUseCase');

const generateBookingId = () => {
    const COMPANY_NAME = "MOII"; // Convert to uppercase

    const uniqueId = uuidv4().toUpperCase().slice(0, 8); // Generate UUID and convert to uppercase

    return `${COMPANY_NAME}-${uniqueId}`; // Concatenate company name and unique ID
};





const createBookingUsecase = async function ({
    source,
    body
}) {

    const {
        session,
        objConnection
    } = await getMongoTransConnection();

    try {

        let {
            strServiceId,
            strScheduleId,
            strVehicleName,
            strModelName,
            strModelType,
            strVehicleEmirate,
            strVehicleNumber,
            strUnitId,
            strVehicleId,
            strPackageId,
            strSecurityNo,
            strInstruction,
            strAddressId,
            strName,
            strAddress,
            strCity,
            intZipCode,
            strCountry,
            strPromocode,
            IntPromocodeDiscount,
            IntCoinsUsed,
            IntCoinDiscount,
            IntTotalAmount,
            IntTotalDiscount,
            IntCheckoutAmount,
            IntRewardCoinCount,
            strNewUserMobNumber,
        } = body;


        let userId = body?.strUserId ?? source?.strUserId;

        if (strNewUserMobNumber) {
            let objResultUser = await insertOneDB({
                objDocument: {
                    strName: '',
                    strFullName: '',
                    strEmail: '',
                    strType: 'USER',
                    strProfileUrl: '',
                    strHashPassword: '',
                    location: {
                        type: 'Point',
                        coordinates: null,
                    } || {},
                    strMobileNo: strNewUserMobNumber,
                    chrStatus: "N",
                    strCreatedBy: new ObjectId(source?.strUserId),
                    strCreatedTime: new Date(source?.timReceived),
                },
                strCollection: "cln_user"
            });
            userId = objResultUser?.insertedId


            let objResult = await insertOneDB({
                objDocument: {
                    strUserId: new ObjectId(userId),
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

        }


        const bookingId = generateBookingId();

        let PackageData = await getOneTransDB({
            objConnection,
            objQuery: {
                chrStatus: 'N',
                _id: new ObjectId(strPackageId)
            },
            strCollection: 'cln_package',
        });

        let strPackageName = PackageData.strName

        if (!PackageData) {
            throw new errHandler("Package Is not Available").set();
        }

        let serviceData = await getOneTransDB({
            objConnection
            , objQuery: {
                chrStatus: 'N',
                _id: new ObjectId(strServiceId)
            },
            strCollection: 'cln_services',
        });

        if (!serviceData) {
            throw new errHandler("Service is Not Available").set();
        }

        let strServiceName = serviceData.strServiceName;

        let VehicleId;

        if (!strVehicleId) {
            let objResultVehicle = await insertOneDB({
                objDocument: {
                    strName: strVehicleName,
                    strModelName,
                    strModelType,
                    strVehicleEmirate,
                    strVehicleNumber,
                    strCreatedBy: new ObjectId(userId),
                    strCreatedTime: new Date(source?.timReceived),
                },
                strCollection: "cln_user_vehicle"
            });

            VehicleId = objResultVehicle?.insertedId
        } else {
            VehicleId = strVehicleId
        }


        let UserVehicle = await getOneTransDB({
            objConnection,
            objQuery: {
                chrStatus: 'N',
                _id: new ObjectId(VehicleId)
            },
            strCollection: 'cln_user_vehicle'
        });

        if (!UserVehicle) {
            throw new errHandler("Vehicle is not getting").set();
        }

        let strVehicle = UserVehicle.strName;

        let strVehicleModel = UserVehicle.strModelName;
        let strVehicleNo = UserVehicle.strVehicleNumber;

        let strVehicleEmirates = UserVehicle.strVehicleEmirate;

        let strVehicleType = UserVehicle.strModelType;

        let city;
        let Address;
        let Zipcode;
        let Country;
        let location;

        if (strAddressId) {

            let addressData = await getOneTransDB({
                objConnection
                , objQuery: {
                    chrStatus: 'N',
                    _id: new ObjectId(strAddressId)
                },
                strCollection: 'cln_user_address',
            });

            city = addressData?.strCity;
            Address = addressData?.strAddress;
            Zipcode = addressData?.intZipCode;
            Country = addressData?.strCountry;
            location = addressData?.location || null;

        }

        let AddressId = strAddressId;

        if (!strAddressId) {
            let AddressResult = await insertOneTransDB({
                objDocument: {
                    strName,
                    strAddress,
                    strCity,
                    intZipCode,
                    strCountry,
                    strCreatedBy: new ObjectId(userId),
                    strCreatedTime: new Date(source?.timReceived),
                },
                strCollection: "cln_user_address",
                objConnection,
                session
            });

            AddressId = AddressResult?.insertedId

            city = strCity;
            Address = strAddress;
            Zipcode = intZipCode
            Country = strCountry;

        }

        IntRewardCoinCount = parseInt(IntRewardCoinCount, 10);
        IntCoinsUsed = parseInt(IntCoinsUsed, 10);

        let paymentIntent = await stripe.paymentIntents.create({
            amount: IntCheckoutAmount * 100,
            currency: 'aed',
        });

        let clientSecret = paymentIntent.client_secret;

        if(strPromocode && IntPromocodeDiscount){
            await insertOneTransDB({
                objDocument: {
                    strPromocode: strPromocode,
                    IntPromocodeDiscount: IntPromocodeDiscount ,
                    BookingId: bookingId,
                    chrStatus: source?.strType === 'ADMIN' ? 'N' : 'P',
                    paymentIntent,
                    strCreatedBy: new ObjectId(source.strUserId),
                    strUserId: new ObjectId(userId),
                    strCreatedTime: new Date(source?.timReceived),
                },
                strCollection: "cln_user_earned_offer",
                objConnection,
                session
            });
        }

        let objResult = await insertOneTransDB({
            objDocument: {
                strServiceId: new ObjectId(strServiceId),
                strPackageId: new ObjectId(strPackageId),
                strScheduleId: new ObjectId(strScheduleId),
                strUnitId: new ObjectId(strUnitId),
                strAddressId: new ObjectId(AddressId),
                strPromocode: strPromocode || '',
                IntPromocodeDiscount: IntPromocodeDiscount || 0,
                IntCoinsUsed: IntCoinsUsed || 0,
                BookingId: bookingId,
                IntCoinDiscount: IntCoinDiscount || 0,
                IntTotalAmount: IntTotalAmount || 0,
                IntCheckoutAmount: IntCheckoutAmount || 0,
                IntTotalDiscount: IntTotalDiscount || 0,
                strVehicle,
                strVehicleNumber: strVehicleNo,
                strVehicleEmirate: strVehicleEmirates,
                intRating: null,
                strFeedback: null,
                strCity: city,
                strAddress: Address,
                intZipCode: Zipcode || '',
                strCountry: Country,
                strLocation: location || null,
                strSecurityNo: strSecurityNo || '',
                strInstruction: strInstruction || '',
                strVehicleModel: strVehicleModel || '',
                strVehicleType: strVehicleType || '',
                strServiceName: strServiceName || '',
                strPackageName: strPackageName || '',
                strStatus: 'Pending',
                strPaymentStatus: 'Pending',
                chrStatus: source?.strType === 'ADMIN' ? 'N' : 'P',
                paymentIntent,
                strCreatedBy: new ObjectId(source.strUserId),
                strUserId: new ObjectId(userId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_booking",
            objConnection,
            session
        });

        let strBookingId = objResult.insertedId;

        if (IntCoinsUsed > 0) {
            const rewardResult = await insertOneTransDB({
                objDocument: {
                    userEarnedCoin: -IntCoinsUsed,
                    chrStatus: 'P',
                    strBookingId: new ObjectId(strBookingId),
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
                    strBookingId: new ObjectId(strBookingId),
                    strCreatedBy: new ObjectId(userId),
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


        let objDocument1 = {}

        objDocument1.strStatus = 'BOOKED',
        objDocument1.chrStatus = 'B',


            await updateOneKeyTransDB({
                _id: new ObjectId(strScheduleId),
                session,
                objConnection,
                strCollection: "cln_schedule",
                objDocument: {
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    ...objDocument1,
                },
            });

        if (!objResult?.insertedId) {
            throw new errHandler("BOOKING CREATION FAILED").set()
        }

        await session.commitTransaction();
        return {
            strMessage: "Success fully Created Booking",
            clientSecret,
            paymentIntent,
            strBookingId
        }
    } catch (error) {
        await session.abortTransaction();

        throw new errHandler(error).set()
    } finally {
        session.endSession();
    }

}


const checkPaymentUsecase = async function ({
    source,
    body
}) {

    const {
        session,
        objConnection
    } = await getMongoTransConnection();

    try {

        let {
            strBookingId,
            paymentIntentId,
        } = body;

        let bookingData = await getOneTransDB({
            objConnection,
            strCollection: 'cln_booking',
            objQuery: {
                chrStatus: 'P',
                _id: new ObjectId(strBookingId)
            }
        });


        let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent && paymentIntent.status === 'succeeded') {

            let objDocument = {
                strPaymentStatus: 'Payment Successful',
                chrStatus: 'N',
            };

            const bookedUser = await getOneTransDB({
                objConnection,
                strCollection: 'cln_user',
                objQuery: {
                    _id: new ObjectId(bookingData?.strUserId),
                }
            });

            const invoiceDetails = {
                ClientInfo: {
                    bookingNumber: bookingData?.BookingId,
                    invoiceDate: source?.timReceived || '',
                    dueAmt: '',
                    bookingType: 'Normal Booking',
                    strClientName: bookedUser.strFullName || '',
                    strClientContact: bookedUser.strMobileNo || '',
                    strAddress: bookingData.strAddress || '',

                },
                VehicleInfo: {
                    strVehicle: bookingData.strVehicle || '',
                    strVehicleNumber: bookingData.strVehicleNumber || '',
                    strVehicleEmirate: bookingData.strVehicleEmirate || '',
                    strVehicleModel: bookingData.strVehicleModel || '',
                    strVehicleType: bookingData.strVehicleType || ''
                },
                InvoiceItems: [{
                    strServiceName: bookingData.strServiceName,
                    intPricePerItem: bookingData.IntTotalAmount,
                    strCGST: ``,
                    strSGST: ``,
                    intDiscount: bookingData?.IntTotalDiscount,
                    intSubAmt: bookingData.IntCheckoutAmount
                }],
                invoiceNumber: bookingData?.BookingId,
                invoiceDate: source?.timReceived || '',
                objInvoice: {
                    intSubTotal: bookingData.IntTotalAmount,
                    intTotalPayAmt: bookingData.IntCheckoutAmount,
                    strTotalInWords: converter.toWords(bookingData.IntCheckoutAmount),
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


            let strFileName = `${bookingData?._id}+${source?.timReceived}`;

            let invoice = await generateInvoicePdf(invoiceDetails, strFileName);


            if (invoice) {
                objDocument.strInvoiceUrl = invoice;

            }
           await Promise.all([updateOneKeyTransDB({
                _id: new ObjectId(strBookingId),
                session,
                objConnection,
                objDocument: {
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    ...objDocument,
                },
                strCollection: "cln_booking"
            }),
            updateOneKeyTransDB({
                objMatch:{BookingId:new ObjectId(strBookingId)},
                _id: new ObjectId(strBookingId),
                session,
                objConnection,
                objDocument: {
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    ...objDocument,
                },
                strCollection: "cln_user_earned_offer"
            })])
        

            let unitData = await getOneTransDB({
                objConnection,
                strCollection: 'cln_unit',
                objQuery: {
                    chrStatus: 'N',
                    _id: new ObjectId(bookingData?.strUnitId)
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


            if (UnitUserDetails?.strFcmToken != '') {
                sendFirebaseNotification({
                    strFcmToken: UnitUserDetails?.strFcmToken,
                    strTittle: "New Booking",
                    strBody: `New ${bookingData?.strServiceName} is Booked`,
                    strCollapsKey: 'booking',
                    strPage: 'booking',
                    strId: strBookingId,
                })
                // await socket.emit('add_booking', {
                //     strTittle: "New Booking",
                //     strBody: `New ${bookingData?.strServiceName} is Booked`,
                //     strId: strBookingId,
                // });
                await createNotification({
                    ...source,
                    strType: 'booking',
                    createdForUserId: unitData?.strUserId,
                    strNotification: `New Booking is created for ${bookingData?.strServiceName}`,
                })

            }

            if (source.strType != 'ADMIN') {
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
                    strTransactionId: bookingData?._id,
                    strDebitAcc: new ObjectId(source.strUserId),
                    strCreditAcc: new ObjectId(companyAccount?._id),
                    intDebitAmt: 0,
                    intCreditAmt: bookingData?.IntCheckoutAmount
                })

                await createTransaction({
                    ...source,
                    strTransactionType: 'Booking Debit Entry',
                    strDebitAcc: new ObjectId(companyAccount?._id),
                    strCreditAcc: new ObjectId(source.strUserId),
                    strTransactionId: bookingData?._id,
                    intDebitAmt: bookingData?.IntCheckoutAmount,
                    intCreditAmt: 0
                })

            }

            await session.commitTransaction();

            return {
                strMessage: "Payment Successful",
            };
        } else {
            let objDocument = {
                strPaymentStatus: 'Payment Failed',
                chrStatus: 'D',
            };

            let objDocument1 = {
                strStatus: 'ACTIVE',
                chrStatus: 'N',
            };

            await Promise.all([updateOneKeyTransDB({
                _id: new ObjectId(strBookingId),
                session,
                objConnection,
                objDocument: {
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    ...objDocument,
                },
                strCollection: "cln_booking"
            }),
            updateOneKeyTransDB({
                objMatch:{BookingId:new ObjectId(strBookingId)},
                _id: new ObjectId(strBookingId),
                session,
                objConnection,
                objDocument: {
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    ...objDocument,
                },
                strCollection: "cln_user_earned_offer"
            }),
            updateOneKeyTransDB({
                _id: new ObjectId(bookingData?.strScheduleId),
                session,
                objConnection,
                objDocument: {
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    ...objDocument1,
                },
                strCollection: "cln_schedule"
            })])
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





const rescheduleBookingUsecase = async function ({
    source,
    body
}) {


    const {
        session,
        objConnection
    } = await getMongoTransConnection();


    try {

        let {
            strBookingId,
            strScheduleId,
            strUnitId
        } = body;

        let objBookingData = await getOneTransDB({
            objConnection,
            strCollection: 'cln_booking',
            objQuery: {
                chrStatus: 'N',
                _id: new ObjectId(strBookingId)
            }
        });

        let oldSchedule = objBookingData?.strScheduleId

        let ScheduleData = await getOneTransDB({
            objConnection,
            strCollection: 'cln_schedule',
            objQuery: {
                _id: new ObjectId(oldSchedule)
            }
        });

        if (ScheduleData) {
            if (moment(ScheduleData.dtScheduleStartDateTime).isBefore(moment().subtract(2, 'hours'))) {
                throw new errHandler("It is not reschedulable").set()
            }

            let objDocument1 = {}

            objDocument1.strStatus = 'ACTIVE',
                objDocument1.chrStatus = 'N',

                await updateOneKeyTransDB({
                    _id: new ObjectId(oldSchedule),
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





        let objDocument = {};
        if (strScheduleId) objDocument.strScheduleId = new ObjectId(strScheduleId);
        if (strUnitId) objDocument.strUnitId = new ObjectId(strUnitId);

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



        let newBookingData = await getOneTransDB({
            strCollection: 'cln_booking',
            objConnection,
            objQuery: {
                chrStatus: 'N',
                _id: new ObjectId(strBookingId)
            }
        });


        let unitData = await getOneTransDB({
            strCollection: 'cln_unit',
            objConnection,
            objQuery: {
                chrStatus: 'N',
                _id: new ObjectId(newBookingData?.strUnitId)
            }
        });

        let UnitUserDetails = await getOneTransDB({
            strCollection: 'cln_user',
            objConnection,
            objQuery: {
                chrStatus: 'N',
                strUserId: new ObjectId(unitData?.strUserId)
            }
        });


        if (UnitUserDetails) {
            sendFirebaseNotification({
                strFcmToken: UnitUserDetails?.strFcmToken,
                strTittle: "Rescheduled a Booking",
                strBody: `${newBookingData?.strServiceName} is Rescheduled`,
                strCollapsKey: 'booking',
                strPage: 'booking',
                strId: strBookingId,
            })

            await createNotification({
                ...source,
                strType: 'booking',
                createdForUserId: UnitUserDetails._id,
                strNotification: `A Booking is rescheduled ${newBookingData?.strServiceName}`,
            })
        }

        await session.commitTransaction();


        return {
            strMessage: "Success fully Re-Scheduled Booking"
        }
    } catch (error) {
        await session.abortTransaction();

        throw new errHandler(error).set()
    } finally {
        session.endSession();
    }
}



const getListBookingUseCase = async function ({
    source,
    body
}) {
    let arrAndConditions = [{
        chrStatus: 'N'
    }];



    let {
        arrFiltersReq,
        filters,
        sorter,
        pageSize,
        page,
        strStatus,
        isNoFilterList
    } = body;


    let arrServiceQuery = [
        {
            $match: { chrStatus: 'N' },
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


    let arrListService = await getListDB({
        arrQuery: arrServiceQuery,
        strCollection: "cln_services",
    });




    let arrQueryUnit = [

        {
            $match: { chrStatus: 'N' },
        },
        {
            $project: {
                _id: 1,
                strName: 1,
                strUnitType: 1,
                strWorkHour: 1,
                strServiceIds: 1,
                strUserId: 1,
                strStatus: 1,
            },
        },
    ];
    let arrListUnit = await getListDB({
        arrQuery: arrQueryUnit,
        strCollection: "cln_unit"
    });






    let objFilterList = isNoFilterList ? {} : {
        "1": [
            {
                "text": "Cancelled",
                "value": "Cancelled"
            },
            {
                "text": "Completed",
                "value": "Completed"
            },
            {
                "text": "Confirmed",
                "value": "Confirmed"
            },
            {
                "text": "Out For Service",
                "value": "Out For Service"
            },
            {
                "text": "Service Started",
                "value": "Service Started"
            },
        ],
        "3": [
            {
                "text": "Subscription",
                "value": "subscription"
            },
            {
                "text": "Normal Booking",
                "value": "normalBooking"
            },
        ],

    }
    objFilterList['4'] = [];

    objFilterList['5'] = [];


    arrListUnit.forEach(Unit => {
        objFilterList['5'].push({
            text: Unit?.strName,
            value: Unit?.strName
        });
    });
    // Iterate through each service and append its filter options to the array
    arrListService.forEach(service => {
        objFilterList['4'].push({
            text: service?.strServiceName,
            value: service?.strServiceName
        });
    });


    if (strStatus && strStatus === 'Recent') {
        arrAndConditions.push({
            $or: [{ strStatus: 'Completed' }, { strStatus: 'Cancelled' }]
        });
    } else if (strStatus && strStatus === 'Orders') {
        arrAndConditions.push({
            strStatus: { $nin: ['Completed', 'Cancelled'] }
        });
    }

    if (filters) {
        const { strStatus: filterStatus, strType: filterType, strServiceName, unitDetails } = filters;
        if (filterStatus && Array.isArray(filterStatus) && filterStatus.length > 0) {
            arrAndConditions.push({
                strStatus: { $in: filterStatus },
            });
        }
        if (filterType && Array.isArray(filterType) && filterType.length > 0) {
            if (filterStatus == 'subscription') {
                arrAndConditions.push({
                    strStatus: { $in: filterStatus },
                });
            } else {
                arrAndConditions.push({
                    strType: { $nin: ['subscription'] }
                });
            }
        }
        if (strServiceName && Array.isArray(strServiceName) && strServiceName.length > 0) {
            arrAndConditions.push({
                strServiceName: { $in: strServiceName },
            });
        }
        if (unitDetails && Array.isArray(unitDetails) && unitDetails.length > 0) {
            arrAndConditions.push({
                'unitDetails.strName': { $in: unitDetails },
            });
        }
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
                $lookup: {
                    from: "cln_user_address",
                    localField: "strAddressId",
                    foreignField: "_id",
                    as: "addressDetails"
                }
            }, {
                $sort: {
                    'strCreatedTime': -1,
                }
            },
            {
                $project: {
                    _id: 1,
                    strServiceId: 1,
                    strVehicle: 1,
                    strPackageId: 1,
                    strVehicleNumber: 1,
                    strVehicleEmirate: 1,
                    BookingId: 1,
                    strServiceName: 1,
                    strPackageName: 1,
                    strVehicleType: 1,
                    strVehicleModel: 1,
                    strInstruction: 1,
                    strSecurityNo: 1,
                    strStatus: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1,
                    strPromocode: 1,
                    strType: 1,
                    IntPromocodeDiscount: 1,
                    IntTotalAmount: 1,
                    IntCoinsUsed: 1,
                    IntCoinDiscount: 1,
                    IntCheckoutAmount: 1,
                    intRating: 1,
                    strFeedback: 1,
                    strInvoiceUrl: 1,
                    IntTotalDiscount: 1,
                    strServiceStartImageUrl: 1,
                    strServiceEndImageUrl: 1,
                    strName: { $arrayElemAt: ['$userData.strName', 0] },
                    strMobileNo: { $arrayElemAt: ['$userData.strMobileNo', 0] },
                    scheduleDetails: { $arrayElemAt: ['$scheduleDetails', 0] },
                    unitDetails: { $arrayElemAt: ['$unitDetails', 0] },
                    addressDetails: { $arrayElemAt: ['$addressDetails', 0] }
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_booking"
        });

        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            },
            objFilterList
        };
    } catch (error) {
        throw new errHandler(error).set();
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


const getUserBookingListUseCase = async function ({
    source,
    body
}) {



    let arrAndConditions = [{
        chrStatus: 'N'
    }, { strUserId: new ObjectId(source.strUserId) }];

    let {
        page,
        strStatus,
    } = body;


    if (source.strType !== 'ADMIN') {
        arrAndConditions.push({
            strType: { $ne: 'subscription' }
        });
    }



    if (strStatus && strStatus === 'Recent') {
        arrAndConditions.push({
            $or: [{ strStatus: 'Completed' }, { strStatus: 'Cancelled' }]
        });
    } else if (strStatus && strStatus === 'Orders') {
        arrAndConditions.push({
            strStatus: { $nin: ['Completed', 'Cancelled'] }
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
                    BookingId: 1,
                    strStatus: 1,
                    strCreatedBy: 1,
                    strCreatedTime: 1,
                    strPromocode: 1,
                    IntPromocodeDiscount: 1,
                    IntTotalAmount: 1,
                    IntCoinsUsed: 1,
                    IntCoinDiscount: 1,
                    IntCheckoutAmount: 1,
                    intRating: 1,
                    strFeedback: 1,
                    IntTotalDiscount: 1,
                    strCity: 1,
                    strAddress: 1,
                    strInvoiceUrl: 1,
                    intZipCode: 1,
                    strCountry: 1,
                    strLocation: 1,
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

        arrList.forEach(booking => {
            if (booking.scheduleDetails) {
                booking.scheduleDetails.strScheduleStartTime = moment(booking.scheduleDetails.strScheduleStartTime, 'HH:mm:ss').format('hh:mm A');
                booking.scheduleDetails.strScheduleEndTime = moment(booking.scheduleDetails.strScheduleEndTime, 'HH:mm:ss').format('hh:mm A');
            }
        });

        arrList = arrList.map(booking => ({
            ...booking,
            isReschedulable: isReschedulable(booking)
        }));
        ////please do the schedule 

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


const getListServiceForUnitUseCase = async function ({
    source,
    body
}) {
    let arrAndConditions = [
        { chrStatus: 'N' },
        { strUnitId: new ObjectId(body.strUnitId) },
        { strStatus: { $nin: ['Completed'] } }
    ];

    let { page } = body;



    // {
    //     $match: {
    //         $and: [
    //             ...arrAndConditions,
    //             {
    //                 $or: [
    //                     { strStatus: { $ne: 'Out For Service' } },
    //                     {
    //                         $and: [
    //                             { strStatus: 'Out For Service' },
    //                             { strUpdatedBy: new ObjectId(source.strUserId) }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // },

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
                $project: {
                    _id: 1,
                    strServiceId: 1,
                    serviceName: { $arrayElemAt: ["$serviceDetails.strServiceName", 0] },
                    strPrice: 1,
                    strVehicle: 1,
                    strStatus: 1,
                    strType: 1,
                    BookingId: 1,
                    strVehicleNumber: 1,
                    strVehicleEmirate: 1,
                    IntCheckoutAmount: 1,
                    strPaymentStatus: 1,
                    strCreatedBy: 1,
                    strInvoiceUrl: 1,
                    strCreatedTime: 1,
                    strVehicleModel: 1,
                    strVehicleType: 1,
                    strAddressId: 1,
                    strCity: 1,
                    strAddress: 1,
                    intZipCode: 1,
                    strCountry: 1,
                    strLocation: 1,
                    strName: { $arrayElemAt: ["$userData.strName", 0] },
                    strMobileNo: { $arrayElemAt: ["$userData.strMobileNo", 0] },
                    userLocation: { $arrayElemAt: ["$userData.location.coordinates", 0] },
                    scheduleDate: { $arrayElemAt: ["$scheduleDetails.strDate", 0] },
                    scheduleStartTime: { $arrayElemAt: ["$scheduleDetails.strScheduleStartTime", 0] },
                    scheduleEndTime: { $arrayElemAt: ["$scheduleDetails.strScheduleEndTime", 0] },
                }
            },
            {
                $sort: {
                    "scheduleDate": 1,
                    "scheduleStartTime": 1
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_booking"
        });

        arrList.forEach(item => {
            item.scheduleStartTime = formatTime(item.scheduleStartTime);
            item.scheduleEndTime = formatTime(item.scheduleEndTime);
        });

        return {
            arrList: arrList || [],
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};

function formatTime(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}


const updateBookingUsecase = async function ({
    source,
    body
}) {


    const {
        session,
        objConnection
    } = await getMongoTransConnection();


    try {
        let objDocument = {};

        let {
            strBookingId,
            strStatus,
            strUnitId,
            strSecurityNo,
            strAddressId,
            strServiceStartImageUrl,
            strServiceEndImageUrl,
            intRating,
            strFeedback,
            strScheduleId,
            strPaymentStatus
        } = body;

        let bookingId = strBookingId;

        if (!strBookingId) {
            bookingId = body?._id;
        }

        const objBooking = await getOneTransDB({
            objConnection,
            strCollection: 'cln_booking',
            objQuery: {
                _id: new ObjectId(bookingId),
            }
        });
        if (!objBooking)
            throw new errHandler("BOOKING NOT FOUND").set()
        if (strStatus) objDocument.strStatus = strStatus;
        if (strUnitId) objDocument.strUnitId = new ObjectId(strUnitId);
        if (strAddressId) objDocument.strAddressId = new ObjectId(strAddressId);
        if (strSecurityNo) objDocument.strSecurityNo = strSecurityNo;
        if (intRating) objDocument.intRating = intRating;
        if (strFeedback) objDocument.strFeedback = strFeedback;
        if (strPaymentStatus) objDocument.strPaymentStatus = strPaymentStatus;
        if (strScheduleId) objDocument.strScheduleId = new ObjectId(strScheduleId);
        if (strServiceStartImageUrl) objDocument.strServiceStartImageUrl = strServiceStartImageUrl;
        if (strServiceEndImageUrl) objDocument.strServiceEndImageUrl = strServiceEndImageUrl;

        if (strPaymentStatus == 'Payment Successful') {

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
                strTransactionId: objBooking?._id,
                strDebitAcc: new ObjectId(objBooking.strUserId),
                strCreditAcc: new ObjectId(companyAccount?._id),
                intDebitAmt: 0,
                intCreditAmt: objBooking?.IntCheckoutAmount
            })

            await createTransaction({
                ...source,
                strTransactionType: 'Booking Debit Entry',
                strDebitAcc: new ObjectId(companyAccount?._id),
                strCreditAcc: new ObjectId(objBooking.strUserId),
                strTransactionId: objBooking?._id,
                intDebitAmt: objBooking?.IntCheckoutAmount,
                intCreditAmt: 0
            })

            const bookedUser = await getOneTransDB({
                objConnection,
                strCollection: 'cln_user',
                objQuery: {
                    _id: new ObjectId(objBooking?.strUserId),
                }
            });

            const invoiceDetails = {
                ClientInfo: {
                    bookingNumber: objBooking?.BookingId,
                    invoiceDate: source?.timReceived || '',
                    dueAmt: '',
                    bookingType: 'Normal Booking',
                    strClientName: bookedUser.strFullName || '',
                    strClientContact: bookedUser.strMobileNo || '',
                    strAddress: objBooking.strAddress || '',

                },
                VehicleInfo: {
                    strVehicle: objBooking.strVehicle || '',
                    strVehicleNumber: objBooking.strVehicleNumber || '',
                    strVehicleEmirate: objBooking.strVehicleEmirate || '',
                    strVehicleModel: objBooking.strVehicleModel || '',
                    strVehicleType: objBooking.strVehicleType || ''
                },
                InvoiceItems: [{
                    strServiceName: objBooking.strServiceName,
                    intPricePerItem: objBooking.IntTotalAmount,

                    intDiscount: objBooking?.IntTotalDiscount,
                    intSubAmt: objBooking.IntCheckoutAmount
                }],
                invoiceNumber: objBooking?.BookingId,
                invoiceDate: source?.timReceived || '',
                objInvoice: {
                    intSubTotal: objBooking.IntTotalAmount,
                    intTotalPayAmt: objBooking.IntCheckoutAmount,
                    strTotalInWords: converter.toWords(objBooking.IntCheckoutAmount),
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


            let strFileName = `${objBooking?._id}+${source?.timReceived}`;

            let invoice = await generateInvoicePdf(invoiceDetails, strFileName);


            if (invoice) {

                objDocument.strInvoiceUrl = invoice;

            }

        }

        if (strAddressId) {
            let addressData = await getOneTransDB({
                objConnection
                , objQuery: {
                    chrStatus: 'N',
                    _id: new ObjectId(strAddressId)
                },
                strCollection: 'cln_user_address',
            });
            objDocument.strCity = addressData?.strCity;
            objDocument.strAddress = addressData?.strAddress;
            objDocument.intZipCode = addressData?.intZipCode;
            objDocument.strCountry = addressData?.strCountry;
            objDocument.location = addressData?.location

        }

        if (strScheduleId) {
            objDocument.strScheduleId = new ObjectId(strScheduleId);

            let objDocument1 = {};

            objDocument1.strStatus = 'ACTIVE',
                objDocument1.chrStatus = 'N',

                await updateOneKeyTransDB({
                    _id: new ObjectId(objBooking.strScheduleId),
                    session,
                    objConnection,
                    objDocument: {
                        strUpdatedBy: new ObjectId(source.strUserId),
                        strUpdatedTime: new Date(source.timReceived),
                        ...objDocument1,
                    },
                    strCollection: "cln_schedule"
                });

            let objDocument2 = {};

            objDocument2.strStatus = 'BOOKED',
                objDocument2.chrStatus = 'B',

                await updateOneKeyTransDB({
                    _id: new ObjectId(strScheduleId),
                    session,
                    objConnection,
                    objDocument: {
                        strUpdatedBy: new ObjectId(source.strUserId),
                        strUpdatedTime: new Date(source.timReceived),
                        ...objDocument2,
                    },
                    strCollection: "cln_schedule"
                });

        }
        if (strStatus == 'Cancelled') {
            let objMatch = {
                strCreatedBy: new ObjectId(objBooking.strUserId),
                bookingId: new ObjectId(bookingId),
            }
            let objReward = await updateManyKeysTransDB({
                objMatch,
                session,
                objConnection,
                objDocument: {
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    chrStatus: 'P',
                },
                strCollection: "cln_user_coin"
            });
            if (!objReward) {
                throw new errHandler("Reward Updation failed").set()
            }

            let objDocument1 = {};

            objDocument1.strStatus = 'ACTIVE',
                objDocument1.chrStatus = 'N',

                await updateOneKeyTransDB({
                    _id: new ObjectId(objBooking.strScheduleId),
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


        if (strStatus == 'Completed') {
            let objMatch = {
                strCreatedBy: objBooking.strUserId,
                strBookingId: new ObjectId(bookingId),
            }
            let objReward = await updateManyKeysTransDB({
                objMatch,
                session,
                objConnection,
                objDocument: {
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    chrStatus: 'N',
                },
                strCollection: "cln_user_coin"
            });
            if (!objReward) {
                throw new errHandler("Reward Updation failed").set()
            }

        }

        let objResult = await updateOneKeyTransDB({
            _id: new ObjectId(bookingId),
            session,
            objConnection,
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_booking"
        });
        if (!objResult) {
            throw new errHandler("Updation failed").set()
        }
        const objUser = await getOneTransDB({
            objConnection,
            strCollection: 'cln_user',
            objQuery: {
                _id: new ObjectId(objBooking?.strUserId),
            }
        });

        let strTittle, strBody
        if (objUser?.strFcmToken) {
            switch (strStatus) {
                case "Confirmed":
                    strTittle = `Booking is confirmed`
                    strBody = `Your ${objBooking.strServiceName} service Booking is confirmed`
                    break;
                case "Out For Service":
                    strTittle = `Out for Service`
                    strBody = `Our Service team will reachout  you soon`
                    break;
                case "Service Started":
                    strTittle = `Start service`
                    strBody = `Our Service team started on ${objBooking.strServiceName}`
                    break;

                case "Completed":
                    strTittle = `Completed`
                    strBody = `Our Service team completed the ${objBooking.strServiceName}`
                    break;
                default:
                    break;
            }
            sendFirebaseNotification({
                strFcmToken: objUser?.strFcmToken,
                strTittle,
                strBody,
                strCollapsKey: 'booking',
                strPage: 'booking',
                strId: bookingId,
            })

            await createNotification({
                ...source,
                strType: 'booking',
                createdForUserId: objUser?._id,
                strNotification: `Booking is ${strTittle} by ${strBody}`,
            })

        }


        await session.commitTransaction();

        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        await session.abortTransaction();
        throw new errHandler(error).set()
    } finally {
        session.endSession();
    }
}




module.exports = {
    createBookingUsecase,
    getListBookingUseCase,
    updateBookingUsecase,
    checkPaymentUsecase,
    rescheduleBookingUsecase,
    getListServiceForUnitUseCase,
    getUserBookingListUseCase,
    generateBookingId

}