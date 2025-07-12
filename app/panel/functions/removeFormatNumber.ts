export function removeFormatNumber(formattedNumber:string) {
    return formattedNumber.replace(/,/g, '');
}