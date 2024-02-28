import errHandler from '../../../core/helpers/errHandler'
export async function getTradeAmount({
    userId,
    objDbConnection
}) {
    try {
        //get last amount
        const strGetAmountQoery = `${strSumQuery} AND "userId" = ${userId}`;
        const {
            rows: arrGetAmount
        } = await objDbConnection.query(strGetAmountQoery)
        const objTrade = (arrGetAmount && arrGetAmount[0] && arrGetAmount[0]) ? arrGetAmount[0] : {
            intDebitAmount: 0,
            intCreditAmount: 0
        };
        const intTotalAmont = Number(objTrade["intCreditAmount"]) - Number(objTrade["intDebitAmount"])
        return {
            intTotalAmont,
            ...objTrade
        }
    } catch (error) {
        throw new errHandler(error);
    }

}

const strSumQuery = ` SELECT SUM("intDebitAmount") AS "intDebitAmount",
SUM("intCreditAmount") AS "intCreditAmount",
COUNT(*) FROM tbl_trade_amount
WHERE  "chrStatus"='N'`