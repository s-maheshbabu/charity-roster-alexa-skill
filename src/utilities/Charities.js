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

// --------------- Utility functions -----------------------

