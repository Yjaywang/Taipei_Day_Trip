let view={
  render: function(data, orderNumber) {
    let imgCount=0;
    let loadingNumberEl=document.querySelector(".loading-number");
    const ldSpinnerEl=document.querySelector(".lds-spinner");
    ldSpinnerEl.classList.remove("hidden");
    const bookingContainer=document.querySelector(".booking-container");
    const trips=data.data.trip;
    const price=data.data.price;  
    const status=data.data.status;
    const name=data.data.contact.name;


    trips.forEach(trip => {
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
      const divBookingAddress=document.createElement("div");
      const spanAddressContent=document.createElement("span");

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
      divBookingAddress.className="booking-address";
      spanAddressContent.className="booking-address-content";

      spanAttractionPrefix.textContent="台北一日遊：";
      divBookingDate.textContent="日期：";
      divBookingTime.textContent="時間：";
      divBookingAddress.textContent="地點："
      imgBooking.src=trip.attraction.image;

      spanAttraction.textContent=trip.attraction.name;
      spanDateContent.textContent=trip.date;
      if(trip.time==="morning"){
        spanTimeContent.textContent="早上 9 點到下午 4 點";
      }
      else if(trip.time==="afternoon"){
        spanTimeContent.textContent="下午 1 點到晚上 9 點";
      }
      spanAddressContent.textContent=trip.attraction.address;
      aBookingAttractionLink.href=`/attraction/${trip.attraction.id}` 

      
      imgBooking.addEventListener("load", function(e) {
        imgCount++;
        let loadingNum=Math.round(imgCount/trips.length*100);
        loadingNumberEl.textContent=`${loadingNum}%`;
        if(imgCount===trips.length){
          loadingNum=0;
          loadingNumberEl.textContent=`${loadingNum}%`;
          ldSpinnerEl.classList.add("hidden");
          bookingContainer.classList.remove("hidden");
          document.querySelector("#user").textContent=name;
          document.querySelector("#order-number").textContent=orderNumber;
          document.querySelector("#money").textContent=price;
          document.querySelector("footer").style.display = "flex";
        }
      })

      divBookingAttractionTitle.appendChild(spanAttractionPrefix);
      divBookingAttractionTitle.appendChild(spanAttraction);

      aBookingAttractionLink.appendChild(divBookingAttractionTitle);    
      divBookingDate.appendChild(spanDateContent);
      divBookingTime.appendChild(spanTimeContent);
      divBookingAddress.appendChild(spanAddressContent);

      divBookingItemContainer.appendChild(aBookingAttractionLink);
      divBookingItemContainer.appendChild(divBookingDate);
      divBookingItemContainer.appendChild(divBookingTime);
      divBookingItemContainer.appendChild(divBookingAddress);

      divBookingInfoSubContainer.appendChild(imgBooking);
      divBookingInfoSubContainer.appendChild(divBookingItemContainer);

      bookingInfoContainerEls[0].insertBefore(divBookingInfoSubContainer, bookingInfoContainerEls.lastElementChild);

      
    });
  }
}

export default view;