const STR_COMMON_DB_TENANT_ID = "postgres"
const STR_COMMON_DB = "moiwash"
const STR_COMMON_DB_USER_NAME = "postgres"
const STR_COMMON_DB_PASSWORD = "root123"
const STR_BUCKET_URL = ""
const INT_ESTIMATE_DELIVERY_DAYS = 10
const INT_MAX_MASTER_IMAGE_SIZE = 100
const INT_MAX_PRODUCT_IMAGE_SIZE = 512
const INT_MAX_PROFILE_IMAGE_SIZE = 50
const AWS_ACCESS_KEY_ID = "AKIA444CFGVCJ7VJ5T4E"
const AWS_SECRET_ACCESS_KEY = "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"
const AWS_S3_LOCATION = "ap-south-1"
const AWS_S3_MASTER_BUCKET = "swizbay"
const AWS_BUCKET_URL = "https://swizbay.s3.ap-south-1.amazonaws.com/";

const OBJ_DB_CONFIG = {
    moiwash: {
        user: "postgres",
        host: 'localhost',
        database: "moiwash",
        password: "root",
        strMongoDBName: "moiwash",
        port: 5432,
    },
}
const OBJ_MASTER_TYPE = {
    expense: true,
    vendor: true,
    purchase: true,
    material: true,
    rental_items: true,
}

const OBJ_ORDER_STATUS = {
    INCOMPLETED: 'INCOMPLETED',
    COMPLETED: 'COMPLETED',
    ACCEPTED: 'ACCEPTED',
    PRODUCTION: 'PRODUCTION',
    PACKED: 'PACKED',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED'
}
const OBJ_OPEN_TABLE = {
    tbl_materia: true,
    tbl_rental: true
}
const OBJ_Account_TYPE = {
    SUPPLIER: true,
    PARTY: true,
    CASH: true,
    BANK: true,
    VENDOR: true,
    SALARY: true,
    PURCHASE_COMMISION: true,
    OTHER_EXPENSE: true,
    OTHER_INCOME: true
}
const objAccountTypes = {
    "company": 0,
    "supplier": 1,
    "vendor": 2,
    "cash": 3,
    "bank": 4,
    "client": 5,
    "check": 6,
    "employee": 7,
    "other": 8
}

const strAccountCodeTaxPayable = 'ACC12';

const strAccountCodeTaxReceivable = 'ACC13';

const objAccountTypesDetails = {
    "supplier": {
        intAccountType: 1,
        strLedgerQuery: `(SELECT id FROM tbl_all_type WHERE "chrStatus"='N' AND "strType"='sub_ledger' AND  "strName" = 'Payable Ledger' LIMIT 1 ) `
    },
    "vendor": {
        intAccountType: 2,
        strLedgerQuery: `(SELECT id FROM tbl_all_type WHERE "chrStatus"='N' AND "strType"='sub_ledger' AND  "strName" = 'Payable Ledger' LIMIT 1 ) `
    },
    "cash": {
        intAccountType: 3,
        strLedgerQuery: `(SELECT id FROM tbl_all_type WHERE "chrStatus"='N' AND "strType"='sub_ledger' AND  "strName" = 'General Ledger' LIMIT 1 ) `
    },
    "bank": {
        intAccountType: 4,
        strLedgerQuery: `(SELECT id FROM tbl_all_type WHERE "chrStatus"='N' AND "strType"='sub_ledger' AND  "strName" = 'General Ledger' LIMIT 1 ) `
    },
    "client": {
        intAccountType: 5,
        strLedgerQuery: `(SELECT id FROM tbl_all_type WHERE "chrStatus"='N' AND "strType"='sub_ledger' AND  "strName" = 'Recivable Ledger' LIMIT 1 ) `
    },
    "check": {
        intAccountType: 6,
        strLedgerQuery: `(SELECT id FROM tbl_all_type WHERE "chrStatus"='N' AND "strType"='sub_ledger' AND  "strName" = 'Recivable Ledger' LIMIT 1 ) `
    },
    "employee": {
        intAccountType: 7,
        strLedgerQuery: `(SELECT id FROM tbl_all_type WHERE "chrStatus"='N' AND "strType"='sub_ledger' AND  "strName" = 'Pay Roll Ledger' LIMIT 1 ) `
    },
    "other": {
        intAccountType: 8,
        strLedgerQuery: `(SELECT id FROM tbl_all_type WHERE "chrStatus"='N' AND "strType"='sub_ledger' AND  "strName" = 'General Ledger' LIMIT 1 ) `
    },
    "taxPayable": {
        strAccountCode: strAccountCodeTaxPayable,
        strLedgerQuery: `(SELECT id FROM tbl_account WHERE "chrStatus"='N'  AND "strAccountCode"='${strAccountCodeTaxPayable}' LIMIT 1 ) `
      },
      "taxReceivable": {
        strAccountCode: strAccountCodeTaxReceivable,
        strLedgerQuery: `(SELECT id FROM tbl_account WHERE "chrStatus"='N'  AND "strAccountCode"='${strAccountCodeTaxReceivable}' LIMIT 1 ) `
      }

}
const objTransactionModules = {
    "EXPENSE_ENTRY": {
        table: "tbl_expenses",
        DOC_ID_PREFIX: "EXP"
    },
    "CLIENT_PAYMENT": {
        table: "tbl_client_payments",
        DOC_ID_PREFIX: "PYT"
    },
    "PURCHASE_ORDER": {
        table: "tbl_purchase_order",
        DOC_ID_PREFIX: "PCH"
    },
    "SUB_CONTRACT": {
        table: "tbl_subcontract",
        DOC_ID_PREFIX: "STR"
    },
    "OTHER_EXPENSES": {
        table: "",
        DOC_ID_PREFIX: "OEX"
    },
    "CONTRACTING": {
        table: "",
        DOC_ID_PREFIX: "CTR"
    },
    "JOURNAL_ENTRY": {
        table: "tbl_journal_entry",
        DOC_ID_PREFIX: "JNR"
    },
    "SCHEDULE_INVOICE": {
        table: "tbl_invoice",
        DOC_ID_PREFIX: "INV"
    },
    "PAY_ROLL": {
        table: "",
        DOC_ID_PREFIX: "PRL"
    },
}

const objFilteresAndTables = {
    "strClientName": {
        table: "tbl_client",
        col: "strClientName"
    },
    "strManager": {
        table: "tbl_user",
        col: "strFullName",
        where:` WHERE "fkUserType" = (SELECT id FROM tbl_all_type WHERE "chrStatus"='N' AND "strType"='user' AND  "strName" = 'Manager') `
    },
    "strJuniorSupervisor":{
        table: "tbl_user",
        col: "strFullName",
        where:` WHERE "fkUserType" = (SELECT id FROM tbl_all_type WHERE "chrStatus"='N' AND "strType"='user' AND  "strName" = 'Site Engineer') `},
    "strProjectName": {
        table: "tbl_project",
        col: "strProjectName"
    },
    "strSupplier": {
        table: "tbl_account",
        col: "strAccountName"
    },
    "strStatus": {
        table: "tbl_purchase_order",
        col: "strStatus"
    },
    "strCategory": {
        table: "tbl_expenses",
        col: "strCategory"
    },
    "strContractor": {
        table: "tbl_account",
        col: "strAccountName"
    },
    "strModuleName": {
        table: "tbl_transaction",
        col: "strModulePrefix"
    }


}
module.exports = {
    STR_COMMON_DB_TENANT_ID,
    STR_COMMON_DB,
    STR_COMMON_DB_USER_NAME,
    STR_COMMON_DB_PASSWORD,
    STR_BUCKET_URL,
    INT_ESTIMATE_DELIVERY_DAYS,
    INT_MAX_MASTER_IMAGE_SIZE,
    INT_MAX_PRODUCT_IMAGE_SIZE,
    INT_MAX_PROFILE_IMAGE_SIZE,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_LOCATION,
    AWS_S3_MASTER_BUCKET,
    AWS_BUCKET_URL,
    OBJ_DB_CONFIG,
    OBJ_MASTER_TYPE,
    OBJ_OPEN_TABLE,
    OBJ_Account_TYPE,
    objAccountTypes,
    objTransactionModules,
    objFilteresAndTables,
    objAccountTypesDetails
}