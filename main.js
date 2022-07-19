const frida = require('frida')
const fs = require('fs')
const { join } = require('path')

const current = {
  device: null,
  pid: true,
  script: null
}

async function main() {
  process.on('SIGTERM', stop)
  process.on('SIGINT', stop)

  const device = await frida.getUsbDevice()
  current.device = device
  device.output.connect(onOutput)

  console.log('[*] spawn()')
  const pid = await device.spawn('com.n00byara.whacamole') //com.sec.android.app.samsungapps
  current.pid = pid

 

  console.log(`[*] attach(${pid})`)
  const session = await device.attach(pid)
  session.detached.connect(onDetached)


  const textScript = fs.readFileSync('./scripts/new.js', {encoding: 'utf-8'})
  console.log(`[*] createScript()`)
  const script = await session.createScript(textScript)
  current.script = script
  script.message.connect(onMessage)
  await script.load()

  console.log(`[*] resume(${pid})`)
  await device.resume(pid)
}

async function stop() {
  const { device, script } = current

  if (script !== null) {
    script.unload()
    current.script = null
  }

  if (device !== null) {
    device.output.disconnect(onOutput)
    current.device = null
  }
}

function onOutput(pid, fd, data) {
  if (pid !== current.pid)
    return

  let description
  if (data.length > 0)
    description = '"' + data.toString().replace(/\n/g, '\\n') + '"'
  else
    description = '<EOF>'
  console.log(`[*] onOutput(pid=${pid}, fd=${fd}, data=${description})`)
}

function onDetached(reason) {
  console.log(`[*] onDetached(reason='${reason}')`)
  current.device.output.disconnect(onOutput)
}

function onMessage(message, data) {
  const fileContent = 'onMessage() message: ' + getStringsContent(message) +  '\n' + 'data: ' + JSON.stringify(data)
  fs.writeFileSync(`./logs/error.txt`, fileContent)
}

const getStringsContent = (message) => {
  let str
  for (const key in message) {
    str = str + key + ': ' + message[key] + '\n'
  }
  return str
}

main()
  .catch(e => {
    console.error(e)
  })


