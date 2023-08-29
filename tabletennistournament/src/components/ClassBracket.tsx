import Match from "./Match";
import Player from "./Player";
import ClassBracketNode from "./ClassBracketNode";
import BracketMatch from "./BracketMatch";
import { Box, Center, Flex } from "@chakra-ui/react";
import "./ClassBracket.css";

interface ClassBracket {
  root?: ClassBracketNode;
  rootList?: ClassBracketNode[];
  matches?: Match[];
  players?: Player[][];
  tournamentId?: number;
  classId?: number;
}

function ClassBracket(props: ClassBracket | undefined) {
  console.log(props?.matches, "matches1");

  let matchesReversed = props?.matches ? [...props.matches].reverse() : [];

  console.log(matchesReversed, "matches2");
  let matchesPerRound = [512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
  let matchesEachRound = [];

  let matchesLength = matchesReversed.length;
  let isFullBracket = false;
  for (let i = 0; i < matchesPerRound.length; i++) {
    if (matchesLength === matchesPerRound[i] - 1) {
      isFullBracket = true;
      // never enters this loop because we alays generate whole bracket even though it is not full
      break;
    }
  }

  if (isFullBracket) {
    for (let i = 0; i < matchesPerRound.length; i++) {
      if (matchesLength >= matchesPerRound[i]) {
        matchesEachRound.push(matchesPerRound[i]);
        matchesLength = matchesLength - matchesPerRound[i];
        console.log(matchesEachRound, "matchesEachRound");
      }
    }
  } else {
    console.log("should not else");
    for (let i = 0; i < matchesPerRound.length; i++) {
      if (matchesLength >= matchesPerRound[i]) {
        matchesLength = matchesLength - (matchesLength - matchesPerRound[i]);
        matchesEachRound.push(matchesLength);
        break;
      }
    }
    for (let i = 0; i < matchesPerRound.length; i++) {
      if (matchesLength >= matchesPerRound[i]) {
        matchesEachRound.push(matchesPerRound[i]);
        matchesLength = matchesLength - matchesPerRound[i];
      }
    }
  }

  function renderMatches(matches: number) {
    // Replace this function with your own logic to render match components
    // based on the number of matches in each round
    return new Array(matches).fill(null).map((_, index) => (
      <Box key={index} p={2} borderWidth="1px" borderRadius="md">
        Match {index + 1}
      </Box>
    ));
  }
  console.log(props?.rootList, "rootList");
  //console.log(matchesEachRound, "matchesEachRound");
  const numColumns = matchesEachRound.length;

  return (
    <Flex>
      <Flex
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
          gap: "10px",
        }}
      >
        {matchesEachRound.map((count, columnIndex) => (
          <Flex
            key={columnIndex}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Array.from({ length: count }).map((_, index) => (
              <Center key={index}>
                <Flex
                  style={{
                    marginTop: `${
                      count === 8
                        ? "5px"
                        : count === 4
                        ? "20px"
                        : count === 2
                        ? "50px"
                        : count === 1
                        ? "30px"
                        : "30px"
                    }`,
                    marginBottom: `${
                      count === 8
                        ? "5px"
                        : count === 4
                        ? "20px"
                        : count === 2
                        ? "50px"
                        : count === 1
                        ? "30px"
                        : "30px"
                    }`
                  }}
                >
                  {/*Column {columnIndex + 1}, Item {index + 1}*/}
                  <BracketMatch></BracketMatch>
                </Flex>
              </Center>
            ))}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default ClassBracket;
