"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Users, Brain, AlertCircle, ArrowLeft, Percent, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

interface Twin {
  name: string;
  score: number;
}

interface DashboardData {
  twins: Twin[];
  analysis: string;
}

export default function DashboardPage() {
  const params = useParams();
  const username = params.username as string;
  const { toast } = useToast();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/twins/${username}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to fetch data. Status: ${response.status}`);
          }
          const result = await response.json();
          setData(result);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          setError(errorMessage);
          toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [username, toast]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-headline text-primary">
          Dashboard for <span className="text-accent">{username}</span>
        </h1>
      </header>

      {error && (
        <Card className="mb-8 bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertCircle size={24} className="mr-2" />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} variant="destructive" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <Users size={28} className="mr-3 text-primary" />
              Your Investor Twins
            </CardTitle>
            <CardDescription>Investors with strategies similar to yours.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <Skeleton className="h-6 w-2/5" />
                    <Skeleton className="h-6 w-1/5" />
                  </div>
                ))}
              </div>
            ) : data?.twins && data.twins.length > 0 ? (
              <ol className="space-y-3 list-none p-0">
                {data.twins.map((twin, index) => (
                  <li key={index} className="flex items-center justify-between p-4 rounded-lg bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors duration-200 shadow-sm border border-border">
                    <span className="font-medium text-foreground">{twin.name}</span>
                    <div className="flex items-center text-primary font-semibold">
                      <TrendingUp size={18} className="mr-1.5" />
                      <span>{(twin.score * 100).toFixed(0)}% Match</span>
                    </div>
                  </li>
                ))}
              </ol>
            ) : !loading && (
              <p className="text-muted-foreground">No investor twins found.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <Brain size={28} className="mr-3 text-accent" />
              AI Analyst Report
            </CardTitle>
            <CardDescription>Insights based on your and your twins' strategies.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/5" />
              </div>
            ) : data?.analysis ? (
              <blockquote className="p-4 border-l-4 border-accent bg-accent/10 rounded-r-md text-foreground">
                <p className="whitespace-pre-wrap leading-relaxed font-body">{data.analysis}</p>
              </blockquote>
            ) : !loading && (
              <p className="text-muted-foreground">AI analysis is not available at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
