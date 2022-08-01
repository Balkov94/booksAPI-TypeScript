
// loader spinner functions

function addloader() {
     const loaderWrapper = document.createElement("div");
     loaderWrapper.className = "loader-container";
     const loader = document.createElement("div");
     loader.className = "loader";
     loaderWrapper.append(loader);
     return loaderWrapper;
     // retun loading element
}

export {addloader};