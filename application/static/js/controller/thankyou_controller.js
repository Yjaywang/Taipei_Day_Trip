import model from "../model/thankyou_model.js"
import view from "../view/thankyou_view.js"
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
  view.render(model.orderData, model.orderNumber);
}


export default controller;