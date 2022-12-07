#sys.path append
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from flask import Blueprint
from flask import request
from flask import render_template
from model.database import Database
from view.api_response import Api_view


attractions =Blueprint(
    "attractions",
    __name__,
    static_folder="static",
    template_folder="templates",
    )





@attractions.route("/api/attraction/<attractionId>", methods=["GET"])
def query_attraction_api(attractionId: int) ->tuple[dict[str:str], int]:
    """fetch attraction data by id from DB, return data with status code"""	
    records=Database.query_attraction_byID(attractionId)
    return Api_view.response_attraction_byID(records)


@attractions.route("/api/attractions", methods=["GET"])
def query_attractions_api() ->tuple[dict[str:str], int]:
    """fetch attractions from DB and return data with status code"""

    page=int(request.args.get("page", ""))
    keyword=request.args.get("keyword", "")
    display=12

    total_page, records=Database.query_attractions(page, keyword, display)
    return Api_view.response_attractions(page, total_page, records)
    

    
