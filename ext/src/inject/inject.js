

document.head.innerHTML =  `<!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>`

document.body.innerHTML = `
	<script>	
		let a = $("#content div div div div div div div div div ul li a ").innerHTML
		console.log(\`a is:\`,a)
	</script>
	`