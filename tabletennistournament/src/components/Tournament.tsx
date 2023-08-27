import { Box, Heading, Text, Flex, Center } from "@chakra-ui/react";
import Class from "./Class";

interface Tournament {
  uid?: string;
  name?: string;
  dateFrom?: string;
  dateTo?: string;
  city?: string;
  tournamentId?: number;
  classes?: Class[];
  public?: string;
  club?: string;
  arena?: string;
}

function Tournament(props: Tournament) {
  return (
    <Box>
      <Box>
        <Center>
          <Heading fontSize={"24px"} fontWeight={"bold"} size="lg" m={1}>
            {props.name}
          </Heading>
        </Center>
      </Box>
      <Center>
      <Flex direction="column">
        {props.city && (
           <Flex>
           
           <Box >
           <Text color={"#183153"} fontSize="12">{props.city}</Text>
           </Box>
           </Flex>
        )}

        {props.dateFrom && props.dateTo && (
          <Flex>
          
          <Box >
          <Text color={"#183153"} fontSize="12">{props.dateFrom} / {props.dateTo}</Text>
          </Box>
          </Flex>
        )}

        {props.club && (
          <Flex>
          
          <Box >
          <Text color={"#183153"} fontSize={"12"}> {props.club}</Text>
          </Box>
          </Flex>
        )}

        {props.arena && (
          <Flex>
          
          <Text color={"#183153"} fontSize={"12"}> {props.arena}</Text>

      </Flex>
        )}
      </Flex>
      </Center>
    </Box>
  );
}

export default Tournament;
