const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    ]
});
let token = ''
const commands = [
    {
      name: 'sign',
      description: 'Sign a player!',
      options: [
            {
                name: 'member',
                type: 6,
                required: true,
                description: 'Provide a member!'
            }
        ]
    },
];
const rest = new REST({version: 10}).setToken(token);
var teams = {
    'Arizona Cardinals': 0n // Do not remove the n, just edit the 0 and put it to the Emoji ID.
}; // Role Name: Emoji ID
var coaches = {
    'Franchise Owner': 'FO',
    'General Manager': 'GM',
    'Head Coach': 'HC',
    'Assistant Coach': 'AC'
}

async function commandHandler(interaction) {
    const commands = {
        sign: async () => { // Sign Command
            const target = await interaction.guild.members.fetch(interaction.options.data[0].value);
            const author = interaction.member;
            if (target != null) {
                let team, emoji, coach;
                let author_roles = author.roles.cache;
                for (const entry of author_roles) {
                    let role = entry[1];
                    if (teams[role.name] != null) {
                        team = role;
                        emoji = await interaction.guild.emojis.fetch(teams[role.name]);
                    } else if (coaches[role.name] != null) {
                        coach = role;
                    }
                    if (team && emoji && coach) {
                        break;
                    }
                }
                if (team && emoji && coach) { // Connected to Team, Emoji, and Coach..
                    let roles = target.roles.cache;
                    for (const entry of roles) {
                        let role = entry[1];
                        if (teams[role.name] != null) { // Already On A Team
                            // Create your own embed here and send a message..
                            return;
                        }
                    }
                    let embed = new EmbedBuilder()
                        .setDescription(`${target} has successfully been **signed** to ${emoji}${team}`);

                    await target.roles.add(team);
                    await interaction.reply({embeds: [embed]});
                } else if (coach == null) { // Not A Coach
                    // Create and embed and send it if u want.
                    return;
                } else if (team == null || emoji == null) { // Missing Team
                    // Create and embed and send it if u want.
                    return;
                }
            } else {
                console.log('Target not found.')
            }
        }
    }
    if (commands[interaction.commandName]) {
        commands[interaction.commandName]();
    } else {
        console.log(`${interaction.commandName} could not be found within the CommandHandler.`);
    }
}

(async () => {
    console.log('Registering commands..')
    await rest.put(Routes.applicationCommands("Bot ID / Client ID"), {body: commands});
})();

client.on('ready', async () => {
    console.log(`Connected to ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => { 
    commandHandler(interaction);
})

client.login(token);