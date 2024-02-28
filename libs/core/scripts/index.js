const combinator = require('foreach-combination');
const {
    errHandler,
    getMongoDbConnection
} = require('../helpers')
const {
    findMany
} = require("../../common/functions");
const makePriceChart = async ({
    productId,
    strTenantId,
    defualtPrice
}) => {

    const slabQuery = `SELECT s.id AS "slabId"
FROM tbl_product_slab as s
WHERE    s."fkProductId" = ${productId}`

    const varianceQuery = `SELECT v."strName" || '##' || vi."strName" AS "strName",v."strName" AS "strVarianceName" 
FROM tbl_product_variance v
INNER JOIN tbl_product_variance_items as vi ON vi."fkVarianceId" = v.id and v."isPricing" = 1  
WHERE v."fkProductId" = ${productId} `
    let strQuery = `INSERT INTO tbl_product_price_chart 
("fkProductId",
"objVarianceItems",
"fkSlabId",
"intPrice") VALUES 

`

    const objConnection = await getMongoDbConnection();
    try {
        //get slabs
        //get variance items
        let setVariance = new Set();
        const arrSlabResult = await findMany(slabQuery, objConnection);
        const arrVarianceResult = await findMany(varianceQuery, objConnection);
        let arrVarianceItems = [];
        let arrSlabs = []
        if (arrSlabResult && arrSlabResult.length)
            arrSlabs = arrSlabResult.map(item => item.slabId);
        else
            arrSlabs.push(1)
        if (arrVarianceResult && arrVarianceResult.length)
            arrVarianceItems = arrVarianceResult.map(item => {
                setVariance.add(item.strVarianceName);
                return item.strName
            });
        else {
            setVariance.add('{}');
            arrVarianceItems.push('{}')
        }
        const exoectedCount = arrVarianceItems.length * arrSlabs.length

        let subs, arrResult = [];
        await combinator(arrVarianceItems, setVariance.size || 1, function (...x) {
            console.log(x.length);
            console.log(x);
            if (x.length === (setVariance.size || 1)) {
                let obj = {}
                x.forEach(str => {
                    subs = str.split("##")
                    if (subs.length == 2)
                        obj[subs[0]] = subs[1]
                })
                if (Object.keys(obj).length === (setVariance.size || 1)) {
                    arrSlabs.forEach(slabId => {
                        strQuery += `
                (${productId},'${JSON.stringify(obj)}',${slabId},${defualtPrice}),`
                    })
                    arrResult.push(obj)
                } else if(Object.keys(obj).length == 0) {
                    arrSlabs.forEach(slabId => {
                        strQuery += ` (${productId},'{}',${slabId},${defualtPrice}),`
                    })
                    arrResult.push({})
                }
            }
        });
        const result = await objConnection.query(strQuery.replace(/.$/, ';')); 
        return {
            strQuery,
            count: result.rowCount,
            exoectedCount
        };
    } catch (error) {
        throw new errHandler(error).set()
    } finally {
        objConnection.end();
    }
}

module.exports = {
    makePriceChart
}