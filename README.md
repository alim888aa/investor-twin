# Investor Twin AI 🤖

Find your investment doppelgänger and get AI-powered portfolio insights.

---

### [Demo Link]([https://studio--investor-twin-finder.us-central1.hosted.app/])

### [Video]([])

## Application Description

This application finds the customer with the most similar investments for a given username. It uses MongoDB's sample Analytics dataset and Atlas Vector Search for its core logic. The search was enabled by creating one-hot encoded vectors for each customer's unique stock symbols and storing them in the database (vectorize.ts).

When a user enters their username, the app finds the user in the database and does a $vectorSearch on their portfolio vectors to identify the top five customers with similar portfolios (search.ts). Finally, the application finds all unique stocks of the most similar twin and passes them with the user's unique stocks to the AI to analyze the difference between their portfolios.

The MongoDB functions to create vector embeddings were done locally while the rest of the application was developed using Firebase Studio.

## Tech Stack

*   Framework: Next.js 15 (App Router)
*   Language: TypeScript
*   Database & Vector Search: MongoDB Atlas (using the `sample_analytics` dataset)
*   AI Integration: Google AI Platform
    *   Orchestration: Firebase Studio
    *   Generative Model: Gemini API
*   Deployment: Google Cloud
*   UI: Tailwind CSS, shadcn/ui


## Getting Started Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/alim888aa/investor-twin
    cd [YOUR-PROJECT-NAME]
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root of the project and add your credentials:
    ```
    MONGO_URI="your_mongodb_atlas_connection_string"
    GEMINI_API_KEY="your_google_ai_api_key"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.
