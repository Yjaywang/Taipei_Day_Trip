import pytest
from application import create_app
import json
from werkzeug.http import parse_cookie
import requests
from dotenv import dotenv_values
app = create_app()


# get booking
def test_get_order_correct():
    client = app.test_client()
    url = '/api/user/auth'
    correct_data = {
        "email": "test10@test.com",
        "password": "123456789aA"
    }
    auth_response = client.put(url, json=correct_data)
    assert 'access_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[0]
    assert 'refresh_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[2]
    cookie_header = auth_response.headers.get('Set-Cookie')
    cookies = parse_cookie(cookie_header).get('access_token_cookie')
    # set access token cookie
    client.set_cookie('localhost', 'access_token_cookie', cookies)

    order_url = '/api/order/8_20230404233146'
    response = client.get(order_url)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data != None
