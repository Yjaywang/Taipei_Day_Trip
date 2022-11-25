from flask import *
import mysql.connector
from utils import mysql_config
from flask_cors import CORS

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

config = mysql_config.config()
connection_pool = mysql.connector.pooling.MySQLConnectionPool(**config)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


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
    res = {
		"error": True,
		"message": "error message: server error"  #+str(error)
		}
    return Response(status=500, mimetype="application/json", response=json.dumps(res))

@app.route("/api/attractions")
def attractions():
	page=int(request.args.get("page", ""))
	keyword=request.args.get("keyword", "")
	display=12
	try:       	
		connection = connection_pool.get_connection()
		
		if keyword:  #if have keyword
			mySql_query_count = ("""
				SELECT count(*)
				FROM attraction as a 
				INNER JOIN category as c on c.id = a.CAT_id
				WHERE c.CAT=%s or a.name LIKE %s
				""")
			mySql_query = ("""
				SELECT s._id, s.name, s.CAT, s.description, s.address, s.direction, m.MRT, s.latitude, s.longitude, i.file
				FROM (SELECT a._id, a.id, a.MRT_id, a.name, c.CAT, a.description, a.address, a.direction, a.latitude, a.longitude 
					FROM attraction as a
					INNER JOIN category as c on c.id = a.CAT_id
					WHERE c.CAT= %s or a.name LIKE %s
					LIMIT %s, %s) as s
				INNER JOIN mrt as m on m.id=s.MRT_id
				INNER JOIN image as i on i.attr_id = s.id
				""")			
			if connection.is_connected():
				count_cursor = connection.cursor()
				count_cursor.execute(mySql_query_count, (keyword,"%"+keyword+"%"))   
				count_records=count_cursor.fetchone()      
				count=count_records[0]  #get total count
				total_page=count//12
				if count==0 or total_page<page: #prevent useless query
					return{"nextPage":None,"data":[]}, 200							
				cursor = connection.cursor()
				cursor.execute(mySql_query, (keyword,"%"+keyword+"%",page*12 , display ))   
				records=cursor.fetchall()   
				cursor.close()   
				output=[] #use for return 
				id_check_list=[]
		
		else:
			mySql_query_count = ("""SELECT count(*) FROM attraction""")
			mySql_query = ("""
				SELECT s._id, s.name, s.CAT, s.description, s.address, s.direction, m.MRT, s.latitude, s.longitude, i.file
				FROM (SELECT a._id, a.id, a.MRT_id, a.name, c.CAT, a.description, a.address, a.direction, a.latitude, a.longitude 
					FROM attraction as a
					INNER JOIN category as c on c.id = a.CAT_id
					LIMIT %s, %s) as s
				INNER JOIN mrt as m on m.id=s.MRT_id
				INNER JOIN image as i on i.attr_id = s.id
				""")			
			if connection.is_connected():
				count_cursor = connection.cursor()
				count_cursor.execute(mySql_query_count)   
				count_records=count_cursor.fetchone()      
				count=count_records[0]  #get total count
				total_page=count//12
				if count==0 or total_page<page: #prevent useless query
					return{"nextPage":None,"data":[]}, 200							
				cursor = connection.cursor()
				cursor.execute(mySql_query, (page*12 , display))
				records=cursor.fetchall()
				cursor.close()
				output=[] #use for return 
				id_check_list=[]
				 
		for info in records:
			if id_check_list==[]:  #first time
				id_check_list.append(int(info[0]))
				attraction={
					"id": int(info[0]),
					"name": info[1],
					"category": info[2],
					"description": info[3],
					"address": info[4],
					"transport": info[5],
					"mrt": info[6],
					"lat": float(info[7]),
					"lng": float(info[8]),
					"images": [info[9]]
				}
			elif int(info[0]) not in id_check_list:   #if id changed, append previous id's data
				output.append(attraction)
				id_check_list.append(int(info[0]))
				attraction={
					"id": int(info[0]),
					"name": info[1],
					"category": info[2],
					"description": info[3],
					"address": info[4],
					"transport": info[5],
					"mrt": info[6],
					"lat": float(info[7]),
					"lng": float(info[8]),
					"images": [info[9]]
				}
			else:    #if id is same, just append img
				attraction["images"].append(info[9])
		output.append(attraction)  #for last data append		
			
		
		if total_page==page:
			nextPage=None
		else:
			nextPage=page+1

		return{"nextPage":nextPage,"data":output}, 200
		
	except mysql.connector.Error as e:
		print("attractions Error Message:", e)
		raise Exception()
	finally:
		if connection.is_connected():
			count_cursor.close()			
			connection.close()            
			print("End MySQL connection")   

@app.route("/api/attraction/<attractionId>")
def query_attraction(attractionId):		
	try:        
		mySql_query = ("""
            SELECT a._id, a.name, c.CAT, a.description, a.address, a.direction, m.MRT, a.latitude, a.longitude, i.file
            FROM attraction as a 
            INNER JOIN mrt as m on m.id=a.MRT_id
            INNER JOIN category as c on c.id = a.CAT_id
            INNER JOIN image as i on i.attr_id = a.id
            WHERE a._id=%s
        """)
		connection = connection_pool.get_connection()
		
		if connection.is_connected():
			cursor = connection.cursor()
			cursor.execute(mySql_query, (attractionId,))       
			records=cursor.fetchall()		

			if records:
				img_list=[]
				for record in records:
					img_list.append(record[9])
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
					"images": img_list
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
def categories():		
	try:        
		mySql_query = ("""SELECT CAT from category""")
		connection = connection_pool.get_connection()
		
		if connection.is_connected():
			cursor = connection.cursor()
			cursor.execute(mySql_query)       
			records=cursor.fetchall()		
			output=[]
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

# app.run(host="0.0.0.0", port=3000)
app.run(port=3000, debug=True) 
