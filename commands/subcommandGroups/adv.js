const { advancedDataSplat1, advancedDataSplat2, advancedDataSalmon } = require("../../lib/scrapper");
const { dataEmbedBuilder } = require("../../lib/builders")
const { format, checkLocale } = require("../../lib/helpers")
const { locale } = require("../../config.json")
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
    // Check if the locale is forced by the server
    // For the time being use config.json instead of a db
    // locale === db
    const user = interaction.options.getString("user");
    const string = format(
        strings[checkLocale(interaction, locale, strings)].searchUser, 
        { user : user }
    )
    await interaction.reply({ content : string });

    const localization = locale[interaction.guildId] != "none" ? locale[interaction.guildId] : interaction.locale
    const data = await choices[interaction.options.getSubcommand()](user, localization, checkLocale(interaction, locale, strings))
    await dataEmbedBuilder(data, interaction)
}