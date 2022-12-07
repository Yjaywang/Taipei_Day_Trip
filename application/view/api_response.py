#sys.path append
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import time
import jwt
import json
from flask import make_response
from dotenv import dotenv_values
from application import bcrypt

secret_key=str(json.loads({ **dotenv_values(".env")}["secret_key"]))



class Api_view:
    def response_attraction_byID(records):
        if records:
            images=[]
            for record in records:
                images.append(record[9])
            attraction={
                "id": int(records[0][0]),
                "name": records[0][1],
                "category": records[0][2],
                "description": records[0][3],
                "address": records[0][4],
                "transport": records[0][5],
                "mrt": records[0][6],
                "lat": float(records[0][7]),
                "lng": float(records[0][8]),
                "images": images,
            }
            return {"data":attraction}, 200
        else:
            return {"error": True,"message": "景點編號不正確"}, 400	 
    def response_attractions(page, total_page, records):
            output=[] #use for return 
            id_check=[] #record id already fetched
            if records == "no data":     #prevent useless query
                return {"nextPage":None,"data":[]}, 200	   

            
            for record in records:
                if id_check==[]:  #first time
                    id_check.append(int(record[0]))
                    attraction={
                        "id": int(record[0]),
                        "name": record[1],
                        "category": record[2],
                        "description": record[3],
                        "address": record[4],
                        "transport": record[5],
                        "mrt": record[6],
                        "lat": float(record[7]),
                        "lng": float(record[8]),
                        "images": [record[9]],
                    }
                elif int(record[0]) not in id_check:   #if id changed, append previous id's data
                    output.append(attraction)
                    id_check.append(int(record[0]))
                    attraction={
                        "id": int(record[0]),
                        "name": record[1],
                        "category": record[2],
                        "description": record[3],
                        "address": record[4],
                        "transport": record[5],
                        "mrt": record[6],
                        "lat": float(record[7]),
                        "lng": float(record[8]),
                        "images": [record[9]],
                    }
                else:    #if same id, just append img
                    attraction["images"].append(record[9])
            output.append(attraction)  #for last data collection append
            
            if total_page==page:
                nextPage=None
            else:
                nextPage=page+1

            return {"nextPage":nextPage,"data":output}, 200 
    def response_category(records):
        output=[]   
        for record in records:
            output.append(record[0])
        return {"data":output}, 200
    def response_query_member(record):
        output={}
        if record:
            output["id"]=record[0]
            output["username"]=record[1]
            output["email"]=record[2]
            return{"data":output}, 200
    def response_user(username, email, pw_hash, record_count):
        if (not username or not email or not pw_hash):
            return {
                "error": True,
                "message": "input empty values",
            }, 400
        if record_count==1: # update success
            return {"ok":True}, 200
        else: 
            return {
                "error": True,
                "message": "email existed",
            }, 400
    def response_query_signin(record, record_count, email, password):
        from application import bcrypt

        if (not email or not password):
            return {
                "error": True,
                "message": "input empty values",
            }, 400
        if record_count==1: # update success   
            if not bcrypt.check_password_hash(record[0], password):
                return {
                    "error": True,
                    "message": "wrong password, try again!",
                }, 400            
            
            now = time.time()
            exp= 60*60*24*7

            payload = {
                "email": email,
                "expire": now + exp,
            }
            token=jwt.encode(payload, secret_key, algorithm='HS256')            
            resp = make_response({"ok":True}, 200)
            resp.set_cookie(key="user",value= token, expires=time.time()+7*60*60*24) #unit: second
            return resp
            # return resp
        else: 
            return {
                "error": True,
                "message": "email not existed",
            }, 400
    def response_sign_out():
        resp = make_response({"ok":True}, 200)
        resp.set_cookie(key="user",value= "", expires=0) #unit: second
        return resp