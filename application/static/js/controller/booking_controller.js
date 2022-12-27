import model from "../model/booking_model.js"
import view from "../view/booking_view.js"
import baseModel from "../model/base_model.js";
import baseView from "../view/base_view.js";
import controller from "../controller/base_controller.js";



controller.init=async function() {
  await controller.baseInit();
  if(!baseModel.authData.data){
    //not login
    baseView.needLogin();
  }
  //page init
  await model.init();
  if(model.bookingData){
    view.render(model.bookingData);
    view.totalMoney();
    // view.userinfo(baseModel.authData);  
  } else {
    view.noBooking();
    // view.userinfo(baseModel.authData);  
  }
  
};

//page controller
controller.deleteBooking=async function() {
  await model.deleteBooking();
  view.deleteBooking(baseModel.bookingCount);      //can add check access?
};

controller.submitBooking=async function(event) {
  await model.submitBooking(event);
};

export default controller;



