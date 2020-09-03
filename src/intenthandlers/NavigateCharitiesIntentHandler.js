const AlexaCharitiesGateway = require("../charityManager");
const AllCharitiesGateway = require("../AllCharitiesGatetway");
const nextCharityIntentHandler = require("intenthandlers/NextCharityIntentHandler");

const NavigateCharitiesIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "LaunchRequest" ||
      (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        handlerInput.requestEnvelope.request.intent.name === "NavigateCharitiesIntent")
    );
  },
  async handle(handlerInput) {
    return navigateCharities(handlerInput);
  }
};

module.exports = NavigateCharitiesIntentHandler;

/**
 * Pronounces the word or informs the user that no word exists with the spelling.
 */
async function navigateCharities(handlerInput) {
  const { attributesManager } = handlerInput;

  const sessionAttributes = attributesManager.getSessionAttributes() || {};
  const isAlexaIntegrated = sessionAttributes.isAlexaIntegrated || false;
  const isTaxDeductible = sessionAttributes.isTaxDeductible || true;
  const category = sessionAttributes.category || null;

  if (isAlexaIntegrated) {
    sessionAttributes.charities = AlexaCharitiesGateway.findCharities(category, isTaxDeductible);
  }
  else {
    sessionAttributes.charities = await AllCharitiesGateway.findCharities(category, isTaxDeductible);
  }
  attributesManager.setSessionAttributes(sessionAttributes);
  console.log(`Charities that will be presented to the user: ${JSON.stringify(sessionAttributes.charities)}`);

  return nextCharityIntentHandler.handle(handlerInput);
}