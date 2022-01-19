# commons

Project that shares modules between the microservices.

## Launching

1. First, run 'npm i' at the root level to install the dependencies

2. You will need a pair of RSA keys (Key Size 2048-bit and Format Scheme PKCS #1 Base64), you'll use these keys in the microservices, each one has their own configs about it (check their readmes)

3. You don't need .env file here, just in the services projects

4. You don't need a database for this project

5. Compile with 'tsc' (I recommend to have TypeScript globally installed)

6. Unfortunately, you don't have tests created here (but you can create if want to)

7. There is nothing to run here, but you have prepared this project to be functional to the others
