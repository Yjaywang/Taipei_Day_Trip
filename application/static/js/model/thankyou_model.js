import baseModel from "../model/base_model.js";
let model = {
  orderData: null,
  orderNumber: null,
  init: async function () {
    const params = new URLSearchParams(window.location.search);
    const orderNumber = params.get("number");
    this.orderNumber = orderNumber;
    //getOrder function
    const url = `/api/order/${orderNumber}`;
    const response = await fetch(url);
    const data = await response.json();
    this.orderData = data;

    //delete booking data function
    const trips = data.data.trip;
    const delUrl = "/api/booking";
    trips.forEach(async function (trip) {
      const attractionID = trip.attraction.id;
      const date = trip.date;
      const time = trip.time;
      const header = {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": baseModel.getCookie("csrf_access_token"),
      };
      const body = {
        attractionId: attractionID,
        date: date,
        time: time,
      };
      try {
        const response = await fetch(delUrl, {
          method: "DELETE",
          headers: header,
          body: JSON.stringify(body),
        });
        const data = await response.json();
      } catch (error) {
        console.log(error);
      }
    });
  },
};

export default model;
