const charityManager = require("../charityManager");
const nextCharityIntentHandler = require("intenthandlers/NextCharityIntentHandler");

const NavigateCharitiesIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "LaunchRequest" ||
      (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        handlerInput.requestEnvelope.request.intent.name === "NavigateCharitiesIntent")
    );
  },
  handle(handlerInput) {
    return navigateCharities(handlerInput);
  }
};

module.exports = NavigateCharitiesIntentHandler;

/**
 * Pronounces the word or informs the user that no word exists with the spelling.
 */
function navigateCharities(handlerInput) {
  const { attributesManager } = handlerInput;

  const sessionAttributes = attributesManager.getSessionAttributes() || {};
  sessionAttributes.charities = charityManager.getRandomCharities();
  attributesManager.setSessionAttributes(sessionAttributes);

  return nextCharityIntentHandler.handle(handlerInput);
}