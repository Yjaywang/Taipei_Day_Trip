from flask import Blueprint
from application.model.order_model import Database
from application.view.booking_resp import Api_view




bookings =Blueprint(
    "bookings",
    __name__,
    static_folder="static",
    template_folder="templates",
    )

@bookings.route("/booking")
def booking():
    return Api_view.response_booking_page()


@bookings.route("/api/booking", methods=["GET"])
def get_booking():
    pass
@bookings.route("/api/booking", methods=["POST"])
def create_booking():
    pass
@bookings.route("/api/booking", methods=["DELETE"])
def delete_booking():
    pass