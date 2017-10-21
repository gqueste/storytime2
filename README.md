# StoryTime

Single page application to list and quickly search between Characters descriptions

## Features
* Characters listing
* Quick Tag based search engine

## Technologies
### Backend
* MongoDB
* REST API via Express (NodeJS)
* TDD development (Mocha / Chai)
### Frontend
* Angular4 (First steps with this framework)
* Bootstrap

## TODO List
### Backend
* Enhance PUT Characters to take into account other parameters than just the name (same parameters used for POST)
* Add tests for POST and PUT characters with all parameters
* POST and PUT characters : handle Tags list to avoid multiple queries
### Frontend
* SuperMethod to differentiate Edit / Add
* Edit : compare tags and call add and delete methods to add or remove tags
* Get rid of duplicated code

## Deploy
* Have a MongoDB instance running
* `npm run start` to have the REST API running
* `cd front/` and then `ng serve` to have the front running