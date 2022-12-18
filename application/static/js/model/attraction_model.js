
let model={
  attractionData: null, 
  slideIdx: 1,
  bookingData:null,
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
  addBooking: async function () {
    const bookingFormEl=document.querySelector(".booking-form")
    const date =bookingFormEl.elements.date.value;
    const tempTimeEls =bookingFormEl.elements.time;
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
    const price=bookingFormEl.elements.time.value;
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
      this.bookingData=data;    
    } catch (error) {
      console.log(error);
    }
  }
};


export default model;