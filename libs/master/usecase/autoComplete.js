const {
    findMany,
    findOne,
    queryRunner,
    createQuery,
    UpdateAccountStatus,
    commonStatusUpdate
} = require("../../common/functions");
const {
    errHandler,
} = require('../../core/helpers');

const autoCompleteUsecase = async ({
    source,
    query
}) => {
    try {
        const objQueries = {
            work: `SELECT w.id, w."strWorkTypeName" AS "strValue"
            FROM tbl_work_project AS w
            WHERE ("strWorkTypeName" ILIKE '%${query.strSearch || ''}%')
              AND w."fkProjectId" = ${query.projectId}
              AND w."chrStatus" = 'N'
            LIMIT 10`,
            contractor: `SELECT v.id, b."strAccountName" AS "strValue",v."fkAccountId"
            FROM tbl_vendor AS v
            LEFT JOIN tbl_account AS b ON v."fkAccountId" = b.id
            AND ("strAccountName" ILIKE '%${query.strSearch || ''}%') WHERE v."chrStatus" = 'N'
            LIMIT 10`,
            material: `SELECT a.id, a."strMaterialName" AS "strValue", a."strBatchNo",a."strUnit",a."intPricePerUnit",a."intDiscount",a."intSGST",a."intCGST"
            FROM tbl_material AS a WHERE a."chrStatus" = 'N'
            AND ("strMaterialName" ILIKE '%${query.strSearch || ''}%') LIMIT 10`,
            supplier: `SELECT id ,"strAccountName" AS "strValue" FROM tbl_account WHERE  "chrStatus" = 'N'
            AND ("strAccountName" ILIKE '%${query.strSearch || ''}%' OR 
                 "strAccountCode" ILIKE '%${query.strSearch || ''}%'  ) LIMIT 10`,
            account: `SELECT id ,"strAccountName" AS "strValue" FROM tbl_account WHERE  "chrStatus" = 'N'
            AND ("strAccountName" ILIKE '%${query.strSearch || ''}%' OR 
                 "strAccountCode" ILIKE '%${query.strSearch || ''}%'  ) LIMIT 10`,                                                                   
            project: `SELECT id ,"strProjectName" AS "strValue" FROM tbl_project WHERE  "chrStatus" = 'N'
            AND ("strProjectName" ILIKE '%${query.strSearch || ''}%' OR 
                 "strProjectCategory" ILIKE '%${query.strSearch || ''}%'  ) LIMIT 10`,                                                 
            model: `SELECT id ,"strModelName" AS "strValue","strUnit","intPricePerUnit" FROM tbl_model WHERE  "chrStatus" = 'N'
                 AND ("strModelName" ILIKE '%${query.strSearch || ''}%') LIMIT 10`,
            client: `SELECT id,"strClientName" || ' - ' || "strCompanyName" AS  "strValue" FROM tbl_client WHERE  "chrStatus" = 'N' 
            AND ("strClientName" ILIKE '%${query.strSearch || ''}%' OR 
                 "strCompanyName" ILIKE '%${query.strSearch || ''}%'  ) LIMIT 10`,
            user: `SELECT id,"strFullName" || ' - ' || "strUserName" AS  "strValue" FROM tbl_user WHERE  "chrStatus" = 'N' AND "strUserStatus" = 'ACTIVE' 
                   AND ("strFullName" ILIKE '%${query.strSearch || ''}%' OR 
                        "strUserName" ILIKE '%${query.strSearch || ''}%' OR 
                        "strEmail" ILIKE '%${query.strSearch || ''}%' OR 
                        "strMobile" ILIKE '%${query.strSearch || ''}%' )
                  ${query.fkUserType?` AND "fkUserType" = ${query.fkUserType} `:''} LIMIT 10`,
        }
        if (!query["strType"])
            throw new errHandler("INVALID TYPE").send();
        const arrList = await findMany(objQueries[query["strType"]], null, source["strTenantId"]);
        return {
            result: arrList || []
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}
const multiDropDown = async ({
    source,
    body
}) => {
    try {
        const objQueries = {
            work: `SELECT w.id, w."strWorkTypeName" AS "strValue"
            FROM tbl_work_project AS w
            WHERE  w."fkProjectId" = ${body.fkProjectId}
              AND w."chrStatus" = 'N' ;`,
            contractor: `SELECT v.id, b."strAccountName" AS "strValue"
            FROM tbl_vendor AS v
            LEFT JOIN tbl_account AS b ON v."fkAccountId" = b.id AND b."chrStatus" = 'N' 
            WHERE v."chrStatus" = 'N'  ;`,
            material: `SELECT a.id, a."strMaterialName" AS "strValue", a."strBatchNo",a."strUnit",a."intPricePerUnit",a."intDiscount",a."intSGST",a."intCGST"
            FROM tbl_material AS a WHERE a."chrStatus" = 'N';
            `,
            supplier: `SELECT id ,"strAccountName" AS "strValue" FROM tbl_account WHERE  "chrStatus" = 'N' intAccountType ='1' ;`,
            account: `SELECT id ,"strAccountName" AS "strValue" FROM tbl_account WHERE  "chrStatus" = 'N' ;`,
            project: `SELECT id ,"strProjectName" AS "strValue" FROM tbl_project WHERE  "chrStatus" = 'N' ; `,
            unit: `SELECT id ,"strUnitName" AS "strValue" FROM tbl_unit WHERE  "chrStatus" = 'N' ; `,
            client: `SELECT id,"strClientName" || ' - ' || "strCompanyName" AS  "strValue" FROM tbl_client WHERE  "chrStatus" = 'N' ;`,
            user: `SELECT id,"strFullName" || ' - ' || "strUserName" AS  "strValue" FROM tbl_user WHERE  "chrStatus" = 'N' AND "strUserStatus" = 'ACTIVE' 
                  ${body.fkUserType?` AND "fkUserType" = ${body.fkUserType} `:''}  `,
        }
        if (!body["arrType"])
            throw new errHandler("INVALID TYPE").send();
        let strQuery = '';
        if (body["arrType"] ?.length == 1) {
            let strType = body["arrType"][0];
            const arrList = await findMany(objQueries[strType], null, source["strTenantId"]);
            return {
                [strType]: arrList || []
            }
        }
        await body["arrType"].forEach((type) => {
            strQuery += objQueries[type] || '';
        }); 
        const arrResult = await queryRunner(strQuery, null, source["strTenantId"]); 
        let objResult = {}
        await body["arrType"].forEach((type, i) => {
            objResult[type] = [];
            if (objQueries[type] && arrResult[i]) {
                objResult[type] = arrResult[i] ?.rows;
            }
        })
        return objResult;
    } catch (error) {
        throw new errHandler(error).set()
    }


}
module.exports = {
    autoCompleteUsecase,
    multiDropDown
}