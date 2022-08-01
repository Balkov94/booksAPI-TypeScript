import { checkCardButton, closeAllModalsinPageSwitch } from "./favourites_functions.js";


// * hash ruter_______________________________________________________________
const wrapper = document.getElementById("wrapper");
const searchContainer = document.getElementById("search-container");
const favDiv = document.getElementById("favourites");
window.addEventListener("hashchange", hashChangeHandler);
window.addEventListener("load", hashChangeHandler);


function hashChangeHandler() {
     const hash = location.hash.slice(1);
     switch (hash) {
          case "Home":
               wrapper!.style.display = "flex";
               searchContainer!.style.display = "block"
               favDiv!.style.display = "none";  
               try{
                    checkCardButton(); //in home cards are not each time fatched

               }catch(error){
                    console.log(error);
               }
               closeAllModalsinPageSwitch();
               break;
          case "Favourites":
               favDiv!.style.display = "flex";
               wrapper!.style.display = "none";           
               searchContainer!.style.display = "none"
               break;
          case "":
               wrapper!.style.display = "flex";
               searchContainer!.style.display = "block"
               favDiv!.style.display = "none";
               break;

     }
}


