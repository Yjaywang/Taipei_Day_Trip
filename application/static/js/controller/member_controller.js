import memberModel from "../model/member_model.js";
import memberView from "../view/member_view.js";


let controller={
  init: async function() {
    memberView.signMenu();  //**
    await memberModel.checkSingIn(); ///** 
    memberView.checkSingIn(memberModel.authData); ///** 
    memberView.bookingPage(); ///** 
    await memberModel.checkBookingCount(); 
    memberView.bookingCount(memberModel.bookingCounts); ///** 
    memberView.addSignMenu();///**
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
};

export default controller;



