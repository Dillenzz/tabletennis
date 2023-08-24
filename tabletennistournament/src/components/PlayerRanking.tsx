
import {Flex, Text, Box } from "@chakra-ui/react";




interface PlayerRanking {
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
  class?: string;
  firstName?: string;
    lastName?: string; 
    index?: number;
}

function PlayerRanking(props: PlayerRanking) {

    const isEvenIndex = props.index! % 2 === 0;
    const backgroundStyle = isEvenIndex ? { backgroundColor: '#FAF1E4' } : { backgroundColor: 'white' };
    return (

        <Box border= "1px" _hover={{shadow: "md", cursor: "pointer"}} style={backgroundStyle}>
        <Flex  align="center">
            <Text>{props.nationalRanking}</Text>

            
          <Text flex="1" textAlign="center">
            {props.firstName} {props.lastName}
          </Text>
          
          <Text flex="1" textAlign="center">{props.birthYear}</Text>
          <Text flex="1" textAlign="center">
            {props.club}
          </Text>
          <Text flex="1" textAlign="center">
            {props.points}
          </Text>
        </Flex>
      </Box>
      
    )
}

export default PlayerRanking;