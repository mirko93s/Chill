/**
 * @param {Number} number 
 * @returns {String} formatted number
 * @example 1234 => 1.2K
 */
module.exports = function (number) {
    let formatted = number;
    if (number >= 10**3) {
        const suffix = ['K','M','B','T'];
        var selector = -1;    
        do {
            formatted /= 10**3;
            selector++;
        } while (formatted >= 10**3);
        formatted = `${parseFloat(number/10**((selector+1)*3)).toFixed(1)}${suffix[selector] !== undefined ? ` ${suffix[selector]}` : `e${(selector+1)*3}`}`;
    }
    return formatted;
};