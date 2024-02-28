export function getDbDate(dateInput, datFormat = "dd/MM/yyyy"): any {
  if (!dateInput) return null;
  let arrDateParts = dateInput.split("/");
  let dateInputResult = "";
  if (datFormat == "dd/MM/yyyy") {
    dateInputResult = `${arrDateParts[2]}/${arrDateParts[1]}/${arrDateParts[0]}`;
  } else if (datFormat == "yyyy/MM/dd") {
    dateInputResult = `${arrDateParts[2]}/${arrDateParts[1]}/${arrDateParts[0]}`;
  } else if (datFormat == "MM/dd/yyyy") {
    dateInputResult = `${arrDateParts[2]}/${arrDateParts[0]}/${arrDateParts[1]}`;
  }
  return dateInputResult;
}
