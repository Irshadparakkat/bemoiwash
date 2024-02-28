import errHandler from '../../../core/helpers/errHandler'
export async function updateWalletAmount({
    userId,
    strDocId,
    intAmount,
    intBaseAmount,
    roe,
    timReceived,
    createdBy,
    objDbConnection
}) {
    try {
        //get last amount
        const strGetAmountQoery = `SELECT id,"intAmount" FROM tbl_wallet_amount WHERE "userId" = ${userId} AND "chrStatus"='N' ORDER BY DESC LIMIT 1`;
        const {
            rows: arrGetAmount
        } = await objDbConnection.query(strGetAmountQoery)
        const id =(arrGetAmount && arrGetAmount[0] && arrGetAmount[0]["id"]) ?arrGetAmount[0]["id"] : 0;
        //add new amount
        const intNewAmount = (arrGetAmount && arrGetAmount[0] && arrGetAmount[0]["intAmount"]) ? Number(arrGetAmount[0]["intAmount"]) + intAmount : 0;
        if (intNewAmount < 0)
            throw new errHandler("YOUR ACCOUNT HAVE NO PROPER BALANCE")
        //insert amount
        const strUpdateQuery = `UPDATE tbl_wallet_amount SET "chrStatus"='E'
                                      "updatedBy" = ${createdBy},
                                      "updatedTime"='${timReceived}'
                                       WHERE ${id?'id ='+id:'"chrStatus"=\'N\' AND "userId"='+userId}`
        const strInsertQuery = `INSERT INTO ("intAmount","intTotalAmount","intBaseAmount","roe",  "userId", "strDocId",  "createdBy",  "createdTime" ) 
                                       VALUES (${intAmount},${intNewAmount},${intBaseAmount},${roe},${userId},'${strDocId}',${createdBy},'${timReceived}');`
        /**Quer Running */
        await objDbConnection.query(strUpdateQuery);
        const objInsertResult = await objDbConnection.query(strInsertQuery);
        return objInsertResult
    } catch (error) {
        throw new errHandler(error);
    }

}