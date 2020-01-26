// set the dummy classes
localStorage.setItem("classes",`
[
    {"name":"CHEM 107", "href": ""},
    {"name":"CHEM 107", "href": ""},
    {"name":"CHEM 107", "href": ""},
    {"name":"CHEM 107", "href": ""},
    {"name":"CHEM 107", "href": ""}
]`)


let div = document.createElement("div")
let classes = JSON.parse(localStorage.getItem("classes"))

// create all the buttons
div.id = "courseList"
div.innerHTML = `
    <div id=logoContainer>
        ReCampus
    </div>

    ${classes.map(each=>`<a class="courseTab waves-effect waves-teal btn-large btn-flat">${each.name}</a>`).join("\n")}
`
div.classList.add("grey")
div.classList.add("darken-3")

window.onload = _=>{
    document.body.insertBefore(div, document.body.childNodes[0])
}