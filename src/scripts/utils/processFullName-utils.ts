//утилита для разделения полного имени на составные строки и приведения их к заглавной букве
export class ProcessFullNameUtils {
    public static separation(fullNameString :string): { name: string, lastName: string, sureName?: string, } | null {//разделяем строку с полным именем на части
        if (fullNameString) {
            const arrFullName: string[] = fullNameString.split(' ');
            return {
                name: this.firstLatterToUpperCase(arrFullName[0]),
                lastName: this.firstLatterToUpperCase(arrFullName[1]),
                sureName: (arrFullName[2]) ? this.firstLatterToUpperCase(arrFullName[2]) : '',
            } as {
                name: string,
                lastName: string,
                sureName?: string,
            }
        } else {
            return null;
        }
    }
    private static firstLatterToUpperCase(word: string): string | undefined {//приводим первую букву в слове к верхнему регистру
        if (word) {
            return word[0].toUpperCase() + word.slice(1);
        }
    }
}
