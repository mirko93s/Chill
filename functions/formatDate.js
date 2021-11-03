/**
 * @param {String} date 
 * @returns formatted date in en-US standard
 */
module.exports = function (date) {
    return new Intl.DateTimeFormat('en-US').format(date);
}