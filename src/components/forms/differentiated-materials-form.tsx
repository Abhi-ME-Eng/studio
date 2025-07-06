'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, UploadCloud, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';
import { createDifferentiatedWorksheets } from '@/ai/flows/create-differentiated-worksheets';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const formSchema = z.object({
  textbookPage: z.any().refine((file) => file instanceof File, 'Textbook page is required.'),
  gradeLevels: z.string().min(1, 'At least one grade level is required.'),
});

type Worksheet = { gradeLevel: string; worksheet: string };

const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function DifferentiatedMaterialsForm() {
  const [result, setResult] = useState<Worksheet[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gradeLevels: '',
    },
  });

  const { ref: fileRef, ...fileRest } = form.register('textbookPage');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const textbookPageDataUri = await toDataURL(values.textbookPage);
      const response = await createDifferentiatedWorksheets({
        textbookPageDataUri,
        gradeLevels: values.gradeLevels,
      });
      setResult(response.worksheets);
      
      addHistoryItem({
        feature: 'Differentiated Materials',
        query: { gradeLevels: values.gradeLevels, fileName: values.textbookPage.name },
        result: response,
      });

      toast({
        title: "Worksheets Generated!",
        description: "Your differentiated worksheets have been successfully created.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate worksheets. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Worksheet Details</CardTitle>
              <CardDescription>Upload a textbook page and specify grade levels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="textbookPage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Textbook Page</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          {...fileRest}
                          onChange={(e) => {
                             if (e.target.files?.[0]) {
                                field.onChange(e.target.files[0]);
                                setFileName(e.target.files[0].name);
                             }
                          }}
                        />
                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-border bg-muted/50">
                          {fileName ? (
                              <div className="text-center">
                                <FileText className="mx-auto h-8 w-8 text-muted-foreground"/>
                                <p className="mt-2 text-sm text-foreground">{fileName}</p>
                              </div>
                          ) : (
                              <div className="text-center">
                                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground"/>
                                <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload</p>
                              </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>Upload an image of the textbook page.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gradeLevels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Levels</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 3rd, 5th, 7th" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated list of grade levels.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Worksheets
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
         <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Generating...</CardTitle>
              <CardDescription>The AI is crafting your worksheets. Please wait a moment.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12">
               <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </CardContent>
         </Card>
      )}

      {result && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Generated Worksheets</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>Grade Level: {item.gradeLevel}</AccordionTrigger>
                  <AccordionContent>
                    <pre className="whitespace-pre-wrap font-body text-sm bg-background p-4 rounded-md border">
                      {item.worksheet}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
