import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { analyzeInvestmentStrategies, type AnalyzeInvestmentStrategiesInput } from '@/ai/flows/analyze-investment-strategies';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username;

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock twins data. In a real app, this would come from a database or another service.
  const mockTwins = [
    { name: "NovaGrowth Capital", score: parseFloat((Math.random() * (0.98 - 0.85) + 0.85).toFixed(2)) },
    { name: "QuantumLeap Ventures", score: parseFloat((Math.random() * (0.95 - 0.80) + 0.80).toFixed(2)) },
    { name: "Zenith Portfolios", score: parseFloat((Math.random() * (0.92 - 0.75) + 0.75).toFixed(2)) },
  ];

  try {
    const aiInput: AnalyzeInvestmentStrategiesInput = {
      username: username,
      twins: mockTwins,
    };
    const aiOutput = await analyzeInvestmentStrategies(aiInput);

    return NextResponse.json({
      twins: mockTwins,
      analysis: aiOutput.analysis,
    });
  } catch (error) {
    console.error('Error calling AI agent:', error);
    // Fallback to a more generic mock analysis if AI fails
    return NextResponse.json({
      twins: mockTwins,
      analysis: `This is a mock AI analysis for ${username}. It highlights potential similarities in investment portfolios and suggests areas for diversification based on common strategies observed in similar investor profiles. Due to an internal error, a more detailed analysis could not be generated at this time.`,
    }, { status: 500 });
  }
}
