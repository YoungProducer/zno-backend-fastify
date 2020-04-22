# Zno server

### Description
This repository containts backend part of application which allows stutends to prepare to exams or train on different subjects, such as Math, etc. This app use jwt authorization. Also backend store images for test suites in 'uploads' folder, this folder is in .gitignore.

### Technologies
This app based on node.js with REST API.
 - Framework - ```fastify```;
 - DB - ```mongo```;
 - As ORM used ```prisma``` it's really powerfull tool but it must be tested because for it needed addtional server, in future will maybe used ```mongoose```;
 - Language - Typescript;
 - Testing - jest;

### Env variables
List of allowed variables:
 - *JWT_ACCESS_COOKIES_MAX_AGE* - "life" of access token in cookies;
 - *JWT_ACCESS_EXPIRES_IN* - "life" of access token;
 - *JWT_REFRESH_COOKIES_MAX_AGE* - "life" of refresh token in cookies;
 - *JWT_REFRESH_EXPIRES_IN* - "life" of refresh token;
 - *JWT_SECRET* - secret for encoding the jwt tokens;
 - *JWT_SESSION_EXPIRES_IN* - this value is for cases when user doesn't want to stay logged in for long term, in case of this app used 86400000 ms(24 hours);
 - *CLIENT_ENDPOINT* - endpoint of desktop version of frontend(default - ```http://localhost:8080```);
 - *CLIENT_MOBILE_ENDPOINT* - endpoint of mobile version of frontend(default - ```http://localhost:8081```);
 - *ADMIN_ENDPOINT* - endpoint of admin panel(default - ```http://localhost:8082```);
 - *S3_BUCKET* - name of s3 bucket(will be removed in future);
 - *AWS_ACCESS_KEY_ID* - aws access key id(will be removed in future);
 - *AWS_SECRET_ACCESS_KEY* - aws access key(will be removed in future)
 - *PORT* - server port(default - ```4000```);
 - *HOST* - server host(default - ```localhost```);
 - *PROTOCO*: - server protocol(default - ```http```).

List of required variables:
 - *JWT_ACCESS_COOKIES_MAX_AGE*;
 - *JWT_ACCESS_EXPIRES_IN*;
 - *JWT_REFRESH_COOKIES_MAX_AGE*;
 - *JWT_REFRESH_EXPIRES_IN*;
 - *JWT_SECRET*;
 - *JWT_SESSION_EXPIRES_IN*;
 - *S3_BUCKET*(temporary);
 - *AWS_ACCESS_KEY_ID*(temporary);
 - *AWS_SECRET_ACCESS_KEY*(temporary).

### Launch
First of all you must install packages via ```yarn``` or ```npm i ```(```npm ci```).
Then you can run in dev mode via ```yarn dev``` or ```npm run dev```
or you can build and start server via ```yarn build``` or ```npm run build`` end then ```yarn start``` or ```npm start```.