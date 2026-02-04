// Простой http+WebSocket сервер для сайта и онлайн-чата
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(PUBLIC_DIR, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const mime = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      }[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    }
  });
});

const wss = new WebSocket.Server({ server });
let messages = [];
let onlineUsers = new Map(); // ws -> {nick, avatar, color}
let userIds = new Map(); // ws -> userId
let idCounter = 1;

wss.on('connection', function connection(ws) {
  // Назначаем уникальный id
  const userId = 'u' + (idCounter++);
  userIds.set(ws, userId);
  ws.send(JSON.stringify({yourId: userId}));
  ws.send(JSON.stringify({history: messages.slice(-50)}));

  ws.on('message', function incoming(message) {
    let msg;
    try {
      msg = JSON.parse(message);
      if (typeof msg === 'object' && msg.nick && msg.avatar && (msg.text || msg.image) && msg.time && msg.color) {
        // поддержка reply
        if (msg.reply && typeof msg.reply === 'object') {
          msg.reply = {
            nick: msg.reply.nick,
            text: msg.reply.text,
            image: msg.reply.image
          };
        }
        // приватные сообщения
        if (msg.toId) {
          // ищем ws по id
          for (const [ws2, id] of userIds.entries()) {
            if (id === msg.toId && ws2.readyState === ws2.OPEN) {
              ws2.send(JSON.stringify({...msg, private:true}));
              ws.send(JSON.stringify({...msg, private:true}));
              break;
            }
          }
        } else {
          messages.push(msg);
          if (messages.length > 1000) messages = messages.slice(-1000);
          onlineUsers.set(ws, {nick: msg.nick, avatar: msg.avatar, color: msg.color, id: userIds.get(ws)});
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(msg));
            }
          });
          broadcastOnline();
        }
      }
    } catch(e) {}
  });
  ws.on('close', function() {
    onlineUsers.delete(ws);
    userIds.delete(ws);
    broadcastOnline();
  });
});

function broadcastOnline() {
  const users = Array.from(onlineUsers.entries()).map(([ws, u]) => ({...u, id: userIds.get(ws)}));
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({online: users}));
    }
  });
}

server.listen(PORT, () => {
  console.log('Сервер запущен на http://localhost:' + PORT);
});