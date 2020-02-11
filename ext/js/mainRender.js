require("good-dom").global() // use a mini framework

//
// 
// actual code
// 
//
module.exports = function(menuItems, mainContentArea) {
        let classes = JSON.parse(localStorage.getItem("classes"))
        let currentClass = classes[0].name
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

                        ${classes.map(each=>`<a class="courseTab waves-effect waves-teal btn-large btn-flat">${each.name}</a>`).join("\n")}
                    `
                },
            ),
            courseContainer = new DIV (
                {id: "courseContainer"}, 

                titleContainer = new DIV(
                    {id: "titleContainer"},
                    
                    titleBar = new H1 (
                    {id: "titleBar"}, 
                    currentClass,
                    ),

                    logoutButton = new A (
                        {id: "logoutButton", href: hardcodedValues.logout},
                        "Logout"

                    )

                ),
                mainArea = new DIV (
                    {id: "mainArea"},

                    classMenu = new DIV (
                        {id: "classMenu"},
                        "classMenu"
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