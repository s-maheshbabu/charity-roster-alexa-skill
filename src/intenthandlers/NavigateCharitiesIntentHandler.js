const STATES = require("constants/States").states;

const charities = require("utilities/Charities");
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
  sessionAttributes.charities = charities.getRandomCharities();
  sessionAttributes.state = STATES.CURRENT_CHARITY_EIN;
  attributesManager.setSessionAttributes(sessionAttributes);

  return nextCharityIntentHandler.handle(handlerInput);
}