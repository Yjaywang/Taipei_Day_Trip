import model from "../model/member_model.js";
import view from "../view/member_view.js";
import controller from "../controller/base_controller.js";


controller.init=async function() {
  await controller.baseInit();
  await model.init();
  await model.memberInfoInit();
  view.orderRender(model.orderData);
  view.memberInfoRender(model.headshotUrl);
  view.orderLinkEvent();
  view.refundLinkEvent();
  view.switchTab();
  view.criticalBtnEvent();
};

//page controller
controller.changeName=async function() {
  await model.changeName();
  view.changeName(model.changeNameData);
};
controller.uploadPhoto=async function(event) {
  await model.uploadPhoto(event);
  view.uploadPhoto(model.photoData);
};

controller.sendRefund=async function() {
  await model.sendRefund();
  view.sendRefund(model.refundData);
};

controller.changePW=async function() {
  view.validPW();
  if(view.validPWResult){
    await model.changePW();
    view.changePW(model.passwordData);
  }
};

export default controller;


