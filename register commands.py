bot_id = '780862029803945995'
bot_token = 'NzgwODYyMDI5ODAzOTQ1OTk1.X71Qbw.NSsblXoFPBqVss89VXj-S12NyRE'

import requests


url = "https://discord.com/api/v8/applications/"+bot_id+"/commands"

json = {
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

# For authorization, you can use either your bot token 
headers = {
    "Authorization": ("Bot "+bot_token)
}

# or a client credentials token for your app with the applications.commmands.update scope
#headers = {
#    "Authorization": "Bearer abcdefg"
#}

r = requests.post(url, headers=headers, json=json)

print(r)
