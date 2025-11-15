#!/bin/sh
npm run migrate
npm run seed
node dist/src/index.js
