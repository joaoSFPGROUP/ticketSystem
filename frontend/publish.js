require('dotenv').config();
const { build } = require('electron-builder');

build({
  config: {
    publish: [
      {
        provider: 'github',
        owner: 'joaoSFPGROUP',
        repo: 'ticketSystem'
      }
    ]
  },
  publish: 'always'
}).catch(err => {
  console.error('Erro ao publicar:', err);
  process.exit(1);
});
