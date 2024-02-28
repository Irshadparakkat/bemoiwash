const {
    errHandler
} = require('../../../core/helpers');
const {objAccountTypesDetails} = require('../../constants')
const strInsertQuery1 = `INSERT INTO tbl_account (
    "strAccountCode",
    "strAccountName",
    "createdTime",
    "intAccountType",
    "fkMainLedgerId"
    ) VALUES `
const strInsertChartOfAcc = `INSERT INTO tbl_chart_of_account ("fkSubLedgerId",
"fkAccountId",
"fkChartofAccId") VALUES `
const createAccount = async ({
    strAccountCode,
    strAccountName,
    timReceived,
    intAccountType,
    strLedgerQuery = 'NULL'
}, objConnection) => {
    try {
        if (!objConnection)
            throw new errHandler('NO CONNECTION')
        else {
            switch (intAccountType) {
                case 1: {
                 //let strChrtQuery = `${strInsertChartOfAcc} ()`
                    break;
                }
                case 2: {

                    break;
                }
                case 3: {

                    break;
                }
                case 4: {

                    break;
                }
                case 5: {

                    break;
                }
                case 7: {

                    break;
                }
                default:
                    break;
            }
            let strInsertQuery = `${strInsertQuery1} ('${strAccountCode}','${strAccountName}','${timReceived}',${intAccountType},${strLedgerQuery}) RETURNING id;`
           let objData = await objConnection.query(strInsertQuery);
            if (objData && objData["rows"] && objData["rows"].length > 0) {
            switch (intAccountType) {
                case 1: {
                 //let strChrtQuery = `${strInsertChartOfAcc} ()`
                    break;
                }
                case 2: {

                    break;
                }
                case 3: {

                    break;
                }
                case 4: {

                    break;
                }
                case 5: {

                    break;
                }
                case 7: {

                    break;
                }
                default:
                    break;
            }
                return objData["rows"][0];
            } else {
                return null
            }
        }
    } catch (error) {
        console.log("error", error ?.constraint);
        if (error ?.constraint == "tbl_account_name_ukey") {
            return {
                strMessage: "Account name Already Exists"
            }
        }
        if (error ?.constraint == "tbl_account_code_ukey") {
            return {
                strMessage: "Account Code Already Exists"
            }
        }
        throw new errHandler(error).set()
    }
}

const updateAccount = async ({
    fkAccountId,
    strAccountCode,
    strAccountName
}, objConnection) => {

    try {
        if (!objConnection)
            throw new errHandler('NO CONNECTION')
        else {
            let strUpdateQuery = `UPDATE tbl_account SET             
            "strAccountCode" = '${strAccountCode}',
            "strAccountName" = '${strAccountName}'
             WHERE id = ${fkAccountId}  RETURNING id ;`
            let objData = await objConnection.query(strUpdateQuery);
            if (objData) {
                return true;
            } else {
                return null
            }
        }
    } catch (error) {
        if (error ?.constraint == "tbl_account_name_ukey") {
            return {
                strMessage: "Account name Already Exists"
            }
        }
        if (error ?.constraint == "tbl_account_code_ukey") {
            return {
                strMessage: "Account Code Already Exists"
            }
        }
        throw new errHandler(error).set()
    }
}

const UpdateAccountStatus = async ({
    id,
    chrStatus = 'B'
}, objConnection) => {
    try {
        let strQuery = `UPDATE tbl_account
        SET  "chrStatus" = '${chrStatus}'
        WHERE id = ${id}  RETURNING id ; `;
        let objData = await objConnection.query(strQuery);
        if (objData) {
            return true;
        } else {
            return null
        }
    } catch (error) {
        throw new errHandler(error).set()
    }
}

module.exports = {
    createAccount,
    updateAccount,
    UpdateAccountStatus
}