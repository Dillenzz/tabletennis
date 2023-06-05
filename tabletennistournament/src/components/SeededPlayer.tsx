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
  id?: number;
  class? : string;
  isTopPlayer?: boolean;
  onClick?: () => void
  
}
function SeededPlayer(props: Player) {
  return (
    <Box
     onClick={props.onClick}
      width={"100%"}
      p="1"
      _hover={{ bg: "green.100", cursor:"pointer" }}
      bg="#F5F0BB"
      rounded="lg"
    >
      <Center>
        <Text fontWeight={"bold"}>
          {props.name} - {props.club} ({props.class}) {props.points}
        </Text>
      </Center>
    </Box>
  );
}
export default SeededPlayer;
