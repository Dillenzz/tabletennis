import { Box, Heading, Text, Center, Spacer } from "@chakra-ui/react";
import Player from "./Player";
import Class from "./Class";
import Group from "./Group";
import Match from "./Match";

interface Tournament {
  uid?: string;
  name?: string;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  players?: Player[] | undefined;
  matches?: Match[];
  format?: string;
  numberInGroup?: number;
  tournamentId?: number;
  class?: Class[];
  seeds?: number;
  seededPlayersIds?: number[];
  threeOrFive?: string;
  groups?: Group[];
  started?: boolean;
  readyToStart?: boolean;
  bo?: string;
  startBracket?: boolean;
}

function Tournament(props: Tournament) {
  return (
    <Box
      width={"85%"}
      p="2"
      _hover={{ bg: "#DBDFAA" , cursor: "pointer" }}
      bg="#F5F0BB"
      rounded="lg"
    >
      <Box>
        <Center>
          <Heading margin={"1em"} as="h2" mb="2">
            {props.name}
          </Heading>
        </Center>
      </Box>

      <Box>
        <Center>
          <Text fontWeight={"bold"} fontSize={"20"}>
            Location: {props.location}
          </Text>

          <Spacer></Spacer>
          <Text fontSize={"20"}>
            Date: {props.dateFrom} - {props.dateTo}
          </Text>
        </Center>
      </Box>
    </Box>
  );
}
export default Tournament;
