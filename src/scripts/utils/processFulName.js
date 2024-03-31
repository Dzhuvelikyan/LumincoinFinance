export class ProcessFulName {
    static separation(fullNameString) {
        if (fullNameString && typeof fullNameString === "string") {
            const arrFullName = fullNameString.split(' ');
            return {
                name: this.firstLatterToUpperCase(arrFullName[0]),
                lastName: this.firstLatterToUpperCase(arrFullName[1]),
                sureName: (arrFullName[2]) ? this.firstLatterToUpperCase(arrFullName[2]) : '',
            }
        }
    }
    static firstLatterToUpperCase(word) {
        if (word && typeof word === "string") {
            return word[0].toUpperCase() + word.slice(1);
        }
    }
}
