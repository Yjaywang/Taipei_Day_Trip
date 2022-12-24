import model from "../model/attraction_model.js"
import view from "../view/attraction_view.js"
import baseModel from "../model/base_model.js";
import baseView from "../view/base_view.js";
import controller from "../controller/base_controller.js";



controller.init=async function() {
  await controller.baseInit();
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
  await baseModel.checkSingIn(); 
  if(!baseModel.authData.data){
    baseView.needLogin();
  } else{
    await model.addBooking();
    view.addBooking(model.bookingData);
  } 
};

export default controller;



