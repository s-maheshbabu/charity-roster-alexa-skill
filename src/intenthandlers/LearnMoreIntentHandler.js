const APL_CONSTANTS = require("constants/APL");
const hasIn = require("immutable").hasIn;

const charityDetailsDocument = require("apl/document/CharityDetailsDocument.json");
const charityDetailsDatasource = require("apl/data/CharityDetailsDatasource");

const APL_DOCUMENT_TYPE = APL_CONSTANTS.APL_DOCUMENT_TYPE;
const APL_DOCUMENT_VERSION = APL_CONSTANTS.APL_DOCUMENT_VERSION;

const SOUND_EFFECT = "<audio src=\"soundbank://soundlibrary/alarms/beeps_and_bloops/tone_02\"/>";

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

  const alexaDonationPhrase = currentCharity.alexaDonationPhrase;

  const charityAdditionalDetails = getAdditionalDetails(currentCharity);
  return responseBuilder
    .speak(
      `${charityAdditionalDetails} ${SOUND_EFFECT} Would you like to know how to donate to ${currentCharity.name}?`
    )
    .withShouldEndSession(false)
    .reprompt(`Would you like to know how to donate to ${currentCharity.name}? You won't be making a donation yet but I can give you instructions on how to donate. You can ask me to skip this charity if you want to learn about a different charity.`)
    .addDirective({
      type: APL_DOCUMENT_TYPE,
      version: APL_DOCUMENT_VERSION,
      document: charityDetailsDocument,
      datasources: charityDetailsDatasource(
        currentCharity.name,
        cleanupForVisualPresentation(charityAdditionalDetails),
        `You can donate to them by saying, "${alexaDonationPhrase}"`
      )
    })
    .getResponse();
}

function getAdditionalDetails(charity) {
  let charityDescription = `<amazon:domain name="conversational">Okay. </amazon:domain>`;

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
      charityDescription += `<amazon:domain name="news">${charity.name} operates in the ${charity.metadata.category.categoryName} sector. </amazon:domain>`;

    if (
      hasIn(charity, [
        "metadata",
        "cause",
        "causeName"
      ]) && charity.metadata.cause.causeName !== null
    )
      charityDescription += `<amazon:domain name="news">focusing on ${charity.metadata.cause.causeName}. </amazon:domain>`;
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
    charityDescription += `<amazon:domain name="news">${charity.name} is based out of <say-as interpret-as="address">${charity.metadata.mailingAddress.city}, ${charity.metadata.mailingAddress.stateOrProvince}. </say-as></amazon:domain>`;

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
    charityDescription += `<amazon:domain name="news">Their address is <say-as interpret-as="address">${charity.metadata.mailingAddress.streetAddress1}, ${charity.metadata.mailingAddress.postalCode}. </say-as></amazon:domain>`;

  return charityDescription;
}

function cleanupForVisualPresentation(input) {
  const regex = /<.*?>/gi;
  return input.replace(regex, '');
}