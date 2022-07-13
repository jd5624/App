const imageDisplay = document.getElementById("img-display");
const characterTitle = document.getElementById("title-name");
const outputSelect = document.querySelector('#select-output');

const searchTerm = document.querySelector('#input-character-name');
const outputList = document.getElementById("list-output");

//Character information from The Breaking Bad API
const characters = `https://www.breakingbadapi.com/api/characters/`;

let characterName = "";

//Initialise the app with data to produce a select for the characters
initData();

//Check to see if a character selection is made
outputSelect.addEventListener('ionChange', getDetails);



//-------------------------------------------------------------------

function getDetails(){
  //fetch a response from the API, then get the json object from that response 
  //and then examine json object to get relevant information for the app output
  //and if an error, output error
  fetch(characters).then(getJson).then(updateDisplay).catch(reportError);
}


function getJson(aResponse){  //fetch response from API
  return aResponse.json();
}


//-------------------------------------------------------------------
function updateDisplay(jsonObj){ 

  

  let charObjArray = jsonObj;       //get json object from response
                                    //jsonObj is an array of character objects

  //Check to see if user input matches a character
  for (let aCharObj of charObjArray){   
    if (aCharObj.name === outputSelect.value){
      charObj = aCharObj;
    }  
  }
  //console.log(charObj);

  let charName = charObj.name;      //Get character name
  characterTitle.textContent = charObj.name; //Set title to be character name
  let charImageURL = charObj.img;   //Get character image
  imageDisplay.src=charImageURL;    //Set image to be character image
  
  removeAllListItems();             //remove all previous list items
  makeDetailsList(charObj)          //Create list of character attributes underneath image
}

//-------------------------------------------------------------------

function reportError(anError){
  //console.log(anError);
}
//-------------------------------------------------------------------

function getCharacterNameInput(){
  //console.log(searchTerm.value);
  return searchTerm.value;
  //return "Walter White";
}
//-------------------------------------------------------------------

function makeDetailsList(aCharObj){
  let characterPropertyList = ["birthday", "nickname", "portrayed", "status"];
  
  for (let characterProperty of characterPropertyList){
    const newItem = document.createElement('ion-item');
    let outputText = characterProperty.toUpperCase() + ":   " + aCharObj[characterProperty];
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
  fetch(characters).then(getJson).then(initSelect).then(reportError);  
}
//-------------------------------------------------------------------

function initSelect(jsonObj){

  let characterObjectArray = jsonObj;
  //console.log(characterObjectArray);
  let characterNamesArray = [];

  for (let characterObject of characterObjectArray){
    characterNamesArray.push(characterObject.name);
  }
  //console.log(characterNamesArray);
  buildSelectOptions(characterNamesArray);
}
//-------------------------------------------------------------------

function buildSelectOptions(anArrayOfCharacterNames){
  
  for (let charName of anArrayOfCharacterNames){
    createSelectOption(charName)
  }
}
//-------------------------------------------------------------------
function createSelectOption(aName){
  const newItem = document.createElement('ion-select-option');
  newItem.value = aName;
  newItem.textContent = aName.toUpperCase();

  outputSelect.appendChild(newItem);  
}
//-------------------------------------------------------------------


