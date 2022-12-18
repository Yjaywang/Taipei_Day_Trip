import model from "../model/index_model.js";
import memberModel from "../model/member_model.js";
import view from "../view/index_view.js";
import memberView from "../view/member_view.js";


let controller={
  init: async function() {
    await model.init();
    view.render(model.attractionData);
    memberView.signMenu();  //**
    await model.category();
    view.category(model.categoryData);
    view.addCatShadow();
    await memberModel.checkSingIn(); ///** 
    memberView.checkSingIn(memberModel.authData); ///** 
    memberView.bookingPage(); ///** 
    await memberModel.checkBookingCount();  ///** 
    memberView.bookingCount(memberModel.bookingCounts); ///** 
    memberView.addSignMenu();///**
  }, 
  search: async function() {
    await model.search();
    view.search(model.attractionData);
  },
  
  scrollLoadMore: function(entries) {
    model.scrollLoadMore(entries);
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
  goBookingPage: async function() {
    await memberModel.checkSingIn(); ///** 
    memberView.goBookingPage(memberModel.authData);
  },
}


export default controller;


