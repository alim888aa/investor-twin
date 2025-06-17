"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersRound, Search } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const [allUsernames, setAllUsernames] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (Array.isArray(data)) {
          setAllUsernames(data);
        }
      } catch (error) {
        console.error("Failed to fetch usernames:", error);
      }
    };
    fetchUsernames();
  }, []);

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
          <Combobox
            items={allUsernames.map((name) => ({
              value: name,
              label: name,
            }))}
            value={username}
            onSelect={setUsername}
            searchPlaceholder="Search username..."
            notFoundMessage="Loading.."
            selectButtonText="Select a username"
          />
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
