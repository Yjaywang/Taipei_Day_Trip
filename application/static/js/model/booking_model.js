
let model={
  bookingData:null,
  deleteStatus:null,
  init: async function() {
    const url= "/api/booking"
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.bookingData=data.data
    } catch (error) {
      console.log(error);
    }
  },
  deleteBooking: async function() {
    document.addEventListener("click", async function(e) {
      const attractionID=e.target.parentElement.querySelector(".booking-attraction-link").href.split("/").slice(-1)[0];
      const date=e.target.parentElement.querySelector(".booking-date").childNodes[1].textContent;
      const tempTime=e.target.parentElement.querySelector(".booking-time").childNodes[1].textContent;
      let time="";
      if (tempTime==="早上 9 點到下午 4 點"){
        time="morning";
      }
      else if (tempTime==="下午 1 點到晚上 9 點"){
        time="afternoon";
      }
      const url="/api/booking"
      const header={
        "Content-Type": "application/json"
      }
      const body={
        "attractionId": attractionID,
        "date": date,
        "time": time,
      }
      try {
        const response = await fetch(url, {
          method:"DELETE",
          headers:header,
          body:JSON.stringify(body),
        });
        const data = await response.json();
        this.deleteStatus=data;        

      } catch (error) {
        console.log(error);
      }
    })   
  }
};

export default model;