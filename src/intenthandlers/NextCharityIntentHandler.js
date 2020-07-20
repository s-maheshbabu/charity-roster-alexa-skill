const APL_CONSTANTS = require("constants/APL");

const charityDetailsDocument = require("apl/document/CharityDetailsDocument.json");
const charityDetailsDatasource = require("apl/data/CharityDetailsDatasource");

const APL_DOCUMENT_TYPE = APL_CONSTANTS.APL_DOCUMENT_TYPE;
const APL_DOCUMENT_VERSION = APL_CONSTANTS.APL_DOCUMENT_VERSION;

const MAX_CHARITIES_TO_DISPLAY =
  APL_CONSTANTS.MAX_CHARITIES_TO_DISPLAY;

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

  return responseBuilder
    .speak(
      `Here is a charity suggestion. ${suggestion.name}. Do you want to donate?`
    )
    .reprompt(`Do you want to donate to them? You can ask me to skip.`)
    .withShouldEndSession(false)
    .addDirective({
      type: APL_DOCUMENT_TYPE,
      version: APL_DOCUMENT_VERSION,
      document: charityDetailsDocument,
      datasources: charityDetailsDatasource(
        suggestion.name,
        JSON.stringify(suggestion.metadata),
        "Alexa donation phrase"
      )
    })
    .getResponse();
}
