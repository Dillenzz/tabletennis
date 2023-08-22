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
          <Heading size="md" m={1}>
            {props.name}
          </Heading>
        </Center>
      </Box>
      <Center>
      <Flex direction="column">
        {props.location && (
          <Text color={"black"}  fontSize="10" ml={1} >
            Location: {props.location}
          </Text>
        )}

        {props.dateFrom && props.dateTo && (
          <Text color={"black"} fontSize="10" ml={1}>
            Date: {props.dateFrom} / {props.dateTo}
          </Text>
        )}

        {props.club && (
          <Text color={"black"} fontSize="10" ml={1} mb={1}>
            Club: {props.club}
          </Text>
        )}
      </Flex>
      </Center>
    </Box>
  );
}

export default Tournament;
