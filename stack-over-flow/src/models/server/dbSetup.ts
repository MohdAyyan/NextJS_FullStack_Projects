import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

async function createCollectionIfNotExists(createFn: () => Promise<void>, collectionName: string) {
  try {
    await createFn();
    console.log(`${collectionName} collection created successfully`);
  } catch (error: any) {
    if (error?.type === 'collection_already_exists') {
      console.log(`${collectionName} collection already exists`);
    } else {
      throw error;
    }
  }
}

export default async function getOrCreateDB() {
  try {
    // First try to get the database
    await databases.get(db);
    console.log("Database connection established");
    
    // Create collections if they don't exist
    await Promise.all([
      createCollectionIfNotExists(createQuestionCollection, "Question"),
      createCollectionIfNotExists(createAnswerCollection, "Answer"),
      createCollectionIfNotExists(createCommentCollection, "Comment"),
      createCollectionIfNotExists(createVoteCollection, "Vote")
    ]);

    console.log("All collections verified successfully");
    return databases;

  } catch (error: any) {
    // Handle database not found or limit reached
    if (error?.type === 'additional_resource_not_allowed') {
      console.error("Database limit reached. Please upgrade your Appwrite plan or delete unused databases.");
      throw new Error("Database limit reached. Please upgrade your Appwrite plan or delete unused databases.");
    }

    if (error?.type === 'database_not_found') {
      try {
        // Create new database
        await databases.create(db, db);
        console.log("Database created successfully");
        
        // Create all collections for the new database
        await Promise.all([
          createQuestionCollection(),
          createAnswerCollection(),
          createCommentCollection(),
          createVoteCollection()
        ]);
        console.log("All collections created successfully");
        return databases;
      } catch (createError) {
        console.error("Error creating database or collections:", createError);
        throw createError;
      }
    }

    // Re-throw any other errors
    throw error;
  }
}
