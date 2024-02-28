 const {
   STR_COMMON_DB
 } = require('../../common/constants');
 const {
   MongoClient
 } = require("mongodb");
 let objMongoConnection
 let objMongoTransClient
 let objGroupRooms = {};
 let objOnlineUsers = {}
 async function createMongoDbConnection(isTrans = false) {
   try {

     if (isTrans) {
       objMongoTransClient = await MongoClient.connect("mongodb://127.0.0.1:27017/?retryWrites=true&w=majority&replicaSet=rs", {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         serverSelectionTimeoutMS: 5000,
       });
       return objMongoTransClient.startSession()
     } else {
       objMongoConnection = await MongoClient.connect("mongodb://127.0.0.1:27017", {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         serverSelectionTimeoutMS: 5000,
       });

     }

     console.log("MongoClient Created");
   } catch (error) {
     console.log("error", error);
   }
 }

 async function getMongoDbConnection() {
   try {
     if (!objMongoConnection)
       await createMongoDbConnection();
     return objMongoConnection.db(STR_COMMON_DB);
   } catch (error) {
     console.log("error", error);
   }
 }

 async function getMongoTransConnection() {
   try {
     let session = await createMongoDbConnection(true);
     await session.startTransaction();
     let objConnection = await objMongoTransClient.db(STR_COMMON_DB);
     return {
       session,
       objConnection
     }
   } catch (error) {
     console.log("error", error);
   }
 }

 const createGroupRoomCache = async () => {
   let objConnection = await getMongoDbConnection()
   let arrResult = await objConnection.collection('cln_group').aggregate([{
     $match: {
       chrStatus: 'N'
     },

   }]).toArray();
   if (arrResult ?.length) {
     arrResult.forEach(objGroup => {
       objGroupRooms[objGroup ?._id.toString()] = {}
     });
   };
   console.log("objGroupRooms", objGroupRooms);
 }

 const updateGroupRoom = ({
   strGroupId,
   strUserId,
   id,
   strFullName,
   isJoin = false
 }) => {
   if (isJoin) {
     if (!objGroupRooms[strGroupId]) {
       objGroupRooms[strGroupId] = {};
     }
     objGroupRooms[strGroupId] = {
       ...objGroupRooms[strGroupId],
       [strUserId]: {
        id,
        strFullName}
     }
   } else {
     objGroupRooms[strGroupId] ? delete objGroupRooms[strGroupId][strUserId] : (objGroupRooms[strGroupId] = {})
   }
   return true;
 }

 const updateOnlineUsers = ({
   strUserId,
   id,
   strFullName,
   isConnected = false
 }) => {
   if (isConnected) {
     objOnlineUsers[strUserId] = {id,strFullName}; 
     return true;
   }
   objOnlineUsers[strUserId] = false;
   return true;
 }

 
 const getGroupRooms = ({
  strUserId,
  id,
  strFullName,
  isConnected = false
}) => {
  if (isConnected) {
    objOnlineUsers[strUserId] = {id,strFullName}; 
    return true;
  }
  objOnlineUsers[strUserId] = false;
  return true;
}


 const allDBInit = () => {
   createGroupRoomCache();
 }

 module.exports = {
   allDBInit,
   updateGroupRoom,
   updateOnlineUsers
 }