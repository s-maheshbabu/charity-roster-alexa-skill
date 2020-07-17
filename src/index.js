require("app-module-path").addPath(__dirname);

const Alexa = require("ask-sdk");

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
        SessionEndedRequestHandler
      )
      .addRequestInterceptors(
        NavigateCharitiesInitializationInterceptor,
        APLSupportVerificationInterceptor
      )
      .addResponseInterceptors(ResponseSanitizationInterceptor)
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  return skill.invoke(event, context);
};
