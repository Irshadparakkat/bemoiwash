import {
    getMongoDbConnection
} from '../../../core/helpers'
import errHandler from '../../../core/helpers/errHandler'

export async function findOne({
    strTableName,
    strWhere = '',
    strColounm = ' * ',
}) {
    const objConnection = await getMongoDbConnection()
    try {
        if (!strTableName || !strWhere)
            return null
        else {
            const strQuery = `SELECT ${strColounm} FROM ${strTableName} ${strWhere} ;`
            /**Quer Running */
            console.log("strQuery");
            console.log(strQuery);
            const objResult = await objConnection.query(strQuery)
            if (objResult && objResult.rows)
                return objResult.rows[0]
            else
                return null
        }
    } catch (error) {
        throw new errHandler(error);
    } finally {
        objConnection.end();
    }

}