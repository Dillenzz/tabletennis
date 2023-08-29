import Match from "./Match";
import Player from "./Player";
import ClassBracketNode from "./ClassBracketNode";
import { Box, Grid } from "@chakra-ui/react";

interface ClassBracket {
  root?: ClassBracketNode;
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

  //console.log(matchesEachRound, "matchesEachRound");
    
  
  return (
    <Box>
      <Grid>
      </Grid>
       {/*} <ClassBracketNode
          up={props?.root?.up}
          down={props?.root?.down}
          match={props?.root?.match}
          level={props?.root?.level}
          matchNumber={props?.root?.level}
        />
  */}
      
    </Box>
  );
}
export default ClassBracket;
