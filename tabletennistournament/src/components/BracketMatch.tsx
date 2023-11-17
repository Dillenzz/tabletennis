import Player from "./Player";
import Match from "./Match";
import CustomSet from "./CustomSet";
import { Box, Text,  Stack, Flex } from "@chakra-ui/react";
interface BracketMatch {
  match: Match;
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
        <Text fontSize={12}>{props.match.player1?.name ? props.match.player1?.name : "Laban"}</Text>

          

          <Text fontSize={12}>{props.match.player2?.name ? props.match.player2?.name : "Laban"}</Text>

        </Box>
      </Stack>
    </Flex>
  );
}

export default BracketMatch;
