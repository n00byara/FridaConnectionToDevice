var frida = require('frida');

const current = {
  device: null,
  pid: null,
  script: null
}
  


async function main(){
    process.on('SIGTERM', stop)
    process.on('SIGINT', stop)

    const device = await frida.getUsbDevice()
    device.output.connect(onOutput)

    
    console.log('[*] spawn()')

    const pid = await device.spawn('com.sec.android.app.samsungapps')

}

function stop() {
    const { device, script } = current
  
    if (script !== null) {
      script.unload()
      current.script = null
    }
  
    if (device !== null) {
      device.output.disconnect(onOutput);
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
  

main()
    .catch(e =>{
        console.log(e)
    })