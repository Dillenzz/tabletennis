import { useState, ChangeEvent, useRef, useEffect } from "react";
import playersData from "./playerData.json";
import tournamentData from "./tournamentData.json";
import realPlayers from "./scrape/players.json"
import Tournament from "./components/Tournament";
import writeTournament from "./Backend/updateFirebase"





import "./App.css";
import {
  ChakraProvider,
  Button,
  Center,
  Heading,
  Box,
  Stack,
  Flex,
  Input,
  List,
  ListItem,
  Text,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  NumberInputStepper,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  RadioGroup,
  Radio,
  HStack,
  FormHelperText,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";

import {HamburgerIcon, ExternalLinkIcon, EditIcon,AddIcon,RepeatIcon } from "@chakra-ui/icons";


function App() {
  useEffect(() => {
    // Call the function on startup
    
  }, []); // Empty array as second argument to run only on startup

  


  interface Player {
    name: string;
    age: number;
    country: string;
    club: string;
    ranking: number;
  }

  const [tournamentDateFrom, setTournamentDateFrom] = useState("");
  const [tournamentDateTo, setTournamentDateTo] = useState("");
  const [tournamentLocation, setTournamentLocation] = useState("");
  const [tournamentPlayers, setTournamentPlayers] = useState("");
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [tournamentMatches, setTournamentMatches] = useState("");
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [players, setPlayers] = useState(playersData);
  const [tournamentName, setTournamentName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showMyTournaments, setShowMyTournament] = useState(false);
  //const tournaments: Tournament[] = [];

  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);
  const [numberInGroup, setNumberInGroup] = useState("4");
  const [tournamentType, setTournamentType] = useState("");

  interface Tournament {
    userId : string;
    name?: string;
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    players?: string;
    matches?: string[];
    format?: string;
    numberInGroup?: string;
    tournamentId? : string;
  }


  const handleSaveTournament = () => {
    setShowStartMenu(true);
    setShowCreateTournament(false);
    const newTournament: Tournament = {
      userId : "39",
      name: tournamentName,
      dateFrom: tournamentDateFrom,
      dateTo: tournamentDateTo,
      location: tournamentLocation,
      players: tournamentPlayers,
      //matches: tournamentMatches,
      format: tournamentType,
      numberInGroup: numberInGroup,
      tournamentId: "1"

    };
    const updatedTournaments = [...myTournaments, newTournament];
    console.log("before write")
    writeTournament(newTournament); // Write to Firebase
    console.log("after write")
    
    setMyTournaments(updatedTournaments);
    console.log(myTournaments);
    
    //console.log(myTournaments);
  };

  const handleTournamentType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value: string = event.target.value;
    setTournamentType(value);
  };

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTournamentName(event.target.value);

  const handleCreateTournament = () => {
    setShowCreateTournament(true);
    setPlayers(JSON.parse(JSON.stringify(playersData)));
    setShowStartMenu(!showStartMenu);
  };

  const handleSetMyTournaments = () => {
    setMyTournaments(JSON.parse(JSON.stringify(tournamentData)));
    console.log(myTournaments);
  };

  function handleNumberInGroup(event: ChangeEvent<HTMLInputElement>) {
    const value: string = event.target.value;
    setNumberInGroup(value); // update the state with the new value
  }

  const handleShowMyTournaments = () => {
    setShowMyTournament(!showMyTournaments);
    handleSetMyTournaments();
    setShowStartMenu(false);
  };

  const handlegoToHome = () => {
    setShowMyTournament(false);
    setShowStartMenu(true);
    setShowCreateTournament(false);

  };

  const handleGoToTournaments = () => {
    setShowMyTournament(true);
    setShowStartMenu(false);
    setShowCreateTournament(false);
    
  }

  return (
    
    <Flex
      bg="F5F5F5"
      height="100vh"
      width="100vw"
      display="flex"
      justifyContent="flex-start"
      alignItems="top"
      flexDirection="column"
      p={4}
    >
      <ChakraProvider>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList>
            <MenuItem onClick={() => handlegoToHome()} >
              Home
            </MenuItem>
            <MenuItem onClick={() => handleGoToTournaments()}>
              My Tournaments
            </MenuItem>
          
          </MenuList>
        </Menu>
        <Center>
          <Heading>Table Tennis Tournament</Heading>
        </Center>
        {showStartMenu && (
          <Center>
            <Stack>
              <Center>
                <Box>
                  <Button
                    onClick={() => handleCreateTournament()}
                    style={{ marginRight: "0.5em" }}
                  >
                    Create New Tournament
                  </Button>
                  <Button onClick={() => handleShowMyTournaments()}>
                    My tournaments
                  </Button>
                </Box>
              </Center>
            </Stack>
          </Center>
        )}

        {showMyTournaments && (
          <Box bg="#FFFFFF">
            <Center>
              <Heading>My tournaments</Heading>
            </Center>
            {myTournaments.map((tournament) => (
              <Center>
                <Box width="500px" margin={"0.3em"}>
                  <Center>
                    <Tournament
                      name={tournament.name}
                      dateFrom={tournament.dateFrom}
                      dateTo={tournament.dateTo}
                      location={tournament.location}
                    ></Tournament>
                  </Center>
                </Box>
              </Center>
            ))}
          </Box>
        )}
        {showCreateTournament && (
          <Box>
            <Center>
              <Stack>
                <FormControl isRequired>
                  <FormLabel>Tournament Name</FormLabel>
                  {/*<Text mb="8px">{value}</Text>*/}

                  <Input
                    value={tournamentName}
                    onChange={handleChange}
                    placeholder="Tournament Name"
                    size="sm"
                  />
                  <Input
                    value={tournamentDateFrom}
                    placeholder="Select Date and Time"
                    size="md"
                    type="datetime-local"
                    onChange={(e) => setTournamentDateFrom(e.target.value)}
                  ></Input>
                  <Input
                    value={tournamentDateTo}
                    placeholder="Select Date and Time"
                    size="md"
                    type="datetime-local"
                    onChange={(e) => setTournamentDateTo(e.target.value)}
                  ></Input>
                  <Button onClick={onOpen}>Tournament type</Button>
                  <Button ml={4} ref={finalRef}>
                    Done!
                  </Button>
                  <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={isOpen}
                    onClose={onClose}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Create your tournament</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={4}>
                        <FormControl>
                          <FormLabel>Type</FormLabel>
                          <Select
                            placeholder="Select option"
                            onChange={handleTournamentType}
                          >
                            <option value="groups">Groups</option>
                            <option value="bracket">Bracket</option>
                            <option value="teamMatch">Team Match</option>
                          </Select>
                        </FormControl>
                        {tournamentType == "groups" && (
                          <FormControl>
                            <Text>Groups of</Text>
                            <NumberInput
                              onChange={() => handleNumberInGroup}
                              value={numberInGroup}
                              max={20}
                              min={3}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                            <FormLabel as="legend">
                              Uneven amount of players into groups of 3 or 5?.
                            </FormLabel>
                            <RadioGroup defaultValue="3">
                              <HStack spacing="24px">
                                <Radio value="3">3</Radio>
                                <Radio value="5">5</Radio>
                              </HStack>
                            </RadioGroup>
                            <FormHelperText>
                              Only applies if groups of size 4
                            </FormHelperText>
                          </FormControl>
                        )}
                        {tournamentType == "bracket" && (
                          <FormControl>
                            <RadioGroup defaultValue="Single elimination">
                              <HStack spacing="24px">
                                <Radio value="Single elimination">
                                  Single elimination
                                </Radio>
                                <Radio value="Double elimination">
                                  Double elimination
                                </Radio>
                              </HStack>
                            </RadioGroup>
                          </FormControl>
                        )}

                        {tournamentType == "teamMatch" && (
                          <FormControl>
                            <RadioGroup defaultValue="4v4">
                              <HStack spacing="24px">
                                <Radio value="2v2">2v2</Radio>
                                <Radio value="3v3">3v3</Radio>
                                <Radio value="4v4">4v4</Radio>
                              </HStack>
                            </RadioGroup>
                          </FormControl>
                        )}
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          onClick={() => handleSaveTournament()}
                          colorScheme="blue"
                          mr={3}
                        >
                          Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </FormControl>

                <Input
                  size="md"
                  width="100%"
                  placeholder="Search player"
                ></Input>
                <List
                  mt={4}
                  overflowY="scroll"
                  border="1px solid black"
                  borderRadius="md"
                  p={2}
                >
                  {players.slice(0, 5).map((player, index) => (
                    <ListItem key={index}>{player.Name}</ListItem>
                  ))}
                </List>
              </Stack>
            </Center>
          </Box>
        )}
      </ChakraProvider>
    </Flex>
  );
}

export default App;
