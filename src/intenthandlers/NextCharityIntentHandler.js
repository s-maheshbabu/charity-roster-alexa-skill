const STATES = require("constants/States").states;
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
      sessionAttributes.state === STATES.CURRENT_CHARITY_EIN &&
      Array.isArray(sessionAttributes.charities) &&
      sessionAttributes.charities.length
    )
      return renderSuggestedCharity(handlerInput);

    return responseBuilder
      .speak("Sorry, something went wrong. Please try again.")
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
  attributesManager.setSessionAttributes(sessionAttributes);

  if (suggestedCharities.length) {
    return responseBuilder
      .speak(
        `Here is a charity suggestion. ${suggestion}. Do you want to donate?`
      )
      .reprompt(`Do you want to donate to them? You can ask me to skip.`)
      .withShouldEndSession(false)
      .addDirective({
        type: APL_DOCUMENT_TYPE,
        version: APL_DOCUMENT_VERSION,
        document: charityDetailsDocument,
        datasources: charityDetailsDatasource(
          suggestion,
          `Say blah blah if you want to donate to them?`,
          suggestedCharities
            .slice(0, MAX_CHARITIES_TO_DISPLAY)
            .join(", ")
        )
      })
      .getResponse();
  } else {
    return responseBuilder
      .speak(
        `Here is a charity suggestion. ${suggestion}. Do you want to donate?`
      )
      .reprompt(`Do you want to donate to them?`)
      .addDirective({
        type: APL_DOCUMENT_TYPE,
        version: APL_DOCUMENT_VERSION,
        document: charityDetailsDocument,
        datasources: charityDetailsDatasource(
          suggestion,
          `Now that you know about ${suggestion}, you can ask Alexa to donate by saying "Alexa, donate to ${suggestion}"`,
          `Thank you for using Charity Roster.`
        )
      })
      .withShouldEndSession(true)
      .getResponse();
  }
}
