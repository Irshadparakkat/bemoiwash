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
const getNotificationListUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strUserId,
        } = source;

        let {
            intPageCount = 1
        } = body;
        let arrQuery = [];

        let matchCriteria = {
            chrStatus: 'N',
        
        };


        if(source.strType!='ADMIN'){
            matchCriteria={
                ...matchCriteria,
                strCreatedFor: new ObjectId(strUserId)
            }
        }

        arrQuery = [
            {
                $match: {
                    ...matchCriteria,
                },
            },
            {
                $lookup: {
                    from: 'cln_user',
                    localField: 'strCreatedFor',
                    foreignField: '_id',
                    as: 'objUser',
                },
            },
            {
                $unwind: "$objUser",
            },
            {
                $project: {
                    _id: 1,
                    strType: 1,
                    strNotification: 1,
                    strCreatedBy: 1,
                    strUserId: '$objUser._id',
                    strName: '$objUser.strName',
                    strIconURL: "$objUser.strProfileUrl",
                    strCreatedTime: 1, // Keep the original date format
                },
            },
            {
                $addFields: {
                    timeDifference: {
                        $subtract: [new Date(), "$strCreatedTime"]
                    },
                },
            },
            {
                $addFields: {
                    minutesAgo: {
                        $trunc: {
                            $divide: ["$timeDifference", 60000],
                        },
                    },
                    timeAgo: {
                        $cond: {
                            if: {
                                $lte: ["$timeDifference", 60000] // Less than or equal to 1 minute
                            },
                            then: "a few seconds ago",
                            else: {
                                $cond: {
                                    if: {
                                        $lte: ["$timeDifference", 3600000] // Less than or equal to 1 hour
                                    },
                                    then: {
                                        $concat: [
                                            {
                                                $toString: {
                                                    $trunc: {
                                                        $divide: ["$timeDifference", 60000],
                                                    }
                                                }
                                            },
                                            " minutes ago"
                                        ]
                                    },
                                    else: {
                                        $cond: {
                                            if: {
                                                $lte: ["$timeDifference", 86400000] // Less than or equal to 1 day
                                            },
                                            then: {
                                                $concat: [
                                                    {
                                                        $toString: {
                                                            $trunc: {
                                                                $divide: ["$timeDifference", 3600000],
                                                            }
                                                        }
                                                    },
                                                    " hours ago"
                                                ]
                                            },
                                            else: {
                                                $cond: {
                                                    if: {
                                                        $lte: ["$timeDifference", 604800000] // Less than or equal to 1 week
                                                    },
                                                    then: {
                                                        $concat: [
                                                            {
                                                                $toString: {
                                                                    $trunc: {
                                                                        $divide: ["$timeDifference", 86400000],
                                                                    }
                                                                }
                                                            },
                                                            " days ago"
                                                        ]
                                                    },
                                                    else: {
                                                        $concat: [
                                                            {
                                                                $toString: {
                                                                    $trunc: {
                                                                        $divide: ["$timeDifference", 604800000],
                                                                    }
                                                                }
                                                            },
                                                            " weeks ago"
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            },            
            {
                $sort: { strCreatedTime: -1 }, 
            },
            {
                $skip: (intPageCount - 1) * 14, // Adjust the page size as needed
            },
            {
                $limit: 14, // Adjust the page size as needed
            },
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_notification",
        });

        return {
            arrList: arrList || [],
        };
    } catch (error) {
        throw new errHandler(error).set();
    }
};


async function isUserBeingFollowed(strCreatedBy, strUserId) {
    const followRelationship = await getOneDB({
        strCollection: 'cln_follow_user',
        objQuery: {
            strFollowingUserId: new ObjectId(strUserId),
            strCreatedBy: new ObjectId(strCreatedBy),
        }
    });

  
    return !!followRelationship; 
}


module.exports = {
    getNotificationListUsecase,
}