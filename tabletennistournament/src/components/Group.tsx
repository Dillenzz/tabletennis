import Player from "./Player";
import Match from "./Match";
import { Box, Text, Center } from "@chakra-ui/react";
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

function Group(props: Group) {
  const { name, players, seededPlayersIds } = props;

  return (
    <Box border="1px" shadow={"md"} width="100%"   rounded="lg">
      <Center>
        <Text style={{ fontWeight: "bold" }}>Group {name}</Text>
      </Center>

      {players && (
        <Box shadow={"md"}>
          {players?.map((player) => {
            if (seededPlayersIds?.includes(player.id)) {
              return (
                <SeededPlayer
                  onClick={() => console.log("clicked")}
                  key={player.id}
                  id={player.id}
                  name={player.name}
                  club={player.club}
                  class={player.class}
                  css="group-player"
                />
              );
            }

            return (
              <Player
                onClick={() => console.log("clicked")}
                key={player.id}
                id={player.id}
                name={player.name}
                club={player.club}
                class={player.class}
                css="group-player"
              />
            );
          })}
          
        </Box>
      )}
      {/*<Center>
      <Text style={{ fontWeight: "bold" }}>Group {name}</Text>
      </Center>
      */}
    </Box>
  );
}

export default Group;
