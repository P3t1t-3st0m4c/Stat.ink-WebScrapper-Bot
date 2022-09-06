const { retrieveStandardData } = require("../../lib/scrapper");
const { dataEmbedBuilder } = require("../../lib/builders")
const { locale } = require("../../config.json")
const { strings } = require("../../lib/consts.json")
const { SlashCommandSubcommandBuilder, SlashCommandStringOption } = require('discord.js');

const stringOption = new SlashCommandStringOption()
    .setName('user')
    .setDescription('The username of the user to search.')
    .setRequired(true)

const subcommand = new SlashCommandSubcommandBuilder()
    .setName("std")
    .setDescription("Display standard info about a player")
    

for (const [locale,string] of Object.entries(strings)) {
    subcommand.setDescriptionLocalization(locale, string.stdDesc)
    stringOption.setDescriptionLocalization(locale, string.stdUserOptionDesc)
    stringOption.setNameLocalization(locale, string.stdUserOption)
}

subcommand.addStringOption(stringOption)

module.exports.name = subcommand.name
module.exports.subcommand = subcommand
module.exports.execute = async (interaction) => {
    // Check if the locale is forced by the server
    // For the time being use config.json instead of a db
    const localizations = interaction.guildId in locale ? locale[interaction.guildId] : interaction.locale
    const user = interaction.options.getString("user");
    await interaction.reply({ content : `Searching for ${user}... (it may take a moment)` });
    const data = await retrieveStandardData(user, localizations)
    await dataEmbedBuilder(data, interaction)
}