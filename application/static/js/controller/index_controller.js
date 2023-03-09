import model from "../model/index_model.js";
import view from "../view/index_view.js";
import controller from "../controller/base_controller.js";





controller.init=async function() {
  await controller.baseInit();
  await model.init();
  view.render(model.attractionData);
  await model.category();
  view.category(model.categoryData);
  view.addCatShadow();
  view.addClickSearch();
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


