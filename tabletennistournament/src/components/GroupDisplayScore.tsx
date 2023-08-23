import Player from "./Player";
import Match from "./Match";
import { Box, Text, Center } from "@chakra-ui/react";
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
    <Box>
    <Center>
        <Text p={2}   borderRadius={"10"}  fontSize={20} style={{ fontWeight: "bold" }}>Group {groupName}</Text>
      </Center>
    <Box padding={2} shadow={"md"}    width="100%"   rounded="lg">
      

      {players && (
        <Box m={2}>
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
    </Box>
  );
}

export default GroupDisplayScore;
