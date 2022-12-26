class Api_view:
    def response_get_order(records, rowcount):
        data=[]
        trip=[]
        if not rowcount:
            return {"data":None}, 200
        else:
            for record in records:
                attraction={
                    "id":record[6],
                    "name":record[7],
                    "address":record[8],
                    "image":record[9],
                }
                temp_trip={
                    "attraction":attraction,
                    "date":str(record[10]),
                    "time":record[11],
                }
                trip.append(temp_trip)
            contact={
                "name":record[2],
                "email":record[3],
                "phone":record[4],
            }
            data={
                "number":record[0],
                "price":record[1],
                "trip":trip,
                "contact":contact,
                "status":record[5],
            }

            return {"data":data}, 200
    def response_create_order(rowcount, order_number, status):

        if rowcount==0:
            return {
                "error": True,
                "message": "name, email, or phone empty, or duplicated order"
            }, 400
        else:
            message="payment pending"
            if status==0:
                message="payment success"

            payment={
                "status":status,
                "message":message,
            }
            data={
                "number":order_number,
                "payment":payment,
            }
            return {"data":data}, 200
