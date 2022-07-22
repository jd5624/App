// IndexedDB functionality was achieved with the help of the following guide:
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

// IndexedDB initialised
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

var db; // db will contain IndexedDB database

$(function() {
    // If IndexedDB not found/supported
    if (!window.indexedDB) {
        // Print error message to console
        console.log("IndexedDB not supported, some functionality will be unavailable");
    }
    else {  // If IndexedDB set
        // Open the TV shows database
        const request = window.indexedDB.open("tv_shows_db", 3);

        // On request error
        request.onerror = event => {
            // Print error to console
            console.log("IndexedDB error:")
            console.log(event.target);
        }

        // On request success
        request.onsuccess = event => {
            // If database has not been set yet
            if (!db) {
                // Set database
                db = event.target.result;
                // Get user's favourite shows
                getFavourites();
            }
        }

        // On upgrade needed, which will fire when database created for the first time
        request.onupgradeneeded = event => {
            // If database has not been set yet
            if (!db) {
                // Set database
                db = event.target.result;
            }

            // Create object store for saving favourite shows with unique keyPath "id"
            const objectStore = db.createObjectStore("fav_shows", { keyPath: "id" });
            // Create schema for show objects
            objectStore.createIndex("name", "name", { unique: false });
            objectStore.createIndex("avg_rating", "avg_rating", { unique: false });
            objectStore.createIndex("premiere", "premiere", { unique: false });
            objectStore.createIndex("summary", "summary", { unique: false });
            objectStore.createIndex("genres", "genres", { unique: false });
            objectStore.createIndex("image_url", "image_url", { unique: false });
          };
    }
})