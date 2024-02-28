const io = require('socket.io-client');
const socket = io('http://43.205.138.209:4110', {
  query: {
    token: 'U2FsdGVkX1+CgxPtNx9Bm1XjM1tUqkmo5URYOs0jUPUDoH8uQFmR6BiWtiF211lB91vF3IXW8FGZ4jh2NA2gJelmG81C0/B3Je9LXbKRoC0Hrsb4o7w2uHX3udWL+P7HdbXbpl1q/Xh8mymsFGxCR9DfdK3NqFIwJ0HLQDoXl3Bw89tHNht2INv6lR1R/JAJ/yma0qd2236/gc7VOloAX8IORzpiIXxd+hDuRqL+0iaujNbzCtCES/0J/7KbXihhRnD2B16tzwUiEBVV3x7YuKsv3IgoB9xC3Rqp9WrRwWQhs6iIPnERMs6I/+EZ0RP8b+SopUFM/hOf8svdC52IHRmjBHORDKWtZW2cw1LD0jTp8ub41H7YFrSGj855mIWq7e9oD0ajo+ab4sTRzt01l5mpsZ494g8tpGJmtc/pnAHg8riOXubW6GKi73fVuBzx'
  }
});
socket.on('connect', () => {
  console.log('Connected to the Socket.io server');
  //call when chat page open
  
});
let count =0;
setTimeout(()=>{
  socket.emit('join_room', {
    strChatId: "650a5171e8d291a72925691c", 
    strType: "private"
  });
},0)
socket.on('get_message', (message) => {
  if(!count)
  socket.emit('send_message', {
    strChatId: "650a5171e8d291a72925691c",
    strMessageType: "image",
    strType: "private",    
    strMessage: "Return message",
    strUrl:"https://thebluegrasssituation.com/wp-content/uploads/2020/08/Anna-Square-Headshot-1240x1240.jpg",

  });
  console.log(`Server says:  `, JSON.stringify(message));
  ++count;
});

socket.on('chat_history', (message) => {
  console.log(`chat_history:  `, message);
});
socket.on('disconnect', () => {
  //call when chat page close
  socket.emit('join_room', { 
    strType: "private"
  });
  console.log('Disconnected from the Socket.io server');
});

setTimeout(() => {})