


let model={
  memberData: null,
  authData: null,
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
    else{
      location.href="/";
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
    // await model.init();
    // view.render();
    view.signMenu();
    await model.checkSingIn();
    view.checkSingIn(model.authData);
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

(async function getBooking(){
  const url= "/api/booking"
  try {
    const response = await fetch(url);
    const data = await response.json();
    if(data.data){
      createBooking(data.data);   //construct html elements
      totalMoney();
      document.querySelector("footer").style.display = "flex";	  
    }
    else{
      const bookingSeparatorEls = document.querySelectorAll(".booking-separator");
      bookingSeparatorEls.forEach(bookingSeparatorEl => {
        bookingSeparatorEl.remove();
      });
      document.querySelector(".user-info-container").remove();
      document.querySelector(".card-container").remove();
      document.querySelector(".summary-container").remove();
      document.querySelector(".no-schedule-img").style.display = "block";
    }

  } catch (error) {
    console.log(error);
  }
})();


function createBooking(response){
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

    imgDeleteIcon.addEventListener("click", deleteBooking)


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
}


(async function queryName() {
  const url = "/api/user/auth"
  const user = document.querySelector("#user");
  try {
    const response = await fetch(url);
    const data = await response.json();
    user.textContent=data.data.name;
    
  } catch (error) {
    console.log(error);
  }
})();


function totalMoney() {
  const bookingFeeContentEls =document.querySelectorAll(".booking-fee-content");
  const money=document.querySelector("#money");
  let temp=0;

  bookingFeeContentEls.forEach(bookingFeeContentEl => {
    temp+=parseInt(bookingFeeContentEl.textContent);    
  });
  money.textContent=temp;
}

async function deleteBooking() {
  let bookingCount=this.parentElement.parentElement.parentElement.querySelectorAll(".delete-icon").length;
  let container=this.parentElement.parentElement;
  const attractionID=this.parentElement.querySelector(".booking-attraction-link").href.split("/").slice(-1)[0];
  const date=this.parentElement.querySelector(".booking-date").childNodes[1].textContent;
  const tempTime=this.parentElement.querySelector(".booking-time").childNodes[1].textContent;
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
    container.remove();
    bookingCount=bookingCount-1;
    if (bookingCount===0){
      location.reload();
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
