# messages-service

Service responsible to manage accounts, account authentication, account settings and account emails.

## Launching

1. First, do the **commons** project setup

2. After, run 'npm i' at the root level to install the dependencies

3. You will need a keys folder at root level with a RSA private.key (Key Size 2048-bit and Format Scheme PKCS #1 Base64)

4. You have to create a .env file at root level with the same vars as .env.example (follow his comments)

5. Create a database and put his configs at the respective env vars (no need to create the tables)

6. Compile with 'tsc' (I recommend to have TypeScript globally installed)

7. Run the tests with 'npm test'

8. Run in dev mode with 'npm run dev' to make your manual tests

9. Run the microservice as prod with 'npm start'

## Docs

In the routes/accounts.ts file you'll find docs about each endpoint.
