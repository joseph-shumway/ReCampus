// set the dummy classes
localStorage.setItem("classes",`
[
    {"name":"CHEM 107", "href": ""},
    {"name":"CHEM 107", "href": ""},
    {"name":"CHEM 107", "href": ""},
    {"name":"CHEM 107", "href": ""},
    {"name":"CHEM 107", "href": ""}
]`)

//
// 
// actual code
// 
//

let classes = JSON.parse(localStorage.getItem("classes"))


//
// create root container
//
let rootContainer = document.createElement("div")
rootContainer.id = "root"






//
// create classSidebar
//

let classSidebar = document.createElement("div")
classSidebar.id = "classSidebar"
classSidebar.innerHTML = `
    <div id=logoContainer>
        ReCampus
    </div>

    ${classes.map(each=>`<a class="courseTab waves-effect waves-teal btn-large btn-flat">${each.name}</a>`).join("\n")}
`
classSidebar.classList.add("grey")
classSidebar.classList.add("darken-3")
rootContainer.appendChild(classSidebar)


//
// create courseContainer
//

let courseContainer = document.createElement("div")
courseContainer.id = "courseContainer"
rootContainer.appendChild(courseContainer)



//
// create classMenu
//

let classMenu = document.createElement("div")
classMenu.id = "classMenu" 
courseContainer.appendChild(classMenu)




//
// Add content area
//

let contentArea = document.createElement("div")
contentArea.id = "contentArea"
courseContainer.appendChild(contentArea)

//
// 
//














window.onload = _=>{

    // Attach root container to body
    document.body.insertBefore(rootContainer, document.body.childNodes[0])
}