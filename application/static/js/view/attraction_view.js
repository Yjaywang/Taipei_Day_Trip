import model from "../model/attraction_model.js";
import controller from "../controller/attraction_controller.js";

let view={
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
      formTime[i].addEventListener("change", function() {
        spanMoney.textContent=this.value;
      });  
    }   

    // loading done, display the pic and other component
    document.title = model.attractionData.name;
    document.querySelector("section").style.display = "flex";		
    document.querySelector(".information-container").style.display = "block";		
    document.querySelector("footer").style.display = "flex";	
    document.querySelector(".main-separator").style.display = "block";


    //booking btn listener
    const bookingBtnEl=document.querySelector(".booking-btn");
    bookingBtnEl.addEventListener("click", controller.addBooking);
  },   
  addBooking: function(data) {
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
  },

}

export default view;