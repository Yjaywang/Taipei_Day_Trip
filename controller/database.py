import mysql.connector


config={
    "user": "root",
    "password": "123456",
    "host": "127.0.0.1",
    "database": "attractions",
    "pool_size":5,
    "pool_reset_session":"True",
}
connection_pool=mysql.connector.pooling.MySQLConnectionPool(**config)