const QRCode = require('qrcode');

QRCode.toDataURL('I am a pony!', function (err, url) {
    console.log("url,,,,,,,,,,,",url)
  })

  
QRCode.toString('I am a pony!',{type:'terminal'}, function (err, url) {
    console.log("Sdfdsf",url)
  })