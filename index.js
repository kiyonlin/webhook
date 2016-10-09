const http = require('http');
const codingHandler = require('coding-webhook-handler');
const githubHandler = require('github-webhook-handler');
const spawn = require('child_process').spawn;
const mailer = require('./modules/mailer');

const fs = require('fs');

fs.readFile('./config.json', 'utf-8', (err, data) => {
  if (err) throw (err);
  const config = JSON.parse(data);
  webhook(config);
});

const webhook = (config) => {
  let handlerArr = [];
  let nameArr = [];

  for (let name in config) {
    nameArr.push('/webhook/'+name);

    let createHandler = config[name].platform === 'github' ? githubHandler : config[name].platform === 'coding' ? codingHandler : null;
    if (!createHandler) throw new Error('platform should be github or coding');

    const handler = createHandler({
      path: '/webhook/' + name,
      token: config[name].token ? config[name].token : '',
      secret: config[name].secret ? config[name].secret : ''
    });

    handlerArr.push(handler);

    handler.on('error', err => {
      console.error('Error:', err.message);
    });

    handler.on('push', event => {
      if (config[name].command) {
        runCommand('sh', [config[name].command], txt => {
          console.log(txt);
          mailer({
            subject: name+' 部署成功',
            text: txt
          });
        });
      }else{
        console.warn('there is no command attribute for '+ name);
      }
    });
  }

  http.createServer((req, res) => {
    let i = nameArr.indexOf( req.url.split('?').shift() );
    if(i<0) throw new Error('请确认webhook上的url格式是否正确');
    handlerArr[i](req,res,(err) => {
      res.statusCode = 404;
      res.end('no such location');
    });
  }).listen(7777);
}

const runCommand = (cmd, args, callback) => {
  const child = spawn(cmd, args);
  let response = '';
  child.stdout.on('data', buffer => response += buffer.toString());
  child.stdout.on('end', () => callback(response));
}