from flask import Blueprint
from application.model.database import Database
from application.view.api_response import Api_view

category = Blueprint(
    "category",
    __name__,
    static_folder="static",
    template_folder="templates",
    )

@category.route("/api/categories", methods=["GET"])
def category_api() ->tuple[dict[str:str], int]:	
    
    records=Database.query_category()
    return Api_view.response_category(records)

    



    


