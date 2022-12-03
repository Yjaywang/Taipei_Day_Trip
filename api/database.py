import mysql.connector
from utils import mysql_config

config=mysql_config.config()
connection_pool=mysql.connector.pooling.MySQLConnectionPool(**config)