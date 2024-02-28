import errHandler from '../../../core/helpers/errHandler'
export async function getWalletAmount({
    userId,
    objDbConnection
}) {
    try {
        //get last amount
        const strGetAmountQoery = `${strSumQuery} AND "userId" = ${userId}`;
        const {
            rows: arrGetAmount
        } = await objDbConnection.query(strGetAmountQoery)
        const objWallet = (arrGetAmount && arrGetAmount[0] && arrGetAmount[0]) ? arrGetAmount[0] : {
            intDebitAmount: 0,
            intCreditAmount: 0
        };
        const intTotalAmont = Number(objWallet["intCreditAmount"]) - Number(objWallet["intDebitAmount"])
        return {
            intTotalAmont,
            ...objWallet
        }
    } catch (error) {
        throw new errHandler(error);
    }

}

const strSumQuery = ` SELECT SUM("intDebitAmount") AS "intDebitAmount",
                             SUM("intCreditAmount") AS "intCreditAmount"
                             FROM tbl_wallet_amount
                             WHERE  "chrStatus"='N' AND "strStatus"='COMPLETED'`