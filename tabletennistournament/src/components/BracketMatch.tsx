import Player from "./Player";
import CustomSet from "./CustomSet";
import { Box, Text, Center, Stack, Flex } from "@chakra-ui/react";
interface BracketMatch {
  matchId?: number;
  player1?: Player | null | undefined;
  player2?: Player | null | undefined;
  sets?: CustomSet[];
  tournamentId?: number;
  round?: string;
  winner?: Player | null;
  loser?: Player;
  date?: string;
  reported?: boolean;
  player1wonSets?: number;
  player2wonSets?: number;
  player1lostSets?: number;
  player2lostSets?: number;
  player1wonPoints?: number;
  player2wonPoints?: number;
  player1lostPoints?: number;
  player2lostPoints?: number;
}

function BracketMatch(props: BracketMatch) {
  return (
    <Flex
      shadow="md"
      
      _hover={{ cursor: "pointer", bg: "green.200" }}
      flexDirection="column"
    >
      <Stack>
        <Box>
          <Text fontSize="8">Dillström J {props.player1?.name}</Text>

          

          <Text fontSize="8">Daniselsson D {props.player2?.name}</Text>
        </Box>
      </Stack>
    </Flex>
  );
}

export default BracketMatch;
