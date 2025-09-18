
import { Client, Account, Avatars, Databases, Storage } from "appwrite";
import env from "../../app/env"

const client = new Client()
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId);                 // Your project ID

const account = new Account(client);
const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const promise = account.getPrefs();

promise.then(function (response) {
    console.log(response); // Success
}, function (error) {
    console.log(error); // Failure
});

export { client, account, databases, avatars, storage}
