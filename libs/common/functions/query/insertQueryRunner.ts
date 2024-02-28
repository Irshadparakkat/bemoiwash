import {
    getMongoDbConnection
} from '../../../core/helpers'
import errHandler from '../../../core/helpers/errHandler'
const strAccountInsertQuery = ` INSERT INTO tbl_account
                                                 (str_account_name,
                                                 str_account_type,
                                                 fk_created_user_id,
                                                 tim_created) VALUES ($1,$2,$3,$4) 
                                                 RETURNING pk_account_id`
export async function insertQueryRunner({
    strTableName,
    objValues,
    arrReturnItems = [],
}) {
    let strQuery = '',
        strColounm = '',
        strValues = '',
        arrValues = []
    let objDbConnection = await getMongoDbConnection()
    try {
        if (!strTableName)
            return null
        else if (objValues && Object.keys(objValues).length) {
            /**Quer building */
            await Object.keys(objValues).forEach((key, i) => {
                strColounm += ` ${key},`
                strValues += `$${i+1},`
                arrValues.push(objValues[key])
            })
            strQuery = `INSERT INTO ${strTableName} (${strColounm.slice(0, -1)}) VALUES (${strValues.slice(0, -1)}) ${arrReturnItems.length?"RETURNING "+arrReturnItems:" "} ;`
            /**Quer Running */
            console.log("strQuery");
            console.log(strQuery);
            
            const objResult = await objDbConnection.query(strQuery, arrValues)
            console.log(objResult.rows[0])
            return objResult.rows
        } else
            return null
    } catch (error) {
        if (error && error["code"] == 23505) {
            throw new errHandler("DUPLICATE ENTRY");
        } else
            throw new errHandler(error);
    } finally {
        objDbConnection.end();
    }

}

export async function insertTransQueryRunner({
    strTableName,
    objValues,
    arrReturnItems = [],
    objDbConnection
}) {
    let strQuery = '',
        strColounm = '',
        strValues = '',
        arrValues = [] 
    try {
        if (!strTableName)
            return null
        else if (objValues && Object.keys(objValues).length) {
            /**Quer building */
            await Object.keys(objValues).forEach((key, i) => {
                strColounm += ` ${key},`
                strValues += `$${i+1},`
                arrValues.push(objValues[key])
            })
            strQuery = `INSERT INTO ${strTableName} (${strColounm.slice(0, -1)}) VALUES (${strValues.slice(0, -1)}) ${arrReturnItems.length?"RETURNING "+arrReturnItems:" "} ;`
            /**Quer Running */
            console.log("strQuery");
            console.log(strQuery);
            
            const objResult = await objDbConnection.query(strQuery, arrValues)
            console.log(objResult.rows[0])
            return objResult.rows
        } else
            return null
    } catch (error) {
        await objDbConnection.query("ROLLBACK");
        if (error && error["code"] == 23505) {
            throw new errHandler("DUPLICATE ENTRY");
        } else
            throw new errHandler(error);
    }  

}

export async function insertWithAccQueryRunner({
    strTableName,
    objValues,
    arrAccValues,
    arrReturnItems = []
}) {
    let strQuery = '',
        strColounm = '',
        strValues = '',
        arrValues = []
    let objDbConnection = await getMongoDbConnection()
    try {
        if (!strTableName)
            return null
        else if (objValues && Object.keys(objValues).length) {
            await objDbConnection.query("BEGIN");
            /**Account Insert */
            const objAccResult = await objDbConnection.query(strAccountInsertQuery, arrAccValues)
            if (objAccResult && objAccResult["rows"] && objAccResult["rows"][0] && objAccResult["rows"][0]["pk_account_id"]) {
                let objInsertValues = {
                    fk_account_id: objAccResult["rows"][0]["pk_account_id"],
                    ...objValues
                }
                /**Quer building */
                await Object.keys(objInsertValues).forEach((key, i) => {
                    strColounm += ` ${key},`
                    strValues += `$${i+1},`
                    arrValues.push(objInsertValues[key])
                })
                strQuery = `INSERT INTO ${strTableName} (${strColounm.slice(0, -1)}) VALUES (${strValues.slice(0, -1)}) ${arrReturnItems.length?"RETURNING "+arrReturnItems:" "} ;`
                /**Quer Running */
                const objResult = await objDbConnection.query(strQuery, arrValues)
                console.log(objResult.rows[0])
                await objDbConnection.query("COMMIT");
                return objResult.rows
            } else {
                await objDbConnection.query("ROLLBACK");
                throw new errHandler("FAILED")
            }
        } else
            return null
    } catch (error) {
        await objDbConnection.query("ROLLBACK");
        if (error && error["code"] == 23505) {
            throw new errHandler("ACCOUNT NAME DUPLICATE");
        } else
            throw new errHandler(error);
        throw new errHandler(error);
    } finally {
        objDbConnection.end();
    }

}