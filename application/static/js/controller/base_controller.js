import baseModel from "../model/base_model.js";
import baseView from "../view/base_view.js";


let controller={
  baseInit: async function() {
    await baseModel.refreshToken();

    await baseModel.checkSingIn(); 
    baseView.checkSingIn(baseModel.authData); 

    await baseModel.checkBookingCount(); 
    baseView.bookingCount(baseModel.bookingCount); 

    baseView.bookingPage(); 
    baseView.addSignMenu();
    baseView.addEye();
    baseView.signMenu();  
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



