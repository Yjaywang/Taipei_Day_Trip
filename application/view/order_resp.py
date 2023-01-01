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

    def response_update_refund(record_count):
        if(record_count==-1):
            return {
                "error": True,
                "message": "order_number not found"
            }, 400
        elif(record_count==-2):
            return {
                "error": True,
                "message": "already refund"
            }, 400
        elif(not record_count):
            return {
                "error": True,
                "message": "same information as DB"
            }, 400
        return {"ok":True}, 200
        
    def response_query_user_transactions_detail(records):
        if not records:
            return{"data":None}, 200
        trip=[]
        data=[]
        names=[]
        emails=[]
        phones=[]
        order_num=[]
        price=[]
        status=[]
        print(records)
        for record in records:
            if not order_num:
                names.append(record[2])
                emails.append(record[3])
                phones.append(record[4])
                order_num.append(record[0])
                price.append(record[1])
                status.append(record[5])
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
            elif record[0] not in order_num:
                contact={
                    "name":names[-1],
                    "email":emails[-1],
                    "phone":phones[-1],
                }
                data_temp={
                    "number":order_num[-1],
                    "price":price[-1],
                    "trip":trip,
                    "contact":contact,
                    "status":status[-1],
                }
                data.append(data_temp)
                names.append(record[2])
                emails.append(record[3])
                phones.append(record[4])
                order_num.append(record[0])
                price.append(record[1])
                status.append(record[5])
                trip=[]
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
            else:
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
                "name":names[-1],
                "email":emails[-1],
                "phone":phones[-1],
        }
        data_temp={
            "number":order_num[-1],
            "price":price[-1],
            "trip":trip,
            "contact":contact,
            "status":status[-1],
        }
        data.append(data_temp)
        return {"data":data}, 200