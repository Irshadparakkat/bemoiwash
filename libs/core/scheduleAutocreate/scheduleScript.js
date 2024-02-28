const cron = require('node-cron');
const { getListDB, insertOneDB } = require('../../common/functions');
const { getListUnitUseCase, getScheduleByIdUseCase, getScheduleByIdForMultipleUseCase } = require('../../Units/usecase/unitUseCase');
const {
    ObjectId
} = require('mongodb');



cron.schedule('0 0 * * *', async () => {
    try {
        const allUnits = await getListUnitUseCase({
            source: {},
            body: {}
        });

        for (const unit of allUnits.arrList) {
            const { _id: strUnitId, strWorkHour } = unit;

            const latestScheduleDate = await getLatestSchedule(strUnitId);
            const nextDayDate = getNextDayDate(latestScheduleDate);

            const schedulesToInsert = await generateSchedules(strUnitId, nextDayDate, 8, 23, strWorkHour);

            await insertManyDB({
                strCollection: "cln_schedule",
                arrInsertDocuments: schedulesToInsert
            });
        }

        console.log('Scheduled task completed successfully.');
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
});



async function getLatestSchedule(strUnitId) {
    const schedules = await getScheduleByIdForMultipleUseCase({ source: {}, body: { filters: { strUnitId } } });
    const latestSchedule = schedules.arrList[schedules.arrList.length - 1];
    return latestSchedule ? latestSchedule.strDate : null;
}

function getNextDayDate(lastScheduleDate) {
    const currentDate = new Date(lastScheduleDate);
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate;
}

async function generateSchedules(strUnitId, strDate, startHour, endHour, strWorkHour) {
    const workHour = parseFloat(strWorkHour);
    const schedules = [];


    for (let currentHour = startHour; currentHour < endHour; currentHour += workHour) {
        const scheduleStartTime = `${currentHour}:00:00`;
        let nextHour = currentHour + workHour;
        if (nextHour > endHour) {
            break;
        }
        const scheduleEndTime = `${nextHour}:00:00`;

        const schedule = {
            strUnitId: new ObjectId(strUnitId),
            strDate,
            strScheduleStartTime: scheduleStartTime,
            strScheduleEndTime: scheduleEndTime,
            strStatus: 'ACTIVE'
        };

        schedules.push(schedule);
    }

    return schedules;
}

