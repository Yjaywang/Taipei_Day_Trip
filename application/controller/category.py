#sys.path append
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))


from flask import Blueprint
from application.model.database import Database
from application.view.api_response import Api_view

category = Blueprint("category", __name__,
                        template_folder='templates')

@category.route("/api/categories", methods=["GET"])
def category_api() ->tuple[dict[str:str], int]:	
    
    records=Database.query_category()
    return Api_view.response_category(records)

    



    


