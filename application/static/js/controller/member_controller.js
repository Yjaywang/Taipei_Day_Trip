import model from "../model/member_model.js";
import view from "../view/member_view.js";
import controller from "../controller/base_controller.js";



controller.init=async function() {
  await controller.baseInit();
  await model.init();
  view.render(model.attractionData);
  await model.category();
  view.category(model.categoryData);
  view.addCatShadow();
};

//page controller
controller.search=async function() {
  await model.search();
  view.search(model.attractionData);
};
controller.scrollLoadMore=function(entries) {
  model.scrollLoadMore(entries);
}

export default controller;


