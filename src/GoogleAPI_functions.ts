const search = <HTMLInputElement>document.getElementById("search");
const searchBy = <HTMLInputElement>document.getElementById("searchBy");
const searchBtn = document.getElementById("searchBtn");
const cardsContainer = document.getElementsByClassName("cards-container")[0];
// const cardsContainerFav = document.getElementsByClassName("cards-container-fav")[0];
// const loader = document.getElementsByClassName("loader-container")[0];
// pegination 
const resultNum = document.getElementById("resultNum");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageNum = document.getElementById("pageNum");
import { createNewAnnotation } from "./annotations_functions.js";
import { checkCardButton } from "./favourites_functions.js";
import { annotationGetRequest, deleteRequest, postRequest } from "./JSONserverRequests.js";
// add additional data to HTML element
//1 in HTML -> data-index="some value"
//2 in DOM get-> dataset.index => "some value"

// TS MODULES
import {addloader} from "./loadingSpinner.js"

prevPage!.addEventListener("click", function () {
     if (!Number(pageNum!.dataset.index)) {
          return;
     }
     pageNum!.innerText = (Number(pageNum!.innerText) - 1).toString();
     pageNum!.dataset.index = (Number(pageNum!.dataset.index) - 10).toString();
     fetchData();

})
nextPage!.addEventListener("click", function () {
     pageNum!.innerText = (Number(pageNum!.innerText) + 1).toString();
     pageNum!.dataset.index = (Number(pageNum!.dataset.index) + 10).toString();
     fetchData();

})

searchBtn!.addEventListener("click", function () {
     pageNum!.innerText = (1).toString();
     pageNum!.dataset.index = (0).toString();
     fetchData();
});

search!.addEventListener("click", () => {
     search!.innerHTML = ""; //?????????????????
})



function fetchData() {
     let inputText = search!.value;
     const qParam = `in${searchBy.value}`; //title / author / publisher
     // 1. Fetch url validation !!!! CARE with SPACE char
     if (typeof inputText == 'undefined' || inputText.length < 3) {
          alert(`You have to enter min 3 chars to search!`);
          return;
     }
     // 2. clear wrapper and add loading animation
     cardsContainer.innerHTML = "";
     const loader = addloader();
     cardsContainer.append(loader);


     //* fix searching title need "" because of ENCODING SPACE 
     if (qParam == "intitle") {
          inputText = `\"${inputText}\"`;
     }
     else if (inputText.includes(" ")) {
          inputText = inputText.replaceAll(" ", "-")
     }

     // 3 fetch data
     fetch(`https://www.googleapis.com/books/v1/volumes?q=${qParam}:${inputText}&printType=books&startIndex=${pageNum.dataset.index}&maxResults=10`)
          .then(res => res.json())
          .then(data => {
               console.log(data);
               // print total result
               resultNum!.innerText = `${data.kind.slice(6)} ${data.totalItems}`;
               if (data.totalItems == 0) {
                    ErrorPage();
                    return;
               }
               // add curr card
               for (let i = 0; i < data.items.length; i++) {
                    const currBook = data.items[i];
                    createAppendCard(currBook, cardsContainer);


               }
          })
          .then(() => {
               // clear loading animation
               loader.remove();
          })
          .then(() => {
               // on each page - diabled already added to fav Cards buttons
               checkCardButton();
          })


     // error div -> book not found
     function ErrorPage() {
          const notfound = document.createElement("div");
          notfound.className = "notFound";
          notfound.innerText = `Sorry, there isn't any valume with 
          "${inputText.replaceAll("\"", " ").trim()}" ${searchBy.value}`;
          cardsContainer.append(notfound);
          // try add some img agter text
          const errImg=document.createElement("img");
          errImg.alt="Error image";
          errImg.src="https://media0.giphy.com/media/SiMcadhDEZDm93GmTL/giphy.gif?cid=ecf05e47orkqv5ok4bpeltmux4l6n6pul7mxiglf2era8o9v&rid=giphy.gif&ct=g"
          notfound.append(errImg);
     }
}


export {createAppendCard};
function createAppendCard(currBook, page) {
     const title = currBook.volumeInfo.title;
     let authors = currBook.volumeInfo.authors;
     const bookID = currBook.id;
     if (Array.isArray(authors)) {
          authors = authors.join(", ");
     }
     else if (authors == 'undefined') {
          authors = "no infromation";
     }

     const description = currBook.volumeInfo.description;
     const year = currBook.volumeInfo.publishedDate;
     let bookImgSrc = currBook.volumeInfo.imageLinks;
     if (!bookImgSrc) {
          bookImgSrc = "https://storiavoce.com/wp-content/plugins/lightbox/images/No-image-found.jpg";
     }
     else {
          bookImgSrc = currBook.volumeInfo.imageLinks["thumbnail"];
     }

     const src = bookImgSrc ? bookImgSrc : "none";

     const cardContainer = document.createElement("div");
     cardContainer.className = "card";
     cardContainer.id = "cardContainer" + bookID;

     const cardImg = document.createElement("img");
     cardImg.src = src;
     cardImg.className = "card-img";
     cardImg.id = "img" + bookID;

     const cardBodyDesc = document.createElement("div");
     cardBodyDesc.className = "card-title-desc";

     const cardTitle = document.createElement("h5");
     cardTitle.className = "card-title";
     cardTitle.innerText = title;
     cardTitle.id = "title" + bookID;


     const cardText = document.createElement("p");
     cardText.className = "card-text";
     cardText.innerText = description ? description : "no description";
     cardText.id = "description" + bookID;

     cardBodyDesc.append(cardTitle, cardText);

     const cardUl = document.createElement("ul");
     cardUl.className = "card-author-year";
     const cardYear = document.createElement("li");
     // need check for with page are the cards(bc for home are using api obj /for  fav are using my own book obj)
     if(page.className=="cards-container-fav"){
          cardYear.innerText = ("year: " + (year ? year.slice(5).trim() : "-"));
     }
     else{
          cardYear.innerText = ("year: " + (year ? year.slice(0,4).trim() : "-"));
     }

     cardYear.id = "year" + bookID;
     const cardAuthor = document.createElement("li");
     cardAuthor.innerText = "author: " + (authors ? authors.trim() : "-");
     cardAuthor.id = "author" + bookID;
     cardUl.append(cardAuthor, cardYear);

     const cardButtonsContainer = document.createElement("div");
     cardButtonsContainer.className = "card-buttons";
     const cardButton = document.createElement("button");

     // if (page.className == "cards-container") {
     // check if book is already in favourites
     // REMOVE button in fav page
     if (page.className =="cards-container-fav") {
          cardButton.className = "cardRemoveBtn";
          cardButton.innerText = "Remove";
          cardButton.id = "removeButton" + bookID;
          cardButton.addEventListener("click",function(){
               deleteRequest(`${bookID}`);
               const parent = document.getElementById(`cardContainer${(bookID)}`);
               parent!.remove();
          })

     }
     // add to fav button in home page
     else {
          cardButton.className = "cardFavBtn";
          cardButton.innerText = "add to Fav";
          cardButton.id = "favButton" + bookID;
          cardButton.addEventListener("click",function(){
               const bookObjID = bookID;
               const title = document.getElementById(`title${bookID}`).innerText;
               const imageSrc = document.getElementById(`img${bookID}`).src;
               const description = document.getElementById(`description${bookID}`).innerText;
               const authors = document.getElementById(`author${bookID}`).innerText;
               const publishedDate = document.getElementById(`year${bookID}`).innerText;

               const bookObj = {
                    id: bookObjID,
                    volumeInfo: {
                         title,
                         imageLinks: {
                              thumbnail: imageSrc,
                         },
                         description,
                         authors,
                         publishedDate
                    }
               }
               postRequest(bookObj);
          })
     }

     cardButtonsContainer.append(cardButton);

     // add annotations button - > toggle for modal with annotations
     const annotationContainer = document.createElement("div");
     annotationContainer.className = "annotation-container";
     const annotationBtn = document.createElement("button");
     annotationBtn.innerText = "annotations";
     annotationBtn.className = "annotation-btn";
     annotationBtn.id = "annButton" + bookID; // a + id , because some id's start with number
     annotationContainer.append(annotationBtn);


     // 0 add modal container for showing annotations
     const modalContainer = document.createElement("div");
     modalContainer.className = "modal";
     modalContainer.id = "modal" + bookID;
     modalContainer.style.visibility = "hidden";

     // add new annotation btn
     const addAnnBtnContainer = document.createElement("div");
     addAnnBtnContainer.className = "add-ann-btn-container";
     const addNewAnnotationBtn = document.createElement("button");
     addNewAnnotationBtn.innerText = "add new annotation";
     addNewAnnotationBtn.className = "addAnnBtn";
     addNewAnnotationBtn.id = `addAnnotation${bookID}`;
     addAnnBtnContainer.append(addNewAnnotationBtn);

     // add toggle function to ann button - test fix
     annotationBtn.addEventListener("click", function () {
          if (modalContainer.style.visibility == "hidden") {
               modalContainer.style.visibility = "visible";
               annotationsWrapper.innerHTML = "";
               annotationGetRequest(bookID);
          }
          else {
               modalContainer.style.visibility = "hidden";
          }
     })
     // add function to "ADD NEW ANNOTATION" button
     addNewAnnotationBtn.addEventListener("click", function () {
          createNewAnnotation(bookID);
     })


     // adding 1- "add annutations wrapper"
     const annotationsWrapper = document.createElement("div");
     annotationsWrapper.className = "modal-content-wrapper";
     annotationsWrapper.id = `annotationsWrapper${bookID}`;
     // second classlist just for itarating in printing annotations
     annotationsWrapper.classList.add(`annotationsWrapper${bookID}`)

     modalContainer.append(addAnnBtnContainer, annotationsWrapper);



     cardContainer.append(cardImg, cardBodyDesc, cardUl, cardButtonsContainer, annotationContainer, modalContainer)

     page.append(cardContainer)


}






