const axios = require('axios');

const sendSms = async (mobileNumber, otp) => {
    const authKey = 'CQf6pw5xnh54aagWc4Ey';
    const authToken='mGbVNAKvxO8gtsvycq7jHXD7A0OTYCN2hcO3e1mz'
    const url = `https://restapi.smscountry.com/v0.1/Accounts/${authKey}/SMSes/`;
  
    const body = {
      "Text": `M-${otp} is your Moii verification code.`,
      "Number": `971${mobileNumber}`,
      "SenderId": "Moii Wash",
      "DRNotifyUrl": "https://3.29.90.7:4100/notifyurl",
      "DRNotifyHttpMethod": "POST",
      "Tool": "API"
    };
  
    try {

        const authHeaderValue = Buffer.from(`${authKey}:${authToken}`).toString('base64');
        const response = await axios.post(url, body, {
        headers: {
            Authorization: `Basic ${authHeaderValue}`,
          'Content-Type': 'application/json',
        },
      });
  
     
      if (response.data.Success !== undefined) {
        if (response.data.Success) {
            console.log('SMS sent successfully');
        } else {
            console.error(`Failed to send SMS: ${response.data.Message}`);
        }
    } else {
        console.log('SMS accepted for processing (Messages Queued)');
    }    
    } catch (error) {
      console.error('Error sending SMS:', error.message);
    }
  };
  
  module.exports = {
    sendSms
  };
  