import model from "../model/member_model.js";
import view from "../view/member_view.js";
import controller from "../controller/base_controller.js";
import baseModel from "../model/base_model.js";


controller.init=async function() {
  await controller.baseInit();
  view.authInit(baseModel.authData);
  await model.init();
  if (baseModel.authData.data.photoName){
    await model.memberInfoInit(baseModel.authData.data.photoName);
    view.memberInfoRender(model.headshotUrl);
  }  
  view.orderRender(model.orderData);  
  view.switchTab();
  view.criticalBtnEvent();
  if (model.orderData.data){ 
    //has order history data
    view.orderLinkEvent();
    view.refundLinkEvent(); 
  }   
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
  view.validRefundReason();
  if(view.validPWResult){
    await model.sendRefund();
    view.sendRefund(model.refundData);
  }  
};

controller.changePW=async function() {
  view.validPW();
  if(view.validPWResult){
    await model.changePW();
    view.changePW(model.passwordData);
  }
};

export default controller;


