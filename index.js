document.addEventListener('DOMContentLoaded', () => {

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Add City
    function addCity() {

        //remove error window if exists
        if (alert.classList.contains('on')) {
            alert.classList.remove('on');
        }

        //show input
        newCityContainer.classList.add('on');
        newCityInput.focus();
        newCityInput.value = '';
    }

    //Request City
    function requestCity(city) {

        //request wether from website
        fetch(`https://goweather.herokuapp.com/weather/${city}`)

            //check if fetching was successfull
            .then(response => {

                //throw an error if data is not found or smth
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json(); //convert data to JSON type
            })

            //way of showing data
            .then(data => {

                //show data in log
                console.log(data);

                //make an array of cities' ids
                let ids = []
                const cityBoxesIds = document.querySelectorAll('.city-box');
                cityBoxesIds.forEach(cityBox => {
                    ids.push(cityBox.id.toLowerCase())
                })

                //throw an error if city is already added
                if (ids.includes(city.toLowerCase())) {
                    throw new Error('You can already watch weather in this city');
                }

                //throw an error if object keys are empty
                if (data.temperature === '') {
                    throw new Error('City has no wether data collected')
                }

                //create a new city box
                createBox(data, city);
            })

            //in case error occured display it in special window
            .catch(error => {
                alert.textContent = error;
                alert.classList.add('on'); //animation in
                setTimeout(function () { //animation out and hide after 5s
                    if (alert.classList.contains('on')) {
                        alert.classList.remove('on');
                        alert.classList.add('off');
                        setTimeout(function () { alert.classList.remove('off') }, 300);
                    }
                }, 5000);
            });

        //hide input if it's on
        if (newCityContainer.classList.contains('on')) {
            newCityContainer.classList.remove('on');
            newCityContainer.classList.add('off');
            setTimeout(function () { newCityContainer.classList.remove('off') }, 300);
        }

    }

    //Create City Box
    function createBox(data, city) {

        //create new city box
        const cityBoxes = document.querySelectorAll('.city-box');
        const newCityBox = cityBoxes[cityBoxes.length - 1].cloneNode(true);
        newCityBox.id = city

        //declare current weather and assign values
        const cityTitle = newCityBox.querySelector('.city-title');
        const currentTemp = newCityBox.querySelector('.current-temp');
        const wish = newCityBox.querySelector('.wish');

        cityTitle.textContent = city;
        currentTemp.textContent = data.temperature;
        wish.textContent = `I wish you a greate day and hope you are enjoying ${data.description.toUpperCase()} weather!`

        //declare dates and temps
        const datesForecast = newCityBox.querySelectorAll('.date');
        const tempTodayForecast = newCityBox.querySelector('.temp-today')
        const tempsForecast = newCityBox.querySelectorAll('.temp');

        //assign each date
        let todayIs = new Date();
        datesForecast.forEach(dateForecast => {
            if (dateForecast.textContent !== 'Today' && dateForecast.textContent !== 'Tmr') {
                dateForecast.textContent = todayIs.toLocaleDateString('en-US', { weekday: 'short' });
            }
            todayIs.setDate(todayIs.getDate() + 1);
        });

        //assign first day temp and wind
        tempTodayForecast.textContent = `${data.temperature}/${data.wind}`;

        //assign the rest of days temp and wind
        let arrayNum = 0;
        tempsForecast.forEach(tempForecast => {
            tempForecast.textContent = `${data.forecast[arrayNum].temperature}/${data.forecast[arrayNum].wind}`;
            arrayNum += 1;
        })

        //add event listener to delete city
        const cross = newCityBox.querySelector('.cross');
        cross.addEventListener('click', () => delBox(newCityBox))

        //add child
        cityBoxes[cityBoxes.length - 1].insertAdjacentElement('afterend', newCityBox);

        //remove sample box if exists
        const sampleBox = document.getElementById('sample');
        if (sampleBox) {
            sampleBox.remove()
        }

        //animation
        newCityBox.classList.add('on');
    }

    //Delete City Box
    function delBox(newCityBox) {

        //make a variable equale quantity of cities
        const citiesLength = document.querySelectorAll('.city-box').length;

        //check if it is not only one city
        try {
            if (citiesLength === 1) {

                //throw an error if only ine city
                throw new Error("The only city can't be deleted")
            }

            //remove city with animation
            newCityBox.classList.remove('on');
            newCityBox.classList.add('off');
            setTimeout(function () { newCityBox.remove() }, 300);

        //in case error occured display it in special window
        } catch (error) {

            //set and display
            alert.textContent = error;
            alert.classList.add('on');

            //check if it is not already hidden by addCity()
            if (alert.classList.contains('on')) {

                //animation out and hide after 5s
                setTimeout(function () { 
                    alert.classList.remove('on')
                    alert.classList.remove('on');
                    alert.classList.add('off');
                    setTimeout(function () { alert.classList.remove('off') }, 300);
                }, 5000);

            }
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Declaring Blocks //////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const addCityBtn = document.getElementById('add-city');
    const newCityContainer = document.getElementById('new-city-container');
    const newCityInput = document.getElementById('new-city-input');
    const addBtn = document.getElementById('add');
    const alert = document.getElementById('alert');

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // AddEventListeners /////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Add City
    addCityBtn.addEventListener('click', addCity); // if add player button
    addEventListener('keyup', (event) => { // if plus not in the area
        if (event.key === '=' && document.activeElement.tagName !== 'INPUT') {
            addCity();
        }
    });

    // Request City
    addBtn.addEventListener('click', () => {
        requestCity(newCityInput.value.trim());
    });
    newCityInput.addEventListener('keyup', (event) => { // if enter in area
        if (event.key === 'Enter') {
            requestCity(newCityInput.value.trim());
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Main Program ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    requestCity('Toronto'); //show Toronto wether as default

});
