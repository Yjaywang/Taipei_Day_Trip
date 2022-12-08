from flask import render_template

class Api_view:
    def response_index_page():
        return render_template("index.html")