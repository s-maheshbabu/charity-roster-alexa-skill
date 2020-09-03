const fetch = require("node-fetch");
const utilities = require("utilities");

const MAX_NUMBER_OF_RESULTS = 20;
const DEDUCTIBLE = 'Contributions are deductible';

/**
 * Returns charities meeting the search criteria.
 */
module.exports.findCharities = async (category, isTaxDeductible) => {
    console.log(`Search criteria: Category = ${category} and Tax Deductibility = ${isTaxDeductible}`);

    const categoryID = getCategoryId(category);
    const URL = `https://api.data.charitynavigator.org/v2/Organizations?app_id=4a10340d&app_key=198d6e42bfdf7c03ab7a486ef166d7e2&rated=true&pageSize=${MAX_NUMBER_OF_RESULTS}&categoryID=${categoryID}`;

    var searchResults;
    try {
        const response = await fetch(URL);
        searchResults = await response.json();
    } catch (error) {
        console.log(error);
    }

    const toBeReturned = [];
    await utilities.asyncForEach(searchResults, (candidateCharity) => {
        if (!candidateCharity) return;

        const { charityNavigatorURL, websiteURL, category, cause, advisories, organization, ...requiredDetailsOfCharity } = candidateCharity;

        const formattedCharity = { name: requiredDetailsOfCharity.charityName, metadata: requiredDetailsOfCharity };
        toBeReturned.push(formattedCharity);
    });

    if (isTaxDeductible) return toBeReturned.filter(charity => charity.metadata.irsClassification.deductibility === DEDUCTIBLE);
    else return toBeReturned;
};

function getCategoryId(category) {
    return 11;
}