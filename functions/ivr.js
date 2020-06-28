/**
 * 営業デモ用IVR
 * @param {}} context 
 * @param {*} event 
 * @param {*} callback 
 */
const twilio = require('twilio');
exports.handler = async function(context, event, callback) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  const message = 'お電話ありがとうございます。​' +
    'KDDIウェブコミュニケーションズです。' +
    '音声ガイダンスに従い操作をお願いします。' +
    'ガイダンスの途中でも操作は可能です。​' +
    '営業窓口へのご連絡は１を。' +
    'サポート窓口へのご連絡は２を。' +
    'その他オペレーターとの通話をご希望の場合「その他」と発話してください。';
  const gather = twiml.gather({
    input: 'speech dtmf',
    language: 'ja-JP',
    hints: 'その他',
    numDigits: 1,
    action: '/action',
    method: 'POST'
  });
  gather.say({
    voice: 'Polly.Mizuki',
    language: 'ja-JP',
  }, message);
  twiml.redirect({
    method: 'POST'
  }, '/ivr');
  callback(null, twiml);
};
