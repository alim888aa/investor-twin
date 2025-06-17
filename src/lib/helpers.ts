import { Collection } from "mongodb";
import { client } from '@/lib/mongo_db';

export async function getCustomerBuyTransactions(accounts: number[], transactionsCollection: Collection) {
  const customerTransactions = await transactionsCollection.aggregate([
    {
      $match: {
        account_id: { $in: accounts }, 
        "transactions.transaction_code": "buy"
      }
    },
    {
      $unwind: "$transactions"
    },
    {
      $match: {
        "transactions.transaction_code": "buy"
      }
    },
    {
      $group: {
        _id: "$transactions.symbol"  
      }
    }
  ]).toArray();

  return customerTransactions.map((item) => item._id);
}

export async function getMasterVocabulary(transactionsCollection: Collection) {
  const allStockSymbols = await transactionsCollection.aggregate([
    {
      $match: {
        "transactions.transaction_code": "buy"
      }
    },
    {
      $unwind: "$transactions"
    },
    {
      $match: {
        "transactions.transaction_code": "buy"
      }
    },
    {
      $group: {
        _id: "$transactions.symbol"
      }
    },
    {
      $project: {
        _id: 0,
        symbol: "$_id"
      }
    }
  ]).toArray();

  const vocabulary = allStockSymbols.map(item => item.symbol);
  return vocabulary;
}

export function createPortfolioVector(masterVocabulary: string[], userStocks: string[]) {
  const portfolioVector = new Array(masterVocabulary.length).fill(0);
  
  for (const stock of userStocks) {
    const position = masterVocabulary.indexOf(stock);
    portfolioVector[position] = 1;
  }
  
  return portfolioVector;
}

export async function processCustomerPortfolio(
  customerId: any,
  transactionsCollection: Collection,
  customersCollection: Collection
) {
  const masterVocabulary = await getMasterVocabulary(transactionsCollection);

  const customer = await customersCollection.findOne({ _id: customerId });
  if (!customer) {
    throw new Error(`Customer with ID ${customerId} not found`);
  }

  const buyTransactions = await getCustomerBuyTransactions(
    customer.accounts || [],
    transactionsCollection
  );

  const portfolioVector = createPortfolioVector(masterVocabulary, buyTransactions);

  await customersCollection.updateOne(
    { _id: customerId },
    { $set: { portfolio_vector: portfolioVector } }
  );

  return {
    customerId,
    name: customer.name,
    portfolioVector
  };
}

