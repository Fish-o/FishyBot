# settings.py
import os
import json 
from os.path import join, dirname
from dotenv import load_dotenv
import requests
import tkinter as tk

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)
 
# Accessing variables.
token = os.getenv('TOKEN')

def makeApiCall(url, method='get', data={}):
    headers = {
        "Authorization": ("Bot "+token)
    }

    if method == 'get':
        data = requests.get(url, headers=headers)
        decoded = data.content.decode("UTF-8")
        return (json.loads(data.content))
    elif method == 'post':
        data = requests.post(url, data=data, headers=headers, json=True)
        decoded = data.content.decode("UTF-8")
        return (json.loads(data.content))

user_url = 'https://discordapp.com/api/users/@me'

user = makeApiCall(user_url)
userid = user['id']

base_url = "https://discord.com/api/v8/applications/"+user['id']+"/commands"


def fetchCommands():
    return makeApiCall(base_url)

print(json.dumps(fetchCommands()))
jsond = {
    "name": "echostats",
    "description": "Send a users ignite echo stats",
    "options": [
        {
            "name": "OculusName",
            "description": "Your oculus / echo vr name",
            "type": 3,
            "required": True
        }
    ]
}

window = tk.Tk()

greeting = tk.Label(text="Command viewer")
button = tk.Button(text="Fetch commands")








# For authorization, you can use either your bot token 



