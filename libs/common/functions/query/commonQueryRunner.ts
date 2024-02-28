import {
    getMongoDbConnection
} from '../../../core/helpers'
import errHandler from '../../../core/helpers/errHandler'
export async function commonQueryRunner({
    strQuery,
    arrData = []
}) {
    const objConnection = await getMongoDbConnection()
    try {
        let result;
        if (arrData.length)
            result = await objConnection.query(strQuery, arrData);
        else
            result = await objConnection.query(strQuery);
        return result;
    } catch (error) {
        throw new errHandler(error);
    } finally {
        objConnection.end();
    }

}