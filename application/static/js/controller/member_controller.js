import model from "../model/member_model.js";
import view from "../view/member_view.js";
import controller from "../controller/base_controller.js";
import baseModel from "../model/base_model.js";



controller.init=async function() {
  await controller.baseInit();
  ///////////////////////////////////
  (async function loadImg() {
    const photoName=baseModel.authData.data.photo_name;
    const headshotEl=document.querySelector(".headshot");
    const ldsSpinnerEl=document.querySelector(".lds-spinner");
    document.querySelector(".name").textContent=baseModel.authData.data.name;
    document.querySelector(".id").textContent=baseModel.authData.data.id;
    document.querySelector(".email").textContent=baseModel.authData.data.email;
    document.querySelector(".user").textContent=baseModel.authData.data.name;
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
    headshotEl.src=data.data;
  })();

  ////////////////////////////////////////////
  document.querySelector(".change-name-btn").addEventListener("click", async function(e) {
    
    const newName=document.querySelector(".change-name-input").value;
    const url="api/user/name";
    const userEl =document.querySelector(".user");
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
    if(data.error){
      usernameErrorMsg.classList.add("show-error");
      userNameContainer.addEventListener("mouseup", function() {
        usernameErrorMsg.classList.remove("show-error");
      });
      if(data.message==="input empty values"){
        usernameErrorMsg.textContent="輸入不可空白!";
      }
      else if (data.message==="same as previous value"){
        usernameErrorMsg.textContent="新名稱與舊名稱相同，請再重新輸入";
      }
    } else {
      usernameErrorMsg.classList.add("show-ok");
      userNameContainer.addEventListener("mouseup", function() {
        usernameErrorMsg.classList.remove("show-ok");
      });
      userEl.textContent=newName;
      nameEl.textContent=newName;
      usernameErrorMsg.textContent="名稱更改成功!";
    }
  });

  /////////////////////////////////////////////////////
  document.querySelector(".change-password-btn").addEventListener("click", async function() {
    const currentPW=document.querySelector(".current-password").value;
    const newPW=document.querySelector(".new-password").value;
    const confirmPW=document.querySelector(".confirm-password").value;
    const userpwErrorMsgEl=document.querySelector(".userpw-error-msg");
    const userPasswordContainer=document.querySelector(".user-password-container");

    if (!currentPW || !newPW || !confirmPW){
      userpwErrorMsgEl.classList.add("show-error");
      userPasswordContainer.addEventListener("mouseup", function() {
        userpwErrorMsgEl.classList.remove("show-error");
      });
      userpwErrorMsgEl.textContent="輸入不可空白!";
    } 
    else if (newPW!==confirmPW){
      userpwErrorMsgEl.classList.add("show-error");
      userPasswordContainer.addEventListener("mouseup", function() {
        userpwErrorMsgEl.classList.remove("show-error");
      });
      userpwErrorMsgEl.textContent="新密碼不一致，請仔細輸入";
    } 
    else if(newPW===currentPW){
      userpwErrorMsgEl.classList.add("show-error");
      userPasswordContainer.addEventListener("mouseup", function() {
        userpwErrorMsgEl.classList.remove("show-error");
      });
      userpwErrorMsgEl.textContent="新舊密碼相同，請再重新輸入一次";
    } else {
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
      if(data.error){
        userpwErrorMsgEl.classList.add("show-error");
        userPasswordContainer.addEventListener("mouseup", function() {
          userpwErrorMsgEl.classList.remove("show-error");
        });
        if(data.message==="input empty values"){
          userpwErrorMsgEl.textContent="輸入不可空白!";
        } 
        else if(data.message==="password not consistent"){
          userpwErrorMsgEl.textContent="新密碼不一致，請仔細輸入";
        }
        else if(data.message==="wrong old pw"){
          userpwErrorMsgEl.textContent="舊密碼輸入錯誤，請再輸入一次";
        }
        else if(data.message==="same as previous value"){
          userpwErrorMsgEl.textContent="新舊密碼相同，請再重新輸入一次";
        }
        else if(data.message==="user not found"){
          userpwErrorMsgEl.textContent="使用者未驗證";
        }
        
      } else {
        userpwErrorMsgEl.classList.add("show-ok");
        userPasswordContainer.addEventListener("mouseup", function() {
          userpwErrorMsgEl.classList.remove("show-ok");
        });
        userpwErrorMsgEl.textContent="密碼變更成功!";
      }
    }
  })

  /////////////////////////////////////////
  document.querySelector("footer").style.display="flex";

  // await model.init();
  // view.render(model.attractionData);
  // await model.category();
  // view.category(model.categoryData);
  // view.addCatShadow();
};

//page controller


export default controller;


