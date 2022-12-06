#!/usr/bin/env python3
from flask import *
import mysql.connector
from utils import jwt_key

# from flask_cors import CORS
import time
import jwt 
from controller.database import connection_pool
import os

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# config=mysql_config.config()
# connection_pool=mysql.connector.pooling.MySQLConnectionPool(**config)
# cors=CORS(app, resources={r"/api/*": {"origins": "*"}})


secret_key=jwt_key.secret_key

# Pages
@app.route("/")
def index():
    return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")
@app.route("/booking")
def booking():
    return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")

@app.errorhandler(Exception)
def all_exception_handler(error):
    res={
        "error": True,
        "message": "error message: server error" +str(error)
    }
    return Response(status=500, mimetype="application/json", response=json.dumps(res))



@app.route("/api/user", methods=["POST"])
def signup():
    
    username=request.json["username"]
    email=request.json["email"]
    password=request.json["password"]

    try:        
        mySql_query = (
            """INSERT INTO member(username, email, password)
            SELECT %s, %s, %s
            WHERE NOT EXISTS(
            SELECT * FROM member WHERE BINARY email=%s)"""
            )#add BINARY make query to be case sensitive
        connection = connection_pool.get_connection()

        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute(mySql_query, (username, email, password, email))
            connection.commit()
            if cursor.rowcount==1: # update success
                return {"ok":True}, 200
            else: 
                return {
                    "error": True,
                    "message": "email existed",
                }
        
    except mysql.connector.Error as e:
        print("signup route Error Message:", e)

    finally:
        if connection.is_connected():
            cursor.close()
            if connection.in_transaction: # check transaction over, if not, rollback and end it.
                connection.rollback()  
            connection.close()            
            print("End MySQL connection")         


@app.route("/api/user/auth", methods=["GET"])
def query_member():
    output={}
    token=request.cookies.get("user")
    res = jwt.decode(token, secret_key, algorithms='HS256')
    email=res["email"]

    
    try:        
        mySql_query=(
            """SELECT id, username, email 
            From member
            WHERE email=%s"""
            )
        connection=connection_pool.get_connection()

        if connection.is_connected():
            cursor=connection.cursor()
            cursor.execute(mySql_query, (email, ))       
            record=cursor.fetchone()		

            if record:
                output["id"]=record[0]
                output["username"]=record[1]
                output["email"]=record[2]
                return{"data":output}, 200
            
    except mysql.connector.Error as e:
        print("attractions Error Message:", e)
        raise Exception()
        
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()            
            print("End MySQL connection") 
    

@app.route("/api/user/auth", methods=["PUT"])
def sign_in():
    email=request.json["email"]
    password=request.json["password"]
    try:        
        mySql_query = (
            """
            SELECT password
            FROM member
            WHERE BINARY email=%s
            """
            )#add BINARY make query to be case sensitive
        connection = connection_pool.get_connection()

        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute(mySql_query, (email, ))
            record=cursor.fetchone()
            if cursor.rowcount==1: # update success
                
                if record[0] != password:
                    return {
                        "error": True,
                        "message": "wrong password, try again!",
                    }, 400
                
                
                now = time.time()
                exp= 60*60

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
        
    except mysql.connector.Error as e:
        print("signup route Error Message:", e)

    finally:
        if connection.is_connected():
            cursor.close()
            if connection.in_transaction: # check transaction over, if not, rollback and end it.
                connection.rollback()  
            connection.close()            
            print("End MySQL connection")        

@app.route("/api/user/auth", methods=["DELETE"])
def sign_out():
    resp = make_response({"ok":True}, 200)
    resp.set_cookie(key="user",value= "", expires=0) #unit: second
    return resp

@app.route("/api/attractions")
def attractions() ->tuple[dict[str:str], int]:
    """fetch attractions from DB and return data with status code"""

    page=int(request.args.get("page", ""))
    keyword=request.args.get("keyword", "")
    display=12
    output=[] #use for return 
    id_check=[] #record id already fetched

    try:       	
        connection=connection_pool.get_connection()
		
        if keyword:  #if have keyword
            mySql_query_count=("""
                SELECT count(*)
                FROM attraction as a 
                INNER JOIN category as c on c.id=a.CAT_id
                WHERE c.CAT=%s or a.name LIKE %s
                """)
            mySql_query=("""
                SELECT s._id, s.name, s.CAT, s.description, s.address, s.direction, m.MRT, s.latitude, s.longitude, i.file
                FROM (SELECT a._id, a.id, a.MRT_id, a.name, c.CAT, a.description, a.address, a.direction, a.latitude, a.longitude 
                    FROM attraction as a
                    INNER JOIN category as c on c.id=a.CAT_id
                    WHERE c.CAT= %s or a.name LIKE %s
                    LIMIT %s, %s) as s
                INNER JOIN mrt as m on m.id=s.MRT_id
                INNER JOIN image as i on i.attr_id=s.id
                """)			
            if connection.is_connected():
                count_cursor=connection.cursor()
                count_cursor.execute(mySql_query_count, (keyword,f"%{keyword}%"))   
                count_records=count_cursor.fetchone()      
                count=count_records[0]  #get total count
                total_page=count//12
                if count==0 or total_page<page: #prevent useless query
                    return {"nextPage":None,"data":[]}, 200							
                cursor=connection.cursor()
                cursor.execute(mySql_query, (keyword,f"%{keyword}%",page*12 , display ))   
                records=cursor.fetchall()   
                cursor.close()   
		
        else:
            mySql_query_count=("""SELECT count(*) FROM attraction""")
            mySql_query=("""
                SELECT s._id, s.name, s.CAT, s.description, s.address, s.direction, m.MRT, s.latitude, s.longitude, i.file
                FROM (SELECT a._id, a.id, a.MRT_id, a.name, c.CAT, a.description, a.address, a.direction, a.latitude, a.longitude 
                    FROM attraction as a
                    INNER JOIN category as c on c.id=a.CAT_id
                    LIMIT %s, %s) as s
                INNER JOIN mrt as m on m.id=s.MRT_id
                INNER JOIN image as i on i.attr_id=s.id
                """)			
            if connection.is_connected():
                count_cursor=connection.cursor()
                count_cursor.execute(mySql_query_count)   
                count_records=count_cursor.fetchone()      
                count=count_records[0]  #get total count
                total_page=count//12
                if count==0 or total_page<page: #prevent useless query
                    return {"nextPage":None,"data":[]}, 200							
                cursor=connection.cursor()
                cursor.execute(mySql_query, (page*12 , display))
                records=cursor.fetchall()
                cursor.close()
				 
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
		
    except mysql.connector.Error as e:
        print("attractions Error Message:", e)
        raise Exception()

    finally:
        if connection.is_connected():
            count_cursor.close()			
            connection.close()            
            print("End MySQL connection")   

@app.route("/api/attraction/<attractionId>")
def query_attraction(attractionId: int) ->tuple[dict[str:str], int]:
    """fetch attraction data by id from DB, return data with status code"""		

    try:        
        mySql_query=("""
            SELECT a._id, a.name, c.CAT, a.description, a.address, a.direction, m.MRT, a.latitude, a.longitude, i.file
            FROM attraction as a 
            INNER JOIN mrt as m on m.id=a.MRT_id
            INNER JOIN category as c on c.id=a.CAT_id
            INNER JOIN image as i on i.attr_id=a.id
            WHERE a._id=%s
        """)
        connection=connection_pool.get_connection()

        if connection.is_connected():
            cursor=connection.cursor()
            cursor.execute(mySql_query, (attractionId,))       
            records=cursor.fetchall()		

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
		
    except mysql.connector.Error as e:
        print("attractions Error Message:", e)
        raise Exception()

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()            
            print("End MySQL connection")   

@app.route("/api/categories")
def categories() ->tuple[dict[str:str], int]:	
    """fetch category from table, return data with status code"""	
	
    output=[]
    try:        
        mySql_query=("""SELECT CAT from category""")
        connection=connection_pool.get_connection()

        if connection.is_connected():
            cursor=connection.cursor()
            cursor.execute(mySql_query)       
            records=cursor.fetchall()		
            for record in records:
                output.append(record[0])
            return {"data":output}, 200
		
    except mysql.connector.Error as e:
        print("attractions Error Message:", e)
        raise Exception()
        
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()            
            print("End MySQL connection")   

app.run(host="0.0.0.0", port=3000)
# app.run(port=3000, debug=True) 

