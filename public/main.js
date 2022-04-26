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
// Our flip many coins form
const coins = document.getElementById("coins")
// Add event listener for coins form
coins.addEventListener("submit", flipCoins)
// Create the submit handler
async function flipCoins(event) {
    event.preventDefault();
    
    const url = "http://localhost:5000/app/flip/coins/"

    const formEvent = event.currentTarget

    try {
        const formData = new FormData(formEvent);
        const flips = await sendFlips({ url, formData });

        console.log(flips);
        document.getElementById("heads").innerHTML = "Heads: "+flips.summary.heads;
        document.getElementById("tails").innerHTML = "Tails: "+flips.summary.tails;
    } catch (error) {
        console.log(error);
    }
}
// Create a data sender
async function sendFlips({ url, formData }) {
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJson = JSON.stringify(plainFormData);
    console.log(formDataJson);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: formDataJson
    };

    const response = await fetch(url, options);
    return response.json()
}




// Guess a flip by clicking either heads or tails button

