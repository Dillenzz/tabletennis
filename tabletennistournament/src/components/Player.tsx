import { Box, Text, Center } from "@chakra-ui/react";

interface Player {
  worldRanking?: null | string;
  nationalRanking?: string;
  pastRanking?: string;
  name?: string;
  birthYear?: string;
  club?: string;
  points?: number | null;
  pointsChange?: number;
  gender?: string;
  id: number;
  score?: number;
  class? : string;
  onClick?: () => void;
}
function Player(props: Player) {
  return (
    <Box
      onClick={props.onClick}
      width={"100%"}
      p="1"
      _hover={{ bg: "green.100" }}
      bg="blue.100"
      rounded="lg"
    >
      <Center>
        <Text>
          {props.name} - {props.club} {props.points} ({props.class}) {props.score}
        </Text>
      </Center>
    </Box>
  );
}
export default Player;
