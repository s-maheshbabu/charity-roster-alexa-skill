const STATES = require("constants/States").states;

module.exports = DonateIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name === "DonateIntent" ||
        handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent")
    );
  },
  handle(handlerInput) {
    const { attributesManager, responseBuilder } = handlerInput;

    const sessionAttributes = attributesManager.getSessionAttributes() || {};
    if (
      sessionAttributes.state === STATES.SUGGEST_CORRECT_SPELLINGS &&
      Array.isArray(sessionAttributes.suggestedSpellings) &&
      sessionAttributes.suggestedSpellings.length
    )
      return renderSpellSuggestions(handlerInput);

    return responseBuilder
      .speak("Okay, I sent the information to your phone.")
      .withShouldEndSession(true)
      .getResponse();
  }
}
