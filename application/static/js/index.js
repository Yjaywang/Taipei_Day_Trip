let model={
  keyword: null,
  nextPage: null,
  loading: true, 
  currentPage: 0,
  attractionData: null,
  categoryData: null,
  init: async function() {
    //main page init
    this.loading=true;
    this.attractionData=null;
    const url="api/attractions?page=0";	
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.attractionData=data.data;
      this.nextPage=data.nextPage;
      
      document.querySelector("footer").style.display = "flex";		
      
    } catch (error) {
      console.log(error);
    } 	
  }, 
  category: async function() {
    const url="api/categories";    
    this.category={};
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.categoryData=data;

    } catch (error) {
      console.log(error);
    }
  },
  search: async function() {
    this.loading=true;
    this.attractionData=null;
    const attractionsContainerEl = document.querySelector(".attractions-container");
    let url ="api/attractions";
    if(!this.keyword) {
      url= url+"?page=0";
    } else {
      url= url+`?page=0&keyword=${this.keyword}`;
    }
    attractionsContainerEl.textContent=""; //remove all elements inside attractions-container 
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.nextPage=data.nextPage;
      this.attractionData=data.data;

    } catch (error) {
      console.log(error);
    }
  },
  sendSignIn: async function() {
    const email=document.querySelector("#sign-in-email").value;
    const password=document.querySelector("#sign-in-password").value;
    this.memberData={};
    
    if(!email || !password){
      this.memberData={
        "error": true,
        "message": "input empty values"
      };
    } else {
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
      this.memberData=data
    }
  },
  sendSignUp: async function() {
    const name=document.querySelector("#sign-up-name").value;
    const email=document.querySelector("#sign-up-email").value;
    const password=document.querySelector("#sign-up-password").value;

    if(!name || !email || !password){
      this.memberData={
        "error": true,
        "message": "input empty values"
      };
    } else {
      const body={
        "name":name,
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
      this.memberData=data;
    } 
  },
  signOut: async function() {
    this.authData={};
    const url="/api/user/auth"
    const response = await fetch(url,{
      method:"DELETE",
    });
    const data = await response.json();
    this.authData=data;   
  },
  checkSingIn: async function() {
    this.authData={};
    const url="/api/user/auth";
    const response = await fetch(url);
    const data = await response.json();
    this.authData=data;
  }, 
  scrollLoadMore: function(entries) {
    entries.forEach(async function(entry) {
      if(entry.isIntersecting) {
        //entry.isIntersecting=> true, see the element 
        if (!model.nextPage || model.loading || model.currentPage===model.nextPage) {
          return ;
        }
        
        model.currentPage=model.nextPage;	 //if can fetch data, set current page as next page
        let url ="api/attractions";
        if(!model.keyword) {
          url= url+`?page=${String(model.nextPage)}`;
        } else {
          url= url+`?page=${String(model.nextPage)}&keyword=${model.keyword}`;
        }	   
        try {
          const response = await fetch(url);
          const data =  await response.json();
          model.nextPage=data.nextPage;
          view.render(data.data);

        } catch (error) {
          console.log(error);
        }
      }    
    })	
  }
}

let view={
  checkSingIn: function(data) {
    //auth success action
    if(data.data){
      document.querySelector(".nav-signin").style.display="none";
  
      const signOutEl = document.querySelector(".nav-signout");
      signOutEl.style.display="block";
      signOutEl.addEventListener("click", ()=> {
        controller.signOut();
      })   
    }
  },
  signOut: function(data) {
    if(data.ok){
      location.reload();
    }
  },
  sendSignUp: function(data) {
    const menuStatusEl=document.querySelector("#signup-menu-status");
    const signUpFormEl=document.querySelector(".signup-form");

    if(data.ok){
      menuStatusEl.classList.add("status-ok");
      menuStatusEl.textContent="註冊成功!";
      signUpFormEl.addEventListener("mouseup", function() {
        menuStatusEl.classList.remove("status-ok");
      })
    } else {
      menuStatusEl.classList.add("status-error");
      signUpFormEl.addEventListener("mouseup", function() {
        menuStatusEl.classList.remove("status-error");
      })
      if(data.message==="email existed"){
        menuStatusEl.textContent="此email已被人使用!";
      }
      else if(data.message==="input empty values"){
        menuStatusEl.textContent="輸入欄位不可空白!";
      }
      else if(data.message==="error email format"){
        menuStatusEl.textContent="請輸入正確email格式 (ex: xxxx@xxx.xxx)";
      }
      else if(data.message==="error password format"){
        menuStatusEl.textContent="請輸入正確密碼格式(至少8個英數字元，包含至少1個大寫)";
      }
    }
  },
  sendSignIn: function(data) {
    const signInFormEl = document.querySelector(".signin-form");
    const menuStatusEl=document.querySelector("#signin-menu-status");
    if(data.ok){
      location.reload();
    } else {
      menuStatusEl.classList.add("status-error");
      signInFormEl.addEventListener("mousedown", function() {
        menuStatusEl.classList.remove("status-error");
      })
      if(data.message==="wrong password, try again!"){
        menuStatusEl.textContent="密碼錯誤，請再試一次!";
      }
      else if(data.message==="email not existed"){
        menuStatusEl.textContent="無此email，請再重試!";
      }
      else if(data.message==="input empty values"){
        menuStatusEl.textContent="輸入欄位不可空白!";
      }
    }
  },
  search: function(response) {
    const attractionsContainerEl = document.querySelector(".attractions-container");
    if (response.length===0) {
      //create img tag in attractions-container
      const imgNoResultImg = document.createElement("img");
      imgNoResultImg.className="no-result-img";
      imgNoResultImg.src="/static/images/no_results.png"; 
      attractionsContainerEl.insertBefore(imgNoResultImg, attractionsContainerEl.lastElementChild);
      return;
  
    } else {
      this.render(response);
    }	
  },
  addCatShadow: function() {
    let catItemEls=document.querySelectorAll(".cat-item");
    catItemEls.forEach(function(catItemEl) {
      catItemEl.addEventListener("mouseover", mouseOver);
      catItemEl.addEventListener("mouseout", mouseOut);
    })
    function mouseOver() {
      this.classList.add("cat-item-change-color");
    }
    function mouseOut() {
      this.classList.remove("cat-item-change-color");
    }
  },
  category: function(catData) {
    catData.data.forEach(function(category) {
      const searchBarTextEl = document.querySelector(".search-bar-text");
      const searchCategoryEls=document.querySelectorAll(".search-category");
      const divCatItem=document.createElement("div");
      divCatItem.className="cat-item";
      divCatItem.textContent=category;
      
      divCatItem.addEventListener("click", function (event) {
        searchBarTextEl.value=event.srcElement.textContent;
        searchCategoryEls[0].style.display = "none";
      });
      searchCategoryEls[0].insertBefore(divCatItem, searchCategoryEls.lastElementChild);
      
    });	

    //click search bar pop up and other place to close category panel
    document.addEventListener('click', function (e) {
      const searchBarEl = document.querySelector(".search-bar");
      if (searchBarEl.contains(e.target)) {
        document.querySelector(".search-category").style.display = "flex";		
      }
    });
    document.addEventListener('click', function (e) {
      const searchBarEl = document.querySelector(".search-bar");
        const categoryContainerEl = document.querySelector(".search-category");
        if (!categoryContainerEl.contains(e.target) && !searchBarEl.contains(e.target)) {
          categoryContainerEl.style.display = "none";
        }
    });
    
  },
  render: function(response) {
    model.loading=true;	
    if (response===null){
      return;
    }
    response.forEach(function(data) {
      //variables
      const aAttractionUrl=document.createElement("a");
      const divAttractionGroup=document.createElement("div");
      const divAttractionImgBox=document.createElement("div");
      const imgAttractionImg=document.createElement("img");
      // const imgAttractionImg=new Image();
      const divDetailsUpper=document.createElement("div");
      const divInfoUpper=document.createElement("div");
      const divDetailsLower=document.createElement("div");
      const divInfoLower=document.createElement("div");
      const divMrt=document.createElement("div");
      const divCat=document.createElement("div");
      const AttractionsContainerEls=document.querySelectorAll(".attractions-container"); 
      //.attractions-container use querySelector to append will have sequence problem, keep use querySelectorAll or getElementByClassName
  
      //add class name
      aAttractionUrl.className="attraction-url";
      divAttractionGroup.className="attraction-group";
      divAttractionImgBox.className="attraction-img-box";
      imgAttractionImg.className="attraction-img";
      divDetailsUpper.className="details-upper";
      divInfoUpper.className="info-upper";
      divDetailsLower.className="details-lower";
      divInfoLower.className="info-lower";
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
    //add click search button function
    const searchBtnEl = document.querySelector(".search-btn");
    searchBtnEl.onclick = function query() { 
      model.currentPage=0; 	//reset status
      model.keyword=document.querySelector(".search-bar-text").value;
      controller.search();
    }  

    model.loading=false;	
    model.attractionData=null;
  },
  signMenu: function() {
    //close menu
    const triggerCloseEls=document.querySelectorAll(".trigger-close-menu");
    triggerCloseEls.forEach(triggerCloseEl => {
      triggerCloseEl.addEventListener("click", () => {
        document.querySelector(".sign-menu-backgroung").style.display = "none";
        document.querySelector(".signin-form").style.display = "none";
        document.querySelector(".signup-form").style.display = "none";
      });
    });


    //show sign in menu
    const showSignInEls=document.querySelectorAll(".show-sign-in");
    showSignInEls.forEach(showSignInEl =>{
      showSignInEl.addEventListener("click", ()=> {
        document.querySelector(".sign-menu-backgroung").style.display="block";
        document.querySelector(".signin-form").style.display="block";
        document.querySelector(".signup-form").style.display="none";
      });    
    });
    //show sign up menu
    const showSignUpEls=document.querySelectorAll(".show-sign-up");
    showSignUpEls.forEach(showSignUpEl =>{
      showSignUpEl.addEventListener("click", ()=> {
        document.querySelector(".sign-menu-backgroung").style.display="block";
        document.querySelector(".signin-form").style.display="none";
        document.querySelector(".signup-form").style.display="block";
      });
    });
  }
}

let controller={
  init: async function() {
    await model.init();
    view.render(model.attractionData);
    view.signMenu();
    await model.category();
    view.category(model.categoryData);
    view.addCatShadow();
    await model.checkSingIn();
    view.checkSingIn(model.authData);
  }, 
  search: async function() {
    await model.search();
    view.search(model.attractionData);
  },
  sendSignIn: async function() {
    await model.sendSignIn();
    view.sendSignIn(model.memberData);
  },
  sendSignUp: async function() {
    await model.sendSignUp();
    view.sendSignUp(model.memberData);
  }, 
  signOut: async function() {
    await model.signOut();
    view.signOut(model.authData);
  },
  scrollLoadMore: function(entries) {
    model.scrollLoadMore(entries);
  }
}


controller.init();

//IntersectionObserver setting
{
  const options = {
    root: null,
    rootMargin: '10px',
    threshold: 0.5,
  };
  const observer = new IntersectionObserver(controller.scrollLoadMore, options);
  const targetEl = document.querySelector(".copyright-block");
  observer.observe(targetEl);
}


//pending MVC
//booking page
const navSchedule = document.querySelector(".nav-schedule");
navSchedule.addEventListener("click", bookingPage);
async function bookingPage() {
  
  const checkUrl="/api/user/auth";
  try {
    const response = await fetch(checkUrl);
    const data = await response.json();

    if(!data.data){
      //if data:null
      login();
    }
    else{
      location.href="/booking";
    }


  } catch (error) {
    console.log(error);
  }
}

async function login() {
  document.querySelector(".sign-menu-backgroung").style.display="block";
  document.querySelector(".signin-form").style.display="block";
  document.querySelector(".signup-form").style.display="none";
}


// show booking counts, need to redesign UI
// (async function checkBookingCount() {
//   const url="/api/booking";
//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     console.log(data.data.length);
//     document.querySelector(".nav-schedule").textContent=`預定行程(${data.data.length})`

//   } catch (error) {
//     console.log(error);
//   }
// })();
