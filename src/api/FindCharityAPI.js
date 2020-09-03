const utilities = require("../utilities");

module.exports = FindCharityAPI = {
  canHandle(handlerInput) {
    return utilities.isApiRequest(handlerInput, 'FindCharityAPI');
  },
  async handle(handlerInput) {
    const slots = utilities.getSlots(handlerInput);

    const deductibilitySlotId = utilities.getFirstResolvedEntityId(slots.Deductibility);
    const alexaIntegrationSlotId = utilities.getFirstResolvedEntityId(slots.AlexaIntegration);
    const categorySlotId = utilities.getFirstResolvedEntityId(slots.Category);

    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.categoryId = categorySlotId;
    sessionAttributes.isAlexaIntegrated = alexaIntegrationSlotId === 'ALEXA_INTEGRATED' ? true : false;
    sessionAttributes.isDeductible = deductibilitySlotId === 'DEDUCTIBLE' ? true : false;

    // Sticking the search filters in context just for testing purposes.
    const { context } = handlerInput;
    if (context) {
      context.categoryId = sessionAttributes.categoryId;
      context.isAlexaIntegrated = sessionAttributes.isAlexaIntegrated;
      context.isDeductible = sessionAttributes.isDeductible;
    }

    return {
      directives: [{
        type: 'Dialog.DelegateRequest',
        target: 'skill',
        period: {
          until: 'EXPLICIT_RETURN'
        },
        updatedRequest: {
          type: 'IntentRequest',
          intent: {
            name: 'NavigateCharitiesIntent',
          }
        }
      }],
      apiResponse: {}
    }
  }
}