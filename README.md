# Firestore Migrate

Import CSV or JSON to Firestore.

## How to use

1.  Clone and run `$ npm install`
2.  Download the service account from your Firebase project settings, then save it as `credentials.json` in the project root.
3.  `$ npm run build`
4.  `$ fs-migrate -s <file path> -c <collection>`

Options:

```
-s, --src <path>          Source file path
-c, --collection <path>   Collection path in database
-i, --id [id]             Field to use for document ID
```
