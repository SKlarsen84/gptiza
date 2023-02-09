import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const openAiRouter = createTRPCRouter({
  getResponse: publicProcedure
    .input(
      z.object({
        text: z.string(),
        responseMood: z.enum(["friendly", "moody", "freudian"]),
      })
    )

    .query(async ({ input }) => {
      const configuration = new Configuration({
        apiKey: "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",
      });
      const openai = new OpenAIApi(configuration);
      const prompt = `write a single sentence response to the following, in the style of a ${input.responseMood} psychologist: 
  
      ${input.text}`;

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
