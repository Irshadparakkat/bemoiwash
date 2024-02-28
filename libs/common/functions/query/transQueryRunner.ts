import {
    getMongoDbConnection
} from '../../../core/helpers'
import errHandler from '../../../core/helpers/errHandler'

export async function transQueryRunner({
    strQuery,
    objDbConnection
}) {
    try {
        /**Quer Running */
        const objResult = await objDbConnection.query(strQuery)
        if (objResult && objResult.rows && objResult.rows.length)
            return objResult.rows
        else if (objResult["rowCount"])
            return true
        else
            return false
    } catch (error) {
        await objDbConnection.query("ROLLBACK");
        if (error && error["code"] == 23505) {
            throw new errHandler("DUPLICATE ENTRY");
        } else
            throw new errHandler(error);
    }

}