const Discord = require('discord.js');
const db = require('quick.db')

module.exports = {
    name: 'topteyit',
    aliases: ['tt', 'teyittop'],
	run: async(client, message, args) => {         
	let top = message.guild.members.cache.filter( uye  => db.get(`erkek_${uye.id}`)).array().sort((uye1, uye2) => Number(db.get(`kız_${uye2.id}`))+Number(db.get(`erkek_${uye1.id}`))).slice(0, 10).map((uye, index) => (index+1)+"-) <@"+ uye +"> | \`" + db.get(`toplam_${uye.id}`)).join('\n') + " teyit\` ";
	if (!top) return message.channel.send("Herhangi bir veri bulunamadı!")
	 message.channel.send(new Discord.MessageEmbed().setTitle('Top Teyit')
	.setTimestamp()
	.setColor('#03003d')
	.setFooter("Developed by Soulfly")
	.setDescription(top)//
	.setThumbnail(message.guild.iconURL({ dynamic: true })));
 }
}
