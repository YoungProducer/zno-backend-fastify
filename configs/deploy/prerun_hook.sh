#! /bin/bash

set -e

printf "
port: ${PORT}
managementApiSecret: ${PRISMA_MANAGEMENT_API_SECRET}
databases:
  default:
    connector: mongo
    # host: ${DB_HOST}
    # port: ${DB_PORT}
    # database: ${DB_NAME}
    # schema: public
    # user: ${DB_USER}
    # password: ${DB_PASSWORD}
    # migrations: true
    # connector: mongo
    uri: mongodb+srv://WithoutHands:Sasha080701@mycluster-qntjt.azure.mongodb.net/test?retryWrites=true&w=majority
" >> ${PRISMA_CONFIG_PATH}