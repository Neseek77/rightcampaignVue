export const groupByFilter = function (array, key) {
    const result = {}
    array.forEach(item => {
        if (!result[item[key]]) {
            result[item[key]] = []
        }
        result[item[key]].push(item)
    })
    return result;
};
