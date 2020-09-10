const fs = require('fs');

// The file that contains charities supported by Alexa and their corresponding donation utterance.
const originalAlexaSupportedCharities = require('./alexa_charities.json');

// The charity objects to which their Alexa utterance phrase should be added.
const charitiesToModify = require('./UseThisDataForNow.json');

// File to write the output to.
const OUTPUT = "UseThisDataForNow_Output.json";

fs.appendFileSync(OUTPUT, `Touching file to make sure it exists.`);
fs.unlinkSync(OUTPUT);
fs.appendFileSync(OUTPUT, `[\n`);

/* 
Use this line when you want to make only a few calls for testing the script 
asyncForEach(charitiesToModify.slice(0, 4), obtainCharityDetails);
*/
asyncForEach(charitiesToModify, addAlexaUtterance);

async function addAlexaUtterance(charityToModify) {
    const name = charityToModify.name;

    charityToModify.alexaDonationPhrase = null;
    for (let index = 0; index < originalAlexaSupportedCharities.length; index++) {
        if (originalAlexaSupportedCharities[index].name === name) {
            charityToModify.alexaDonationPhrase = originalAlexaSupportedCharities[index].utterance;
        }
    }
    fs.appendFileSync(OUTPUT, `${JSON.stringify(charityToModify)}, \n`);
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        try {
            await callback(array[index], index, array);
        } catch (error) {
            console.log(error);
        }
    }
    fs.appendFileSync(OUTPUT, `]`);
}