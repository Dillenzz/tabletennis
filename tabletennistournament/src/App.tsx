import { useState, ChangeEvent, useRef, useEffect } from "react";
import realPlayers from "./scrape/players_with_ids.json";
import logo from "./assets/ft11.svg";

import Player from "./components/Player";
import { getTournamentsByUid } from "./Backend/updateFirebase2";
import { getAllPublicTournaments } from "./Backend/updateFirebase2";
import { loadTournamentClasses } from "./Backend/updateFirebase2";
import { writeClass } from "./Backend/updateFirebase2";

import { writeTournament2 } from "./Backend/updateFirebase2";
import deleteTournament from "./Backend/deleteTournament";
import deleteClassesByTournamentId from "./Backend/deleteClassesByTournamentId";

import {
  getUsernameAndSessionDuration,
  login,
} from "./Backend/auth_google_provider_create";

import Tournament from "./components/Tournament";
import SeededPlayer from "./components/SeededPlayer";
import Match from "./components/Match";
import Group from "./components/Group";
import Class from "./components/Class";

import DisplayMatchScore from "./components/DisplayMatchScore";

import GroupResult from "./components/GroupResult";
import GroupDisplayScore from "./components/GroupDisplayScore";
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
  //Menu,
  //MenuButton,
  //MenuList,
  //MenuItem,
  IconButton,
  Spacer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";

import {
  ArrowBackIcon,
  ArrowForwardIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { set } from "firebase/database";

function App() {
  // Call the function on startup
  // Empty array as second argument to run only on startup

  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournament] = useState<Tournament>();
  const [openTournaments, setOpenTournaments] = useState<Tournament[]>([]);

  // define state variables
  const [tournamentDateFrom, setTournamentDateFrom] = useState("");
  const [tournamentDateTo, setTournamentDateTo] = useState("");
  const [tournamentLocation, setTournamentLocation] = useState("");
  const [publicOrPrivate, setPublicOrPrivate] = useState("Private");
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentId, setTournamentId] = useState(-1);
  const [tournamentClub, setTournamentClub] = useState("");

  // states for clarity
  const [editTournament, setEditTournament] = useState(false);
  const [showUserName, setShowUserName] = useState(true);

  const [deleteInput, setDeleteInput] = useState("");
  const [
    showDeleteTournamentConfirmation,
    setShowDeleteTournamentConfirmation,
  ] = useState(false);

  const [currentClass, setCurrentClass] = useState<Class>();
  const [classPlayers, setClassPlayers] = useState<Player[]>([]);
  const [classStarted, setClassStarted] = useState(false);
  const [classSeededPlayers, setClassSeededPlayers] = useState<number[]>([]);
  const [showClassInfo, setShowClassInfo] = useState(false);

  // States for classes
  const [numberInGroup, setNumberInGroup] = useState(4);
  const [tournamentType, setTournamentType] = useState("");
  const [threeOrFive, setThreeOrFive] = useState("3");
  const [bo, setBo] = useState("Bo5");

  // showStates for startscreen
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [showMyTournaments, setShowMyTournament] = useState(false);
  const [showOpenTournaments, setShowOpenTournaments] = useState(false);
  const [atStartScreen, setAtStartScreen] = useState(false);
  const [showClassesButton, setShowClassesButton] = useState(false);

  // State for overview of tournament
  const [showTournamentOverview, setShowTournamentOverview] = useState(false);

  // states for shown class
  const [showPlayersAndGroups, setShowPlayersAndGroups] = useState(false);
  const [showTournamentButtons, setShowTournamentButtons] = useState(false);

  // states for displaying tourament length
  const [maxWidth, setMaxWidth] = useState(0);
  const [maxOpenWidth, setMaxOpenWidth] = useState(0);

  const [playerDeleted, setPlayerDeleted] = useState(false);

  // States for showing groups and unreported matches -> After starting tournament
  const [showGroups, setShowGroups] = useState(true);
  const [showUnreportedMatches, setShowUnreportedMatches] = useState(false);
  const [
    showGroupsResultsAndUnreportedMatches,
    setShowGroupsResultsAndUnreportedMatches,
  ] = useState(false);
  const [matchSearch, setMatchSearch] = useState("");

  // define modal variables

  // modal for creating tournament
  const {
    isOpen: isCreateClassModalOpen,
    onOpen: onOpenCreateClassModal,
    onClose: onCloseCreateClassModal,
  } = useDisclosure();

  // modal for report score? or player score
  const {
    isOpen: isOpenScoreModal,
    onOpen: onOpenScoreModal,
    onClose: onCloseScoreModal,
  } = useDisclosure();

  // modal for adding players
  const {
    isOpen: isOpenAddPlayersModal,
    onOpen: onOpenAddPlayersModal,
    onClose: onCloseAddPlayersModal,
  } = useDisclosure();

  const {
    isOpen: isOpenMatchesModal,
    onOpen: onOpenMatchesModal,
    onClose: onCloseMatchesModal,
  } = useDisclosure();

  const {
    isOpen: isDeleteTournamentModal,
    onOpen: onOpenDeleteTournamentModal,
    onClose: onCloseDeleteTournamentModal,
  } = useDisclosure();

  // States for loading the right tournaments for Uid
  const [userName, setUserName] = useState("");
  const [uid, setUid] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // set search variables
  const [searchName, setSearchName] = useState("");
  const [searchClub, setSearchClub] = useState("");
  const [sentPlayerIds, setSentPlayerIds] = useState<number[]>([]);
  const [displayedPlayersFrom, setDisplayedPlayersFrom] = useState(0);
  const [displayedPlayersTo, setDisplayedPlayersTo] = useState(10);

  // define set score variables

  const [matchId, setMatchId] = useState("");
  const [currentMatch, setCurrentMatch] = useState<Match>();

  // set score for each set and player

  const [set1Player1, setSet1Player1] = useState(0);
  const [set2Player1, setSet2Player1] = useState(0);
  const [set3Player1, setSet3Player1] = useState(0);
  const [set4Player1, setSet4Player1] = useState(0);
  const [set5Player1, setSet5Player1] = useState(0);
  const [set6Player1, setSet6Player1] = useState(0);
  const [set7Player1, setSet7Player1] = useState(0);
  const [set1Player2, setSet1Player2] = useState(0);
  const [set2Player2, setSet2Player2] = useState(0);
  const [set3Player2, setSet3Player2] = useState(0);
  const [set4Player2, setSet4Player2] = useState(0);
  const [set5Player2, setSet5Player2] = useState(0);
  const [set6Player2, setSet6Player2] = useState(0);
  const [set7Player2, setSet7Player2] = useState(0);
  const [winner, setWinner] = useState<Player>();
  const [wonSetsPlayer1, setWonSetsPlayer1] = useState(0);
  const [wonSetsPlayer2, setWonSetsPlayer2] = useState(0);

  // Sates for errorhandling and checking correct winner
  const [matchIdError, setMatchIdError] = useState(0);
  const [checkWinner, setCheckWinner] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // put the right matchId into report match from player matches and unreported matches
  const matchIdRef = useRef<HTMLInputElement | null>(null); // Declare matchIdRef as a RefObject
  const [unreportedMatches, setUnreportedMatches] = useState<Match[]>([]);
  const inputMatchIdRefA = useRef<HTMLInputElement | null>(null);

  // states for showing the right player
  const [showGroupResult, setShowGroupResult] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player>();

  // I dont know about this state
  const [startBracket, setStartBracket] = useState(false);

  // states for loading tournaments
  const [loading, setLoading] = useState(false);
  const [loadingOpenTournaments, setLoadingOpenTournaments] = useState(false);
  const [noTournaments, setNoTournaments] = useState(false);

  // States for directing highligted menu item
  const initialRef = useRef(null);
  const inputSetRef = useRef(null);

  // CLASS VARIABLES
  // const [myClasses, setMyClasses] = useState<Class[]>([]);
  const [tournamentClasses, setTournamentClasses] = useState<Class[]>([]);
  const [classId, setClassId] = useState(-1);
  const [publicOrPrivateClass, setPublicOrPrivateClass] = useState("Public");
  const [className, setClassName] = useState("");

  // save or update the tournament to Firebase

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getUsernameAndSessionDuration();
        if (user !== null) {
          setUid(user.uid);
          setUserName(user.username);
          setUserLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const currentDate = new Date();

  const upcomingTournaments = openTournaments
    .filter(
      (tournament) =>
        tournament.dateFrom && new Date(tournament.dateFrom) > currentDate
    )
    .sort((a, b) => a.dateFrom!.localeCompare(b.dateFrom!));

  const pastTournaments = openTournaments
    .filter(
      (tournament) =>
        tournament.dateFrom && new Date(tournament.dateFrom) < currentDate
    )
    .sort((a, b) => b.dateFrom!.localeCompare(a.dateFrom!));

  const createTournament = () => {
    setShowStartMenu(true);
    setShowCreateTournament(false);
    console.log("Id we are sending to writeTournamnet", tournamentId);

    const newTournament: Tournament = {
      uid: uid,
      name: tournamentName,
      dateFrom: tournamentDateFrom,
      dateTo: tournamentDateTo,
      location: tournamentLocation,
      public: publicOrPrivate,
      tournamentId: tournamentId,
      club: tournamentClub,
    };

    const updatedTournaments = [...myTournaments, newTournament];
    writeTournament2(newTournament); // Write to Firebase
    setMyTournaments(updatedTournaments);
    calculateMyTournamentLength(updatedTournaments);
    setCurrentTournament(newTournament);
    setTournamentDateFrom("");
    setTournamentDateTo("");
    setTournamentLocation("");
    setTournamentClub("");
    setTournamentName("");
  };

  async function createClass(tournament: Tournament) {
    if (!tournament.tournamentId) {
      return; // Handle the case when tournamentId is null
    }

    const newClass: Class = {
      classId: -1,
      uid: uid,
      name: className,
      format: tournamentType,
      numberInGroup: numberInGroup,
      threeOrFive: threeOrFive,
      tournamentId: tournament.tournamentId,
      players: [],
      seededPlayersIds: [],
      groups: [],
      started: false,
      matches: [],
      readyToStart: false,
      bo: bo,
      public: publicOrPrivateClass,
    };
    const updatedClasses = [...tournamentClasses, newClass];

    const classID = await writeClass(false, newClass); // Write to Firebase
    console.log(classID, "classID");
    setClassId(classID);
    setTournamentClasses(updatedClasses);

    setClassPlayers([]);
    setClassName("");
    setNumberInGroup(4);
    setTournamentType("");
  }

  // function to load players in search
  const handleNameSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const handleClubSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchClub(event.target.value);
  };

  const handleUnreportedMatchSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setMatchSearch(event.target.value);
  };
  // define tournament type
  const handleTournamentType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value: string = event.target.value;
    setTournamentType(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTournamentName(event.target.value);

  const handleLocationChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTournamentLocation(event.target.value);
  // changes view to tournament info

  const handleClubChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTournamentClub(event.target.value);

  const handleCreateTournament = async () => {
    const user = await getUsernameAndSessionDuration();
    if (user !== null && uid !== "") {
      setShowCreateTournament(true);
      setShowStartMenu(false);

      // reset all state variables to their initial values
      setTournamentDateFrom("");
      setTournamentDateTo("");
      setTournamentLocation("");
      setTournamentClub("");
      setTournamentName("");
      setTournamentId(-1);
      setPublicOrPrivate("Private");
      setEditTournament(false);

      setCurrentTournament(undefined);
    } else if (user !== null) {
      setUid(user.uid);
    } else {
      alert("please log in");
    }
  };
  // from uid get tournaments and set them to myTournaments
  const handleSetMyTournaments = async (uid: string) => {
    if (uid !== null) {
      const loadTournaments = await getTournamentsByUid(uid);
      console.log(loadTournaments);
      setMyTournaments(loadTournaments);
      if (loadTournaments.length === 0) {
        setNoTournaments(true);
      } else {
        setNoTournaments(false);
      }
      calculateMyTournamentLength(loadTournaments);
    }
  };
  // define group size
  function handleNumberChange(valueAsString: string, valueAsNumber: number) {
    setNumberInGroup(valueAsNumber);
    console.log(valueAsString, valueAsNumber);
  }

  // button to decide if even groups go into groups of 5 or 3
  const handleRadioChange = (value: string) => {
    setThreeOrFive(value);
  };

  const handlePublicOrPrivate = (value: string) => {
    setPublicOrPrivate(value);
  };

  const handlePublicOrPrivateClass = (value: string) => {
    setPublicOrPrivateClass(value);
  };

  const handleClassNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setClassName(event.target.value);
  };

  const handleBoChange = (value: string) => {
    setBo(value);
  };

  // show all tournaments
  const handleShowMyTournaments = () => {
    setLoading(true);
    handleGoToTournaments();
  };
  // go home resets all state variables
  const handlegoToHome = () => {
    setShowClassesButton(false);
    setShowClassInfo(false);
    setAtStartScreen(true);
    setClassStarted(false);
    setTournamentClasses([]);
    setShowMyTournament(false);
    setShowStartMenu(true);
    setShowCreateTournament(false);
    setShowPlayersAndGroups(false);
    setShowTournamentOverview(false);
    setShowGroupsResultsAndUnreportedMatches(false);
    setEditTournament(false);
    setShowTournamentButtons(false);
    setShowGroupResult(false);
    setShowGroups(false);
    setShowTournamentButtons(false);
    setClassSeededPlayers([]);
    setShowOpenTournaments(false);
    setTournamentName("");
    setTournamentDateFrom("");
    setTournamentDateTo("");
    setTournamentLocation("");
    setTournamentClub("");
    setTournamentType("");
    setShowUnreportedMatches(false);
    setShowUserName(true);
    setUnreportedMatches([]);
  };
  // go to tournament info
  const handleGoToTournaments = () => {
    setAtStartScreen(false);
    setShowMyTournament(true);
    setShowStartMenu(false);
    setShowCreateTournament(false);
    setShowClassInfo(false);
    setShowPlayersAndGroups(false);
    setShowTournamentButtons(false);
    setShowGroups(false);
    setShowUserName(true);
    setShowGroups(false);
    setShowUnreportedMatches(false);
    setShowGroupResult(false);
    setShowGroupsResultsAndUnreportedMatches(false);
    setShowTournamentOverview(false);
    loadTournaments();
    setShowOpenTournaments(false);
    setEditTournament(false);
  };
  // login with google
  async function handleGoogleLogin() {
    const result = await login();

    if (result) {
      await loadTournaments();
    }
  }

  async function loadTournaments() {
    const user = await getUsernameAndSessionDuration();

    if (user && user.uid !== null) {
      setUid(user.uid);
      setUserName(user.username);
      setMyTournaments([]);

      await handleSetMyTournaments(user.uid);
    } else {
      // Handle the case when user.uid is not available
      // You can display an error message or take appropriate action
    }
    setLoading(false);
  }

  // go to tclass info

  const handleGoToClassInfo = (myClass: Class) => {
    console.log(myClass);
    setShowClassInfo(true);

    setCurrentClass(myClass);
    setClassPlayers(myClass.players ? myClass.players : []);

    setClassStarted(myClass.started ? myClass.started : false);
    setShowGroupsResultsAndUnreportedMatches(
      myClass.started ? myClass.started : false
    );

    setShowTournamentOverview(false);
    setClassSeededPlayers(
      myClass.seededPlayersIds ? myClass.seededPlayersIds : []
    );
    setShowTournamentButtons(true);
    setShowUserName(false);

    setShowPlayersAndGroups(true);
    setSentPlayerIds(
      myClass.players
        ? myClass.players
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

  const filteredMatches = unreportedMatches.filter((match) => {
    const namePlayer1 = match.player1!.name!
      .toLowerCase()
      .includes(matchSearch.toLowerCase());
  
    const namePlayer2 = match.player2!.name!
      .toLowerCase()
      .includes(matchSearch.toLowerCase());

    const matchId = match.matchId!.toString().includes(matchSearch);
  
    
    return namePlayer1 || namePlayer2 || matchId;
  });
  

  async function handleTournamentOverview(tournament: Tournament) {
    setShowClassesButton(true);
    setTournamentClasses([]);
    setClassStarted(false);
    setClassSeededPlayers([]);
    setCurrentClass(undefined);
    setShowTournamentOverview(true);

    setShowGroups(false);
    setShowGroupResult(false);
    setShowUnreportedMatches(false);
    setShowGroupsResultsAndUnreportedMatches(false);
    setShowTournamentButtons(false);
    setShowMyTournament(false);
    setShowClassInfo(false);
    setShowTournamentButtons(false);
    console.log(tournament.tournamentId);
    const newTournamentClasses = await loadTournamentClasses(
      tournament.tournamentId!
    );
    setCurrentTournament(tournament);

    setTournamentClasses(newTournamentClasses);
    console.log(newTournamentClasses);
  }

  // add player to tournament
  async function addPlayerToTournament(player: Player) {
    console.log(player);
    const playerId = typeof player.id === "number" ? player.id : -1; // Use a default value if id is undefined

    if (sentPlayerIds.includes(playerId)) {
      // Player has already been sent, do nothing
      return;
    }

    const newPlayers = [...classPlayers, player];
    setClassPlayers(newPlayers);
    if (currentClass) {
      setCurrentClass({
        ...currentClass,
        players: newPlayers,
      });
    }
    setSentPlayerIds([...sentPlayerIds, playerId]);
  }
  // save tournament to firebase
  function saveTournament() {
    if (currentClass) {
      const newClass: Class = {
        ...currentClass,
        classId: classId ? classId : -1,
        players: currentClass.players ? currentClass.players : [],
        seededPlayersIds: currentClass.seededPlayersIds
          ? currentClass.seededPlayersIds
          : [],
        started: false,
        groups: currentClass.groups ? currentClass.groups : [],
        matches: currentClass.matches ? currentClass.matches : [],
        uid: uid,
      };

      writeClass(true, newClass);
      setCurrentClass(newClass);
    }
  }
  // delete player from tournament
  function deletePlayerFromTournament(player: Player) {
    const newPlayers = classPlayers.filter((p) => p.id !== player.id);
    setClassPlayers(newPlayers);
    setSentPlayerIds(sentPlayerIds.filter((id) => id !== player.id));
    if (currentClass) {
      setCurrentClass({
        ...currentClass,
        players: newPlayers,
      });
    }
  }

  // calculate how many players to seed according to amount of players
  function handleSetClassSeededPlayers(players: Player[], seeded: boolean) {
    //console.log(players);
    if (seeded == false) {
      setClassSeededPlayers([]);
      currentClass &&
        setCurrentClass({
          ...currentClass,
          seededPlayersIds: [],
        });
    }

    const totalPlayers = players.length;

    let numSeeds = 0;

    if (totalPlayers < 6) {
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

    setClassSeededPlayers(seededPlayersIds);
    currentClass &&
      setCurrentClass({
        ...currentClass,
        seededPlayersIds: seededPlayersIds,
      });
  }

  // sets states to display the drawn groups
  function handleDrawTournament() {
    if (currentClass && currentClass.players && currentClass.numberInGroup) {
      if (currentClass.players?.length === 0) {
        alert("Please add players to the tournament");

        return;
      } else if (currentClass.players?.length < 2) {
        alert("Please add atleast 2 players to the tournament");
        console.log(currentClass);
        return;
      }
    } else {
      alert("Please add players to the tournament");

      return;
    }
    if (currentClass?.seededPlayersIds === undefined) {
      if (currentTournament) {
        const newClass: Class = {
          ...currentClass,
          classId: classId ? classId : -1,
          groups: [],
          seededPlayersIds: [],
          matches: [],
        };
        console.log("before error");
        writeClass(true, newClass);
        console.log("after error");
        setCurrentTournament(newClass);
        drawTournament(newClass);
      }
    } else {
      drawTournament(currentClass);
    }
    setShowMyTournament(false);
    setShowStartMenu(false);
    setShowCreateTournament(false);
    setShowClassInfo(true);
    setShowPlayersAndGroups(true);
  }

  // this fuction is a disaster but it takes the amount of players and first iteraters and
  // makes groups, we then use these group sizes to generate the real groups when we know our desired size
  // it uses 3 aux functions to determine if the draw is legal otherwise it draws again
  // infinite loop should be fixed if it hangs then call me
  function drawTournament(myClass: Class): void {
    console.log("draw tournament");
    let noGroups = 0;
    let no3Groups = 0;
    let no5Groups = 0;
    let groups: Player[][] = [];
    // divide players into groups based on class before drawing tournament groups
    //players.class
    if (myClass.seededPlayersIds === undefined) {
      setClassSeededPlayers([]);
      currentClass &&
        setCurrentClass({
          ...currentClass,
          seededPlayersIds: [],
        });
    }

    if (myClass && myClass.players && myClass.seededPlayersIds !== undefined) {
      console.log("tournament. player length", myClass.players.length);
      if (myClass.threeOrFive === "3") {
        if (myClass.players.length % 4 != 0) {
          noGroups = Math.floor(myClass?.players?.length / 4) + 1;

          if (myClass.players.length == 9) {
            noGroups = 2;
            no5Groups = 1;
          }
          if (myClass.players.length == 5) {
            noGroups = 1;
            no5Groups = 1;
          }

          if (myClass.players.length == 7) {
            noGroups = 2;
            no3Groups = 0;
          }
        } else {
          noGroups = Math.floor(myClass?.players?.length / 4);
        }
        setNumberInGroup(noGroups);
        if (myClass.players.length % 4 == 1) {
          // console.log("3 here 1");

          no3Groups = 3;
          // console.log("no3Groups", no3Groups);
        }

        if (myClass.players.length % 4 == 2) {
          no3Groups = 2;
        }

        if (myClass.players.length % 4 == 3) {
          no3Groups = 1;
        }
      } else if (myClass.threeOrFive === "5") {
        noGroups = Math.floor(myClass?.players?.length / 4);
        setNumberInGroup(noGroups);

        if (myClass.players.length % 4 == 1) {
          no5Groups = 1;
        }
        if (myClass.players.length % 4 == 2) {
          no5Groups = 2;
        }
        if (myClass.players.length % 4 == 3) {
          no5Groups = 3;
        }
      }
      // assign the seeded players to the groups in order to
      const unseededPlayers = myClass.players.filter(
        (player) => !myClass.seededPlayersIds?.includes(player.id)
      );

      const unseededPlayers2 = myClass.players.filter(
        (player) => !myClass.seededPlayersIds?.includes(player.id)
      );

      // ensure that they are not in the same group
      for (let i = 0; i < noGroups; i++) {
        groups.push([]);
      }

      if (myClass.seededPlayersIds && myClass.players) {
        for (let i = 0; i < myClass.seededPlayersIds.length; i++) {
          const seededPlayerId = myClass.seededPlayersIds[i];
          const player = myClass.players.find((p) => p.id === seededPlayerId);
          if (player) {
            groups[i % noGroups]?.push(player);
            //console.log(groups);
          }
        }
      }

      const clubPlayerMap: Record<string, Player[]> = {};
      for (const player of unseededPlayers) {
        if (player.club) {
          if (clubPlayerMap.hasOwnProperty(player.club)) {
            clubPlayerMap[player.club].push(player);
          } else {
            clubPlayerMap[player.club] = [player];
          }
        }
      }

      const clubArrays = Object.values(clubPlayerMap);
      clubArrays.sort((a, b) => b.length - a.length);

      //console.log(unseededPlayers);
      shuffleArray(unseededPlayers);

      let groupIndex = 0;
      let iterations = 0;
      for (const clubArray of clubArrays) {
        for (const player of clubArray) {
          if (no5Groups === 0) {
            if (iterations < noGroups - myClass.seededPlayersIds.length) {
              groupIndex =
                iterations +
                noGroups -
                (noGroups - myClass.seededPlayersIds.length);
            }
            if (iterations === noGroups - myClass.seededPlayersIds.length) {
              groupIndex = no3Groups;
            }
          } else if (no5Groups > 0) {
            if (iterations < noGroups - myClass.seededPlayersIds.length) {
              groupIndex =
                iterations +
                noGroups -
                (noGroups - myClass.seededPlayersIds.length);
            }
            if (iterations === noGroups - myClass.seededPlayersIds.length) {
              groupIndex = noGroups - no5Groups;
            }
          }

          groups[groupIndex]?.push(player);
          groupIndex = (groupIndex + 1) % noGroups;
          iterations++;
        }
      }
      // console.log(groups);

      let groupLengths: number[] = [];
      for (let i = 0; i < groups.length; i++) {
        groupLengths.push(groups[i].length);
      }
      //console.log(groupLengths);

      groups = [];

      if (myClass.players.length == 6) {
        groupLengths = [3, 3];
      }

      if (myClass.players.length < 6) {
        noGroups = 1;
        groupLengths = [myClass.players.length];
      }

      for (let i = 0; i < noGroups; i++) {
        groups.push([]);
      }

      if (myClass.seededPlayersIds && myClass.players) {
        for (let i = 0; i < myClass.seededPlayersIds.length; i++) {
          const seededPlayerId = myClass.seededPlayersIds[i];
          const player = myClass.players.find((p) => p.id === seededPlayerId);
          if (player) {
            groups[i % noGroups]?.push(player);
            //console.log(groups);
          }
        }
      }

      let randomIndex = 0;
      const unassignedPlayers = [];

      for (const player of unseededPlayers2) {
        let searchGroup = true;
        let attempts = 0;
        let minClubCount = Infinity;
        let targetGroupIndex = -1;

        // Check if all groups are already full
        const allGroupsFull = groups.every(
          (group, index) => group.length >= groupLengths[index]
        );

        while (searchGroup && attempts < noGroups && !allGroupsFull) {
          randomIndex = Math.floor(Math.random() * noGroups);
          const currentGroup = groups[randomIndex];

          if (
            currentGroup?.length < groupLengths[randomIndex] &&
            !currentGroup?.some(
              (groupPlayer) => groupPlayer.club === player.club
            )
          ) {
            const clubCountMap = countClubOccurrencesInGroup(currentGroup);
            if (player.club) {
              const clubCount =
                clubCountMap[player.club] !== undefined
                  ? clubCountMap[player.club]
                  : 0;
              if (clubCount < minClubCount) {
                minClubCount = clubCount;
                targetGroupIndex = randomIndex;
              }
            }
          }

          attempts++;
        }

        if (targetGroupIndex !== -1) {
          groups[targetGroupIndex].push(player);
        } else {
          unassignedPlayers.push(player);
        }
      }

      // Randomly assign unassigned players to groups with available space

      console.log("unassignedPlayers", unassignedPlayers);
      for (const player of unassignedPlayers) {
        let searchGroup = true;

        while (searchGroup) {
          randomIndex = Math.floor(Math.random() * noGroups);
          const currentGroup = groups[randomIndex];

          if (currentGroup?.length < groupLengths[randomIndex]) {
            groups[randomIndex].push(player);
            searchGroup = false;
          }
        }
      }
    }

    let addGroups: Group[] = [];

    if (checkIfGroupsAreValid(groups)) {
      //console.log(groups);

      addGroups = setGroupsForTournament(groups);
    } else {
      drawTournament(myClass);
      return;
    }

    // console.log(tournamentGroups);

    if (currentClass) {
      setCurrentClass({
        ...myClass,
        groups: addGroups,
        readyToStart: true,
        matches: [],
      });
      writeClass(true, {
        ...myClass,
        groups: addGroups,
        readyToStart: true,
        matches: [],
      });
    }
    setShowPlayersAndGroups(false);
    setShowPlayersAndGroups(true);

    //console.log(currentTournament?.groups);
  }

  // aux function to check if groups are valid
  function checkIfGroupsAreValid(groups: Player[][]): boolean {
    const totalClubCountMap = countClubOccurrences(groups);
    //console.log(groups.length);

    for (const group of groups) {
      const clubCountMap = countClubOccurrencesInGroup(group);

      //console.log("clubCountMap", clubCountMap);
      for (const club in clubCountMap) {
        //console.log("clubCountMap per group", clubCountMap[club]);
        if (
          clubCountMap[club] == 2 &&
          totalClubCountMap[club] < groups.length
        ) {
          //console.log("total", totalClubCountMap);

          return false;
        }
        if (
          clubCountMap[club] == 3 &&
          totalClubCountMap[club] < groups.length * 2
        ) {
          return false;
        }
        if (
          clubCountMap[club] == 4 &&
          totalClubCountMap[club] < groups.length * 3
        ) {
          return false;
        }
        if (
          clubCountMap[club] == 5 &&
          totalClubCountMap[club] < groups.length * 4
        ) {
          return false;
        }
      }
    }
    return true;
  }

  // aux function to count club occorencces in a tournament
  function countClubOccurrences(groups: Player[][]): Record<string, number> {
    const clubCountMap: Record<string, number> = {};

    for (const group of groups) {
      for (const player of group) {
        if (Array.isArray(player)) {
          const groupCountMap = countClubOccurrencesInGroup(player);
          for (const innerPlayer of player) {
            if (innerPlayer.club) {
              if (clubCountMap.hasOwnProperty(innerPlayer.club)) {
                clubCountMap[innerPlayer.club] +=
                  groupCountMap[innerPlayer.club];
              } else {
                clubCountMap[innerPlayer.club] =
                  groupCountMap[innerPlayer.club];
              }
            }
          }
        } else {
          if (player.club) {
            if (clubCountMap.hasOwnProperty(player.club)) {
              clubCountMap[player.club] += 1;
            } else {
              clubCountMap[player.club] = 1;
            }
          }
        }
      }
    }

    return clubCountMap;
  }

  // aux function to count club occourrences in group
  function countClubOccurrencesInGroup(
    group: Player[]
  ): Record<string, number> {
    const clubCountMap: Record<string, number> = {};

    for (const player of group) {
      if (player.club) {
        if (clubCountMap.hasOwnProperty(player.club)) {
          clubCountMap[player.club] += 1;
        } else {
          clubCountMap[player.club] = 1;
        }
      }
    }

    return clubCountMap;
  }

  // randomizes the player in the draw to make it more fair
  function shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // makes groups out of the draw tournament function
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

  // function put tournament in start state after draw has been done.
  function handleStartClass() {
    setShowGroupsResultsAndUnreportedMatches(true);
    setShowClassInfo(false);
    setShowTournamentOverview(false);
    setShowPlayersAndGroups(false);
    setShowMyTournament(false);
    setShowTournamentButtons(false);
    setCurrentTournament(currentTournament);
    setCurrentClass(currentClass);
    const matches = assignMatchesInTournament(currentClass);

    setShowUnreportedMatches(false);
    setShowGroups(true);

    if (currentClass) {
      setCurrentClass({
        ...currentClass,
        started: true,
        readyToStart: false,
        matches: matches,
      });
      writeClass(true, {
        ...currentClass,
        started: true,
        readyToStart: false,
        matches: matches,
      });
    }

    //console.log(currentTournament?.started);
  }

  // from the groups sets matches in every group according to order
  function assignMatchesInTournament(myClass: Class | undefined) {
    console.log("assignMatchesInTournament");
    if (myClass) {
      console.log("inside if statement");
      let matchIdCounter = 1; // Variable to track match IDs
      const matches: Match[] = [];

      if (myClass.groups) {
        console.log("inside 2nd if statement");
        console.log("myClass.groups", myClass.groups);
        for (const group of myClass.groups) {
          console.log("myClass.groups", myClass.groups);
          const newMatches = createMatchesForGroup(group, matchIdCounter);
          matchIdCounter += newMatches.length; // Update the match ID counter
          matches.push(...newMatches);
          group.matches = newMatches; // Add matches to the group
        }
      }
      console.log("matches", matches);
      return matches;
    }
    //console.log("myClass.matches", myClass?.matches);
  }

  // aux function to create matches in every group
  function createMatchesForGroup(
    group: Group,
    matchIdCounter: number
  ): Match[] {
    const matches: Match[] = [];
    const players = group.players;

    if (players) {
      const numberOfPlayers = players.length;
      const numberOfMatches = (numberOfPlayers * (numberOfPlayers - 1)) / 2;

      let pairings: number[][] = [];

      if (numberOfPlayers === 2) {
        pairings = [[0, 1]];
      } else if (numberOfPlayers === 3) {
        pairings = [
          [0, 1],
          [0, 2],
          [1, 2],
        ];
      } else if (numberOfPlayers === 4) {
        pairings = [
          [0, 2],
          [1, 3],
          [0, 1],
          [2, 3],
          [0, 3],
          [1, 2],
        ];
      } else if (numberOfPlayers === 5) {
        pairings = [
          // these pairings need to be fixed check resultat.ondata
          [0, 2],
          [3, 4],
          [0, 1],
          [2, 3],
          [1, 4],
          [0, 3],
          [2, 4],
          [1, 3],
          [0, 4],
          [1, 2],
        ];
      } else {
        // Handle other cases or throw an error for unsupported number of players
        throw new Error("Unsupported number of players in the group.");
      }

      for (let i = 0; i < numberOfMatches; i++) {
        const pair = pairings[i];
        const match: Match = {
          player1: players[pair[0]],
          player2: players[pair[1]],
          group: group.name,
          matchId: matchIdCounter + i,
          tournamentId: group.tournamentId,
        };

        matches.push(match);
      }

      return matches;
    }

    return [];
  }

  // function to check if input data is correct for match according to certain critera
  // only works for Bo5 at the moment
  function handleCheckWinner(bestOf: string) {
    console.log(bestOf);
    try {
      let wonSetsPlayer1 = 0;
      let wonSetsPlayer2 = 0;
      const set1 = {
        player1Score: set1Player1,
        player2Score: set1Player2,
      };
      const set2 = {
        player1Score: set2Player1,
        player2Score: set2Player2,
      };
      const set3 = {
        player1Score: set3Player1,
        player2Score: set3Player2,
      };
      const set4 = {
        player1Score: set4Player1,
        player2Score: set4Player2,
      };
      const set5 = {
        player1Score: set5Player1,
        player2Score: set5Player2,
      };

      const set6 = {
        player1Score: set6Player1,
        player2Score: set6Player2,
      };

      const set7 = {
        player1Score: set7Player1,
        player2Score: set7Player2,
      };

      const sets = [set1, set2, set3, set4, set5, set6, set7];

      let setsWonBeforeWinner = 0; // Variable to track the number of sets won by both players before a winner is determined
      let winnerDeclared = false;

      for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        const player1Score = set.player1Score;
        const player2Score = set.player2Score;

        if (!isNaN(player1Score) && !isNaN(player2Score)) {
          // Check if the absolute difference is greater than or equal to 2
          if (
            (player1Score > 11 || player2Score > 11) &&
            Math.abs(player1Score - player2Score) !== 2
          ) {
            throw new Error(
              "Input error: Absolute difference between scores needs to be 2."
            );
          }

          if (
            Math.abs(player1Score - player2Score) >= 2 ||
            (player1Score === 0 && player2Score === 0)
          ) {
            if (player1Score > player2Score) {
              wonSetsPlayer1++;
            } else if (player1Score < player2Score) {
              wonSetsPlayer2++;
            }
          } else {
            throw new Error(
              "Input error: Absolute difference between scores must be greater than or equal to 2."
            );
          }
        } else {
          throw new Error(
            "Input error: Invalid score input. Please enter numeric values."
          );
        }

        // Check if a player has already won the match
        if (
          (bestOf === "Bo3" &&
            (wonSetsPlayer1 === 2 || wonSetsPlayer2 === 2)) ||
          (bestOf === "Bo5" &&
            (wonSetsPlayer1 === 3 || wonSetsPlayer2 === 3)) ||
          (bestOf === "Bo7" && (wonSetsPlayer1 === 4 || wonSetsPlayer2 === 4))
        ) {
          setsWonBeforeWinner = wonSetsPlayer1 + wonSetsPlayer2;
          winnerDeclared = true;

          break; // Exit the loop if a winner has been determined
        }
      }

      // Check if there are still non-zero sets remaining
      if (winnerDeclared) {
        for (let j = setsWonBeforeWinner; j < sets.length; j++) {
          const remainingSet = sets[j];
          console.log(remainingSet);
          if (
            remainingSet &&
            remainingSet.player1Score !== 0 &&
            remainingSet.player2Score !== 0
          ) {
            throw new Error(
              "Input error: Match has already been won, but there are still non-zero sets remaining."
            );
          }
        }
      }

      if (wonSetsPlayer1 === wonSetsPlayer2) {
        throw new Error(
          "Input error: The number of won sets for each player cannot be equal."
        );
      }

      if (bestOf === "bo3") {
        if (wonSetsPlayer1 < 2 && wonSetsPlayer2 < 2) {
          throw new Error("Input error: At least one player must win 2 sets.");
        }
      }

      if (bestOf === "bo5") {
        if (wonSetsPlayer1 < 3 && wonSetsPlayer2 < 3) {
          throw new Error("Input error: At least one player must win 3 sets.");
        }
      }

      if (bestOf === "bo7") {
        if (wonSetsPlayer1 < 4 && wonSetsPlayer2 < 4) {
          throw new Error("Input error: At least one player must win 4 sets.");
        }
      }

      let winner = null;
      if (wonSetsPlayer1 > wonSetsPlayer2) {
        winner = currentMatch?.player1;
      } else {
        winner = currentMatch?.player2;
      }

      setWinner(winner);
      setCheckWinner(1);
      setWonSetsPlayer1(wonSetsPlayer1);
      setWonSetsPlayer2(wonSetsPlayer2);
    } catch (error) {
      setCheckWinner(-1);
      setErrorMessage((error as any).message);
    }
  }

  // sets the match scores for the sets to then be reported
  function handleMatchScore() {
    console.log("handleMatchScore");
    if (currentMatch !== null && currentMatch !== undefined) {
      const set1 = {
        player1Score: set1Player1,
        player2Score: set1Player2,
      };
      const set2 = {
        player1Score: set2Player1,
        player2Score: set2Player2,
      };
      const set3 = {
        player1Score: set3Player1,
        player2Score: set3Player2,
      };
      const set4 = {
        player1Score: set4Player1,
        player2Score: set4Player2,
      };
      const set5 = {
        player1Score: set5Player1,
        player2Score: set5Player2,
      };

      const set6 = {
        player1Score: set6Player1,
        player2Score: set6Player2,
      };

      const set7 = {
        player1Score: set7Player1,
        player2Score: set7Player2,
      };
      const sets = [set1, set2, set3, set4, set5, set6, set7];

      // sum all the points for all sets and put it into the match object

      let wonPointsPlayer1 = 0;
      let wonPointsPlayer2 = 0;

      for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        wonPointsPlayer1 += set.player1Score;
        wonPointsPlayer2 += set.player2Score;
      }
      const match = {
        ...currentMatch,
        sets: sets,
        winner: winner,
        reported: true,
        player1wonSets: wonSetsPlayer1,
        player2wonSets: wonSetsPlayer2,
        player1wonPoints: wonPointsPlayer1,
        player2wonPoints: wonPointsPlayer2,
        player1lostSets: wonSetsPlayer2,
        player2lostSets: wonSetsPlayer1,
        player1lostPoints: wonPointsPlayer2,
        player2lostPoints: wonPointsPlayer1,
      };

      if (currentClass !== null && currentClass !== undefined) {
        const updatedClass = {
          ...currentClass,
          matches: currentClass.matches?.map((tournamentMatch) => {
            if (tournamentMatch.matchId === currentMatch.matchId) {
              return match;
            }
            return tournamentMatch;
          }),
          seededPlayersIds: currentClass.seededPlayersIds
            ? currentClass.seededPlayersIds
            : [],
          groups: currentClass.groups?.map((group) => {
            const updatedMatches = group.matches?.map((groupMatch) => {
              if (groupMatch.matchId === currentMatch.matchId) {
                return match;
              }
              return groupMatch;
            });
            console.log(updatedMatches);
            return {
              ...group,
              matches: updatedMatches,
            };
          }),
        };

        console.log(updatedClass);
        writeClass(true, updatedClass);
        setCurrentClass(updatedClass);

        clearMatchScore();
      }
    }
  }

 

  // Filter the unreportedMatches based on searchQuery
  

  function resetStates() {
    setClassStarted(false);
    setTournamentClasses([]);
    setShowMyTournament(false);
    setShowStartMenu(false);
    setShowCreateTournament(false);
    setShowClassInfo(false);
    setShowPlayersAndGroups(false);
    setShowTournamentOverview(false);
    setShowGroupsResultsAndUnreportedMatches(false);
    setEditTournament(false);
    setShowTournamentButtons(false);
    setShowGroupResult(false);
    setShowGroups(false);
    setShowTournamentButtons(false);
    setClassSeededPlayers([]);
    setShowOpenTournaments(false);
    setTournamentName("");
    setTournamentDateFrom("");
    setTournamentDateTo("");
    setTournamentLocation("");
    setTournamentClub("");
    setTournamentType("");
    setShowUnreportedMatches(false);
    setShowUserName(false);
    setUnreportedMatches([]);
  }

  //clears all the match scores to report the next match
  function clearMatchScore() {
    setSet1Player1(0);
    setSet1Player2(0);
    setSet2Player1(0);
    setSet2Player2(0);
    setSet3Player1(0);
    setSet3Player2(0);
    setSet4Player1(0);
    setSet4Player2(0);
    setSet5Player1(0);
    setSet5Player2(0);
    setSet6Player1(0);
    setSet6Player2(0);
    setSet7Player1(0);
    setSet7Player2(0);
    setWinner(undefined);
    setCheckWinner(0);
    setErrorMessage("");
    setCurrentMatch(undefined);
    setMatchId("");
    setMatchIdError(0);

    // TODO FIX REF DOES NOT WORK FOCUS!
    if (matchIdRef.current !== null && matchIdRef.current !== undefined) {
      matchIdRef.current?.focus();
    }

    //setShowReportResult(false);
  }

  // loads players with matching matchId
  function loadReportPlayers(matchID: number) {
    console.log("loadReportPlayers");
    setMatchIdError(0);
    if (currentClass !== undefined && currentClass !== null) {
      const match = currentClass.matches?.find(
        (match) => match.matchId === matchID
      );

      if (match !== null && match !== undefined) {
        if (match.reported === true) {
          setMatchIdError(-2);
          console.log("match already reported");
        }
        setCurrentMatch(match);

        // setShowReportResult(true);
      } else {
        console.log("match not found");
        setMatchIdError(-1);
      }
    } else {
      console.log("currentTournament is undefined or null");
      setMatchIdError(-1);
    }
  }
  // function that checks unreported matches in every group
   function handleCheckGroupStatus() {
    const matchIds: Match[] = []; // Array to store the matchIds

    if (currentClass) {
      const groups = currentClass.groups;

      if (groups) {
        groups.forEach((group) => {
          const matches = group.matches;

          if (matches) {
            matches.forEach((match) => {
              if (match && !match.reported) {
                // Check if match exists before accessing properties
                matchIds.push(match); // Store the matchId in the array
              }
            });
          }
        });
      }
      setUnreportedMatches(matchIds);
    }

    setShowUnreportedMatches(true);
    setShowGroupResult(false);
    setShowGroups(false);

    if (matchIds.length !== 0) {
      return -1;
    }
  }

  // displays the scores for every player in every match
  function handleLookUpPlayerScore(playerToDisplay: Player) {
    console.log("handleLookUpPlayerScore");
    if (currentClass !== undefined && currentClass !== null) {
      const player = currentClass.players?.find(
        (player) => player.id === playerToDisplay.id
      );

      if (player !== null && player !== undefined) {
        setCurrentPlayer(player);
      }
    }
    console.log(currentPlayer);
  }

  function handleCheckIfStartBracket() {
    if (handleCheckGroupStatus() === -1) {
      return;
    }

    if (currentClass !== undefined && currentClass !== null) {
      if (unreportedMatches.length === 0) {
        setStartBracket(true);
        console.log(startBracket);
        writeClass(true, {
          ...currentClass,
          startBracket: true,
        });
        //checkGroupAdvancement();
      }
      if (unreportedMatches === undefined || unreportedMatches === null) {
        setShowUnreportedMatches(true);
        console.log("unreportedMatches is undefined or null");
      }
    }
  }

  function handleDeleteTournament(tournament: Tournament) {
    console.log("handleDeleteTournament");
    if (tournament !== undefined && tournament !== null) {
      deleteTournament(tournament).then(() => {
        setCurrentTournament(undefined);
        setMyTournaments((prevTournaments) =>
          prevTournaments.filter(
            (t) => t.tournamentId !== tournament.tournamentId
          )
        );
      });
    }
  }

  function handleDeleteClasses(tournament: Tournament) {
    deleteClassesByTournamentId(tournament.tournamentId!);
    console.log("handleDeleteClasses");
  }

  function handleShowOpenTournaments() {
    setShowOpenTournaments(true);
    setShowMyTournament(false);
    setShowCreateTournament(false);

    setShowGroups(false);
    setShowUnreportedMatches(false);
    setShowGroupResult(false);
    loadOpenTournaments();
    setShowStartMenu(false);
    setLoadingOpenTournaments(true);
  }

  async function loadOpenTournaments() {
    const openTournaments = await getAllPublicTournaments();
    calculatePublicTournamentLength(openTournaments);
    setOpenTournaments(openTournaments);
    console.log(openTournaments);
    setLoadingOpenTournaments(false);
  }

  function calculateMyTournamentLength(tournaments: Tournament[]) {
    const lengths = tournaments
      .filter((tournament) => tournament.uid === uid)
      .map((tournament) => tournament.name?.length || 0);
    setMaxWidth(Math.max(...lengths) * 18);
  }

  function calculatePublicTournamentLength(tournaments: Tournament[]) {
    const lengths = tournaments
      .filter((tournament) => tournament.public === "Public")
      .map((tournament) => tournament.name?.length || 0);
    3;
    setMaxOpenWidth(Math.max(...lengths) * 18);
  }

  function handleEditTournament(tournament: Tournament) {
    console.log("handleEditTournament");
    setCurrentTournament(tournament);
    setTournamentDateFrom(tournament.dateFrom ? tournament.dateFrom : "");
    setTournamentDateTo(tournament.dateTo ? tournament.dateTo : "");
    setTournamentName(tournament.name ? tournament.name : "");
    setTournamentLocation(tournament.location ? tournament.location : "");
    setTournamentClub(tournament.club ? tournament.club : "");
    setTournamentId(tournament.tournamentId ? tournament.tournamentId : -1);
    setPublicOrPrivate(tournament.public ? tournament.public : "Public");
    setEditTournament(true);
    setShowCreateTournament(true);
    setShowMyTournament(false);
  }

  function handleJoinTournament(tournament: Tournament) {
    console.log("handleJoinTournament");
    console.log(tournament);
  }

  // App start
  return (
    <Box maxHeight="100vh" overflowY={"auto"} minWidth="100vw">
      <Flex
        bg="white"
        minHeight="100vh"
        justifyContent="center"
        //alignItems="center"
        //p={1}
      >
        <ChakraProvider>
          <Flex direction="column" align="center">
            <Center>
              <Box>
                <Button
                  colorScheme="green"
                  margin={2}
                  onClick={() => handlegoToHome()}
                >
                  Home
                </Button>
                <Button
                  colorScheme="blue"
                  margin={2}
                  onClick={async () => await handleGoogleLogin()}
                >
                  Sign in
                </Button>
                {currentTournament && !atStartScreen && showClassesButton && (
                  <Button
                    m={2}
                    bg="yellow.300"
                    textColor="gray.700"
                    onClick={() => handleTournamentOverview(currentTournament)}
                  >
                    Classes
                  </Button>
                )}
              </Box>
            </Center>
            {showUserName && (
              <Box mt={4}>
                {userName && <Text fontSize="14">Logged in as {userName}</Text>}
              </Box>
            )}

            {showStartMenu && (
              <>
                <Box mt={2}>
                  <img
                    src={logo}
                    alt="SVG Image"
                    style={{ width: "50%", margin: "auto" }}
                  />
                </Box>

                <Flex direction={"column"}>
                  {userLoggedIn && (
                    <Flex direction={"column"}>
                      <Button
                        m={2}
                        bg="orange.200"
                        onClick={() => handleCreateTournament()}
                      >
                        New tournament
                      </Button>

                      <Button
                        m={2}
                        bg="orange.200"
                        onClick={() => handleShowMyTournaments()}
                      >
                        My tournaments
                      </Button>
                    </Flex>
                  )}

                  <Box>
                    <Button
                      m={2}
                      bg="blue.200"
                      onClick={() => handleShowOpenTournaments()}
                    >
                      Open tournaments
                    </Button>
                  </Box>
                  {userLoggedIn && (
                    <Button
                      m={2}
                      bg="purple.300"
                      onClick={() =>
                        alert("This feature is not yet implemented")
                      }
                    >
                      My Profile
                    </Button>
                  )}
                </Flex>
              </>
            )}

            {showMyTournaments && (
              <Box maxWidth="100vw" bg="#FFFFF">
                <Center>
                  <Heading>My tournaments</Heading>
                </Center>
                {myTournaments
                  .filter((tournament) => tournament.uid === uid)
                  .map((tournament, index) => {
                    return (
                      <Box key={`${tournament.tournamentId}-${index}`}>
                        <Center>
                          <Box
                            onClick={() => {
                              handleTournamentOverview(tournament),
                                setCurrentTournament(tournament);
                            }}
                            _hover={{ bg: "#A2CDB0", cursor: "pointer" }}
                            rounded="lg"
                            bg="purple.100"
                            m={1}
                            width={"100%"}
                            minWidth={`${maxWidth}px`}
                          >
                            <Center>
                              <Tournament
                                name={tournament.name}
                                dateFrom={tournament.dateFrom}
                                dateTo={tournament.dateTo}
                                location={tournament.location}
                                club={tournament.club}
                              />
                            </Center>
                          </Box>

                          <Box margin={2}>
                            <Tooltip
                              label={`Edit Tournament ${tournament.name}`}
                              aria-label="edit-tooltip"
                            >
                              <EditIcon
                                margin={4}
                                color="black"
                                boxSize={24}
                                _hover={{ cursor: "pointer" }}
                                aria-label="Edit Tournament"
                                onClick={() => handleEditTournament(tournament)}
                              />
                            </Tooltip>

                            <Tooltip
                              label={`Delete Tournament ${tournament.name}`}
                              aria-label="delete-tooltip"
                            >
                              <DeleteIcon
                                color="black"
                                boxSize={24}
                                margin={4}
                                _hover={{ cursor: "pointer" }}
                                aria-label="Delete Tournament"
                                onClick={() => {
                                  setCurrentTournament(tournament);
                                  onOpenDeleteTournamentModal();
                                  setShowDeleteTournamentConfirmation(true);
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </Center>
                      </Box>
                    );
                  })}
                {showDeleteTournamentConfirmation && currentTournament && (
                  <Modal
                    isOpen={isDeleteTournamentModal}
                    onClose={onCloseDeleteTournamentModal}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader textColor="red.300">
                        Delete Tournament {currentTournament.name}
                      </ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Input
                          type="text"
                          value={deleteInput}
                          onChange={(e) => setDeleteInput(e.target.value)}
                          placeholder={`Type "${currentTournament.name}" to confirm deletion`}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          bg="red.300"
                          onClick={() => {
                            if (deleteInput === currentTournament.name) {
                              handleDeleteTournament(currentTournament);
                              handleDeleteClasses(currentTournament);
                            } else {
                              alert(
                                "Tournament name does not match. Deletion aborted."
                              );
                            }
                            setDeleteInput("");
                            setCurrentTournament(undefined);
                            onCloseDeleteTournamentModal();
                          }}
                        >
                          Confirm deletion
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                )}
                {loading && (
                  <Center>
                    <Text>Tournaments are loading, please be patient</Text>
                    <Spinner size="xl" />
                  </Center>
                )}
                {noTournaments && (
                  <Box>
                    <Text m="4" fontSize="40">
                      You don't have any tournaments! Create one!
                    </Text>
                    <Center>
                      <Button
                        onClick={() => {
                          resetStates();
                          handleCreateTournament();
                        }}
                        bg="green.200"
                      >
                        New tournament
                      </Button>
                    </Center>
                  </Box>
                )}
              </Box>
            )}

            {showCreateTournament && (
              <Box>
                <Center>
                  <Stack>
                    <FormControl>
                      <Center>
                        <FormLabel>
                          {editTournament === true
                            ? "Edit Tournament " + currentTournament?.name
                            : "Create new Tournament"}
                        </FormLabel>
                      </Center>

                      <Box p={2}>
                        <Input
                          isRequired
                          borderRadius="md"
                          bg={"white"}
                          value={tournamentName}
                          onChange={handleChange}
                          placeholder={
                            currentTournament?.name
                              ? currentTournament?.name
                              : "Name"
                          }
                          size="lg"
                        />
                      </Box>
                      <Box p={2}>
                        <Input
                          bg={"white"}
                          value={tournamentDateFrom}
                          placeholder="Select Date"
                          size="lg"
                          type="date"
                          onChange={(e) =>
                            setTournamentDateFrom(e.target.value)
                          }
                        ></Input>
                      </Box>
                      <Box p={2}>
                        <Input
                          bg={"white"}
                          value={tournamentDateTo}
                          placeholder="Select Date"
                          size="lg"
                          type="date"
                          onChange={(e) => setTournamentDateTo(e.target.value)}
                        ></Input>
                      </Box>
                      <Box p={2}>
                        <Input
                          borderRadius="md"
                          bg={"white"}
                          value={tournamentLocation}
                          onChange={handleLocationChange}
                          placeholder={
                            currentTournament?.location
                              ? currentTournament?.location
                              : "Location"
                          }
                          size="lg"
                        />
                      </Box>
                      <Box p={2}>
                        <Input
                          borderRadius="md"
                          bg={"white"}
                          value={tournamentClub}
                          onChange={handleClubChange}
                          placeholder={"Club name"}
                          size="lg"
                        />
                      </Box>
                      <Center>
                        <RadioGroup
                          onChange={handlePublicOrPrivate}
                          value={publicOrPrivate}
                          defaultValue="Private"
                        >
                          <HStack spacing="24px">
                            <Radio value="Public">Public</Radio>
                            <Radio value="Private">Private</Radio>
                          </HStack>
                        </RadioGroup>
                      </Center>
                      <Center>
                        <Button
                          bg={"#F5F0BB"}
                          m={4}
                          onClick={() => createTournament()}
                          disabled={
                            tournamentName === "" || tournamentDateFrom === ""
                          }
                          style={{
                            visibility:
                              tournamentName === "" || tournamentDateFrom === ""
                                ? "hidden"
                                : "visible",
                          }}
                        >
                          {editTournament === true ? "Apply changes" : "Create"}
                        </Button>
                      </Center>
                    </FormControl>
                  </Stack>
                </Center>
              </Box>
            )}

            {showOpenTournaments && (
              <Box maxWidth="100vw">
                {loadingOpenTournaments && (
                  <Center>
                    <Text>Tournaments are loading, please be patient</Text>
                    <Spinner size="xl" />
                  </Center>
                )}
                {upcomingTournaments.length > 0 && (
                  <>
                    <Center>
                      <Heading size="lg">Upcoming Tournaments</Heading>
                    </Center>
                    {upcomingTournaments.map((tournament) => (
                      <Box
                        m={4}
                        borderRadius="md"
                        bg={"#F7E1AE"}
                        key={tournament.tournamentId}
                        p={4}
                        minWidth={`${maxOpenWidth}px`}
                      >
                        <Center>
                          <Stack>
                            <Flex direction="column">
                              <Center>
                                <Heading size="lg">{tournament.name}</Heading>
                              </Center>
                              <Center>
                                <Text>{tournament.location}</Text>
                              </Center>
                              <Center>
                                <Box>
                                  <Text fontSize="sm">
                                    {tournament.dateFrom} / {tournament.dateTo}
                                  </Text>
                                </Box>
                              </Center>
                              <Center>
                                <Box>
                                  <Text fontSize="sm">{tournament.club}</Text>
                                </Box>
                              </Center>
                            </Flex>
                            <Center>
                              <Flex>
                                <Button
                                  m={1}
                                  size="md"
                                  fontSize="20"
                                  mr={2}
                                  bg="blue.200"
                                  onClick={() => {
                                    handleJoinTournament(tournament);
                                    alert("Not yet implemented");
                                  }}
                                >
                                  Info
                                </Button>
                              </Flex>
                            </Center>
                          </Stack>
                        </Center>
                      </Box>
                    ))}
                  </>
                )}
                {pastTournaments.length > 0 && (
                  <>
                    <Center>
                      <Heading size="lg">Past Tournaments</Heading>
                    </Center>
                    {pastTournaments.map((tournament) => (
                      <Box
                        m={4}
                        borderRadius="md"
                        bg={"#F7E1AE"}
                        key={tournament.tournamentId}
                        p={4}
                        minWidth={`${maxOpenWidth}px`}
                      >
                        <Center>
                          <Stack>
                            <Flex direction="column">
                              <Center>
                                <Heading size="lg">{tournament.name}</Heading>
                              </Center>
                              <Center>
                                <Text>{tournament.location}</Text>
                              </Center>
                              <Center>
                                <Box>
                                  <Text fontSize="sm">
                                    {tournament.dateFrom} / {tournament.dateTo}
                                  </Text>
                                </Box>
                              </Center>
                              <Center>
                                <Box>
                                  <Text fontSize="sm">{tournament.club}</Text>
                                </Box>
                              </Center>
                            </Flex>
                            <Center>
                              <Flex>
                                <Button
                                  m={1}
                                  size="md"
                                  fontSize="20"
                                  bg="blue.200"
                                  onClick={() => {
                                    handleJoinTournament(tournament);
                                    alert("Not yet implemented");
                                  }}
                                >
                                  View Result
                                </Button>
                              </Flex>
                            </Center>
                          </Stack>
                        </Center>
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            )}

            {showTournamentOverview && (
              <Center>
                <Box maxWidth="100vw">
                  {currentTournament && (
                    <Center>
                      <Box>
                        <Heading m={2} fontWeight="bold">
                          {currentTournament.name}
                        </Heading>
                      </Box>
                    </Center>
                  )}

                  <Box>
                    <Center>
                      <Button bg="yellow.300" onClick={onOpenCreateClassModal}>
                        New class
                      </Button>
                    </Center>
                  </Box>

                  <FormControl>
                    <Modal
                      initialFocusRef={initialRef}
                      isOpen={isCreateClassModalOpen}
                      onClose={onCloseCreateClassModal}
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader> Create new Class</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={8}>
                          <FormControl isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input
                              ref={initialRef}
                              placeholder="Classname"
                              value={className}
                              onChange={handleClassNameChange}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Type</FormLabel>
                            <Select
                              borderRadius="md"
                              placeholder="Select option"
                              onChange={handleTournamentType}
                            >
                              <option value="groups">Groups</option>
                              <option value="bracket">Bracket</option>
                              <option value="teamMatch">Team Match</option>
                            </Select>
                          </FormControl>
                          {tournamentType === "groups" && (
                            <FormControl>
                              <FormLabel>Groups of</FormLabel>
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
                                Uneven amount of players into groups of 3 or 5?
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

                              <FormLabel as="legend">
                                Number of sets in group
                              </FormLabel>
                              <RadioGroup
                                onChange={handleBoChange}
                                value={bo}
                                defaultValue="Bo5"
                              >
                                <HStack spacing="24px">
                                  <Radio value="Bo3">Bo3</Radio>
                                  <Radio value="Bo5">Bo5</Radio>
                                  <Radio value="Bo7">Bo7</Radio>
                                </HStack>
                              </RadioGroup>
                              <FormLabel as="legend">
                                Public or Private
                              </FormLabel>
                              <RadioGroup
                                onChange={handlePublicOrPrivateClass}
                                value={publicOrPrivateClass}
                                defaultValue="Private"
                              >
                                <HStack spacing="24px">
                                  <Radio value="Public">Public</Radio>
                                  <Radio value="Private">Private</Radio>
                                </HStack>
                              </RadioGroup>
                            </FormControl>
                          )}
                          {tournamentType === "bracket" && (
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

                          {tournamentType === "teamMatch" && (
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
                              createClass(currentTournament!);
                              onCloseCreateClassModal();
                            }}
                            colorScheme="blue"
                            disabled={className === ""}
                            style={{
                              visibility:
                                className === "" ? "hidden" : "visible",
                            }}
                          >
                            Save and Close
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </FormControl>

                  <Box p={4}>
                    <Flex
                      display="flex"
                      flexWrap="wrap"
                      justifyContent="center"
                    >
                      {tournamentClasses.map((myClass: Class, index) => (
                        <Box
                          key={`${myClass.classId}-${index}`}
                          _hover={{ bg: "green.300" }}
                          bg="blue.800"
                          m={2}
                          p={4}
                          borderRadius="md"
                          onClick={() => handleGoToClassInfo(myClass)}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          cursor="pointer"
                        >
                          <Tooltip
                            label={myClass.name}
                            aria-label="edit-tooltip"
                          >
                            <Text textColor="white" fontSize={40}>
                              {myClass.name}
                            </Text>
                          </Tooltip>
                        </Box>
                      ))}
                    </Flex>
                  </Box>
                </Box>
              </Center>
            )}
            {/** Class info */}
            {showClassInfo && classStarted === false && currentClass && (
              <Flex>
                <Center>
                  <Stack>
                    <Box>
                      {currentTournament && (
                        <Center>
                          <Heading size="md" fontWeight={"bold"}>
                            {currentTournament.name} - {currentClass.name}
                          </Heading>
                        </Center>
                      )}
                    </Box>
                    <Flex>
                      <Button
                        size={"lg"}
                        fontSize={"30"}
                        colorScheme="purple"
                        onClick={onOpenAddPlayersModal}
                        m={2}
                      >
                        Add Players
                      </Button>
                    </Flex>
                  </Stack>

                  <Modal
                    isOpen={isOpenAddPlayersModal}
                    onClose={onCloseAddPlayersModal}
                  >
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
                          borderRadius="md"
                          size="sm"
                        />
                        <Text mb="8px">Club: {searchClub}</Text>
                        <Flex>
                          <Input
                            borderRadius="md"
                            value={searchClub}
                            onChange={handleClubSearch}
                            placeholder=""
                            size="sm"
                          />
                        </Flex>
                        <Box mt={4}>
                          {filteredPlayers
                            .slice(displayedPlayersFrom, displayedPlayersTo)
                            .map((player) => {
                              return (
                                <Box
                                  width="100%"
                                  mt={1}
                                  key={player.id}
                                  onClick={() => {
                                    addPlayerToTournament(player);
                                  }}
                                >
                                  <Player
                                    sentPlayerIds={sentPlayerIds}
                                    class={player.class}
                                    id={player.id}
                                    name={player.name}
                                    club={player.club}
                                    points={player.points}
                                    css="add-player"
                                  />
                                </Box>
                              );
                            })}
                        </Box>
                      </ModalBody>
                      <Center>
                        <ModalFooter>
                          <Center>
                            <IconButton
                              m={2}
                              aria-label="Arrow Back"
                              icon={<ArrowBackIcon />}
                              colorScheme="red"
                              onClick={() => {
                                setDisplayedPlayersFrom(
                                  displayedPlayersFrom - 10
                                );
                                setDisplayedPlayersTo(displayedPlayersTo - 10);
                              }}
                              size={"md"}
                            />

                            <IconButton
                              m={2}
                              aria-label="Arrow Back"
                              icon={<ArrowForwardIcon />}
                              colorScheme="green"
                              onClick={() => {
                                setDisplayedPlayersFrom(
                                  displayedPlayersFrom + 10
                                );
                                setDisplayedPlayersTo(displayedPlayersTo + 10);
                              }}
                              size={"md"}
                            />

                            <Button
                              m={2}
                              onClick={onCloseAddPlayersModal}
                              colorScheme="blue"
                              mr={3}
                            >
                              Done
                            </Button>
                          </Center>
                        </ModalFooter>
                      </Center>
                    </ModalContent>
                  </Modal>
                </Center>
              </Flex>
            )}
            {showTournamentButtons && classStarted === false && (
              <>
                <Flex m={2} justifyContent="space-between">
                  <Center>
                    <Box mr={5}>
                      <Button
                        size="lg"
                        fontSize="30"
                        bg="green.200"
                        onClick={() => saveTournament()}
                      >
                        Save Class
                      </Button>
                    </Box>
                    <Box mr={5}>
                      <Button
                        size="lg"
                        fontSize="30"
                        bg="orange.200"
                        onClick={() =>
                          handleSetClassSeededPlayers(
                            currentClass?.players || [],
                            true
                          )
                        }
                      >
                        Seed players
                      </Button>
                    </Box>
                    <Box mr={5}>
                      {currentTournament && (
                        <Button
                          size="lg"
                          fontSize="30"
                          bg="#B2A4FF"
                          onClick={() => {
                            handleDrawTournament();
                            setPlayerDeleted(false);
                          }}
                        >
                          Draw Class
                        </Button>
                      )}
                    </Box>
                    <Box>
                      {currentClass &&
                        currentClass.readyToStart === true &&
                        !playerDeleted && (
                          <Button
                            size="lg"
                            fontSize="30"
                            bg="#C9F4AA"
                            onClick={() => handleStartClass()}
                          >
                            Start Class
                          </Button>
                        )}
                    </Box>
                    <Spacer />
                    <Box mr={2}>
                      {currentClass && playerDeleted === true && (
                        <Button
                          onClick={() => alert("Please draw tournament first")}
                          size="lg"
                          fontSize="30"
                          bg="#FEA1A1"
                        >
                          Start Class
                        </Button>
                      )}
                    </Box>
                  </Center>
                </Flex>
              </>
            )}

            {showPlayersAndGroups && classStarted === false && (
              <Flex>
                <Box m={2}>
                  <Flex overflow="hidden" maxHeight="100%">
                    <Box flex="1" p={1}>
                      {currentClass?.groups
                        ?.slice(0, Math.ceil(currentClass.groups.length / 2))
                        .map((group) => (
                          <Box p={1} key={group.name}>
                            <Group
                              seededPlayersIds={currentClass.seededPlayersIds}
                              name={group.name}
                              players={group.players}
                            />
                          </Box>
                        ))}
                    </Box>
                    <Box p={1}>
                      {currentClass?.groups
                        ?.slice(Math.ceil(currentClass.groups.length / 2))
                        .map((group) => (
                          <Box p={1} key={group.name}>
                            <Group
                              seededPlayersIds={currentClass.seededPlayersIds}
                              name={group.name}
                              players={group.players}
                            />
                          </Box>
                        ))}
                    </Box>
                  </Flex>
                </Box>

                <Box m={2} flex="1" maxHeight="100%">
                  {currentClass &&
                    currentClass.players &&
                    currentClass.players
                      .sort((a, b) => {
                        if (!a.points || !b.points) {
                          return 0;
                        }
                        return b.points - a.points;
                      })
                      .map((player) => {
                        const isSeeded =
                          classSeededPlayers?.includes(player.id) ||
                          currentClass.seededPlayersIds?.includes(player.id);

                        return (
                          <Box
                            p={[0, 0.5]}
                            key={player.id}
                            style={{ flex: "0 0 auto" }}
                          >
                            <Flex>
                              <IconButton
                                aria-label="Open chat"
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                onClick={() => {
                                  deletePlayerFromTournament(player);
                                  setPlayerDeleted(true);
                                }}
                                size={"sm"}
                              />
                              {isSeeded ? (
                                <SeededPlayer
                                  name={player.name}
                                  club={player.club}
                                  points={player.points}
                                  class={player.class}
                                />
                              ) : (
                                <Player
                                  id={player.id}
                                  name={player.name}
                                  club={player.club}
                                  points={player.points}
                                  class={player.class}
                                />
                              )}
                            </Flex>
                          </Box>
                        );
                      })}
                </Box>
              </Flex>
            )}

            {currentClass &&
              currentClass.started === true &&
              showGroupsResultsAndUnreportedMatches && (
                <Flex direction="column">
                  <Center>
                    <Heading margin={5}>{currentClass?.name || ""}</Heading>
                  </Center>
                  <Flex>
                    <Button
                      m="2"
                      fontSize={"30"}
                      size={"lg"}
                      // Color scheme for more colors use bg
                      bg={"#F7E1AE"}
                      onClick={() => {
                        setShowGroups(true);
                        setShowGroupResult(false);
                        setShowUnreportedMatches(false);
                        set;
                      }}
                    >
                      Groups
                    </Button>

                    <Modal
                      isOpen={isOpenScoreModal}
                      onClose={onCloseScoreModal}
                    >
                      <ModalOverlay />
                      <ModalContent bg={"blue.200"}>
                        <ModalHeader fontSize="24">
                          <Center>
                            <Text> Report match score</Text>
                          </Center>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Center>
                            <Flex direction="column" alignItems="center">
                              <Flex alignItems="center">
                                <Center>
                                  <Input
                                    ref={inputMatchIdRefA}
                                    bg="white"
                                    maxLength={5}
                                    fontWeight="bold"
                                    id="matchid"
                                    size="sm"
                                    width="40%"
                                    borderRadius="4"
                                    placeholder="Match ID"
                                    value={matchId}
                                    onChange={(e) => setMatchId(e.target.value)}
                                  />
                                </Center>
                              </Flex>
                              <Button
                                bg="green.300"
                                textColor="white"
                                m="2"
                                onClick={() => {
                                  console.log(matchId);
                                  console.log(matchIdError);
                                  loadReportPlayers(parseInt(matchId));
                                }}
                              >
                                Load match
                              </Button>
                            </Flex>
                          </Center>

                          <Center>
                            <Box>
                              {currentMatch && (
                                <Flex>
                                  {matchIdError === -1 ? (
                                    <>
                                      <Flex>
                                        <Center>
                                          <Text
                                            fontFamily={"bold"}
                                            fontSize="14"
                                          >
                                            Invalid MatchID
                                          </Text>
                                        </Center>
                                      </Flex>
                                      {setCurrentMatch(undefined)}
                                    </>
                                  ) : matchIdError === -2 ? (
                                    <Center>
                                      <>
                                        <Center>
                                          <Box>
                                            <Stack align="center">
                                              <Text
                                                textColor={"red"}
                                                fontWeight="bold"
                                                fontSize="17"
                                                textAlign="center"
                                              >
                                                Match already reported
                                              </Text>
                                              <Text textAlign="center">
                                                Report again?
                                              </Text>
                                              <Box>
                                                <Button
                                                  margin={2}
                                                  bg={"#A0D8B3"}
                                                  onClick={() =>
                                                    setMatchIdError(0)
                                                  }
                                                >
                                                  Yes
                                                </Button>
                                                <Button
                                                  margin={2}
                                                  bg={"#E76161"}
                                                  onClick={() => {
                                                    setCurrentMatch(undefined);
                                                    setMatchIdError(0);
                                                  }}
                                                >
                                                  No
                                                </Button>
                                              </Box>
                                            </Stack>
                                          </Box>
                                        </Center>
                                      </>
                                    </Center>
                                  ) : (
                                    <>
                                      <Flex
                                        direction="column"
                                        alignItems="center"
                                      >
                                        <Flex alignItems="center">
                                          {" "}
                                          {/* Add alignItems="center" to center the names */}
                                          <Box flex="1">
                                            <Box>
                                              <Text
                                                fontWeight="bold"
                                                fontSize="14"
                                                overflowWrap="break-word"
                                                textAlign="center"
                                              >
                                                {currentMatch.player1?.name}
                                              </Text>
                                            </Box>
                                          </Box>
                                          <Text m={2} fontSize="12">
                                            Match {currentMatch.matchId}
                                          </Text>
                                          <Box flex="1">
                                            <Center>
                                              <Box>
                                                <Text
                                                  fontWeight="bold"
                                                  fontSize="14"
                                                  overflowWrap="break-word"
                                                  textAlign="center"
                                                >
                                                  {currentMatch.player2?.name}
                                                </Text>
                                              </Box>
                                            </Center>
                                          </Box>
                                        </Flex>
                                      </Flex>
                                    </>
                                  )}
                                </Flex>
                              )}
                              {matchIdError === -1 && !currentMatch && (
                                <Center>
                                  <Text fontSize="20">Invalid MatchID</Text>
                                </Center>
                              )}
                            </Box>
                          </Center>

                          {(bo === "Bo3" || bo === "Bo5" || bo === "Bo7") && (
                            <Flex direction="column">
                              <Box>
                                <Flex>
                                  <Center>
                                    <Input
                                      m={1}
                                      ref={inputSetRef}
                                      value={set1Player1}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet1Player1(parseInt(inputValue));
                                        } else {
                                          setSet1Player1(0);
                                        }
                                      }}
                                      maxLength={2}
                                      bg="white"
                                      id="set1player1"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                      fontWeight={"bold"}
                                    />
                                    <Text fontSize={"30"} m={1}>
                                      {" "}
                                      -{" "}
                                    </Text>
                                    <Input
                                      m={1}
                                      value={set1Player2}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet1Player2(parseInt(inputValue));
                                        } else {
                                          setSet1Player2(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set1player2"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                              <Box>
                                <Flex>
                                  <Center>
                                    <Input
                                      m={1}
                                      value={set2Player1}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet2Player1(parseInt(inputValue));
                                        } else {
                                          setSet2Player1(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set2player1"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                    <Text fontSize={"30"} m={1}>
                                      {" "}
                                      -{" "}
                                    </Text>
                                    <Input
                                      m={1}
                                      minLength={1}
                                      value={set2Player2}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet2Player2(parseInt(inputValue));
                                        } else {
                                          setSet2Player2(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set2player2"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                              <Box>
                                <Flex>
                                  <Center>
                                    <Input
                                      m={1}
                                      value={set3Player1}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet3Player1(parseInt(inputValue));
                                        } else {
                                          setSet3Player1(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set3player1"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                    <Text fontSize={"30"} m={1}>
                                      {" "}
                                      -{" "}
                                    </Text>
                                    <Input
                                      m={1}
                                      value={set3Player2}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet3Player2(parseInt(inputValue));
                                        } else {
                                          setSet3Player2(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set3player2"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                            </Flex>
                          )}

                          {(bo === "Bo5" || bo === "Bo7") && (
                            <Flex direction="column">
                              <Box>
                                <Flex>
                                  <Center>
                                    <Input
                                      m={1}
                                      value={set4Player1}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet4Player1(parseInt(inputValue));
                                        } else {
                                          setSet4Player1(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set4player1"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                    <Text fontSize={"30"} m={1}>
                                      {" "}
                                      -{" "}
                                    </Text>
                                    <Input
                                      m={1}
                                      value={set4Player2}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet4Player2(parseInt(inputValue));
                                        } else {
                                          setSet4Player2(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set4player2"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                              <Box>
                                <Flex>
                                  <Center>
                                    <Input
                                      m={1}
                                      value={set5Player1}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet5Player1(parseInt(inputValue));
                                        } else {
                                          setSet5Player1(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set5player1"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                    <Text fontSize={"30"} m={1}>
                                      {" "}
                                      -{" "}
                                    </Text>
                                    <Input
                                      m={1}
                                      value={set5Player2}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet5Player2(parseInt(inputValue));
                                        } else {
                                          setSet5Player2(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set5player2"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                            </Flex>
                          )}

                          {bo === "Bo7" && (
                            <Flex direction="column">
                              <Box>
                                <Flex>
                                  <Center>
                                    <Input
                                      m={1}
                                      value={set6Player1}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet6Player1(parseInt(inputValue));
                                        } else {
                                          setSet6Player1(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set6player1"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />

                                    <Text fontSize={"30"} m={1}>
                                      {" "}
                                      -{" "}
                                    </Text>

                                    <Input
                                      m={1}
                                      value={set6Player2}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet6Player2(parseInt(inputValue));
                                        } else {
                                          setSet6Player2(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set6player2"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                              <Box>
                                <Flex>
                                  <Center>
                                    <Input
                                      m={1}
                                      value={set7Player1}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet7Player1(parseInt(inputValue));
                                        } else {
                                          setSet7Player1(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set7player1"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />

                                    <Text fontSize={"30"} m={1}>
                                      {" "}
                                      -{" "}
                                    </Text>

                                    <Input
                                      m={1}
                                      value={set7Player2}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (!isNaN(parseInt(inputValue))) {
                                          setSet7Player2(parseInt(inputValue));
                                        } else {
                                          setSet7Player2(0);
                                        }
                                      }}
                                      maxLength={2}
                                      fontWeight={"bold"}
                                      bg={"white"}
                                      id="set7player2"
                                      maxWidth={"15%"}
                                      borderRadius={4}
                                      size="sm"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                            </Flex>
                          )}
                          <Flex justifyContent="center">
                            {" "}
                            {/* Add justifyContent="center" to horizontally center the content */}
                            <Center>
                              {" "}
                              {/* Move the Center component here */}
                              <Popover>
                                <PopoverTrigger>
                                  <Button
                                    bg={"orange.200"}
                                    textColor="whiteAlpha.900"
                                    margin={"4"}
                                    onClick={() =>
                                      handleCheckWinner(currentClass.bo!)
                                    }
                                  >
                                    Check Winner
                                  </Button>
                                </PopoverTrigger>
                                {checkWinner === -1 && (
                                  <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>{errorMessage}</PopoverBody>
                                  </PopoverContent>
                                )}
                                {checkWinner === 1 && (
                                  <PopoverContent bg={"#F5F0BB"}>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody
                                      fontSize={20}
                                      fontWeight={"bold"}
                                    >
                                      {winner?.name} wins
                                      <Center>
                                        <Text>
                                          {wonSetsPlayer1} - {wonSetsPlayer2}
                                        </Text>
                                      </Center>
                                    </PopoverBody>
                                    <Button
                                      margin={"2"}
                                      onClick={() => {
                                        handleMatchScore();
                                        const updatedMatches =
                                          unreportedMatches.filter(
                                            (match) =>
                                              String(match.matchId!) !== matchId
                                          );
                                        setUnreportedMatches(updatedMatches);
                                      }}
                                      bg={"#A0D8B3"}
                                    >
                                      Correct
                                    </Button>
                                  </PopoverContent>
                                )}
                              </Popover>
                              <Button
                                onClick={() => {
                                  if (checkWinner !== 1 && matchId !== "") {
                                    const result = window.confirm(
                                      "Please check the winner before closing the modal. Are you sure you want to proceed?"
                                    );
                                    if (result === true) {
                                      onCloseScoreModal();
                                    }
                                  } else {
                                    onCloseScoreModal();
                                  }
                                }}
                                bg="green.300"
                                textColor="white"
                              >
                                Done
                              </Button>
                            </Center>
                          </Flex>
                        </ModalBody>
                      </ModalContent>
                    </Modal>

                    <Button
                      m={2}
                      size="lg"
                      fontSize={"30"}
                      bg={"#F7E1AE"}
                      onClick={() => {
                        setShowGroupResult(true);
                        setShowUnreportedMatches(false);
                        setShowGroups(false);
                      }}
                    >
                      Results
                    </Button>

                    <Button
                      fontSize={"30"}
                      m={2}
                      size={"lg"}
                      onClick={() => {
                        onOpenScoreModal();
                      }}
                      bg={"green.300"}
                    >
                      Report result
                    </Button>

                    <Button
                      m={2}
                      fontSize={"30"}
                      size={"lg"}
                      bg={"orange.300"}
                      onClick={() => {
                        handleCheckGroupStatus();
                        console.log(unreportedMatches)
                        
                        setShowGroupResult(false);
                        setShowGroups(false);
                      }}
                    >
                      Status
                    </Button>
                    {unreportedMatches.length === 0 && (
                      <Button
                        onClick={() => {
                          handleCheckIfStartBracket();
                        }}
                        // justifyContent={"flex-end"}
                        size="lg"
                        fontSize="30"
                        bg={"green.300"}
                        m="2"
                      >
                        Start bracket
                      </Button>
                    )}

                    {(unreportedMatches.length !== 0 ||
                      unreportedMatches === null) && (
                      // red button
                      <Button
                        onClick={() => {
                          alert(
                            unreportedMatches.length + `  unreported matches`
                          );
                        }}
                        // justifyContent={"flex-end"}
                        size="lg"
                        fontSize="30"
                        bg={"#E76161"}
                        m="2"
                      >
                        Start bracket
                      </Button>
                    )}
                  </Flex>
                  <Flex direction="column">
                    {showUnreportedMatches &&
                      unreportedMatches.length !== 0 && (
                        <Center>
                          <Text fontSize={"24"}>Unreported Matches</Text>
                        </Center>
                      )}
                    {showUnreportedMatches &&
                      unreportedMatches.length === 0 && (
                        <Center>
                          <Text fontSize={"24"}>No unreported matches</Text>
                        </Center>
                      )}
                    <Box p={3}>
                      {showUnreportedMatches && (
                        <Center>
                        
                        <Input
                        value={matchSearch}
                        onChange={handleUnreportedMatchSearch}
                        fontWeight={"bold"}
                        
                        placeholder="Search for MatchID or Name" width={"40%"} size="md" ></Input>
                          
                        </Center>
                      )}
                      {showUnreportedMatches &&
                       filteredMatches.map((match) => {
                        
                          if (!match.matchId) {
                            console.log("hllo")
                            return null; // Skip the iteration if there is no matchId
                          }

                          return (
                            <Center key={match.matchId}>
                              <Box
                                onClick={() => {
                                  onOpenScoreModal();
                                  setMatchId(String(match.matchId));
                                  loadReportPlayers(match.matchId!);
                                  setCurrentMatch(match);
                                }}
                                width={"40%"}
                                margin={"3px"}
                              >
                                <Match
                                  key={match.matchId}
                                  matchId={match.matchId}
                                  player1={match.player1}
                                  player2={match.player2}
                                />
                              </Box>
                            </Center>
                          );
                        })}
                    </Box>
                  </Flex>

                  {showGroups && (
                    <Box>
                      <Flex display="flex" flexWrap="wrap">
                        {currentClass?.groups!.map((group) => (
                          <Box
                            margin={"5"}
                            onClick={onOpenMatchesModal}
                            width={"40%"}
                            key={group.name}
                          >
                            <Modal
                              finalFocusRef={inputSetRef}
                              isCentered
                              onClose={onCloseMatchesModal}
                              isOpen={isOpenMatchesModal}
                              motionPreset="slideInBottom"
                              blockScrollOnMount={false}
                            >
                              <ModalOverlay opacity={0.6} bg={"#"} />
                              <ModalContent>
                                {currentPlayer && currentPlayer.name && (
                                  <ModalHeader>
                                    Matches for {currentPlayer.name}
                                  </ModalHeader>
                                )}
                                <ModalCloseButton />
                                <ModalBody>
                                  <Box>
                                    {currentPlayer && currentClass?.matches && (
                                      <>
                                        {currentClass.matches
                                          .filter(
                                            (match) =>
                                              match.player1?.id ===
                                                currentPlayer.id ||
                                              match.player2?.id ===
                                                currentPlayer.id
                                          )
                                          .map((match) => {
                                            // Add this console.log statement
                                            return (
                                              <Box
                                                m={2}
                                                key={match.matchId}
                                                onClick={() => {
                                                  setMatchId(
                                                    String(match.matchId)
                                                  );
                                                  loadReportPlayers(
                                                    match.matchId!
                                                  );
                                                  setCurrentMatch(match);
                                                  onOpenScoreModal();
                                                }}
                                              >
                                                <DisplayMatchScore
                                                  key={match.matchId}
                                                  match={match}
                                                />
                                              </Box>
                                            );
                                          })}
                                      </>
                                    )}
                                  </Box>
                                </ModalBody>

                                <ModalFooter>
                                  <Button
                                    colorScheme="blue"
                                    mr={3}
                                    onClick={onCloseMatchesModal}
                                  >
                                    Close
                                  </Button>
                                </ModalFooter>
                              </ModalContent>
                            </Modal>

                            <GroupDisplayScore
                              onPlayerClick={handleLookUpPlayerScore}
                              seededPlayersIds={currentClass.seededPlayersIds}
                              groupName={group.name}
                              players={group.players}
                            />
                          </Box>
                        ))}
                      </Flex>
                    </Box>
                  )}

                  {showGroupResult && (
                    <Box>
                      <Flex display="flex" flexWrap="wrap">
                        {currentClass?.groups?.map((group) => (
                          <Box margin={5} width={"40%"} key={group.name}>
                            <GroupResult
                              name={group.name}
                              players={group.players}
                              matches={group.matches}
                            />
                          </Box>
                        ))}
                      </Flex>
                    </Box>
                  )}
                </Flex>
              )}
          </Flex>
        </ChakraProvider>
      </Flex>
    </Box>
  );
}

export default App;
