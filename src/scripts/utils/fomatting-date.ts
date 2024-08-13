export class FormattingDate {
    public static init(number: number): string {
        let numberString: string = number.toString();
        if (String(number).length < 2) {
            numberString = '0' + number;
        }
        return numberString;
    }
}