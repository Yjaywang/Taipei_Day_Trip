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


export default controller;


