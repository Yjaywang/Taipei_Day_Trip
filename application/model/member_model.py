from application import connection_pool

class Database:   
    def insert_signup(username: str, email: str, pw_hash: str):
        try:        
            mySql_query = (
                """
                INSERT INTO 
                    member(
                            username, 
                            email, 
                            password)
                SELECT %s, %s, %s
                WHERE NOT EXISTS(
                    SELECT * 
                    FROM 
                        member 
                    WHERE 
                        BINARY email=%s
                )
                """
            )#add BINARY make query to be case sensitive
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (username, email, pw_hash, email))
                connection.commit()
                return cursor.rowcount
            
        except Exception as e:
            print("signup Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                if connection.in_transaction: # check transaction over, if not, rollback and end it.
                    connection.rollback()  
                connection.close()            
                print("signup End MySQL connection")

    def query_signin(email: str):
        try:        
            mySql_query = (
                """
                SELECT 
                    id, 
                    password
                FROM 
                    member 
                WHERE 
                    BINARY email=%s
                """
            )#add BINARY make query to be case sensitive
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (email, ))
                record=cursor.fetchone()
                return record, cursor.rowcount   #if nothing, record=None, so need rowcount
                            
        except Exception as e:
            print("signin Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                if connection.in_transaction: # check transaction over, if not, rollback and end it.
                    connection.rollback()  
                connection.close()            
                print("signin End MySQL connection")  

    def query_member(id: int):
        try:        
            mySql_query=(
                """
                SELECT 
                    id, 
                    username, 
                    email 
                From 
                    member 
                WHERE 
                    id=%s
                """
            )
            connection=connection_pool.get_connection()

            if connection.is_connected():
                cursor=connection.cursor()
                cursor.execute(mySql_query, (id, ))       
                record=cursor.fetchone()		                
                return record
               
        except Exception as e:
            print("query member Error Message:", e)
            raise Exception(e)
            
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()            
                print("query member End MySQL connection") 
