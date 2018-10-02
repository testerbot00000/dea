require('./extensions');
const path = require('path');
const patron = require('patron.js');
const client = require('./singletons/client.js');
const IntervalService = require('./services/IntervalService.js');
const registry = require('./singletons/registry.js');
const db = require('./database');

client.registry = registry;

patron.RequireAll(path.join(__dirname, 'events'));

IntervalService.initiate(client);

(async () => {
  client.login(process.env.BOT_TOKEN);
  db.connect(process.env.MONGO_DB_URL);
})()
  .catch((err) => console.log(err));
