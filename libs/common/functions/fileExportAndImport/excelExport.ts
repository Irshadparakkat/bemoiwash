import xlsx from "node-xlsx";
import errHandler from "../../../core/helpers/errHandler";
/**
 * @param  {arrItemList:Array of Objects || Array of Arrays,
 *         objColumns:{Object}||null,
 *         strMainTittle:String,
 *         strUserId:Number }
 * @returns strExcelData:String
 */
export async function getJSONToExcel({
  arrItemList,
  objColumns = null,
  strMainTittle,
  strUserId
}) {
  try {
    //Array of Arrays for Excel Data
    let arrExcelFormatList = [];
    //Array of keys from objColounm
    let arrExcelKeys = [];
    //Array of Headings of Colounms
    let arrExcelHeaders = [];
    if (objColumns) {
      //Make Formatted array from arrItemList based on objColounms
      objColumns[Object.keys(objColumns)[0]].forEach(objItem => {
        if (objItem["blnShow"] == "true" || true) {
          arrExcelKeys.push(objItem["strKey"]);
          arrExcelHeaders.push(objItem["strHeader"]);
        }
      });
    }
    //Set Colounm Width based on length of heading
    let objExcelOptions = {
      "!cols": []
    };
    arrExcelHeaders.forEach(strHeading => {
      objExcelOptions["!cols"].push({ wch: strHeading.length + 3 });
    });
    let arrTittleRow = new Array();
    arrTittleRow[(arrExcelHeaders.length / 2 - 1).toFixed(0)] = strMainTittle;
    //set a Top level Tittle For Excel file
    arrExcelFormatList.push(arrTittleRow);
    //set Headings for colounms
    arrExcelFormatList.push(arrExcelHeaders);
    arrItemList.forEach(objItem => {
      let objExcelFormatedItem = [];
      arrExcelKeys.forEach(strKeyItem => {
        objExcelFormatedItem.push(objItem[strKeyItem]);
      });
      arrExcelFormatList.push(objExcelFormatedItem);
    });
    let objExcelBuffer = xlsx.build(
      [{ data: arrExcelFormatList }],
      objExcelOptions
    );
    return objExcelBuffer;
  } catch (error) {
    return new errHandler(error);
  }
}
