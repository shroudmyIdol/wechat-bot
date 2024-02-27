// import { getChatGPTReply as getReply } from '../chatgpt/index.js'
// import { getOpenAiReply as getReply } from '../openai/index.js'
import { getXunFeiReply } from '../xunfei/index.js'

// 测试 open ai api
async function testMessage() {
  const message = await getXunFeiReply("你好，今天的天气怎么样")
  console.log('🌸🌸🌸 / message: ', message)
}

testMessage()