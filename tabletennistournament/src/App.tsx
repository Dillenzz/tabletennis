import { useState, ChangeEvent, useRef, useEffect } from "react";
import realPlayers from "./scrape/players_with_ids.json";

import Class from "./components/Class";
import Player from "./components/Player";
import { getTournamentsByUid } from "./Backend/updateFirebase";
import writeTournament from "./Backend/updateFirebase";
import { getUsernameAndSessionDuration } from "./Backend/auth_google_provider_create";
import login from "./Backend/auth_google_provider_create";

import Tournament from "./components/Tournament";
import Match from "./components/Match";
import Group from "./components/Group";

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
} from "@chakra-ui/react";

import { HamburgerIcon, DeleteIcon } from "@chakra-ui/icons";

function App() {
  useEffect(() => {}, []);
  // Call the function on startup
  // Empty array as second argument to run only on startup

  // define state variables
  const [tournamentDateFrom, setTournamentDateFrom] = useState("");
  const [tournamentDateTo, setTournamentDateTo] = useState("");
  const [tournamentLocation, setTournamentLocation] = useState("");
  const [tournamentPlayers, setTournamentPlayers] = useState<Player[]>([]);
  const [tournamentPlayersID, setTournamentPlayersID] = useState<number[]>([]);
  const [tournamentMatches, setTournamentMatches] = useState("");
  const [tournamentName, setTournamentName] = useState("");
  const [numberInGroup, setNumberInGroup] = useState("4");
  const [tournamentType, setTournamentType] = useState("");
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<Tournament>();
  const [tournamentSeed, setTournamentSeed] = useState(0);
  const [tournamentSeededPlayers, setTournamentSeededPlayers] = useState<
    Player[]
  >([]);

  // define state variables for showing/hiding components
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [showMyTournaments, setShowMyTournament] = useState(false);
  const [showTournamentInfo, setShowTournamentInfo] = useState(false);
  const [showPlayers, setShowPlayer] = useState(false);
  const [showEditTournament, setShowEditTournament] = useState(false);
  const [showDrawTournament, setShowDrawTournament] = useState(false);

  // define state variables for player search
  const [players, setPlayers] = useState(realPlayers);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [userName, setUserName] = useState("");
  const [uid, setUid] = useState("");

  // set search variables
  const [searchName, setSearchName] = useState("");
  const [searchClub, setSearchClub] = useState("");
  const [sentPlayerIds, setSentPlayerIds] = useState<number[]>([]);

  useEffect(() => {
    // Reset all state variables to their initial values
    setShowCreateTournament(false);
    setShowStartMenu(true);
    setShowMyTournament(false);
    setShowTournamentInfo(false);
    setShowPlayer(false);
  }, []);
  // Call the function on startup and when the state variable changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadTournaments();
    }, 5000); // fetch data every 5 seconds
    return () => clearInterval(intervalId);
  }, [uid]);

  useEffect(() => {
    setSentPlayerIds(sentPlayerIds);
  }, [sentPlayerIds]);

  // save or update the tournament to Firebase
  const handleSaveTournament = () => {
    setShowStartMenu(true);
    setShowCreateTournament(false);
    const newTournament: Tournament = {
      uid: uid,
      name: tournamentName,
      dateFrom: tournamentDateFrom,
      dateTo: tournamentDateTo,
      location: tournamentLocation,
      format: tournamentType,
      numberInGroup: numberInGroup,
      players: tournamentPlayers,
      seeds: tournamentSeed,
      seededPlayers: tournamentSeededPlayers,
    };
    const updatedTournaments = [...myTournaments, newTournament];
    writeTournament(newTournament); // Write to Firebase
    setMyTournaments(updatedTournaments);
  };
  // function to load players in search
  const handleNameSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const handleClubSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchClub(event.target.value);
  };
  // define tournament type
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
  // changes view to tournament info
  const handleCreateTournament = () => {
    setShowCreateTournament(true);
    setShowStartMenu(!showStartMenu);
  };
  // from uid get tournaments and set them to myTournaments
  const handleSetMyTournaments = async (uid: string) => {
    const loadTournaments = await getTournamentsByUid(uid);
    setMyTournaments(loadTournaments);
  };
  // define group size
  function handleNumberInGroup(event: ChangeEvent<HTMLInputElement>) {
    const value: string = event.target.value;
    setNumberInGroup(value); // update the state with the new value
  }
  // show all tournaments
  const handleShowMyTournaments = () => {
    setShowMyTournament(!showMyTournaments);
    setShowStartMenu(false);
    loadTournaments();
  };
  // go home resets all state variables
  const handlegoToHome = () => {
    setShowMyTournament(false);
    setShowStartMenu(true);
    setShowCreateTournament(false);
    setShowTournamentInfo(false);
    setShowPlayer(false);
  };
  // go to tournament info
  const handleGoToTournaments = () => {
    setShowMyTournament(true);
    setShowStartMenu(false);
    setShowCreateTournament(false);
    setShowTournamentInfo(false);
    setShowPlayer(false);
  };
  // login with google
  async function handleGoogleLogin() {
    await login();
    const user1 = await getUsernameAndSessionDuration();
    if (user1) {
      setUid(user1.uid);
      setUserName(user1.username);
      handleSetMyTournaments(user1.uid);
    }
  }
  // loads tournaments if not loaded already
  async function loadTournaments() {
    const user = await getUsernameAndSessionDuration();
    if (user) {
      setUid(user.uid);
      setUserName(user.username);
      handleSetMyTournaments(user.uid);
    }
  }
  // go to tournament page and load tournament info
  const handleStartTournament = (tournament: Tournament) => {
    setCurrentTournament(tournament);
    setTournamentPlayers(tournament.players ? tournament.players : []);
    setShowTournamentInfo(true);
    setShowMyTournament(false);
    setShowStartMenu(false);
    setShowCreateTournament(false);
    setShowPlayer(true);
    setSentPlayerIds(
      tournament.players
        ? tournament.players
            .filter((player) => player.id !== undefined)
            .map((player) => player.id as number)
        : []
    );
  };
  const filteredPlayers = realPlayers.filter((player) => {
    const nameMatch = player.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const clubMatch = player.club
      .toLowerCase()
      .includes(searchClub.toLowerCase());

    return nameMatch && clubMatch;
  });
  // add player to tournament
  async function addPlayerToTournament(player: Player) {
    const playerId = typeof player.id === "number" ? player.id : -1; // Use a default value if id is undefined

    if (sentPlayerIds.includes(playerId)) {
      // Player has already been sent, do nothing
      return;
    }

    const newPlayers = [...tournamentPlayers, player];
    await setTournamentPlayers(newPlayers);
    if (currentTournament) {
      setCurrentTournament({
        ...currentTournament,
        players: newPlayers,
      });
    }
    await setSentPlayerIds([...sentPlayerIds, playerId]);
  }
  // save tournament to firebase
  function saveTournament() {
    if (currentTournament) {
      const newTournament: Tournament = {
        ...currentTournament,
        players: tournamentPlayers,
        seededPlayers: tournamentSeededPlayers,
      };
      writeTournament(newTournament);
    }
  }
  // delete player from tournament
  function deletePlayerFromTournament(player: Player) {
    const newPlayers = tournamentPlayers.filter((p) => p.id !== player.id);

    setTournamentPlayers(newPlayers);
    setSentPlayerIds(sentPlayerIds.filter((id) => id !== player.id));
    if (currentTournament) {
      setCurrentTournament({
        ...currentTournament,
        players: newPlayers,
      });
    }
  }

  function handleSetTournamentSeededPlayers(players: Player[]) {
    console.log(players);
    const totalPlayers = players.length;

    let numSeeds = 0;

    if (totalPlayers <= 4) {
      numSeeds = 0;
    } else if (totalPlayers <= 16) {
      numSeeds = 2;
    } else if (totalPlayers <= 32) {
      numSeeds = 4;
    } else if (totalPlayers <= 64) {
      numSeeds = 8;
    } else if (totalPlayers <= 128) {
      numSeeds = 16;
    } else if (totalPlayers <= 256) {
      numSeeds = 32;
    }

    const seededPlayers = players.slice(0, numSeeds);
    setTournamentSeededPlayers(seededPlayers);
    console.log(tournamentSeededPlayers);
  }

  function handleEditTournaments(tournament: Tournament) {
    setShowMyTournament(false);
    setShowStartMenu(false);
    setShowCreateTournament(false);
    setShowTournamentInfo(false);
    setShowPlayer(false);
    setShowEditTournament(true);
    setCurrentTournament(tournament);
  }

  function handleDrawTournament(tournament: Tournament) {
    setShowMyTournament(false);
    setShowStartMenu(false);
    setShowCreateTournament(false);
    setShowTournamentInfo(false);
    setShowPlayer(false);
    setShowEditTournament(false);
    setShowDrawTournament(true);
    setCurrentTournament(tournament);
    drawTournament(tournament);
  }

  function drawTournament(tournament: Tournament): void {
    const players = tournament.players;
    const seededPlayers = tournament.seededPlayers;
    
  }


  return (
    <Flex
      bg="#C1D0B5"
      height="100vh"
      width="100vw"
      display="flex"
      justifyContent="flex-start"
      alignItems="top"
      flexDirection="column"
      p={4}
    >
      <ChakraProvider>
        <Center>
          <Box bg="#C1D0B5" p={1}>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList>
                <MenuItem onClick={() => handlegoToHome()}>Home</MenuItem>
                <MenuItem onClick={() => handleGoToTournaments()}>
                  My Tournaments
                </MenuItem>
              </MenuList>
            </Menu>

            <Button onClick={() => handleGoogleLogin()} ml={2}>
              {" "}
              Sign in
            </Button>
          </Box>
        </Center>
        <Center>{userName && <Text> Username: {userName}</Text>}</Center>
        <Center>
          <Heading color="#FFF8DE" fontFamily={"cursive"}>
            FirstToEleven
          </Heading>
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
          <Box>
            <Center>
              <Button onClick={() => loadTournaments()}>
                Load tournaments
              </Button>
            </Center>
            <Center>
              <Heading>My tournaments</Heading>
            </Center>
            {myTournaments
              .filter((tournament) => tournament.uid === uid)
              .map((tournament, index) => {
                return (
                  <Center key={`${tournament.tournamentId}-${index}`}>
                    <Box
                      onClick={() => handleStartTournament(tournament)}
                      width="500px"
                      margin={"0.3em"}
                    >
                      <Center>
                        <Tournament
                          name={tournament.name}
                          dateFrom={tournament.dateFrom}
                          dateTo={tournament.dateTo}
                          location={tournament.location}
                        ></Tournament>
                      </Center>
                    </Box>
                    <Box p={1}>
                      <Button onClick={() => handleEditTournaments(tournament)}>
                        Edit tournament
                      </Button>
                    </Box>
                  </Center>
                );
              })}
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
              </Stack>
            </Center>
          </Box>
        )}

        {showTournamentInfo && (
          <Box>
            <Center>
              <Stack>
                <Box>
                  {currentTournament && (
                    <Heading fontFamily={"cursive"}>
                      {currentTournament.name}
                    </Heading>
                  )}
                </Box>
                <Button onClick={onOpen}>Add players</Button>
              </Stack>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Add player</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text mb="8px">Name: {searchName}</Text>
                    <Input
                      value={searchName}
                      onChange={handleNameSearch}
                      placeholder=""
                      size="sm"
                    />
                    <Text mb="8px">Club: {searchClub}</Text>
                    <Box>
                      <Input
                        value={searchClub}
                        onChange={handleClubSearch}
                        placeholder=""
                        size="sm"
                      />
                    </Box>
                    <Box mt={4}>
                      {filteredPlayers.slice(0, 25).map((player) => {
                        return (
                          <Box
                            mt={1}
                            key={player.id}
                            onClick={async () => {
                              await addPlayerToTournament(player);
                            }}
                          >
                            <Player
                              name={player.name}
                              club={player.club}
                            ></Player>
                          </Box>
                        );
                      })}
                    </Box>
                  </ModalBody>

                  <ModalFooter>
                    <Button onClick={onClose} colorScheme="blue" mr={3}>
                      Done
                    </Button>
                    <Button variant="ghost">More players</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Center>
          </Box>
        )}
        {showPlayers && (
          <Box width="35%">
            <Flex>
              <Button onClick={() => saveTournament()}>Save Tournament</Button>

              <Button
                onClick={() =>
                  handleSetTournamentSeededPlayers(
                    currentTournament?.players || []
                  )
                }
              >
                Seed players
              </Button>

              {currentTournament && (
                <Button onClick={() => handleDrawTournament(currentTournament)}>
                  Draw Tournament
                </Button>
              )}
            </Flex>
            <Box
              style={{
                overflow: "auto",
                maxHeight: "400px",
                maxWidth: "400px",
              }}
            >
              {currentTournament &&
                currentTournament.players &&
                currentTournament.players
                  .sort((a, b) => {
                    if (!a.points || !b.points) {
                      return 0;
                    }
                    return parseInt(b.points) - parseInt(a.points);
                  })
                  .map((player) => {
                    const isSeeded =
                      currentTournament.seededPlayers?.includes(player);
                    return (
                      <Box
                        p={[0, 0.5]}
                        key={player.id}
                        display="flex"
                        alignItems="horizontal"
                      >
                        <div
                          style={{ fontWeight: isSeeded ? "bold" : "normal" }}
                        >
                          <Flex>
                            <IconButton
                              aria-label="Open chat"
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              onClick={() => {
                                deletePlayerFromTournament(player);
                              }}
                              size={"sm"}
                            />
                            <Player
                              name={player.name}
                              club={player.club}
                              points={player.points}
                            ></Player>
                          </Flex>
                        </div>
                      </Box>
                    );
                  })}
            </Box>
          </Box>
        )}
      </ChakraProvider>
    </Flex>
  );
}

export default App;
