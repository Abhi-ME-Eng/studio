// src/ai/flows/generate-hyper-local-content.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating hyper-local content in various languages.
 *
 * - generateHyperLocalContent - A function that generates hyper-local content.
 * - GenerateHyperLocalContentInput - The input type for the generateHyperLocalContent function.
 * - GenerateHyperLocalContentOutput - The return type for the generateHyperLocalContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHyperLocalContentInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate content.'),
  language: z.string().describe('The target language for the content.'),
  location: z.string().describe('The specific local context (e.g., city, region) to tailor the content to.'),
});
export type GenerateHyperLocalContentInput = z.infer<typeof GenerateHyperLocalContentInputSchema>;

const GenerateHyperLocalContentOutputSchema = z.object({
  content: z.string().describe('The generated hyper-local content.'),
});
export type GenerateHyperLocalContentOutput = z.infer<typeof GenerateHyperLocalContentOutputSchema>;

export async function generateHyperLocalContent(input: GenerateHyperLocalContentInput): Promise<GenerateHyperLocalContentOutput> {
  return generateHyperLocalContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHyperLocalContentPrompt',
  input: {schema: GenerateHyperLocalContentInputSchema},
  output: {schema: GenerateHyperLocalContentOutputSchema},
  prompt: `You are an expert in generating hyper-local content tailored to specific regions and languages.

  Generate content about the following topic:
  {{{topic}}}

  The content should be in the following language:
  {{{language}}}

  The content should be tailored to the following location:
  {{{location}}}

  Ensure the content is culturally relevant and appropriate for students.
  `,
});

const generateHyperLocalContentFlow = ai.defineFlow(
  {
    name: 'generateHyperLocalContentFlow',
    inputSchema: GenerateHyperLocalContentInputSchema,
    outputSchema: GenerateHyperLocalContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
