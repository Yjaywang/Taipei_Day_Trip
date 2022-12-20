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
  view.userinfo(memberModel.authData);    
};

//page controller
controller.deleteBooking=async function() {
  await model.deleteBooking();
  view.deleteBooking();      //can add check access?
};

controller.submitBooking=async function(event) {
  await model.submitBooking(event);
};

export default controller;



