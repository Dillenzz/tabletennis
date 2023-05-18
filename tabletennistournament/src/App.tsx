import { useState, ChangeEvent, useRef, useEffect } from "react";
import realPlayers from "./scrape/players_with_ids.json";

import Class from "./components/Class";
import Player from "./components/Player";
import { getTournamentsByUid } from "./Backend/updateFirebase";
import writeTournament from "./Backend/updateFirebase";
import { getUsernameAndSessionDuration } from "./Backend/auth_google_provider_create";
import login from "./Backend/auth_google_provider_create";

import Tournament from "./components/Tournament";
import SeededPlayer from "./components/SeededPlayer";
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
  Spacer,
  ButtonGroup,
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
  const [tournamentMatches, setTournamentMatches] = useState(4);
  const [tournamentName, setTournamentName] = useState("");
  const [numberInGroup, setNumberInGroup] = useState(4); //TODO FIX DEFAULT VALUE
  const [tournamentType, setTournamentType] = useState("");
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);
  const [threeOrFive, setThreeOrFive] = useState("3");
  const [currentTournament, setCurrentTournament] = useState<Tournament>();
  const [tournamentSeed, setTournamentSeed] = useState();
  const [tournamentSeededPlayersIds, setTournamentSeededPlayers] = useState<
    number[]
  >([]);
  const [tournamentId, setTournamentId] = useState();

  // define state variables for showing/hiding components
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [showMyTournaments, setShowMyTournament] = useState(false);
  const [showTournamentInfo, setShowTournamentInfo] = useState(false);
  const [showPlayers, setShowPlayer] = useState(false);
  const [showEditTournament, setShowEditTournament] = useState(false);

  const [showDrawTournament, setShowDrawTournament] = useState(false);
  const [numberOfGroups, setNumberOfGroups] = useState(0);
  const [tournamentGroups, setTournamentGroups] = useState<Group[]>([]);
  const [showTournamentButtons, setShowTournamentButtons] = useState(false);
  const [showStartTournamentButton, setShowStartTournamentButton] =
    useState(true);

  // define state variables for player search
  const [players, setPlayers] = useState(realPlayers);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [userName, setUserName] = useState("");
  const [uid, setUid] = useState("");

  // set search variables
  const [searchName, setSearchName] = useState("");
  const [searchClub, setSearchClub] = useState("");
  const [sentPlayerIds, setSentPlayerIds] = useState<number[]>([]);

  // loading variable
  const [isLoading, setIsLoading] = useState(true); // Tournament is loading

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
      threeOrFive: threeOrFive,
      players: tournamentPlayers,
      seededPlayersIds: tournamentSeededPlayersIds,
      tournamentId: tournamentId,
      groups: tournamentGroups,
    };
    const updatedTournaments = [...myTournaments, newTournament];
    writeTournament(newTournament); // Write to Firebase
    setMyTournaments(updatedTournaments);
    // Reset all state variables to their initial values
    setTournamentDateFrom("");
    setTournamentDateTo("");
    setTournamentLocation("");
    setTournamentPlayers([]);
    setTournamentPlayersID([]);
    setTournamentMatches(4);
    setTournamentName("");
    setNumberInGroup(4);
    setTournamentType("");
    setCurrentTournament(newTournament);
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

    // reset all state variables to their initial values
    setTournamentDateFrom("");
    setTournamentDateTo("");
    setTournamentLocation("");
    setTournamentPlayers([]);
    setTournamentPlayersID([]);
    setTournamentMatches(4);
    setTournamentName("");
    setNumberInGroup(4);
    setTournamentType("");
    setTournamentSeededPlayers([]);
  };
  // from uid get tournaments and set them to myTournaments
  const handleSetMyTournaments = async (uid: string) => {
    const loadTournaments = await getTournamentsByUid(uid);
    setMyTournaments(loadTournaments);
  };
  // define group size

  function handleNumberChange(valueAsString: string, valueAsNumber: number) {
    setNumberInGroup(valueAsNumber);
  }

  const handleRadioChange = (value: string) => {
    setThreeOrFive(value);
  };

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
    setShowEditTournament(false);
    setShowDrawTournament(false);
    setShowTournamentButtons(false);
  };
  // go to tournament info
  const handleGoToTournaments = () => {
    setShowMyTournament(true);
    setShowStartMenu(false);
    setShowCreateTournament(false);
    setShowTournamentInfo(false);
    setShowPlayer(false);
    setShowTournamentButtons(false);
    setShowDrawTournament(false);
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
    // console.log(tournament);
    setCurrentTournament(tournament);
    setTournamentPlayers(tournament.players ? tournament.players : []);
    // console.log(tournament.seededPlayersIds);
    setTournamentSeededPlayers(
      tournament.seededPlayersIds ? tournament.seededPlayersIds : []
    );
    setShowTournamentInfo(true);
    setShowMyTournament(false);
    setShowStartMenu(false);
    setShowDrawTournament(true);
    setShowCreateTournament(false);
    setShowTournamentButtons(true);
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
        seededPlayersIds: tournamentSeededPlayersIds,
      };
      writeTournament(newTournament);
      setCurrentTournament(newTournament);
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
    //console.log(players);
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
    const seededPlayersIds = seededPlayers.map((player) => player.id as number);
    console.log(seededPlayers);

    setTournamentSeededPlayers(seededPlayersIds);
    currentTournament &&
      setCurrentTournament({
        ...currentTournament,
        seededPlayersIds: seededPlayersIds,
      });
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
    setShowEditTournament(false);
    setShowDrawTournament(true);
    setCurrentTournament(tournament);
    setShowStartTournamentButton(true);
    drawTournament(tournament);
  }

  function drawTournament(tournament: Tournament): void {
    let noGroups = 0;
    const groups: Player[][] = [];
    if (tournament && tournament.players && tournament.seededPlayersIds) {
      if (tournament.threeOrFive === "3") {
        console.log("3 here");
        noGroups = Math.floor(tournament?.players?.length / 4) + 1;
        setNumberInGroup(noGroups);
      } else if (tournament.threeOrFive === "5") {
        noGroups = Math.floor(tournament?.players?.length / 4);
        setNumberInGroup(noGroups);
      }
      // assign the seeded players to the groups in order to

      // ensure that they are not in the same group
      for (let i = 0; i < noGroups; i++) {
        groups.push([]);
      }

      for (let i = 0; i < tournament.seededPlayersIds.length; i++) {
        const seededPlayerId = tournament.seededPlayersIds[i];
        const player = tournament.players.find((p) => p.id === seededPlayerId);
        if (player) {
          groups[i % noGroups]?.push(player);
          //console.log(groups);
        }
      }
      const unseededPlayers = tournament.players.filter(
        (player) => !tournament.seededPlayersIds?.includes(player.id)
      );
      //console.log(unseededPlayers);
      shuffleArray(unseededPlayers);
      //console.log(unseededPlayers);

      let groupIndex = tournament.seededPlayersIds.length;
      for (const player of unseededPlayers) {
        // console.log(player);
        groups[groupIndex]?.push(player);

        groupIndex = (groupIndex + 1) % noGroups;
      }
      // console.log(groups);
    }
    const addGroups = setGroupsForTournament(groups);
    // console.log(tournamentGroups);

    if (currentTournament) {
      setCurrentTournament({
        ...currentTournament,
        groups: addGroups,
      });
    }
    //console.log(currentTournament?.groups);
  }

  function shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function setGroupsForTournament(players: Player[][]) {
    const updatedGroups: Group[] = [];
    for (let i = 0; i < players.length; i++) {
      const group = players[i];

      const newGroup: Group = {
        name: i + 1,
        players: group,
        matches: [],
        format: "Best of 5",
        numberInGroup: players[i].length,
        tournamentId: currentTournament?.tournamentId,
      };
      updatedGroups.push(newGroup);

      //console.log(tournamentGroups);
    }

    return updatedGroups;
  }
  /*interface Group{
    name?: number;
    players?: Player[];
    matches?: Match[];
    format?: string;
    numberInGroup?: string;
    tournamentId?: number;
    */

  return (
    <Flex
      bg="#C1D0B5"
      minHeight='100vh'
      minWidth='100vw'
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
          <Box bg="#C1D0B5">
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
                      width="35%"
                      style={{ marginBottom: "0.5", marginTop: "0.5em" }}
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
                              value={numberInGroup}
                              onChange={handleNumberChange}
                              placeholder="4"
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
                            <RadioGroup
                              onChange={handleRadioChange}
                              value={threeOrFive}
                              defaultValue="3"
                            >
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
                          onClick={() => {
                            handleSaveTournament();
                            onClose();
                          }}
                          colorScheme="blue"
                        >
                          Save and Close
                        </Button>
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
                <Button colorScheme="teal" onClick={onOpen}>
                  Add players
                </Button>
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
                              id={player.id}
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
        {showTournamentButtons && (
          <>

            <Flex width="80%" p={1}>
              
              <Button colorScheme="blue" p={1} onClick={() => saveTournament()}>
                Save Tournament
              </Button>
              
              <ButtonGroup gap='2'>
              <Button
                colorScheme="purple"
                p={1}
                
                onClick={() =>
                  handleSetTournamentSeededPlayers(
                    currentTournament?.players || []
                  )
                }
              >
                Seed players
              </Button>
              

              {currentTournament && (
                <Button
                  colorScheme="yellow"
                  p={1}
                  onClick={() => handleDrawTournament(currentTournament)}
                >
                  Draw Tournament
                </Button>
              )}
              </ButtonGroup>
                
              <Button
                colorScheme="green"
                p={1}
                onClick={() => console.log("start tournament")}
              >
                Start Tournament
              </Button>
              
            </Flex>
          </>
        )}

        <Flex>
          {showPlayers && (
            <Box width="35%">
              <Box
                style={{
                  overflow: "auto",
                  maxHeight: "50%",
                  maxWidth: "60%",
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
                      //console.log(currentTournament.seededPlayersIds);
                      const isSeeded =
                        tournamentSeededPlayersIds?.includes(player.id) ||
                        currentTournament.seededPlayersIds?.includes(player.id);

                      return (
                        <Box
                          p={[0, 0.5]}
                          key={player.id}
                          display="flex"
                          alignItems="horizontal"
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
                            {isSeeded ? (
                              <SeededPlayer
                                name={player.name}
                                club={player.club}
                                points={player.points}
                              />
                            ) : (
                              <Player
                                id={player.id}
                                name={player.name}
                                club={player.club}
                                points={player.points}
                              />
                            )}
                          </Flex>
                        </Box>
                      );
                    })}
              </Box>
            </Box>
          )}
          {showDrawTournament && (
            <Box maxWidth="60%" maxHeight="30%" overflow="auto" p={1}>
              <Flex>
                <Box flex="1" p={1}>
                  {currentTournament?.groups
                    ?.slice(0, Math.ceil(currentTournament.groups.length / 2))
                    .map((group) => (
                      <Box p={1} key={group.name}>
                        <Group
                          seededPlayersIds={currentTournament.seededPlayersIds}
                          name={group.name}
                          players={group.players}
                        />
                      </Box>
                    ))}
                </Box>
                <Box flex="1" p={1}>
                  {currentTournament?.groups
                    ?.slice(Math.ceil(currentTournament.groups.length / 2))
                    .map((group) => (
                      <Box p={1} key={group.name}>
                        <Group
                          seededPlayersIds={currentTournament.seededPlayersIds}
                          name={group.name}
                          players={group.players}
                        />
                      </Box>
                    ))}
                </Box>
              </Flex>
            </Box>
          )}
        </Flex>
      </ChakraProvider>
    </Flex>
  );
}

export default App;
