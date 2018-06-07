#!/usr/bin/env node

import * as admin from "firebase-admin";
import * as csv from "csvtojson";
import * as fs from "fs-extra";
import * as args from "commander";

args
  .version("1.0.0")
  .option("-s, --src <path>", "Source file path")
  .option("-c, --collection <path>", "Collection path in database")
  .option("-i, --id [id]", "Field to use for document ID")
  .parse(process.argv);

// Firebase App Initialization
var serviceAccount = require("../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Migrate a csv or json file to Firestore.
 */
async function migrate() {
  try {
    const collectionName = args.collection;
    const filePath = args.src;

    const colRef = db.collection(collectionName);
    const batch = db.batch();

    let data;
    if (filePath.includes(".json")) {
      data = await fs.readJSON(filePath);
    }

    if (filePath.includes(".csv")) {
      data = await csv().fromFile(filePath);
    }

    for (const item of data) {
      const id = args.id ? item[args.id].toString() : colRef.doc().id;
      const docRef = colRef.doc(id);

      batch.set(docRef, item);
    }

    await batch.commit();

    console.log("Firestore updated. Migration was a success!");
  } catch (error) {
    console.log("Migration failed!", error);
  }
}

// Start
migrate();
