// 
// delete ecampus garbage
// 
function removeJunkCss() {
    document.head.innerHTML = `<!-- Compiled and minified CSS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

        <!-- Compiled and minified JavaScript -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>`
}



// 
// what page are we on
// 
let eCampusLocation = null
let url = window.location.href.replace(/https?:\/\//, "")
if (url=="tamu.blackboard.com/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_25_1") {
    eCampusLocation = "home"
    console.log("on homepage")
} else if (url.match(/tamu.blackboard.com\/webapps\/blackboard\/.*course_id.*/))  {
    eCampusLocation = "probablyAClass"
    console.log("Probably on a course page")
}


// 
// when on the homepage
// 
let classes
let loadedHome = ()=> {
    removeJunkCss()
    // 
    // homepage
    // 
    // save the classes to localStorage
    localStorage.setItem("classes", JSON.stringify(classes))

    console.log(`classes is:`,classes)
    // redirect to the first class's page
    window.location.href = classes[0].href
}


// 
// wait for page to load everything
// 
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

    if (eCampusLocation == "home") {
        // setup the interaval watcher

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
                loadedHome()
            }
        }, 100)
    } else if (eCampusLocation == "probablyAClass") {
        removeJunkCss()
        let renderMain = require("../../js/mainRender")
        let menuItems = [...document.querySelectorAll("#courseMenuPalette_contents li a")].map(each=>({href: each.href, text: each.innerText}))
        let content = document.getElementById("content")
        document.body = document.createElement("body")
        renderMain(menuItems, content)
    }
    
}
// when the window loads, start main
window.addEventListener("load", ()=>loader())