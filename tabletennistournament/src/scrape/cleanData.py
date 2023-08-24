import json
import csv

from scrapePlayers import scrapePlayers
from removeComma import removeComma
from addIntra import addIntra


def assign_player_ids(json_file_path, output_file_path):
    with open(json_file_path, 'r') as f:
        players = json.load(f)

    # Assign unique ID to each player
    for i, player in enumerate(players):
        player['id'] = i + 1  # ID starts at 1, not 0

    # Write updated player list to file
    with open(output_file_path, 'w') as f:
        json.dump(players, f, indent=4)


def pointToNumber(json_file_path,output_file_path):
    with open(json_file_path, 'r') as f:
        players = json.load(f)
        
    for i, player in enumerate(players):
        player['points'] = int(player['points'].replace(',', ''))
        player['pointsChange'] = int(player['pointsChange'].replace(',', ''))
    
    with open(output_file_path, 'w') as f:
        json.dump(players, f, indent=4)
        
def add_player_class(json_file_path, output_file_path):
    with open(json_file_path, 'r') as f:
        players = json.load(f)
        
    # Set player class attributes for each player
    for i, player in enumerate(players):
        if 749 < player['points'] < 1000:
            player['class'] = '6'
        elif 999 < player['points'] < 1250:
            player['class'] = '5'
        elif 1249 < player['points'] < 1500:
            player['class'] = '4'
        elif 1499 < player['points'] < 1750:
            player['class'] = '3'
        elif 1749 < player['points'] < 2000:
            player['class'] = '2'
        elif 1999 < player['points'] < 2250:
            player['class'] = '1'
        elif player['points'] > 2249:
            player['class'] = 'E'
        else:
            player['class'] = '7'
            
    with open(output_file_path, 'w') as f:
        json.dump(players, f, indent=4)

# Example usage

def add_name_attributes(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as input_f:
        data = json.load(input_f)

    for item in data:
        full_name = item["name"]
        name_parts = full_name.split()

        if len(name_parts) >= 2:
            first_name = name_parts[-1]
            last_name = " ".join(name_parts[:-1])
        else:
            first_name = name_parts[-1]
            last_name = ""

        item["firstName"] = first_name
        item["lastName"] = last_name

    with open(output_file, 'w', encoding='utf-8') as output_f:
        json.dump(data, output_f, indent=2)






def run_script():
    scrapePlayers()
    assign_player_ids('./players.json', './players_with_ids.json')
    removeComma()
    pointToNumber('./players_with_ids.json', './players_with_ids.json')
    add_player_class('./players_with_ids.json', './players_with_ids.json')
    addIntra()
    add_name_attributes('./players_with_ids.json', './players_with_ids.json')

run_script()
