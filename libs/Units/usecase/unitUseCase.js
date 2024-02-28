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
const { updateManyDB } = require('../../common/functions/DB/mongoQueries');

const createUnitUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strName,
            strUserId,
            strServiceIds,
            strUnitType,
            strWorkHour
        } = body;

        const workHour = parseFloat(strWorkHour);
        if (isNaN(workHour) || workHour <= 0) {
            throw errHandler("Invalid work hour value").set();
        }

        let objResult = await insertOneDB({
            objDocument: {
                strName,
                strUnitType,
                strServiceIds: strServiceIds.map(id => new ObjectId(id)),
                strWorkHour,
                strStatus: 'Active',
                strUserId: new ObjectId(strUserId),
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_unit"
        });

        if (!objResult?.insertedId) {
            throw errHandler("UNIT CREATION FAILED").set();
        }

        const strUnitId = objResult.insertedId;
        const startHour = 8;
        const endHour = 23;

        const endDate = new Date(source.timReceived);
        endDate.setDate(endDate.getDate() + 29);

        const scheduleDocuments = [];


      

        for (let currentDate = new Date(source.timReceived); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {

            for (let currentHour = startHour; currentHour < endHour; currentHour += workHour) {
                const scheduleStartTime = `${currentHour}:00:00`;
                let nextHour = currentHour + workHour;
                if (nextHour > endHour) {
                    break;
                }
                const scheduleEndTime = `${nextHour}:00:00`;

                const currentDateCopy = new Date(currentDate);


                const actualScheduleStart = new Date(Date.UTC(currentDateCopy.getUTCFullYear(), currentDateCopy.getUTCMonth(), currentDateCopy.getUTCDate()));
                actualScheduleStart.setUTCHours(currentHour, 0, 0, 0);


                scheduleDocuments.push({
                    strUnitId: new ObjectId(strUnitId),
                    strDate: currentDateCopy,
                    strScheduleStartTime: scheduleStartTime,
                    strScheduleEndTime: scheduleEndTime,
                    strStatus: 'ACTIVE',
                    chrStatus: 'N',
                    dtScheduleStartDateTime: actualScheduleStart
                });

            }
        }


        await insertManyDB({
            strCollection: "cln_schedule",
            arrInsertDocuments: scheduleDocuments,
        });

        const insertedData = await getOneDB({
            strCollection: "cln_unit",
            objQuery: { _id: objResult.insertedId },
        });


        return {
            strMessage: "Successfully Added New Unit and Created 7-Day Schedule",
            ...insertedData
        }
    } catch (error) {
        throw new errHandler(error).set();
    }
}


const updateUnitUsecase = async function ({
    source,
    body
}) {
    try {
        let objDocument = {};

        let {
            strUnitId,
            strName,
            strUserId,
            strServiceIds,
            strUnitType,
            strStatus,
            strWorkHour
        } = body;
        const objBooking = await getOneDB({
            strCollection: 'cln_unit',
            objQuery: {
                _id: new ObjectId(strUnitId),
            }
        });
        if (!objBooking)
            throw new errHandler("UNIT NOT FOUND").set()
        if (strName) objDocument.strName = strName;
        if (strUnitId) objDocument.strUnitId = strUnitId;
        if (strUserId) objDocument.strUserId = new ObjectId(strUserId);
        if (strServiceIds) objDocument.strServiceIds = strServiceIds.map(id => new ObjectId(id));
        if (strUnitType) objDocument.strUnitType = strUnitType;
        if (strWorkHour) objDocument.strWorkHour = strWorkHour;

        if (strStatus == 'Blocked') {
            objDocument.strStatus = strStatus;
            objDocument.chrStatus = 'B'

        }
        if (strStatus == 'Active') {
            objDocument.strStatus = strStatus;
            objDocument.chrStatus = 'N'
        }

        let objResult = await updateOneKeyDB({
            _id: new ObjectId(strUnitId),
            objDocument: {
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                ...objDocument,
            },
            strCollection: "cln_unit"
        });
        if (!objResult) {
            throw new errHandler("Updation failed").set()
        }
        return {
            strMessage: "Successfully updated",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const createScheduleUseCase = async function ({ source, body }) {
    try {
        const {
            strUnitId,
            strDate,
            strScheduleStartTime,
            strScheduleEndTime,
            isForallDays
        } = body;


        if (!isForallDays) {


            const currentDateCopy = new Date(strDate);
            const actualScheduleStart = new Date(
                Date.UTC(
                    currentDateCopy.getUTCFullYear(),
                    currentDateCopy.getUTCMonth(),
                    currentDateCopy.getUTCDate()
                )
            );
            actualScheduleStart.setUTCHours(parseInt(strScheduleStartTime.split(":")[0], 10), 0, 0, 0);

            const scheduleData = {
                strUnitId: new ObjectId(strUnitId),
                strDate: new Date(strDate),
                strScheduleStartTime: strScheduleStartTime,
                strScheduleEndTime: strScheduleEndTime,
                dtScheduleStartDateTime: actualScheduleStart,
                strStatus: 'ACTIVE',
                chrStatus: 'N', // Assuming chrStatus is always 'N'
            };


            const insertedSchedule = await insertOneDB({
                objDocument: scheduleData,
                strCollection: "cln_schedule"
            });

            if (!insertedSchedule?.insertedId) {
                throw new errHandler("SCHEDULE CREATION FAILED").set();
            }

            return {
                strMessage: "Successfully Added New Schedule"
            };

        } else {
            const currentDate = new Date(strDate);
            const endDate = await findLastScheduleDate(strUnitId); // Replace this with your logic to find the last schedule date

            const schedulesToInsert = getDatesInRange(currentDate, endDate).map((date) => {
                const currentDateCopy = new Date(date);
                const actualScheduleStart = new Date(
                    Date.UTC(
                        currentDateCopy.getUTCFullYear(),
                        currentDateCopy.getUTCMonth(),
                        currentDateCopy.getUTCDate()
                    )
                );
                actualScheduleStart.setUTCHours(parseInt(strScheduleStartTime.split(":")[0], 10), 0, 0, 0);

                return {
                    strUnitId: new ObjectId(strUnitId),
                    strDate: currentDateCopy,
                    strScheduleStartTime: strScheduleStartTime,
                    strScheduleEndTime: strScheduleEndTime,
                    dtScheduleStartDateTime: actualScheduleStart,
                    strStatus: 'ACTIVE',
                    chrStatus: 'N', // Assuming chrStatus is always 'N'
                };
            });

            await insertManyDB({
                strCollection: "cln_schedule",
                arrInsertDocuments: schedulesToInsert
            });

            return {
                strMessage: `Successfully Added Schedules for All Days (${schedulesToInsert.length} days)`
            };
        }

    } catch (error) {
        throw new errHandler(error).set();
    }
}


//////

async function findLastScheduleDate(strUnitId) {
    const latestSchedule = await getLatestSchedule(strUnitId);
    return latestSchedule ? new Date(latestSchedule) : new Date();
}

function getDatesInRange(startDate, endDate) {
    const dates = [];
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date));
    }
    return dates;
}

async function getLatestSchedule(strUnitId) {
    const schedules = await getScheduleByIdForMultipleUseCase({ source: {}, body: { filters: { strUnitId } } });
    const latestSchedule = schedules.arrList[schedules.arrList.length - 1];
    return latestSchedule ? latestSchedule.strDate : null;
}


const createUnitLocationUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strUnitId,
            strLocation,
        } = body;

        let objResult = await insertOneDB({
            objDocument: {
                strLocation,
                strUnitId: new ObjectId(strUnitId),
                strCreatedBy: new ObjectId(source.strUserId),
                strCreatedTime: new Date(source?.timReceived),
            },
            strCollection: "cln_unit_location"
        });
        if (!objResult?.insertedId) {

            throw new errHandler("UNIT LOCATION CREATION FAILED").set()
        }

        return {
            strMessage: "Success fully Added New Unit Location"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}




const getListUnitUseCase = async function ({
    source,
    body
}) {
    let {
        page,
    } = body;

  
    try {
        let arrQuery = [
            
           
            {
                $match: {
                    chrStatus: { $in: ['N', 'B'] } 
                },
            },
            {
                $lookup: {
                    from: 'cln_user',
                    localField: 'strUserId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'cln_services',
                    localField: 'strServiceIds',
                    foreignField: '_id',
                    as: 'services',
                },
            },
            {
                $unwind: {
                    path: '$services',
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $match: {
                    $and: [
                        { 'services.chrStatus': 'N' },
                    ],
                },
            },

            {
                $group: {
                    _id: '$_id',
                    strName: { $first: '$strName' },
                    strStatus: { $first: '$strStatus' },
                    strUnitType: { $first: '$strUnitType' },
                    strWorkHour: { $first: '$strWorkHour' },
                    strServiceIds: { $first: '$strServiceIds' },
                    strUserIds: { $first: '$strUserIds' },
                    services: { $addToSet: '$services' },
                },
            },
            {
                $project: {
                    _id: 1,
                    strName: 1,
                    strUnitType: 1,
                    strWorkHour: 1,
                    strServiceIds: 1,
                    strUserIds: 1,
                    strStatus: 1,
                    services: 1,
                },
            },
        ];
        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_unit"
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






const getScheduleListUseCase = async function ({ source, body }) {
    try {
        let currentTime = new Date(source.timReceived);

        currentTime.setHours(currentTime.getHours() + 1);

        let arrAndCondtions = [
            {
                chrStatus: 'N'
            },
            {
                'unitDetails.chrStatus': 'N' 
            },
            {
                dtScheduleStartDateTime: { $gte: currentTime }
            }
        ];


        if (body.filterArrSheduleIds && body.filterArrSheduleIds.length > 0) {
            arrAndCondtions.push({
                _id: { $nin: body.filterArrSheduleIds.map(id => new ObjectId(id)) }
            });
        }

        if (body.strServiceId) {
            arrAndCondtions.push({
                'unitDetails.strServiceIds': {
                    $in: [new ObjectId(body.strServiceId)]
                }
            });
        }

        let arrQuery = [
            {
                $lookup: {
                    from: 'cln_unit',
                    localField: 'strUnitId',
                    foreignField: '_id',
                    as: 'unitDetails'
                },
            },
            {
                $unwind: { path: '$unitDetails', preserveNullAndEmptyArrays: true },
            },
            {
                $match: {
                    $and: arrAndCondtions
                },
            },
            {
                $project: {
                    _id: 1,
                    strStatus: 1,
                    strUnitId: 1,
                    strUnitName: '$unitDetails.strName',
                    strUnitType: '$unitDetails.strUnitType',
                    strDate: 1,
                    strScheduleStartTime: 1,
                    strScheduleEndTime: 1,
                }
            },
            {
                $sort: {
                    strDate: 1,
                    _id: 1,
                },
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_schedule"
        });

        const groupedData = arrList.reduce((result, item) => {
            const date = item.strDate.toDateString();
            if (!result[date]) {
                result[date] = {
                    date: item.strDate,
                    slots: [],
                };
            }
            const startTime = formatTime(item.strScheduleStartTime);
            const endTime = formatTime(item.strScheduleEndTime);

            const isSlotExists = result[date].slots.some((slot) =>
                slot.startTime === startTime && slot.endTime === endTime
            );

            if (!isSlotExists) {
                result[date].slots.push({
                    strScheduleID: item._id,
                    startTime,
                    endTime,
                    unitName: item.strUnitName,
                    strUnitId: item.strUnitId,
                    unitType: item.strUnitType || '',
                    slotDate: item.strDate,

                });
            }
            return result;
        }, {});

        const groupedArray = Object.values(groupedData);

        return {
            arrList: groupedArray
        };
    } catch (error) {
        throw error;
    }
}



function formatTime(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}


const getScheduleByIdUseCase = async function ({ source, body }) {
    try {
        let { page } = body;
        let { strUnitId, date } = body.filters;

        const currentDate = date || new Date().toISOString().split('T')[0];


        const arrAndConditions = [
            {
                $or: [
                    { chrStatus: 'N' },
                    { chrStatus: 'B' },
                ]
            },
            {
                strUnitId: new ObjectId(strUnitId)
            },
            {
                $expr: {
                    $eq: [
                        { $dateToString: { format: "%Y-%m-%d", date: "$strDate" } },
                        currentDate
                    ]
                }
            }
        ];

        let arrQuery = [
            {
                $lookup: {
                    from: 'cln_unit',
                    localField: 'strUnitId',
                    foreignField: '_id',
                    as: 'unitDetails'
                },
            },
            {
                $unwind: { path: '$unitDetails', preserveNullAndEmptyArrays: true },
            },
            {
                $match: {
                    $and: arrAndConditions
                },
            },
            {
                $project: {
                    _id: 1,
                    strStatus: 1,
                    strUnitId: 1,
                    strUnitName: '$unitDetails.strName',
                    strUnitType: '$unitDetails.strUnitType',
                    strDate: 1,
                    strScheduleStartTime: 1,
                    strScheduleEndTime: 1,
                    dtScheduleStartDateTime: 1,
                }
            },
            {
                $sort: {
                    dtScheduleStartDateTime: 1,
                },
            },
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_schedule"
        });

        arrList = arrList.map(item => ({
            ...item,
            strScheduleStartTime: formatTime(item.strScheduleStartTime),
            strScheduleEndTime: formatTime(item.strScheduleEndTime),
        }));


        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        };
    } catch (error) {
        throw error;
    }
}


const getScheduleByIdForMultipleUseCase = async function ({ source, body }) {
    try {
        let { page } = body;
        let { strUnitId, date } = body.filters;


        const arrAndConditions = [
            {
                $or: [
                    { chrStatus: 'N' },
                    { chrStatus: 'B' },
                ]
            },
            {
                strUnitId: new ObjectId(strUnitId)
            },
        ];

        let arrQuery = [
            {
                $lookup: {
                    from: 'cln_unit',
                    localField: 'strUnitId',
                    foreignField: '_id',
                    as: 'unitDetails'
                },
            },
            {
                $unwind: { path: '$unitDetails', preserveNullAndEmptyArrays: true },
            },
            {
                $match: {
                    $and: arrAndConditions
                },
            },
            {
                $project: {
                    _id: 1,
                    strStatus: 1,
                    strUnitId: 1,
                    strUnitName: '$unitDetails.strName',
                    strUnitType: '$unitDetails.strUnitType',
                    strDate: 1,
                    strScheduleStartTime: 1,
                    strScheduleEndTime: 1,
                    dtScheduleStartDateTime: 1,
                }
            },
            {
                $sort: {
                    dtScheduleStartDateTime: 1,
                },
            },
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_schedule"
        });

        arrList = arrList.map(item => ({
            ...item,
            strScheduleStartTime: formatTime(item.strScheduleStartTime),
            strScheduleEndTime: formatTime(item.strScheduleEndTime),
        }));


        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        };
    } catch (error) {
        throw error;
    }
}


const getListUnitLocationUseCase = async function ({ source, body }) {
    try {


        let { page } = body

        let {
            strUnitId
        } = body.filters;

        const arrAndCondtions = [
            {
                chrStatus: 'N'
            },
            {
                strUnitId: new ObjectId(strUnitId)
            }
        ];

        let arrQuery = [
            {
                $lookup: {
                    from: 'cln_unit',
                    localField: 'strUnitId',
                    foreignField: '_id',
                    as: 'unitDetails'
                },
            },
            {
                $unwind: { path: '$unitDetails', preserveNullAndEmptyArrays: true },
            },
            {
                $match: {
                    $and: arrAndCondtions
                },
            },
            {
                $project: {
                    _id: 1,
                    strLocation: 1,
                    strUnitName: '$unitDetails.strName',
                    strUnitType: '$unitDetails.strUnitType',
                }
            },
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_unit_location"
        });

        return {
            arrList,
            pagination: body.pagination || {
                page: page || 1,
                count: 100
            }
        };
    } catch (error) {
        // Handle errors here, but do not invoke errHandler as a constructor
        throw error;
    }
}



const getUnitByIdUsecase = async function ({
    source,
    body
}) {
    try {
        const objUnit = await getOneDB({
            strCollection: 'cln_unit',
            objQuery: {
                chrStatus: 'N',
                strUserId: new ObjectId(source?.strUserId)
            }
        });

        return {
            ...objUnit
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



const deleteUnitLocationUsecase = async function ({
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
            strCollection: "cln_unit_location"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const deleteScheduleUseCase = async function ({
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
            strCollection: "cln_schedule"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}




const updateScheduleUseCase = async function ({
    source,
    body
}) {
    try {
        const { strScheduleId, strStatus, arrScheduleIds } = body



        let objDocument = {};

        if (strStatus == 'BOOKED' || strStatus == 'BLOCKED') {
            objDocument = {
                ...objDocument,
                chrStatus: 'B'
            }
        } else if (strStatus == 'ACTIVE'
        ) {
            objDocument = {
                ...objDocument,
                chrStatus: 'N'
            }
        } else {
            objDocument = {
                ...objDocument,
                chrStatus: 'D'
            }
        }


        if (arrScheduleIds) {

            await updateManyDB({
                strCollection: 'cln_schedule',
                objMatch: { _id: { $in: arrScheduleIds.map(id => new ObjectId(id)) } },
                objDocument: {
                    strStatus: strStatus,
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    ...objDocument,
                }
            });



            return {
                strMessage: "Successfully Updated",
            }


        }
        else {

            await updateOneKeyDB({
                _id: new ObjectId(strScheduleId),
                objDocument: {
                    strStatus: strStatus,
                    strUpdatedBy: new ObjectId(source.strUserId),
                    strUpdatedTime: new Date(source.timReceived),
                    ...objDocument,
                },
                strCollection: "cln_schedule"
            });

            return {
                strMessage: "Successfully Updated",
            }

        }

    } catch (error) {
        throw new errHandler(error).set()
    }
}


const deleteUnitUseCase = async function ({
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
            strCollection: "cln_unit"
        });

        return {
            strMessage: "Successfully Deleted",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}



module.exports = {
    createUnitUsecase,
    updateUnitUsecase,
    createUnitLocationUsecase,
    getListUnitUseCase,
    getScheduleListUseCase,
    getScheduleByIdUseCase,
    getListUnitLocationUseCase,
    deleteUnitLocationUsecase,
    createScheduleUseCase,
    deleteScheduleUseCase,
    deleteUnitUseCase,
    getUnitByIdUsecase,
    updateScheduleUseCase,
    getScheduleByIdForMultipleUseCase
}