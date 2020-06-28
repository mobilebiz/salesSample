/**
 * 営業デモ用IVR
 * @param {}} context 
 * @param {*} event 
 * @param {*} callback 
 */
const twilio = require('twilio');
exports.handler = async function (context, event, callback) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  // 入力値の確認
  const digits = event.Digits || '';
  const speechResult = event.SpeechResult || '';
  const from = event.From || '';
  console.log(`digits: ${digits} speechResult: ${speechResult}`)
  if (digits !== '1' && digits !== '2' && speechResult.match(/.*その他.*/) == null) {
    twiml.say({
      voice: 'Polly.Mizuki',
      language: 'ja-JP',
    }, '入力された値が正しくありません。');
    twiml.redirect({
      method: 'POST'
    }, '/ivr');
  } else {
    // 入力値に応じた処理
    if (digits == '1') {
      // １が押されたので、営業窓口に転送
      const dial = twiml.dial({
        callerId: context.DEMO_NUMBER
      });
      dial.number(context.SALES_NUMBER);
    } else if (digits == '2') {
      // ２が押されたので、サポート窓口に転送
      const dial = twiml.dial({
        callerId: context.DEMO_NUMBER
      });
      dial.number(context.SUPPORT_NUMBER);
    } else {
      // 「その他」と発話されたので発信者の電話番号を確認
      if (from.match(/^\+81[789]0[1-9]/) == null) {
        // 携帯以外
        twiml.say({
          voice: 'Polly.Mizuki',
          language: 'ja-JP',
        }, '弊社サイトのお問い合わせフォームより詳細内容をご入力いただけますでしょうか。改めて担当よりご連絡いたします。');
      } else {
        // 携帯
        const apiKey = context.ACCOUNT_SID; // .envにデフォルトで記載されている値を使います
        const apiSecret = context.AUTH_TOKEN; // .envにデフォルトで記載されている値を使います
        const myAccountSid = context.TWILIO_ACCOUNT_SID;
        const client = twilio(apiKey, apiSecret, { accountSid: myAccountSid });
        // SMSを送信
        await client.messages.create({
          body: 'https://cloudapi.kddi-web.com/contact-sales/',
          from: context.SMS_SENDER_ID,
          to: event.From,
        })
          .then(() => {
            twiml.say({
              voice: 'Polly.Mizuki',
              language: 'ja-JP',
            }, 'おかけいただいている電話番号宛にショートメールにて、弊社お問い合わせフォームのアクセス情報をお送りしました。' +
            'お手数でございますがお問い合わせ内容詳細をフォームより入力いただけますでしょうか。確認後ご連絡いたします。');
          })
          .catch(err => {
            twiml.say({
              voice: 'Polly.Mizuki',
              language: 'ja-JP',
            }, 'SMS送信に失敗しました。');
          });
      }
    }  
  }
  callback(null, twiml);
};
