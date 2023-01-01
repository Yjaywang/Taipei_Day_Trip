import baseModel from "./base_model.js";
let model={
  uploadData:null,
  orderData:null,
  headshotUrl:null,
  changeNameData:null,
  photoData:null,
  refundData:null,
  passwordData:null,
  init: async function() {
  //////////////////order construct///////////////////
  const url="/api/order";
  const header={
    "X-CSRF-TOKEN": baseModel.getCookie("csrf_access_token"),
    "Content-Type" : "application/json"
  };
  const response = await fetch(url, {
    method:"GET",
    headers:header,
  });
  const data = await response.json();
  this.orderData=data;
  
  
  },
  memberInfoInit: async function() {
    /////////////////////load member info///////////
    const photoName=baseModel.authData.data.photo_name;
    const headshotEl=document.querySelector(".headshot");
    const ldsSpinnerEl=document.querySelector(".lds-spinner");
    document.querySelector(".name").textContent=baseModel.authData.data.name;
    document.querySelector(".id").textContent=baseModel.authData.data.id;
    document.querySelector(".email").textContent=baseModel.authData.data.email;
    document.querySelectorAll(".user").forEach(user => {
      user.textContent=baseModel.authData.data.name;
    });
    ldsSpinnerEl.classList.remove("hidden");
    headshotEl.addEventListener("load", function(e) {
      ldsSpinnerEl.classList.add("hidden");
    })
    const url=`/api/user/headshot/${photoName}`;
    const header={
      "X-CSRF-TOKEN": baseModel.getCookie("csrf_access_token")
    };
    const response = await fetch(url, {
      method:"GET",
      headers:header,
    });
    const data = await response.json();
    this.headshotUrl=data;
  },
  changeName:async function() {    
    const newName=document.querySelector(".change-name-input").value;
    const url="api/user/name";
    const userEls =document.querySelectorAll(".user");
    const nameEl = document.querySelector(".name");
    const userNameContainer=document.querySelector(".user-name-container");
    const usernameErrorMsg=document.querySelector(".username-error-msg");
    const header={
      "X-CSRF-TOKEN": baseModel.getCookie("csrf_access_token"),
      "Content-Type" : "application/json"
    };
    const body={
      "newName":newName,
    };
    const response = await fetch(url, {
      method:"PATCH",
      headers:header,
      body:JSON.stringify(body),
    });
    const data = await response.json();
    this.changeNameData=data;
    
  },
  sendRefund:async function() {

  },
  uploadPhoto: async function(event) {
    event.preventDefault();  // prevent the form from being submitted
    const headshotEl=document.querySelector(".headshot");
    const ldsSpinnerEl=document.querySelector(".lds-spinner");
    const headshotErrorMsgEl=document.querySelector(".headshot-error-msg");
    const basicInfoContainer=document.querySelector(".basic-info-container");
    ldsSpinnerEl.classList.remove("hidden");
    headshotEl.addEventListener("load", function(e) {
      ldsSpinnerEl.classList.add("hidden");
      headshotErrorMsgEl.classList.add("show-ok");
      headshotErrorMsgEl.textContent="圖片更新成功";
    })
    
    // get the file input element and the selected image file
    const file = event.srcElement.files[0];

    // create a FormData object to send the file in the request body
    let formData = new FormData();
    formData.append("image", file);
    const url="/api/user/headshot";
    const header={
      "X-CSRF-TOKEN": baseModel.getCookie("csrf_access_token")
    };
    const response = await fetch(url, {
      method:"POST",
      headers:header,
      body: formData
    });
    const data = await response.json();
    this.photoData=data;
  },
  sendRefund:async function() {
    const popupOrderNumberEl=document.querySelector(".popup-order-number");
    const reasonEl=document.querySelector("#reason");   
    const popupMessageOrderNumber=document.querySelector(".popup-message-order-number");
    const orderNum=popupOrderNumberEl.textContent;
    const reason=reasonEl.value;
    popupMessageOrderNumber.textContent=orderNum;
    const url="/api/order/refund";
    const header={
      "X-CSRF-TOKEN": baseModel.getCookie("csrf_access_token"),
      "Content-Type" : "application/json"
    };
    const body={
      "orderNumber":orderNum,
      "refundReason":reason,
    };
    const response = await fetch(url, {
      method:"PATCH",
      headers:header,
      body:JSON.stringify(body),
    });
    const data = await response.json();
    this.refundData=data;
    
  },
  changePW: async function() {
    const currentPW=document.querySelector(".current-password").value;
    const newPW=document.querySelector(".new-password").value;
    const confirmPW=document.querySelector(".confirm-password").value;

    const url="/api/user/pw";
    const header={
      "X-CSRF-TOKEN": baseModel.getCookie("csrf_access_token"),
      "Content-Type" : "application/json"
    };
    const body={
      "newPW":newPW,
      "confirmNewPW":confirmPW,
      "oldPW":currentPW,
    };
    const response = await fetch(url, {
      method:"PATCH",
      headers:header,
      body:JSON.stringify(body),
    });
    const data = await response.json();
    this.passwordData=data;
  },
}

export default model;