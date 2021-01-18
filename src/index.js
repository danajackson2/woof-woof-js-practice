getDogs()
let selectedDog = {}
//Definitions

//Fetches
function getDogs(){
    fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(data => renderDogs(data))
}

function getGoodDogs(){
    fetch('http://localhost:3000/pups', {
        headers: {
            'pragma' : 'no-cache',
            'cache-control' : 'no-cache'
        }
    })
    .then(resp => resp.json())
    .then(data => {renderDogs(data.filter(dog => dog.isGoodDog === true))})
}

function getSingleDog(e){
    fetch(`http://localhost:3000/pups/${e.target.id}`)
    .then(resp => resp.json())
    .then(data => renderSingleDog(data))
}

function editDog(selectedDog){
    fetch(`http://localhost:3000/pups/${selectedDog.id}`, {
        method : "PATCH",
        headers : {
            "content-type" : "application/json"
        },
        body : JSON.stringify({
            id : selectedDog.id,
            name : selectedDog.name,
            isGoodDog : selectedDog.isGoodDog,
            image : selectedDog.image
        }),
    })
}

//DOM Changes
function renderDogs(dogs){
    document.getElementById('dog-bar').innerHTML = ""
    dogs.forEach((dog) => {
        let span = document.createElement('span')
        span.textContent = dog.name
        span.id = dog.id
        span.addEventListener('click', getSingleDog)
        document.getElementById('dog-bar').appendChild(span)
    })
}

function renderSingleDog(dog){
    let dogInfoDiv = document.querySelector('div#dog-summary-container div#dog-info')
    dogInfoDiv.innerHTML = ""
    let h2 = document.createElement('h2')
    let img = document.createElement('img')
    let btn = document.createElement('button')
    h2.textContent = dog.name
    img.src = dog.image
    if (dog.isGoodDog === true){
        btn.textContent = "Good Dog!"
    } else {
        btn.textContent = "Bad Dog!"
    }
    btn.addEventListener('click', toggle)
    dogInfoDiv.appendChild(h2)
    dogInfoDiv.appendChild(img)
    dogInfoDiv.appendChild(btn)
    selectedDog = dog
}

//Event Handlers
function toggle(e){
    if (e.target.textContent === "Bad Dog!") {
        e.target.textContent = "Good Dog!"
        selectedDog.isGoodDog = true
        editDog(selectedDog)
        if (document.getElementById('good-dog-filter').textContent === "Filter good dogs: ON") {
            getGoodDogs()
        }
    } else {
        e.target.textContent = "Bad Dog!"
        selectedDog.isGoodDog = false
        editDog(selectedDog)
        if (document.getElementById('good-dog-filter').textContent === "Filter good dogs: ON") {
            getGoodDogs()
        }
    }

}

function filterToggle(){
    btn = document.getElementById('good-dog-filter')
    if (btn.textContent === "Filter good dogs: OFF"){
        btn.textContent = "Filter good dogs: ON"
        getGoodDogs()
    } else {
        btn.textContent = "Filter good dogs: OFF"
        getDogs()
    }
}

//Event Listeners
document.getElementById('good-dog-filter').addEventListener('click', filterToggle)