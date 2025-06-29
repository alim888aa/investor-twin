// This is an autogenerated file from Firebase Studio.
'use server';

/**
 * @fileOverview An AI agent that analyzes investment strategies based on a username and investor twins.
 *
 * - analyzeInvestmentStrategies - A function that analyzes investment strategies.
 * - AnalyzeInvestmentStrategiesInput - The input type for the analyzeInvestmentStrategies function.
 * - AnalyzeInvestmentStrategiesOutput - The return type for the analyzeInvestmentStrategies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInvestmentStrategiesInputSchema = z.object({
  userPortfolio: z
    .array(z.string())
    .describe("An array of stock symbols in the user's portfolio."),
  twinPortfolio: z
    .array(z.string())
    .describe("An array of stock symbols in the top twin's portfolio."),
  twinName: z.string().describe("The name of the top investor twin."),
});
export type AnalyzeInvestmentStrategiesInput = z.infer<typeof AnalyzeInvestmentStrategiesInputSchema>;

const AnalyzeInvestmentStrategiesOutputSchema = z.object({
  sharedStrategy: z
    .string()
    .describe(
      "A one-sentence summary of the primary investment strategy or industry these two portfolios share.",
    ),
  keyDifference: z
    .array(z.string())
    .describe(
      "A list of the specific stock symbols that the twin owns, but the user does not.",
    ),
  potentialOpportunity: z
    .string()
    .describe(
      "A one or two-sentence suggestion on why the user might consider looking into the differing stocks.",
    ),
});
export type AnalyzeInvestmentStrategiesOutput = z.infer<typeof AnalyzeInvestmentStrategiesOutputSchema>;

export async function analyzeInvestmentStrategies(input: AnalyzeInvestmentStrategiesInput): Promise<AnalyzeInvestmentStrategiesOutput> {
  return analyzeInvestmentStrategiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInvestmentStrategiesPrompt',
  input: {schema: AnalyzeInvestmentStrategiesInputSchema},
  output: {schema: AnalyzeInvestmentStrategiesOutputSchema},
  prompt: `You are a helpful and concise financial analyst. A user's portfolio consists of these stocks: [{{#each userPortfolio}}{{.}}, {{/each}}]. Their top investment twin, {{twinName}}, has this portfolio: [{{#each twinPortfolio}}{{.}}, {{/each}}].

  Based on this, provide a short, three-part analysis:

  1.  **Shared Strategy:** In one sentence, what is the primary investment strategy or industry these two portfolios have in common?
  2.  **Key Difference:** List the specific stocks that {{twinName}} owns, but the user does not.
  3.  **Potential Opportunity:** In one or two sentences, suggest why the user might consider looking into these differing stocks, focusing on diversification or exposure to new sectors.`,
  // ...
});

const analyzeInvestmentStrategiesFlow = ai.defineFlow(
  {
    name: 'analyzeInvestmentStrategiesFlow',
    inputSchema: AnalyzeInvestmentStrategiesInputSchema,
    outputSchema: AnalyzeInvestmentStrategiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
