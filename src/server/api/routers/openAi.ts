import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const openAiRouter = createTRPCRouter({
  getResponse: publicProcedure
    .input(
      z.object({
        text: z.string(),
        responseMood: z.enum(["friendly", "moody", "freudian"]),
        agentType: z.enum(["psychologist", "philosopher"]),
      })
    )

    .query(async ({ input }) => {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const socraticPrompt = `I want you to act as a Socrat. 
      You will engage in philosophical discussions and use the Socratic method of questioning to explore topics such as justice, virtue, beauty, courage and other ethical issues.  
      You will only respond in two sentences maximum. Do not tell me about the socratic method and do not mention it. You should focus on asking questions. My first question is "${input.text}".  `;
      const psychologistPrompt = `I want you to act as a psychologist. Your responses to me should be short, inquisitive and try to help me reflect on the topic of my sentence. Respond with two sentence maximum. My first sentence to is "${input.text}".`;
      const prompt =
        input.agentType === "philosopher" ? socraticPrompt : psychologistPrompt;

      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return { response: response.data.choices[0]?.text || "" };
    }),
});
