import { Client, GuildEmoji, Intents, Message, MessageReaction, PartialMessageReaction, PartialUser, Permissions, User, WebhookClient } from "discord.js";
import { Roles } from "./types";
import { rolesAdder, rolesRemover } from "./utils";

export const roles = Object.values(Roles);

export class Bot {
  private PREFIX = "$";
  private token: string;
  private client: Client;
  private webHookClient: WebhookClient;
  private rolesChannelId = "979807981183066162";

  constructor(_token: string) {
    this.token = _token
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ],
      partials: ["MESSAGE", "REACTION"],
    });
    this.webHookClient = new WebhookClient({ id: process.env.WEBHOOK_ID!, token: process.env.WEBHOOK_TOKEN! })
    this.attachListeners.call(this);
    this.login.call(this);
    
  }

  attachListeners() {
    this.client.on("ready", this.onReady.bind(this));
    this.client.on("emojiCreate", this.onEmojiCreate.bind(this));
    this.client.on("messageCreate", this.onmessageCreate.bind(this));
    this.client.on("messageReactionAdd", this.onMessageReactionAdd.bind(this));
    this.client.on("messageReactionRemove", this.onMessageReactionRemove.bind(this));
  }

  private login() {
    this.client.login(this.token);
  }
  
  onReady() {
    console.log(`BIG TAY is running 🚀🚀🚀`)
  }

  onEmojiCreate(emoji: GuildEmoji) {
    console.log(`new emoji, ${emoji.name}`)
  }

  async onmessageCreate(message: Message) {
    // ignore messages from bots
    if (message.author.bot) return;

    console.log(`${message.author.tag} sent ${message.content}`);
    // const bot = message.guild.members.cache.get(client.user.id);
    // console.log("bot permissions: ", bot.permissions.toArray(), bot.permissions.has(Permissions.FLAGS.KICK_MEMBERS, true))

    // handle command messages
    if (message.content.startsWith(this.PREFIX)) {
      const [COMMAND, ...args] = message.content
        .trim()
        .substring(this.PREFIX.length)
        .split(/\s+/);
      if (COMMAND === "kick") {
        console.log(
          "hasPermission, ",
          message.member?.permissions.has(Permissions.FLAGS.KICK_MEMBERS)
        );
        // if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return;
        if (args.length === 0) {
          message.reply("Please provide an ID")
          return;
        };

        try {
          const user = await message.guild?.members.kick(args[0]);
          message.channel.send(`${user} kicked out!!!`);
        } catch (e) {
          console.log("KICK ERROR: ", e);
          message.channel.send("Cannot kick user!!!");
        }
      } else if (COMMAND === "ban") {
        console.log(
          "hasPermission, ",
          message.member?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)
        );
        // if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS));
        if (args.length === 0) {
          message.reply("Please provide an ID");
          return;
        }

        try {
          const user = await message.guild?.members.ban(args[0]);
          message.channel.send(`${user} Banned ❌`);
        } catch (e) {
          console.log("BAN ERROR: ", e);
          message.channel.send(`Cannot ban user`);
        }
      } else if (COMMAND === "announce") {
        const message = args.join(" ");
        console.log("announcement : ", message);
        this.webHookClient.send(message);
      }
    }
  }

  onMessageReactionAdd(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
    if (reaction.message.channelId !== this.rolesChannelId) return;
    const { name } = reaction.emoji;
    if (!name) return;
    try {
      if (!roles.includes(name as Roles)) return;
      const member = reaction.message.guild?.members.cache.get(user.id);
      rolesAdder[name as Roles](member!);
      console.log("Add Role:", `${user.tag} -> ${name}`);
      // reaction.message.channel.send(`${user.tag} Added to Role ${name}`)
    } catch (e) {
      reaction.message.channel.send(`Error adding ${user.tag} to Role ${name}`)
      console.log("Error adding member to role: ", e);
    }
  }

  onMessageReactionRemove(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
    if (reaction.message.channel.id !== this.rolesChannelId) return;
    const { name } = reaction.emoji;
    if (!roles.includes(name as Roles)) return;
    if (!name) return;
    try {
      const member = reaction.message.guild?.members.cache.get(user.id);
      rolesRemover[name as Roles](member!);
      console.log("Remove Role:", `${user.tag} -> ${name}`);
      // reaction.message.channel.send(`${user.tag} Removed from Role ${name}`)
    } catch (e) {
      reaction.message.channel.send(`Error removing ${user.tag} from Role ${name}`)
      console.log("Error removing member from role: ", e);
    }
  }
}
