import re

email="luci@gmail.com"
p=re.compile(r"[^@]+@[^@]+\.[^@]+")
def validateEmail(email): 
    if not p.match(email):
        print("no")
    else:
        print("ok")


validateEmail(email)