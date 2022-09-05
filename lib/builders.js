const { EmbedBuilder } = require('discord.js');

const BaseEmbedBuilder = (data) => {
    return new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(data.title)
        .setThumbnail(data.imageUrl)
        .setURL(data.url)
}

const dataEmbedBuilder = async (data, interaction) => {
    if (data.error){
        console.log(data.error)
        await interaction.editReply({content : data.error[2]});
        return;
    }
    data = data.success
    var embed = BaseEmbedBuilder(data)
    var count = 0
    var replyed = false
    
    for (let [title, _data] of Object.entries(data.data)) {
        // Check if the data is going to be over 25
        if (count + 1 + _data.length >= 25){
            count = 0
            replyed = true
            await interaction.editReply({embeds: [embed], content: ""})
            embed = BaseEmbedBuilder(data)
        }
        // + 1 for the title
        count += 1 + _data.length
        embed.addFields(
            {"name": title, "value": '\u200B'}
        )
        for (let [i,field] of _data.entries()){
            _field = Object.entries(field)[0]
            embed.addFields({name : _field[0], value : _field[1], inline : true})
        }
    }
    replyed ? await interaction.followUp({embeds: [embed]}) : await interaction.editReply({embeds: [embed], content: ""})
    
    
}

module.exports = {dataEmbedBuilder : dataEmbedBuilder}