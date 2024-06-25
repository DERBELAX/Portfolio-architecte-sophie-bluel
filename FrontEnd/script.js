// Data 
const baseInfo = "http://localhost:5678/api/";
let worksData;
let categories;

// Elements
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
      // Get list of categories
      listCategories();
      // Display all works
      getworks(worksData);
      // Filter functionality
      filter = document.querySelector(".filter");
      categoryFilter(categories, filter);
      adminUserMode(filter);
    });
}

// GALLERY

function getworks(data) {
  gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  // Show all works in array
  data.forEach((i) => {
    // Create tags
    const workCard = document.createElement("figure");
    const workImage = document.createElement("img");
    const workTitle = document.createElement("figcaption");
    workImage.src = i.imageUrl;
    workImage.alt = i.title;
    workTitle.innerText = i.title;
    workCard.dataset.category = i.category.name;
    workCard.className = "workCard";
    // References to DOM
    gallery.appendChild(workCard);
    workCard.append(workImage, workTitle)
  });
}

// Get list of categories in array as unique objects
function listCategories() {
  let listCategories = new Set();
  // Get set of string categories
  worksData.forEach((work) => {
    listCategories.add(JSON.stringify(work.category));
  });
  // Push stringified categories in array
  const arrayOfStrings = [...listCategories];
  // Parse array to get objects back
  categories = arrayOfStrings.map((s) => JSON.parse(s));
}

// Filter buttons
function categoryFilter(categories, filter) {
  const button = document.createElement("button");
  button.innerText = "Tous";
  button.className = "filterButton";
  button.dataset.category = "Tous";
  filter.appendChild(button);
  filtreButtons(categories, filter);
  functionFilter();
}

// Create filter buttons
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
  // Identify which filter button has been clicked
  filterButtons.forEach((i) => {
    i.addEventListener("click", function () {
      toggleProjects(i.dataset.category);
    });
  });
}

// If button "tous" active, display all projects, else display only those with same dataset category
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

// ADMIN MODE

function adminUserMode() {
  // Display admin mode if token is found
  if (sessionStorage.getItem("token")) {
    // Hide filter
    document.querySelector(".filter").style.display = "none";
    // Change login to logout
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
  
  // Optionally, you can redirect the user to the login page
  // window.location.href = '/login'; // Adjust the path as needed
  
  // Reload the page to update the UI
  window.location.reload();
}

// MODAL

// Open modal if token is found
const openModal = function () {
  if (sessionStorage.getItem("token")) {
    modal = document.querySelector(".modal");
    modal.style.display = "flex";
    document.querySelector("#addPicture").style.display = "none";
    document.querySelector("#editGallery").style.display = "flex";
    modalGallery(worksData);
    modalStep = 0;
    // Close modal listener
    modal.addEventListener("click", closeModal);
    // DELETE button listener
    document.addEventListener("click", deleteBtn);
    document.addEventListener("click", openNewWorkForm);
  }
};

// Close modal
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

// DELETE

// Display modal gallery function
function modalGallery(data) {
  const modalContent = document.querySelector(".modalContent");
  modalContent.innerHTML = "";
  // Show all works in array
  data.forEach((i) => {
    // Create elements
    const miniWork = document.createElement("figure");
    const modalImage = document.createElement("img");
    const edit = document.createElement("figcaption");
    const trashCan = document.createElement("i");
    // Trashcan ID is work ID
    trashCan.id = i.id;
    trashCan.classList.add("fa-solid", "fa-trash-can");
    modalImage.src = i.imageUrl;
    modalImage.alt = i.title;
    miniWork.className = "miniWork";
    // References to DOM
    modalContent.appendChild(miniWork);
    miniWork.append(modalImage, trashCan);
  });
}

// DELETE work event listener handler
const deleteBtn = function (e) {
  e.preventDefault();
  // Clicked button
  if (e.target.matches(".fa-trash-can")) {
    deleteWork(e.target.id);
  }
};

// API call for DELETE route
function deleteWork(i) {
  // Authenticate user and send API response
  let token = sessionStorage.getItem("token");
  fetch(baseInfo + "works/" + i, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    // If response is positive, update the works gallery accordingly
    if (response.ok) {
      alert("Projet supprimé avec succès")
      // Delete work from worksData array
      worksData = worksData.filter((work) => work.id != i);
      // Display updated galleries
      displayGallery(worksData);
      modalGallery(worksData);
      // If response is negative, report an error
    } else {
      alert("Erreur : " + response.status);
      closeModal;
    }
  });
}

// ADD WORK

// Display add work form
const openNewWorkForm = function (e) {
  if(e.target === document.querySelector("#addPictureBtn")){
    modalStep = 1;
    document.querySelector("#addPicture").style.display = "flex";
    document.querySelector("#editGallery").style.display = "none";
    document.querySelector("#labelPhoto").style.display = "flex";
    document.querySelector("#picturePreview").style.display = "none";
    document.getElementById("addPictureForm").reset();
    //<select> categories list 
    selectCategoryForm();
    // Display preview
    pictureInput = document.querySelector("#photo");
    pictureInput.onchange = picturePreview;
    // Events
    document.addEventListener("click", closeModal);
    document.querySelector(".modalHeader .fa-arrow-left").addEventListener("click", openModal);
    document.removeEventListener("click", openNewWorkForm);
    document.removeEventListener("click", deleteBtn);
    document.addEventListener("click", newWorkFormSubmit);
  }
}

// Preview picture in form
const picturePreview = function() {
  const [file] = pictureInput.files;
  if (file) {
    document.querySelector("#picturePreviewImg").src = URL.createObjectURL(file);
    document.querySelector("#picturePreview").style.display = "flex";
    document.querySelector("#labelPhoto").style.display = "none";
  }
};

// Category options for form
const selectCategoryForm = function () {
  // Reset categories
  document.querySelector("#selectCategory").innerHTML = "";
  // Empty first option
  option = document.createElement("option");
  document.querySelector("#selectCategory").appendChild(option);
  // Options from categories array
  categories.forEach((categorie) => {
    option = document.createElement("option");
    option.value = categorie.name;
    option.innerText = categorie.name;
    option.id = categorie.id;
    document.querySelector("#selectCategory").appendChild(option);
  });
};

// Submit work form event listener
const newWorkFormSubmit = function (e) {
  if (e.target === document.querySelector("#valider")) {
    e.preventDefault();
    postNewWork();
  }
}

// POST new work
function postNewWork() {
  let token = sessionStorage.getItem("token");
  const select = document.getElementById("selectCategory");
  // Get data from form
  const title = document.getElementById("title").value;
  const categoryName = select.options[select.selectedIndex].innerText;
  const categoryId = select.options[select.selectedIndex].id;
  const image = document.getElementById("photo").files[0];
  // Check form validity
  let validity = formValidation(image, title, categoryId);
  if (validity === true) {
    // Create FormData
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);
    // Send collected data to API
    sendNewData(token, formData, title, categoryName);
  }
};

// Form validation
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
  }else{
  return true;
  }
}

// Add new work in worksData array for dynamic display using API response
const addToWorksData = function(data, categoryName) {
  newWork = {};
  newWork.title = data.title;
  newWork.id = data.id;
  newWork.category = {"id" : data.categoryId, "name" : categoryName};
  newWork.imageUrl = data.imageUrl;
  worksData.push(newWork);
}

// API call for new work
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
        alert("Nouveau fichier envoyé avec succès : " + title);
        return response.json();
      } else {
        console.error("Erreur:", response.status);
      }
    })
    .then ((data) => {
      addToWorksData(data, categoryName);
      displayGallery(worksData);
      document.querySelector(".modal").style.display = "none";
      document.removeEventListener("click", closeModal);
      modalStep = null;
    })
    .catch((error) => console.error("Erreur:", error));
}
