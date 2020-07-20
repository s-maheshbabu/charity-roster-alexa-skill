const APL_CONSTANTS = require("constants/APL");

const charityDetailsDocument = require("apl/document/CharityDetailsDocument.json");
const charityDetailsDatasource = require("apl/data/CharityDetailsDatasource");

const APL_DOCUMENT_TYPE = APL_CONSTANTS.APL_DOCUMENT_TYPE;
const APL_DOCUMENT_VERSION = APL_CONSTANTS.APL_DOCUMENT_VERSION;

const hasIn = require("immutable").hasIn;

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
      Array.isArray(sessionAttributes.charities) &&
      sessionAttributes.charities.length
    )
      return renderSuggestedCharity(handlerInput);

    console.log(`Ran out of charities. If this is happening too often, we might want to support dynamically fetching more charities.`);
    return responseBuilder
      .speak(
        `That is all I have for now. Please come back later to learn about more charities.`
      )
      .addDirective({
        type: APL_DOCUMENT_TYPE,
        version: APL_DOCUMENT_VERSION,
        document: charityDetailsDocument,
        datasources: charityDetailsDatasource(
          `Thank you.`,
          'Thank you for learning about these charities. That is all I have for now.',
          "Please came back later to learn about more charities."
        )
      })
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
  sessionAttributes.currentCharity = suggestion;
  attributesManager.setSessionAttributes(sessionAttributes);

  const charityDescription = getCharityDescription(suggestion);
  return responseBuilder
    .speak(
      `${charityDescription} Would you like to make a donation?`
    )
    .reprompt(`Would you like to make a donation to ${suggestion.name}? You can ask me to skip if want to learn about a different charity.`)
    .withShouldEndSession(false)
    .addDirective({
      type: APL_DOCUMENT_TYPE,
      version: APL_DOCUMENT_VERSION,
      document: charityDetailsDocument,
      datasources: charityDetailsDatasource(
        suggestion.name,
        JSON.stringify(suggestion.metadata),
        "Alexa donation phrase"
      )
    })
    .getResponse();
}

function getCharityDescription(charity) {
  let charityDescription = `Here is a charity you might like. ${charity.name}. `;

  if (
    hasIn(charity, [
      "metadata",
      "mission"
    ]) && charity.metadata.mission !== null
  )
    charityDescription += charity.metadata.mission;

  else {
    if (
      hasIn(charity, [
        "metadata",
        "category",
        "categoryName"
      ]) && charity.metadata.category.categoryName !== null
    )
      charityDescription += `It operates in the ${charity.metadata.category.categoryName} sector. `;

    if (
      hasIn(charity, [
        "metadata",
        "cause",
        "causeName"
      ]) && charity.metadata.cause.causeName !== null
    )
      charityDescription += `focusing on ${charity.metadata.cause.causeName}. `;

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
      charityDescription += `It is based out of ${charity.metadata.mailingAddress.city}, ${charity.metadata.mailingAddress.stateOrProvince}. `;
  }

  return charityDescription;
}
