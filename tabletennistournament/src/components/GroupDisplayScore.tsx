import Player from "./Player";
import Match from "./Match";
import { Box, Heading, Text, Center } from "@chakra-ui/react";
import SeededPlayer from "./SeededPlayer";

interface GroupDisplayScore {
  groupName?: number;
  players?: Player[];
  matches?: Match[];
  format?: string;
  numberInGroup?: number;
  tournamentId?: number;
  seededPlayersIds?: number[];
  onPlayerClick?: (player: Player) => void;
}


function GroupDisplayScore(props: GroupDisplayScore) {
  const { groupName, players, seededPlayersIds } = props;

  return (
    <Box  width="100%" height=""  _hover={{ bg: "green.100" }} bg="blue.100" rounded="lg">
      <Center>
        <Text style={{ fontWeight: "bold" }}>Group {groupName}</Text>
      </Center>

      {players && (
        <Box>
          {players?.map((player) => {
            if (seededPlayersIds?.includes(player.id)) {
              return (
                <SeededPlayer
                  onClick= {() => props.onPlayerClick?.(player)}
                  key={player.id}
                  id={player.id}
                  name={player.name}
                  club={player.club}
                  class={player.class}
                />
              );
            }

            return (
              <Player
                onClick={() => props.onPlayerClick?.(player)}
                key={player.id}
                id={player.id}
                name={player.name}
                club={player.club}
                class={player.class}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export default GroupDisplayScore;
