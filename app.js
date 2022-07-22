
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//Firebase Project: https://myionicfirebaseproject-c8029-default-rtdb.firebaseio.com/

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_-1pDIZR-yuRD26zvl7Xf3ZcRolQP15w",
    authDomain: "myionicfirebaseproject-c8029.firebaseapp.com",
    projectId: "myionicfirebaseproject-c8029",
    storageBucket: "myionicfirebaseproject-c8029.appspot.com",
    messagingSenderId: "949534576761",
    appId: "1:949534576761:web:afcdd74505dd1ed7bd44a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//----------------------------------------

const db = getDatabase();
//const dbRef = ref(db);

const textInput = document.getElementById("input-txt");
const sendButton = document.getElementById("btn-send");
const getButton = document.getElementById("btn-get");

sendButton.addEventListener('click', sendToFirebase);
getButton.addEventListener('click', getFromFirebase);

//--Send to Firebase-------------------------
function sendToFirebase(){

    for (let obj of dataObjectArray){
        set(ref(db, "recordNo" + obj.id), obj).then(logSuccess).catch(logError);
    }
}

function logSuccess(){
    console.log("Data stored successfully");  
}

function logError(error){
    console.log("Unsuccessful " + error);  
}


//--Get from Firebase-------------------------
function getFromFirebase(){
    const dbRef = ref(db);
    for (let i = 1; i <= 5; i++){
        get(child(dbRef, "recordNo" + i)).then(getData).catch(errData);
        
    }
    
}

function getData(data){
    //console.log(data.val());
    let animalObj = data.val();
    
    let keys = Object.keys(animalObj);
    //console.log(keys)
    // for (let i = 0; i < keys.length; i++){
    //     let k = keys[i];
        console.log(animalObj.title + ", " + animalObj.sound); 
    // }
}

function errData(err){
    console.log("Error is " + err);
}












/* function sendToFirebaseWithArrows(){
    
    //const someText = textInput.value;
    //set(ref(db, "TheRecord"), someText).then( () => {console.log("Data stored successfully"); })
    //                                   .catch( (error) => {console.log("Unsuccessful " + error); });

    for (let obj of dataObjectArray){

        set(ref(db, "recordNo" + obj.id), obj)
        .then( () => {
            console.log("Data stored successfully");  
        })
        .catch( (error) => {
            console.log("Unsuccessful + error");  
        });

    }
} */