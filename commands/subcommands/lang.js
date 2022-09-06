const { SlashCommandSubcommandBuilder, SlashCommandStringOption } = require('discord.js');
const { localizations } = require('../../lib/consts.json');
const { locale } = require("../../config.json")
const { strings } = require("../../lib/consts.json")

const stringOption = new SlashCommandStringOption()
    .setName('lang')
    .setDescription('The language to choose')
    .setRequired(true)
    .addChoices({ name : "none", value : "none" });

for (let [choice, value] of Object.entries(localizations)){
    stringOption.addChoices({ name : choice, value : value });
}

const subcommand = new SlashCommandSubcommandBuilder()
    .setName("lang")
    .setDescription("Forces a language for the replies")

for (const [locale,string] of Object.entries(strings)) {
    subcommand.setDescriptionLocalization(locale, string.langDesc)
    stringOption.setDescriptionLocalization(locale, string.langOptionDesc)
}

subcommand.addStringOption(stringOption)

module.exports.name = subcommand.name;
module.exports.subcommand = subcommand
module.exports.execute = async (interaction) => {
    // Check role and get the db running to save the data for the guildId
    await interaction.reply({ content : ":stop_sign: This command is still in development. :stop_sign:", ephemeral : true})
    console.log(locale[interaction.guildId], interaction.options.getString("lang"))
}