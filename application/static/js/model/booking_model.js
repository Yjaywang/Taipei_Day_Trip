import TPDirect from "../tappay_config.js";
import baseModel from "../model/base_model.js";
let model={
  bookingData:null,
  deleteStatus:null,
  orderData:null,
  prime:null,
  primeStatus:false,
  init: async function() {
    const url= "/api/booking"
    const header={
      "X-CSRF-TOKEN": baseModel.getCookie("csrf_access_token")
    }
    try {
      const response = await fetch(url, {
        method:"GET",
        headers:header
      });
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
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": baseModel.getCookie("csrf_access_token")
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
  },   
  submitBooking: function submitBooking(event) {
    const errorMsg=document.querySelector(".error-msg");
    const bookingContainer=document.querySelector(".booking-container");
    bookingContainer.addEventListener("mouseup", function() {
      errorMsg.classList.remove("show-error");
    })
    event.preventDefault()
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
      errorMsg.textContent="信用卡資料輸入不正確或空白";
      errorMsg.classList.add("show-error");
      return
    }
  
    // Get prime
    TPDirect.card.getPrime(async function(result) {
      if (result.status !== 0) {
        errorMsg.textContent="信用卡資料輸入不正確或空白";
        errorMsg.classList.add("show-error");
        return
      }
      const prime=result.card.prime;
      const bookingSubContainerEls= document.querySelectorAll(".booking-info-sub-container");
      const userContainerEl=document.querySelector(".user-info-container");
      const total_money=document.querySelector("#money").textContent;
      const userName=userContainerEl.querySelector(".user-name input").value;
      const userEmail=userContainerEl.querySelector(".user-email input").value;
      const userPhone=userContainerEl.querySelector(".user-phone input").value;
      let trip=[];
      const contact={
        name:userName,
        email:userEmail,
        phone:userPhone,
      }
      if(!userName || !userEmail || !userPhone){
        errorMsg.textContent="用戶資料輸入不正確或空白";
        errorMsg.classList.add("show-error");
        return
      }  
      
      bookingSubContainerEls.forEach(bookingSubContainerEl => {
        const attractionID=parseInt(bookingSubContainerEl.querySelector("a").href.split("/").slice(-1));
        const attractionName=bookingSubContainerEl.querySelector(".attraction").textContent;
        const address=bookingSubContainerEl.querySelector(".booking-address-content").textContent;
        const image=bookingSubContainerEl.querySelector(".booking-img").src;
        const date=bookingSubContainerEl.querySelector(".booking-date-content").textContent;
        const temp_time=bookingSubContainerEl.querySelector(".booking-time-content").textContent;
        let time="";
        if(temp_time==="早上 9 點到下午 4 點") {
          time="morning";
        }
        else if(temp_time==="下午 1 點到晚上 9 點") {
          time="afternoon";
        }
        let attraction={
          id:attractionID,
          name:attractionName,
          address:address,
          image:image,
        };
        let tempTrip={
          attraction:attraction,
          date:date,
          time:time,
        };
        trip.push(tempTrip);
      }); 
      const order={
        price:total_money,
        trip:trip,
        contact:contact,
      }
      const body={
        prime:prime,
        order:order,
      }
      
      const header={
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": baseModel.getCookie("csrf_access_token")
      }
      let url = "/api/orders"
      const response = await fetch(url, {
        method: "POST",
        headers:header,
        body:JSON.stringify(body),
      });
      const data = await response.json();
      if (data.error){
        //do something???
        return 
      }
  
      const orderNumber=data.data.number;
      this.orderData=data;
      location.href=`/thankyou?number=${orderNumber}`; 
    
      // send prime to your server, to pay with Pay by Prime API .
      // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    }) 
  },
};

export default model;