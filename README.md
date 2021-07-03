# mTSuite Frontend

## Install

npm install

## Run

npm start

## Versions

* UX Theme ng-zorro 8.5.2

## Typescript openapi codegen

* Add file .tgz to  directory "local-packages". Name file: "mt-api-{version}.tgz"

* Change version dependency in file package.json: "@codegen/mt-api": "file:local-packages/mt-api-{version}.tgz"

* Use it. ex: import { DefaultService } from '@codegen/mt-api'

## Upload temporal server

rsync -avzL --partial -e "ssh -p5426" . root@66.97.36.67:/var/lib/docker/volumes/keycloak_themes/_data --progress

DBxR2nvYtd6T
