//утилита для разделения полного имени на составные строки и приведения их к заглавной букве
export class ProcessFullNameUtils {
    static separation(fullNameString) {//разделяем строку с полным именем на части
        if (fullNameString && typeof fullNameString === "string") {
            const arrFullName = fullNameString.split(' ');
            return {
                name: this.firstLatterToUpperCase(arrFullName[0]),
                lastName: this.firstLatterToUpperCase(arrFullName[1]),
                sureName: (arrFullName[2]) ? this.firstLatterToUpperCase(arrFullName[2]) : '',
            }
        }
    }
    static firstLatterToUpperCase(word) {//приводим первую букву в слове к верхнему регистру
        if (word && typeof word === "string") {
            return word[0].toUpperCase() + word.slice(1);
        }
    }
}
