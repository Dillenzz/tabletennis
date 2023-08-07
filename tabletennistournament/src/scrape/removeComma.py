import json

def removeComma():

    with open('players_with_ids.json', 'r') as f:
        data = json.load(f)
        
    for player in data:
        player['name'] = player['name'].replace(',', '')
        
    with open('players_with_ids.json', 'w') as f:
        json.dump(data, f, indent=4)