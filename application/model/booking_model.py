from application import connection_pool


class Database:
    def query_booking(user_id):

        try:        
            mySql_query = (
                """
                SELECT 
                    b.attraction_id, 
                    ANY_VALUE(a.name), 
                    ANY_VALUE(a.address), 
                    ANY_VALUE(i.file), 
                    b.date, 
                    p.time, 
                    ANY_VALUE(p.price)
                FROM(
                    SELECT 
                        attraction_id, 
                        date, 
                        time_id 
                    FROM booking 
                    WHERE user_id=%s) AS b
                INNER JOIN 
                    image AS i ON b.attraction_id=i.attr_id
                INNER JOIN 
                    attraction AS a ON b.attraction_id=a._id
                INNER JOIN 
                    price AS p ON b.time_id=p.id
                GROUP BY b.attraction_id, b.date, p.time
                ORDER BY b.date
                """
                )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (user_id, ))
                records=cursor.fetchall()
                return records, cursor.rowcount   #if nothing, record=None, so need rowcount
                            
        except Exception as e:
            print("query booking Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()            
                print("query booking End MySQL connection")
        
        

    def insert_booking(user_id, attraction_id, date, time):
        
        if time=="morning":
            time_id=1
        elif time=="afternoon":
            time_id=2

        try:        
            mySql_query = (
                """
                INSERT INTO 
                    booking(
                        user_id, 
                        attraction_id, 
                        date, time_id
                )
                SELECT %s, %s, %s, %s
                WHERE NOT EXISTS(
                    SELECT * 
                    FROM 
                        booking 
                    WHERE 
                        user_id=%s and 
                        attraction_id=%s and 
                        date=%s and time_id=%s
                )
                """
                )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, 
                    (user_id, attraction_id, date, time_id, user_id, attraction_id, date, time_id))
                connection.commit()
                return cursor.rowcount
            
        except Exception as e:
            print("insert booking Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                if connection.in_transaction: # check transaction over, if not, rollback and end it.
                    connection.rollback()  
                connection.close()            
                print("insert booking End MySQL connection")


        
    def delete_booking(user_id, attraction_id, date, time):
        if time=="morning":
            time_id=1
        elif time=="afternoon":
            time_id=2

        try:        
            mySql_query = (
                """
                DELETE FROM 
                    booking
                WHERE 
                    user_id=%s AND 
                    attraction_id=%s AND 
                    date=%s AND 
                    time_id=%s
                """
                )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (user_id, attraction_id, date, time_id))
                connection.commit()
                return cursor.rowcount
            
        except Exception as e:
            print("delete booking Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                if connection.in_transaction: # check transaction over, if not, rollback and end it.
                    connection.rollback()  
                connection.close()            
                print("delete booking End MySQL connection")

