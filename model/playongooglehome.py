import requests

def broadcast_message(message):
    url = 'http://192.168.231.71:8123/api/services/tts/google_translate_say'
    headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4NmMzNTIzOTBhZWE0MTkwYWM0OWRjNDAzOGIzNTAxYSIsImlhdCI6MTcyOTIwMTkwOCwiZXhwIjoyMDQ0NTYxOTA4fQ.HB90PYEzOiyOY-_yTJlkAeGsuqqRiI7YBYAJ5kXedCY',
        'Content-Type': 'application/json',
    }
    data = {
        'entity_id': 'media_player.bedroom_speaker',
        'message': message,
    }
    response = requests.post(url, json=data, headers=headers)
    return response.status_code

