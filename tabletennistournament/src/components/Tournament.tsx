import { Box, Heading, Text, Center } from "@chakra-ui/react";
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
}

function Tournament(props: Tournament) {
  return (
    <Box
      width={"85%"}
      p="2"
      _hover={{ bg: "green.100" }}
      bg="blue.100"
      rounded="lg"
    >
      <Center>
        <Heading margin={"1em"} as="h2" mb="2">
          {props.name}
        </Heading>
      </Center>
      <Text>
        Date: {props.dateFrom} - {props.dateTo}
      </Text>
      <Text>Location: {props.location}</Text>
    </Box>
  );
}
export default Tournament;
