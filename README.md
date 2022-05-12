# SeguraCruz

## About

### Deployment

This app is deployed to Azure, usually via VS Code. Install the Azure VSC extension, login, and deploy the `chatbot` directory specifically.

### Background

SeguraCruz is a WhatsApp chatbot designed to help citizens in Bolivia report roadway accidents and injuries. Roadway accidents are a major cause of injury and death in Bolivia, and SeguraCruz was built in an effort to gather crowdsourced data on the accidents that are happening.

### Tech Stack

SeguraCruz is built using the following technologies:

#### Frontend

1. HTML/SASS
2. JavaScript
3. React
4. Mapbox
5. Semantic UI

#### Backend

1. Node
2. Express
3. JavaScript
4. MariaDB
5. Twilio

## Install

### Mapbox

Mapbox is used to display the data gathered from the chatbot on a map in the admin dashboard. In `Map.js`, there is a constant for a Mapbox API key. This will need to be replaced by making an account on [Mapbox.com](https://mapbox.com) and copying your account's API key into the `Map.js` file.

### Database

SeguraCruz is built using MariaDB. For Mac users, you can install MariaDB through Homebrew: `brew install mariadb`. You can then start it by running `brew services start mariadb`. Please refer to online tutorials for how to set up your own database instance on your local computer and in production.

The `seguracruz.sql` file contains the database schema for the app in the root folder of the project. Run that file on your database instance to generate the database for the app. Make sure to create a dedicated user for the database that has proper access privileges. Remember the database name, user, and password so you can set up the chatbot properly later.

### Website

1. Change the `proxy` field in `package.json` to the port the chatbot will be running on. Make sure to change this again if the port is different in production. Keep `localhost` if the chatbot is running on the same server.
2. Run `yarn install` in the `website` directory
3. Run `yarn start` to start the frontend
4. To build the app for production, run `yarn build`. This will automatically move the build to the chatbot folder, making the entire chatbot folder ready for deployment to a server.

### Chatbot

#### App Setup

1. Create a `.env` file in the `chatbot` directory with the following fields:

```
NODE_ENV=development
PORT=0000
DB_HOST=localhost
DB_DATABASE=database
DB_USER=user
DB_PASSWORD=password
SECRET=secret
TOKEN_SECRET=secret
```

Environment variables will need to be set in production for the backend to work properly. The `.env` file is for development only. Please fill in your database credentials and generate random strings for both the `SECRET` and `TOKEN_SECRET` fields to maximize security.

2. Run `yarn install` in the `chatbot` directory
3. Run `yarn start` and the app will start listening on the PORT specified in the `.env` file

#### Twilio Setup

The only thing needed for Twilio is to point the phone number to the chatbot backend. You do this by navigating to the Twilio console and signing in using appropriate credentials. Navigate to the Whats App Senders tab on the left and edit the sender for SeguraCruz. Then, update the webhook url with the appropriate url in the following format: `https://example.com/sms`. Also make sure `POST` is the HTTP method being used for the webook.

The chatbot should now forward any messages it receives in WhatsApp to the backend app running on your server. You can refer to the following guides for more information:

1. [Overview of WhatsApp Business API](https://www.twilio.com/docs/whatsapp/api#monitor-the-status-of-your-whatsapp-outbound-message)
2. [Connect your Twilio Number to your WhatsApp Business Profile](https://www.twilio.com/docs/whatsapp/tutorial/connect-number-business-profile)
3. [Twilio WhatsApp API Quick Start for Node](https://www.twilio.com/docs/whatsapp/quickstart/node)
4. [Twilio Console](https://console.twilio.com/)
