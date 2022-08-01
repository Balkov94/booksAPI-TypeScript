// favourites page functions____________________________________________

import { getRequest } from "./JSONserverRequests.js";

const favLink = document.getElementById("favourites-link");
// const favPage = document.getElementsByClassName("cards-container-fav")[0];

favLink!.addEventListener("click", function () {
     getRequest(); //JSON server get all fav Books

})

export {checkCardButton};

async function checkCardButton() {
     const allFavBtns = document.getElementsByClassName("cardFavBtn");
     try {
          const data = await fetch(`http://localhost:3000/api/favourites/`);
          const allFavBooks = await data.json();

          for (let i = 0; i < allFavBtns.length; i++) {
               const currBtnID = (allFavBtns[i].id).replace("favButton", "");

               if (allFavBooks.find(book => book.id == currBtnID)) {
                    (allFavBtns[i] as HTMLButtonElement).disabled = true;
               }
               else {
                    (<HTMLButtonElement>allFavBtns[i]).disabled = false;
               }
          }
     } catch (error) {
          return;
     }

}

export {closeAllModalsinPageSwitch};
function closeAllModalsinPageSwitch() {

     const allModalsCollection = document.getElementsByClassName("modal");
     const allModalsArr = [...allModalsCollection];
     allModalsArr.forEach(modal  => {
          (<HTMLElement>modal).style.visibility = "hidden";
     });
}

