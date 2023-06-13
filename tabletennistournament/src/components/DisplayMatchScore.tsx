import { Box, Text, Center, Flex, Stack } from "@chakra-ui/react";
import Match from "./Match";
import Set from "./CustomSet";

interface DisplayMatchScoreProps {
  match: Match;
}

function DisplayMatchScore(props: DisplayMatchScoreProps) {
  return (
    <Box
      width={"100%"}
      p="1"
      _hover={{ cursor: "pointer", bg: "green.100" }}
      bg="#B799FF"
      rounded="lg"
    >
      <Stack>
        <Flex margin={"1"}>
          <Box>
            <Text> Match ID {props.match.matchId}</Text>
          </Box>
        </Flex>
        <Box>
          <Center>
            <Text fontSize="20">
              {props.match.player1?.name} - {props.match.player2?.name}
            </Text>
          </Center>
        </Box>

        <Flex>
          {props.match.sets &&
            props.match.sets.map((set: Set, index: number) => {
              if (set.player1Score !== 0 || set.player2Score !== 0) {
                return (
                  <Box width={"100%"} margin="4" key={index}>
                    <Text fontSize={14}>Set {index + 1}</Text>
                    <Text fontSize={20}>
                      {set.player1Score} 
                    </Text>
                    <Text fontSize={20}>
                      {set.player2Score}
                    </Text>
                  </Box>

                );
              } else {
                return null; // Skip rendering the set
              }
            })}
             <Stack>
              <Text fontWeight={"bold"} fontSize={"15"}>Winner</Text>
              <Text>{props.match.winner?.name}</Text>
              <Text> {props.match.player1wonSets} - {props.match.player2wonSets}</Text>
              </Stack>
        </Flex>
      </Stack>
    </Box>
  );
}

export default DisplayMatchScore;
