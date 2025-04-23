import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";

const REWRITE_TWEET_WITH_AI = gql`
  mutation rewriteTweetWithAi($payload: rewriteTweetWithAiPayload) {
    rewriteTweetWithAi(payload: $payload) {
      output
    }
  }
`;

const GENERATE_AUTOMATED_REPLIES = gql`
  mutation generateAutomatedReplies($payload: generateAutomatedRepliesPayload) {
    generateAutomatedReplies(payload: $payload) {
      output
    }
  }
`;

export const rewriteTweetWithAi = async (payload: {
  tweet: string;
  instructions: string;
}): Promise<{ rewriteTweetWithAi: { output: string } }> => {
  const data = await graphqlClient.request(REWRITE_TWEET_WITH_AI, {
    payload,
  });
  return data as { rewriteTweetWithAi: { output: string } };
};

export const aiCommentSuggestionMutate = async (payload: {
  tweetId: string;
}): Promise<{ generateAutomatedReplies: { output: [string] } }> => {
  const data = await graphqlClient.request(GENERATE_AUTOMATED_REPLIES, {
    payload,
  });
  return data as { generateAutomatedReplies: { output: [string] } };
};
