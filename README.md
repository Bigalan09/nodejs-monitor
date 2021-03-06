# Monitor
A host monitor to send emails if server has gone down.

# Setup
You’ll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

Navigate into your workspace directory.

Run:

```git clone https://github.com/Bigalan09/es6-babel-boilerplate.git```

## 2. Install node.js and npm:

https://nodejs.org/en/


## 3. Install dependencies (optionally you could install [yarn](https://yarnpkg.com/)):

Navigate to the cloned repo’s directory.

Run:

```npm install```

or if you choose yarn, just run ```yarn```

## 4. Run the development server:

Run:

```npm run dev```


## Build for deployment:

Run:

```npm run deploy```

```pm2 start ./dist/app.js --name Monitor```

This will optimize and minimize the compiled bundle.