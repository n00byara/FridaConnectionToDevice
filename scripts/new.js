Java.perform(() => {
    let activity,
        androidClasses = [],
        appClasses = [],
        counter = 0,
        counter2 = 0
    Java.enumerateLoadedClasses({
        onMatch(name, handle){
            counter++
            if(name == 'android.app.Activity'){
                activity = name
            }
        },
        onComplete(){
            console.log('классов до загрузки: ' + counter)
        }
    })
    if(!activity) return console.log('класс activity не найден')
    let Activity = Java.use(activity)
    console.log('Activity = ' + Activity)

    Activity.onCreate.overload('android.os.Bundle').implementation = function(bundle){
        this.onCreate(bundle)
        Java.enumerateLoadedClasses({
            onMatch(name, handle){
                counter2++
            },
            onComplete(){
                console.log('классов после загрузки: ' + counter2)
                counter = counter2 - counter
                console.log('разница в классах: ' + counter)
            }
        })
    }   
})



