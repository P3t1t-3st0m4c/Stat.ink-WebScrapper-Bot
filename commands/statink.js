const { SlashCommandBuilder } = require('discord.js');
const { locals } = require('../../config.json');
const fs = require('node:fs');
const path = require('node:path');


let statink = new SlashCommandBuilder()
    .setName("statink")
    .setDescription("Slash commands for the statink bot.")

let subcommands = {};
const subcommandFiles = fs.readdirSync(path.join(__dirname, './subcommands/')).filter(file => file.endsWith('.js'));
for (const file of subcommandFiles) {
	const subcommand = require(path.join(__dirname, './subcommands/')+file);
    subcommands[subcommand.name] = subcommand.execute
	statink.addSubcommand(subcommand.subcommand)
}

let subcommandsGroups = {};
const subcommandGroupFiles = fs.readdirSync(path.join(__dirname, './subcommandGroups/')).filter(file => file.endsWith('.js'));
for (const file of subcommandGroupFiles) {
	const subcommandGroup = require(path.join(__dirname, './subcommandGroups/')+file);
    subcommandsGroups[subcommandGroup.name] = subcommandGroup.execute
	statink.addSubcommandGroup(subcommandGroup.subcommandGroup)
}

module.exports = {
    data: statink,
    async execute(interaction){
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'statink') {
            // Check if its a subCommandGroup before checking if it is a subCommand 
            // Because when a subCommandGroup is called it will have a subCommand too
            if (interaction.options.getSubcommandGroup()) await subcommandsGroups[interaction.options.getSubcommandGroup()](interaction, interaction.options.getSubcommand())
            else if (interaction.options.getSubcommand()) await subcommands[interaction.options.getSubcommand()](interaction)
            
        }
    }
}
    