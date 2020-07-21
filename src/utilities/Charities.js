const allCharities = require('../../resources/data/UseThisDataForNow.json');
const hasIn = require("immutable").hasIn;

const CANDIDATE_CHARITY_ARRAY_SIZE = 50;
const MAX_ATTEMPTS_TO_BUILD_CANDIDATE_LIST = 1000;
const PROBABILITY_OF_SPARSE_DETAIL_CHARITIES_BEING_SELECTED = 0.1;
const PROBABILITY_OF_CANDIDATE_LIST_GETTING_REFRESHED = 0.95;
var candidateCharities = allCharities;

/**
 * Doc
 */
module.exports.getRandomCharities = () => {
    refreshCandidateCharities();
    return shuffle([...candidateCharities]);
};

// --------------- Utility functions -----------------------
function refreshCandidateCharities() {
    // Refresh the candidates list only about 5% of the time.
    if (Math.random() > PROBABILITY_OF_CANDIDATE_LIST_GETTING_REFRESHED) return;
    console.log("Candidate charities being refreshed");

    let maxCharitiesToConsider = 0, richDetailCharities = 0, sparseDetailCharities = 0;
    candidateCharities = new Array();
    while (candidateCharities.length < CANDIDATE_CHARITY_ARRAY_SIZE && ++maxCharitiesToConsider < MAX_ATTEMPTS_TO_BUILD_CANDIDATE_LIST /* prevents infinite loop */) {
        const random = Math.random();
        const randomCandidate = allCharities[Math.floor(Math.random() * allCharities.length)];

        // We want to bias towards charities that have a mission statement and so we add them with a higher probability to the list of candidates.
        if (
            hasIn(randomCandidate, [
                "metadata",
                "mission"
            ]) && randomCandidate.metadata.mission !== null && random >= PROBABILITY_OF_SPARSE_DETAIL_CHARITIES_BEING_SELECTED
        ) {
            richDetailCharities++;
            candidateCharities.push(randomCandidate);
        }
        else if (random < PROBABILITY_OF_SPARSE_DETAIL_CHARITIES_BEING_SELECTED) {
            sparseDetailCharities++;
            candidateCharities.push(randomCandidate);
        }
    }

    console.log(`A candidate charity list of size ${candidateCharities.length} was built after considering ${maxCharitiesToConsider} charities. It contains a total of ${richDetailCharities} rich detailed charities and ${sparseDetailCharities} sparse detailed charities.`);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}