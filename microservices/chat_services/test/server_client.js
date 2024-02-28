const io = require('socket.io-client');
const socket = io('https://chat.be.moii.ae', {
  query: {
    token: 'U2FsdGVkX1+3crx3HMHRQd6aDF6MrCaoNZAx/dfM+YjAKt2PnGQl9lrOi3EgrsgGvwS6a19R5/fDkQiUsHB0tXW+GWDxBfgyrcJKBDwHhGxRzWO475iL4l+fK7ErkZROIbVjtTm957HY3qU0Zqc4prfQ0h8diOOasRJY/fwvs92cYvarF6qn+ogUtZ6FbdM3v3q1JqhsbgTKWLPYUSiefxGmRDMG9ujTRsgemi8Rt7UoyCMQIUYoIBc0fptCzLsbeb+jUTTf29xs2LBrfiFfnA0bvqOCPgrlFvmvX/ZSixoeA7bjc9dAXlBJjjug1/jIvUEUX63t8ZefcR4gmnZsp1mDbfoFnR1uVvYvMiraJ9vhow3Xb/KgKmscurra8H5dC24g5dpnqNZDo5rxCGFxWQ4w8bpnJ/s6u5+UUX7T6QclDnyIhP71s2YJJvt8UubOuSv8G5+yPGsU/OvGA6seIcFGrpUhxwa2KMwFEMv1vJv6m/uoAtTFeOxcIYXNHx7ZklafTF/1FCS6euAUvHvhwJ/BDuQ3Sixx7cgCpcEHw2WJxz6E9oyVsvAy0hKFD7AbPby5imBb21fkhcf5dWOv4n5magJTmLKfYenvFe6kIhdd17+0fbRbnJWAL4KNwcPU3waeHb4mUiNHpDxdkGs2tzMpHRE49Dz0UjVaPQNXJtdZYkUF9pnNTa9BU60jaQ4YgEfclpEtG0MQuXto9mhZejy0UGr2i+zxqvCvr5J2lF7oRxq0f9oRI2SdhNLbRQpsqdK+vRX7bhCRu3a6wIaQOKGTJprzGquBRwLM4OGn3actL8ODmaejQD4S3Gw1yP2WxYNm+oPDArwXZjUgzJaNhnDiqVhDraRsloqUigb89FDKYB0iEsg8RR8b8H/aI8N0Eqxl70GJ0qGniyiVhTGJ/h90yeOO4AwX1948vwt74F3hQ54yzrJjXd29g0HiBay7dLkwMIcUAqRtVWT5D+deOCi4ya9++YUVmFBvPbgqITjWcnN+U3BLIIlSBCpnMWZwX47C+jjBhO8u58t8azJXhcIlmaMjGfh5MWT+HMW3qDL7Z5+m5DaSz3bJRGlPD1b+8cZ0uzdIzRrOP5XvH+R1ImnFj+tS9iqaLhz7MF1sTShy7xkSm51ChYva7/Ef0OCXymOGQUvrZD/OrwAm9gGY9vIC9pHQ8FTJ+AVVJmOwNVS0sJQuNbqzBx2MLa55n93ZgmoZ9+JqZ/PXQPXDkVZPiw=='
  }
});
socket.on('connect', () => {
  console.log('Connected to the Socket.io server');

});

setTimeout(() => {
  socket.emit('send_message', {
    strChatId: "650a50dbe8d291a72925691b",
    strMessageType: "text",
    strType: "private",
    strMessage: "This is my image",
    strUrl:"https://thebluegrasssituation.com/wp-content/uploads/2020/08/Anna-Square-Headshot-1240x1240.jpg",
  });
}, 2000);

socket.on('get_message', (message) => {
  console.log(`Server says:  `, JSON.stringify(message));
});


socket.on('disconnect', () => {
  socket.emit('join_room', { 
    strType: "private"
  });
  console.log('Disconnected from the Socket.io server');
});