import re

email="luci@gmail.cc"
p=re.compile(r"^[\w\.+-]+@[\w\.-]+\.[a-zA-Z]{2,}$")
def validateEmail(email): 
    if not p.match(email):
        print("no")
    else:
        print("ok")


validateEmail(email)