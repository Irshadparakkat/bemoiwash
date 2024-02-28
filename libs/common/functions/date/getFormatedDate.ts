export function getFormatedDate(dateInput): any {
  if (!dateInput) return null;
  dateInput = new Date(dateInput);

  let dateInputResult =
    ("0" + dateInput.getDate()).slice(-2) +
    "/" +
    ("0" + (dateInput.getMonth() + 1)).slice(-2) +
    "/" +
    dateInput.getFullYear();
  return dateInputResult;
}
