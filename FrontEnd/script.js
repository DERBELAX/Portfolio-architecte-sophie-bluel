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
      listCategories();
      //display all works
      getworks(worksData);
      //Filter functionality
      filter = document.querySelector(".filter");
      categoryFilter(categories, filter);
      adminUserMode(filter);
    });
}

// GALLERY
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
    workCard.append(workImage, workTitle);
  });
}

//get list of categories in array as unique objects
function listCategories() {
  let listCategories = new Set();
  //get set of string categories
  worksData.forEach((work) => {
    listCategories.add(JSON.stringify(work.category));
  });
  //push stringified categories in array
  const arrayOfStrings = [...listCategories];
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
  //identify which filter button has been clicked
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

//ADMIN MODE
function adminUserMode() {
  //display admin mode if token exists
  if (sessionStorage.getItem("token")) {
    //Hide filter
    document.querySelector(".filter").style.display = "none";
    //change login to logout
    const logBtn = document.getElementById("logBtn");
    logBtn.innerText = "logout";
    logBtn.addEventListener("click", logout);
     // Display top menu bar
     const body = document.querySelector("body");
     const topMenu = document.createElement("div");
     const editMode = document.createElement("p");
    
     
     topMenu.className = "topMenu";
     editMode.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Mode édition`;
     logBtn.addEventListener("click", logout);
     
     topMenu.append(editMode);
     body.insertAdjacentElement("afterbegin", topMenu);
 
     // Edit buttons
     const portfolioHeader = document.querySelector("#portfolio h2");
     if (portfolioHeader) {
       const editBtn = document.createElement("p");
       editBtn.className = "editBtn";
       editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Modifier</p>`;
       portfolioHeader.insertAdjacentElement("beforeend", editBtn);
     }
     // Event listener modal
     const portfolioParagraph = document.querySelector("#portfolio p");
     if (portfolioParagraph) {
       portfolioParagraph.addEventListener("click", openModal);
     } 
  }
}
// LOGOUT FUNCTION

function logout() {
  // Clear the token from sessionStorage
  sessionStorage.removeItem("token");
  // Reload the page to update the UI
  window.location.reload();
}
//MODAL
//open modal if token exists
const openModal = function () {
  if (sessionStorage.getItem("token")) {
    modal = document.querySelector(".modal");
    modal.style.display = "flex";
    document.querySelector("#addPicture").style.display = "none";
    document.querySelector("#editGallery").style.display = "flex";
    modalGallery(worksData);
    modalStep = 0;
    // close modal listener
    modal.addEventListener("click", closeModal);
    // DELETE button listener
    document.addEventListener("click", deleteBtn);
    document.addEventListener("click", openNewWorkForm);
  }
};

//close modal
const closeModal = function (e) {
  if (
    e.target === document.querySelector(".modal") ||
    e.target === document.getElementsByClassName("fa-xmark")[modalStep]
  ) {
    document.querySelector(".modal").style.display = "none";
    document.removeEventListener("click", closeModal);
    document.removeEventListener("click", deleteBtn);
    modalStep = null;
  }
}

//DELETE
//display modal gallery function
function modalGallery(data) {
  const modalContent = document.querySelector(".modalContent");
  modalContent.innerHTML = "";
  //show all works in array
  data.forEach((i) => {
    //create elements
    const miniWork = document.createElement("figure");
    const modalImage = document.createElement("img");
    const edit = document.createElement("figcaption");
    const trashCan = document.createElement("i");
    //trashcan ID is work ID
    trashCan.id = i.id;
    trashCan.classList.add("fa-solid", "fa-trash-can");
    modalImage.src = i.imageUrl;
    modalImage.alt = i.title;
    miniWork.className = "miniWork";
    //references to DOM
    modalContent.appendChild(miniWork);
    miniWork.append(modalImage, trashCan);
  });
}

//DELETE work event listener handler
const deleteBtn = function (e) {
  e.preventDefault();
  //clicked button
  if (e.target.matches(".fa-trash-can")) {
    deleteWork(e.target.id);
  }
};

//API call for DELETE route
function deleteWork(i) {
  //authenticate user and send API response
  let token = sessionStorage.getItem("token");
  fetch(baseInfo + "works/" + i, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    //if response is positive, update the works gallery accordingly
    if (response.ok) {
      alert("Projet supprimé avec succés")
      //delete work from worksData array
      worksData = worksData.filter((work) => work.id != i);
      //display updated galleries
      getworks(worksData);
      modalGallery(worksData);
      //if response is negative report an error
    } else {
      alert("Erreur : " + response.status);
      closeModal();
    }
  });
}

//ADD WORK
//display add work form
const openNewWorkForm = function (e) {
  if (e.target === document.querySelector("#addPictureBtn")) {
    modalStep = 1;
    document.querySelector("#addPicture").style.display = "flex";
    document.querySelector("#editGallery").style.display = "none";
    document.querySelector("#labelPhoto").style.display = "flex";
    document.querySelector("#picturePreview").style.display = "none";
    document.querySelector("#valider").style.background="#A7A7A7";
    document.getElementById("addPictureForm").reset();
    //<select> categories list 
    selectCategoryForm();
    //display preview
    pictureInput = document.querySelector("#photo");
    pictureInput.onchange = picturePreview;
    //events
    document.addEventListener("click", closeModal);
    document.querySelector(".modalHeader .fa-arrow-left").addEventListener("click", openModal);
    document.removeEventListener("click", openNewWorkForm);
    document.removeEventListener("click", deleteBtn);
    document.addEventListener("click", newWorkFormSubmit);
  }
}

//preview picture in form
const picturePreview = function() {
  const [file] = pictureInput.files;
  if (file) {
    document.querySelector("#picturePreviewImg").src = URL.createObjectURL(file);
    document.querySelector("#picturePreview").style.display = "flex";
    document.querySelector("#labelPhoto").style.display = "none";
    document.querySelector("#valider").style.background="#1D6154";
  }
};

//category options for form
const selectCategoryForm = function () {
  //reset categories
  document.querySelector("#selectCategory").innerHTML = "";
  //empty first option
  let option = document.createElement("option");
  document.querySelector("#selectCategory").appendChild(option);
  //options from categories array
  categories.forEach((categorie) => {
    option = document.createElement("option");
    option.value = categorie.name;
    option.innerText = categorie.name;
    option.id = categorie.id;
    document.querySelector("#selectCategory").appendChild(option);
  });
};

//submit work form event listener
const newWorkFormSubmit = function (e) {
  if (e.target === document.querySelector("#valider")) {
    e.preventDefault();
    postNewWork();
  }
}

//POST new work
function postNewWork() {
  let token = sessionStorage.getItem("token");
  const select = document.getElementById("selectCategory");
  //get data from form
  const title = document.getElementById("title").value;
  const categoryName = select.options[select.selectedIndex].innerText;
  const categoryId = select.options[select.selectedIndex].id;
  const image = document.getElementById("photo").files[0];
  //check form validity
  let validity = formValidation(image, title, categoryId);
  if (validity === true) {
    //create FormData
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);
    // send collected data to API
    sendNewData(token, formData, title, categoryName);
  }
};

//form validation
const formValidation = function(image, title, categoryId) {
  if (image == undefined){
    alert("Veuillez ajouter une image");
    return false;
  }
  if (title.trim().length == 0){    
    alert("Veuillez ajouter un titre");
    return false;
  }
  if (categoryId == ""){
    alert("Veuillez choisir une catégorie");
    return false;
  } else {
    return true;
  }
}

//add new work in worksData array for dynamic display using API response
const addToWorksData = function(data, categoryName) {
  let newWork = {};
  newWork.title = data.title;
  newWork.id = data.id;
  newWork.category = {"id": data.categoryId, "name": categoryName};
  newWork.imageUrl = data.imageUrl;
  worksData.push(newWork);
}

//API call for new work
function sendNewData(token, formData, title, categoryName) {
  fetch(`${baseInfo}works`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        alert("Nouveau fichier envoyé avec succés : " + title);
        return response.json();
      } else {
        console.error("Erreur:", response.status);
      }
    })
    .then((data) => {
      addToWorksData(data, categoryName);
      getworks(worksData);
      document.querySelector(".modal").style.display = "none";
      document.removeEventListener("click", closeModal);
      modalStep = null;
    })
    .catch((error) => console.error("Erreur:", error));
}
