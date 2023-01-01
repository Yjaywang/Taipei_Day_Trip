import baseModel from "./model/base_model.js";
import controller from "./controller/member_controller.js";
controller.init();


document.querySelector("#actual-btn").addEventListener('change', async function(event) {
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
  const file = this.files[0];

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
  if(data.error){
    ldsSpinnerEl.classList.add("hidden");
    headshotErrorMsgEl.classList.add("show-error");
    basicInfoContainer.addEventListener("mouseup", function() {
      headshotErrorMsgEl.classList.remove("show-error");
    })
    if(data.message==="input empty values"){
      headshotErrorMsgEl.textContent="請選擇檔案並上傳";
    } 
    else if (data.message==="must be png, jpeg, bmp, gif, svg"){
      headshotErrorMsgEl.textContent="請選擇png, jpeg, bmp, gif, svg格式的圖片";
    }
    else if(data.message==="same as previous filename"){
      headshotErrorMsgEl.textContent="圖片檔名與之前相同";
    }
  } else {
    basicInfoContainer.addEventListener("mouseup", function() {
      headshotErrorMsgEl.classList.remove("show-ok");
    })
    ldsSpinnerEl.classList.remove("hidden");
    headshotEl.src=data.data;
  }  
});




