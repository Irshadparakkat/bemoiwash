export function getDateFormatChanger(dateInput, strDateFormat) {
  if (!dateInput || !strDateFormat) return null;
  let dateParts;
  let dateInputResult;
  let dateFormatParts;
  dateInput = dateInput.replace(/\-/g, "/");
  dateParts = dateInput.split("/");
  strDateFormat = strDateFormat.replace(/\-/g, "/");
  dateFormatParts = strDateFormat.split("/");
  if (dateFormatParts.indexOf("dd") == 0) {
    dateInputResult = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }
  if (dateFormatParts.indexOf("dd") == 1) {
    dateInputResult = `${dateParts[2]}/${dateParts[0]}/${dateParts[1]}`;
  }
  return dateInputResult;
}
