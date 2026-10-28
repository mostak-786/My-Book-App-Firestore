console.log("JS FILE LOADED");

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getFirestore,
  onSnapshot,
  query,
  collection,
  orderBy,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB_oa81yjc553shqwk84WwnOxhfgyaWCZ4",
  authDomain: "movies-review-2511809.firebaseapp.com",
  projectId: "movies-review-2511809",
  storageBucket: "movies-review-2511809.firebasestorage.app",
  messagingSenderId: "729750987403",
  appId: "1:729750987403:web:f3293e0028ae9bfe2e6a8e"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentSort = "movie_name";

// CREATE (Add movie)
$(document).ready(function () {

  $("#addBtn").click(async function () {

    await addDoc(collection(db, "movies"), {
      movie_name: $("#movieName").val(),
      director: $("#director").val(),
      rating: parseInt($("#rating").val()),
      release_date: $("#releaseDate").val()
    });

    // reset form
    $("#movieName").val('');
    $("#director").val('');
    $("#rating").val('1');
    $("#releaseDate").val('');
  });

  // initial load
  loadData();
});

// READ (Live table)
let unsubscribe = null;

function loadData() {

  // stop previous listener
  if (unsubscribe) unsubscribe();

  const q = query(
    collection(db, "movies"),
    orderBy(currentSort)
  );

  unsubscribe = onSnapshot(q, (snapshot) => {

    $("#reviewList").empty();

    let tableRows = "";

    snapshot.forEach((docSnap) => {

      const d = docSnap.data();
      const id = docSnap.id;

      tableRows += `
        <tr>
          <td>${d.movie_name}</td>
          <td>${d.director}</td>
          <td>${d.rating}/5</td>
          <td>${d.release_date}</td>
          <td>
            <button class="btn btn-warning btn-sm editBtn" data-id="${id}">
              Edit
            </button>
            <button class="btn btn-danger btn-sm deleteBtn" data-id="${id}">
              Delete
            </button>
          </td>
        </tr>
      `;
    });

    $("#reviewList").append(tableRows);
    $("#mainTitle").html(snapshot.size + " movies in the list");
  });
}

// DELETE
$(document).on("click", ".deleteBtn", async function () {

  const id = $(this).data("id");

  await deleteDoc(doc(db, "movies", id));
});


// UPDATE (Edit)
$(document).on("click", ".editBtn", async function () {

  const id = $(this).data("id");

  const newName = prompt("Movie name:");
  const newDirector = prompt("Director:");
  const newRating = prompt("Rating (0-5):");
  const newDate = prompt("Release date:");

  if (!newName || !newDirector || !newRating || !newDate) return;

  await updateDoc(doc(db, "movies", id), {
    movie_name: newName,
    director: newDirector,
    rating: parseInt(newRating),
    release_date: newDate
  });
});


// SORT
$("#sortByName").click(function () {
  currentSort = "movie_name";
  loadData();
});

$("#sortByRating").click(function () {
  currentSort = "rating";
  loadData();
});