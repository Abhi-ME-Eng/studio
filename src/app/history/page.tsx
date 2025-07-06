'use client';

import { PageHeader } from '@/components/shared/page-header';
import { useHistory } from '@/hooks/use-history';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function HistoryPage() {
  const { history, isLoaded, clearHistory } = useHistory();

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Interaction History"
        description="Review your past requests and generated materials."
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={!isLoaded || history.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your history data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearHistory}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageHeader>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>History Log</CardTitle>
            <CardDescription>A log of your interactions with Sahayak AI.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoaded ? (
              <div className="flex items-center justify-center py-12">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
               <div className="text-center py-12 text-muted-foreground">
                  <p>No history yet.</p>
                  <p>Start using the tools to see your history here.</p>
               </div>
            ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Query</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="outline">{item.feature}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {Object.entries(item.query)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </TableCell>
                      <TableCell>{format(new Date(item.timestamp), 'PP pp')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
