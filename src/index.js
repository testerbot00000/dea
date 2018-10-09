const path = require('path');
const patron = require('patron.js');
const Logger = require('./utility/Logger.js');

(async () => {
  await require('./extensions');

  const client = require('./structures/Client.js');
  const IntervalService = require('./services/IntervalService.js');

  await patron.RequireAll(path.join(__dirname, 'events'));
  await IntervalService.initiate(client);

  await client.db.connect('mongodb://deabeta:deabeta1@ds239681.mlab.com:39681/deabeta');
  await client.login('NDk4OTY3Mjk2NDg0ODM1MzM4.Dp62Yg.Jw0R_NPpLzBMFH6aPbF86ly329o');

  //await client.db.connect('mongodb://dea:deadea1@ds123603.mlab.com:23603/rewrite');
  //await client.login('MzQwNjE0NDc3ODc3NjA4NDU4.Dpup0w.NHTPCAr_a2pzCDEGOyT2u8eDSy0');

  //await client.db.connect(process.env.MONGO_DB_URL);
  //await client.login(process.env.BOT_TOKEN);
})()
  .catch(e => Logger.handleError(e));

process.on('unhandledRejection', e => Logger.handleError(e));
