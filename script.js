const searchTab=document.querySelector('.data-search');
const weatherTab=document.querySelector('.data-weather');

const grantAccessContainer= document.querySelector('.grant-cont')
const weatherContainer= document.querySelector('.weather-info');
const searchBar= document.querySelector('.search');
const loading= document.querySelector('.loading-section');

const API_KEY='bc544129f139706dcd9d1e4215d1fb5d';
getFromSessionStorage();


let currentTab=weatherTab;
currentTab.classList.add('tabChange');

searchTab.addEventListener('click',()=>{
    changeTab(searchTab)
});

weatherTab.addEventListener('click',()=>{
    changeTab(weatherTab)
});

function changeTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove('tabChange');
        clickedTab.classList.add('tabChange');

        currentTab=clickedTab;
        // Search Form
        if(currentTab==searchTab){
            grantAccessContainer.classList.remove('active');
            weatherContainer.classList.remove('active');
            searchBar.classList.add('active');
        }else{
            searchBar.classList.remove('active');
            weatherContainer.classList.remove('active');

            getFromSessionStorage();

        }

    }
}

function getFromSessionStorage(){
    const localCordinates=sessionStorage.getItem('local-coordinates');
    if(!localCordinates){
        grantAccessContainer.classList.add('active');

    }else{
        let coordinates=JSON.parse(localCordinates);
        getAPI(coordinates);
    }
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else{
        console.log('not supported');
    }
}
  
  function showPosition(position) {
    
    const userCoordinates={
         lat :position.coords.latitude ,
         lon :position.coords.longitude

    }
    sessionStorage.setItem('local-coordinates',JSON.stringify(userCoordinates));
    getAPI(userCoordinates);
    
}



async function getAPI(coordinates){
    const{lat,lon}=coordinates;
    grantAccessContainer.classList.remove('active');
    loading.classList.add('active');
    

    try{
        
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        weatherContainer.classList.add('active');
        loading.classList.remove('active');
        
        renderWeather(data);
        
    }
    catch(e){

        //baccha hua h
    }
}
let city=document.querySelector('[city]');
let icon=document.querySelector('[country-icon]');
let weather_icon=document.querySelector('[weather-icon]');
let weather=document.querySelector('[weather]');
let temp=document.querySelector('[temp]');
let speed=document.querySelector('[speed]');
let humidity=document.querySelector('[humidity]');
let clouds=document.querySelector('[clouds]');



function renderWeather(data){
    city.innerText=data?.name;
    icon.src=`https://flagcdn.com/16x12/${data?.sys?.country.toLowerCase()}.png`
    weather_icon.src=`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}.png`

    weather.innerText=data?.weather[0]?.main;
    temp.innerText=`${(data?.main?.temp - 273.15).toFixed(2)} °C`;
    
    speed.innerText=`${data?.wind?.speed} m/s`;
    humidity.innerText=`${data?.main?.humidity}%`;
    clouds.innerText=`${data?.clouds?.all}%`;


}
const grantBtn=document.querySelector('[grant-access]');


grantBtn.addEventListener('click',()=>{
    getLocation();
})
const input=document.querySelector('[input]');

searchBar.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName= input.value;
    
    if(cityName===""){
        return;
    } else{
        fetchWeather(cityName);
    }
    
});


async function fetchWeather(city){
    weatherContainer.classList.remove('active');
    loading.classList.add('active');
    grantAccessContainer.classList.remove('active')
    
    try{
        const respnse=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data= await respnse.json();
        weatherContainer.classList.add('active');
        loading.classList.remove('active');

        renderWeather(data);
    }
    catch(e){

    }
}
