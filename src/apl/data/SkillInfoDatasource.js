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
              "https://charity-roster-alexa-skill.s3.amazonaws.com/charity-roster-background.jpg",
            size: "small",
            widthPixels: 0,
            heightPixels: 0
          },
          {
            url:
              "https://charity-roster-alexa-skill.s3.amazonaws.com/charity-roster-background.jpg",
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
              "https://charity-roster-alexa-skill.s3.amazonaws.com/charity-roster-background.jpg",
            size: "small",
            widthPixels: 0,
            heightPixels: 0
          },
          {
            url:
              "https://charity-roster-alexa-skill.s3.amazonaws.com/charity-roster-background.jpg",
            size: "large",
            widthPixels: 0,
            heightPixels: 0
          }
        ]
      },
      textContent: {
        title: {
          type: "PlainText",
          text: `I can help you learn about various charities that you can donate to, through Alexa. I can present details of random charities but you can also ask me for specific
categories like human rights, education etc. If you find a charity that you like, I can then provide instructions on how to donate to that charity.`
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
        "https://charity-roster-alexa-skill.s3.amazonaws.com/512x512.png",
      hintText: `Try, "Alexa, ask Charity Roster for human rights charities`
    }
  };
};
