const Color = {
    RESET: "\x1b[39;49;00m", Black: "0;01", Blue: "4;01", Cyan: "6;01", Gray: "7;11", Green: "2;01", Purple: "5;01", Red: "1;01", Yellow: "3;01",
    Light: {
        Black: "0;11", Blue: "4;11", Cyan: "6;11", Gray: "7;01", Green: "2;11", Purple: "5;11", Red: "1;11", Yellow: "3;11"
    }
}

Java.enumerateLoadedClasses({
    onMatch(name, handle){

        traceClass(name)

        Java.preform(function(){
            Java.use(name).isConnected.overload().implementation = function () {
                LOG('Socket.isConnected.overload', { c: Color.Light.Cyan })
                printBacktrace();
                return true;
            }
        })
    },
    onComplite(){

    }
})

function traceClass(targetClass){
    let hook
    try {
        hook = Java.use(targetClass)
    } catch (error) {
        console.error('ошибка трассировки класса', error)
    }

    let methods = hook.class.getDeclaredMethods()
    hook.$dispose()

    let parsedMethods = []
    methods.forEach(method => {
        let methodStr = method.toString()
        let methodReplace = methodStr.replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)\(/)[1]
        parsedMethods.push(methodReplace)
    })

    uniqBy(parsedMethods, JSON.stringify).forEach(function (targetMethod) {
        traceMethod(targetClass + '.' + targetMethod)
    })
}

function traceMetho(targetClassMethod){
    console.log(targetClassMethod + '99999999999999999999999999999999999999999999')
}

function uniqBy(array, key) {
    var seen = {}
    return array.filter(function (item) {
        let k = key(item)
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

var printBacktrace = function () {
    Java.perform(function() {
        var android_util_Log = Java.use('android.util.Log'), java_lang_Exception = Java.use('java.lang.Exception');
        // getting stacktrace by throwing an exception
        LOG(android_util_Log.getStackTraceString(java_lang_Exception.$new()), { c: Color.Gray });
    });
};