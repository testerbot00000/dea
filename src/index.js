const path = require('path');
const patron = require('patron.js');
const Logger = require('./utility/Logger.js');

(async () => {
  await require('./extensions');

  const client = require('./structures/client.js');
  const IntervalService = require('./services/IntervalService.js');

  await patron.RequireAll(path.join(__dirname, 'events'));
  await IntervalService.initiate(client);

  //  BOT_TOKEN=MzQwNjE0NDc3ODc3NjA4NDU4.DpltdA.yrmJd3wG2v3uUai1YjToXsmXrjM
  //  MONGO_DB_URL=mongodb://dea:deadea1@ds123603.mlab.com:23603/rewrite
  await client.db.connect('mongodb://dea:deadea1@ds123603.mlab.com:23603/rewrite');
  await client.login('MzQwNjE0NDc3ODc3NjA4NDU4.DpltdA.yrmJd3wG2v3uUai1YjToXsmXrjM');
})()
  .catch(e => Logger.handleError(e));

process.on('unhandledRejection', e => Logger.handleError(e));
