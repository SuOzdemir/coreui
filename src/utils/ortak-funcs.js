let globalToast = null;

export function setGlobalToast(ref) {
    globalToast = ref;
}

export function getGlobalToast() {
    return globalToast;
}

export function getDateStr(tarih) {
    if (!tarih) return null;
    const dt = new Date(tarih);
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
    const strs = dt.toISOString().split('T');
    return strs[0] + ' ' + strs[1].substr(0, 8);
}

export function getEkranAdi(ekranlar, screenId) {
    return ekranlar.find(val => val.id === screenId)?.name;
}

export function isEkranOnline({ lastUpdatedAt, updateSecond }) {
    const fark = new Date().getTime() - new Date(lastUpdatedAt).getTime();
    return  fark <= ((updateSecond + 60) * 1000);
}

export function getListeDegeri(liste, value, valueField = 'value', labelField = 'label' ) {
    const item = liste.find(val => val[valueField] === value);
    return item ? item[labelField] : null;
}
