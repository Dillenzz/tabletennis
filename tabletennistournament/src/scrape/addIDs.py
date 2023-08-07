import json

def assign_player_ids(json_file_path, output_file_path):
    
    
    with open(json_file_path, 'r') as f:
        players = json.load(f)

    # Assign unique ID to each player
    for i, player in enumerate(players):
        player['id'] = i + 1  # ID starts at 1, not 0

    # Write updated player list to file
    with open(output_file_path, 'w') as f:
        json.dump(players, f, indent=4)

# Example usage
assign_player_ids('./players.json', './players_with_ids.json')