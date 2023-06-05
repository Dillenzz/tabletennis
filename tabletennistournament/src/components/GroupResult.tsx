import Player from "./Player";
import Match from "./Match";
import PlayerGroupScore from "./PlayerGroupScore";
import { Box, Text, Center } from "@chakra-ui/react";
import { set } from "firebase/database";

interface Group {
  name?: number;
  players?: Player[];
  matches?: Match[];
  format?: string;
  numberInGroup?: number;
  tournamentId?: number;
  seededPlayersIds?: number[];
}

function checkIntraMatches(
  sameScore: number[][],
  matches: Match[],
  players: Player[]
) {
  const sortedPlayerIds: number[][] = [];

  for (let i = 0; i < sameScore.length; i++) {
    const playerIds = sameScore[i];

    // Calculate the intrapoints for each player in the sameScore group
    const intrapoints: { [playerId: number]: number } = {};

    for (let j = 0; j < matches.length; j++) {
      const match = matches[j];
      const player1Id = match.player1?.id;
      const player2Id = match.player2?.id;
      const winnerId = match.winner?.id;

      if (player1Id !== undefined && player2Id !== undefined) {
        if (playerIds.includes(player1Id) && playerIds.includes(player2Id)) {
          // The match is between players with the same score
          const player1Index = playerIds.indexOf(player1Id);
          const player2Index = playerIds.indexOf(player2Id);

          if (player1Index !== -1 && player2Index !== -1) {
            if (winnerId === player1Id) {
              intrapoints[player1Id] = (intrapoints[player1Id] || 0) + 2;
              intrapoints[player2Id] = (intrapoints[player2Id] || 0) + 1;
            } else if (winnerId === player2Id) {
              intrapoints[player1Id] = (intrapoints[player1Id] || 0) + 1;
              intrapoints[player2Id] = (intrapoints[player2Id] || 0) + 2;
            } else if (winnerId !== undefined) {
              intrapoints[player1Id] = (intrapoints[player1Id] || 0) + 1;
              intrapoints[player2Id] = (intrapoints[player2Id] || 0) + 1;
            }
          }
        }
      }
    }

    // Sort the player IDs based on the intrapoints in descending order
    const sortedPlayerIdsInGroup = playerIds.sort(
      (a, b) => intrapoints[b] - intrapoints[a]
    );

    // Store the sorted player IDs of the group
    sortedPlayerIds.push(sortedPlayerIdsInGroup);
    sortedPlayerIdsInGroup.forEach((playerId) => {
      const player = players.find((p) => p.id === playerId);
      if (player) {
        player.intraMatchScore = intrapoints[playerId];
      }
    });
    //console.log(intrapoints);
  }

  return sortedPlayerIds;
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
          position: 0,
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

  function checkIntraSets(
    playerSets: number[][],
    matches: Match[],
    players: Player[]
  ) {
    const sortedPlayerIds: number[][] = [];

    for (let i = 0; i < playerSets.length; i++) {
      const playerIds = playerSets[i];

      // Calculate the set fractions for each player in the group
      const setFractions: { [playerId: number]: string } = {};

      // Calculate total won sets and lost sets for each player
      const totalWonSets: { [playerId: number]: number } = {};
      const totalLostSets: { [playerId: number]: number } = {};

      for (let j = 0; j < matches.length; j++) {
        const match = matches[j];
        const player1 = match.player1;
        const player2 = match.player2;

        if (player1 && player2) {
          const player1Id = player1.id;
          const player2Id = player2.id;
          const player1WonSets = match.player1wonSets || 0;
          const player2WonSets = match.player2wonSets || 0;
          const player1LostSets = match.player2wonSets || 0;
          const player2LostSets = match.player1wonSets || 0;

          if (playerIds.includes(player1Id) && playerIds.includes(player2Id)) {
            // The match is between players in the same group
            const player1Index = playerIds.indexOf(player1Id);
            const player2Index = playerIds.indexOf(player2Id);

            if (player1Index !== -1 && player2Index !== -1) {
              totalWonSets[player1Id] =
                (totalWonSets[player1Id] || 0) + player1WonSets;
              totalLostSets[player1Id] =
                (totalLostSets[player1Id] || 0) + player1LostSets;

              totalWonSets[player2Id] =
                (totalWonSets[player2Id] || 0) + player2WonSets;
              totalLostSets[player2Id] =
                (totalLostSets[player2Id] || 0) + player2LostSets;
            }
          }
        }
      }

      for (const playerId of playerIds) {
        const wonSets = totalWonSets[playerId] || 0;
        const lostSets = totalLostSets[playerId] || 0;

        const fraction =
          lostSets === 0 ? `${wonSets}/${wonSets}` : `${wonSets}/${lostSets}`;
        setFractions[playerId] = fraction;
      }

      //console.log("Fractions for Group", i + 1);
      //console.log(setFractions);

      // Sort the player IDs based on the set fractions in descending order
      const sortedPlayerIdsInGroup = playerIds.sort((a, b) => {
        const aFraction = setFractions[a];
        const bFraction = setFractions[b];

        if (aFraction === undefined || bFraction === undefined) {
          // Handle undefined fractions
          return aFraction === undefined ? 1 : -1;
        }

        const [aWins, aLosses] = aFraction.split("/").map(Number);
        const [bWins, bLosses] = bFraction.split("/").map(Number);

        if (aWins / aLosses === bWins / bLosses) {
          return 0;
        } else {
          return aWins / aLosses > bWins / bLosses ? -1 : 1;
        }
      });

      // Separate players into subarrays when their fractions are not equal
      const groupedPlayerIds: number[][] = [];
      let currentGroup: number[] = [sortedPlayerIdsInGroup[0]];

      for (let j = 1; j < sortedPlayerIdsInGroup.length; j++) {
        const currentPlayer = sortedPlayerIdsInGroup[j];
        const prevFraction =
          setFractions[currentGroup[currentGroup.length - 1]];
        const currentFraction = setFractions[currentPlayer];

        if (prevFraction === currentFraction) {
          currentGroup.push(currentPlayer);
        } else {
          groupedPlayerIds.push(currentGroup);
          currentGroup = [currentPlayer];
        }
      }

      groupedPlayerIds.push(currentGroup);

      // Store the grouped player IDs of the group
      sortedPlayerIds.push(...groupedPlayerIds);

      // Assign intraSetScore to players
      for (let j = 0; j < sortedPlayerIdsInGroup.length; j++) {
        const playerId = sortedPlayerIdsInGroup[j];
        const playerIndex = players.findIndex((p) => p.id === playerId);
        const playerSetScore = setFractions[playerId];

        if (playerIndex !== -1 && playerSetScore !== undefined) {
          players[playerIndex].intraSetScore = playerSetScore;
        }
      }
    }

    return sortedPlayerIds;
  }

  function checkIntraPoints(
    playerSets: number[][],
    matches: Match[],
    players: Player[]
  ) {
    const sortedPlayerIds: number[][] = [];

    for (let i = 0; i < playerSets.length; i++) {
      const playerIds = playerSets[i];

      // Calculate the point fractions for each player in the group
      const setFractions: { [playerId: number]: string } = {};

      // Calculate total won points and lost points for each player
      const totalWonPoints: { [playerId: number]: number } = {};
      const totalLostPoints: { [playerId: number]: number } = {};

      for (let j = 0; j < matches.length; j++) {
        const match = matches[j];
        const player1 = match.player1;
        const player2 = match.player2;

        if (player1 && player2) {
          const player1Id = player1.id;
          const player2Id = player2.id;
          const player1WonPoints = match.player1wonPoints || 0;
          const player2WonPoints = match.player2wonPoints || 0;
          const player1LostPoints = match.player2wonPoints || 0;
          const player2LostPoints = match.player1wonPoints || 0;

          if (playerIds.includes(player1Id) && playerIds.includes(player2Id)) {
            // The match is between players in the same group
            const player1Index = playerIds.indexOf(player1Id);
            const player2Index = playerIds.indexOf(player2Id);

            if (player1Index !== -1 && player2Index !== -1) {
              totalWonPoints[player1Id] =
                (totalWonPoints[player1Id] || 0) + player1WonPoints;
              totalLostPoints[player1Id] =
                (totalLostPoints[player1Id] || 0) + player1LostPoints;

              totalWonPoints[player2Id] =
                (totalWonPoints[player2Id] || 0) + player2WonPoints;
              totalLostPoints[player2Id] =
                (totalLostPoints[player2Id] || 0) + player2LostPoints;
            }
          }
        }
      }

      for (const playerId of playerIds) {
        const wonPoints = totalWonPoints[playerId] || 0;
        const lostPoints = totalLostPoints[playerId] || 0;

        const fraction =
          lostPoints === 0
            ? `${wonPoints}/${wonPoints}`
            : `${wonPoints}/${lostPoints}`;
        setFractions[playerId] = fraction;
      }

      //console.log("Fractions for Group", i + 1);
      //console.log(setFractions);

      // Sort the player IDs based on the point fractions in descending order
      const sortedPlayerIdsInGroup = playerIds.sort((a, b) => {
        const aFraction = setFractions[a];
        const bFraction = setFractions[b];

        if (aFraction === undefined || bFraction === undefined) {
          // Handle undefined fractions
          return aFraction === undefined ? 1 : -1;
        }

        const [aWins, aLosses] = aFraction.split("/").map(Number);
        const [bWins, bLosses] = bFraction.split("/").map(Number);

        if (aWins / aLosses === bWins / bLosses) {
          return 0;
        } else {
          return aWins / aLosses > bWins / bLosses ? -1 : 1;
        }
      });

      // Separate players into subarrays when their fractions are not equal
      const groupedPlayerIds: number[][] = [];
      let currentGroup: number[] = [sortedPlayerIdsInGroup[0]];

      for (let j = 1; j < sortedPlayerIdsInGroup.length; j++) {
        const currentPlayer = sortedPlayerIdsInGroup[j];
        const prevFraction =
          setFractions[currentGroup[currentGroup.length - 1]];
        const currentFraction = setFractions[currentPlayer];

        if (prevFraction === currentFraction) {
          currentGroup.push(currentPlayer);
        } else {
          groupedPlayerIds.push(currentGroup);
          currentGroup = [currentPlayer];
        }
      }

      groupedPlayerIds.push(currentGroup);

      // Store the grouped player IDs of the group
      sortedPlayerIds.push(...groupedPlayerIds);

      // Assign intraPointScore to players
      for (let j = 0; j < sortedPlayerIdsInGroup.length; j++) {
        const playerId = sortedPlayerIdsInGroup[j];
        const playerIndex = players.findIndex((p) => p.id === playerId);
        const playerFraction = setFractions[playerId];

        if (playerIndex !== -1 && playerFraction !== undefined) {
          players[playerIndex].intraPointScore = playerFraction;
        }
      }
    }

    return sortedPlayerIds;
  }

  // Sort the playerGroupScore array in descending order
  let sortedPlayerScore = playerGroupScore.sort((a, b) => b.score - a.score);

  // find all players with same score

  const sameScore: number[][] = [];
  const processedScores: Set<number> = new Set();

  for (let i = 0; i < sortedPlayerScore.length; i++) {
    const player = sortedPlayerScore[i];
    const sameScorePlayers: number[] = [];

    if (!processedScores.has(player.score)) {
      sameScorePlayers.push(player.player.id);
      processedScores.add(player.score);

      for (let j = i + 1; j < sortedPlayerScore.length; j++) {
        const otherPlayer = sortedPlayerScore[j];

        if (playerGroupScore[i].score === playerGroupScore[j].score) {
          sameScorePlayers.push(otherPlayer.player.id);
        }
      }

      sameScore.push(sameScorePlayers);
    }
  }

  if (matches && matches.length > 0) {
    if (checkIntraMatches(sameScore, matches, props.players!).length > 1) {
      let playerOrder = checkIntraMatches(sameScore, matches, props.players!);
      //console.log(playerOrder, "playerOrder");
      const intrasets = checkIntraSets(playerOrder, matches, props.players!);
      //console.log(intrasets, "intrasets");
      if (intrasets.some((array) => array.length > 1)) {
        const intrapoints = checkIntraPoints(intrasets, matches, props.players!);
        //console.log(intrapoints, "intrapoints");
        if (intrapoints.some((array) => array.length > 1)) {
          //console.log("intrapoints", "shuffle intragroups");
        } else {
          //console.log("intrapoints", "assign position");
          const intrapointsFlat = checkIntraPoints(sameScore, matches, props.players!).flat();
         // console.log(intrapointsFlat, "intrapointsFlat");

          for (let i = 0; i < intrapointsFlat.length; i++) {
            const playerId = intrapointsFlat[i];
            const playerIndex = playerGroupScore.findIndex(
              (score) => score.player.id === playerId
            );

            if (playerIndex !== -1) {
              playerGroupScore[playerIndex].position = i + 1;
            }
          }
        }
      }
    } else {
      const intrasetsFlat = checkIntraMatches(
        sameScore,
        matches,
        props.players!
      ).flat();

      for (let i = 0; i < intrasetsFlat.length; i++) {
        const playerId = intrasetsFlat[i];
        const playerIndex = playerGroupScore.findIndex(
          (score) => score.player.id === playerId
        );

        if (playerIndex !== -1) {
          playerGroupScore[playerIndex].position = i + 1;
        }
      }
    }
  } else {
    // assign position to players
    if (matches && matches.length > 0) {
      const playerOrder = checkIntraMatches(
        sameScore,
        matches,
        props.players!
      ).flat();

      for (let i = 0; i < playerOrder.length; i++) {
        const playerId = playerOrder[i];
        const playerIndex = playerGroupScore.findIndex(
          (score) => score.player.id === playerId
        );

        if (playerIndex !== -1) {
          playerGroupScore[playerIndex].position = i + 1;
        }
      }

      // console.log(sortedPlayerScore);
    }
  }

  const sortedPlayerPosition = playerGroupScore.sort(
    (a, b) => a.position - b.position
  );

  //console.log(sortedPlayerPosition, "sortedPlayerPosition");
  // if there are more than 2 players with the same score, then we need to check the matches between them
  // if the matches between them are equal, then we need to check the sets between them
  // if the sets between them are equal, then we need to check the points between them

  // first 2 players in each group should be in the next round and displayed with a green color
  const topPlayers = sortedPlayerScore.slice(0, 2);

  return (
    <Box width="100%" bg="#F5F0BB" rounded="md">
      <Center>
        <Text fontSize={20} style={{ fontWeight: "bold" }}>
          Group {name} 
        </Text>
      </Center>
      {sortedPlayerScore && sortedPlayerScore && (
        <Box>
          {sortedPlayerPosition.map((player) => (
            <Player
              onClick={() => console.log("clicked")}
              key={player.player.id}
              id={player.player.id}
              name={player.player.name}
              club={player.player.club}
              score={player.score}
              class={player.player.class}
              isTopPlayer={topPlayers.includes(player)}
              intraMatchScore={player.player.intraMatchScore}
              intraSetScore={player.player.intraSetScore}
              intraPointScore={player.player.intraPointScore}
            />
          ))}
        </Box>
      )}
      {sortedPlayerScore.length === 0 && (
        <Box>
          <Center>
            <Text fontSize={20}>No reported matches for this group</Text>
          </Center>
        </Box>
      )}
    </Box>
  );
}

export default GroupResult;
