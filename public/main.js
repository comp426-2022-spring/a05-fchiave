// Add cors dependency
//const cors = require('cors')
// Set up cors middleware on all endpoints
//app.use(cors())

// Focus div based on nav button click


// Flip one coin and show coin image to match result when button clicked
// Button coin flip element
const flipOne = document.getElementById("flipOne")
flipOne.addEventListener("click", flipCoin)
function flipCoin() {
    const response = fetch('http://localhost:5000/app/flip/')
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            console.log(result);
            document.getElementById("result").innerHTML = result.flip;
            document.getElementById("quarter").setAttribute("src", "./assets/img/"+result.flip+".png");
            
        })
}

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button

