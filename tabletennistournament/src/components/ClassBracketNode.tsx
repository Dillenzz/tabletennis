  import Match from "./Match";
  import { Box, Text } from "@chakra-ui/react";

  interface ClassBracketNode {
    match?: Match;
    up?: ClassBracketNode | null;
    down?: ClassBracketNode | null;
    parent?: ClassBracketNode | null;
    level?: number;
    matchNumber?: number;
  }

 
  
  


  function ClassBracketNode(props: ClassBracketNode) {
    const { match, up, down, level, matchNumber } = props;
    const currentUpMatch = up?.match;
    const currentDownMatch = down?.match;

    
    

    if (!match) {
      return null; // Terminate the recursion if there's no match
    }

    const getRoundLabel = (level: number) => {
      if (level === 0) return "Finals";
      if (level === 1) return "Semifinal";
      if (level === 2) return "Quarterfinal";
      if (level >= 3 && level <= 10) return `Round of ${Math.pow(2, 8 - level)}`;
      return ""; // Return empty string for other levels
    };
    
    return (
      <Box>
        
        {match !== undefined && (
          <Text>

              {getRoundLabel(level!)}
          </Text>
        )}
        {currentUpMatch && (
          <Box>
            <ClassBracketNode
              match={currentUpMatch}
              up={up?.up}
              level={level! + 1} // Corrected
              down={up?.down}
              
            />
          </Box>
        )}
        {currentDownMatch && (
          <Box>
            
            <ClassBracketNode
              match={currentDownMatch}
              up={down?.up}
              level={level! + 1}
              down={down?.down}
              
            />
          </Box>
        )}
      </Box>
    );
  }

  export default ClassBracketNode;
