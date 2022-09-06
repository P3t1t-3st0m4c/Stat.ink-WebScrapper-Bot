const { strings } = require("../../../lib/consts.json")
const { SlashCommandSubcommandBuilder, SlashCommandStringOption } = require('discord.js');

const stringOption = new SlashCommandStringOption()
    .setName('user')
    .setDescription('The username of the user to search.')
    .setRequired(true)

const subcommand = new SlashCommandSubcommandBuilder()
    .setName("salmon")
    .setDescription("Display advanced info for splatoon 2 salmon run about a player")

for (const [locale,string] of Object.entries(strings)) {
    subcommand.setDescriptionLocalization(locale, string.advSalmonDesc)
    stringOption.setDescriptionLocalization(locale, string.stdUserOptionDesc)
    stringOption.setNameLocalization(locale, string.stdUserOption)
}

subcommand.addStringOption(stringOption)

module.exports.name = subcommand.name
module.exports.subcommand = subcommand