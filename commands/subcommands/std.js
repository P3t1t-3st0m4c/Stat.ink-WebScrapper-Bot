const { retrieveStandardData } = require("../../lib/scrapper");
const { dataEmbedBuilder } = require("../../lib/builders")
const { SlashCommandSubcommandBuilder } = require('discord.js');

const subcommand = new SlashCommandSubcommandBuilder()
    .setName("std")
    .setDescription("Display standard info about a player")
    .addStringOption(option =>
        option.setName('user')
            .setDescription('The username of the user to search.')
            .setRequired(true))

module.exports.name = "std"
module.exports.subcommand = subcommand
module.exports.execute = async (interaction) => {
    const user = interaction.options.getString("user");
    await interaction.reply({ content : `Searching for ${user}... (it may take a moment)` });
    const data = await retrieveStandardData(user, interaction.locale)
    await dataEmbedBuilder(data, interaction)
}