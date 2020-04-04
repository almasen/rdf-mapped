# Server

## Running locally
Start by running `npm install` in a terminal
### Database
1. Download and install [PostgreSQL Core Distribution](https://www.postgresql.org/download/) version 12.x
2. Configure Postgres root user's password to be 'asd123' and default port to be 5432
3. Add Postgres installation `/bin` directory to PATH
4. Create local database for application using `createdb -U postgres rdfdatabase`
5. Run database migrations using `npm run db-migrate up`