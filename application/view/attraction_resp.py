from flask import render_template

class Api_view:
    def response_attraction_page():
        return render_template("attraction.html")

    def response_attraction_byID(records: list[tuple]):
        if records:
            images=[]
            for record in records:
                images.append(record[9])
            attraction={
                "id": int(records[0][0]),
                "name": records[0][1],
                "category": records[0][2],
                "description": records[0][3],
                "address": records[0][4],
                "transport": records[0][5],
                "mrt": records[0][6],
                "lat": float(records[0][7]),
                "lng": float(records[0][8]),
                "images": images,
            }
            return {"data":attraction}, 200
        else:
            return {"error": True,"message": "景點編號不正確"}, 400	

    def response_attractions(page: int, total_page: int, records: list[tuple]):
            output=[] #use for return 
            id_check=[] #record id already fetched
            if records == "no data":     #prevent useless query
                return {"nextPage":None,"data":[]}, 200	   
            
            for record in records:
                if id_check==[]:  #first time
                    id_check.append(int(record[0]))
                    attraction={
                        "id": int(record[0]),
                        "name": record[1],
                        "category": record[2],
                        "description": record[3],
                        "address": record[4],
                        "transport": record[5],
                        "mrt": record[6],
                        "lat": float(record[7]),
                        "lng": float(record[8]),
                        "images": [record[9]],
                    }
                elif int(record[0]) not in id_check:   #if id changed, append previous id's data
                    output.append(attraction)
                    id_check.append(int(record[0]))
                    attraction={
                        "id": int(record[0]),
                        "name": record[1],
                        "category": record[2],
                        "description": record[3],
                        "address": record[4],
                        "transport": record[5],
                        "mrt": record[6],
                        "lat": float(record[7]),
                        "lng": float(record[8]),
                        "images": [record[9]],
                    }
                else:    #if same id, just append img
                    attraction["images"].append(record[9])
            output.append(attraction)  #for last data collection append
            
            if total_page==page:
                nextPage=None
            else:
                nextPage=page+1

            return {"nextPage":nextPage,"data":output}, 200 
    def response_category(records: list[tuple]):
        output=[]   
        for record in records:
            output.append(record[0])
        return {"data":output}, 200
    