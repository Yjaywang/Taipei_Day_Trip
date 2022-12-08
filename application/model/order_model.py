import mysql.connector
from dotenv import dotenv_values
import json
config=json.loads({ **dotenv_values(".env")}["config"])
connection_pool=mysql.connector.pooling.MySQLConnectionPool(**config)

class Database:
    pass