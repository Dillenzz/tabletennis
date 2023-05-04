import { Box, Heading, Text, Center } from "@chakra-ui/react";

interface TournamentProps {
  name?: string;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  players?: string;
  format?: string;
}

function Tournament(props: TournamentProps){
    console.log(props)
  return (
    <Box width={"100%"} p="2" _hover={{ bg: "green.100" }} bg="blue.100" rounded="lg">
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
};
export default Tournament;
