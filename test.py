import jwt
import time

key = "123456"
now = time.time()
expiretime = 60*60

payload = {
	"email": "test",
	"expire": now + expiretime
}

token=jwt.encode(payload,key,algorithm = 'HS256')
res = jwt.decode(token, key, algorithms='HS256')
print(token)
print(res["email"])