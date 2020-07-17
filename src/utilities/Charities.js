const data = require('../../resources/data/data.json');

/**
 * Checks the lower case version and the title case version of
 * the input and if both are recognized as misspelled, returns
 * true.
 * @param {*} input word whose spelling is to be checked.
 */
module.exports.getRandomCharities = () => {
    return [data.charities[0].name, data.charities[3].name, data.charities[4].name];
};

/**
 * Obtains spell suggestions for the given word. If there are no
 * suggestions, an empty array is returned.
 *
 * @param {*} input word for which spell suggestions are to
 * be obtained.
 */
module.exports.getSuggestedSpellings = input => {
    return SpellChecker.suggest(input);
};

// --------------- Utility functions -----------------------
/**
 * Converts given string to title case. For example, san diEGo
 * would be converted to San Diego.
 * @param {*} input the string to be title cased.
 */
function toTitleCase(input) {
    return input.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
