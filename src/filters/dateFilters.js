export function date_format(value) {
    if (!value) return '';
    //let giorno = value.getDate();
    //let mese = value.getMonth() + 1;
    //let anno = value.getFullYear();
    return value.substring(0, 10).replace('-', '/'); //`${giorno}/${mese}/${anno}`;
}