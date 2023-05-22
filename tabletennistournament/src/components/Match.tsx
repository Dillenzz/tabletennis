import Player from './Player';
import set from './Set';
import { Box, Text, Center } from "@chakra-ui/react";
interface   Match {
    matchId?: number;
    player1?: Player;
    player2?: Player;
    score?: set[];
    tournamentId?: number;
    round?: string;
    group?: number;
    winner?: Player;
    loser?: Player;
    date?: string;
    reported?: boolean;
}


function Match(props: Match){
    return (
      
      <Box width={"100%"} p="1" _hover={{ bg: "green.100" }} bg="blue.100" rounded="lg">
          
        <Text>{props.matchId}: {props.player1?.name} - {props.player2?.name}</Text>
        
      </Box>
    );
  };

export default Match;