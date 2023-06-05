import json

# Function to update each object in the JSON array
def update_objects(data):
    for obj in data:
        obj["intraMatchScore"] = 0
        obj["intraSetScore"] = ""
        obj["intraPointScore"] = ""
    return data

# Read the JSON file
with open('./players_with_ids.json', "r") as file:
    json_data = json.load(file)

# Update the objects in the JSON data
updated_data = update_objects(json_data)

# Write the updated JSON back to a file
with open("players_with_ids.json", "w") as file:
    json.dump(updated_data, file, indent=4)

print("JSON file updated successfully.")
