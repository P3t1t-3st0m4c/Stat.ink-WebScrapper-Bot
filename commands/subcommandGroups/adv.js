const { advancedDataSplat1, advancedDataSplat2, advancedDataSalmon } = require("../../lib/scrapper");
const { dataEmbedBuilder } = require("../../lib/builders")
const { SlashCommandSubcommandGroupBuilder } = require('discord.js');
const choices = {
    "spl1" : advancedDataSplat1,
    "spl2" : advancedDataSplat2,
    "salmon" : advancedDataSalmon
}
const subcommandGroup = new SlashCommandSubcommandGroupBuilder()
    .setName("adv")
    .setDescription("Display advanced info about a player")
    .addSubcommand(subcommand =>
        subcommand
            .setName("spl1")
            .setDescription("Display advanced info for splatoon 1 about a player")
            .addStringOption(option =>
                option.setName('user')
                    .setDescription('The username of the user to search.')
                    .setRequired(true)),
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("spl2")
            .setDescription("Display advanced info for splatoon 2 about a player")
            .addStringOption(option =>
                option.setName('user')
                    .setDescription('The username of the user to search.')
                    .setRequired(true)),
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("salmon")
            .setDescription("Display advanced info for splatoon 2 salmon run about a player")
            .addStringOption(option =>
                option.setName('user')
                    .setDescription('The username of the user to search.')
                    .setRequired(true)),
    )

module.exports.name = "adv"
module.exports.subcommandGroup = subcommandGroup
module.exports.execute = async (interaction) => {
    const user = interaction.options.getString("user");
    console.log(user);
    console.log(interaction.options.getSubcommand())
    await interaction.reply({ content : `Searching for ${user}... (it may take a moment)` });
    const data = await choices[interaction.options.getSubcommand()](user)
    await dataEmbedBuilder(data, interaction)
}