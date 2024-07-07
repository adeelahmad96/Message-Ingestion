const AWS = require('aws-sdk');
const SQS = new AWS.SQS();
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const QUEUE_URL = process.env.SQS_QUEUE_URL;

exports.verifyToken = async (event) => {
  const params = event.queryStringParameters;
  const token = params['hub.verify_token'];
  const challenge = params['hub.challenge'];

  if (token === VERIFY_TOKEN) {
    return {
      statusCode: 200,
      body: challenge
    };
  } else {
    return {
      statusCode: 403,
      body: 'Forbidden'
    };
  }
};

exports.authenticatePayload = async (event) => {
  const payload = JSON.parse(event.body);

  if (payload.object && 
      payload.entry && 
      payload.entry[0].changes && 
      payload.entry[0].changes[0] && 
      payload.entry[0].changes[0].value.messages && 
      payload.entry[0].changes[0].value.messages[0]) {

    const phone_number_id = payload.entry[0].changes[0].value.metadata.phone_number_id;
    const from = payload.entry[0].changes[0].value.messages[0].from;
    const msg_body = payload.entry[0].changes[0].value.messages[0].text.body;

    // If authentication is successful, send payload to SQS
    const params = {
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(payload)
    };

    try {
      await SQS.sendMessage(params).promise();
      return {
        statusCode: 200,
        body: 'Message authenticated and sent to SQS'
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: 'Error sending message to SQS'
      };
    }
  } else {
    return {
      statusCode: 400,
      body: 'Invalid payload structure'
    };
  }
};
