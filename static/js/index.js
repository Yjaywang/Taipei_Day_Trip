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
	




//close menu

{
  const triggerCloseEls=document.querySelectorAll(".trigger_close_menu");
  triggerCloseEls.forEach(triggerCloseEl => {
    triggerCloseEl.addEventListener("click", () => {
      document.querySelector(".sign_menu_backgroung").style.display = "none";
      document.querySelector(".signin_form").style.display = "none";
      document.querySelector(".signup_form").style.display = "none";
    });
  });
  
}

//show sign in menu
{
  const showSignInEls=document.querySelectorAll(".show_sign_in");
  showSignInEls.forEach(showSignInEl =>{
    showSignInEl.addEventListener("click", ()=> {
      document.querySelector(".sign_menu_backgroung").style.display="block";
      document.querySelector(".signin_form").style.display="block";
      document.querySelector(".signup_form").style.display="none";
    });    
  });
}


//show sign up menu
{
  const showSignUpEls=document.querySelectorAll(".show_sign_up");
  showSignUpEls.forEach(showSignUpEl =>{
    showSignUpEl.addEventListener("click", ()=> {
      document.querySelector(".sign_menu_backgroung").style.display="block";
      document.querySelector(".signin_form").style.display="none";
      document.querySelector(".signup_form").style.display="block";
    });
  });
}




//submit signin form
async function sendSignIn(){
  const email=document.querySelector("#sign_in_email").value;
  const password=document.querySelector("#sign_in_password").value;
  console.log(email);
  console.log(password);
  const body={
    "email":email,
    "password":password,
  }
  const header={
    "Content-Type": "application/json"
  }
  let url = "/api/user/auth"
  const response = await fetch(url, {
    method: "PUT",
    headers:header,
    body:JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data.message);
  if(data.ok){
    location.reload();
  } else {
    const signInFormEl = document.querySelector(".signin_form");
    const menuStatusEl=document.querySelector("#signin_menu_status");
    menuStatusEl.classList.add("status_error");

    if(data.message==="wrong password, try again!"){
      menuStatusEl.textContent="密碼錯誤，請再試一次!";
      signInFormEl.addEventListener("click", function() {
        if(this){
          menuStatusEl.classList.remove("status_error");
        }
      })
    }
    else if(data.message==="email not existed"){
      menuStatusEl.textContent="無此email，請再重試!";
      signInFormEl.addEventListener("click", function() {
        if(this){
          menuStatusEl.classList.remove("status_error");
        }
      })
    }
  }
}


//sign out
async function signOut(){
  const url="/api/user/auth"
  const response = await fetch(url,{
    method:"DELETE",
  });
  const data = await response.json();
  console.log(data);
  if(data.ok){
    location.reload();
  }
}

//check login status
(async function checkSingIn(){
  const url="/api/user/auth";
  const response = await fetch(url);
  const data = await response.json();
  if(!data.error){
    document.querySelector(".nav_signin").style.display="none";

    const signOutEl = document.querySelector(".nav_signout");
    signOutEl.style.display="block";
    signOutEl.addEventListener("click", ()=> {
      signOut();
    })   
  }
})();


//submit signup form
async function sendSignUp(){
  const name=document.querySelector("#sign_up_name").value;
  const email=document.querySelector("#sign_up_email").value;
  const password=document.querySelector("#sign_up_password").value;
  const body={
    "username":name,
    "email":email,
    "password":password,
  }
  
  const header={
    "Content-Type": "application/json"
  }
  let url = "/api/user"
  const response = await fetch(url, {
    method: "POST",
    headers:header,
    body:JSON.stringify(body),
  });
  const data = await response.json();
  const menuStatusEl=document.querySelector("#signup_menu_status");
  const signUpFormEl=document.querySelector(".signup_form");
  if(data.ok){
    menuStatusEl.classList.add("status_ok");
    menuStatusEl.textContent="註冊成功!";
    signUpFormEl.addEventListener("click", function() {
      if(this){
        menuStatusEl.classList.remove("status_ok");
      }
    })
  } else {
    menuStatusEl.classList.add("status_error");
    menuStatusEl.textContent="此email已被人使用!";
    signUpFormEl.addEventListener("click", function() {
      if(this){
        menuStatusEl.classList.remove("status_error");
      }
    })
  }
}