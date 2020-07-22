const APL_CONSTANTS = require("constants/APL");
const charityManager = require("../charityManager");
const utilities = require("../utilities");

const charityDetailsDocument = require("apl/document/CharityDetailsDocument.json");
const charityDetailsDatasource = require("apl/data/CharityDetailsDatasource");

const APL_DOCUMENT_TYPE = APL_CONSTANTS.APL_DOCUMENT_TYPE;
const APL_DOCUMENT_VERSION = APL_CONSTANTS.APL_DOCUMENT_VERSION;

const SOUND_EFFECT = "<audio src=\"soundbank://soundlibrary/alarms/beeps_and_bloops/tone_02\"/>";

module.exports = LearnMoreIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "LearnMoreIntent"
    );
  }, handle(handlerInput) {
    const { attributesManager, responseBuilder } = handlerInput;

    const sessionAttributes = attributesManager.getSessionAttributes() || {};
    if (
      sessionAttributes.currentCharity
    )
      return renderAdditionalDetails(handlerInput);

    return responseBuilder
      .speak("Sorry, something went wrong. Please try again.")
      .withShouldEndSession(true)
      .getResponse();
  }
}

/*
Documentation
*/
function renderAdditionalDetails(handlerInput) {
  const { attributesManager, responseBuilder } = handlerInput;

  const sessionAttributes = attributesManager.getSessionAttributes();
  const currentCharity = sessionAttributes.currentCharity;

  const alexaDonationPhrase = currentCharity.alexaDonationPhrase;

  const charityAdditionalDetails = charityManager.getAdditionalDetails(currentCharity);
  return responseBuilder
    .speak(
      `${charityAdditionalDetails} ${SOUND_EFFECT} Would you like to know how to donate to ${currentCharity.name}?`
    )
    .withShouldEndSession(false)
    .reprompt(`Would you like to know how to donate to ${currentCharity.name}? You won't be making a donation yet but I can give you instructions on how to donate. You can ask me to skip this charity if you want to learn about a different charity.`)
    .addDirective({
      type: APL_DOCUMENT_TYPE,
      version: APL_DOCUMENT_VERSION,
      document: charityDetailsDocument,
      datasources: charityDetailsDatasource(
        currentCharity.name,
        utilities.cleanupForVisualPresentation(charityAdditionalDetails),
        `You can donate to them by saying, "${alexaDonationPhrase}"`
      )
    })
    .getResponse();
}