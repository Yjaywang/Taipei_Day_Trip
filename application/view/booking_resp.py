from flask import render_template

class Api_view:
    def response_booking_page():
        return render_template("booking.html")
    def response_query_booking(records, row_count):
        data=[]
        if records==-1:
            return {
                "error": True,
                "message": "not login or no access"
            }, 403
        elif not row_count:
            return {"data":None}, 200
        else:
            for record in records:
                attraction={
                    "id":record[0],
                    "name":record[1],
                    "address":record[2],
                    "image":record[3],
                }
                temp_data={
                    "attraction":attraction,
                    "date":str(record[4]),
                    "time":record[5],
                    "price":record[6],
                }
                data.append(temp_data)

            return {"data":data}, 200
    def response_insert_booking(row_count):
        if row_count==-1:
            return {
                "error": True,
                "message": "not login or no access"
            }, 403
        elif row_count==0:
            return {
                "error": True,
                "message": "duplicated booking"
            }, 400
        elif row_count==-2:
            return {
                "error": True,
                "message": "empty input"
            }, 400
        else:
            return {"ok":True}, 200
    def response_delete_booking(row_count):
        if row_count==-1:
            return {
                "error": True,
                "message": "not login or no access"
            }, 403
        else:
            return {"ok": True}, 200