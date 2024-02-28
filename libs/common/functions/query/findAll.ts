import {
    getMongoDbConnection
} from '../../../core/helpers'
import errHandler from '../../../core/helpers/errHandler'

export async function findAll({
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
            console.log(objResult.rows[0])
            return objResult.rows
        }
    } catch (error) {
        throw new errHandler(error);
    } finally {
        objConnection.end();
    }

}