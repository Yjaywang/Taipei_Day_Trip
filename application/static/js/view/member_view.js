import controller from "../controller/member_controller.js"
let memberView={
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
  },
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
  bookingPage: function() {
    const navSchedule = document.querySelector(".nav-schedule");
    navSchedule.addEventListener("click", controller.goBookingPage);
  },
  goBookingPage: function(data) {
    if(!data.data){
      //if data:null
      this.needLogin();
    }
    else{
      location.href="/booking";
    }  
  },

  bookingCount: function(bookingCounts) {
    document.querySelector(".nav-schedule").textContent=`預定行程 (${bookingCounts})`
  }, 
  addSignMenu: function() {
    const signinBtnEl= document.querySelector(".signin-btn");
    const signupBtnEl= document.querySelector(".signup-btn");
    signinBtnEl.addEventListener("click", async function() {
      await controller.sendSignIn();
    })
    signupBtnEl.addEventListener("click", async function() {
      await controller.sendSignUp();
    })
  },
  needLogin: function () {
    document.querySelector(".sign-menu-backgroung").style.display="block";
    document.querySelector(".signin-form").style.display="block";
    document.querySelector(".signup-form").style.display="none";
  }, 
}


export default memberView;