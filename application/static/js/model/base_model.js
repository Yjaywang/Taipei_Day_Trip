let baseModel={
  authData:null,
  bookingCounts:0,
  memberData:null,
  checkSingIn: async function() {
    this.authData={};
    const url="/api/user/auth";
    const response = await fetch(url);
    const data = await response.json();
    this.authData=data;
  }, 
  sendSignIn: async function() {
    const email=document.querySelector("#sign-in-email").value;
    const password=document.querySelector("#sign-in-password").value;
    this.memberData={};
    
    if(!email || !password){
      this.memberData={
        "error": true,
        "message": "input empty values"
      };
    } else {
      const body={
        "email":email,
        "password":password,
      }
      const header={
        "Content-Type": "application/json"
      }
      let url = "/api/user/auth"
      const response = await fetch(url, {
        method: "PUT",
        headers:header,
        body:JSON.stringify(body),
      });
      const data = await response.json();
      this.memberData=data
    }
  },
  sendSignUp: async function() {
    const name=document.querySelector("#sign-up-name").value;
    const email=document.querySelector("#sign-up-email").value;
    const password=document.querySelector("#sign-up-password").value;

    if(!name || !email || !password){
      this.memberData={
        "error": true,
        "message": "input empty values"
      };
    } else {
      const body={
        "name":name,
        "email":email,
        "password":password,
      }
      
      const header={
        "Content-Type": "application/json"
      }
      let url = "/api/user"
      const response = await fetch(url, {
        method: "POST",
        headers:header,
        body:JSON.stringify(body),
      });
      const data = await response.json();
      this.memberData=data;
    } 
  },
  signOut: async function() {
    this.authData={};
    const url="/api/user/auth"
    const response = await fetch(url,{
      method:"DELETE",
    });
    const data = await response.json();
    this.authData=data;   
  },
  
  checkBookingCount:async function() {
    const url="/api/booking";
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.bookingCounts=data.data.length;
  
    } catch (error) {
      console.log(error);
    }
  }
}

export default baseModel;