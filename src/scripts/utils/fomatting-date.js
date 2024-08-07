export class FormattingDate {
    static init(number) {
        if (String(number).length === 1) {
           number = '0' + number;
        }
        return number;
    }
}