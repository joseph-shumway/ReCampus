document.head.innerHTML = `<!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>`


let getMyCoursesElement = ()=>{
    let sorted = [...document.querySelectorAll("div")].filter(each=>each.innerHTML.match(/<h2[\s\S]*<span[\s\S]*My Courses/g)).sort((a,b)=>a.innerHTML.length - b.innerHTML.length)
    sorted[0].id = "myCourses"
    return sorted[0]
}

setTimeout(()=>{
    // sets the #myCourses id
    getMyCoursesElement()

    let classes = [...document.querySelectorAll("#myCourses li a")].map(each=>({href:each.href, name:each.text}))

    localStorage.setItem("classes", JSON.stringify(classes))
    
    console.log(`JSON.parse(localStorage.getItem("classes")) is:`,JSON.parse(localStorage.getItem("classes")))
},1000)
