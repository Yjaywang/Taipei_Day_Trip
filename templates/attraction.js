



//money display

let span_money=document.querySelector(".book_form_price_number")
    rad = document.bookingForm.time;
for (let i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function() {
        span_money.textContent=this.value;
    });
    //listen to "change to checked" dom
}


//fetch attraction id
const div_slides=document.createElement("div");
    img_profile_pic=document.createElement("img");
    span_circle=document.createElement("span");


async function Initialize(){
    let current_url=window.location.href.split("/");
    let id=current_url.slice(-1)[0];
    let url ="api/attraction/"+String(id);
    
    const response = await fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(data){  
            return data["data"];   	
        }); 		
    
    await createImg(response);
    
        //pic_slides     
    await showSlides(slideIdx);  
    
    document.querySelector("section").style.display = "flex";		
    document.querySelector(".information_container").style.display = "block";		
    document.querySelector("footer").style.display = "flex";	
    document.querySelector(".main_separator").style.display = "block";	
     
} Initialize();


function createImg(response){
    let i=0;
    let div_name=document.querySelector(".name");
    let span_cat=document.querySelector(".cat");
    let span_mrt=document.querySelector(".mrt");
    let div_description_content=document.querySelector(".description_content");
    let div_address_content=document.querySelector(".address_content");
    let div_transport_content=document.querySelector(".transport_content");
    let div_profile_pic_container=document.querySelector(".profile_pic_container");
    div_name.textContent = response["name"];
    span_cat.textContent=response["category"];
    span_mrt.textContent=response["mrt"];
    div_description_content.textContent=response["description"];
    div_address_content.textContent=response["address"];
    div_transport_content.textContent=response["transport"];
    
    const div_slide_container=document.createElement("div");
    const div_circle_container=document.createElement("div");
    const div_slide_btn_container=document.createElement("div");
    const img_prev=document.createElement("img");
    const img_next=document.createElement("img");
    
    div_slide_container.className="slide_container";
    div_circle_container.className="circle_container";
    div_slide_btn_container.className="slide_btn_container";
    img_prev.className="prev";
    img_next.className="next";
    img_prev.src="btn_leftArrow.png";
    img_next.src="btn_rightArrow.png";
    img_prev.onclick=function(event){
        plusSlide(-1);
    }
    img_next.onclick=function(event){
        plusSlide(1);
    }
    
    div_slide_btn_container.appendChild(img_prev);
    div_slide_btn_container.appendChild(img_next);
    
    for(i=0;i<response["images"].length;i++){
        const div_slides=document.createElement("div");            
        const img_profile_pic=document.createElement("img");
        const span_circle=document.createElement("span");
        
        div_slides.classList.add("slides", "fade");
        img_profile_pic.className="profile_pic";
        span_circle.className="circle";
        img_profile_pic.src=response["images"][i];
        span_circle.onclick=function(event){
            currentSlide(i+1);
        }
        
        div_slides.appendChild(img_profile_pic);
        div_slide_container.appendChild(div_slides);
        div_circle_container.appendChild(span_circle);

        if(i+1===response["images"].length){
            console.log(div_profile_pic_container.lastElementChild);
            div_profile_pic_container.insertBefore(div_circle_container, div_profile_pic_container.lastElementChild);
            div_profile_pic_container.insertBefore(div_slide_container, div_profile_pic_container.lastElementChild);
            div_profile_pic_container.insertBefore(div_slide_btn_container, div_profile_pic_container.lastElementChild);
            
        }
    }  
}

// silde function
let slideIdx = 1;

function plusSlide(n) {
    showSlides(slideIdx += n);
}

function currentSlide(n) {
     showSlides(slideIdx = n);
}

function showSlides(n) {
    let i;
    let slides = document.querySelectorAll(".slides");
    console.log(slides);
    let circle = document.querySelectorAll(".circle");
    console.log(slides);
    if (n > slides.length){
        slideIdx = 1
    }    
    if (n < 1) {
        slideIdx = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < circle.length; i++) {
        circle[i].classList.remove("active");
    }
    slides[slideIdx-1].style.display = "block";  
    circle[slideIdx-1].classList.add("active");
}

