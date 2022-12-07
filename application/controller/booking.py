from flask import Blueprint

from flask import render_template



booking_page =Blueprint(
    "booking_page",
    __name__,
    static_folder="static",
    template_folder="templates",
    )

@booking_page.route("/booking")
def booking():
    return render_template("booking.html")