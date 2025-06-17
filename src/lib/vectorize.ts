import { client } from './mongo_db';
import { createPortfolioVector, getCustomerBuyTransactions, getMasterVocabulary, processCustomerPortfolio } from './helpers';

async function processAllCustomers() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");
  
    const db = client.db("sample_analytics");
    const transactionsCollection = db.collection("transactions");
    const customersCollection = db.collection("customers");
  
    const customers = await customersCollection.find({}).toArray();
    console.log(`Found ${customers.length} customers to process`);

    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      try {
        console.log(`\nProcessing customer ${i + 1}/${customers.length}: ${customer.name}`);
        await processCustomerPortfolio(
          customer._id,
          transactionsCollection,
          customersCollection
        );
        console.log(`Successfully processed ${customer.name}`);
      } catch (error) {
        console.error(`Error processing customer ${customer.name}:`, error);
      }
    }

    console.log("\nFinished processing all customers!");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}
