/**
 * 応答
 * @param {}} context 
 * @param {*} event 
 * @param {*} callback 
 */
const twilio = require('twilio');
exports.handler = async function(context, event, callback) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  const message = event.To == context.SALES_NUMBER ? 'こちらは営業窓口です。' : 'こちらはサポート窓口です。';
  twiml.say({
    voice: 'Polly.Mizuki',
    language: 'ja-JP',
  }, message);
  callback(null, twiml);
};
