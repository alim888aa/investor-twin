import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { client } from "@/lib/mongo_db"; 
import { findSimilarCustomers } from "@/lib/search";
import { getCustomerBuyTransactions } from "@/lib/helpers";
import { ObjectId } from "mongodb";

import {
  analyzeInvestmentStrategies,
  type AnalyzeInvestmentStrategiesInput,
  type AnalyzeInvestmentStrategiesOutput,
} from "@/ai/flows/analyze-investment-strategies";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  const username = params.username;

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }

  try {
    await client.connect();
    const db = client.db("sample_analytics");
    const customersCollection = db.collection("customers");
    const transactionsCollection = db.collection("transactions");

    const customer = await customersCollection.findOne({ username: username });

    if (!customer) {
      return NextResponse.json(
        { error: `User '${username}' not found. User must be a customer in MongoDB Analytics dataset` },
        { status: 404 },
      );
    }
    const similarCustomers = await findSimilarCustomers(
      customersCollection,
      customer._id,
    );

    let analysis: AnalyzeInvestmentStrategiesOutput | string =
    "No twins found, so no AI analysis was performed.";

    let topTwin = null;
    if (similarCustomers && similarCustomers.length > 0) {
      topTwin = similarCustomers[0];
      const topTwinFullDoc = await customersCollection.findOne({
        _id: new ObjectId(topTwin.customerId),
      });

      if (topTwinFullDoc) {
        const userPortfolio = await getCustomerBuyTransactions(
          customer.accounts,
          transactionsCollection,
        );

        const twinPortfolio = await getCustomerBuyTransactions(
          topTwinFullDoc.accounts,
          transactionsCollection,
        );

        try {
          const aiInput: AnalyzeInvestmentStrategiesInput = {
            userPortfolio: userPortfolio,
            twinPortfolio: twinPortfolio,
            twinName: topTwin.name,
          };

          const aiOutput = await analyzeInvestmentStrategies(aiInput);
          analysis = aiOutput
        } catch (aiError) {
          console.error("Error calling AI agent:", aiError);
          analysis =
            "There was an error generating the AI analysis. Please try again later.";
        }
      }
    } else {
      console.log("No similar customers found to perform AI analysis on.");
    }

    return NextResponse.json({
      twins: similarCustomers,
      analysis: analysis,
    });

  } catch (error) {
    console.error("Error in API route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to connect to the database.", details: errorMessage },
      { status: 500 },
    );
  }
}