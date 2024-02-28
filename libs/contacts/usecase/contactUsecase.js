const {
    errHandler,
} = require('../../core/helpers')
const {
    insertManyDB,
    getListDB
} = require('../../common/functions');
const {
    ObjectId
} = require('mongodb');

const createPackageUseCase = async function ({
    source,
    body
}) {
    try {
        const {
            arrContacts,
            strJoinMethode
        } = body;

        if (!arrContacts || arrContacts.length === 0) {
            throw new errHandler("EMPTY DATA");
        }

        const arrContactData = arrContacts.map(strContact => ({
            strUserId: source.strUserId,
            strMobileNo: strContact,
            strJoinMethode,
            strCreatedTime: new Date(source.timReceived),
            chrStatus: 'N'
        }));

        const objResult = await insertManyDB({
            strCollection: "cln_packages",
            arrInsertDocuments: arrContactData,
            options: { ordered: false }
        });

        if (!objResult) {
            throw new errHandler("INSERT FAILED");
        }

       
        const insertedContactIds = objResult.successfullyInsertedIds || {}; // Ensure it's an object or an empty object
        const arrLookupResult = Object.keys(insertedContactIds).length > 0 ?
            await getListDB({
                arrQuery: [
                    {
                        $match: {
                            _id: {
                                $in: Object.values(insertedContactIds)
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'cln_user',
                            localField: 'strMobileNo',
                            foreignField: 'strMobileNo',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: '$user' // Unwind the "user" array
                    },
                    {
                        $project: {
                            '_id': 1,
                            'strMobileNo': 1,
                            'strUserId': '$user._id',
                            'strFullName': '$user.strName',
                            'strEmail': '$user.strEmail',
                            'strProfileUrl': '$user.strProfileUrl',
                        }
                    }
                ],
                strCollection: "cln_contacts"
            }) : [];


            let count = arrLookupResult.length


        return {
            strMessage: "Successfully created new contacts",
            contacts: arrLookupResult,
            count
        };
    } catch (error) {
        throw new errHandler(error).set()
    }
}


const getListContactsUsecase = async function ({
    source,
    body
}) { 
    let {strUserId} = source;
    let arrAndConditions = [{ chrStatus: 'N'}, { strUserId }];
    
    try {   
        let arrQuery = [{
            $match: {
                $and: arrAndConditions
            },
        },
        {
            $lookup: {
                from: 'cln_user',
                localField: 'strMobileNo',
                foreignField: 'strMobileNo',
                as: 'objUser',
            },
        },
        {
            $unwind: '$objUser' 
        },
        {
            $project:{
                '_id': '$objUser._id',
                'strUserId':'$objUser._id',
                'strFullName': '$objUser.strName',
                'strMobileNo': '$objUser.strMobileNo',
                'strEmail': '$objUser.strEmail',
                'strProfileUrl': '$objUser.strProfileUrl',
                'location': '$objUser.location'

            }
        }];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_contacts"
        });

        let count = arrList.length

        return {
            arrList,
            count
        }
    } catch (error) { 
        throw new errHandler(error).set()
    }   
}
const getContactsToAddUseCase = async function ({
    source,
    body
}) { 
    let { strUserId } = source;
    let { _id } = body;

    try {   
        let existingGroupUsers = await getListDB({
            arrQuery: [
                {
                    $match: {
                        chrStatus: 'N',
                        strGroupId: new ObjectId(_id),
                    },
                },
                {
                    $project: {
                        strUserId: 1,
                    },
                },
                {
                    $lookup: {
                        from: 'cln_user',
                        localField: 'strUserId',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                {
                    $unwind: '$userDetails',
                },
                {
                    $project: {
                        strMobileNo: '$userDetails.strMobileNo',
                    },
                },
            ],
            strCollection: "cln_group_users",
        });

        let existingMobileNumbers = existingGroupUsers.map(user => user.strMobileNo);

        console.log(strUserId, "ldld", existingMobileNumbers);

        let arrQuery = [
            {
                $match: {
                    chrStatus: 'N',
                    strUserId: { $ne: strUserId },
                    strMobileNo: { $nin: existingMobileNumbers },
                },
            },
            {
                $lookup: {
                    from: 'cln_user',
                    localField: 'strMobileNo',
                    foreignField: 'strMobileNo', // Match by string, not ObjectId
                    as: 'objUser',
                },
            },
            {
                $unwind: '$objUser' 
            },
            {
                $project: {
                    '_id': '$objUser._id',
                    'strUserId': '$objUser._id',
                    'strFullName': '$objUser.strName',
                    'strMobileNo': '$objUser.strMobileNo',
                    'strEmail': '$objUser.strEmail',
                    'strProfileUrl': '$objUser.strProfileUrl',
                    'location': '$objUser.location',
                }
            },
        ];

        let arrList = await getListDB({
            arrQuery,
            strCollection: "cln_contacts"
        });

        let count = arrList.length;

        return {
            arrList,
            count
        };
    } catch (error) { 
        throw new errHandler(error).set();
    }   
}


module.exports = {
    createPackageUseCase,
    getListContactsUsecase,
    getContactsToAddUseCase
}