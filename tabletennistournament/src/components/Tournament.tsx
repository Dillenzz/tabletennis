import { Box, Heading, Text, Flex, Center } from "@chakra-ui/react";
import Class from "./Class";

interface Tournament {
  uid?: string;
  name?: string;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  tournamentId?: number;
  classes?: Class[];
  public?: string;
  club?: string;
}

function Tournament(props: Tournament) {
  return (
    <Box>
      <Box>
        <Center>
          <Heading as="h2" m={2}>
            {props.name}
          </Heading>
        </Center>
      </Box>
      <Center>
      <Flex direction="column">
        {props.location && (
          <Text  fontSize="14" ml={2}>
            Location: {props.location}
          </Text>
        )}

        {props.dateFrom && props.dateTo && (
          <Text fontSize="14" ml={2}>
            Date: {props.dateFrom} -- {props.dateTo}
          </Text>
        )}

        {props.club && (
          <Text fontSize="14" ml={2}>
            Club: {props.club}
          </Text>
        )}
      </Flex>
      </Center>
    </Box>
  );
}

export default Tournament;
