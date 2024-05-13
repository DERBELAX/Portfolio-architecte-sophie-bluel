// connexion API
const token=sessionStorage.getItem("accessToken"); 
//function to get all the data from the database
async function dataBaseInfo (type){
    const response = await fetch ("http://localhost:5678/api/" + type);   
   
    if (response.ok == true){
        console.log("connexion database : successful");
        return (await response).json();
    } else {
        console.log("Error Connexion API:" + reponse.Error);
    }
}
console.log(dataBaseInfo("works"));
console.log(dataBaseInfo("categories"));

// DOM Elements
const gallery=document.getElementById("gallery");
const filters =document.getElementById("filters");
const modalContainer=document.querySelector(".modalContainer");
const worksContainer = document.querySelector('.worksContainer');

//Gallery
function showworksInModal(){
    worksContainer.innerHTML="";
    //show all works in array
    dataworks.forEach((work) => {
        //create tags
        const workCard=document.createElement("figure");
        const workImage=document.createElement("img");
        //get the data from the database
        workCard.dataset.id=work.id;
        workImage.src=work.imageUrl;
        workImage.alt=work.titel;
        //ref to DOM
        gallery.appenchild(workCard);
        workCard.append(workImage, workTitle);   
    });
    
}


