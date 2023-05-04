import requests
import re
import json
import csv

URL = "https://www.profixio.com/fx/ranking_sbtf/ranking_sbtf_list.php?gender=m"
f1url = "https://www.profixio.com/fx/ranking_sbtf/ranking_sbtf_list.php?gender=k&rid=332&from=1"
f2url = "https://www.profixio.com/fx/ranking_sbtf/ranking_sbtf_list.php?gender=k&rid=332&from=501"

urls = [f1url, f2url, URL]

for x in range(1, 14):
    value = 1 + (500 * x)
    value = str(value)
    urls.append("https://www.profixio.com/fx/ranking_sbtf/ranking_sbtf_list.php?gender=m&rid=332&from="+ value)


players = []
longList = []

for idx, url in enumerate(urls):
    page = requests.get(url)
    longList.append(page.text)

    for match in re.finditer(r"<tr><td class='hoyre'>(WR\d+\s*\d*|\d+)</td><td>\((\d+)\)</td><td><span class='rml_poeng' id='[^>]+?'>([^<]+)</span></td>\s+<td>(\d+)</td><td>([^<]+)</td><td class='hoyre'>(\d+)</td><td>\(([-+]?\d+)\)</td></tr>", page.text):
        ranking = match.group(1)
        if ranking.startswith("WR"):
            world_ranking = ranking.split()[0]
            national_ranking = ranking.split()[1]
        else:
            world_ranking = None
            national_ranking = ranking
        
        if idx == 0 or idx == 1:  # first two URLs are for female players
            gender = "female"
        else:
            gender = "male"

        player = {
            "worldRanking": world_ranking,
            "nationalRanking": national_ranking,
            "pastRanking": match.group(2),
            "name": match.group(3),
            "birthYear": match.group(4),
            "club": match.group(5),
            "points": match.group(6),
            "pointsChange": match.group(7),
            "gender": gender
        }
        players.append(player)

with open('players.json', 'w') as f:
    json.dump(players, f, indent=2)

# Write results to CSV file
with open('players.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["WorldRanking", "National Ranking", "Past Ranking", "Name", "Birth Year", "Club", "Points", "Points Change", "Gender"])
    for player in players:
        writer.writerow([player["worldRanking"], player["nationalRanking"], player["pastRanking"], player["name"], player["birthYear"], player["club"], player["points"], player["pointsChange"], player["gender"]])
