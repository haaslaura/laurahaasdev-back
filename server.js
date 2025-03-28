// On importe le package http de Node :
const http = require('http');

const app = require('./app');
app.set('port', process.env.PORT || 3000);

// La fonction ci-après est excécutée à chaque appel effectué sur ce serveur :
// const server = http.createServer((req, res) => {
//     res.end('Voilà la réponse du serveur')
// });

const server = http.createServer(app);

// Le serveur doit écouter les requêtes envoyées :
server.listen(process.env.PORT || 3000);