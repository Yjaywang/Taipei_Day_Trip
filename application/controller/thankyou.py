#sys.path append
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from flask import Blueprint
from flask import render_template
from model.database import Database
from view.api_response import Api_view


thankyou_page =Blueprint(
    "thankyou_page",
    __name__,
    static_folder="static",
    template_folder="templates",
    )


@thankyou_page.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")