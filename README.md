# BeStrong API
BeStrong is your personal activity diary. Track you meals, physical activity and weight.

### How to run
First of all, `npm install`.  
Then `npm run start` or `npm run start:docker`.  
You can see full list of environment variables in `./lib/config/custom-environment-variables.json` file.

### Technology Stack
- Hapi.js ecosystem (Hapi + Joi + Boom + Good + HapiSwagger)
- PostgreSQL (Knex.js + Objection.js)
- A lot of fun and inspiration

### API Documentation
For enabling Swagger UI set `SWAGGER_ENABLED=1` env variable and follow `http://<yourhost>/documentation`.

### Features list
- Weight tracker
- Food tracker
- (WIP) Physical activity tracker
