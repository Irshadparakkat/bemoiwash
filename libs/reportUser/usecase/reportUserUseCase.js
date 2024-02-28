const {
    errHandler,
} = require('../../core/helpers')
const {
    insertManyDB,
    insertOneDB,
    getListDB,
    imageUpload,
    updateOneKeyDB,
    updateFindOneKeyDB,
    getOneDB
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');

const createReportUserUsecase = async function ({
    source,
    body
}) {
    try {
        let {
            strUserId,
        } = body;

        let {
            timReceived
        }=source

        let checkIsExist = await getOneDB({
            strCollection: 'cln_reported_user',
            objQuery: {
                strUserId: new ObjectId(strUserId),
                strCreatedBy :new ObjectId(source.strUserId),
            }
        })

        if(checkIsExist){
            let objMatch ={ 
                strCreatedBy :new ObjectId(source.strUserId),
                strUserId : new ObjectId(strUserId)
            }
          let updateDb =await updateOneKeyDB({
                objMatch,
                objDocument: {
                    chrStatus: 'N',
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                },
                strCollection: "cln_reported_user"
            });

            if (!updateDb) {
                throw new errHandler("REPORT CREATION FAILED").set()
            }
       
        }

       else{

        let objBlockUser = await insertOneDB({
            objDocument: {
                strUserId: new ObjectId(strUserId),
                strCreatedBy :new ObjectId(source.strUserId),
                strBlockTime: new Date(timReceived)
            },
            strCollection: "cln_reported_user"
        });

        if (!objBlockUser ?.insertedId) {
            throw new errHandler("REPORT CREATION FAILED").set()
        }

       }
       
       
        return {
            strMessage: "Success fully Reported"
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const removeReportUseCase = async function ({
    source,
    body
}) {
    try {
        let {
            strUserId
        } = body;

        let objMatch ={ 
            chrStatus: 'N',
            strUserId : new ObjectId(strUserId),
            strCreatedBy :new ObjectId(source.strUserId)
        }
            await updateOneKeyDB({
                objMatch,
                objDocument: {
                    chrStatus: 'D',
                strUpdatedBy: new ObjectId(source.strUserId),
                strUpdatedTime: new Date(source.timReceived),
                },
                strCollection: "cln_reported_user"
            });
       
        return {
            strMessage: "Success fully Removed Report ",
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const getReportedUserListUseCase = async function ({
    source,
    body
}) { 
    let arrAndConditions = [{ chrStatus: 'N'},{strCreatedBy:new ObjectId(source?.strUserId) }];
    try {   
        let arrQuery = [
            {
                $match: {
                    $and: arrAndConditions
                }
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
                $project: {
                    _id: 1,
                    strUserId: '$strUserId',
                    strFullName: { $arrayElemAt: ['$user.strFullName', 0] },
                    strMobileNo: { $arrayElemAt: ['$user.strMobileNo', 0] },
                    strProfileIcon: { $arrayElemAt: ['$user.strProfileUrl', 0] }
                }
            }
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_reported_user"
        });

        return {
            arrList
        };
    } catch (error) { 
        throw new errHandler(error).set();
    }   
}




module.exports = {
    createReportUserUsecase,
    removeReportUseCase,
    getReportedUserListUseCase
}