from flask import Blueprint
from application.model.order_model import Database
from application.view.order_resp import Api_view




order =Blueprint(
    "order",
    __name__,
    static_folder="static",
    template_folder="templates",
    )


@order.route("/api/orders", methods=["POST"])
def create_order():
    pass

@order.route("/api/order/<orderNumber>", methods=["GET"])
def get_order(orderNumber: int):
    pass