import { Box, Heading, Text, Center, Spacer } from "@chakra-ui/react";

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
}

function Tournament(props: Tournament) {
  return (
    <Box
    >
      <Box>
        <Center>
          <Heading margin={"1em"} as="h2" mb="2">
            {props.name}
          </Heading>
        </Center>
      </Box>

      <Box justifyContent={"left"}>
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
