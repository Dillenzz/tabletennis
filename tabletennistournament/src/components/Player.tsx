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
  intraMatchScore?: number | undefined;
  intraSetScore?: string | undefined;
  intraPointScore?: string | undefined; 
  onClick?: () => void;
  sentPlayerIds?: number[];
  css?: string;
}

function Player(props: Player) {
  const isSentPlayer = props.sentPlayerIds?.includes(props.id);
  const isGroupPlayer = props.css === "group-player";
  
  const backgroundColor = isGroupPlayer
    ? "transparent"
    : isSentPlayer
    ? "green.200"
    : props.isTopPlayer
    ? "#FFFFFF"
    : "#FFFFFF";

  const hoverStyle = isGroupPlayer ? {} : { bg: "blue.200", cursor: "pointer" };

  return (
    <Box
      onClick={props.onClick}
      width="100%"
      p="1"
      borderRadius="md"
      _hover={hoverStyle}
      bg={backgroundColor}
      shadow={isGroupPlayer ? "none" : "md"}
    >
      {props.score !== undefined && (
        <Flex p={"2"} borderRadius={"10px"} bg={props.isTopPlayer ? "green.200" : "transparent"} alignItems="center">
          <Text 
            fontSize={14}
            fontWeight={props.isTopPlayer ? "bold" : "normal"}
            
          >
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
          {props.name} - {props.club} - {props.points} ({props.class})
        </Text>

        
      )}
      
    </Box>
  );
}

export default Player;
