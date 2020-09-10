# Running Server locally

## Prerequisites

- Node v12.14+ (latest LTS recommended)
- Postgres v12.x

## Start RDFmapped

_If your postgres DB is good to go & you have the minimum .env params, otherwise [see below](../blob/master/server/README.md#configure-for-local-development "Configuring for local dev") for config_

Run database migrations, install/update dependencies and run in desired node env

1.  `npm run db-migrate up`
2.  `npm install`
3.  `npm run prod/dev-start` (the latter uses nodemon)

_Please note that in order to use the 3rd party APIs integrated into the RDF server you may need to register a dev account on 3rd party sites & include your API keys in the environment configuration._

## Configure for local development

### Setting up local database for testing
1.  Download and install [PostgreSQL Core Distribution](https://www.postgresql.org/download "PSQL Download") version 12.x
2.  Configure Postgres root user's password to match 'DB_PASS' in .env and default port to be 5432 
3.  Add Postgres to your PATH
4.  Create local database for application using `createdb -U postgres rdfdatabase`
5.  Run database migrations using `npm run db-migrate up`

### Environment variables

#### Minimum necessary environment variables

``` markdown
### Postgres
DB_HOST=localhost
DB_DATABASE=rdfdatabase
DB_USER=postgres
DB_PASS=elephant

### Express session
SESSION_SECRET=tnahpele

### Octokit
CREATE_GITHUB_ISSUES=0

### Jose
SYMMETRIC_ENC_ENABLED=1
```

#### LinkedIn Learning API
You need a LinkedIn Learning API admin account in order to test the API functionality.

The server is configured to automatically renew the token once expired.

``` markdown
### LinkedIn Learning API
LINKEDIN_LEARNING_ID=TBD
LINKEDIN_LEARNING_SECRET=TBD
LINKEDIN_LEARNING_TOKEN=IwillRenew
```

#### Email sending
Our server is currently configured to use SendGrid as the email relay, but you can quickly change this if you'd prefer to use something else.

In order to use the built in email functions, you will need at least the following:

``` markdown
### SendGrid Email
SENDGRID_API_KEY=SG.yourkey
DEFAULT_EMAIL_ADDRESS=email@exmaple.com
CONTACT_EMAIL_ADDRESS=email@exmaple.com
SUBMISSION_EMAIL_ADDRESS=email@exmaple.com
BUG_REPORT_EMAIL_ADDRESS=email@exmaple.com
SUMMARY_EMAIL_ADDRESS=admins@example.com
```

#### Configuring log level
You can specify the desired log level in .env

``` markdown
### Logging
LOG_LEVEL=info
TEST_LOG_LEVEL=debug
```

#### reCAPTCHA

Note sure why you would want this for local testing

``` markdown
### Recaptcha
GOOGLE_RECAPTCHA_KEY
```
