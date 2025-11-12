const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes } = require('discord.js');

// Configuration depuis les variables d'environnement
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Vérification des variables d'environnement
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error('❌ Erreur : Variables d\'environnement manquantes !');
  console.error('Assurez-vous que DISCORD_TOKEN, CLIENT_ID et GUILD_ID sont définis.');
  process.exit(1);
}

// Création du client Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commandes
const commands = [
  new SlashCommandBuilder().setName('douaneon').setDescription('Active la douane (ouverte)'),
  new SlashCommandBuilder().setName('douaneoff').setDescription('Désactive la douane (fermée)')
].map(command => command.toJSON());

// Enregistrement des commandes sur le serveur
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('🔄 Enregistrement des commandes slash...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Commandes enregistrées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement des commandes:', error);
  }
})();

// Gestion des commandes
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'douaneon') {
      const embed = new EmbedBuilder()
        .setTitle('🟢 Douane Ouverte 🟢')
        .setDescription('La douane est maintenant **ouverte**.')
        .setColor(0x00ff00)
        .setImage('https://imgur.com/gallery/douane-ouverte-0YDiVaI')
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
      console.log('✅ Commande /douaneon exécutée');
    }

    if (interaction.commandName === 'douaneoff') {
      const embed = new EmbedBuilder()
        .setTitle('⛔ Douane Fermée ⛔')
        .setDescription('La douane est maintenant **fermée**.')
        .setColor(0xff0000)
        .setImage('https://imgur.com/gallery/douane-fermer-kER1iIp')
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
      console.log('✅ Commande /douaneoff exécutée');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution de la commande:', error);
    if (!interaction.replied) {
      await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
    }
  }
});

// Démarrage du bot
client.once('ready', () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
  console.log(`📊 Serveurs: ${client.guilds.cache.size}`);
  console.log(`👥 Utilisateurs: ${client.users.cache.size}`);
});

// Gestion des erreurs
client.on('error', error => {
  console.error('❌ Erreur Discord.js:', error);
});

process.on('unhandledRejection', error => {
  console.error('❌ Erreur non gérée:', error);
});

// Connexion du bot
client.login(TOKEN).catch(error => {
  console.error('❌ Impossible de se connecter:', error);
  process.exit(1);
});