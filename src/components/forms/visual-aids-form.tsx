'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';
import { generateVisualAid } from '@/ai/flows/visual-aid-generation';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
});

export function VisualAidsForm() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateVisualAid(values);
      setResult(response.visualAidDataUri);
      addHistoryItem({
        feature: 'Visual Aid',
        query: values,
        result: { visualAidDataUri: '...' }, // Don't store full data URI in history
      });
      toast({
        title: "Visual Aid Generated!",
        description: "Your visual aid has been successfully created.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate visual aid. Please try again.',
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
              <CardTitle>Visual Aid Description</CardTitle>
              <CardDescription>Describe the drawing or chart you want to create.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A simple diagram of the water cycle with labels for evaporation, condensation, and precipitation."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Aid
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
         <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Generating...</CardTitle>
              <CardDescription>The AI is designing your visual aid. Please wait a moment.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12">
               <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </CardContent>
         </Card>
      )}

      {result && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Generated Visual Aid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
               <Image src={result} alt="Generated visual aid" layout="fill" objectFit="contain" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
