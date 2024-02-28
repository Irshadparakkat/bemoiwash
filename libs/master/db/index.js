const strQueryMasterModule = `SELECT id,"strName" FROM tbl_master_module WHERE "chrStatus" = 'N' `;
const strQueryMasterItems = ` SELECT id,"strName","fkMasterModuleId" FROM tbl_master_items
                              WHERE "chrStatus" = 'N' AND "fkMasterModuleId" = {MODULE_ID}`;





    const packageInsertDb = ({
                            strPckName,
                            intNoDays,
                            intPriceAmt,
                            strUserId,
                            timReceived
                        }) => {
                            return {
                                strQuery: `INSERT INTO tbl_packages (
                                    "strPckName",
                                    "intNoDays",
                                    "intPriceAmt",
                                    "updatedBy",
                                    "updatedTime"
                                ) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
                                arrParams: [
                                    strPckName,
                                    intNoDays,
                                    intPriceAmt,
                                    strUserId,
                                    timReceived,
                                ]
                            };
                        };
                        
                        const packageUpdateDb = ({
                            id,
                            strPckName,
                            intNoDays,
                            intPriceAmt,
                            strUserId,
                            timReceived
                        }) => {
                            return {
                                strQuery: `UPDATE tbl_packages SET 
                                    "strPckName" = $1,
                                    "intNoDays" = $2,
                                    "intPriceAmt" = $3, 
                                    "updatedBy" = $4,
                                    "updatedTime" = $5
                                    WHERE id = $6;`,
                                arrParams: [
                                    strPckName,
                                    intNoDays,
                                    intPriceAmt,
                                    strUserId,
                                    timReceived,
                                    id, 
                                ]
                            };
                        };

                        
                     
module.exports = {
                                                        
                                                                          
                                                                           strQueryMasterModule,
                                                                           strQueryMasterItems,
                                                                           
                                                                           packageInsertDb,
                                                                         
                                                                           packageUpdateDb,
                                                                             

                                                                     }