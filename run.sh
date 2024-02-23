#!/bin/sh

ENV_FILE=".env"
APP_ENV=$(cat $ENV_FILE | grep "APP_ENV" | cut -d"=" -f2)

yarn install

if [[ $APP_ENV = "local" ]]
then
  echo "In mode dev."
  yarn run dev --host
else
  echo "In mode production."
  yarn run build
fi
