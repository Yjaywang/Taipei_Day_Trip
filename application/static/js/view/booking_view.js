import controller from "../controller/booking_controller.js";
import memberModel from "../model/member_model.js";
let view={
  render: function(response) {
    response.forEach(data => {
      const bookingInfoContainerEls=document.querySelectorAll(".booking-info-container");
      const divBookingInfoSubContainer=document.createElement("div");
      const imgBooking=document.createElement("img");
      const divBookingItemContainer=document.createElement("div");
      const aBookingAttractionLink=document.createElement("a");
      const divBookingAttractionTitle=document.createElement("div");
      const spanAttractionPrefix=document.createElement("span");
      const spanAttraction=document.createElement("span");
      const divBookingDate=document.createElement("div");
      const spanDateContent=document.createElement("span");
      const divBookingTime=document.createElement("div");
      const spanTimeContent=document.createElement("span");
      const divBookingFee=document.createElement("div");
      const spanFeeContentPrefix=document.createElement("span");
      const spanFeeContent=document.createElement("span");
      const spanFeeContentPostfix=document.createElement("span");
      const divBookingAddress=document.createElement("div");
      const spanAddressContent=document.createElement("span");
      const imgDeleteIcon=document.createElement("img");
  
      divBookingInfoSubContainer.className="booking-info-sub-container";
      imgBooking.className="booking-img";
      divBookingItemContainer.className="booking-item-container";
      aBookingAttractionLink.className="booking-attraction-link";
      divBookingAttractionTitle.className="booking-attraction-title";
      spanAttraction.className="attraction";
      divBookingDate.className="booking-date";
      spanDateContent.className="booking-date-content";
      divBookingTime.className="booking-time";
      spanTimeContent.className="booking-time-content";
      divBookingFee.className="booking-fee";
      spanFeeContent.className="booking-fee-content";
      divBookingAddress.className="booking-address";
      spanAddressContent.className="booking-address-content";
      imgDeleteIcon.className="delete-icon";
  
      spanAttractionPrefix.textContent="台北一日遊：";
      divBookingDate.textContent="日期：";
      divBookingTime.textContent="時間：";
      divBookingFee.textContent="費用：";
      spanFeeContentPrefix.textContent="新台幣 ";
      spanFeeContentPostfix.textContent=" 元";
      divBookingAddress.textContent="地點："
      imgDeleteIcon.src="/static/images/icon_delete.png"; 
      imgBooking.src=data.attraction.image;
  
      spanAttraction.textContent=data.attraction.name;
      spanDateContent.textContent=data.date;
      if(data.time==="morning"){
        spanTimeContent.textContent="早上 9 點到下午 4 點";
      }
      else if(data.time==="afternoon"){
        spanTimeContent.textContent="下午 1 點到晚上 9 點";
      }
      spanFeeContent.textContent=data.price;
      spanAddressContent.textContent=data.attraction.address;
      aBookingAttractionLink.href=`/attraction/${data.attraction.id}`
  
      imgDeleteIcon.addEventListener("click", controller.deleteBooking)
  
  
      divBookingAttractionTitle.appendChild(spanAttractionPrefix);
      divBookingAttractionTitle.appendChild(spanAttraction);
  
      aBookingAttractionLink.appendChild(divBookingAttractionTitle);    
      divBookingDate.appendChild(spanDateContent);
      divBookingTime.appendChild(spanTimeContent);
      divBookingFee.appendChild(spanFeeContentPrefix);
      divBookingFee.appendChild(spanFeeContent);
      divBookingFee.appendChild(spanFeeContentPostfix);
      divBookingAddress.appendChild(spanAddressContent);
  
      divBookingItemContainer.appendChild(aBookingAttractionLink);
      divBookingItemContainer.appendChild(divBookingDate);
      divBookingItemContainer.appendChild(divBookingTime);
      divBookingItemContainer.appendChild(divBookingFee);
      divBookingItemContainer.appendChild(divBookingAddress);
      divBookingItemContainer.appendChild(imgDeleteIcon);
  
      divBookingInfoSubContainer.appendChild(imgBooking);
      divBookingInfoSubContainer.appendChild(divBookingItemContainer);
  
      bookingInfoContainerEls[0].insertBefore(divBookingInfoSubContainer, bookingInfoContainerEls.lastElementChild);
    });
  },
  totalMoney:function () {
    const bookingFeeContentEls =document.querySelectorAll(".booking-fee-content");
    const money=document.querySelector("#money");
    let temp=0;
  
    bookingFeeContentEls.forEach(bookingFeeContentEl => {
      temp+=parseInt(bookingFeeContentEl.textContent);    
    });
    money.textContent=temp;
    document.querySelector("footer").style.display = "flex";
  },
  noBooking: function() {
    const bookingSeparatorEls = document.querySelectorAll(".booking-separator");
    bookingSeparatorEls.forEach(bookingSeparatorEl => {
      bookingSeparatorEl.remove();
    });
    document.querySelector(".user-info-container").remove();
    document.querySelector(".card-container").remove();
    document.querySelector(".summary-container").remove();
    document.querySelector(".no-schedule-img").style.display = "block";
  },
  username: function(authData) {
    const user = document.querySelector("#user");
    user.textContent=authData.data.name;
  },
  deleteBooking: function() {
    document.addEventListener("click", async function(e) {
      let container=e.target.parentElement.parentElement;
      container.remove();
      memberModel.bookingCounts=memberModel.bookingCounts-1;
      if (memberModel.bookingCounts===0){
        location.reload();
      }
    })
  },
  addEye: function() {
    //add eye
    document.querySelector(".hidden-password").addEventListener("click", function(e) {
      if(e.target.classList.contains("hidden-password")){
        e.target.classList.remove("hidden-password");
        e.target.classList.add("shown-password");
        e.target.src="/static/images/eye.png";
        e.target.parentElement.querySelector("input").type="text";
      } else {
        e.target.classList.remove("shown-password");
        e.target.classList.add("hidden-password");
        e.target.src="/static/images/eye_slash.png";
        e.target.parentElement.querySelector("input").type="password";
      }
    });
  }
}

export default view;