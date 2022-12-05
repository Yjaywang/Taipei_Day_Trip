import json
import mysql.connector

with open(r'D:\we_help\S2\taipei-day-trip\data\taipei-attractions.json', encoding='utf-8') as f:
   data = json.load(f)

config = {
  'user': 'root',
  'password': '123456',
  'host': '127.0.0.1',
  'database': 'attractions',
  'pool_size':5,
  'pool_reset_session':'True'
}
connection_pool = mysql.connector.pooling.MySQLConnectionPool(**config)
connection = connection_pool.get_connection()

storage = {
    'rate':[],
    'direction':[],
    'name':[],
    'date':[],
    'longitude':[],
    'REF_WP':[],
    'avBegin':[],
    'langinfo':[],
    'MRT':[],
    'SERIAL_NO':[],
    'RowNumber':[],
    'CAT':[],
    'MEMO_TIME':[],
    'POI':[],
    'file':[],
    'idpt':[],
    'latitude':[],
    'description':[],
    '_id':[],
    'avEnd':[],
    'address':[],
}

item_list = [
    'rate',
    'direction',
    'name',
    'date',
    'longitude',
    'REF_WP',
    'avBegin',
    'langinfo',
    'MRT',
    'SERIAL_NO',
    'RowNumber',
    'CAT',
    'MEMO_TIME',
    'POI',
    'file',
    'idpt',
    'latitude',
    'description',
    '_id',
    'avEnd',
    'address',
]

for item in data['result']['results']:
    for category in item_list:
        if category != 'file':
            storage[category].append(item[category])
        else:
            urls=[]
            accept_type=['jpg', 'png']
            temp=item[category].split('https://')
            for i in range(1, len(temp)):
                if temp[i][-3:].lower() in accept_type:
                   urls.append('https://'+temp[i])

            storage[category].append(' '.join(urls))






'''{mrt:id}'''
mrt_dict={}
mrt_temp_list=[]
mrt_counter=1
for i in range(len(storage["MRT"])):
	if storage["MRT"][i] not in mrt_temp_list:
		mrt_temp_list.append(storage["MRT"][i])
		mrt_dict[storage["MRT"][i]]=mrt_counter
		mrt_counter+=1


cat_dict={}
cat_temp_list=[]
cat_counter=1
for i in range(len(storage["CAT"])):
	if storage["CAT"][i] not in cat_temp_list:
		cat_temp_list.append(storage["CAT"][i])
		cat_dict[storage["CAT"][i]]=cat_counter
		cat_counter+=1



main_dict={}
for key, items in storage.items():
	if key=="MRT":
		MRT_list=[]
		for item in items:
			MRT_list.append(mrt_dict[item])
		main_dict["MRT_id"]=MRT_list
	elif key=="CAT":
		CAT_list=[]
		for item in items:
			CAT_list.append(cat_dict[item])
		main_dict["CAT_id"]=CAT_list
	elif key=="file":
		continue
	else:
		main_dict[key]=items




img_dict={}
for i, images in enumerate(storage["file"]):
   img_list=images.split(" ")
   for img in img_list:
      img_dict[img]=i+1






'''rate
direction
name
date
longitude
REF_WP
avBegin
langinfo
MRT_id
SERIAL_NO
RowNumber
CAT_id
MEMO_TIME
POI
idpt
latitude
description
_id
avEnd
address'''


try:           
    # for i in range(len(main_dict['rate'])): 
    #     update_row=() #tuple
    #     for category in list(main_dict.keys()):
    #         update_row=update_row+ (main_dict[category][i], )
    #     mySql_query = (
	# 		"""            
	# 		INSERT INTO attraction(rate, direction, name, date, longitude, REF_WP, avBegin, 
	# 		langinfo, MRT_id, SERIAL_NO, RowNumber, CAT_id, MEMO_TIME, POI, idpt, 
	# 		latitude, description, _id, avEnd, address)
    #         VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    #         )
        
		
    #     if connection.is_connected():
    #         cursor = connection.cursor()
    #         cursor.execute(mySql_query, update_row)
    #         connection.commit()
    

	for key, value in img_dict.items():
		update_row=(key, value,)
		mySql_query=("""
			INSERT INTO image(file, attr_id) VALUES(%s, %s)
		""")

		if connection.is_connected():
			cursor = connection.cursor()
			cursor.execute(mySql_query, update_row)
			connection.commit()





	# for i in range(len(cat_dict)):
	# 	update_row=(list(cat_dict.keys())[list(cat_dict.values()).index(i+1)], )
	# 	if update_row==(None, ):
	# 		update_row=("", )
	# 	mySql_query=("""
	# 		INSERT INTO category(CAT) VALUES(%s)
	# 	""")

	# 	if connection.is_connected():
	# 		cursor = connection.cursor()
	# 		cursor.execute(mySql_query, update_row)
	# 		connection.commit()




	# for i in range(len(mrt_dict)):
	# 	update_row=(list(mrt_dict.keys())[list(mrt_dict.values()).index(i+1)], )
	# 	if update_row==(None, ):
	# 		update_row=("", )
	# 	mySql_query=("""
	# 		INSERT INTO mrt(MRT) VALUES(%s)
	# 	""")

	# 	if connection.is_connected():
	# 		cursor = connection.cursor()
	# 		cursor.execute(mySql_query, update_row)
	# 		connection.commit()
        
except mysql.connector.Error as e:
    print("Error Message:", e)

finally:
    if connection.is_connected():
        cursor.close()
        if connection.in_transaction: # check transaction over, if not, rollback and end it.
            connection.rollback()  
        connection.close()            
        print("End MySQL connection")   