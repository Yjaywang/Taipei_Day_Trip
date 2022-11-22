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
		"message": "伺服器內部錯誤"
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
			mySql_query_count = ("""SELECT count(*) FROM site
								WHERE CAT=%s or name LIKE %s """
			)
			mySql_query = ("""SELECT * FROM site
							WHERE CAT=%s or name LIKE %s 
							LIMIT %s, %s """
			)			
			if connection.is_connected():
				count_cursor = connection.cursor()
				count_cursor.execute(mySql_query_count, (keyword,"%"+keyword+"%"))   
				count_records=count_cursor.fetchone()      
				count=count_records[0]  #get total count
				total_page=count//12
				if count==0 or total_page<page: #prevent useless query
					return{"nextPage":None,"data":[]}, 200							
				cursor = connection.cursor()
				cursor.execute(mySql_query, (keyword,"%"+keyword+"%",page , display ))   
				records=cursor.fetchall()   
				cursor.close()   
				output=[] #use for return 
			
		else:
			mySql_query_count = ("""SELECT count(*) FROM site""")
			mySql_query = ("""SELECT * FROM site LIMIT %s, %s """)			
			if connection.is_connected():
				count_cursor = connection.cursor()
				count_cursor.execute(mySql_query_count)   
				count_records=count_cursor.fetchone()      
				count=count_records[0]  #get total count
				total_page=count//12
				if count==0 or total_page<page: #prevent useless query
					return{"nextPage":None,"data":[]}, 200							
				cursor = connection.cursor()
				cursor.execute(mySql_query, (page , display))
				records=cursor.fetchall()
				cursor.close()
				output=[] #use for return 
				 
		for info in records:			
			attraction={
				"id": int(info[18]),
				"name": info[2],
				"category": info[11],
				"description": info[17],
				"address": info[20],
				"transport": info[1],
				"mrt": info[8],
				"lat": float(info[16]),
				"lng": float(info[4]),
				"images": info[14].split(" ")
			}
			output.append(attraction)
		
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
		mySql_query = ("""SELECT * FROM site WHERE _id=%s""")
		connection = connection_pool.get_connection()
		
		if connection.is_connected():
			cursor = connection.cursor()
			cursor.execute(mySql_query, (attractionId,))       
			records=cursor.fetchone()		
			if records:
				attraction={
					"id": int(records[18]),
					"name": records[2],
					"category": records[11],
					"description": records[17],
					"address": records[20],
					"transport": records[1],
					"mrt": records[8],
					"lat": float(records[16]),
					"lng": float(records[4]),
					"images": records[14].split(" ")
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
		mySql_query = ("""SELECT CAT FROM site GROUP BY CAT""")
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

app.run(host="0.0.0.0", port=3000)
#app.run(port=3000, debug=True) 

