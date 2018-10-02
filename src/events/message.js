const db = require('../database');
const client = require('../singletons/client.js');
const Constants = require('../utility/Constants.js');
const ChatService = require('../services/ChatService.js');
const discord = require('discord.js');
const Logger = require('../utility/Logger.js');
const NumberUtil = require('../utility/NumberUtil.js');
const patron = require('patron.js');
const registry = require('../singletons/registry.js');
const handler = new patron.Handler(registry);

client.on('message', (msg) => {
  (async () => {
    if (msg.author.bot) {
      return;
    }

    const inGuild = msg.guild !== null;

    if (msg.guild !== null) {
      msg.dbUser = await db.userRepo.getUser(msg.author.id, msg.guild.id);
      msg.dbGuild = await db.guildRepo.getGuild(msg.guild.id);
    }

    if (Constants.data.regexes.prefix.test(msg.content) === false) {
      return inGuild === true && msg.member !== null ? ChatService.applyCash(msg) : null;
    }
    

    const result = await handler.run(msg, Constants.data.misc.prefix);

    if (result.success === false) {
      let message;

      switch (result.commandError) {
        case patron.CommandError.CommandNotFound: {
          return;
        }
        case patron.CommandError.Cooldown: {
          const cooldown = NumberUtil.msToTime(result.remaining);

          return msg.channel.tryCreateErrorMessage('Hours: ' + cooldown.hours + '\nMinutes: ' + cooldown.minutes + '\nSeconds: ' + cooldown.seconds, { title: result.command.names[0].upperFirstChar() + ' Cooldown'});
        }
        case patron.CommandError.Exception:
          if (result.error instanceof discord.DiscordAPIError) {
            if (result.error.code === 0 || result.error.code === 404 || result.error.code === 50013) {
              message = 'I do not have permission to do that.';
            } else if (result.error.code === 50007) {
              message = 'I do not have permission to message you. Try allowing DMs from server members.';
            } else if (result.error.code >= 500 && result.error.code < 600) {
              message = 'Houston, we have a problem. Discord internal server errors coming in hot.';
            } else {
              message = result.errorReason;
            }
          } else if (result.error.code === '22P02' || result.error.code === '22003') {
            message = 'An error has occurred due to the use of excessively large numbers.';
          } else {
            message = result.errorReason;
            await Logger.handleError(result.error);
          }
          break;
        case patron.CommandError.InvalidArgCount:
          message = 'You are incorrectly using this command.\n**Usage:** `' + Constants.data.misc.prefix + result.command.getUsage() + '`\n**Example:** `' + Constants.data.misc.prefix + result.command.getExample() + '`';
          break;
        default:
          message = result.errorReason;
          break;
      }

      await Logger.log('Unsuccessful command result: ' + msg.id + ' | Reason: ' + result.errorReason, 'DEBUG');

      return msg.tryCreateErrorReply(message);
    }

    return Logger.log('Successful command result: ' + msg.id, 'DEBUG');
  })()
    .catch((err) => Logger.handleError(err));
});
