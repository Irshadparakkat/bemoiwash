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

const createUserVehicleUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strName,
            strModelName,
            strModelType,
            strVehicleEmirate,
            strVehicleNumber,
            strVehicleCode
        } = body;

        let objResult = await insertOneDB({
            objDocument: {
                strName,
                strModelName,
                strModelType,
                strVehicleEmirate,
                strVehicleNumber,
                strVehicleCode,
                strCreatedBy: new ObjectId(body.strUserId ? body.strUserId : source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_user_vehicle"
        });

        if (!objResult?.insertedId) {
            throw new errHandler("VEHICLE CREATION FAILED").set();
        }

        const addedVehicle = await getOneDB({
            strCollection: "cln_user_vehicle",
            objQuery: { _id: objResult.insertedId },
        });

        if (!addedVehicle) {
            throw new errHandler("Failed to retrieve added vehicle details").set();
        }

        return {
            strMessage: "Successfully Added New Vehicle",
            addedVehicle,
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
}




const getMonthlyTargetUsecase = async function ({
    source,
    body
}) {


    try {
        let arrQuery = [
            {
                $project: {
                    _id: 1,
                    strMonth: 1,
                    intTarget: 1
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_booking_targets"
        });

        return {
            arrList
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const deleteUservehicleUsecase = async function ({
    source,
    body
}) {
    try {
        const { strVehicleId } = body

        let objDocument = {};
        objDocument.chrStatus = 'D';

        await updateOneKeyDB({
            _id: new ObjectId(strVehicleId),
            objDocument: {
                strDeletedBy: new ObjectId(source.strUserId),
                strDeletedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_user_vehicle"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const updateMonthlyTargetUseCase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};

        let {
            intTarget,
        } = body;


        if (intTarget) objDocument.intTarget = intTarget;


        await updateOneKeyDB({
            _id: new ObjectId(body._id),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_booking_targets"
        });


        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const getPercentageValueOfMonthlyAmountWise = async function ({
    source,
    body
}) {
    try {
        const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

        // Get the target details for the current month
        let targetDetails = await getOneDB({
            strCollection: 'cln_booking_targets',
            objQuery: {
                strMonth: currentMonth
            }
        });

        if (!targetDetails) {
            throw new errHandler("Target details not found for the current month");
        }

        // Prepare aggregation pipeline to sum intCreditAmt for the current month
        let arrQuery = [
            {
                $match: {
                    $and: [
                        { chrStatus: 'N' },
                        { strTransactionType: 'Booking Credit Entry' },
                        {
                            "strCreatedTime": {
                                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                            }
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalCreditAmt: { $sum: "$intCreditAmt" }
                }
            }
        ];

        let result = await getListDB({
            arrQuery,
            strCollection: "cln_transaction"
        });

        // Extract the total credit amount from the result
        let totalCreditAmt = result.length > 0 ? result[0].totalCreditAmt : 0;

        // Calculate the percentage
        let targetAmount = parseInt(targetDetails.intTarget);
        let percentage = Math.round((totalCreditAmt / targetAmount) * 100);

        arrList = {
            totalCreditAmt,
            targetAmount,
            percentage
        }


        return {
            arrList
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};



const getDashbordSurvicesDataUsecase = async function ({
    source,
    body
}) {
    try {
        let matchConditions = {
            chrStatus: 'N',
            strPaymentStatus: 'Payment Successful'
        };


        let matchConditionsExpenses = {
            chrStatus: 'N',
        };

        let matchConditionsServices = {
            chrStatus: 'N',
        };

        if (body.month) {
            matchConditionsServices["strCreatedTime"] = {
                $gte: new Date(new Date().getFullYear(), body.month - 1, 1),
                $lt: new Date(new Date().getFullYear(), body.month, 1)
            };
            matchConditionsExpenses["strCreatedTime"] = {
                $gte: new Date(new Date().getFullYear(), body.month - 1, 1),
                $lt: new Date(new Date().getFullYear(), body.month, 1)
            };

            matchConditions["strCreatedTime"] = {
                $gte: new Date(new Date().getFullYear(), body.month - 1, 1),
                $lt: new Date(new Date().getFullYear(), body.month, 1)
            };
        } else if (body.date) {
            matchConditionsServices["strCreatedTime"] = {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), body.day),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth(), body.day + 1)
            };
            matchConditionsExpenses["strCreatedTime"] = {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), body.day),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth(), body.day + 1)
            };
            matchConditions["strCreatedTime"] = {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), body.day),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth(), body.day + 1)
            };
        } else if (body.dateRange && body.dateRange.length === 2) {
            const [startDate, endDate] = body.dateRange;
        
            matchConditionsServices["strCreatedTime"] = {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            };
            matchConditionsExpenses["strCreatedTime"] = {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            };
            matchConditions["strCreatedTime"] = {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            };
        }
        
        let arrQuery = [
            {
                $match: {
                    chrStatus: 'N',
                }
            },
            {
                $lookup: {
                    from: "cln_booking",
                    let: { serviceId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$strServiceId", "$$serviceId"] },
                                ...matchConditions
                            }
                        }
                    ],
                    as: "bookings"
                }
            },
            {
                $project: {
                    _id: 1,
                    strServiceName: 1,
                    bookingsCount: { $size: "$bookings" },
                    totalIncome: { $sum: "$bookings.IntCheckoutAmount" }
                }
            }
        ];



        let arrQueryUnit = [
            {
                $match: {
                    chrStatus: 'N',
                }
            },
            {
                $lookup: {
                    from: "cln_booking",
                    let: { unitId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$strUnitId", "$$unitId"] },
                                ...matchConditions
                            }
                        }
                    ],
                    as: "bookings"
                }
            },
            {
                $project: {
                    _id: 1,
                    strName: 1,
                    strUnitType: 1,
                    bookingsCount: { $size: "$bookings" },
                    totalIncome: { $sum: "$bookings.IntCheckoutAmount" }
                }
            }
        ];

        let arrQueryExpenses = [
            {
                $match: matchConditionsExpenses

            },
            {
                $group: {
                    _id: "$strExpenseType",
                    totalPayAmt: { $sum: "$intPayAmt" },
                    totalBalanceAmt: { $sum: "$intBalanceAmt" }
                }
            }
        ];

        let arrListServices = await getListDB({
            arrQuery,
            strCollection: "cln_services"
        });

        let arrListExpenses = await getListDB({
            arrQuery: arrQueryExpenses,
            strCollection: "cln_expenses"
        });

        let arrListUnitwise = await getListDB({
            arrQuery: arrQueryUnit,
            strCollection: "cln_unit"
        });


        let totalExpense = await getExpenseTotal(matchConditionsExpenses);


        let SubtotalIncome = await getIncomeTotal(matchConditionsExpenses);

        let subscriptionList = await getPurchasedSubscriptionsCount(matchConditionsExpenses);




        return {
            arrListServices,
            arrListExpenses,
            arrListUnitwise,
            totalExpense,
            SubtotalIncome,
            subscriptionList
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};


const getPurchasedSubscriptionsCount = async function (matchConditions) {

    let additionalMatchCondition = {
        strTransactionType: 'Expense Debit Entry'
    }

    let arrSubscriptionPurchasecounts = [
        {
            $match: {chrStatus:'N'},
        },
        
        {
            $lookup: {
                from: "cln_sub_plan",
                let: { subscriptionId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$strSubscriptionId", "$$subscriptionId"] },
                            chrStatus: 'N',
                            ...matchConditions
                        }
                    }
                ],
                as: "subscribed"
            }
        },
        {
            $project: {
                _id: 1,
                strName:1,
                strType:1,
                strCreatedTime:1,
                subsctibedCount: { $size: "$subscribed" },

            }
        }
    ];

let result = await getListDB({
    arrQuery: arrSubscriptionPurchasecounts,
    strCollection: "cln_subscription"
});

return result
};

const getExpenseTotal = async function (matchConditions) {

    let additionalMatchCondition = {
        strTransactionType: 'Expense Debit Entry'
    }

    let arrQueryExpenses = [
        {
            $match: {
                $and: [
                    matchConditions,
                    additionalMatchCondition
                ]
            }
        },
        {
            $group: {
                _id: null,
                totalExpense: { $sum: "$intDebitAmt" }
            }
        }
    ];

    let result = await getListDB({
        arrQuery: arrQueryExpenses,
        strCollection: "cln_transaction"
    });

    return result.length > 0 ? result[0].totalExpense : 0;
};

const getIncomeTotal = async function (matchConditions) {

    let additionalMatchCondition = {
        strTransactionType: 'Booking Credit Entry'
    }

    let arrQueryExpenses = [
        {
            $match: {
                $and: [
                    matchConditions,
                    additionalMatchCondition
                ]
            }
        },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: "$intCreditAmt" }
            }
        }
    ];

    let result = await getListDB({
        arrQuery: arrQueryExpenses,
        strCollection: "cln_transaction"
    });

    return result.length > 0 ? result[0].totalIncome : 0;
};



module.exports = {
    createUserVehicleUsecase,
    getMonthlyTargetUsecase,
    deleteUservehicleUsecase,
    updateMonthlyTargetUseCase,
    getPercentageValueOfMonthlyAmountWise,
    getDashbordSurvicesDataUsecase
}