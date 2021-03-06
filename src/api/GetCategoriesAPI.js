const utilities = require("../utilities");
const skill_model = require("../../skill-package/interactionModels/custom/en-US");
const { hasIn } = require('immutable');

module.exports = GetCategoriesAPI = {
  canHandle(handlerInput) {
    return utilities.isApiRequest(handlerInput, 'GetCategoriesAPI');
  },
  async handle(handlerInput) {
    if (!hasIn(skill_model, ['interactionModel', 'languageModel', 'types'])) throw new ReferenceError("Unexpected skill model. Unable to find path to slots.");

    const slotTypes = skill_model.interactionModel.languageModel.types;
    if (!Array.isArray(slotTypes) || slotTypes.length == 0) throw new ReferenceError("Unexpected skill model. Unable to find path to slots.");

    let charityCategorySlot = null;
    for (let index = 0; index < slotTypes.length; index++) {
      const slotType = slotTypes[index];
      if (slotType.name === 'CharityCategoryType') {
        charityCategorySlot = slotType;
        break;
      }
    }

    if (!charityCategorySlot) throw new ReferenceError("Unexpected skill model. Unable to find path to slots.");
    const charityCategories = charityCategorySlot.values;
    const categoryNames = charityCategories.map(a => a.name.value);
    const supportedCharitiesConcatenated = categoryNames.slice(0, -1).join(', ') + ' and ' + categoryNames.slice(-1);

    return {
      apiResponse: `The supported categories are: ${supportedCharitiesConcatenated}`
    };
  }
}