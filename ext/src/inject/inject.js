// 
// 
// 
// good-dom
// 
// 
// 

    // expand the HTML element ability
    let classSetter
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
                return [...this.childNodes]
            }
        },
        class: classSetter = {
            set: function(newClass) {
                if (newClass instanceof Array) {
                    newClass = newClass.join(" ")
                }
                this.className = newClass
            },
            get: function() {
                let list = [...this.classList]
                // create a remover
                list.remove = (element)=>{
                    this.classList.remove(element)
                }
                // create an adder
                list.add = (element)=>{
                    this.classList.add(element)
                }
                return list
            }
        },
        classes: classSetter, // alternative name
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
            } else if (each instanceof Node){
                this.appendChild(each)
            } else {
                console.error(" Trying to add (appendChild) this:", each, "\n\nto this element:", this, "\n\nhowever the element being added is not a node or object that I know how to convert to a node")
                throw new TypeError()
            }
        }
        return this
    }
    // the special "add" case of the select method
    window.HTMLSelectElement.prototype.add = window.HTMLElement.prototype.add
    // find()
    window.HTMLElement.prototype.find = function (...inputs) {
        return ([...this.childNodes]).find(...inputs)
    }
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
let hardcodedValues  = {
    logout: "/webapps/login/?action=logout"
}

function handleTheIfThisItemDoesNotOpenAutomaticallyCase(mainContentArea) {
    let hasASingleRedirect = null
    let newHref = null
    try {
        let contentArea = mainContentArea.querySelector("#content_listContainer")
        hasASingleRedirect = contentArea.innerText.match(/^\s*If this item does not open automatically you can open .+ here\s*$/g)
        let linkElement = [...contentArea.querySelectorAll("a")].filter(each=>each.innerText.match(/open .+ here/))[0]
        newHref = linkElement.href
    } catch (errors) {

    }
    if (hasASingleRedirect) {
        // get the real redirect page because eCampus is dumb and redirects 2 times and hides the first one in javascript
        let aRequest = new XMLHttpRequest() // this is deprecated because sync but it's fastest because its sync.
        aRequest.open('GET', newHref, false)
        aRequest.send(null)
        let redirectionContent = aRequest.responseText
        // remove everything other than the script element
        let scriptContent = redirectionContent.replace(/^[^]*?<script.+>/, "").replace(/<\/script>[^]*?$/,"")
        // get the string that is going to do the redirect
        let newAddressContent = scriptContent.replace(/^[^]*?'/, "").replace(/'[^\']*$/,"")
        // evaluate any escapes
        let newAddress = eval(`'${newAddressContent}'`)
        // 
        // open redirect in new tab behavior
        // 

        // if no history
        if (document.referrer == "" || history.length < 2) {
            // open in hidden new tab
            let a = document.createElement("a")
            a.href = newAddress
            let event = document.createEvent("MouseEvents");
            //the tenth parameter of initMouseEvent sets ctrl key
            event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null)
            a.dispatchEvent(event)
        } else {
            // open in active new tab
            window.open(newAddress, '_blank')
            // have this page go back if possible
            history.go(-1)
        }
        return true
    }
    return false
}


function contextMenuHelper(eventObject, where, optionsAndCallbacks) {
    let contextMenu = new UL({id: 'contextMenu', class: "collection"})
    
    for (let each of optionsAndCallbacks) {
        // spacers
        if (each == null) {
            contextMenu.add(new LI({ class:"divider", tabindex:"-1"}))
        }
        // actual options
        contextMenu.add(new A({ class: "btn-flat white", onclick: each[1]}, each[0]))
    }
    
    contextMenu.style = {
        position: 'fixed',
        left: `${eventObject.clientX}px`,
        top: `${eventObject.clientY}px`,
    }
    
    // take up the entire screen so that clicking anywhere will close the menu
    let clickAwayElement = new DIV(
        {
            css: `
                display:flex;
                position: fixed;
                width: 200vw;
                height: 200vh;
                left: -50vw;
                top: -50vh;
                opacity: 1;
                z-index: 999998;
            `,
            onclick: ()=>clickAwayElement.remove()
        },
        contextMenu
    )
    where.add(clickAwayElement)
}

let crudeHash = (string) => {
    return ([...string]).map(each=>each.charCodeAt(0)).reduce((a,b)=>a+b,0)
}

// let colors = [ "blue lighten-2", "red lighten-2", "purple lighten-2", "light-green lighten-2", "deep-purple lighten-2", "deep-orange lighten-2", "brown lighten-2" ]
let colors = [ "#4fc3f7", "#e57373", "#ba68c8", "#9ccc65", "#9575cd", "#ff8a65", "#a1887f" ]
let render =()=>0
function renderMain(menuItems, mainContentArea) {
        // delete all the style tags
        ;([...mainContentArea.querySelectorAll("style")]).map(n => n && n.remove())
        // 
        // load the saved classes, and calculate the current page
        // 
        let classes = JSON.parse(localStorage.getItem("classes"))
        for (let each of classes) {
            let colorIndex = (crudeHash(each.subtitle) + 1) % colors.length
            each.color = colors[colorIndex]
            colors.splice(colorIndex, 1)
        }
        console.log(`classes is:`,classes)
        let currentClass = {}
        try {
            currentClass = classes.filter(each=>window.location.href.match(RegExp("course_id=_"+each.courseId,"g")))[0]
        } catch (error) {
            console.error("Couldn't find current class based on url")
        }
        let currentClassTitle = currentClass.title
        let nameOfPage = ""
        try {
            // nameOfPage = document.getElementById("pageTitleHeader").innerText <<- cant use because mainContentArea hasn't been added to the document yet
            nameOfPage = mainContentArea.children[1].children[1].children[2].children[0].innerText.trim()
        } catch (error) {
            
        }
        console.log(`nameOfPage is:`,nameOfPage)
        
        
        // 
        // check for redirection, then auto redirect
        //
        if (handleTheIfThisItemDoesNotOpenAutomaticallyCase(mainContentArea)) {
            return // return early (render nothing) if being redirected
        }

        //
        // create root container
        //
        let rootContainer, classSidebar, courseContainer, titleBar, classMenu, contentArea
        render = () => {
            rootContainer = new DIV(
                {id:"root"},
                // sidebar
                classSidebar = new DIV(
                    {
                        id: "classSidebar",
                        innerHTML: `
                            <div id=sideBarMovingArea>
                                <div id=logoContainer>
                                    ReCampus
                                </div>

                                ${classes.filter(each=>!each.isArchived).map(each=>`<a class="courseTab ${each.title==currentClassTitle&&"current"} waves-effect waves-teal btn-large btn-flat" style="--background-color: ${each.color};" href="${each.href}">${each.title}</a>`).join("\n")}
                                
                                <div style='height: 2rem'></div>
                                <div id=archivedCoursesTitle style='color: gray; border-bottom: 2px solid gray; margin: 0 15%; display: flex; align-content: center; justify-content: center'>Archived Courses</div>
                                ${classes.filter(each=>each.isArchived).map(each=>`<a class="courseTab archived ${each.title==currentClassTitle&&"current"} waves-effect waves-teal btn-large btn-flat" href="${each.href}">${each.title}</a>`).join("\n")}
                            </div>
                        `,
                        classes: [ "grey", "darken-3" ]
                    },
                ),
                courseContainer = new DIV (
                    {id: "courseContainer"}, 

                    titleContainer = new DIV(
                        {id: "titleContainer"},
                        
                        titleBar = new H1 (
                            {
                                id: "titleBar",
                                style: {
                                    backgroundColor: currentClass.color
                                }
                            }, 
                            `${currentClassTitle}`,
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
            document.body.insertBefore(rootContainer, document.body.childNodes[0])
        }
        
        // 
        // add context menu to course list
        // 
        document.addEventListener('contextmenu', (eventObject) => {
            console.log(`eventObject is:`,eventObject)
            if (eventObject.target.classes.includes("courseTab")) {
                // don't show the default context menu
                eventObject.preventDefault()
                // figure out which course got right-clicked
                let targetClass = classes.find(each=>each.href == eventObject.target.href)
                
                let contextOptions = []
                // show dropdown menu
                if (targetClass.isArchived == true) {
                    contextOptions.push([
                        "Unarchive this course",
                        ()=>{
                            targetClass.isArchived = false
                            // save the changes
                            localStorage.setItem("classes", JSON.stringify(classes))
                            // re-render the side bar
                            render()
                        },
                    ])
                } else {
                    contextOptions.push([
                        "Archive this course",
                        ()=>{
                            targetClass.isArchived = true
                            // save the changes
                            localStorage.setItem("classes", JSON.stringify(classes))
                            // re-render the side bar
                            render()
                        }
                    ])
                }
                
                
                contextMenuHelper(eventObject, classSidebar, contextOptions)
            }

        }, false)
        
        render()
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
    `
}



// 
// what page are we on
// 
try {
    
    let eCampusLocation = null
    let url = window.location.href.replace(/https?:\/\//, "")
    
    // login page
    if (url=="ecampus.tamu.edu/") {
        // immediatly redirect to login page 
        window.location.href = "https://tamu.blackboard.com/webapps/bb-auth-provider-shibboleth-BBLEARN/execute/shibbolethLogin?returnUrl=https%3A%2F%2Ftamu.blackboard.com%2Fwebapps%2Fportal%2Fexecute%2FdefaultTab&authProviderId=_102_1"
    
    // eCampus home page (never show, just scrape data then redirect)
    } else if (url=="tamu.blackboard.com/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_25_1") {
        removeJunkCss()
        eCampusLocation = "home"
        console.log("on homepage")
    
    // embedded page (don't touch in order to preserve backwards compatibility)
    } else if (url.match(/tamu.blackboard.com\/webapps\/blackboard\/content\/contentWrapper\.jsp/))  {
        eCampusLocation = "embeddedPage"
        console.log("Probably on an embedded page")
    
    // probably a class page 
    } else if (url.match(/tamu.blackboard.com\/webapps\/.*course_id.*/))  {
        removeJunkCss()
        eCampusLocation = "probablyAClass"
        console.log("Probably on a course page")
    
    // something else (don't touch in order to preserve backwards compatibility)
    } else {
        console.log("Unknown page")
        // show everything
        document.body.style.display = "unset"
    }
    
    // set the favicon for all pages
    document.head.add(
        new LINK({
            rel: "shortcut icon",
            // this was taken from: https://favicon.io/emoji-favicons/
            href: `https://twemoji.maxcdn.com/2/svg/1f516.svg` }
        )
    )

    // submission page url (nothing submitted yet)
    // https://tamu.blackboard.com/webapps/assignment/uploadAssignment?content_id=_6621584_1&course_id=_162589_1&group_id=&mode=view
    // submission page url (after submission)
    // https://tamu.blackboard.com/webapps/assignment/uploadAssignment?course_id=_162589_1&content_id=_6621584_1&mode=view
    // quiz url
    // https://tamu.blackboard.com/webapps/assessment/take/launchAssessment.jsp?course_id=_162589_1&content_id=_6645512_1&mode=view


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
                courseId: `${each.href.replace(/^.+id=_(\d+?)_.+/,"$1")}`
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
            document.body.classList.add("enabled")
            document.body.style.display = "unset"
        } else {
            // show everything
            document.body.style.display = "unset"
        }
        
    }
    // when the window loads, start main
    window.addEventListener("load", ()=>loader())
} catch (error) {
    console.error(error)
}