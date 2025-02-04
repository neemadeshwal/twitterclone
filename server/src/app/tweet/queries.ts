export const queries = `#graphql

getAllTweet:[Tweet]
getSingleTweet(payload:SingleTweetInput!):Tweet
getAllHashTags:[HashTag]
getUserFollowingTweet:[Tweet]

`;
