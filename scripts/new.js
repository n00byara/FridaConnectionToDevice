Java.perform(function () {
    let activity,
        androidClasses = []
    Java.enumerateLoadedClasses({
        onMatch(name, handle){
            androidClasses.push(name)
            if(name == 'android.app.Activity'){
                activity = name
            }
        },
        onComplete(){
            return
        }
    })

    if(!activity) return console.log('класс activity не найден')
    let Activity = Java.use(activity)
    
    Activity.onCreate.overload('android.os.Bundle').implementation = async function(bundle){
        this.onCreate(bundle)

        let allClasses = [],
            appClasses = []

        Java.perform(function () {
            let Activity = Java.use('android.app.Activity')
            Activity.onStart.implementation = function () {
                Java.enumerateLoadedClasses({
                    onMatch(name, handle){
                           allClasses.push(name) 
                    },
                    onComplete(){
                        appClasses = getAppClasses(androidClasses, allClasses)
                        console.log('app classes = ' + appClasses.length)
                    }
                })
                this.onStart()
            }
        })
    }   
})


const getAppClasses = (androidClasses, allClasses) => {
    const regXp = /android/
    let difference = androidClasses.filter(x => !allClasses.includes(x)).concat(allClasses.filter(x => !androidClasses.includes(x)))

    let classes = []
    
    difference.forEach(className => {
      if(!regXp.test(className)){
        classes.push(className)
      }  
    })

    return classes 
}

