from flask import Blueprint
from application.view.index_resp import Api_view


index_page = Blueprint(
    "index_page", 
    __name__,
    static_folder="static",
    template_folder="templates",
    )

@index_page.route("/")
def index():
    return Api_view.response_index_page()




