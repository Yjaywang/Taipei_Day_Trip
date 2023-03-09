from application import connection_pool
from dotenv import dotenv_values
import boto3
from botocore.client import Config
AWS_ACCESS_KEY=str({ **dotenv_values(".env")}["AWS_ACCESS_KEY"])
AWS_SECRET_KEY=str({ **dotenv_values(".env")}["AWS_SECRET_KEY"])
AWS_BUCKET=str({ **dotenv_values(".env")}["AWS_BUCKET"])
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
                    email, 
                    password,
                    photo_name
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


    def update_password(id, new_pw):
        try:        
            mySql_query = (
                """
                UPDATE member
                SET 
                    password = %s
                WHERE 
                    id=%s
                """
            )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (new_pw, id))
                connection.commit() 
                #success return 1, else 0
                return cursor.rowcount
            
        except Exception as e:
            print("update_password Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                if connection.in_transaction: # check transaction over, if not, rollback and end it.
                    connection.rollback()  
                connection.close()            
                print("update_password End MySQL connection")

    def update_username(id, new_name):

        try:        
            mySql_query = (
                """
                UPDATE member
                SET username = %s
                WHERE id=%s
                """
            )#add BINARY make query to be case sensitive
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (new_name, id))
                connection.commit()
                return cursor.rowcount
            
        except Exception as e:
            print("update_username Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                if connection.in_transaction: # check transaction over, if not, rollback and end it.
                    connection.rollback()  
                connection.close()            
                print("update_username End MySQL connection")
    def upload_S3(file):
        filename=file.filename
        content_type=file.content_type
        try:        
            # do something with the image file
            s3 = boto3.client('s3', 
                            aws_access_key_id=AWS_ACCESS_KEY,
                            aws_secret_access_key=AWS_SECRET_KEY,
                            config=Config(signature_version='s3v4')
                            )
            s3.upload_fileobj(file, AWS_BUCKET, filename)
            url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': AWS_BUCKET,
                'Key': filename,
                "ResponseContentType": content_type,
                },
                ExpiresIn=3600 #unit: second
            )
            return url
            
        except Exception as e:
            print("upload_s3 Error Message:", e)
            raise Exception(e)

        finally:
            print("upload_s3 done")
            
    def upload_photo(id, img_name):
        try:        
            mySql_query = (
                """
                UPDATE member
                SET photo_name=%s
                WHERE id=%s;
                """
            )
            connection = connection_pool.get_connection()

            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(mySql_query, (img_name, id))
                connection.commit()
                return cursor.rowcount
            
        except Exception as e:
            print("upload_photo Error Message:", e)
            raise Exception(e)

        finally:
            if connection.is_connected():
                cursor.close()
                if connection.in_transaction: # check transaction over, if not, rollback and end it.
                    connection.rollback()  
                connection.close()            
                print("upload_photo End MySQL connection")
                
    def get_photo_url(filename):
        valid_image_contents={"png":"image/png",
                              "jpg":"image/jpeg",
                              "jpeg":"image/jpeg",
                              "bmp":"image/bmp",
                              "gif":"image/gif",
                              "svg":"image/svg+xml",
        }
        file_extention=filename.split(".")[-1].lower()
        content_type=valid_image_contents[file_extention]
        
        try:        
            # do something with the image file
            s3 = boto3.client('s3', 
                            aws_access_key_id=AWS_ACCESS_KEY,
                            aws_secret_access_key=AWS_SECRET_KEY,
                            config=Config(signature_version='s3v4')
                            )
            url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': AWS_BUCKET,
                'Key': filename,
                "ResponseContentType": content_type,
                },
                ExpiresIn=3600 #unit: second
            )
            return url
            
        except Exception as e:
            print("get_photo_url Error Message:", e)
            raise Exception(e)

        finally:
            print("get_photo_url done")