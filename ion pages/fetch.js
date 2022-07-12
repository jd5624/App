const imageDisplay = document.getElementById("img-display");
const ShowTitle = document.getElementById("showName");
const outputSelect = document.querySelector('#select-output');

const searchTerm = document.querySelector('#input-character-name');
const outputList = document.getElementById("list-output");


const Shows = 'https://api.tvmaze/search/shows?q=:query.com';

fetch(show)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));

let showName = "";

//Initialise the app with data to produce a select for the characters
initData();

//Check to see if a character selection is made
outputSelect.addEventListener('ionChange', getDetails);



//-------------------------------------------------------------------

function getDetails(){
  //fetch a response from the API, then get the json object from that response 
  //and then examine json object to get relevant information for the app output
  //and if an error, output error
  fetch(games).then(getJson).then(updateDisplay).catch(reportError);
}


function getJson(aResponse){  //fetch response from API
  return aResponse.json();
}


//-------------------------------------------------------------------
function updateDisplay(jsonObj){ 

  

  let showObjArray = jsonObj;       //get json object from response
                                    //jsonObj is an array of character objects

  //Check to see if user input matches a character
  for (let ashowObj of showObjArray){   
    if (ashowObj.title === outputSelect.value){
      showObj = ashowObj;
    }  
  }
  //console.log(charObj);

  let showName = showObj.title;      //Get character name
  showTitle.textContent = showObj.title; //Set title to be character name
  let showImageURL = showObj.img;   //Get character image
  imageDisplay.src= showImageURL;    //Set image to be character image
  
  removeAllListItems();             //remove all previous list items
  makeDetailsList(showObj)          //Create list of character attributes underneath image
}

//-------------------------------------------------------------------

function reportError(anError){
  //console.log(anError);
}
//-------------------------------------------------------------------

function getshowNameInput(){
  //console.log(searchTerm.value);
  return searchTerm.value;
  //return "Walter White";
}
//-------------------------------------------------------------------

function makeDetailsList(ashowObj){
  let showPropertyList = ["title", "rating", "platform", "released"];
  
  for (let showProperty of showPropertyList){
    const newItem = document.createElement('ion-item');
    let outputText = showProperty.toUpperCase() + ":   " + ashowObj[showProperty];
    newItem.textContent = outputText;

    outputList.appendChild(newItem);
  }
}

function removeAllListItems(){
  while (outputList.lastElementChild) {
    outputList.removeChild(outputList.lastElementChild);
  }
}


//-------------------------------------------------------------------

function initData(){
  fetch(shows).then(getJson).then(initSelect).then(reportError);  
}
//-------------------------------------------------------------------

function initSelect(jsonObj){

  let showObjectArray = jsonObj.results;
  //console.log(characterObjectArray);
  let showNamesArray = [];

  for (let showObject of showObjectArray){
    showNamesArray.push(showObject.name);
  }
  //console.log(characterNamesArray);
  buildSelectOptions(showNamesArray);
}
//-------------------------------------------------------------------

function buildSelectOptions(anArrayOfshowNames){
  
  for (let showName of anArrayOfshowNames){
    createSelectOption(showName)
  }
}
//-------------------------------------------------------------------
function createSelectOption(aName){
  const newItem = document.createElement('ion-select-option');
  newItem.value = aName;
  newItem.textContent = aName;

  outputSelect.appendChild(newItem);  
}
//-------------------------------------------------------------------


