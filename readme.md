# Auth Microservice(Version 0.0.1)

## Overview

This microservice is designed to handle all authentication-related operations within our application ecosystem. It provides secure, scalable authentication capabilities, including user registration, login, using token-based authentication.

## Features

- **User Registration:** Allows new users to register to the application by providing necessary personal information.
- **User Login:** Handles user authentication and provides session tokens for accessing protected resources.

## Technologies

- **Language/Framework:** [ Typescript, Node.js with Express]
- **Database:** [ MongoDB ]
- **Authentication:** [ JWT, Bcrypt ]
- **Containerization:** [ Docker ]

## Getting Started

### Prerequisites

- Install node v18.19.0

### Installation / Running

1. Clone the repository:

   ```bash
   git clone https://github.com/ShashwotBhattarai/auth_microservice.git
   ```

2. Install NPM packages:

   ```bash
   npm install
   ```

3. Add env variables:

   ```bash
   DATABASEURI=
   JWTSECRET=
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   AWS_REGION=
   SQS_QUEUE_URL=
   PATH=
   Access_Control_Allow_Origin=
   ENV=
   PORT=
   ```

4. Run the application:

   ```bash
   npm run start
   ```

5. To test apis:

   ```bash
   Health check API:

   curl --location 'http://localhost:3001/auth/health' \
      --data ''


   Signup API:

   curl --location 'http://localhost:3001/auth/signup' \
   --header 'username: {{<USERNAME>}}' \
   --header 'password: {{<PASSWORD>}}' \
   --header 'Content-Type: application/json' \
   --data-raw '{
      "email": "{{<EMAIL>}}",
      "role": {{<"candidate">/<"recruiter">}}}'


   Login API:

   curl --location --request POST 'http://localhost:3001/auth/login' \
   --header 'username: {{<USERNAME>}}' \
   --header 'password: {{<PASSWORD>}}' \
   --data ''

   ```

### Test

```bash
   npm run test
```
