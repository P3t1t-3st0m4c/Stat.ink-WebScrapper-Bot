module.exports.format = (text, args) => {
    for(var attr in args){
        text = text.split('${' + attr + '}').join(args[attr]);
    }
    return text
}

module.exports.checkLocale = (interaction, locale, strings) => {
    let localization = ""
    // Forced and in strings
    if (locale[interaction.guildId] in strings && locale[interaction.guildId] != "none") localization = locale[interaction.guildId]
    // Not forced and in strings
    else if (interaction.locale in strings) localization = interaction.locale
    // Not forced and not in strings
    else localization = "en-US"
    return localization
}