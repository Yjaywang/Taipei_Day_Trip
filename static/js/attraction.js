//fetch attraction id
(async function initialize(){
  let currentUrl=window.location.href.split("/");
  const id=currentUrl.slice(-1)[0];
  const url =`/api/attraction/${String(id)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    createImg(data.data);   //construct html elements
    showSlides(slideIdx);  //pic_slides

    document.title = data.data.name;
    document.querySelector("section").style.display = "flex";		
    document.querySelector(".information_container").style.display = "block";		
    document.querySelector("footer").style.display = "flex";	
    document.querySelector(".main_separator").style.display = "block";	
    
  } catch (error) {
    console.log(error);
  }
})();


// silde function
let slideIdx = 1;
function plusSlide(n) {
  showSlides(slideIdx += n);
}
function currentSlide(n) {
  showSlides(slideIdx = n);
}
function showSlides(n) {
  let slidesEls = document.querySelectorAll(".slides");
  let circleEls = document.querySelectorAll(".circle");

  if (n > slidesEls.length){
    slideIdx = 1
  }    
  if (n < 1) {
    slideIdx = slidesEls.length
  }
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
}

//construct html elements
function createImg(response){
  //description part variables
  const nameEl=document.querySelector(".name");
  const catEl=document.querySelector(".cat");
  const mrtEl=document.querySelector(".mrt");
  const descriptionContentEl=document.querySelector(".description_content");
  const addressContentEl=document.querySelector(".address_content");
  const transportContentEl=document.querySelector(".transport_content");
  const profilePicContainerEls=document.querySelectorAll(".profile_pic_container");
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
  divSlideContainer.className="slide_container";
  divCircleContainer.className="circle_container";
  divSlideBtnContainer.className="slide_btn_container";
  imgPrev.className="prev";
  imgNext.className="next";
  imgPrev.src="/static/images/btn_leftArrow.png";
  imgNext.src="/static/images/btn_rightArrow.png";
  imgPrev.onclick=function(event){
    plusSlide(-1);
  }
  imgNext.onclick=function(event){
    plusSlide(1);
  }
  divSlideBtnContainer.appendChild(imgPrev);
  divSlideBtnContainer.appendChild(imgNext);

  //circles, images and final construction
  for(let i=0;i<response.images.length;i++){
    const divSlide=document.createElement("div");            
    const imgProfile=document.createElement("img");
    const spanCircle=document.createElement("span");
    
    divSlide.classList.add("slides", "fade");
    imgProfile.className="profile_pic";
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
  for(i=0;i<circleEls.length;i++){
    circleEls[i].setAttribute("onclick", `currentSlide(${String(i+1)})`);
  }    
}

//money display
{
  const spanMoney=document.querySelector(".book_form_price_number")
  const formTime = document.bookingForm.time;
  for (let i = 0; i < formTime.length; i++) {
    //only listen to "change to checked" dom
    formTime[i].addEventListener('change', function() {
      spanMoney.textContent=this.value;
    });  
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
    menuStatusEl.textContent="註冊失敗!";
    signUpFormEl.addEventListener("click", function() {
      if(this){
        menuStatusEl.classList.remove("status_error");
      }
    })
  }
}
