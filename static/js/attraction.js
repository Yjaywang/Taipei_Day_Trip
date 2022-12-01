//fetch attraction id
(async function initialize(){
  let currentUrl=window.location.href.split("/");
  const id=currentUrl.slice(-1)[0];
  const url =`/api/attraction/${String(id)}`;
  
  const response = await fetch(url)
      .then(function(response){
          return response.json();
      })
      .then(function(data){  
          return data["data"];   	
      }); 		
  createImg(response);   //construct html elements
  showSlides(slideIdx);  //pic_slides
  
  document.querySelector("section").style.display = "flex";		
  document.querySelector(".information_container").style.display = "block";		
  document.querySelector("footer").style.display = "flex";	
  document.querySelector(".main_separator").style.display = "block";	     
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
  const ProfilePicContainerEls=document.querySelectorAll(".profile_pic_container");
  // slide part variables
  const divSlideContainer=document.createElement("div");
  const divCircleContainer=document.createElement("div");
  const divSlideBtnContainer=document.createElement("div");
  const imgPrev=document.createElement("img");
  const imgNext=document.createElement("img");
  //load data
  nameEl.textContent = response["name"];
  catEl.textContent=response["category"];
  mrtEl.textContent=response["mrt"];
  descriptionContentEl.textContent=response["description"];
  addressContentEl.textContent=response["address"];
  transportContentEl.textContent=response["transport"];  
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
  for(let i=0;i<response["images"].length;i++){
    const divSlide=document.createElement("div");            
    const imgProfile=document.createElement("img");
    const spanCircle=document.createElement("span");
    
    divSlide.classList.add("slides", "fade");
    imgProfile.className="profile_pic";
    spanCircle.className="circle";
    imgProfile.src=response["images"][i];
    // spanCircle.onclick=function(event){
    //     currentSlide(i+1);
    // }
    // can not work, all events are currentSlide(1)
    divSlide.appendChild(imgProfile);
    divSlideContainer.appendChild(divSlide);
    divCircleContainer.appendChild(spanCircle);

    //the last one, final construction
    if(i+1===response["images"].length){
      ProfilePicContainerEls[0].insertBefore(divSlideContainer, ProfilePicContainerEls.lastElementChild);
      ProfilePicContainerEls[0].insertBefore(divSlideBtnContainer, ProfilePicContainerEls.lastElementChild);            
      ProfilePicContainerEls[0].insertBefore(divCircleContainer, ProfilePicContainerEls.lastElementChild);
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








