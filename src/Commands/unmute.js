const Command = require('../Structures/Command');
const MutedRoleSchema = require('../Schemas/MutedRoleSchema');

module.exports = new Command({
    name: "unmute",
    description: "Unmutes a target member",
    type: "SLASH",
    slashCommandOptions: [
        {
            name: 'target',
            description: 'The target member you want to mute',
            type: 'USER',
            required: true,
        },
    ],
    permission: 'ADMINISTRATOR',
    async run(client, message, args) {
        const membr = message.options.getMember('target');
        const member = message.guild.members.cache.get(membr.user.id);

        if (member.id === message.member.id) return message.reply({
            content: '❌ You cannot unmute yourself!',
            ephemeral: true,
        });

        const role = message.guild.roles.cache.find(role => role.name === 'Muted');

        if (!role) return message.reply({
            content: '❌ Please set a Muted Role!',
            ephemeral: true,
        });

        const embed = new client.main.MessageEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true, }))
            .setTitle('This user has been unmuted');

        if (!member.roles.cache.some(role => role.name === 'Muted')) {
            return message.reply({
                content: '❌ User is not muted!',
                ephemeral: true,
            });

        }

        await member.roles.remove(role.id);

        message.reply({
            content: 'User Unmuted!',
            ephemeral: true,
        });

        message.channel.send({ embeds: [embed] });
        member.send(`🎙️ You are unmuted in ${message.guild.name}! But remember to follow the server rules next time!`); 
    }
});