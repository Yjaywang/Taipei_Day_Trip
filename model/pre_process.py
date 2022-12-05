import json
import mysql.connector

with open('taipei-attractions.json', encoding='utf-8') as f:
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



try:        
    for i in range(len(storage['rate'])): 
        update_row=() #tuple
        for category in item_list:
            update_row=update_row+ (storage[category][i], )
        mySql_query = (
            "INSERT INTO site(rate, direction , name , date , longitude , REF_WP , avBegin ,"
            "langinfo ,MRT ,SERIAL_NO ,RowNumber ,CAT ,MEMO_TIME ,POI ,file ,idpt ,"
            "latitude ,description ,_id ,avEnd ,address )"
            "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            )
        

        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute(mySql_query, update_row)
            connection.commit()
      
        
except mysql.connector.Error as e:
    print("Error Message:", e)

finally:
    if connection.is_connected():
        cursor.close()
        if connection.in_transaction: # check transaction over, if not, rollback and end it.
            connection.rollback()  
        connection.close()            
        print("End MySQL connection")   