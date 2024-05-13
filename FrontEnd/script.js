async function getworks (){
    const response = await fetch ("http://localhost:5678/api/works",{
        method:'get',  
        headers: {  
        "Accept": "application/json"    
        }     
       }    
   )
    if (response.ok == true){
        return (await response).json();
    }
    throw new Error("unapel to acess")
}
let worksliste =null;

getworks().then(data => {
    worksliste = data;
    console.log(worksliste);
}
)


