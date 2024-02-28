export function getIsoDate(dateInput: Date = new Date()): any {
  dateInput = new Date(dateInput);
  return dateInput
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");
}
