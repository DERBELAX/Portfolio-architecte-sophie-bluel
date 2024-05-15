//Data 
const baseInfo = "http://localhost:5678/api/";
let worksData;
let categories;

//Elements
let gallery;
let filter;
let modal;
let modalStep = null;
let pictureInput;

// FETCH works data from API and display it
window.onload = () => {
  fetch(`${baseInfo}works`)
    .then((response) => response.json())
    .then((data) => {
      worksData = data;
      //get list of categories
      listOfUniqueCategories();
      //display all works
      getworks(worksData);
      //Filter functionnality
      filter = document.querySelector(".filter");
      categoryFilter(categories, filter);
      //administrator mode
      adminUserMode(filter);
    });
};


//*******GALLERY*******

function getworks(data) {
  gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  //show all works in array
  data.forEach((i) => {
    //create tags
    const workCard = document.createElement("figure");
    const workImage = document.createElement("img");
    const workTitle = document.createElement("figcaption");
    workImage.src = i.imageUrl;
    workImage.alt = i.title;
    workTitle.innerText = i.title;
    workCard.dataset.category = i.category.name;
    workCard.className = "workCard";
    //references to DOM
    gallery.appendChild(workCard);
    workCard.appendChild(workImage);
    workImage.appendChild(workTitle);
  });
  }
//get list of categories in array as unique objects
function listOfUniqueCategories() {
    let listOfCategories = new Set();
    //get set of string categories
    worksData.forEach((work) => {
      listOfCategories.add(JSON.stringify(work.category));
    });
    //push stringified categories in array
    const arrayOfStrings = [...listOfCategories];
    //parse array to get objects back
    categories = arrayOfStrings.map((s) => JSON.parse(s));
  }
  //filter buttons
  function categoryFilter(categories, filter){
    const button=document.createElement("button");
    button.innerText="Tous";
    button.className="filterButton";
    button.dataset.category="Tous";
    filter.appendChild(button);
    filtreButtons(categories,filter);
    functionFilter();
  }
  //create filter buttons
  function filtreButtons(categories,filter){
        categories.forEach((categorie) => {
          createButtonFilter(categorie, filter);
        });
  }
  function createButtonFilter(categorie, filter) {
    const button = document.createElement("button");
    button.innerText = categorie.name;
    button.className = "filterButton";
    button.dataset.category = categorie.name;
    filter.appendChild(button);
  }
  // Gallery filter
  function functionFilter() {
    const filterButtons = document.querySelectorAll(".filterButton");
    //identify wich filter button has been clicked
    filterButtons.forEach((i) => {
      i.addEventListener("click", function () {
        toggleProjects(i.dataset.category);
      });
    });
  } 
//if button "tous" active, display all projects, else display only those with same dataset category
function toggleProjects(datasetCategory) {
    const figures = document.querySelectorAll(".workCard");
    if ("Tous" === datasetCategory) {
      figures.forEach((figure) => {
        figure.style.display = "block";
      });
    } else {
      figures.forEach((figure) => {
        figure.dataset.category === datasetCategory
          ? (figure.style.display = "block")
          : (figure.style.display = "none");
      });
    }
  }