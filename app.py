from flask import *
import mysql.connector
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
config = {
  "user": "root",
  "password": "123456",
  "host": "127.0.0.1",
  "database": "attractions",
  "pool_size":5,
  "pool_reset_session":"True"
}
connection_pool = mysql.connector.pooling.MySQLConnectionPool(**config)



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


@app.route("/api/attractions")
def attractions():
	page=int(request.args.get("page", ""))
	keyword=request.args.get("keyword", "")
	try:        
		mySql_query = ("SELECT * FROM site")
		connection = connection_pool.get_connection()
		
		if connection.is_connected():
			cursor = connection.cursor()
			cursor.execute(mySql_query)       
			records=cursor.fetchall()      
			output=[] #use for return
			total_page=len(records)//12  
			attractions=[]	# use for page output
			
			for i, info in enumerate(records):					
				if keyword:  #if have keyword
					if len(attractions)==12: 	#check page full or not
						output.append(attractions)
						attractions=[]	
					if keyword == info[11] or keyword in info[2]:
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
						attractions.append(attraction)

				else: 
					if len(attractions)==12:
						output.append(attractions)
						attractions=[]

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
					attractions.append(attraction)
			output.append(attractions)		#append the rest
			
			if len(output[page])<12 or page==total_page :
				nextPage=None
			else: 				
				nextPage=page+1

			return({
				"nextPage":nextPage,
				"data":output[page] 
			}, 200)
		
	except mysql.connector.Error as e:
		print("attractions Error Message:", e)
		return ({
			"error": True,
			"message": "伺服器內部錯誤"
			}, 500)
	finally:
		if connection.is_connected():
			cursor.close()
			connection.close()            
			print("End MySQL connection")   


@app.route("/api/attraction/<attractionId>")
def query_attraction(attractionId):		
	try:        
		mySql_query = ("SELECT * FROM site WHERE _id=%s")
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
				return ({"data":attraction}, 200)
			else:
				return ({
					"error": True,
					"message": "景點編號不正確"
					},400)
		
	except mysql.connector.Error as e:
		print("attractions Error Message:", e)
		return ({
			"error": True,
			"message": "伺服器內部錯誤"
			}, 500)
	finally:
		if connection.is_connected():
			cursor.close()
			connection.close()            
			print("End MySQL connection")   

@app.route("/api/categories")
def categories():		
	try:        
		mySql_query = ("SELECT CAT FROM site GROUP BY CAT")
		connection = connection_pool.get_connection()
		
		if connection.is_connected():
			cursor = connection.cursor()
			cursor.execute(mySql_query)       
			records=cursor.fetchall()		
			output=[]
			for record in records:
				output.append(record[0])
			return ({"data":output}, 200)
		
	except mysql.connector.Error as e:
		print("attractions Error Message:", e)
		return ({
			"error": True,
			"message": "伺服器內部錯誤"
			}, 500)
	finally:
		if connection.is_connected():
			cursor.close()
			connection.close()            
			print("End MySQL connection")   

app.run(port=3000, debug=True)