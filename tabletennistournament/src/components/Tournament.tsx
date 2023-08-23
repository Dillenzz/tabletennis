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
          <Heading fontWeight={"bold"} size="md" m={1}>
            {props.name}
          </Heading>
        </Center>
      </Box>
      <Center>
      <Flex direction="column">
        {props.location && (
           <Flex>
           <Text color={"black"} fontSize="10" mr={2} >
             Loca: 
           </Text>
           <Text color={"grey"} fontSize="10">{props.location}</Text>
           </Flex>
        )}

        {props.dateFrom && props.dateTo && (
          <Flex>
          <Text color={"black"} fontSize="10" mr={2} >
            Date: 
          </Text>
          <Text color={"grey"} fontSize="10">{props.dateFrom} / {props.dateTo}</Text>
          </Flex>
        )}

        {props.club && (
          <Flex>
          <Text color={"black"} fontSize="10" mr={2} mb={1}>
            Club:   
          </Text>
          <Text color={"grey"} fontSize={"10"}> {props.club}</Text>
          </Flex>
        )}
      </Flex>
      </Center>
    </Box>
  );
}

export default Tournament;
