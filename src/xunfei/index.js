import WebSocket from 'ws'
import CryptoJs from 'crypto-js'

let webSocketClient

function getWebSocketUrl() {
  const apiKey = API_KEY
  const apiSecret = API_SECRET
  let url = 'ws://spark-api.xf-yun.com/v3.5/chat'
  const host = 'localhost:3001'
  const date = new Date().toGMTString()
  const algorithm = 'hmac-sha256'
  const headers = 'host date request-line'
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v3.5/chat HTTP/1.1`
  const signatureSha = CryptoJs.HmacSHA256(signatureOrigin, apiSecret)
  const signature = CryptoJs.enc.Base64.stringify(signatureSha)
  const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
  const authorization = btoa(authorizationOrigin)
  url = `${url}?authorization=${authorization}&date=${date}&host=${host}`

  return url
}

export async function getXunFeiReply(message) {
  if (!webSocketClient) {
    // 创建 WebSocket 客户端
    webSocketClient = new WebSocket(getWebSocketUrl())
  } else {
    webSocketSendMessage(message)
  }
  return new Promise((resolve, reject) => {
    let replyMessage = ''

    // 监听客户端获知 WebSocket 连接成功后的事件
    webSocketClient.on('open', () => {
      console.log('web socket opened')

      webSocketSendMessage(message)
    })

    // 监听客户端收到来自服务端的消息
    webSocketClient.on('message', (data) => {
      console.log(data.toString('utf8'))
      replyMessage += JSON.parse(data.toString('utf8')).payload.choices.text[0].content
      console.log(replyMessage)
    })

    // 监听通信过程中出错的事件
    webSocketClient.on('error', (error) => {
      console.log(error.toString('utf8'))
      reject(error)
    })

    // 监听WebSocket连接被关闭的事件
    webSocketClient.on('close', (e, reason) => {
      resolve(replyMessage)
      console.log(e, reason.toString('utf8'))
      console.log('关闭了')
      webSocketClient = null
    })
  })
}

function webSocketSendMessage(message) {
  var params = {
    header: {
      app_id: APPID,
      uid: 'fd3f47e4-d',
    },
    parameter: {
      chat: {
        domain: 'generalv3.5',
        temperature: 0.5,
        max_tokens: 1024,
      },
    },
    payload: {
      message: {
        text: [{ role: 'user', content: message }],
      },
    },
  }
  webSocketClient.send(JSON.stringify(params))
}
