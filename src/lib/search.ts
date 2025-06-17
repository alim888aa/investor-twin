import { Collection, Document } from "mongodb";

export interface SimilarCustomer extends Document {
  customerId: string;
  name: string;
  score: number;
}

export async function findSimilarCustomers(
  customersCollection: Collection,
  customerId: any,
  k: number = 5, 
): Promise<SimilarCustomer[]> {
  try {
    const customer = await customersCollection.findOne({ _id: customerId });
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }
    const sourceVector = customer.portfolio_vector;

    const pipeline = [
        {
        $vectorSearch: {
            index: "vector_index",
            path: "portfolio_vector",
            queryVector: sourceVector,
            numCandidates: 100, 
            limit: k + 1,
        },
        },
        {

        $project: {
            _id: 0,
            customerId: "$_id",
            name: 1, 
            username: 1,
            score: { $meta: "vectorSearchScore" }, 
        },
        },
    ];

    const similarCustomers = (await customersCollection
        .aggregate(pipeline)
        .toArray()) as SimilarCustomer[];

    return similarCustomers.filter(
        (doc) => doc.customerId.toString() !== customerId.toString(),
    );
  } catch (error) {
    console.error("Error finding similar customers:", error);
    throw error; 
  }
}
