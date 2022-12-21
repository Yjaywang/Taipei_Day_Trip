import model from "../model/index_model.js";
import baseModel from "../model/base_model.js";
import view from "../view/index_view.js";
import baseView from "../view/base_view.js";
import controller from "../controller/base_controller.js";


controller.init=async function() {

  //member init
  baseView.signMenu();  
  await baseModel.checkSingIn(); 
  baseView.checkSingIn(baseModel.authData); 
  baseView.bookingPage(); 
  await baseModel.checkBookingCount(); 
  baseView.bookingCount(baseModel.bookingCounts); 
  baseView.addSignMenu();
  baseView.addEye();

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


