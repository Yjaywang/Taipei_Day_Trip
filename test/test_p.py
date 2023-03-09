def test_home(client):
    response = client.get('/')
    print(response)
