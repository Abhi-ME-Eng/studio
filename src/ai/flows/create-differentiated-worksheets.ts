// src/ai/flows/create-differentiated-worksheets.ts
'use server';
/**
 * @fileOverview Differentiated worksheet creation AI agent.
 *
 * - createDifferentiatedWorksheets - A function that handles the creation of differentiated worksheets.
 * - CreateDifferentiatedWorksheetsInput - The input type for the createDifferentiatedWorksheets function.
 * - CreateDifferentiatedWorksheetsOutput - The return type for the createDifferentiatedWorksheets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateDifferentiatedWorksheetsInputSchema = z.object({
  textbookPageDataUri: z
    .string()
    .describe(
      "A textbook page, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  gradeLevels: z
    .string()
    .describe('The grade levels for which to create differentiated worksheets, comma separated.'),
});
export type CreateDifferentiatedWorksheetsInput = z.infer<typeof CreateDifferentiatedWorksheetsInputSchema>;

const CreateDifferentiatedWorksheetsOutputSchema = z.object({
  worksheets: z.array(
    z.object({
      gradeLevel: z.string().describe('The grade level of the worksheet.'),
      worksheet: z.string().describe('The content of the worksheet.'),
    })
  ),
});
export type CreateDifferentiatedWorksheetsOutput = z.infer<typeof CreateDifferentiatedWorksheetsOutputSchema>;

export async function createDifferentiatedWorksheets(input: CreateDifferentiatedWorksheetsInput): Promise<CreateDifferentiatedWorksheetsOutput> {
  return createDifferentiatedWorksheetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createDifferentiatedWorksheetsPrompt',
  input: {schema: CreateDifferentiatedWorksheetsInputSchema},
  output: {schema: CreateDifferentiatedWorksheetsOutputSchema},
  prompt: `You are an expert teacher specializing in creating differentiated worksheets for students of varying grade levels.

You will use the provided textbook page to create worksheets tailored to each specified grade level. The worksheets should be designed to cater to the learning needs of students at each grade level.

Textbook Page: {{media url=textbookPageDataUri}}

Grade Levels: {{{gradeLevels}}}

Create differentiated worksheets for each grade level.

Ensure that the worksheets are appropriate for the specified grade level and cover the content from the textbook page.

Output should be formatted as a JSON object with a 'worksheets' field.  The 'worksheets' field should be an array of objects, where each object has a 'gradeLevel' and a 'worksheet' field.  The gradeLevel field should be a string, and the worksheet field should contain the text of the worksheet.
`, 
});

const createDifferentiatedWorksheetsFlow = ai.defineFlow(
  {
    name: 'createDifferentiatedWorksheetsFlow',
    inputSchema: CreateDifferentiatedWorksheetsInputSchema,
    outputSchema: CreateDifferentiatedWorksheetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
