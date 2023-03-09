let baseModel={
  authData:null,
  bookingCount:0,
  memberData:null,
  checkSingIn: async function() {
    this.authData={};
    const url="/api/user/auth";
    const header={
      "X-CSRF-TOKEN": this.getCookie("csrf_access_token")
    }
    const response = await fetch(url, {
      method: "GET",
      headers:header,
    });
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
    const header={
      "X-CSRF-TOKEN": this.getCookie("csrf_access_token")
    }
    const url="/api/user/auth"
    const response = await fetch(url,{
      method:"DELETE",
      headers:header
    });
    const data = await response.json();
    this.authData=data;   
  },
  
  checkBookingCount:async function() {
    const url="/api/booking";
    try {
      const header={
        "X-CSRF-TOKEN": this.getCookie("csrf_access_token")
      }
      const response = await fetch(url, {
        method:"GET",
        headers:header
      });
      const data = await response.json();
      
      if(!data.data){
        this.bookingCount=0;
      } else {
        this.bookingCount=data.data.length;
      }
    } catch (error) {
      console.log(error);
    }
  }, 

  refreshToken:async function() {
    const url="/api/user/refresh";
    try {
      const header={
        "X-CSRF-TOKEN": this.getCookie("csrf_refresh_token")
      }
      const response = await fetch(url, {
        method:"POST",
        headers:header
      });

  
    } catch (error) {
      console.log(error);
    }
  }, 
  getCookie: function(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}

export default baseModel;