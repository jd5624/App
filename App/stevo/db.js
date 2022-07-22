window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

var db;

$(function() {
    if (!window.indexedDB) {
        console.log("IndexedDB not supported");
    }
    else {
        console.log("window.indexedDB worked");
        const request = window.indexedDB.open("tv_shows_db", 3);
        request.onerror = event => {
            console.log("indexed_db error:")
            console.log(event.target);
        }
        request.onsuccess = event => {
            console.log("onsuccess()");

            if (!db) {
                db = event.target.result;
                getFavourites();
            }
        }
        request.onupgradeneeded = event => {
            console.log("onupgradeneeded()");
            if (!db) {
                db = event.target.result;
            }

            const objectStore = db.createObjectStore("fav_shows", { keyPath: "id" });
            objectStore.createIndex("name", "name", { unique: false });
            objectStore.createIndex("avg_rating", "avg_rating", { unique: false });
            objectStore.createIndex("premiere", "premiere", { unique: false });
            objectStore.createIndex("summary", "summary", { unique: false });
            objectStore.createIndex("genres", "genres", { unique: false });
            objectStore.createIndex("image_url", "image_url", { unique: false });
          };
    }
})