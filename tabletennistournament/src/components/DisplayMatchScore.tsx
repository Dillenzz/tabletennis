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
      p={"1"}
      _hover={{ cursor: "pointer", bg: "green.100" }}
      bg={"#FAF1E4"}
      rounded="lg"
    >
      <Stack>
      <Center>
        <Flex margin={"1"}>
          
          <Box>
            <Text fontWeight={"bold"}> Match ID {props.match.matchId}</Text>
          </Box>
          
        </Flex>
        </Center>
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
                    <Center>
                    <Text fontSize={14}>Set {index + 1}</Text>
                    </Center>
                    <Center>
                    <Text fontSize={20}>
                      {set.player1Score} 
                    </Text>
                    </Center>
                    <Center>
                    <Text fontSize={20}>
                      {set.player2Score}
                    </Text>
                    </Center>
                  </Box>

                );
              } else {
                return null; // Skip rendering the set
              }
            })}
            <Center>
             <Stack>
              <Center>
              <Text fontWeight={"bold"} fontSize={"15"}>Winner</Text>
              </Center>
              <Center>
              <Text>{props.match.winner?.name}</Text>
              </Center>
              <Center>
              <Text> {props.match.player1wonSets} - {props.match.player2wonSets}</Text>
              </Center>
              </Stack>
              </Center>
        </Flex>
      </Stack>
    </Box>
  );
}

export default DisplayMatchScore;
