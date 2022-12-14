from flask import render_template

class Api_view:
    def response_thankyou_page():
        return render_template("thankyou.html")