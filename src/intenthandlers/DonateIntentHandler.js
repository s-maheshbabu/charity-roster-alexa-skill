const APL_CONSTANTS = require("constants/APL");

const charityDetailsDocument = require("apl/document/CharityDetailsDocument.json");
const charityDetailsDatasource = require("apl/data/CharityDetailsDatasource");

const APL_DOCUMENT_TYPE = APL_CONSTANTS.APL_DOCUMENT_TYPE;
const APL_DOCUMENT_VERSION = APL_CONSTANTS.APL_DOCUMENT_VERSION;

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
      sessionAttributes.currentCharity
    )
      return renderDonationDetails(handlerInput);

    return responseBuilder
      .speak("Sorry, something went wrong. Please try again.")
      .withShouldEndSession(true)
      .getResponse();
  }
}

/*
Documentation
*/
function renderDonationDetails(handlerInput) {
  const { attributesManager, responseBuilder } = handlerInput;

  const sessionAttributes = attributesManager.getSessionAttributes();
  const currentCharity = sessionAttributes.currentCharity;

  const alexaDonationPhrase = "Dummy Alexa Donation Phrase";
  return responseBuilder
    .speak(
      `Okay. You can donate to ${currentCharity.name} by saying ${alexaDonationPhrase}. I also sent the instructions to the Alexa app on your phone. Thank you for your donation.`
    )
    .withShouldEndSession(true)
    .withSimpleCard(
      `Donate to ${currentCharity.name}`,
      `You can donate to ${currentCharity.name} by saying ${alexaDonationPhrase}.

The donation itself is processed by Amazon using the secure AmazonPay systems. You can learn more at https://pay.amazon.com/help/201754640`
    )
    .addDirective({
      type: APL_DOCUMENT_TYPE,
      version: APL_DOCUMENT_VERSION,
      document: charityDetailsDocument,
      datasources: charityDetailsDatasource(
        currentCharity.name,
        `Thank you`,
        `${alexaDonationPhrase}`
      )
    })
    .getResponse();
}
