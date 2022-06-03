import { Bot } from "./bot";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.DISCORDJS_BOT_TOKEN!
new Bot(token);
