from flask import Blueprint
from flask import render_template


thankyou_page =Blueprint(
    "thankyou_page",
    __name__,
    static_folder="static",
    template_folder="templates",
    )


@thankyou_page.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")