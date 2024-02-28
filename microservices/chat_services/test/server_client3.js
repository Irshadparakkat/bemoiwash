const io = require('socket.io-client');
const socket = io('http://localhost:4110', {
  query: {
    token: 'U2FsdGVkX18G50rgFgUXeR6Ug9fe+R+nB1moeqoFyQutYj3GkJfYrAGTNuTHQIr+MDnyZVVIMBvSMXjcy+tnKODZ6wj/0z9GquWAdmoTr9+WqkDEB9UWJc3C3VDgQ7y20x6CHl1p0pFebPCbzzkSnOV0RX/wWJB+J125MAq0B4AtDBVQW4M/N6sMU+UVMktJ++h9D7IOsJi2yLkynpp8BGXkWK2ZV/8k7qFI2pY/kihqyxCMPa2ZvGmQBcqnQziNbC9miQFrL47naEBuSeeTgwpOMVjtdav3gtXTyLp3jjOsrC44PbqrzUOigPDTxhgKDGxtiRoPh55QCvSmhiD+hQiwK7jFdOLEp7jnyouwG6TuS5ZzxZW4zgAJPkC/7ETnBWcutia/ZaHLhffPr1KYwkBjwPPALJLQTG7S/wxB38Hmka36MxB1ceGuKdnrso/3'
  }
});
socket.on('connect', () => {
  console.log('Connected to the Socket.io server');
  //call when chat page open
  
});

setTimeout(()=>{
  socket.emit('join_room', {
    strChatId: "65011e09bfab875e2a82a34f", 
    strType: "private"
  });
},0)
// socket.on('get_message', (message) => {
//   socket.emit('send_message', {
//     strChatId: "65011e09bfab875e2a82a34f",
//     strMessageType: "text",
//     strType: "private",
//     strMessage: "Hi Got you message"
//   });
//   console.log(`Server says:  `, JSON.stringify(message));
// });

socket.on('chat_history', (message) => {
  console.log(`Schat_history:  `, message);
});
socket.on('disconnect', () => {
  //call when chat page close
  socket.emit('left_room', { 
    strChatId: "65011e09bfab875e2a82a34f", 
    strType: "private"
  });
  console.log('Disconnected from the Socket.io server');
});

setTimeout(() => {})