from flask import Blueprint
from application.view.thankyou_resp import Api_view


thankyou_page =Blueprint(
    "thankyou_page",
    __name__,
    static_folder="static",
    template_folder="templates",
    )


@thankyou_page.route("/thankyou")
def thankyou():
    return Api_view.response_thankyou_page()