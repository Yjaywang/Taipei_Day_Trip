import baseModel from "../model/base_model.js";
import baseView from "../view/base_view.js";


let controller={
  baseInit: async function() {
    baseView.signMenu();  
    await baseModel.checkSingIn(); 
    baseView.checkSingIn(baseModel.authData); 
    baseView.bookingPage(); 
    await baseModel.checkBookingCount(); 
    baseView.bookingCount(baseModel.bookingCounts); 
    baseView.addSignMenu();
    baseView.addEye();
  },
  sendSignIn: async function() {
    await baseModel.sendSignIn();
    baseView.sendSignIn(baseModel.memberData);
  },
  sendSignUp: async function() {
    await baseModel.sendSignUp();
    baseView.sendSignUp(baseModel.memberData);
  }, 
  signOut: async function() {
    await baseModel.signOut();
    baseView.signOut(baseModel.authData);
  },
  goBookingPage: async function() {
    await baseModel.checkSingIn(); 
    baseView.goBookingPage(baseModel.authData);
  },
};

export default controller;



