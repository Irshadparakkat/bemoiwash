
import errHandler from "../../../core/helpers/errHandler";
/**This Common function for Export csv file
 * @param  {arrItemList:Array of Objects || Array of Arrays,
 *         objColumns:{Object}||null,
 *         strMainTittle:String,
 *         strUserId:Number }
 * @returns strCSVData:String
 */
export async function getJSONToCSV({
  arrItemList,
  objColumns = null,
  strMainTittle,
  strUserId
}) {
  try {
    //Array of Arrays for CSV Data
    let arrCSVFormatList = [];
    //Array of keys from objColounm
    let arrCSVKeys = [];
    //Array of Headings of Colounms
    let arrCSVHeaders = [];
    //Length of a single row
    let intLengthOfRow = 0;
    if (objColumns) {
      //Loop for get keys of JSON(arrItemList) from colounm structure objColounm
      objColumns[Object.keys(objColumns)[0]].forEach(objItem => {
        if (objItem["blnShow"] == true) {
          intLengthOfRow++;
          arrCSVKeys.push(objItem["strKey"]);
          arrCSVHeaders.push(objItem["strHeader"]);
        }
      });
    }
    //Loop for get data from arrItemList and keep each row as array,
    //Final output is two diminsional array
    arrItemList.forEach(objItem => {
      let arrCSVFormatedItem = [];
      arrCSVKeys.forEach(strKeyItem => {
        arrCSVFormatedItem.push(objItem[strKeyItem]);
      });
      arrCSVFormatList.push(arrCSVFormatedItem);
    });
    let strCSVDelimiter = '"'; //TODO Need Dynamically get from settings
    let strCSVSeperator = ","; //TODO Need Dynamically get from settings
    let strCSVData = "";
    //set a Top level Tittle For CSV file
    let arrTittleRow = new Array(intLengthOfRow);
    arrTittleRow[(arrCSVHeaders.length / 2 - 1).toFixed(0)] = strMainTittle;
    strCSVData = arrTittleRow + "\n";
    //Set a Headings for each colounm
    strCSVData += arrCSVHeaders + "\n";
    //Set a Data for CSV
    let arrSingleRow = [];
    //Loop for set delimiter for all item and array convert into string data
    arrCSVFormatList.forEach(arrItem => {
      let strCSVColounm = "";
      arrSingleRow = arrItem;
      arrSingleRow.forEach(strItem => {
        strCSVColounm += `${strCSVDelimiter}${strItem.toString()}${strCSVDelimiter},`;
      });
      strCSVData += strCSVColounm + "\n";
    });
    //replace seperator dynamically
    strCSVSeperator += strCSVSeperator.replace(/,/g, strCSVSeperator);
    return strCSVData;
  } catch (error) {
    return new errHandler(error);
  }
}
