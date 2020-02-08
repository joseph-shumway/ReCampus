document.head.innerHTML = `<!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>`

let classes
let main = ()=> {
    console.log("Main just got called")
    
    // 
    // figure out which page we are on
    // 
    
    // remove the http part
    let url = window.location.href.replace(/https?:\/\//, "")
    if (url=="tamu.blackboard.com/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_25_1") {
        // 
        // homepage
        // 
        // save the classes to localStorage
        localStorage.setItem("classes", JSON.stringify(classes))
        
        // FIXME: redirect to the first class's page
        console.log(`classes is:`,classes)

        window.location.href = classes[0].href
    } else if (url == "class page") {
        // 
    }


}

let loader = async function() {

    let getMyCoursesElement = () => {
        let sorted = [...document.querySelectorAll("div")].filter(each => each.innerHTML.match(/<h2[\s\S]*<span[\s\S]*My Courses/g)).sort((a, b) => a.innerHTML.length - b.innerHTML.length)
        sorted[0].id = "myCourses"
        return sorted[0]
    }

    let getClassList = ()=> {
        // sets the #myCourses id
        getMyCoursesElement()
        let classes = [...document.querySelectorAll("#myCourses li a")].map(each => ({ href: each.href, name: each.text }))
        return classes
    }
    
    // try to see if the page loaded
    let intervalWatcher
    intervalWatcher = setInterval(()=>{
        classes = []
        try {
            classes = getClassList()
        } catch (error) {
            
        }
        // if the classes were found
        if (classes instanceof Array && classes.length > 0) {
            // then stop looping and call the main function
            clearInterval(intervalWatcher)
            main()
        }
    }, 100)
}
// when the window loads, start main
window.addEventListener("load", ()=>loader())