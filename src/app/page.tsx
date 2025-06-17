"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersRound, Search } from 'lucide-react';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/dashboard/${username.trim()}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UsersRound size={48} className="text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Find Your Investor Twin</CardTitle>
          <CardDescription className="text-muted-foreground font-body mt-2">
            Enter your username to discover investors with similar strategies and get an AI-powered analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g., glopez"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full"
                aria-describedby="username-description"
              />
              <p id="username-description" className="sr-only">Enter your username to find investor twins.</p>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!username.trim()}>
              <Search size={18} className="mr-2" />
              Find My Twins
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
