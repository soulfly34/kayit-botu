
/*
	BU BOT 2020 SONLARINA YAKIN SATIŞ İÇİN YAPILMIŞTIR
	BU BOTU PAYLAŞMAK YASAKTIR.
	HAZIR ALTYAPIYI ALIP MESAJLARI EDİTLEYİP PAYLAŞMAK KOD BİLDİĞİN ANLAMINA GELMİYOR..
	BİRİDE BANA HAZIR ALTYAPIYI ALIP EDİTLEYİP PAYLAŞMAYI ÖĞRETSİN.
*/

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const db = require('quick.db');
const moment = require('moment')
require('moment-duration-format')
const commands = client.commands = new Discord.Collection();
const aliases = client.aliases = new Discord.Collection();

fs.readdirSync('./commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
    let command = require(`./commands/${files}`);
    if (!command.name) return console.log(`Hatalı Kod Dosyası => [/commands/${files}]`)
    commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return
    command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})


client.on('message', message => {
    const prefix = ".";
    if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return;
    cmd.run(client, message, args)
})

client.on('ready', () => {
    client.user.setPresence({ activity: { name: 'Developed by Soulfly' }, status: 'idle' })
    client.channels.cache.get(client.config.voiceChannel).join() // ses kanalı id
    console.log(`Bot ${client.user.tag} Adı İle Giriş Yaptı!`);
})
client.config = {
    token: '',//token
    voiceChannel: '',//ses kanalı
    vipRoles: [''],//vip rolleri
    boosterRoles: '',//boosterrolü
    ekipRoles: [''],//taglı rolü
    unregisteres: ['', ''],//kayıtsız rolü
    maleRoles: ['', '', ''],//erkek rolleri
    girlRoles: ['', '', ''],//kız rolleri
    mods: [''],//mod rolleri
    chat: '',//chat idsi
    channelID: '',//kayıt kanalı id
    tag: '',//tag
    guildID: '',//sunucu id
    taglog: '',//tag lod id
}


client.on("userUpdate", async function(oldUser, newUser) {
    const guild = client.guilds.cache.get(client.config.guildID)
    const role = guild.roles.cache.find(roleInfo => roleInfo.id === client.config.ekipRoles)
    const member = guild.members.cache.get(newUser.id)
    const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('#ff0000').setTimestamp().setFooter('Developed by Soulfly');
    if (newUser.username !== oldUser.username) {
        if (oldUser.username.includes(client.config.tag) && !newUser.username.includes(client.config.tag)) {
            member.roles.set(client.config.ekipRoles)
            client.channels.cache.get(client.config.taglog).send(embed.setDescription(` ${newUser} isminden \`${client.config.tag}\` çıkartarak ailemizden ayrıldı!`))
        } else if (!oldUser.username.includes(client.config.tag) && newUser.username.includes(client.config.tag)) {
            member.roles.add(client.config.ekipRoles)
            client.channels.cache.get(client.config.chat).send(`Tebrikler, ${newUser} tag alarak ailemize katıldı ona sıcak bir **'Merhaba!'** diyin.(${client.config.tag})`)
            client.channels.cache.get(client.config.taglog).send(embed.setDescription(`  ${newUser} ismine \`${client.config.tag}\` alarak ailemize katıldı`))
        }
    }

});
// Eventleri ayrı ayrı açtım kafanız karışmasın
client.on('guildMemberAdd', (member) => {
    if (member.user.username.includes(client.config.tag)) {
        member.roles.add(client.config.ekipRoles)
        const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('#ff0000').setTimestamp().setFooter('Developed by Soulfly');
        client.channels.cache.get(client.config.taglog).send(embed.setDescription(`<@${member.id}> adlı kişi sunucumuza taglı şekilde katıldı, isminde ${client.config.tag} sembolü bulunuyor.`))
    }
});

// aşağıdaki mapping tanımına sayı karşına emoji koyunuz
client.on('guildMemberAdd', (member) => {
    const mapping = {
        " ": "",
        "0": "", 
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": "",
        "9": "",
    };

    var toplamüye = member.guild.memberCount
    var emotoplamüye = `${toplamüye}`.split("").map(c => mapping[c] || c).join("")
    let memberDay = (Date.now() - member.user.createdTimestamp);
    let createAt = moment.duration(memberDay).format("Y [Yıl], M [Ay], W [Hafta], DD [Gün]")
    let createAt2 = moment.duration(memberDay).format("DD [Gün], HH [saat], mm [dakika]")
    if (memberDay > 604800000) {
        client.channels.cache.get(client.config.channelID).send(` Suncumuza hoşgeldin ${member} - \`${member.id}\`
 Seninle birlikte **${toplamüye}** üyeye ulaştık
 Hesabın **${createAt}** önce açılmış
 Kayıt olmak için ses odalarına girip ses teyit vermen gerekiyor`)
    } else {
        client.channels.cache.get(client.config.channelID).send(
            new Discord.MessageEmbed()
            .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))
            .setDescription(`${member}, Adlı Kullanıcı Sunucuya Katıldı Hesabı **${createAt2}** Önce Açıldığı İçin Şüpheli!`)
            .setTimestamp()
            .setThumbnail(member.user.avatarURL({ dynamic: true }))
            .setFooter(`Developed by Soulfly`))
    }
})
client.on('message', message => {
    const tag = message.content.toLowerCase()
    if (tag === '.tag' || tag === '!tag' || tag === 'tag') {
        message.channel.send(client.config.tag);
    }
})

client.login(client.config.token)
