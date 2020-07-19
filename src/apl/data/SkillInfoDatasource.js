module.exports = (skillSummary, usageInfo) => {
  return {
    bodyTemplate2Data: {
      type: "object",
      objectId: "bt2Sample",
      backgroundImage: {
        contentDescription: null,
        smallSourceUrl: null,
        largeSourceUrl: null,
        sources: [
          {
            url:
              "https://s3.amazonaws.com/pronunciations-alexa-skill/background.jpg",
            size: "small",
            widthPixels: 0,
            heightPixels: 0
          },
          {
            url:
              "https://s3.amazonaws.com/pronunciations-alexa-skill/background.jpg",
            size: "large",
            widthPixels: 0,
            heightPixels: 0
          }
        ]
      },
      title: "Welcome to Charity Roster",
      image: {
        contentDescription: null,
        smallSourceUrl: null,
        largeSourceUrl: null,
        sources: [
          {
            url:
              "https://s3.amazonaws.com/pronunciations-alexa-skill/background.jpg",
            size: "small",
            widthPixels: 0,
            heightPixels: 0
          },
          {
            url:
              "https://s3.amazonaws.com/pronunciations-alexa-skill/background.jpg",
            size: "large",
            widthPixels: 0,
            heightPixels: 0
          }
        ]
      },
      textContent: {
        title: {
          type: "PlainText",
          text: `I can help you learn about the charities that you can help through Alexa`
        },
        primaryText: {
          type: "PlainText",
          text: skillSummary
        },
        secondaryText: {
          type: "PlainText",
          text: usageInfo
        }
      },
      logoUrl:
        "https://s3.amazonaws.com/pronunciations-alexa-skill/512x512.png",
      hintText: `Try, "Alexa, ask Charity Roster for human rights charities`
    }
  };
};
