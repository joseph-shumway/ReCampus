document.head.innerHTML = `<!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>`

window.onload = async () => {
  let contentLoaded = false

  let hasContentLoadedYet = async () => {
    return document.querySelectorAll("#content").length > 0
  }
  while (!contentLoaded) {
    contentLoaded = await hasContentLoadedYet()
  }

  //   setTimeout(() => {
  //     console.log(
  //       document.querySelectorAll(
  //         "#content div div div div div div div div div ul li a "
  //       )
  //     )
  //   }, 1000)
}

window.addEventListener("", _ => {
  console.log(
    document.querySelectorAll(
      "#content div div div div div div div div div ul li a "
    )
  )
})
