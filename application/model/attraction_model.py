from application import connection_pool


class Database:
    def query_attractions(page, keyword, display):
        try:       	
            connection=connection_pool.get_connection()
            
            if keyword:  #if have keyword
                mySql_query_count=(
                    """
                    SELECT 
                        count(*)
                    FROM 
                        attraction as a 
                    INNER JOIN 
                        category as c on c.id=a.CAT_id
                    WHERE 
                        c.CAT=%s or 
                        a.name LIKE %s
                    """
                    )
                mySql_query=(
                    """
                    SELECT 
                        s._id, 
                        s.name, 
                        s.CAT, 
                        s.description, 
                        s.address, 
                        s.direction, 
                        m.MRT, 
                        s.latitude, 
                        s.longitude, 
                        i.file
                    FROM 
                        (SELECT 
                            a._id, 
                            a.id, 
                            a.MRT_id, 
                            a.name, 
                            c.CAT, 
                            a.description, 
                            a.address, 
                            a.direction, 
                            a.latitude, 
                            a.longitude 
                        FROM attraction as a
                        INNER JOIN 
                            category as c on c.id=a.CAT_id
                        WHERE 
                            c.CAT= %s or
                            a.name LIKE %s
                        LIMIT %s, %s) as s
                    INNER JOIN 
                        mrt as m on m.id=s.MRT_id
                    INNER JOIN 
                        image as i on i.attr_id=s.id
                    """
                    )			
                if connection.is_connected():
                    count_cursor=connection.cursor()
                    count_cursor.execute(mySql_query_count, (keyword,f"%{keyword}%"))   
                    count_records=count_cursor.fetchone()      
                    count=count_records[0]  #get total count
                    total_page=count//12
                    if count==0 or total_page<page: #prevent useless query
                        return 0, "no data"
                    cursor=connection.cursor()
                    cursor.execute(mySql_query, (keyword,f"%{keyword}%",page*12 , display ))   
                    records=cursor.fetchall()   
                    cursor.close() 

                    return total_page, records
            
            else:
                mySql_query_count=("""SELECT count(*) FROM attraction""")
                mySql_query=(
                    """SELECT 
                        s._id, 
                        s.name, 
                        s.CAT, 
                        s.description, 
                        s.address, 
                        s.direction, 
                        m.MRT, 
                        s.latitude, 
                        s.longitude, 
                        i.file
                    FROM 
                        (SELECT 
                            a._id, 
                            a.id, 
                            a.MRT_id, 
                            a.name, 
                            c.CAT, 
                            a.description, 
                            a.address, 
                            a.direction, 
                            a.latitude, 
                            a.longitude 
                        FROM 
                            attraction as a
                        INNER JOIN 
                            category as c on c.id=a.CAT_id
                        LIMIT %s, %s) as s
                    INNER JOIN 
                        mrt as m on m.id=s.MRT_id
                    INNER JOIN 
                        image as i on i.attr_id=s.id
                    """
                    )			
                if connection.is_connected():
                    count_cursor=connection.cursor()
                    count_cursor.execute(mySql_query_count)   
                    count_records=count_cursor.fetchone()      
                    count=count_records[0]  #get total count
                    total_page=count//12
                    if count==0 or total_page<page: #prevent useless query
                        return 0, "no data"						
                    cursor=connection.cursor()
                    cursor.execute(mySql_query, (page*12 , display))
                    records=cursor.fetchall()
                    cursor.close()

                    return total_page, records

        except Exception as e:
            print("attractions Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                count_cursor.close()			
                connection.close()            
                print("attractions End MySQL connection")  
            

    def query_attraction_byID(attractionId: int):
        try:        
            mySql_query=(
                """
                SELECT 
                    a._id,
                    a.name, 
                    c.CAT, 
                    a.description, 
                    a.address, 
                    a.direction, 
                    m.MRT, 
                    a.latitude, 
                    a.longitude, 
                    i.file
                FROM 
                    attraction as a 
                INNER JOIN 
                    mrt as m on m.id=a.MRT_id
                INNER JOIN 
                    category as c on c.id=a.CAT_id
                INNER JOIN 
                    image as i on i.attr_id=a.id
                WHERE 
                    a._id=%s
                """
            )
            connection=connection_pool.get_connection()

            if connection.is_connected():
                cursor=connection.cursor()
                cursor.execute(mySql_query, (attractionId,))       
                records=cursor.fetchall()		
                return records                
            
        except Exception as e:
            print("query_attraction_byID Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()            
                print("query_attraction_byID End MySQL connection")   

    def query_category():
        try:        
            mySql_query=("""SELECT CAT from category""")
            connection=connection_pool.get_connection()

            if connection.is_connected():
                cursor=connection.cursor()
                cursor.execute(mySql_query)       
                records=cursor.fetchall()		
                return records
            
        except Exception as e:
            print("category model Error Message:", e)
            raise Exception(e)
            
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()            
                print("category model End MySQL connection") 