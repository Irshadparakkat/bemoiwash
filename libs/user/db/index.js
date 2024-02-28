const {
    getMongoDbConnection,
    errHandler
} =require('../../core/helpers')

    const getUserDetailsDb = async function({
        strTenantId,
        strLoginId
    }) {
        const objConnection = await getMongoDbConnection()
        try {
            const strWhere = `"chrStatus" IN ('N','B') AND 
                ("strUserName"=$1 OR "strMobile" =$2 )`
       
            let objUserData = await objConnection.query(
                `SELECT     id AS "strUserId", 
                "strEmail","strFullName","updatedBy","updatedTime",
                            "strUserName", 
                            "strPassword",
                            "fkUserType",
                            "chrStatus",
                            "strMobile",
                            "strImageUrl"
                    FROM tbl_user WHERE ${strWhere}`,
                    [strLoginId,strLoginId]
            );

            if (objUserData["rows"].length > 0) {
                objUserData =  objUserData["rows"][0];
                return objUserData;
            } else {
                throw new errHandler("INVALID_LOGIN_CREDENTIALS").set();
            }
        } catch (error) {
            throw new errHandler(error).set()
        } finally {
            objConnection.end();
        }
    }


    const userPermissionSelectDb = ({
        filters,
        page = 1,
        count = 100,
        sort = 'cp.id',
        sortOrder = 'ASC',
        strSearch,
        user,
      }) => {
        let searchCondition = '';
        let strFilterCondition = '';
      
      
        return `
          SELECT *
          FROM tbl_user_module_permission AS cp
          WHERE cp."fkUserType" = '${user}'
          ${searchCondition} ${strFilterCondition}
          ORDER BY ${sort} ${sortOrder}
          LIMIT ${count}
          OFFSET ${(page - 1) * count}`;
      };
      


      const permissionUpdateDb = ({
        itemId,
        isCreate,
        isView,
        isUpdate,
        isDelete,
        isPayment,
        strUserId,
        timReceived,
      }) => {
        let updateFields = '';
        if (isCreate !== undefined) {
          updateFields += `"isCreate" = ${isCreate}, `;
        }
        if (isView !== undefined) {
          updateFields += `"isView" = ${isView}, `;
        }
        if (isUpdate !== undefined) {
          updateFields += `"isUpdate" = ${isUpdate}, `;
        }
        if (isDelete !== undefined) {
          updateFields += `"isDelete" = ${isDelete}, `;
        }
        if (isPayment !== undefined) {
          updateFields += `"isPayment" = ${isPayment}, `;
        }
      
        return `
          UPDATE tbl_user_module_permission SET
            ${updateFields}
            "updatedBy" = '${strUserId}',
            "updatedTime" = '${timReceived}'
          WHERE id = ${itemId};
        `;
      };
      
    module.exports = {
        getUserDetailsDb,
        userPermissionSelectDb,
        permissionUpdateDb
    }
