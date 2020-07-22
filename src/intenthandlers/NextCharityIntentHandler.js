const APL_CONSTANTS = require("constants/APL");
const charityManager = require("../charityManager");
const utilities = require("../utilities");

const charityDetailsDocument = require("apl/document/CharityDetailsDocument.json");
const charityDetailsDatasource = require("apl/data/CharityDetailsDatasource");

const APL_DOCUMENT_TYPE = APL_CONSTANTS.APL_DOCUMENT_TYPE;
const APL_DOCUMENT_VERSION = APL_CONSTANTS.APL_DOCUMENT_VERSION;

const SOUND_EFFECT = "<audio src=\"soundbank://soundlibrary/alarms/beeps_and_bloops/tone_02\"/>";

module.exports = NextCharityIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name === "AMAZON.NextIntent" ||
        handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent")
    );
  },
  handle(handlerInput) {
    const { attributesManager, responseBuilder } = handlerInput;

    const sessionAttributes = attributesManager.getSessionAttributes() || {};
    if (
      Array.isArray(sessionAttributes.charities) &&
      sessionAttributes.charities.length
    )
      return renderSuggestedCharity(handlerInput);

    console.log(`Ran out of cached charities. If this is happening too often, we might want to support dynamically fetching more charities.`);
    return responseBuilder
      .speak(
        `That is all I have for now. Please come back later to learn about more charities.`
      )
      .addDirective({
        type: APL_DOCUMENT_TYPE,
        version: APL_DOCUMENT_VERSION,
        document: charityDetailsDocument,
        datasources: charityDetailsDatasource(
          `Thank you.`,
          'Thank you for learning about these charities. That is all I have for now.',
          "Please came back later to learn about more charities."
        )
      })
      .withShouldEndSession(true)
      .getResponse();
  }
};

/*
Documentation
*/
function renderSuggestedCharity(handlerInput) {
  const { attributesManager, responseBuilder } = handlerInput;

  const sessionAttributes = attributesManager.getSessionAttributes();
  const suggestedCharities = sessionAttributes.charities;

  const suggestion = suggestedCharities.shift();
  sessionAttributes.currentCharity = suggestion;
  attributesManager.setSessionAttributes(sessionAttributes);

  const alexaDonationPhrase = suggestion.alexaDonationPhrase;
  const charityDescription = charityManager.getBasicDetails(suggestion);
  return responseBuilder
    .speak(
      `Here is a charity you might like. ${suggestion.name}. ${charityDescription} ${SOUND_EFFECT} Would you like to know how to donate to ${suggestion.name}?`
    )
    .reprompt(`Would you like to know how to donate to ${suggestion.name}? You won't be making a donation yet but I can give you instructions on how to donate. You can ask me to skip this charity if you want to learn about a different charity.`)
    .withShouldEndSession(false)
    .addDirective({
      type: APL_DOCUMENT_TYPE,
      version: APL_DOCUMENT_VERSION,
      document: charityDetailsDocument,
      datasources: charityDetailsDatasource(
        suggestion.name,
        utilities.cleanupForVisualPresentation(charityDescription),
        `You can donate to them by saying, "${alexaDonationPhrase}"`
      )
    })
    .getResponse();
}
