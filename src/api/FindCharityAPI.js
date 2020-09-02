const utilities = require("../utilities");


module.exports = FindCharityAPI = {
  canHandle(handlerInput) {
    return utilities.isApiRequest(handlerInput, 'FindCharityAPI');
  },
  async handle(handlerInput) {
    const apiArguments = utilities.getApiArguments(handlerInput);

    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.category = apiArguments.category;

    // Sticking the search filters in context just for testing purposes.
    const { context } = handlerInput;
    if (context) {
      context.category = sessionAttributes.category;
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