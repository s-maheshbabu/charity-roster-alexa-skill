const alexaCharities = require('../resources/data/UseThisDataForNow.json');
const hasIn = require("immutable").hasIn;
const utilities = require("./utilities");

const DEDUCTIBLE = 'Contributions are deductible';

const CANDIDATE_CHARITY_ARRAY_SIZE = 3;
const MAX_ATTEMPTS_TO_BUILD_CANDIDATE_LIST = 1000;
const PROBABILITY_OF_SPARSE_DETAIL_CHARITIES_BEING_SELECTED = 0.1;
const PROBABILITY_OF_CANDIDATE_LIST_GETTING_REFRESHED = 0.95;
var candidateCharities = alexaCharities;

module.exports.findCharities = (categoryId, isTaxDeductible) => {
    console.log(`Search criteria: CategoryId = ${categoryId} and Tax Deductibility = ${isTaxDeductible}`);

    const toBeReturned = [];

    if (isTaxDeductible) return alexaCharities.filter(charity => charity.metadata.irsClassification.deductibility === DEDUCTIBLE);
    else return toBeReturned;
}

/**
 * Doc
 */
module.exports.getRandomCharities = () => {
    refreshCandidateCharities();
    return utilities.shuffle([...candidateCharities]);
};

module.exports.getBasicDetails = (charity) => {
    let charityDescription = ``;

    if (
        hasIn(charity, [
            "metadata",
            "mission"
        ]) && charity.metadata.mission !== null
    )
        charityDescription += `<amazon:domain name="news">${charity.metadata.mission}. </amazon:domain>`;

    else {
        if (
            hasIn(charity, [
                "metadata",
                "category",
                "categoryName"
            ]) && charity.metadata.category.categoryName !== null
        )
            charityDescription += `<amazon:domain name="news">It operates in the ${charity.metadata.category.categoryName} sector. </amazon:domain>`;

        if (
            hasIn(charity, [
                "metadata",
                "cause",
                "causeName"
            ]) && charity.metadata.cause.causeName !== null
        )
            charityDescription += `<amazon:domain name="news">focusing on ${charity.metadata.cause.causeName}. </amazon:domain>`;

        if (
            hasIn(charity, [
                "metadata",
                "mailingAddress",
                "stateOrProvince"
            ]) && charity.metadata.mailingAddress.stateOrProvince !== null && hasIn(charity, [
                "metadata",
                "mailingAddress",
                "city"
            ]) && charity.metadata.mailingAddress.city !== null
        )
            charityDescription += `It is based out of <say-as interpret-as="address">${charity.metadata.mailingAddress.city}, ${charity.metadata.mailingAddress.stateOrProvince}</say-as>. `;
    }

    return charityDescription;
};

module.exports.getAdditionalDetails = (charity) => {
    let charityDescription = `<amazon:domain name="conversational">Okay. </amazon:domain>`;

    if (
        hasIn(charity, [
            "metadata",
            "mission"
        ]) && charity.metadata.mission !== null
    ) {
        if (
            hasIn(charity, [
                "metadata",
                "category",
                "categoryName"
            ]) && charity.metadata.category.categoryName !== null
        )
            charityDescription += `<amazon:domain name="news">${charity.name} operates in the ${charity.metadata.category.categoryName} sector. </amazon:domain>`;

        if (
            hasIn(charity, [
                "metadata",
                "cause",
                "causeName"
            ]) && charity.metadata.cause.causeName !== null
        )
            charityDescription += `<amazon:domain name="news">focusing on ${charity.metadata.cause.causeName}. </amazon:domain>`;
    }

    if (
        hasIn(charity, [
            "metadata",
            "mailingAddress",
            "stateOrProvince"
        ]) && charity.metadata.mailingAddress.stateOrProvince !== null && hasIn(charity, [
            "metadata",
            "mailingAddress",
            "city"
        ]) && charity.metadata.mailingAddress.city !== null
    )
        charityDescription += `<amazon:domain name="news">${charity.name} is based out of <say-as interpret-as="address">${charity.metadata.mailingAddress.city}, ${charity.metadata.mailingAddress.stateOrProvince}. </say-as></amazon:domain>`;

    if (
        hasIn(charity, [
            "metadata",
            "mailingAddress",
            "streetAddress1"
        ]) && charity.metadata.mailingAddress.streetAddress1 !== null && hasIn(charity, [
            "metadata",
            "mailingAddress",
            "postalCode"
        ]) && charity.metadata.mailingAddress.postalCode !== null
    )
        charityDescription += `<amazon:domain name="news">Their address is <say-as interpret-as="address">${charity.metadata.mailingAddress.streetAddress1}, ${charity.metadata.mailingAddress.postalCode}. </say-as></amazon:domain>`;

    return charityDescription;
};

// --------------- Helper Functions -----------------------
function refreshCandidateCharities() {
    // Refresh the candidates list only about 5% of the time.
    if (Math.random() > PROBABILITY_OF_CANDIDATE_LIST_GETTING_REFRESHED) return;
    console.log("Candidate charities being refreshed");

    let maxCharitiesToConsider = 0, richDetailCharities = 0, sparseDetailCharities = 0;

    const map = new Map(); // This is to help us avoid picking the same charity multiple times.
    while (map.size < CANDIDATE_CHARITY_ARRAY_SIZE && ++maxCharitiesToConsider < MAX_ATTEMPTS_TO_BUILD_CANDIDATE_LIST /* prevents infinite loop */) {
        const random = Math.random();
        const randomCandidate = alexaCharities[Math.floor(Math.random() * alexaCharities.length)];

        // We want to bias towards charities that have a mission statement and so we add them with a higher probability to the list of candidates.
        if (
            hasIn(randomCandidate, [
                "metadata",
                "mission"
            ]) && randomCandidate.metadata.mission !== null && random >= PROBABILITY_OF_SPARSE_DETAIL_CHARITIES_BEING_SELECTED
        ) {
            richDetailCharities++;
            map.set(randomCandidate.name, randomCandidate);
        }
        else if (random < PROBABILITY_OF_SPARSE_DETAIL_CHARITIES_BEING_SELECTED) {
            sparseDetailCharities++;
            map.set(randomCandidate.name, randomCandidate);
        }
    }

    candidateCharities = [...map.values()];
    console.log(`A candidate charity list of size ${candidateCharities.length} was built after considering ${maxCharitiesToConsider} charities. It contains a total of ${richDetailCharities} rich detailed charities and ${sparseDetailCharities} sparse detailed charities.`);
}