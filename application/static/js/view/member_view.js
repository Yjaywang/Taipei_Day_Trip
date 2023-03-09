import controller from "../controller/member_controller.js";

let view = {
  validPWResult: true,
  validrefund: true,
  orderRender: function (data) {
    if (!data.data) {
      document.querySelector(".no-result-img").classList.remove("hidden");
      document.querySelector("footer").style.display = "flex";
      return;
    }
    data.data.forEach((order) => {
      const orderContainerEl = document.querySelector(".order-container");
      //construct elements
      const divOrderInfoContainer = document.createElement("div");
      const divOrderNumberContainer = document.createElement("div");
      const spanPreOrderNumber = document.createElement("span");
      const spanOrderNumber = document.createElement("span");
      const divOrderDetailContainer = document.createElement("div");
      const divUserInfoContainer = document.createElement("div");
      const divUserPhone = document.createElement("div");
      const spanPrePhone = document.createElement("span");
      const spanPhone = document.createElement("span");
      const divTotalMoney = document.createElement("div");
      const spanPreMoney = document.createElement("span");
      const spanMoney = document.createElement("span");
      const spanPstMoney = document.createElement("span");
      const divRefundContainer = document.createElement("div");
      const divRefundBtn = document.createElement("div");

      ////add class or text
      divOrderInfoContainer.className = "order-info-container";
      divOrderNumberContainer.className = "order-number-container";
      spanPreOrderNumber.textContent = "訂單編號：";
      spanOrderNumber.className = "order-number";
      divOrderDetailContainer.className = "order-detail-container hidden";
      divUserInfoContainer.className = "user-info-container";
      divUserPhone.className = "divUserPhone";
      spanPrePhone.textContent = "手機號碼：";
      spanPhone.id = "phone";
      divTotalMoney.className = "total-money";
      spanPreMoney.textContent = "總價：新台幣";
      spanMoney.id = "money";
      spanPstMoney.textContent = "元";
      divRefundContainer.className = "refund-container";
      divRefundBtn.className = "refund-btn";
      divRefundBtn.textContent = "取消訂單";

      ///////
      const phone = order.contact.phone;
      const orderNum = order.number;
      const price = order.price;
      const trips = order.trip;

      spanOrderNumber.textContent = orderNum;
      spanPhone.textContent = phone;
      spanMoney.textContent = price;

      /////
      divOrderNumberContainer.appendChild(spanPreOrderNumber);
      divOrderNumberContainer.appendChild(spanOrderNumber);
      divUserPhone.appendChild(spanPrePhone);
      divUserPhone.appendChild(spanPhone);
      divTotalMoney.appendChild(spanPreMoney);
      divTotalMoney.appendChild(spanMoney);
      divTotalMoney.appendChild(spanPstMoney);
      divRefundContainer.appendChild(divRefundBtn);

      divUserInfoContainer.appendChild(divUserPhone);
      divUserInfoContainer.appendChild(divTotalMoney);

      divOrderDetailContainer.appendChild(divUserInfoContainer);

      trips.forEach((trip) => {
        const divSubOrderInfoContainer = document.createElement("div");
        const imgOrderImg = document.createElement("img");
        const divOrderItemContainer = document.createElement("div");
        const aOrderAttractionLink = document.createElement("a");
        const divOrderAttractionTitle = document.createElement("div");
        const spanPreAttraction = document.createElement("span");
        const spanAttraction = document.createElement("span");
        const divOrderDate = document.createElement("div");
        const spanOrderDateContent = document.createElement("span");
        const divOrderTime = document.createElement("div");
        const spanOrderTimeContent = document.createElement("span");
        const divOrderAddress = document.createElement("div");
        const spanOrderAddressContent = document.createElement("span");
        ////

        imgOrderImg.className = "order-img";
        divOrderItemContainer.className = "order-item-container";
        aOrderAttractionLink.className = "order-attraction-link";
        divOrderAttractionTitle.className = "order-attraction-title";
        spanPreAttraction.textContent = "台北一日遊：";
        spanAttraction.className = "attraction";
        divOrderDate.className = "order-date";
        divOrderDate.textContent = "日期：";
        spanOrderDateContent.className = "order-date-content";
        divOrderTime.className = "order-time";
        divOrderTime.textContent = "時間：";
        spanOrderTimeContent.className = "order-time-content";
        divOrderAddress.className = "order-address";
        divOrderAddress.textContent = "地點：";
        spanOrderAddressContent.className = "order-address-content";
        divSubOrderInfoContainer.className = "sub-order-info-container";
        ////

        const date = trip.date;
        const tempTime = trip.time;
        const attrId = trip.attraction.id;
        const attrName = trip.attraction.name;
        const attrAddress = trip.attraction.address;
        const attrImage = trip.attraction.image;
        let time = "";
        if (tempTime === "morning") {
          time = "早上 9 點到下午 4 點";
        } else if (tempTime === "afternoon") {
          time = "下午 1 點到晚上 9 點";
        }
        //////
        imgOrderImg.src = attrImage;
        aOrderAttractionLink.href = `/attraction/${attrId}`;
        spanAttraction.textContent = attrName;
        spanOrderDateContent.textContent = date;
        spanOrderTimeContent.textContent = time;
        spanOrderAddressContent.textContent = attrAddress;

        ////
        divOrderAttractionTitle.appendChild(spanPreAttraction);
        divOrderAttractionTitle.appendChild(spanAttraction);
        aOrderAttractionLink.appendChild(divOrderAttractionTitle);

        divOrderDate.appendChild(spanOrderDateContent);
        divOrderTime.appendChild(spanOrderTimeContent);
        divOrderAddress.appendChild(spanOrderAddressContent);

        divOrderItemContainer.appendChild(aOrderAttractionLink);
        divOrderItemContainer.appendChild(divOrderDate);
        divOrderItemContainer.appendChild(divOrderTime);
        divOrderItemContainer.appendChild(divOrderAddress);

        divSubOrderInfoContainer.appendChild(imgOrderImg);
        divSubOrderInfoContainer.appendChild(divOrderItemContainer);

        divOrderDetailContainer.appendChild(divSubOrderInfoContainer);
      });
      divOrderDetailContainer.appendChild(divRefundContainer);
      divOrderInfoContainer.appendChild(divOrderNumberContainer);
      divOrderInfoContainer.appendChild(divOrderDetailContainer);
      orderContainerEl.appendChild(divOrderInfoContainer);

      document.querySelector("footer").style.display = "flex";
    });
  },
  orderLinkEvent: function () {
    //////////order detail display//////
    const orderNumberContainerEls = document.querySelectorAll(
      ".order-number-container"
    );
    orderNumberContainerEls.forEach((orderNumberContainerEl) => {
      orderNumberContainerEl.addEventListener("click", function (e) {
        const orderDetailContainerEl = e.target.parentElement.querySelector(
          ".order-detail-container"
        );
        if (orderDetailContainerEl.classList.contains("hidden")) {
          orderDetailContainerEl.classList.remove("hidden");
        } else {
          orderDetailContainerEl.classList.add("hidden");
        }
      });
    });
  },
  refundLinkEvent: function () {
    ///refund function
    const refundBtnEls = document.querySelectorAll(".refund-btn");
    const popupBackgroundEl = document.querySelector(".popup-background");
    const popupContainerEl = document.querySelector(".popup-container");
    const popupCloseIconEl = document.querySelector(".popup-close-icon");
    const popupMessageContainer = document.querySelector(
      ".popup-message-container"
    );
    const refundMessageBtn = document.querySelector(".refund-message-btn");
    const popupContentContainer = document.querySelector(
      ".popup-content-container"
    );
    const popupStatus = document.querySelector(".popup-status");
    refundBtnEls.forEach((refundBtnEl) => {
      refundBtnEl.addEventListener("click", function (e) {
        const orderNum =
          e.target.parentElement.parentElement.parentElement.querySelector(
            ".order-number"
          ).textContent;
        document.querySelector(".popup-order-number").textContent = orderNum;
        document.querySelector(".popup-message-order-number").textContent =
          orderNum;
        popupBackgroundEl.classList.remove("hidden");
        popupContainerEl.classList.remove("hidden");
      });
    });
    popupBackgroundEl.addEventListener("click", function () {
      if (!popupBackgroundEl.classList.contains("hidden")) {
        popupBackgroundEl.classList.add("hidden");
        popupContainerEl.classList.add("hidden");
        popupMessageContainer.classList.add("hidden");
        popupContentContainer.classList.remove("hidden");
      }
    });
    popupCloseIconEl.addEventListener("click", function () {
      if (!popupBackgroundEl.classList.contains("hidden")) {
        popupBackgroundEl.classList.add("hidden");
        popupContainerEl.classList.add("hidden");
        popupMessageContainer.classList.add("hidden");
        popupContentContainer.classList.remove("hidden");
      }
    });

    refundMessageBtn.addEventListener("click", function () {
      if (!popupBackgroundEl.classList.contains("hidden")) {
        popupBackgroundEl.classList.add("hidden");
        popupContainerEl.classList.add("hidden");
        popupMessageContainer.classList.add("hidden");
        popupContentContainer.classList.remove("hidden");
        popupStatus.classList.remove("ok");
        popupStatus.classList.remove("false");
      }
    });

    const refundReasonBtnEl = document.querySelector(".refund-reason-btn");
    refundReasonBtnEl.addEventListener("click", async function () {
      await controller.sendRefund();
    });
  },
  switchTab: function () {
    const memberInfoTabEl = document.querySelector(".member-info-tab");
    const orderListEl = document.querySelector(".order-list");
    const memberContainerEl = document.querySelector(".member-container");
    const orderContainerEl = document.querySelector(".order-container");
    memberInfoTabEl.addEventListener("click", function () {
      memberInfoTabEl.classList.add("function-checked");
      memberContainerEl.classList.remove("hidden");
      orderListEl.classList.remove("function-checked");
      orderContainerEl.classList.add("hidden");
    });

    orderListEl.addEventListener("click", function () {
      orderListEl.classList.add("function-checked");
      orderContainerEl.classList.remove("hidden");
      memberInfoTabEl.classList.remove("function-checked");
      memberContainerEl.classList.add("hidden");
    });
  },
  memberInfoRender: function (data) {
    const headshotEl = document.querySelector(".headshot");
    headshotEl.src = data.data;
  },
  criticalBtnEvent: function () {
    const changeNameBtnEl = document.querySelector(".change-name-btn");
    changeNameBtnEl.addEventListener("click", async function () {
      await controller.changeName();
    });

    const actualBtnEl = document.querySelector("#actual-btn");
    actualBtnEl.addEventListener("change", async function (event) {
      await controller.uploadPhoto(event);
    });

    const changePasswordBtnEl = document.querySelector(".change-password-btn");
    changePasswordBtnEl.addEventListener("click", async function () {
      await controller.changePW();
    });
  },
  sendRefund: function (data) {
    const popupContentContainer = document.querySelector(
      ".popup-content-container"
    );
    const popupMessageContainer = document.querySelector(
      ".popup-message-container"
    );
    const refundMessageBtn = document.querySelector(".refund-message-btn");
    const popupStatus = document.querySelector(".popup-status");
    popupContentContainer.classList.add("hidden");
    popupMessageContainer.classList.remove("hidden");
    if (data.error) {
      popupStatus.classList.add("false");
      if (data.message === "order_number not found") {
        popupStatus.textContent = "找不到訂單";
      } else if (data.message === "already refund") {
        popupStatus.textContent = "此訂單已退款";
      } else if (data.message === "same information as DB") {
        popupStatus.textContent = "資料庫資料沒有更新";
      }
    } else {
      refundMessageBtn.addEventListener("click", function () {
        location.reload();
      });
      popupStatus.classList.add("ok");
      popupStatus.textContent = "退款成功";
    }
  },
  changePW: function (data) {
    const userpwErrorMsgEl = document.querySelector(".userpw-error-msg");
    const userPasswordContainer = document.querySelector(
      ".user-password-container"
    );
    if (data.error) {
      userpwErrorMsgEl.classList.add("show-error");
      userPasswordContainer.addEventListener("mouseup", function () {
        userpwErrorMsgEl.classList.remove("show-error");
      });
      if (data.message === "input empty values") {
        userpwErrorMsgEl.textContent = "輸入不可空白!";
      } else if (data.message === "password not consistent") {
        userpwErrorMsgEl.textContent = "新密碼不一致，請仔細輸入";
      } else if (data.message === "wrong old pw") {
        userpwErrorMsgEl.textContent = "舊密碼輸入錯誤，請再輸入一次";
      } else if (data.message === "same as previous value") {
        userpwErrorMsgEl.textContent = "新舊密碼相同，請再重新輸入一次";
      } else if (data.message === "error password format") {
        userpwErrorMsgEl.textContent =
          "新密碼必須至少8個以上英數字元，包含至少1個大寫英文字";
      } else if (data.message === "user not found") {
        userpwErrorMsgEl.textContent = "使用者未驗證";
      }
    } else {
      userpwErrorMsgEl.classList.add("show-ok");
      userPasswordContainer.addEventListener("mouseup", function () {
        userpwErrorMsgEl.classList.remove("show-ok");
      });
      userpwErrorMsgEl.textContent = "密碼變更成功!";
    }
  },
  validPW: function () {
    const currentPW = document.querySelector(".current-password").value;
    const newPW = document.querySelector(".new-password").value;
    const confirmPW = document.querySelector(".confirm-password").value;
    const userpwErrorMsgEl = document.querySelector(".userpw-error-msg");
    const userPasswordContainer = document.querySelector(
      ".user-password-container"
    );

    if (!currentPW || !newPW || !confirmPW) {
      this.validPWResult = false;
      userpwErrorMsgEl.classList.add("show-error");
      userPasswordContainer.addEventListener("mouseup", function () {
        userpwErrorMsgEl.classList.remove("show-error");
      });
      userpwErrorMsgEl.textContent = "輸入不可空白!";
    } else if (newPW !== confirmPW) {
      this.validPWResult = false;
      userpwErrorMsgEl.classList.add("show-error");
      userPasswordContainer.addEventListener("mouseup", function () {
        userpwErrorMsgEl.classList.remove("show-error");
      });
      userpwErrorMsgEl.textContent = "新密碼不一致，請仔細輸入";
    } else if (newPW === currentPW) {
      this.validPWResult = false;
      userpwErrorMsgEl.classList.add("show-error");
      userPasswordContainer.addEventListener("mouseup", function () {
        userpwErrorMsgEl.classList.remove("show-error");
      });
      userpwErrorMsgEl.textContent = "新舊密碼相同，請再重新輸入一次";
    }
  },
  validRefundReason: function () {
    this.validPWResult = true;
    const popupOrderNumberEl = document.querySelector(".popup-order-number");
    const reasonEl = document.querySelector("#reason");
    const reason = reasonEl.value;
    const popupStatus = document.querySelector(".popup-status");
    popupStatus.classList.remove("false");
    if (reason == "") {
      this.validPWResult = false;
      const popupContentContainer = document.querySelector(
        ".popup-content-container"
      );
      const popupMessageContainer = document.querySelector(
        ".popup-message-container"
      );
      popupContentContainer.classList.add("hidden");
      popupMessageContainer.classList.remove("hidden");
      popupStatus.classList.add("false");
      popupStatus.textContent = "請輸入理由";
    }
  },
  changeName: function (data) {
    const newName = document.querySelector(".change-name-input").value;
    const userEls = document.querySelectorAll(".user");
    const nameEl = document.querySelector(".name");
    const userNameContainer = document.querySelector(".user-name-container");
    const usernameErrorMsg = document.querySelector(".username-error-msg");
    if (data.error) {
      usernameErrorMsg.classList.add("show-error");
      userNameContainer.addEventListener("mouseup", function () {
        usernameErrorMsg.classList.remove("show-error");
      });
      if (data.message === "input empty values") {
        usernameErrorMsg.textContent = "輸入不可空白!";
      } else if (data.message === "same as previous value") {
        usernameErrorMsg.textContent = "新名稱與舊名稱相同，請再重新輸入";
      }
    } else {
      usernameErrorMsg.classList.add("show-ok");
      userNameContainer.addEventListener("mouseup", function () {
        usernameErrorMsg.classList.remove("show-ok");
      });
      userEls.forEach((userEl) => {
        userEl.textContent = newName;
      });
      nameEl.textContent = newName;
      usernameErrorMsg.textContent = "名稱更改成功!";
    }
  },
  uploadPhoto: function (data) {
    const headshotEl = document.querySelector(".headshot");
    const ldsSpinnerEl = document.querySelector(".lds-spinner");
    const headshotErrorMsgEl = document.querySelector(".headshot-error-msg");
    const basicInfoContainer = document.querySelector(".basic-info-container");
    if (data.error) {
      ldsSpinnerEl.classList.add("hidden");
      headshotErrorMsgEl.classList.add("show-error");
      basicInfoContainer.addEventListener("mouseup", function () {
        headshotErrorMsgEl.classList.remove("show-error");
      });
      if (data.message === "input empty values") {
        headshotErrorMsgEl.textContent = "請選擇檔案並上傳";
      } else if (data.message === "must be png, jpeg, bmp, gif, svg") {
        headshotErrorMsgEl.textContent =
          "請選擇png, jpeg, bmp, gif, svg格式的圖片";
      } else if (data.message === "same as previous filename") {
        headshotErrorMsgEl.textContent = "圖片檔名與之前相同";
      }
    } else {
      basicInfoContainer.addEventListener("mouseup", function () {
        headshotErrorMsgEl.classList.remove("show-ok");
      });
      ldsSpinnerEl.classList.remove("hidden");
      headshotEl.src = data.data;
    }
  },
  authInit: function (data) {
    const userEls = document.querySelectorAll(".user");
    userEls.forEach((userEl) => {
      userEl.textContent = data.data.name;
    });
    const nameEl = document.querySelector(".name");
    nameEl.textContent = data.data.name;

    const idEl = document.querySelector(".id");
    idEl.textContent = data.data.id;
    const emailEl = document.querySelector(".email");
    emailEl.textContent = data.data.email;
  },
};

export default view;
