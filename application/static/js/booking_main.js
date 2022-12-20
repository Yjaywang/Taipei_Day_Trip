import controller from "./controller/booking_controller.js";

controller.init();

TPDirect.setupSDK(126895, 'app_pGJ2gpYzQRWnHwS1sSVfTuTYdRto7D0wck0cmtWKH8r0l3dbUdNHxzQlCIeI', 'sandbox')


TPDirect.card.setup({
  fields: {
    number: {
      element: '#card-number',
      placeholder: '**** **** **** ****'
    },
    expirationDate: {
      element: document.getElementById('card-expiration-date'),
      placeholder: 'MM / YY'
    },
    ccv: {
      element: '#card-ccv',
      placeholder: 'ccv'
    }
  },
  styles: {
    'input': {
      'color': 'gray'
    },
    'input.ccv': {
      // 'font-size': '16px'
    },
    'input.expiration-date': {
      // 'font-size': '16px'
    },
    'input.card-number': {
      // 'font-size': '16px'
    },
    ':focus': {
      // 'color': 'black'
    },
    '.valid': {
      'color': 'green'
    },
    '.invalid': {
      'color': 'red'
    },
    '@media screen and (max-width: 400px)': {
      'input': {
        'color': 'orange'
      }
    }
  },
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11
  }
});



TPDirect.card.onUpdate(function (update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()
  if (update.canGetPrime) {
      // Enable submit Button to get prime.
      // submitButton.removeAttribute('disabled')
  } else {
      // Disable submit Button to get prime.
      // submitButton.setAttribute('disabled', true)
  }

  // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
  if (update.cardType === 'visa') {
      // Handle card type visa.
  }

  // number 欄位是錯誤的
  if (update.status.number === 2) {
      // setNumberFormGroupToError()
  } else if (update.status.number === 0) {
      // setNumberFormGroupToSuccess()
  } else {
      // setNumberFormGroupToNormal()
  }

  if (update.status.expiry === 2) {
      // setNumberFormGroupToError()
  } else if (update.status.expiry === 0) {
      // setNumberFormGroupToSuccess()
  } else {
      // setNumberFormGroupToNormal()
  }

  if (update.status.ccv === 2) {
      // setNumberFormGroupToError()
  } else if (update.status.ccv === 0) {
      // setNumberFormGroupToSuccess()
  } else {
      // setNumberFormGroupToNormal()
  }
})


// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)
const bookingBtnEl = document.querySelector(".booking-btn");
bookingBtnEl.addEventListener("click", onSubmit);
function onSubmit(event) {
  event.preventDefault()
  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus()
  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
      alert('can not get prime')
      return
  }

  // Get prime
  TPDirect.card.getPrime(async function(result) {
    if (result.status !== 0) {
        alert('get prime error ' + result.msg)
        return
    }
    const prime=result.card.prime;
    const bookingSubContainerEls= document.querySelectorAll(".booking-info-sub-container");
    const userContainerEl=document.querySelector(".user-info-container");
    const total_money=document.querySelector("#money").textContent;
    const userName=userContainerEl.querySelector(".user-name input").value;
    const userEmail=userContainerEl.querySelector(".user-email input").value;
    const userPhone=userContainerEl.querySelector(".user-phone input").value;
    let trip=[];
    const contact={
      name:userName,
      email:userEmail,
      phone:userPhone,
    }
    console.log(bookingSubContainerEls[0].querySelector(".booking-time-content").textContent);
    bookingSubContainerEls.forEach(bookingSubContainerEl => {
      const attractionID=parseInt(bookingSubContainerEl.querySelector("a").href.split("/").slice(-1));
      const attractionName=bookingSubContainerEl.querySelector(".attraction").textContent;
      const address=bookingSubContainerEl.querySelector(".booking-address-content").textContent;
      const image=bookingSubContainerEl.querySelector(".booking-img").src;
      const date=bookingSubContainerEl.querySelector(".booking-date-content").textContent;
      const temp_time=bookingSubContainerEl.querySelector(".booking-time-content").textContent;
      let time="";
      if(temp_time==="早上 9 點到下午 4 點") {
        time="morning";
      }
      else if(temp_time==="下午 1 點到晚上 9 點") {
        time="afternoon";
      }
      let attraction={
        id:attractionID,
        name:attractionName,
        address:address,
        image:image,
      };
      let tempTrip={
        attraction:attraction,
        date:date,
        time:time,
      };
      trip.push(tempTrip);
    }); 
    const order={
      price:total_money,
      trip:trip,
      contact:contact,
    }
    const body={
      prime:prime,
      order:order,
    }
    
    const header={
      "Content-Type": "application/json"
    }
    let url = "/api/orders"
    const response = await fetch(url, {
      method: "POST",
      headers:header,
      body:JSON.stringify(body),
    });
    const data = await response.json();
    if (data.error){
      //do something
      return 
    }

    const orderNumber=data.data.number;
    location.href=`/thankyou?number=${orderNumber}`; 
  
    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
  })

  
}