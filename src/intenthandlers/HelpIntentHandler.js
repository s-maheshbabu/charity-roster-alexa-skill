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
    const helpText = `I can help you learn about various charitable organizations, their mission statements, location etc.. If you find a charity that you are interested in, you can ask me for more details or for instructions on how to donate.
I can tell you how to make a donation through Alexa and will also send instructions to the Alexa app on your phone if you prefer to donate through other means. Would you like to hear about some charities?`;
    const helpRepromptText = `Would you like me to start telling you about some charities?`;

    return handlerInput.responseBuilder
      .speak(helpText)
      .reprompt(helpRepromptText)
      .withShouldEndSession(false)
      .withSimpleCard(
        `Charity Roster`,
        `I can help you learn about various charitable organizations, their mission statements, location etc.. If you find a charity that you are interested in, you can ask me for more details or for instructions on how to donate.
I can tell you how to make a donation through Alexa and will also send instructions to the Alexa app on your phone if you prefer to donate through other means.`
      )
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
