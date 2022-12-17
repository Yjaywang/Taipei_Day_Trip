
let model={
  attractionData: null, 
  memberData: null,
  authData: null,
  slideIdx: 1,
  init: async function (){
    let currentUrl=window.location.href.split("/");
    const id=currentUrl.slice(-1)[0];
    const url =`/api/attraction/${String(id)}`;
    try {
      this.attractionData={};
      const response = await fetch(url);
      const data = await response.json();
      this.attractionData=data.data;      

    } catch (error) {
      console.log(error);
    }
  },
  showSlides: function(n) {
    let slidesEls = document.querySelectorAll(".slides");
  
    if (n > slidesEls.length){
      this.slideIdx = 1
    }    
    if (n < 1) {
      this.slideIdx = slidesEls.length
    }      
  },
  plusSlide: function(n) {
    this.showSlides(this.slideIdx += n);
  },
  currentSlide: function(n) {
    this.showSlides(this.slideIdx = n);
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
  }
};

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
  showSlides: function(slideIdx) {
    let slidesEls = document.querySelectorAll(".slides");
    let circleEls = document.querySelectorAll(".circle");
    //deactivate all elements
    slidesEls.forEach(slidesEl => {
      slidesEl.style.display = "none";
    });
    circleEls.forEach(circleEl => {
      circleEl.classList.remove("active");
    })
    //only activate current one
    slidesEls[slideIdx-1].style.display = "block";  
    circleEls[slideIdx-1].classList.add("active");

  },
  render: function(response) {
    //description part variables
    const nameEl=document.querySelector(".name");
    const catEl=document.querySelector(".cat");
    const mrtEl=document.querySelector(".mrt");
    const descriptionContentEl=document.querySelector(".description-content");
    const addressContentEl=document.querySelector(".address-content");
    const transportContentEl=document.querySelector(".transport-content");
    const profilePicContainerEls=document.querySelectorAll(".profile-pic-container");
    // slide part variables
    const divSlideContainer=document.createElement("div");
    const divCircleContainer=document.createElement("div");
    const divSlideBtnContainer=document.createElement("div");
    const imgPrev=document.createElement("img");
    const imgNext=document.createElement("img");
    //load data
    nameEl.textContent = response.name;
    catEl.textContent=response.category;
    mrtEl.textContent=response.mrt;
    descriptionContentEl.textContent=response.description;
    addressContentEl.textContent=response.address;
    transportContentEl.textContent=response.transport;  
    //previous and next slide part
    divSlideContainer.className="slide-container";
    divCircleContainer.className="circle-container";
    divSlideBtnContainer.className="slide-btn-container";
    imgPrev.className="prev";
    imgNext.className="next";
    imgPrev.src="/static/images/btn_leftArrow.png"; 
    imgNext.src="/static/images/btn_rightArrow.png"; 
    imgPrev.onclick=function(event){
      controller.plusSlide(-1);
    }
    imgNext.onclick=function(event){
      controller.plusSlide(1);
    }
    divSlideBtnContainer.appendChild(imgPrev);
    divSlideBtnContainer.appendChild(imgNext);
  
    //circles, images and final construction
    for(let i=0;i<response.images.length;i++){
      const divSlide=document.createElement("div");            
      const imgProfile=document.createElement("img");
      const spanCircle=document.createElement("span");
      
      divSlide.classList.add("slides", "fade");
      imgProfile.className="profile-pic";
      spanCircle.className="circle";
      imgProfile.src=response.images[i];
      // spanCircle.onclick=function(event){
      //     currentSlide(i+1);
      // }
      // can not work, all events are currentSlide(1)
      divSlide.appendChild(imgProfile);
      divSlideContainer.appendChild(divSlide);
      divCircleContainer.appendChild(spanCircle);
  
      //the last one, final construction
      if(i+1===response.images.length){
        profilePicContainerEls[0].insertBefore(divSlideContainer, profilePicContainerEls.lastElementChild);
        profilePicContainerEls[0].insertBefore(divSlideBtnContainer, profilePicContainerEls.lastElementChild);            
        profilePicContainerEls[0].insertBefore(divCircleContainer, profilePicContainerEls.lastElementChild);
      }
    }  
    //add currentSlide event to circles by set attribute.
    const circleEls = document.querySelectorAll(".circle");
    for(let i=0;i<circleEls.length;i++){
      circleEls[i].setAttribute("onclick", `controller.currentSlide(${String(i+1)})`);
    }  

    //money display    
    const spanMoney=document.querySelector(".book-form-price-number")
    const formTime = document.bookingForm.time;
    for (let i = 0; i < formTime.length; i++) {
      //only listen to "change to checked" dom
      formTime[i].addEventListener('change', function() {
        spanMoney.textContent=this.value;
      });  
    }   

    // loading done, display the pic and other component
    document.title = model.attractionData.name;
    document.querySelector("section").style.display = "flex";		
    document.querySelector(".information-container").style.display = "block";		
    document.querySelector("footer").style.display = "flex";	
    document.querySelector(".main-separator").style.display = "block";
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
    view.showSlides(model.slideIdx);
    await model.checkSingIn();
    view.checkSingIn(model.authData);
  }, 
  plusSlide: function(n) {
    model.plusSlide(n);
    view.showSlides(model.slideIdx);
  },
  currentSlide: function(n) {
    model.currentSlide(n);
    view.showSlides(model.slideIdx);
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
  }
};
controller.init();



//pending MVC

{
  const bookingBtnEl=document.querySelector(".booking-btn");
  bookingBtnEl.addEventListener("click", addBooking);
}

async function addBooking() {
  const checkUrl="/api/user/auth";
  try{
    const response = await fetch(checkUrl);
    const data = await response.json();
    if(!data.data){
      login();
    } else{
      const date =this.parentElement.elements.date.value;
      const tempTimeEls =this.parentElement.elements.time;
      let time="";
      tempTimeEls.forEach(tempTimeEl => {
        if(tempTimeEl.checked){
          if(tempTimeEl.labels[0].textContent=="上半天"){
            time="morning";
          }
          else if(tempTimeEl.labels[0].textContent=="下半天"){
            time="afternoon";
          }
          
        }
      });
      const price=this.parentElement.elements.time.value;
      const attractionID=document.URL.split("/").slice(-1)[0];
    
      const url="/api/booking";
      const header={
        "Content-Type": "application/json"
      }
      const body={
        "attractionId": attractionID,
        "date": date,
        "time": time,
        "price":price,
      }
      try {
        const response = await fetch(url, {
          method:"POST",
          headers:header,
          body:JSON.stringify(body),
        });
        const data = await response.json();
        if(data.error){
          const statusMemoEl=document.querySelector(".status-memo");
          const bookingFormEl=document.querySelector(".booking-form");
          statusMemoEl.classList.add("status-error");
          bookingFormEl.addEventListener("click", function() {
            statusMemoEl.classList.remove("status-error");
          })
          if(data.message==="duplicated booking"){
            statusMemoEl.textContent="重複預定行程，請重選";
          }
          else if (data.message==="empty input"){
            statusMemoEl.textContent="日期、時間不可空白";
          }
        }
        else if(data.ok){
          location.href="/booking";
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }  
}



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
