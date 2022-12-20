import model from "../model/booking_model.js"
import view from "../view/booking_view.js"
import memberModel from "../model/member_model.js";
import memberView from "../view/member_view.js";
import controller from "../controller/member_controller.js";

controller.init=async function() {

  //member init
  memberView.signMenu();  
  await memberModel.checkSingIn(); 
  memberView.checkSingIn(memberModel.authData); 
  memberView.bookingPage(); 
  await memberModel.checkBookingCount(); 
  memberView.bookingCount(memberModel.bookingCounts); 
  memberView.addSignMenu();
  memberView.addEye();
  //page init
  await model.init();
  if(model.bookingData){
    view.render(model.bookingData);
    view.totalMoney();
  } else {
    view.noBooking();
  }
  view.username(memberModel.authData);  
  
};

//page controller
controller.deleteBooking=async function() {
  await model.deleteBooking();
  view.deleteBooking();      //can add check access?
};


// let controller={
//   init: async function() {
//     await model.init();
//     if(model.bookingData){
//       view.render(model.bookingData);
//       view.totalMoney();
//     } else {
//       view.noBooking();
//     }
//     await memberModel.checkSingIn(); ///** 
//     memberView.signMenu();  //**    
//     memberView.checkSingIn(memberModel.authData); ///** 
//     memberView.bookingPage(); ///** 
//     await memberModel.checkBookingCount(); 
//     memberView.bookingCount(memberModel.bookingCounts); ///** 
//     memberView.addSignMenu();///**
    
//     // view.addEye();
//   }, 
//   sendSignIn: async function() {///** 
//     await memberModel.sendSignIn();
//     memberView.sendSignIn(memberModel.memberData);
//   },
//   sendSignUp: async function() {///** 
//     await memberModel.sendSignUp();
//     memberView.sendSignUp(memberModel.memberData);
//   }, 
//   signOut: async function() {///** 
//     await memberModel.signOut();
//     memberView.signOut(memberModel.authData);
//   },
//   goBookingPage: async function() {
//     await memberModel.checkSingIn(); ///** 
//     memberView.goBookingPage(memberModel.authData);
//   },
//   deleteBooking: async function() {
//     await model.deleteBooking();
//     view.deleteBooking();      //can add check access?
//   }
// };

export default controller;



