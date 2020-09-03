require("app-module-path").addPath(__dirname);

const Alexa = require("ask-sdk-core");

const FindCharityAPI = require("api/FindCharityAPI");

const NavigateCharitiesIntentHandler = require("intenthandlers/NavigateCharitiesIntentHandler");
const CancelAndStopIntentHandler = require("intenthandlers/CancelAndStopIntentHandler");
const NextCharityIntentHandler = require("intenthandlers/NextCharityIntentHandler");
const DonateIntentHandler = require("intenthandlers/DonateIntentHandler");
const LearnMoreIntentHandler = require("intenthandlers/LearnMoreIntentHandler");
const HelpIntentHandler = require("intenthandlers/HelpIntentHandler");

const LaunchRequestHandler = require("requesthandlers/LaunchRequestHandler");
const SessionEndedRequestHandler = require("requesthandlers/SessionEndedRequestHandler");

const NavigateCharitiesInitializationInterceptor = require("interceptors/NavigateCharitiesInitializationInterceptor");
const APLSupportVerificationInterceptor = require("interceptors/APLSupportVerificationInterceptor");

const ResponseSanitizationInterceptor = require("interceptors/ResponseSanitizationInterceptor");

const ErrorHandler = require("errors/ErrorHandler");

// ***************************************************************************************************
// These simple interceptors just log the incoming and outgoing request bodies to assist in debugging.

const LogRequestInterceptor = {
  process(handlerInput) {
    console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
  },
};

const LogResponseInterceptor = {
  process(handlerInput, response) {
    console.log(`RESPONSE = ${JSON.stringify(response)}`);
  },
};

// --------------- Skill Initialization -----------------------
let skill;

exports.handler = async function (event, context) {
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        CancelAndStopIntentHandler,
        DonateIntentHandler,
        LaunchRequestHandler,
        NavigateCharitiesIntentHandler,
        NextCharityIntentHandler,
        LearnMoreIntentHandler,
        HelpIntentHandler,
        SessionEndedRequestHandler,
        FindCharityAPI,
      )
      .addResponseInterceptors(
        LogResponseInterceptor)
      .addRequestInterceptors(
        NavigateCharitiesInitializationInterceptor,
        APLSupportVerificationInterceptor,
        LogRequestInterceptor,
      )
      .addResponseInterceptors(ResponseSanitizationInterceptor)
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  return skill.invoke(event, context);
};
