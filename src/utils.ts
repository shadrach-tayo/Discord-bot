import { GuildMember } from "discord.js";
import { Roles } from "./types";

export const roleIds = {
  python: "979808292140355616",
  javascript: "979808085256323102",
  solidity: "979808569463566357",
  rust: "979808472034078780",
};

export const rolesAdder: Record<Roles, (member: GuildMember) => Promise<GuildMember>> = {
  [Roles.Solidity]: (member) => member.roles.add(roleIds.solidity),
  [Roles.Python]: (member) => member.roles.add(roleIds.python),
  [Roles.Rust]: (member) => member.roles.add(roleIds.rust),
  [Roles.Javascript]: (member) => member.roles.add(roleIds.javascript),
};
export const rolesRemover: Record<Roles, (member: GuildMember) => Promise<GuildMember>> = {
  [Roles.Solidity]: (member) => member.roles.remove(roleIds.solidity),
  [Roles.Python]: (member) => member.roles.remove(roleIds.python),
  [Roles.Rust]: (member) => member.roles.remove(roleIds.rust),
  [Roles.Javascript]: (member) => member.roles.remove(roleIds.javascript),
};