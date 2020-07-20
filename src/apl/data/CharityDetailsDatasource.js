module.exports = (charityName, charityDetails, howToDonateInfo) => {
  const text = charityDetails;
  const secondaryText = howToDonateInfo
    ? howToDonateInfo
    : "Please try again if I misheard you";
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
          text: `${charityName}`
        },
        primaryText: {
          type: "PlainText",
          text: text
        },
        secondaryText: {
          type: "PlainText",
          text: secondaryText
        }
      },
      logoUrl:
        "https://s3.amazonaws.com/pronunciations-alexa-skill/512x512.png",
      hintText: `Try, "Alexa, donate to ${charityName}"`
    }
  };
};
