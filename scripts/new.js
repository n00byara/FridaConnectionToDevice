Java.perform(function () {

    let Activity = Java.use('android.app.Activity')

    let counter = 0
    Activity.onStart.implementation = function(){
        
        //let methods = Java.enumerateMethods('*!*/u')
        console.log('on start')
        this.onStart()          
    }   
    // let Button = Java.use(['android.widget.Button'])
    // Button.setOnClickListener.overload('android.view.View').implementation = function(View) {
    //     let result = this.setOnClickListener(this, View)
    //     return result
    // }
    Activity.getComponentName.implementation = function(){

        let result = this.getComponentName()
        console.log(result)
        return result
    } 
    
})


