import model from "../model/index_model.js";
import controller from "../controller/index_controller.js";
let view = {
  search: function (response) {
    const ldSpinnerEl = document.querySelector(".lds-spinner");
    ldSpinnerEl.classList.remove("hidden");
    const attractionsEl = document.querySelector(".attractions");
    attractionsEl.textContent = ""; //clear attraction container
    if (response.length === 0) {
      //create img tag in attractions-container
      const imgNoResultImg = document.createElement("img");
      imgNoResultImg.addEventListener("load", function (e) {
        ldSpinnerEl.classList.add("hidden");
      });
      imgNoResultImg.className = "no-result-img";
      imgNoResultImg.src = "/static/images/no_results.png";
      attractionsEl.appendChild(imgNoResultImg);
      // attractionsContainerEl.insertBefore(imgNoResultImg, attractionsContainerEl.lastElementChild);
      return;
    } else {
      this.render(response);
    }
  },
  addCatShadow: function () {
    let catItemEls = document.querySelectorAll(".cat-item");
    catItemEls.forEach(function (catItemEl) {
      catItemEl.addEventListener("mouseover", mouseOver);
      catItemEl.addEventListener("mouseout", mouseOut);
    });
    function mouseOver() {
      this.classList.add("cat-item-change-color");
    }
    function mouseOut() {
      this.classList.remove("cat-item-change-color");
    }
  },
  category: function (catData) {
    catData.data.forEach(function (category) {
      const searchBarTextEl = document.querySelector(".search-bar-text");
      const searchCategoryEls = document.querySelectorAll(".search-category");
      const divCatItem = document.createElement("div");
      divCatItem.className = "cat-item";
      divCatItem.textContent = category;

      divCatItem.addEventListener("click", function (e) {
        searchBarTextEl.value = this.textContent;
        searchCategoryEls[0].style.display = "none";
      });
      searchCategoryEls[0].insertBefore(
        divCatItem,
        searchCategoryEls.lastElementChild
      );
    });

    //click search bar pop up and other place to close category panel
    document.addEventListener("click", function (e) {
      const searchBarEl = document.querySelector(".search-bar");
      if (searchBarEl.contains(e.target)) {
        document.querySelector(".search-category").style.display = "flex";
      }
    });
    document.addEventListener("click", function (e) {
      const searchBarEl = document.querySelector(".search-bar");
      const categoryContainerEl = document.querySelector(".search-category");
      if (
        !categoryContainerEl.contains(e.target) &&
        !searchBarEl.contains(e.target)
      ) {
        categoryContainerEl.style.display = "none";
      }
    });
  },
  render: function (response) {
    model.loading = true;
    if (response === null) {
      return;
    }
    let imgCount = 0;
    let loadingNumberEl = document.querySelector(".loading-number");
    const ldSpinnerEl = document.querySelector(".lds-spinner");
    ldSpinnerEl.classList.remove("hidden");
    const attractionsEls = document.querySelectorAll(".attractions");
    const divAttractionsContainer = document.createElement("div");
    divAttractionsContainer.className = "attractions-container";
    divAttractionsContainer.style.display = "none";

    response.forEach(function (data) {
      //variables
      const aAttractionUrl = document.createElement("a");
      const divAttractionGroup = document.createElement("div");
      const divAttractionImgBox = document.createElement("div");
      const imgAttractionImg = document.createElement("img");
      // const imgAttractionImg=new Image();
      const divDetailsUpper = document.createElement("div");
      const divInfoUpper = document.createElement("div");
      const divDetailsLower = document.createElement("div");
      const divInfoLower = document.createElement("div");
      const divMrt = document.createElement("div");
      const divCat = document.createElement("div");

      imgAttractionImg.addEventListener("load", function (e) {
        imgCount++;
        let loadingNum = Math.round((imgCount / response.length) * 100);
        loadingNumberEl.textContent = `${loadingNum}%`;
        if (imgCount === response.length) {
          loadingNum = 0;
          loadingNumberEl.textContent = `${loadingNum}%`;
          attractionsEls[0].appendChild(divAttractionsContainer);
          ldSpinnerEl.classList.add("hidden");
          divAttractionsContainer.style.display = "flex";
        }
      });

      //add class name
      aAttractionUrl.className = "attraction-url";
      divAttractionGroup.className = "attraction-group";
      divAttractionImgBox.className = "attraction-img-box";
      imgAttractionImg.className = "attraction-img";
      divDetailsUpper.className = "details-upper";
      divInfoUpper.className = "info-upper";
      divDetailsLower.className = "details-lower";
      divInfoLower.className = "info-lower";
      divMrt.className = "mrt";
      divCat.className = "cat";
      //load data
      imgAttractionImg.src = data.images[0];
      divInfoUpper.textContent = data.name;
      divMrt.textContent = data.mrt;
      divCat.textContent = data.category;
      aAttractionUrl.href = `/attraction/${data.id}`;
      //construction
      divInfoLower.appendChild(divMrt);
      divInfoLower.appendChild(divCat);
      divDetailsLower.appendChild(divInfoLower);
      divDetailsUpper.appendChild(divInfoUpper);
      divAttractionImgBox.appendChild(imgAttractionImg);
      divAttractionGroup.appendChild(divAttractionImgBox);
      divAttractionGroup.appendChild(divDetailsUpper);
      divAttractionGroup.appendChild(divDetailsLower);
      aAttractionUrl.appendChild(divAttractionGroup);
      divAttractionsContainer.appendChild(aAttractionUrl);
    });
    model.loading = false;
    model.attractionData = null;
  },
  addClickSearch: async function () {
    //add click search button function
    const searchBtnEl = document.querySelector(".search-btn");
    searchBtnEl.addEventListener("click", async function () {
      model.currentPage = 0; //reset status
      model.keyword = document.querySelector(".search-bar-text").value;
      await controller.search();
    });
  },
};

export default view;
