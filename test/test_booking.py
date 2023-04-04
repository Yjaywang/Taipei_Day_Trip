import pytest
from application import create_app
import json
from werkzeug.http import parse_cookie
import requests
from dotenv import dotenv_values
app = create_app()


# get booking
def test_get_booking_correct():
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

    booking_url = '/api/booking'
    response = client.get(booking_url)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data != None


# post booking
def test_post_booking_correct():
    correct_data = {
        "attractionId": 6,
        "date": "2023-05-15",
        "time": "afternoon",
        "price": 2500
    }
    client = app.test_client()
    url = '/api/user/auth'
    auth_data = {
        "email": "test10@test.com",
        "password": "123456789aA"
    }
    auth_response = client.put(url, json=auth_data)
    assert 'access_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[0]
    assert 'refresh_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[2]
    cookie_header = auth_response.headers.get_all('Set-Cookie')
    access_token_cookie = parse_cookie(
        cookie_header[0]).get('access_token_cookie')
    client.set_cookie(
        'localhost',
        'access_token_cookie',
        access_token_cookie,
        domain={**dotenv_values(".env")}["domain"],
        httponly=True,
        samesite='Strict')
    csrf_access_token = parse_cookie(
        cookie_header[1]).get('csrf_access_token')
    client.set_cookie(
        'localhost',
        'csrf_access_token',
        csrf_access_token,
        domain={**dotenv_values(".env")}["domain"],
        samesite='Strict')
    csrf_refresh_token = parse_cookie(
        cookie_header[3]).get('csrf_refresh_token')
    client.set_cookie(
        'localhost',
        'csrf_refresh_token',
        csrf_refresh_token,
        domain={**dotenv_values(".env")}["domain"],
        samesite='Strict')

    headers = {"X-CSRF-TOKEN": csrf_access_token}
    booking_url = '/api/booking'
    response = client.post(booking_url, headers=headers, json=correct_data)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['ok'] == True

    # duplicated booking
    headers = {"X-CSRF-TOKEN": csrf_access_token}
    booking_url = '/api/booking'
    response = client.post(booking_url, headers=headers, json=correct_data)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 400
    assert data['message'] == "duplicated booking"


# delete booking
def test_delete_booking_correct():
    correct_data = {
        "attractionId": 6,
        "date": "2023-05-15",
        "time": "afternoon",
        "price": 2500
    }
    client = app.test_client()
    url = '/api/user/auth'
    auth_data = {
        "email": "test10@test.com",
        "password": "123456789aA"
    }
    auth_response = client.put(url, json=auth_data)
    assert 'access_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[0]
    assert 'refresh_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[2]
    cookie_header = auth_response.headers.get_all('Set-Cookie')
    access_token_cookie = parse_cookie(
        cookie_header[0]).get('access_token_cookie')
    client.set_cookie(
        'localhost',
        'access_token_cookie',
        access_token_cookie,
        domain={**dotenv_values(".env")}["domain"],
        httponly=True,
        samesite='Strict')
    csrf_access_token = parse_cookie(
        cookie_header[1]).get('csrf_access_token')
    client.set_cookie(
        'localhost',
        'csrf_access_token',
        csrf_access_token,
        domain={**dotenv_values(".env")}["domain"],
        samesite='Strict')
    csrf_refresh_token = parse_cookie(
        cookie_header[3]).get('csrf_refresh_token')
    client.set_cookie(
        'localhost',
        'csrf_refresh_token',
        csrf_refresh_token,
        domain={**dotenv_values(".env")}["domain"],
        samesite='Strict')

    headers = {"X-CSRF-TOKEN": csrf_access_token}
    booking_url = '/api/booking'
    response = client.delete(booking_url, headers=headers, json=correct_data)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['ok'] == True

    # delete 2nd
    headers = {"X-CSRF-TOKEN": csrf_access_token}
    booking_url = '/api/booking'
    response = client.delete(booking_url, headers=headers, json=correct_data)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['ok'] == True
