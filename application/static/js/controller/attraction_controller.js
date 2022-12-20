import model from "../model/attraction_model.js"
import view from "../view/attraction_view.js"
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
  //page init
  await model.init();
  view.render(model.attractionData);
  view.showSlides(model.slideIdx);
};


//page controller
controller.plusSlide=function(n) {
  model.plusSlide(n);
  view.showSlides(model.slideIdx);
};

controller.currentSlide=function(n) {
  model.currentSlide(n);
  view.showSlides(model.slideIdx);
};

controller.addBooking=async function() {
  await memberModel.checkSingIn(); 
  if(!memberModel.authData.data){
    memberView.needLogin();
  } else{
    await model.addBooking();
    view.addBooking(model.bookingData);
  } 
};

export default controller;



