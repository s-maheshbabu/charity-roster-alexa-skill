const utilities = require("../utilities");

module.exports = FindCharityAPI = {
  canHandle(handlerInput) {
    return utilities.isApiRequest(handlerInput, 'FindCharityAPI');
  },
  async handle(handlerInput) {
    const slots = utilities.getSlots(handlerInput);

    const categorySlotId = utilities.getFirstResolvedEntityId(slots.Category);
    // User asked for a category that we don't recognize.
    if (!categorySlotId) {
      console.log(`An recognized charity category: ${JSON.stringify(slots.Category)}`);

      return {
        apiResponse: `I'm sorry but I cannot search by the category you requested. If needed, you can ask me for all the categories that I support.`
      };
    }

    const deductibilitySlotId = utilities.getFirstResolvedEntityId(slots.Deductibility);
    const alexaIntegrationSlotId = utilities.getFirstResolvedEntityId(slots.AlexaIntegration);

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