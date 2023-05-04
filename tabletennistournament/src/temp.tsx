{tournaments.map((tournament, index) => (
    <Tournament
      key={index}
      name={tournament.name}
      dateFrom={tournament.dateFrom}
      dateTo={tournament.dateTo}
      location={tournament.location}
      players={tournament.players}
      format={tournament.format}
    />
  ))}























{showCreateTournament && (
    <Box>
      <Center>
        <Input size="md" width="50%" placeholder="Search player"></Input>
        <List
          mt={4}
          maxH="200px"
          overflowY="scroll"
          border="1px solid black"
          borderRadius="md"
          p={2}
        >
          {playerListItems}
          {players.slice(5).map((player, index) => (
            <ListItem key={index + 5}>
              <Text>{player.name}</Text>
              <Text>{player.age}</Text>
              <Text>{player.country}</Text>
            </ListItem>
          ))}
        </List>
      </Center>
    </Box>
  )}

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("./playersData.csv");
      const text = await response.text();
      const results = Papa.parse(text, { header: true }).data as Player[];
      setPlayers(results);
    };

    fetchData();
  }, []);

  const topPlayers = players.slice(0, 5);

  const playerListItems = topPlayers.map((player) => (
    <ListItem key={player.name}>
      <Text>{player.name}</Text>
      <Text>{player.age}</Text>
      <Text>{player.country}</Text>
    </ListItem>
  ));