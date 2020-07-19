const unitUnderTest = require("../src/index");
const hasIn = require("immutable").hasIn;
const cloneDeep = require("lodash.clonedeep");

const expect = require("chai").expect;
const assert = require("chai").assert;
const decache = require("decache");

const STATES = require("constants/States").states;
const APL_CONSTANTS = require("constants/APL");

const APL_DOCUMENT_TYPE = APL_CONSTANTS.APL_DOCUMENT_TYPE;
const APL_DOCUMENT_VERSION = APL_CONSTANTS.APL_DOCUMENT_VERSION;

const charityDetailsDocument = require("apl/document/CharityDetailsDocument.json");
const charityDetailsDatasource = require("apl/data/CharityDetailsDatasource");

const skillInfoDocument = require("apl/document/SkillInfoDocument.json");
const skillInfoDatasource = require("apl/data/SkillInfoDatasource");

const context = {};

afterEach(function () {
  decache("../test-data/event");
});

it("handles the AMAZON.CancelIntent properly", async () => {
  const event = require("../test-data/cancel_intent_event");

  const response = await unitUnderTest.handler(event, context);

  const sessionAttributesUsed = response.sessionAttributes;
  expect(sessionAttributesUsed.isAPLSupported).to.be.true;

  const responseUsed = response.response;
  assert(responseUsed.shouldEndSession);
  expect(responseUsed.outputSpeech).to.be.undefined;
  expect(responseUsed.reprompt).to.be.undefined;
});

it("handles the AMAZON.StopIntent properly", async () => {
  const event = require("../test-data/stop_intent_event");

  const response = await unitUnderTest.handler(event, context);

  const sessionAttributesUsed = response.sessionAttributes;
  expect(sessionAttributesUsed.isAPLSupported).to.be.true;

  const responseUsed = response.response;
  assert(responseUsed.shouldEndSession);
  expect(responseUsed.outputSpeech).to.be.undefined;
  expect(responseUsed.reprompt).to.be.undefined;
});

it("handles the AMAZON.HelpIntent properly", async () => {
  const event = require("../test-data/help_intent_event");

  const response = await unitUnderTest.handler(event, context);

  const sessionAttributesUsed = response.sessionAttributes;
  expect(sessionAttributesUsed.isAPLSupported).to.be.true;

  const responseUsed = response.response;
  assert(!responseUsed.shouldEndSession);

  const outputSpeech = responseUsed.outputSpeech;
  expect(outputSpeech.ssml).to.equal(
    `<speak>I can help you navigate charities blah blah blah.</speak>`
  );
  expect(outputSpeech.type).to.equal("SSML");

  const reprompt = responseUsed.reprompt;
  expect(reprompt.outputSpeech.ssml).to.equal(
    `<speak>I can help you navigate charities, want me to?</speak>`
  );
  expect(reprompt.outputSpeech.type).to.equal("SSML");

  verifyAPLDirectiveStructure(responseUsed.directives);
  const directive = responseUsed.directives[0];
  expect(directive.document).to.eql(charityDetailsDocument);

  const actualDatasource = directive.datasources;
  expect(actualDatasource).to.eql(
    skillInfoDatasource(
      `I can help you navigate charities. For example, you can say - `,
      `Alexa, open charity roster
Alexa, ask charity roster blah blah..
Alexa, ask charity roster blah blah..
Alexa, ask charity roster blah blah..`
    )
  );
}
);

/**
 * Verify the structure of the APL directives. We check that we are sending exactly
 * one directive and that it is of the right type and version.
 */
function verifyAPLDirectiveStructure(directives) {
  expect(directives).is.not.null;
  expect(directives.length).is.equal(1);

  const directive = directives[0];
  expect(directive.type).to.equal(APL_DOCUMENT_TYPE);
  expect(directive.version).to.equal(APL_DOCUMENT_VERSION);
}

/*
Alexa supports Alexa Presentation Language (APL) on only a few devices and
so there is a fork in the code to issue APL directives for devices that support
APL and plain old cards for other devices. This test method generates an array
of two events simulating devices with and without APL support.
*/
function getEventObjects(path) {
  // Events by default are configured to have APL support.
  const event = require(path);

  // Build an event object without APL support.
  const eventWithoutAPLSupport = cloneDeep(event);
  delete eventWithoutAPLSupport.context.System.device.supportedInterfaces["Alexa.Presentation.APL"];

  return [event, eventWithoutAPLSupport];
}

/*
Helper fucntion to tell if APL is supported.
*/
function hasAPLSupport(event) {
  if (
    hasIn(event, [
      "context",
      "System",
      "device",
      "supportedInterfaces",
      "Alexa.Presentation.APL"
    ])
  ) return true;
  else return false;
}
