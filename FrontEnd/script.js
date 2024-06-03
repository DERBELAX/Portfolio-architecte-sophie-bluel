//import{Form} from "./login.js";
const token = sessionStorage.getItem("accessToken");
//Data 
const baseInfo = "http://localhost:5678/api/";
let worksData;
let categories;

//Elements
let gallery;
let filter;
let modal=null
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

    });
}
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
function categoryFilter(categories, filter) {
  const button = document.createElement("button");
  button.innerText = "Tous";
  button.className = "filterButton";
  button.dataset.category = "Tous";
  filter.appendChild(button);
  filtreButtons(categories, filter);
  functionFilter();
}
//create filter buttons
function filtreButtons(categories, filter) {
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
};


//MODAL

const openModal = function (e) {
  e.preventDefault()
  modal = document.querySelector(e.target.getAttribute('href'))
  modal.style.display = null
  modal.removeAttribute('aria-hidden')
  modal.setAttribute('aria-modal', 'true')
  modal.addEventListener('click', closModal)
  modal.querySelector('js-close-modal').addEventListener('click', closModal)
  modal.querySelector('js-modal-stop').addEventListener('click', stopPropagation)
  functionModalVue2()
}

const closModal = function (e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.removeAttribute('aria-hidden', 'true')
  modal.removeEventListener('click', closModal)
  modal.querySelector('js-close-modal').removeEventListener('click', closModal)
  modal.querySelector('js-modal-stop').removeEventListener('clik', stopPropagation)
  modal = null
}
const stopPropagation = function (e) {
  e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e){
  if (e.key === "Escape" || e.key === "Esc") {
    closModal(e)
  }
  })

  function functionModalVue2 (){
    document.getElementById("icone-return").addEventListener("click", btnRetourModalVue2)
    document.querySelector(".btn-add-photo-modal").addEventListener("click", closeModalVue2)
    document.querySelector('.js-close-modal-vue2').addEventListener('click', closModal)
}

function btnRetourModalVue2(){
  workPicture = undefined;
  document.querySelector(".js-container-modal").style.display = null;
  document.querySelector(".container-add-photo-modal").style.display = "none"
  document.querySelector(".container-photo").style.display = null
  document.querySelector(".photo").textContent = null
}
function closeModalVue2() {
  document.querySelector(".js-container-modal").style.display = "none";
  document.querySelector(".container-add-photo-modal").style.display =null
  sendProject()
}



