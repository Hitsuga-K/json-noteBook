// -=-=-=-= Дополнительный штуки =-=-=-=-

const reindexIds = (notes) => {      //> функция рефакторинга
    return notes.map((note, index) => ({ ...note, id: index +1}) );
};

const formatDate = (format_date = new Date) => {
    return format_date.toLocaleString();
};

module.exports = {reindexIds, formatDate}   //> открывае для глобального использования