const STATES = require("constants/States").states;

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
      .getResponse();
  } else {
    return responseBuilder
      .speak(
        `Here is a charity suggestion. ${suggestion}. Do you want to donate?`
      )
      .reprompt(`Do you want to donate to them?`)
      .withShouldEndSession(true)
      .getResponse();
  }
}
