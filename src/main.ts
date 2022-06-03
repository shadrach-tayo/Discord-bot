import { Bot } from "./bot";
import dotenv from "dotenv";
import { Client, Intents } from "discord.js";
dotenv.config();

const token = process.env.DISCORDJS_BOT_TOKEN!
const bigTay = new Bot(token);
console.log(`BIG TAY is running 🚀🚀🚀`)
