// src/ai/flows/instant-knowledge-base.ts
'use server';

/**
 * @fileOverview An AI agent that acts as an instant knowledge base, providing explanations to complex student questions in the local language with analogies.
 *
 * - instantKnowledgeBase - A function that handles the knowledge base process.
 * - InstantKnowledgeBaseInput - The input type for the instantKnowledgeBase function.
 * - InstantKnowledgeBaseOutput - The return type for the instantKnowledgeBase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InstantKnowledgeBaseInputSchema = z.object({
  question: z.string().describe('The complex question from the student.'),
  localLanguage: z.string().describe('The local language to provide the explanation in.'),
});
export type InstantKnowledgeBaseInput = z.infer<typeof InstantKnowledgeBaseInputSchema>;

const InstantKnowledgeBaseOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the complex question in the local language with analogies.'),
});
export type InstantKnowledgeBaseOutput = z.infer<typeof InstantKnowledgeBaseOutputSchema>;

export async function instantKnowledgeBase(input: InstantKnowledgeBaseInput): Promise<InstantKnowledgeBaseOutput> {
  return instantKnowledgeBaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'instantKnowledgeBasePrompt',
  input: {schema: InstantKnowledgeBaseInputSchema},
  output: {schema: InstantKnowledgeBaseOutputSchema},
  prompt: `You are an expert tutor, skilled at explaining complex topics in simple terms.

You will answer the student's question in their local language, and use analogies to help them understand.

Local Language: {{{localLanguage}}}

Question: {{{question}}}

Explanation:`, // The LLM will provide the explanation here.
});

const instantKnowledgeBaseFlow = ai.defineFlow(
  {
    name: 'instantKnowledgeBaseFlow',
    inputSchema: InstantKnowledgeBaseInputSchema,
    outputSchema: InstantKnowledgeBaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
