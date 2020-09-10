const fetch = require("node-fetch");
const fs = require('fs');
const stringify = require('json-stable-stringify');
const URL = require('url').URL;
const charities = require('./alexa_charities.json');

const HIGH_CONFIDENCE_RESULTS = "HighConfidenceResults.txt";
const LOW_CONFIDENCE_RESULTS = "LowConfidenceResults.txt";

fs.appendFileSync(HIGH_CONFIDENCE_RESULTS, `Touching file to make sure it exists.`);
fs.unlinkSync(HIGH_CONFIDENCE_RESULTS);
fs.appendFileSync(LOW_CONFIDENCE_RESULTS, `Touching file to make sure it exists.`);
fs.unlinkSync(LOW_CONFIDENCE_RESULTS);

/* 
Use this line when you want to make only a few calls for testing the script 
asyncForEach(charities.slice(10, 13), obtainCharityDetails);
*/
asyncForEach(charities, obtainCharityDetails);

async function obtainCharityDetails(charity) {
    const query = charity.name;
    const charityDetailsURL = new URL(`https://api.data.charitynavigator.org/v2/Organizations?app_id=4a10340d&app_key=198d6e42bfdf7c03ab7a486ef166d7e2&pageSize=5&searchType=NAME_ONLY&search=${query}`);
    console.log(`Processing ${query}`);

    var allDetailsCharitiesArray;
    try {
        const response = await fetch(charityDetailsURL);
        allDetailsCharitiesArray = await response.json();
    } catch (error) {
        console.log(error);
    }

    let numberOfHighConfidenceMatches = 0;
    let highConfidenceMatchingCharity;
    await asyncForEach(allDetailsCharitiesArray, (allDetailsCharity) => {
        if (!allDetailsCharity) return;

        if (allDetailsCharity.charityName.toLowerCase().includes(query.toLowerCase())) {
            numberOfHighConfidenceMatches++;

            highConfidenceMatchingCharity = `{"name": "${charity.name}",\n`;
            highConfidenceMatchingCharity += `"alexaDonationPhrase": "${charity.utterance}",\n`;
            const { advisories, organization, ...requiredDetailsCharity } = allDetailsCharity;
            // Stable stringify such that charity name and ein stay at the top. This is just to make is easier for human reading the file.
            highConfidenceMatchingCharity += `"metadata": ${stringify(requiredDetailsCharity, function (a, b) {
                if (a.key === 'charityName') return -1;
                else if (b.key === 'charityName') return 1;
                else if (a.key === 'ein') return -1;
                else if (b.key === 'ein') return 1;

                return a.key > b.key ? 1 : -1;
            })}},\n`;
        }
    });
    if (numberOfHighConfidenceMatches == 1) {
        fs.appendFileSync(HIGH_CONFIDENCE_RESULTS, highConfidenceMatchingCharity);
        return;
    }

    fs.appendFileSync(LOW_CONFIDENCE_RESULTS, `\n`);
    fs.appendFileSync(LOW_CONFIDENCE_RESULTS, `{"name": "${charity.name}",\n`);
    fs.appendFileSync(LOW_CONFIDENCE_RESULTS, `"alexaDonationPhrase": "${charity.utterance}",\n`);

    asyncForEach(allDetailsCharitiesArray, (allDetailsCharity) => {
        const { advisories, organization, ...requiredDetailsCharity } = allDetailsCharity;
        // Stable stringify such that charity name and ein stay at the top. This is just to make is easier for human reading the file.
        fs.appendFileSync(LOW_CONFIDENCE_RESULTS, `"metadata": ${stringify(requiredDetailsCharity, function (a, b) {
            if (a.key === 'charityName') return -1;
            else if (b.key === 'charityName') return 1;
            else if (a.key === 'ein') return -1;
            else if (b.key === 'ein') return 1;

            return a.key > b.key ? 1 : -1;
        })}},\n`);
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        try {
            await callback(array[index], index, array);
        } catch (error) {
            console.log(error);
        }
    }
}