# Gmail send a message with Express and queue

## Packages

_Install Backend_  
`yarn install`

## Environments

_Copy .env.example to .env_  
`cp .env.example .env`

## Docker: Redis

_Run containers with logging_  
`docker-compose up`

_Run containers without logging_  
`docker-compose up -d`

_Stop containers_  
`docker-compose down`

## Google init

1. Go here https://developers.google.com/gmail/api/quickstart/nodejs
2. Click `Enable the Gmail API`
3. Download credentials to the root (could be changed in .env) of the project (check `credentials.example.json`)

## Launch application

`yarn run`

## Google OAuth2

_Now we need to init connection by getting token_

Follow the instructions in the console. Also, may check this guide (`https://www.youtube.com/watch?v=jhxzhpFanfU&t=995s&ab_channel=RPA%26AutomationTraining-AfsarAli`)

_Be aware about url encoding. P.S. `%2F` is `/`_

We need to have `token.json` (check `token.example.json`)

## Have fun ;)
