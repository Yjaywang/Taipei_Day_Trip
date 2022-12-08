from flask import render_template

class Api_view:
    def response_booking_page():
        return render_template("booking.html")