import re


def validate_email(email): 
    pattern=re.compile(r"^[\w\.+-]+@[\w\.-]+\.[a-zA-Z]{2,}$")
    if not pattern.match(email):
        return {
            "valid":False,
            "message":"error email format"
        }
    else:
        return {"valid":True}


def validate_password(password): 
    pattern=re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$")
    if not pattern.match(password):
        return {
            "valid":False,
            "message":"error password format"
        }
    else:
        return {"valid":True}

