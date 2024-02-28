const {
    errHandler,
} = require('../../core/helpers')
const {
    insertManyDB,
    insertOneDB,
    getListDB,
    imageUpload,
    updateOneKeyDB,
    getOneDB
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');
const { updateManyDB } = require('../../common/functions/DB/mongoQueries');

const getListChatHistoryUsecase = async function ({
    source,
    body
}) {
    try {
        let strSearch = body.strSearch;
        let arrQuery = [

            {
                $lookup: {
                    from: "cln_user",
                    localField: "strUserId",
                    foreignField: "_id",
                    as: "objUser"
                }
            },
            {
                $lookup: {
                    from: "cln_user",
                    localField: "strChatId",
                    foreignField: "_id",
                    as: "objChatUser"
                }
            },
            {
                $sort: {
                    strCreatedTime: -1
                }
            },
            {

                $match: {
                    $and: [
                        {
                            chrStatus: 'N'
                        },
                        {
                            strType: 'private'
                        },
                        {
                            $or: [{
                                strUserId: 'Admin'
                            },
                            {
                                strChatId: 'Admin',
                            },
                            ],
                        }
                    ],
                },
            },

            {
                $project: {
                    strType: 1,
                    strChatId: {
                        $cond: [{
                            $eq: ['$strChatId', 'Admin']
                        }, '$strUserId', '$strChatId']
                    },
                    strMessage: 1,
                    strIconURL: {
                        $cond: [{
                            $eq: ['$strUserId', 'Admin']
                        },
                        {
                            $ifNull: [{
                                $arrayElemAt: ['$objChatUser.strProfileUrl', 0]
                            },
                                "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                            ]
                        },
                        {
                            $ifNull: [{
                                $arrayElemAt: ['$objUser.strProfileUrl', 0]
                            },
                                "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                            ]
                        }
                        ]
                    },
                    strMessageId: '$_id',
                    strCreatedTime: {
                        $dateToString: {
                            format: "%H:%M",
                            date: "$strCreatedTime"
                        }
                    },
                    strName: {
                        $cond: [{
                            $eq: ['$strUserId', 'Admin']
                        },
                        {
                            $arrayElemAt: ['$objChatUser.strName', 0]
                        },
                        {
                            $arrayElemAt: ['$objUser.strName', 0]
                        }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [{
                            $eq: ['$strChatId', 'Admin']
                        },
                            '$strUserId',
                            '$strChatId',
                        ],
                    },
                    strName: {
                        $first: '$strName'
                    },
                    strType: {
                        $first: '$strType'
                    },
                    strMessage: {
                        $first: '$strMessage'
                    },
                    strChatId: {
                        $first: '$strChatId'
                    },
                    strCreatedTime: {
                        $first: '$strCreatedTime'
                    },
                    strIconURL: {
                        $first: '$strIconURL'
                    },
                    strMessageId: {
                        $first: '$strMessageId'
                    }
                }
            }
        ];

        let arrGroupQuery = [{
            $lookup: {
                from: 'cln_group_users',
                localField: '_id',
                foreignField: 'strGroupId',
                as: 'groupUser'
            }
        },
        {
            $match: {

                $and: [{
                    chrStatus: 'N'
                },
                {
                    'groupUser.strUserId': new ObjectId(source.strUserId)
                }
                ],
            },
        },

        {
            $lookup: {
                from: "cln_messages",
                let: {
                    strChatId: "$_id"
                },
                pipeline: [{
                    $match: {
                        strType: 'group',
                        $expr: {
                            $eq: ["$strChatId", "$$strChatId"]
                        },
                    },
                },
                {
                    $sort: {
                        strCreatedTime: -1
                    },
                },
                {
                    $limit: 1,
                },
                ],
                as: "objMessage",
            },
        },
        {
            $project: {
                strType: {
                    $arrayElemAt: ['$objMessage.strType', 0]
                },
                strChatId: {
                    $arrayElemAt: ['$objMessage.strChatId', 0]
                },
                strMessage: {
                    $arrayElemAt: ['$objMessage.strMessage', 0]
                },
                strIconURL: {
                    $ifNull: ['$strIconURL',
                        "https://as1.ftcdn.net/v2/jpg/03/14/44/10/1000_F_314441066_71MAdbGS0XiIr1vxgIyGJEZCIHebslTp.jpg"
                    ]

                },
                strMessageId: {
                    $arrayElemAt: ['$objMessage._id', 0]
                },
                strCreatedTime: {
                    $dateToString: {
                        format: "%H:%M",
                        date: {
                            $arrayElemAt: ['$objMessage.strCreatedTime', 0]
                        },
                    }
                },
                strName: '$strGroupName'
            }
        }
        ];
        if (strSearch) {
            arrGroupQuery[1].$match.$and.push({ strGroupName: { $regex: strSearch, $options: 'i' } });
            // arrQuery[2].$match.$and.push({$or:[{

            // }]})
        }
        let [arrPrivateList, arrGroupList] = await Promise.all([getListDB({
            arrQuery,
            strCollection: "cln_messages"
        }), getListDB({
            arrQuery: arrGroupQuery,
            strCollection: "cln_group"
        })]);

        if (!arrPrivateList?.length && !arrGroupList?.length) {
            return {
                arrList: []
            }
        }
        if (!arrPrivateList?.length) {
            return {
                arrList: arrGroupList || []
            }
        }
        if (!arrGroupList?.length) {
            return {
                arrList: arrPrivateList || []
            }
        }
        let objResults = {};

        await arrPrivateList.forEach(objPrivate => {
            objResults[objPrivate?.strMessageId] = objPrivate;
        });
        await arrGroupList.forEach(objGroup => {
            objResults[objGroup?.strMessageId] = objGroup;
        });
        console.log("objResults", Object.keys(objResults).sort().reverse());
        delete objResults['undefined'];
        let arrList = []
        await Object.keys(objResults).sort().reverse().forEach(async key => {
            await arrList.push(objResults[key]);
        });

        return {
            arrList
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
};

const getListChatMessagesUsecase = async function ({ source, body }) {
    try {
        const { strChatId, strSearch = '', intPageCount = 1, intPageSize = 30 } = body;
        const { strType, strUserId } = source;

        let matchCriteria = {
            chrStatus: 'N',
        };

        let strMessageType;
        if (strMessageType === 'document') {
            matchCriteria.strMessageType = 'document';
            matchCriteria.strFileName = { $regex: strSearch, $options: 'i' };
        } else if (strMessageType === 'text') {
            matchCriteria.strMessageType = 'text';
            matchCriteria.strMessage = { $regex: strSearch, $options: 'i' };
        } else if (strMessageType === 'image') {
            matchCriteria.strMessageType = 'image';
        } else if (strMessageType === 'audio') {
            matchCriteria.strMessageType = 'audio';
        }

        const chatIdObject = new ObjectId(strChatId);

        const orCondition = [];

        if (strType === 'ADMIN') {
            orCondition.push({
                $and: [
                    { "strChatId": chatIdObject },
                    { "strUserId": 'Admin' },
                    { "chrChatIdStatus": 'N' },
                ],
            }, {
                $and: [
                    { "strChatId": 'Admin' },
                    { "strUserId": chatIdObject },
                    { "chrChatIdStatus": 'N' },
                ],
            });
        } else {
            orCondition.push({
                $and: [
                    { "strChatId": 'Admin' },
                    { "strUserId": new ObjectId(strUserId) },
                    { "chrChatIdStatus": 'N' },
                ],
            }, {
                $and: [
                    { "strChatId": new ObjectId(strUserId) },
                    { "strUserId": 'Admin' },
                    { "chrChatIdStatus": 'N' },

                ],
            });
        }


        const arrQuery = [
            {
                $match: {
                    $or: orCondition,
                },
            },
            {
                $sort: {
                    strCreatedTime: 1,
                },
            },
            {
                $project: {
                    _id: 1,
                    strType: 1,
                    strMessage: 1,
                    strMessageType: 1,
                    strUserId: 1,
                    strUrl: 1,
                    strFileName: 1,
                    strLongitude: 1,
                    strLatitude: 1,
                    strContactName: 1,
                    strContactNumbers: 1,
                    strCreatedTime: {
                        $dateToString: {
                            format: "%H:%M",
                            date: "$strCreatedTime",
                        },
                    },
                    strCreatedDate: "$strCreatedTime"
                },
            },
            {
                $skip: (intPageCount - 1) * intPageSize,
            },
            {
                $limit: intPageSize,
            },
        ];

        let arrResult = await getListDB({
            arrQuery,
            strCollection: "cln_messages",
        });



        let arrList = [];
        if (arrResult.length) {
            let todayDate = new Date();
            let currentDate;
            arrResult.map(item => {
                let thisDate = new Date(item?.strCreatedDate);
                let formattedDate;

                if (
                    thisDate.getDate() === todayDate.getDate() &&
                    thisDate.getMonth() === todayDate.getMonth() &&
                    thisDate.getFullYear() === todayDate.getFullYear()
                ) {
                    formattedDate = "Today";
                } else {
                    let yesterday = new Date();
                    yesterday.setDate(todayDate.getDate() - 1);

                    if (
                        thisDate.getDate() === yesterday.getDate() &&
                        thisDate.getMonth() === yesterday.getMonth() &&
                        thisDate.getFullYear() === yesterday.getFullYear()
                    ) {
                        formattedDate = "Yesterday";
                    } else {
                        formattedDate = `${thisDate.getDate().toString().padStart(2, '0')}/${(thisDate.getMonth() + 1).toString().padStart(2, '0')}/${thisDate.getFullYear()}`;
                    }
                }

                if (currentDate != formattedDate) {
                    currentDate = formattedDate;
                    arrList.push({
                        "_id": "12345678986547",
                        "strUserId": source.strUserId,
                        "strType": strType || 'private',
                        "strMessageType": "tag",
                        "strMessage": formattedDate,
                        "strName": "You",
                        "strIconURL": "https://guage09.s3.ap-south-1.amazonaws.com/USER_1696409088344.jpg",
                        "strCreatedTime": "00:00",
                    });
                }
                arrList.push({
                    ...item,
                    strCreatedTime: formatTime12HourInTime(item.strCreatedTime)
                });
            });
        }


        return {
            arrList: arrList || [],
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};

const formatTime12HourInTime = (time24Hour) => {
    const [hours, minutes] = time24Hour.split(':');
    const hh = parseInt(hours, 10);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const hour12 = hh % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};



const deleteMessageUseCase = async function ({
    source,
    body
}) {
    try {
        let {
            _id,
        } = body;

        await updateOneKeyDB({
            _id,
            objDocument: {
                chrStatus: 'D',
            },
            strCollection: "cln_messages"
        });

        return {
            strMessage: "Message Is Successfully Deleted ",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}
async function clearMessageUseCase({ source, body }) {
    try {
        let { strChatId, strType } = body;

        let firstQueryMatch = {
            strUserId: new ObjectId(source.strUserId),
            strChatId: new ObjectId(strChatId)
        };

        let firstQuery = await updateManyDB({
            objMatch: firstQueryMatch,
            objDocument: {
                chrUserIdStatus: 'D',
            },
            strCollection: "cln_messages"
        });

        let secondQueryMatch = {
            strChatId: new ObjectId(source.strUserId),
            strUserId: new ObjectId(strChatId)
        };

        let secondQuery = await updateManyDB({
            objMatch: secondQueryMatch,
            objDocument: {
                chrChatIdStatus: 'D',
            },
            strCollection: "cln_messages"
        });

        console.log("Second Query:", secondQuery, "First Query:", firstQuery);

        return {
            strMessage: "Messages have been successfully deleted.",
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
}


module.exports = {
    getListChatHistoryUsecase,
    getListChatMessagesUsecase,
    deleteMessageUseCase,
    clearMessageUseCase
}