import errHandler from '../../../core/helpers/errHandler'
export async function getQueryRunner({
    strQuery,
    objDbConnection
}) {
    try {
        /**Quer Running */
        const objResult = await objDbConnection.query(strQuery)
        return objResult
    } catch (error) {
        throw new errHandler(error);
    }

}