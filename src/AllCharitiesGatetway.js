const fetch = require("node-fetch");
const utilities = require("utilities");
const URL = require('url').URL;

const MAX_NUMBER_OF_RESULTS = 20;
const DEDUCTIBLE = 'Contributions are deductible';

/**
 * Returns charities meeting the search criteria.
 */
module.exports.findCharities = async (categoryId, isTaxDeductible) => {
    console.log(`Search criteria: CategoryId = ${categoryId} and Tax Deductibility = ${isTaxDeductible}`);

    const charityDetailsURL = new URL(`https://api.data.charitynavigator.org/v2/Organizations?app_id=4a10340d&app_key=198d6e42bfdf7c03ab7a486ef166d7e2&rated=true&pageSize=${MAX_NUMBER_OF_RESULTS}&categoryID=${categoryId}`);

    var searchResults;
    try {
        const response = await fetch(charityDetailsURL);
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