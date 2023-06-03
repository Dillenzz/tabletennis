import Player from './Player';
import CustomSet from './CustomSet';
import { Box, Text, Center } from "@chakra-ui/react";
interface   Match {
    matchId?: number;
    player1?: Player;
    player2?: Player;
    sets?: CustomSet[];
    tournamentId?: number;
    round?: string;
    group?: number;
    winner?: Player;
    loser?: Player;
    date?: string;
    reported?: boolean;
    player1wonSets?: number;
    player2wonSets?: number;
}


function Match(props: Match){
    return (
      
      <Box width={"100%"} p="1" _hover={{ cursor:"pointer", bg: "green.300" }} bg="#F7E1AE" rounded="lg">
        <Center>
        <Text fontSize="30">#{props.matchId} {props.player1?.name} - {props.player2?.name}</Text>
        </Center>
      </Box>
    );
  };

export default Match;