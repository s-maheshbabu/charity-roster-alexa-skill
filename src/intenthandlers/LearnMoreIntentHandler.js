const APL_CONSTANTS = require("constants/APL");
const hasIn = require("immutable").hasIn;

const charityDetailsDocument = require("apl/document/CharityDetailsDocument.json");
const charityDetailsDatasource = require("apl/data/CharityDetailsDatasource");

const APL_DOCUMENT_TYPE = APL_CONSTANTS.APL_DOCUMENT_TYPE;
const APL_DOCUMENT_VERSION = APL_CONSTANTS.APL_DOCUMENT_VERSION;

module.exports = LearnMoreIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "LearnMoreIntent"
    );
  }, handle(handlerInput) {
    const { attributesManager, responseBuilder } = handlerInput;

    const sessionAttributes = attributesManager.getSessionAttributes() || {};
    if (
      sessionAttributes.currentCharity
    )
      return renderAdditionalDetails(handlerInput);

    return responseBuilder
      .speak("Sorry, something went wrong. Please try again.")
      .withShouldEndSession(true)
      .getResponse();
  }
}

/*
Documentation
*/
function renderAdditionalDetails(handlerInput) {
  const { attributesManager, responseBuilder } = handlerInput;

  const sessionAttributes = attributesManager.getSessionAttributes();
  const currentCharity = sessionAttributes.currentCharity;

  const charityAdditionalDetails = getAdditionalDetails(currentCharity);
  return responseBuilder
    .speak(
      `${charityAdditionalDetails} Would you like to make a donation?`
    )
    .withShouldEndSession(false)
    .reprompt(`Would you like to make a donation to ${currentCharity.name}? You can ask me to skip if want to learn about a different charity.`)
    .addDirective({
      type: APL_DOCUMENT_TYPE,
      version: APL_DOCUMENT_VERSION,
      document: charityDetailsDocument,
      datasources: charityDetailsDatasource(
        currentCharity.name,
        JSON.stringify(currentCharity.metadata),
        "Alexa donation phrase"
      )
    })
    .getResponse();
}

function getAdditionalDetails(charity) {
  let charityDescription = `Okay. `;

  if (
    hasIn(charity, [
      "metadata",
      "mission"
    ]) && charity.metadata.mission !== null
  ) {
    if (
      hasIn(charity, [
        "metadata",
        "category",
        "categoryName"
      ]) && charity.metadata.category.categoryName !== null
    )
      charityDescription += `${charity.name} operates in the ${charity.metadata.category.categoryName} sector. `;

    if (
      hasIn(charity, [
        "metadata",
        "cause",
        "causeName"
      ]) && charity.metadata.cause.causeName !== null
    )
      charityDescription += `focusing on ${charity.metadata.cause.causeName}. `;
  }

  if (
    hasIn(charity, [
      "metadata",
      "mailingAddress",
      "stateOrProvince"
    ]) && charity.metadata.mailingAddress.stateOrProvince !== null && hasIn(charity, [
      "metadata",
      "mailingAddress",
      "city"
    ]) && charity.metadata.mailingAddress.city !== null
  )
    charityDescription += `${charity.name} is based out of ${charity.metadata.mailingAddress.city}, ${charity.metadata.mailingAddress.stateOrProvince}. `;

  if (
    hasIn(charity, [
      "metadata",
      "mailingAddress",
      "streetAddress1"
    ]) && charity.metadata.mailingAddress.streetAddress1 !== null && hasIn(charity, [
      "metadata",
      "mailingAddress",
      "postalCode"
    ]) && charity.metadata.mailingAddress.postalCode !== null
  )
    charityDescription += `Their address is ${charity.metadata.mailingAddress.streetAddress1}, ${charity.metadata.mailingAddress.postalCode}. `;

  return charityDescription;
}