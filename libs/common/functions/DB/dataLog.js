const {
    insertOneDB,
    getListDB
} = require('./mongoQueries')

  function createUserActivity({
    strTenantId,
    statement,
    projectId,
    DocumentId,
    Module,
    strUserId,
    timReceived
}) {
    //  insertOneDB({
    //     strTenantId,
    //     objDocument: {
    //         statement,
    //         projectId,
    //         DocumentId,
    //         Module,
    //         strUserId,
    //         timReceived
    //     },
    //     strCollection: 'user_activity'
    // })
}

async function listUserActivity({ strTenantId, body }) {
    try {
      const arrQuery = [{ $limit: 100 }]; 
      return await getListDB({
        strTenantId,
        strCollection: 'user_activity',
        arrQuery
      });
    } catch (error) {
      console.error('Error in listUserActivity:', error); 
    throw error;
    }
  }
  

module.exports ={
    createUserActivity,
    listUserActivity
}