from application import connection_pool

class Database:
    def query_order_details(orderNumber):
        try:        
            mySql_query = (
                """
                SELECT
                    ANY_VALUE(trans.order_number) AS number,
                    ANY_VALUE(trans.total_money) AS price,
                    ANY_VALUE(m.username) AS username,
                    ANY_VALUE(m.email) AS email,
                    ANY_VALUE(trans.phone) AS phone,
                    ANY_VALUE(trans.trade_status) AS status,
                    ods.attraction_id AS attraction_id, 
                    ANY_VALUE(a.name) AS attraction_name,
                    ANY_VALUE(a.address) AS address,
                    ANY_VALUE(i.file) AS image,
                    ods.date AS date, 
                    p.time AS time  
                FROM (
                    SELECT 
                        id, 
                        order_number, 
                        total_money, 
                        user_id, 
                        phone, 
                        trade_status 
                    FROM transaction 
                    WHERE order_number=%s) AS trans
                INNER JOIN order_details AS ods ON ods.order_id=trans.id
                INNER JOIN price AS p ON p.id=ods.time_id
                INNER JOIN member AS m ON m.id=trans.user_id
                INNER JOIN attraction AS a ON a.id=ods.attraction_id
                INNER JOIN image AS i ON i.attr_id=ods.attraction_id
                GROUP BY ods.attraction_id, ods.date, p.time
                ORDER BY ods.date
                """
                )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (orderNumber, ))
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
    def insert_order_details(trips, order_id):
        outputs=[]
        for trip in trips:
            attraction_id=trip["attraction"]["id"]
            date=trip["date"]
            time=trip["time"]
            if time=="morning":
                time_id=1
            elif time=="afternoon":
                time_id=2
            try:        
                mySql_query = (
                    """
                    INSERT INTO 
                        order_details(
                            order_id,
                            attraction_id,
                            date,
                            time_id
                        )
                    SELECT %s, %s, %s, %s
                    WHERE NOT EXISTS(
                        SELECT * 
                        FROM 
                            order_details 
                        WHERE 
                            order_id=%s and 
                            attraction_id=%s and 
                            date=%s and time_id=%s
                    )
                    """
                )
                connection = connection_pool.get_connection()
                if connection.is_connected():
                    cursor = connection.cursor()
                    cursor.execute(mySql_query, 
                        (order_id, attraction_id, date, time_id, order_id, attraction_id, date, time_id))
                    connection.commit()
                    outputs.append(cursor.rowcount)
                
            except Exception as e:
                print("insert_order_details Error Message:", e)
                raise Exception(e)

            finally:
                if connection.is_connected():
                    cursor.close()
                    if connection.in_transaction: # check transaction over, if not, rollback and end it.
                        connection.rollback()  
                    connection.close()            
                    print("insert_order_details End MySQL connection")
        return outputs
    def insert_transaction(order_number, total_money, transaction_time, user_id, phone, status):
        try:        
            mySql_query = (
                """
                INSERT INTO 
                    transaction(
                        order_number,
                        total_money,
                        transaction_time,
                        user_id,
                        phone,
                        trade_status  
                    )
                SELECT %s, %s, %s, %s, %s, %s
                WHERE NOT EXISTS(
                    SELECT * 
                    FROM 
                        transaction 
                    WHERE 
                        order_number=%s
                )
                """
            )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, 
                    (order_number, total_money, transaction_time, user_id, phone, status, order_number))
                connection.commit()
                return cursor.rowcount
            
        except Exception as e:
            print("insert_transaction Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                if connection.in_transaction: # check transaction over, if not, rollback and end it.
                    connection.rollback()  
                connection.close()            
                print("insert_transaction End MySQL connection")
    def query_order_id(order_number):
        try:        
            mySql_query = (
                """
                SELECT id 
                FROM transaction
                WHERE order_number=%s
                """
            )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (order_number, ))
                record=cursor.fetchone()
                return record
            
        except Exception as e:
            print("query_order_id Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close() 
                connection.close()            
                print("query_order_id End MySQL connection")
    def update_tappay_msg(rec_trade_id, tappay_msg, status, order_id):
        try:        
            mySql_query = (
                """
                UPDATE transaction
                SET 
                    rec_trade_id = %s, 
                    tappay_msg=%s, 
                    trade_status=%s
                WHERE id=%s
                """
            )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, 
                    (rec_trade_id, tappay_msg, status, order_id))
                connection.commit()
                return cursor.rowcount
            
        except Exception as e:
            print("update_tappay_msg Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                if connection.in_transaction: # check transaction over, if not, rollback and end it.
                    connection.rollback()  
                connection.close()            
                print("update_tappay_msg End MySQL connection")

    def update_refund(tappay_record, reason, time, order_number):
        refund=1
        refund_status =tappay_record["status"]
        refund_msg =tappay_record["msg"]
        refund_bank_status =tappay_record["bank_result_code"]
        
        try:        
            mySql_query = (
                """
                UPDATE transaction
                SET 
                    refund =%s,    
                    refund_status =%s,    
                    refund_reason =%s,
                    refund_msg =%s,
                    refund_bank_status =%s,
                    refund_time =%s
                WHERE order_number=%s
                """
            )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, 
                    (refund,
                    refund_status,
                    reason,
                    refund_msg,
                    refund_bank_status,
                    time,
                    order_number,
                    ))
                connection.commit()
                return cursor.rowcount
            
        except Exception as e:
            print("update_refund Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                if connection.in_transaction: # check transaction over, if not, rollback and end it.
                    connection.rollback()  
                connection.close()            
                print("update_refund End MySQL connection")

    def query_user_transactions_detail(id):
        try:        
            mySql_query = (
                """
                SELECT
                    trans.order_number AS number,
                    ANY_VALUE(trans.total_money) AS price,
                    ANY_VALUE(m.username) AS username,
                    ANY_VALUE(m.email) AS email,
                    ANY_VALUE(trans.phone) AS phone,
                    ANY_VALUE(trans.trade_status) AS status,
                    ANY_VALUE(ods.attraction_id) AS attraction_id, 
                    ANY_VALUE(a.name) AS attraction_name,
                    ANY_VALUE(a.address) AS address,
                    ANY_VALUE(i.file) AS image,
                    ANY_VALUE(ods.date) AS date, 
                    ANY_VALUE(p.time) AS time  
                FROM (
                    SELECT 
                        id, 
                        order_number, 
                        total_money, 
                        user_id, 
                        phone, 
                        trade_status 
                    FROM transaction 
                    WHERE 
                        user_id=%s AND
                        refund IS NULL) AS trans
                INNER JOIN order_details AS ods ON ods.order_id=trans.id
                INNER JOIN price AS p ON p.id=ods.time_id
                INNER JOIN member AS m ON m.id=trans.user_id
                INNER JOIN attraction AS a ON a.id=ods.attraction_id
                INNER JOIN image AS i ON i.attr_id=ods.attraction_id
                GROUP BY ods.attraction_id, ods.date, p.time, trans.order_number
                ORDER BY trans.order_number
                """
            )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (id, ))
                record=cursor.fetchall()
                return record
            
        except Exception as e:
            print("query_transactions Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close() 
                connection.close()            
                print("query_transactions End MySQL connection")
    
    def query_refund_id(order_number):
        try:        
            mySql_query = (
                """
                SELECT rec_trade_id 
                FROM transaction
                WHERE 
                    order_number = %s 
                """
            )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (order_number, ))
                record=cursor.fetchone()
                return record
            
        except Exception as e:
            print("query_refund_id Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close() 
                connection.close()            
                print("query_refund_id End MySQL connection")