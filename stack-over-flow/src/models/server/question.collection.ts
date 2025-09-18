import {db, questionCollection } from './../name';

import { databases } from './config';
import { Permission } from 'node-appwrite';

  const createQuestionCollection = async () => {
    await databases.createCollection(db, questionCollection, questionCollection,[
        Permission.read("any"),
        Permission.write("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),

    ])
    console.log("Question collection created successfully");
    await Promise.all([
        databases.createStringAttribute(db, questionCollection, "title", 100, true),
        databases.createStringAttribute(db, questionCollection, "content", 10000, true),
        databases.createStringAttribute(db, questionCollection, "authorId", 50, true),
        databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true),
        databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false),
      ]);
      console.log("Question Attributes created")
      // await Promise.all([
      //   databases.createIndex(db, questionCollection, "title", IndexType.Fulltext,
      //       ["title"],
      //       ["asc"]
      //   ),
      //   databases.createIndex(db, questionCollection, "content", IndexType.Fulltext,
      //       ["content"],
      //       ["asc"]
      //   ),
       
      // ])
      
}
export default createQuestionCollection
