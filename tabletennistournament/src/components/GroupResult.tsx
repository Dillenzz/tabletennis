import React from "react";
import Player from "./Player";
import Match from "./Match";
import PlayerGroupScore from "./PlayerGroupScore";
import { Box, Heading, Text, Center } from "@chakra-ui/react";
import SeededPlayer from "./SeededPlayer";

interface Group {
  name?: number;
  players?: Player[];
  matches?: Match[];
  format?: string;
  numberInGroup?: number;
  tournamentId?: number;
  seededPlayersIds?: number[];
}

function GroupResult(props: Group) {
  const { name, players, matches } = props;

  // Calculate playerGroupScore based on matches
  const playerGroupScore: PlayerGroupScore[] = [];

  for (let i = 0; i < matches!.length; i++) {
    const match = matches![i];
    const winnerId = match.winner?.id;
    const player1Id = match.player1?.id;
    const player2Id = match.player2?.id;

    if (!winnerId) {
      continue; // Skip the match if there is no winner
    }

    for (let j = 0; j < players!.length; j++) {
      const player = players![j];

      if (!playerGroupScore.some((score) => score.player.id === player.id)) {
        playerGroupScore.push({
          player,
          score: 0,
        });
      }

      if (player.id === player1Id) {
        playerGroupScore[j].score += winnerId === player1Id ? 2 : 1;
      }
      if (player.id === player2Id) {
        playerGroupScore[j].score += winnerId === player2Id ? 2 : 1;
      }
    }
  }

  // Sort the playerGroupScore array in descending order
  const sortedPlayers = playerGroupScore.sort((a, b) => b.score - a.score);

  return (
    <Box width="100%" _hover={{ bg: "green.100" }} bg="blue.100" rounded="lg">
      <Center>
        <Text style={{ fontWeight: "bold" }}>Group {name}</Text>
      </Center>
      {sortedPlayers && (
        <Box>
          {sortedPlayers.map((player) => (
            <Player
              onClick={() => console.log("clicked")}
              key={player.player.id}
              id={player.player.id}
              name={player.player.name}
              score={player.score}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default GroupResult;
