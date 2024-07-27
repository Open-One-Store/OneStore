# OneStore Backend

This is the backend for both OneStore Apps and OneStore WebUI. It is built using ExpressJS.

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Setup a postgres database [Learn More](https://www.postgresql.org/docs/9.3/tutorial-createdb.html)
4. Setup Minio for file storage [Learn More](https://docs.min.io/docs/minio-quickstart-guide.html)
5. Copy the `.env.example` file to `.env` and fill in the required values
6. Run `npx prisma migrate` to create the database schema
7. Run `npx prisma generate` to generate the Prisma Client
8. Run `npm start` to start the server