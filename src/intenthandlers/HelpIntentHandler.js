const APL_CONSTANTS = require("constants/APL");

const APL_DOCUMENT_TYPE = APL_CONSTANTS.APL_DOCUMENT_TYPE;
const APL_DOCUMENT_VERSION = APL_CONSTANTS.APL_DOCUMENT_VERSION;

const skillInfoDocument = require("apl/document/SkillInfoDocument.json");
const skillInfoDatasource = require("apl/data/SkillInfoDatasource");

module.exports = HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const helpText = `I can help you navigate charities blah blah blah.`;
    const helpRepromptText = `I can help you navigate charities, want me to?`;

    return handlerInput.responseBuilder
      .speak(helpText)
      .reprompt(helpRepromptText)
      .withShouldEndSession(false)
      .addDirective({
        type: APL_DOCUMENT_TYPE,
        version: APL_DOCUMENT_VERSION,
        document: skillInfoDocument,
        datasources: skillInfoDatasource(
          `I can help you navigate charities. For example, you can say - `,
          `Alexa, open charity roster
Alexa, ask charity roster blah blah..
Alexa, ask charity roster blah blah..
Alexa, ask charity roster blah blah..`
        )
      })
      .getResponse();
  }
};
