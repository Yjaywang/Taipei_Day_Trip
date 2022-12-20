import model from "../model/index_model.js";
import memberModel from "../model/member_model.js";
import view from "../view/index_view.js";
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
  view.render(model.attractionData);
  await model.category();
  view.category(model.categoryData);
  view.addCatShadow();
}

//page controller
controller.search=async function() {
  await model.search();
  view.search(model.attractionData);
};
controller.scrollLoadMore=function(entries) {
  model.scrollLoadMore(entries);
}

export default controller;


