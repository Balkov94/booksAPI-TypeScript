
//TS IMPORTS
import { openFormModal } from "./annotations_functions.js";
import { createAppendCard } from "./GoogleAPI_functions.js";
import { addloader } from "./loadingSpinner.js";
import { iAnnotation } from "./Interfaces/IAnnotations.js";
import { ifavouriteBook } from "./Interfaces/IFavouriteBook.js";

// favourites page JSON server BOOKs requests______________________________
export { postRequest };
function postRequest(book: ifavouriteBook) {
     fetch(`http://localhost:3000/api/favourites/`, {
          method: "POST",
          headers: {
               'Content-Type': 'application/json',
          },
          body: JSON.stringify(book)
     })
          .then(res => {
               if (!res.ok) {
                    console.log("post book status code:" + res.status);
                    if (res.status == 500) {
                         throw new Error("This book is already in favourites!")
                    }
                    throw new Error("bad POST request")
               }
               else {
                    return res.json();
               }
          })
          .then(data => {
               console.log(data);
               alert(`The book "${data.volumeInfo.title}" was added to Favourites`);
               const disableFavButton = document.getElementById(`favButton${book.id}`);
               (<HTMLButtonElement>disableFavButton).disabled = true;
          })
          .catch(err => {
               // console.log(err.message);
               console.log("Couldn't post(add) this book to favourites");
               alert(err.message)
          })

}

export { getRequest };
function getRequest() {
     const favPage = document.getElementsByClassName("cards-container-fav")[0];
     favPage.innerHTML = "";
     const loader = addloader();
     favPage.append(loader);
     fetch(`http://localhost:3000/api/favourites/`)
          .then(res => {
               if (!res.ok) {
                    throw new Error("bad fetch books")
               }
               else {
                    return res.json();
               }
          })
          .then((data: ifavouriteBook[]) => {
               // add to fav page and print
               data.reverse();
               data.forEach((book) => {
                    createAppendCard(book, favPage)
               });
               return data;
          })
          .then((data) => {
               loader.remove();
               // add div with text empty  
               if (data.length < 1) {
                    const emptyContainer = document.createElement("div");
                    emptyContainer.className = "fav-empty-container";
                    const text = document.createElement("h1");
                    text.innerText = "Favourites page is empty";
                    emptyContainer.append(text);
                    favPage.append(emptyContainer);
               }
          })
          .catch(err => {
               loader.remove();
               console.log(err.message);
               console.log(err);
          })
}

export { deleteRequest };
function deleteRequest(bookID: string) {
     fetch(`http://localhost:3000/api/favourites/${bookID}`, {
          method: "DELETE"
     })
          .then(res => {
               if (!res.ok) {
                    console.log(`response object status code: ${res.status}`);
                    throw new Error("bad DELETE request")
               }
               else {
                    console.log(`response object status code: ${res.status}`);
                    return res.json();
               }
          })
          .then(data => {
               console.log(data);
               alert(`The book was remmoved from favourites.`)
          })
          .catch(err => console.log(err.message))
}


// *********************************************************
// annotations requests ____________________________________
// get annotations for current book
export { annotationGetRequest };
function annotationGetRequest(bookID: string) {
     // debugger;
     fetch(`http://localhost:3000/api/annotations/`)//fet all anotations then sort by bookId
          .then(res => {
               if (!res.ok) {
                    console.log("annotation get status code: " + res.status);
                    throw new Error("fail annotation get method")
               }
               return res.json();
          })
          .then((data: iAnnotation[]) => {
               const currBookCollection = data.filter(annotation => {
                    if (annotation.book == bookID) {
                         return annotation;
                    }
               })
               currBookCollection.reverse();
               currBookCollection.forEach(currAnnObj => {
                    // ?????????????????????????????????????????????
                    createModalContentElement(currAnnObj);
               })

          })
          .catch(err => {
               console.log(err.message);
          })

     function createModalContentElement(currAnnObj: iAnnotation) {
          // content - title, text,date 
          const modalContent = document.createElement("div");
          modalContent.className = "modal-content";
          const modalDateBox = document.createElement("div");
          modalDateBox.className = "modal-date";
          const modalTextBox = document.createElement("div");
          modalTextBox.className = "modal-text";

          // order obj props in boxes
          const createDate = document.createElement("p");
          createDate.innerText = `Created on: ${currAnnObj.timeOfCreation}`;
          const editedDate = document.createElement("p");
          editedDate.innerText = `Edited on: ${currAnnObj.timeOFEdit}`;
          const title = document.createElement("h6");
          title.innerText = `${currAnnObj.title}`;
          const content = document.createElement("p");
          content.innerText = `${currAnnObj.content}`;

          modalDateBox.append(createDate, editedDate);
          modalTextBox.append(title, content);

          modalContent.append(modalDateBox, modalTextBox)

          // !!! *USE CLONENODE to have card in favpage an homepage in the same time
          const annotationsWrapper = document.getElementsByClassName(`annotationsWrapper${currAnnObj.book}`);
          // !!! FIX working with cloneNode-> to show in favPage and home the same annotations in the same time
          for (let i = 0; i < annotationsWrapper.length; i++) {
               const cloneNode = modalContent.cloneNode(true);
               // 
               const modalBtnsContainer = document.createElement("div");
               modalBtnsContainer.className = "modal-buttons-container";
               const editBtn = document.createElement("button");
               editBtn.innerText = "Edit";
               const deleteBtn = document.createElement("button");
               deleteBtn.innerText = "Delete";
               // ann - delete button
               deleteBtn.addEventListener("click", function () {
                    // debugger;
                    annotationDeleteRequest(currAnnObj);
                    // modalContent.remove(); NOT WORKING
                    // have problem when card is in Fav + Home

               })

               // ann - edin button
               editBtn.addEventListener("click", function () {
                    openFormModal(currAnnObj.book, currAnnObj.id)// bookID / annID
               })

               modalBtnsContainer.append(editBtn, deleteBtn);
               (<HTMLElement>cloneNode).append(modalBtnsContainer);

               annotationsWrapper[i].append(cloneNode);
          }

     }


}
export { annotationPostRequest };
function annotationPostRequest(newAnnObj: iAnnotation) {
     fetch(`http://localhost:3000/api/annotations/`, {
          method: "POST",
          headers: {
               'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAnnObj)
     })
          .then(res => {
               if (!res.ok) {
                    console.log(res.status);
                    return new Error("post new annotation error")
               }
               return res.json();
          })
          .then(data => {
               console.log(data);
               // close modal for forse fetch (get)
               const annotationsWrapper = document.getElementsByClassName(`annotationsWrapper${newAnnObj.book}`);
               const annotationsWrapperArr = [...annotationsWrapper]
               annotationsWrapperArr.forEach(page => page.parentElement!.style.visibility = "hidden");

               alert(`You added new annotation.`)
          })
          .catch(err => console.log(err.message))

}

export { annotationDeleteRequest }
function annotationDeleteRequest(annObj: iAnnotation) {
     fetch(`http://localhost:3000/api/annotations/${annObj.id}`, {
          method: "DELETE"
     })
          .then(res => {
               if (!res.ok) {
                    console.log(res.status);
                    return new Error("DELETE annotation error")
               }
               return res.json();
          })
          .then(data => {
               console.log(data);
               // let parentModal=document.getElementById(`modal${annObj.book}`);
               // parentModal.style.visibility="hidden";
               const annotationsWrapper = document.getElementsByClassName(`annotationsWrapper${annObj.book}`);
               const annotationsWrapperARR = [...annotationsWrapper]
               annotationsWrapperARR.forEach(page => page.parentElement!.style.visibility = "hidden");
               alert(`You Deleted annotation with name - "${annObj.title}".`)
          })
          .catch(err => console.log(err.message))

}

export { annotationEditRequest }
function annotationEditRequest(oldAnnID: number | string, editedAnnObj: iAnnotation) {
     fetch(`http://localhost:3000/api/annotations/${oldAnnID}`, {
          method: "PUT",
          headers: {
               'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedAnnObj)
     })
          .then(res => {
               if (!res.ok) {
                    console.log(res.status);
                    return new Error("edit (PUT) annotation error")
               }
               return res.json();
          })
          .then(data => {
               console.log(data);
               // get 2 wrapper - favpage and home
               const annotationsWrapper = document.getElementsByClassName(`annotationsWrapper${editedAnnObj.book}`);
               const annotationsWrapperARR = [...annotationsWrapper]
               annotationsWrapperARR.forEach(page => page.parentElement!.style.visibility = "hidden");
               alert(`You edited annotation with ID: ${data.id}`);
               // currModal.style.visibility = "hidden";
          })
          .catch(err => console.log(err.message))

}

