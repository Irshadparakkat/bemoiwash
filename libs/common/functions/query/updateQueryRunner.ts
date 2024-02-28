import {
    getMongoDbConnection
} from '../../../core/helpers'
import errHandler from '../../../core/helpers/errHandler'
export async function updateQueryRunner({
    strTableName,
    objValues,
    strWhere
}) {
    let strQuery = '',
    strSet='',
        arrValues = []
    let objConnection = await getMongoDbConnection()
    try {
        if (!strTableName)
            return null
        else if (objValues && Object.keys(objValues).length) {
            /**Quer building */
            await Object.keys(objValues).forEach((key, i) => {
                strSet+=` ${key}=$${i+1}, `
                arrValues.push(objValues[key])
            })
            strQuery=`UPDATE ${strTableName} SET ${strSet} WHERE ${strWhere}`
        } else
            return null
    } catch (error) {
        throw new errHandler(error);
    } finally {
        objConnection.end();
    }

}