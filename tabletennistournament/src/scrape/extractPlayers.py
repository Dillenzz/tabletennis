import requests

URL = "https://www.profixio.com/fx/ranking_sbtf/ranking_sbtf_list.php?gender=m"
page = requests.get(URL)

print(page.text)