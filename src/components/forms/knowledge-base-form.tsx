'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useHistory } from '@/hooks/use-history';
import { instantKnowledgeBase } from '@/ai/flows/instant-knowledge-base';

const formSchema = z.object({
  question: z.string().min(10, {
    message: 'Question must be at least 10 characters.',
  }),
  localLanguage: z.string().min(2, {
    message: 'Language must be at least 2 characters.',
  }),
});

export function KnowledgeBaseForm() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addHistoryItem } = useHistory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      localLanguage: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await instantKnowledgeBase(values);
      setResult(response.explanation);
      addHistoryItem({
        feature: 'Knowledge Base',
        query: values,
        result: response,
      });
      toast({
        title: "Explanation Generated!",
        description: "The explanation has been successfully created.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate explanation. Please try again.',
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
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>Get a simple explanation for a complex student question.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student's Question</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Why is the sky blue?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="localLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., English" {...field} />
                    </FormControl>
                    <FormDescription>The language for the explanation.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Explain
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
         <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Generating...</CardTitle>
              <CardDescription>The AI is crafting your explanation. Please wait a moment.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12">
               <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </CardContent>
         </Card>
      )}

      {result && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-body text-sm bg-background p-4 rounded-md border">
              {result}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
