import model from "../model/thankyou_model.js"
import view from "../view/thankyou_view.js"
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
  view.render(model.orderData, model.orderNumber);
  await baseModel.checkBookingCount(); 
  baseView.bookingCount(baseModel.bookingCounts); 
};


export default controller;