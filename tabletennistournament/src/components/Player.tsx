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
  class?: string;
  isTopPlayer?: boolean;
  onClick?: () => void;
}
function Player(props: Player) {
  return (
    <Box
      onClick={props.onClick}
      width={"100%"}
      p="1"
      _hover={{ bg: "blue.200" }}
      bg={props.isTopPlayer ? "#A0D8B3" : "#F5F0BB"}
      
    >
      {props.score !== undefined && (
        <Center>
          {props.isTopPlayer && ( <Text fontWeight={"bold"}> {props.name} - {props.club} {props.points} ({props.class}) - {" "}
            {props.score} 🏓</Text>
          )}
          {!props.isTopPlayer && (
          <Text>
            {props.name} - {props.club} {props.points} ({props.class}) - {" "}
            {props.score}
          </Text>
          )}
        </Center>
      )}
      {props.score === undefined && (
        <Center>
          <Text>
            {props.name} - {props.club} {props.points} ({props.class})
          </Text>
        </Center>
      )}
    </Box>
  );
}
export default Player;
