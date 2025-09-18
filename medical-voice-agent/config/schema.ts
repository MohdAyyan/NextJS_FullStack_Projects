import { integer, pgTable, varchar, text, json } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  credits: integer(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export type IUser ={
 
  name: string;
  credits: number;
  email: string;
}


export const SessionChatTable = pgTable("sessionChatTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar({ length: 255 }).notNull(),
  createdBy: varchar({ length: 255 }).references(()=> usersTable.email),
  createdOn:varchar(),
  selectedDoctor: json(),
  notes: text(),
  conversation: json(),
  report: json(),

})