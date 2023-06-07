import { Box, Text, Flex, Grid, Spacer } from "@chakra-ui/react";

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
  intraMatchScore?: number
  intraSetScore?: string;
  intraPointScore?: string;
  onClick?: () => void;
}
function Player(props: Player) {
  // console.log(props.intraMatchScore);
  //console.log(props.intraSetScore);
  return (
    <Box
      onClick={props.onClick}
      width="100%"
      p="1"
      _hover={{ bg: "blue.200", cursor: "pointer" }}
      bg={props.isTopPlayer ? "#A0D8B3" : "#F5F0BB"}
    >
      {props.score !== undefined && (
        <Flex alignItems="center">
          <Text fontSize={14} fontWeight={props.isTopPlayer ? "bold" : "normal"}>
            {props.name} - {props.club} {props.points} ({props.class})
          </Text>

          <Spacer />
          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            <Box textAlign="center">
              <Text>P</Text>
              <Text>{props.score}</Text>
            </Box>
            <Box textAlign="center">
              <Text>IM</Text>
              <Text
                style={{
                  textAlign:
                    props.intraMatchScore !== undefined ? "center" : "center",
                }}
              >
                {props.intraMatchScore !== undefined
                  ? props.intraMatchScore
                  : "0"}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text>IS</Text>
              <Text
                style={{
                  textAlign:
                    props.intraSetScore !== "0/0" ? "center" : "center",
                }}
              >
                {props.intraSetScore !== "0/0" ? props.intraSetScore : "0/0"}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text>IP</Text>
              <Text
                style={{
                  textAlign:
                    props.intraPointScore !== "0/0" ? "center" : "center",
                }}
              >
                {props.intraPointScore !== "0/0"
                  ? props.intraPointScore
                  : "00/00"}
              </Text>
            </Box>
          </Grid>
        </Flex>
      )}
      {props.score === undefined && (
        <Text>
          {props.name} - {props.club} {props.points} ({props.class})
        </Text>
      )}
    </Box>
  );
}
export default Player;
