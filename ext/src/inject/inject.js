// 
// 
// 
// good-dom
// 
// 
// 


// expand the HTML element ability
Object.defineProperties(window.HTMLElement.prototype, {
    // setting styles through a string
    css : { set: Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'style').set },
    // allow setting of styles through string or object
    style: {
        set: function (styles) {
            if (typeof styles == "string") {
                this.css = styles
            } else {
                Object.assign(this.style, styles)
            }
        }
    },
    // allow setting of children directly
    children: {
        set: function(newChilden) {
            // remove all children
            while (this.firstChild) {
                this.removeChild(this.firstChild)
            }
            // add new child nodes
            for (let each of newChilden) {
                this.add(each)
            }
        },
        get: function() {
            return this.childNodes
        }
    },
    class: {
        set : function(newClass) {
            this.className = newClass
        },
        get : function() {
            return this.className
        }
    }
})
// add()
window.HTMLElement.prototype.add = function (...inputs) {
    for (let each of inputs) {
        if (typeof each == 'string') {
            this.appendChild(new window.Text(each))
        } else if (each instanceof Function) {
            this.add(each())
        } else if (each instanceof Array) {
            this.add(...each)
        } else {
            this.appendChild(each)
        }
    }
    return this
}
// the special "add" case of the select method
window.HTMLSelectElement.prototype.add = window.HTMLElement.prototype.add
// addClass()
window.HTMLElement.prototype.addClass = function (...inputs) {
    return this.classList.add(...inputs)
}
// for (let eachChild of elemCollection)
window.HTMLCollection.prototype[Symbol.iterator] = function* () {
    let index = 0
    let len = this.length
    while (index < len) {
        yield this[index++]
    }
}
// for (let eachChild of elem)
window.HTMLElement.prototype[Symbol.iterator] = function* () {
    let index = 0
    let len = this.childNodes.length
    while (index < len) {
        yield this.childNodes[index++]
    }
}
// create a setter/getter for <head>
let originalHead = document.head
// add a setter to document.head
Object.defineProperty(document,"head", { 
    set: (element) => {
        document.head.add(...element.childNodes)
    },
    get: ()=>originalHead
})

// add all the dom elements
let domElements = {}
tagNames = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]
for (let each of tagNames) {
    eval(`domElements.${each.toUpperCase()} = function(properties,...children) { 
        if (properties instanceof window.Node || typeof properties == 'string') 
            return document.createElement("${each}").add(properties, ...children)
        return Object.assign(document.createElement("${each}"), properties).add(...children)}
        `)
}

// make it global
Object.assign(window, domElements)


// 
// 
// 
// main renderer
// 
// 
// 
function renderMain(menuItems, mainContentArea) {
        let classes = JSON.parse(localStorage.getItem("classes"))
        console.log(`menuItems is:`,menuItems)
        console.log(`classes is:`,classes)
        let currentClass = classes[0].title
        let hardcodedValues  = {logout: "/webapps/login/?action=logout"}
        //
        // create root container
        //
        let classSidebar, courseContainer, titleBar, classMenu, contentArea
        let rootContainer = new DIV(
            {id:"root"},
            // sidebar
            classSidebar = new DIV(
                {
                    id: "classSidebar",
                    innerHTML: `
                        <div id=logoContainer>
                            ReCampus
                        </div>

                        ${classes.map(each=>`<a class="courseTab waves-effect waves-teal btn-large btn-flat" href="${each.href}">${each.title}</a>`).join("\n")}
                    `
                },
            ),
            courseContainer = new DIV (
                {id: "courseContainer"}, 

                titleContainer = new DIV(
                    {id: "titleContainer"},
                    
                    titleBar = new H1 (
                        {id: "titleBar"}, 
                        `${currentClass}`,
                    ),

                    logoutButton = new A (
                        {id: "logoutButton", href: hardcodedValues.logout},
                        "Logout"
                    )

                ),
                mainArea = new DIV (
                    {id: "mainArea"},

                    classMenu = new DIV (
                        {
                            id: "classMenu",
                        },
                        ...menuItems.map(each=> new A({ innerText: each.text, href: each.href }))
                    ),

                    contentArea = new DIV (
                        {id: "contentArea"},
                        mainContentArea
                    )

                )
            )
        )
        classSidebar.classList.add("grey")
        classSidebar.classList.add("darken-3")
        
        document.body.insertBefore(rootContainer, document.body.childNodes[0])
}


// 
// 
//  inject.js
// 
// 

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
    removeJunkCss()
    eCampusLocation = "home"
    console.log("on homepage")
} else if (url.match(/tamu.blackboard.com\/webapps\/blackboard\/.*course_id.*/))  {
    removeJunkCss()
    eCampusLocation = "probablyAClass"
    console.log("Probably on a course page")
}


// 
// when on the homepage
// 
let classes
let loadedHome = ()=> {
    // 
    // homepage
    // 
    // remove semester tag
    classes = classes.map(each=>{
        each.title = each.title.replace(/\d\d (SPRING|FALL|SUMMER)/,"")
        return each
    })
    // extract the subtitle
    classes = classes.map(each=>{
        return ({
            ...each,
            title: `${each.title}`.trim().replace(/:.*/g,""),
            subtitle: `${each.title}`.trim().replace(/^.+?:/g,""),
        })
    })
    
    // save the classes to localStorage
    localStorage.setItem("classes", JSON.stringify(classes))

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
        let classes = [...document.querySelectorAll("#myCourses li a")].map(each => ({ href: each.href, title: each.text }))
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
        let menuItems = [...document.querySelectorAll("#courseMenuPalette_contents li a")].map(each=>({href: each.href, text: each.innerText}))
        let content = document.getElementById("content")
        document.body = document.createElement("body")
        renderMain(menuItems, content)
        // display everything now that its loaded
        document.body.style.display = "unset"
    } else {
        // show everything
        document.body.style.display = "unset"
    }
    
}
// when the window loads, start main
window.addEventListener("load", ()=>loader())