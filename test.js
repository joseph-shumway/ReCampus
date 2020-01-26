let div = document.createElement("div")
let classes = JSON.parse(localStorage.getItem("classes"))

// create all the buttons
div.innerHTML = classes.map(each=>`<a class="course-tab waves-effect waves-teal btn-large btn-flat">${each.name}</a>`).join("\n")

div.style = `
    display: flex;
    min-height: 100vh;
    width: 20rem;
    background-color: gray;
    align-items: flex-start;
    justify-content: center;
    font-size: 14pt;
`
div.classList.add("courseList")
div.classList.add("grey")
div.classList.add("darken-3")

window.onload = _=>{
    document.body.insertBefore(div, document.body.childNodes[0])
}