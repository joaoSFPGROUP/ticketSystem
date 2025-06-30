require('dotenv').config();
const { build } = require('electron-builder');

if (!process.env.GH_TOKEN) {
  console.error('❌ GH_TOKEN não definido no .env');
  process.exit(1);
}

build({
  config: {
    appId: 'com.sfpgroup.ticket',
    productName: 'Sistema Tickets',
    icon: 'src/images/logo32x32.ico',
    files: [
      {
        from: 'dist/',
        to: './',
        filter: ['**/*']
      },
      'main.js',
      'package.json'
    ],
    win: {
      target: 'nsis'
    },
    publish: [
      {
        provider: 'github',
        owner: 'joaoSFPGROUP',
        repo: 'ticketSystem',
        releaseType: 'release'
      }
    ]
  },
  publish: 'always'
})
  .then(() => {
    console.log('✅ Publicação concluída com sucesso!');
  })
  .catch(err => {
    console.error('❌ Erro ao publicar:', err);
    process.exit(1);
  });
