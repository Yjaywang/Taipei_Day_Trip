import model from "../model/attraction_model.js"
import view from "../view/attraction_view.js"
import memberModel from "../model/member_model.js";
import memberView from "../view/member_view.js";


let controller={
  init: async function() {
    await model.init();
    view.render(model.attractionData);
    view.showSlides(model.slideIdx);
    
    memberView.signMenu();  //**
    await memberModel.checkSingIn(); ///** 
    memberView.checkSingIn(memberModel.authData); ///** 
    memberView.bookingPage(); ///** 
    await memberModel.checkBookingCount(); 
    memberView.bookingCount(memberModel.bookingCounts); ///** 
    memberView.addSignMenu();///**
  }, 
  plusSlide: function(n) {
    model.plusSlide(n);
    view.showSlides(model.slideIdx);
  },
  currentSlide: function(n) {
    model.currentSlide(n);
    view.showSlides(model.slideIdx);
  }, 
  sendSignIn: async function() {///** 
    await memberModel.sendSignIn();
    memberView.sendSignIn(memberModel.memberData);
  },
  sendSignUp: async function() {///** 
    await memberModel.sendSignUp();
    memberView.sendSignUp(memberModel.memberData);
  }, 
  signOut: async function() {///** 
    await memberModel.signOut();
    memberView.signOut(memberModel.authData);
  },
  addBooking: async function() {
    await memberModel.checkSingIn(); ///** 
    if(!memberModel.authData.data){
      memberView.needLogin();
    } else{
      await model.addBooking();
      view.addBooking(model.bookingData);
    }

    
  },
  goBookingPage: async function() {
    await memberModel.checkSingIn(); ///** 
    memberView.goBookingPage(memberModel.authData);
  },
};

export default controller;



