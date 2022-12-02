// get initial data
let keyword="";
let nextPage=null;
let loading=true;
let currentPage=0;

(async function getInitData() {
  loading=true;
  const url="api/attractions?page=0";	
  try {
    const response = await fetch(url);
    const data = await response.json();
    nextPage=data.nextPage;
    processData(data.data);
    document.querySelector("footer").style.display = "flex";		
  } catch (error) {
    console.log(error);
  } 	
})();

//category panel initialize
(async function category_panel() {
  const searchBarTextEl = document.querySelector(".search_bar_text");
  const url="api/categories";
  const searchCategoryEls=document.querySelectorAll(".search_category");
  try {
    const response = await fetch(url);
    const data = await response.json();

    data.data.forEach(function(category) {
      const divCatItem=document.createElement("div");
      divCatItem.className="cat_item";
      divCatItem.textContent=category;
      
      divCatItem.addEventListener("click", function (event) {
        searchBarTextEl.value=event.srcElement.textContent;
        searchCategoryEls[0].style.display = "none";
      });
      searchCategoryEls[0].insertBefore(divCatItem, searchCategoryEls.lastElementChild);
      addCatShadow();
    });	
  } catch (error) {
    console.log(error);
  }
})();

//process data to html
function processData(response) {
  loading=true;	
  response.forEach( function(data) {
    //variables
    const aAttractionUrl=document.createElement("a");
    const divAttractionGroup=document.createElement("div");
    const divAttractionImgBox=document.createElement("div");
    const imgAttractionImg=document.createElement("img");
    const divDetailsUpper=document.createElement("div");
    const divInfoUpper=document.createElement("div");
    const divDetailsLower=document.createElement("div");
    const divInfoLower=document.createElement("div");
    const divMrt=document.createElement("div");
    const divCat=document.createElement("div");
    const AttractionsContainerEls=document.querySelectorAll(".attractions_container"); 
    //.attractions_container use querySelector to append will have sequence problem, keep use querySelectorAll or getElementByClassName

    //add class name
    aAttractionUrl.className="attraction_url";
    divAttractionGroup.className="attraction_group";
    divAttractionImgBox.className="attraction_img_box";
    imgAttractionImg.className="attraction_img";
    divDetailsUpper.className="details_upper";
    divInfoUpper.className="info_upper";
    divDetailsLower.className="details_lower";
    divInfoLower.className="info_lower";
    divMrt.className="mrt";
    divCat.className="cat";		
    //load data
    imgAttractionImg.src=data.images[0];
    divInfoUpper.textContent=data.name;
    divMrt.textContent=data.mrt;
    divCat.textContent=data.category;
    aAttractionUrl.href=`/attraction/${data.id}`;
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
    AttractionsContainerEls[0].insertBefore(aAttractionUrl, AttractionsContainerEls.lastElementChild);
  })	
    loading=false;	
}


//click search bar pop up and other place to close category panel
document.addEventListener('click', function displayCategory(e) {
  const searchBarEl = document.querySelector(".search_bar");
  if (searchBarEl.contains(e.target)) {
    document.querySelector(".search_category").style.display = "flex";		
  }
});
document.addEventListener('click', function hideCategory(e) {
  const searchBarEl = document.querySelector(".search_bar");
    const categoryContainerEl = document.querySelector(".search_category");
    if (!categoryContainerEl.contains(e.target) && !searchBarEl.contains(e.target)) {
      categoryContainerEl.style.display = "none";
    }
});


//IntersectionObserver setting
{
  const options = {
    root: null,
    rootMargin: '10px',
    threshold: 0.5,
  };
  const observer = new IntersectionObserver(scrollLoadMore, options);
  const targetEl = document.querySelector(".copyright_text");
  observer.observe(targetEl);
}

//scroll load more 
function scrollLoadMore(entries) {	
  entries.forEach(async function(entry) {
    if(entry.isIntersecting) {
      //entry.isIntersecting=> true, see the element 
      if (!nextPage || loading || currentPage===nextPage) {
        return;
      }
      currentPage=nextPage;	 //if can fetch data, set current page as next page
      let url ="api/attractions";
      if(!keyword) {
        url= url+`?page=${String(nextPage)}`;
      } else {
        url= url+`?page=${String(nextPage)}&keyword=${keyword}`;
      }	   
      try {
        const response = await fetch(url);
        const data =  await response.json();
        nextPage=data.nextPage;
        processData(data.data);	
      } catch (error) {
        console.log(error);
      }
    }    
  })	
}


//category shadow effect
function addCatShadow() {
  let catItemEls=document.querySelectorAll(".cat_item");
  catItemEls.forEach(function(catItemEl) {
    catItemEl.addEventListener("mouseover", mouseOver);
    catItemEl.addEventListener("mouseout", mouseOut);
  })
  function mouseOver() {
    this.classList.add("cat_item_change_color");
  }
  function mouseOut() {
    this.classList.remove("cat_item_change_color");
  }	
}	
  
//click search button
{
  const searchBtnEl = document.querySelector(".search_btn");
  searchBtnEl.onclick = async function query() { 
    currentPage=0; 	//reset status
    keyword = document.querySelector(".search_bar_text").value;
    await getQueryResult();
  }
}



// search key word
async function getQueryResult() {
  loading=true;
  const attractionsContainerEl = document.querySelector(".attractions_container");
  let url ="api/attractions";
  if(!keyword) {
    url= url+"?page=0";
  } else {
    url= url+`?page=0&keyword=${keyword}`;
  }

  attractionsContainerEl.textContent=""; //remove all elements inside attractions_container 
  try {
    const response = await fetch(url);
    const data = await response.json();
    nextPage=data.nextPage;
    if (data.data.length===0) {
      //create img tag in attractions_container
      const imgNoResultImg = document.createElement("img");
      imgNoResultImg.className="no_result_img";
      imgNoResultImg.src="/static/images/no_results.png";
      attractionsContainerEl.insertBefore(imgNoResultImg, attractionsContainerEl.lastElementChild);
      return;
  
    } else {
      processData(data.data);
    }	
  } catch (error) {
    console.log(error);
  }
}
	