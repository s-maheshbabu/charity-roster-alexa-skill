const STATES = require("constants/States").states;

module.exports = LearnMoreIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.LearnMoreIntent"
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
      return responseBuilder
        .speak(
          `Here is a bunch more info. Now, do you want to donate?`
        )
        .reprompt(`Do you still want to donate?`)
        .withShouldEndSession(false)
        .addDirective({
          type: APL_DOCUMENT_TYPE,
          version: APL_DOCUMENT_VERSION,
          document: wordPronouncedDocument,
          datasources: wordPronouncedDatasource(
            suggestion,
            `Here are more words that are similar to what I originally heard. Do you want me to pronounce them?`,
            suggestedSpellings
              .slice(0, MAX_SPELL_SUGGESTIONS_TO_DISPLAY)
              .join(", ")
          )
        })
        .getResponse();

    return responseBuilder
      .speak("Sorry, something went wrong. Please try again.")
      .withShouldEndSession(true)
      .getResponse();
  }
};
