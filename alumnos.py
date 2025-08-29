import requests
import random

# URL del endpoint de alumnos en Strapi
url = "http://localhost:1337/api/alumnos"

# Token de autenticación (lo colocas tú)
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU2MjUwOTIxLCJleHAiOjE3NTg4NDI5MjF9.1MdiWsK0FnTHcL_7-Eh559kQ89SplRafM5SYNWMGK8A"

# Headers
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json; charset=utf-8"
}

# ID del docente al que estarán ligados los alumnos
docente_id = "hoku1edd2somyv8q5q04qpjx"

# Lista de nombres y apellidos ficticios
nombres = ["Carlos", "Juan", "Pedro", "Luis", "Miguel", "Sofía", "Ana", "Laura", "María", "Fernanda",
           "Diego", "Andrés", "Sebastián", "Daniel", "Jorge", "Valeria", "Camila", "Regina", "Alexa", "Paola"]

apellidos = ["Pérez", "Gómez", "Ramírez", "Hernández", "Morales", "Castillo", "Torres", "Vega", "Mendoza", "Domínguez",
             "Ortega", "Silva", "Cruz", "Flores", "Rojas", "Jiménez", "Navarro", "Santos", "Luna", "Cortés"]

# Generar mínimo 30 alumnos
for i in range(30):
    nombre = random.choice(nombres)
    apellido = random.choice(apellidos)
    
    # Foto fake (puedes cambiar por ruta válida en tu Strapi o imágenes subidas)
    foto_url = f"https://picsum.photos/200/300?random={i}"

    # Construcción del payload
    data_payload = {
        "data": {
            "nombre": nombre,
            "apellido": apellido,
            "Estatus": True,
            "docente": "hoku1edd2somyv8q5q04qpjx"
        }
    }

    response = requests.post(url, json=data_payload, headers=headers)

    print(f"Alumno {i+1}: {nombre} {apellido} -> Estado: {response.status_code}, Respuesta: {response.text}")
