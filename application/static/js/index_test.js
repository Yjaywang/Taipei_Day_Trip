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
    const attractionsContainerEl = document.querySelector(".attractions_container");
    let url ="api/attractions";
    if(!this.keyword) {
      url= url+"?page=0";
    } else {
      url= url+`?page=0&keyword=${this.keyword}`;
    }
    attractionsContainerEl.textContent=""; //remove all elements inside attractions_container 
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
    const email=document.querySelector("#sign_in_email").value;
    const password=document.querySelector("#sign_in_password").value;
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
    const name=document.querySelector("#sign_up_name").value;
    const email=document.querySelector("#sign_up_email").value;
    const password=document.querySelector("#sign_up_password").value;

    if(!name || !email || !password){
      this.memberData={
        "error": true,
        "message": "input empty values"
      };
    } else {
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
        console.log(entry.isIntersecting);
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
    if(!data){
      document.querySelector(".nav_signin").style.display="none";
  
      const signOutEl = document.querySelector(".nav_signout");
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
    const menuStatusEl=document.querySelector("#signup_menu_status");
    const signUpFormEl=document.querySelector(".signup_form");

    if(data.ok){
      menuStatusEl.classList.add("status_ok");
      menuStatusEl.textContent="註冊成功!";
      signUpFormEl.addEventListener("mouseup", function() {
        menuStatusEl.classList.remove("status_ok");
      })
    } else {
      menuStatusEl.classList.add("status_error");
      signUpFormEl.addEventListener("mouseup", function() {
        menuStatusEl.classList.remove("status_error");
      })
      if(data.message==="email existed"){
        menuStatusEl.textContent="此email已被人使用!";
      }
      else if(data.message==="input empty values"){
        menuStatusEl.textContent="輸入欄位不可空白!";
      }
    }
  },
  sendSignIn: function(data) {
    const signInFormEl = document.querySelector(".signin_form");
    const menuStatusEl=document.querySelector("#signin_menu_status");

    if(data.ok){
      location.reload();
    } else {
      menuStatusEl.classList.add("status_error");
      signInFormEl.addEventListener("mousedown", function() {
        menuStatusEl.classList.remove("status_error");
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
    const attractionsContainerEl = document.querySelector(".attractions_container");
    if (response.length===0) {
      //create img tag in attractions_container
      const imgNoResultImg = document.createElement("img");
      imgNoResultImg.className="no_result_img";
      imgNoResultImg.src="/static/images/no_results.png";
      attractionsContainerEl.insertBefore(imgNoResultImg, attractionsContainerEl.lastElementChild);
      return;
  
    } else {
      this.render(response);
    }	
  },
  addCatShadow: function() {
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
  },
  category: function(catData) {
    catData.data.forEach(function(category) {
      const searchBarTextEl = document.querySelector(".search_bar_text");
      const searchCategoryEls=document.querySelectorAll(".search_category");
      const divCatItem=document.createElement("div");
      divCatItem.className="cat_item";
      divCatItem.textContent=category;
      
      divCatItem.addEventListener("click", function (event) {
        searchBarTextEl.value=event.srcElement.textContent;
        searchCategoryEls[0].style.display = "none";
      });
      searchCategoryEls[0].insertBefore(divCatItem, searchCategoryEls.lastElementChild);
      
    });	

    //click search bar pop up and other place to close category panel
    document.addEventListener('click', function (e) {
      const searchBarEl = document.querySelector(".search_bar");
      if (searchBarEl.contains(e.target)) {
        document.querySelector(".search_category").style.display = "flex";		
      }
    });
    document.addEventListener('click', function (e) {
      const searchBarEl = document.querySelector(".search_bar");
        const categoryContainerEl = document.querySelector(".search_category");
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
    //add click search button function
    const searchBtnEl = document.querySelector(".search_btn");
    searchBtnEl.onclick = function query() { 
      model.currentPage=0; 	//reset status
      model.keyword=document.querySelector(".search_bar_text").value;
      controller.search();
    }  

    model.loading=false;	
    model.attractionData=null;
  },
  signMenu: function() {
    //close menu
    const triggerCloseEls=document.querySelectorAll(".trigger_close_menu");
    triggerCloseEls.forEach(triggerCloseEl => {
      triggerCloseEl.addEventListener("click", () => {
        document.querySelector(".sign_menu_backgroung").style.display = "none";
        document.querySelector(".signin_form").style.display = "none";
        document.querySelector(".signup_form").style.display = "none";
      });
    });


    //show sign in menu
    const showSignInEls=document.querySelectorAll(".show_sign_in");
    showSignInEls.forEach(showSignInEl =>{
      showSignInEl.addEventListener("click", ()=> {
        document.querySelector(".sign_menu_backgroung").style.display="block";
        document.querySelector(".signin_form").style.display="block";
        document.querySelector(".signup_form").style.display="none";
      });    
    });
    //show sign up menu
    const showSignUpEls=document.querySelectorAll(".show_sign_up");
    showSignUpEls.forEach(showSignUpEl =>{
      showSignUpEl.addEventListener("click", ()=> {
        document.querySelector(".sign_menu_backgroung").style.display="block";
        document.querySelector(".signin_form").style.display="none";
        document.querySelector(".signup_form").style.display="block";
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
  const targetEl = document.querySelector(".copyright_text");
  observer.observe(targetEl);
}
