# Yoere

# Overview

A text-based escape room game

# Team Members

+ Zach Schwartz
+ Thomas Capen
+ Andrew Hoener

# Application Initialization

To use this application you should have `node`, `npm` and `mongodb` installed and issue the following commands:

1. `npm install`: this will install the required `node` libraries.
2. `npm run buildDev`: this will compile the application code and produce a `dist` directory. Compresses JS files into main.js and links to html files. Initializes your `mongodb` with the necessary data for the application to function.
3. `npm start`: this will run the Express server, `server.js`, allowing you to view the running application in the browser window.

# Directory & File Structure
+ src/css: Custom css files
+ src/html: Base HTML files, mostly blank except for React Hooks
+ src/img: Images for the build, copied into dist/img
+ src/js: React components and javascript
+ src/server: server-dev and server-prod. (Currently server-dev is the only one used)
+ index.js: Imports from all the react components
+ Webpack configs: Currently only webpack.dev.config.js is used
