const { advancedDataSplat1, advancedDataSplat2, advancedDataSalmon } = require("../../lib/scrapper");
const { dataEmbedBuilder } = require("../../lib/builders")
const { SlashCommandSubcommandGroupBuilder } = require('discord.js');
const { strings } = require("../../lib/consts.json")
const fs = require('node:fs');
const path = require('node:path');

const choices = {
    "spl1" : advancedDataSplat1,
    "spl2" : advancedDataSplat2,
    "salmon" : advancedDataSalmon
}

const subcommandGroup = new SlashCommandSubcommandGroupBuilder()
    .setName("adv")
    .setDescription("Display advanced info about a player")

let subcommands = {};
const subcommandFiles = fs.readdirSync(path.join(__dirname, './adv/')).filter(file => file.endsWith('.js'));
for (const file of subcommandFiles) {
	const subcommand = require(path.join(__dirname, './adv/')+file);
    subcommands[subcommand.name] = subcommand.execute
	subcommandGroup.addSubcommand(subcommand.subcommand)
}

for (const [locale,string] of Object.entries(strings)) {
    subcommandGroup.setDescriptionLocalization(locale, string.advDesc)
}

module.exports.name = subcommandGroup.name
module.exports.subcommandGroup = subcommandGroup
module.exports.execute = async (interaction) => {
    const user = interaction.options.getString("user");
    await interaction.reply({ content : `Searching for ${user}... (it may take a moment)` });
    const data = await choices[interaction.options.getSubcommand()](user, interaction.locale)
    await dataEmbedBuilder(data, interaction)
}