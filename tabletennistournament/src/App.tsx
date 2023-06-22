import { useState, ChangeEvent, useRef, useEffect } from "react";
import realPlayers from "./scrape/players_with_ids.json";
//import logo from "./Free_Sample_By_Wix_adobe_express.svg";

import Player from "./components/Player";
import { getTournamentsByUid } from "./Backend/updateFirebase2";
import { getAllPublicTournaments } from "./Backend/updateFirebase2";
import { loadTournamentClasses } from "./Backend/updateFirebase2";
import { writeClass } from "./Backend/updateFirebase2";

import { writeTournament2 } from "./Backend/updateFirebase2";
import deleteTournament from "./Backend/deleteTournament";

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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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

import { HamburgerIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
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


  // states for clarity
  const [editTournament, setEditTournament] = useState(false);
  const [showUserName, setShowUserName] = useState(true);
 

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
  
// State for overview of tournament
  const [showTournamentOverview, setShowTournamentOverview] = useState(false);

// states for shown class
  const [showPlayersAndGroups, setShowPlayersAndGroups] = useState(false);
  const [showTournamentButtons, setShowTournamentButtons] = useState(false);


  // states for displaying tourament length
  const [maxWidth, setMaxWidth] = useState(0);
  const [maxOpenWidth, setMaxOpenWidth] = useState(0);

  const [readyToStart, setReadyToStart] = useState(false);

  // States for showing groups and unreported matches -> After starting tournament
  const [showGroups, setShowGroups] = useState(true);
  const [showUnreportedMatches, setShowUnreportedMatches] = useState(false);
  const [
    showGroupsResultsAndUnreportedMatches,
    setShowGroupsResultsAndUnreportedMatches,
  ] = useState(false);

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

  // States for loading the right tournaments for Uid
  const [userName, setUserName] = useState("");
  const [uid, setUid] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // set search variables
  const [searchName, setSearchName] = useState("");
  const [searchClub, setSearchClub] = useState("");
  const [sentPlayerIds, setSentPlayerIds] = useState<number[]>([]);
  
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

  // States for directing highligted menu item
  const initialRef = useRef(null);
  const inputSetRef = useRef(null);

  // CLASS VARIABLES

  // const [myClasses, setMyClasses] = useState<Class[]>([]);
  const [tournamentClasses, setTournamentClasses] = useState<Class[]>([]);
  const [classId, setClassId] = useState(-1);
  const [publicOrPrivateClass, setPublicOrPrivateClass] = useState("public");
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

  const createTournament = () => {
    setShowStartMenu(true);
    setShowCreateTournament(false);
    console.log("Id we are sending to writeTournamnet",tournamentId);

    const newTournament: Tournament = {
      uid: uid,
      name: tournamentName,
      dateFrom: tournamentDateFrom,
      dateTo: tournamentDateTo,
      location: tournamentLocation,
      public: publicOrPrivate,
      tournamentId: tournamentId,
    };

    const updatedTournaments = [...myTournaments, newTournament];
    writeTournament2(newTournament); // Write to Firebase
    setMyTournaments(updatedTournaments);
    calculateMyTournamentLength(updatedTournaments);
    setCurrentTournament(newTournament);
    setTournamentDateFrom("");
    setTournamentDateTo("");
    setTournamentLocation("");
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

  const handleCreateTournament = async () => {
    const user = await getUsernameAndSessionDuration();
    if (user !== null && uid !== "") {
      setShowCreateTournament(true);
      setShowStartMenu(!showStartMenu);

      // reset all state variables to their initial values
      setTournamentDateFrom("");
      setTournamentDateTo("");
      setTournamentLocation("");
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
      setMyTournaments(loadTournaments);
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
    setTournamentClasses([]);
    setShowMyTournament(false);
    setShowStartMenu(true);
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
    setTournamentType("");
    setShowUnreportedMatches(false);
    setShowUserName(true);
    setUnreportedMatches([]);
  };
  // go to tournament info
  const handleGoToTournaments = () => {
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
    setShowClassInfo(true);

    setCurrentClass(myClass);
    setClassPlayers(myClass.players ? myClass.players : []);
    setClassStarted(myClass.started ? myClass.started : false);
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

  async function handleTournamentOverview(tournament: Tournament) {
    setShowTournamentOverview(true);
    //setShowClassInfo(false);
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
      console.log(currentClass.players);
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
        setReadyToStart(false);
        return;
      } else if (
        currentClass.players?.length < 4 &&
        currentClass.numberInGroup === 4
      ) {
        alert("Please add atleast 4 players to the tournament");
        setReadyToStart(false);
        return;
      }
    } else {
      alert("Please add players to the tournament");
      setReadyToStart(false);
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

      if (numberOfPlayers === 3) {
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
  function handleCheckWinner() {
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
      const sets = [set1, set2, set3, set4, set5];

      for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        const player1Score = set.player1Score;
        const player2Score = set.player2Score;

        if (!isNaN(player1Score) && !isNaN(player2Score)) {
          // Check if the absolute difference is greater than or equal to 2
          if (
            (player1Score > 11 || player2Score > 11) &&
            Math.abs(player1Score - player2Score) != 2
          ) {
            throw new Error(
              "Input error: Absolute difference between scores need to be 2"
            );
          }

          if (
            Math.abs(player1Score - player2Score) >= 2 ||
            (player1Score == 0 && player2Score == 0)
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
      }

      if (wonSetsPlayer1 === wonSetsPlayer2) {
        throw new Error(
          "Input error: The number of won sets for each player cannot be equal."
        );
      }

      if (wonSetsPlayer1 < 3 && wonSetsPlayer2 < 3) {
        throw new Error(
          "Input error: At least one player must win 3 or more sets."
        );
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
    } catch (error: any) {
      setCheckWinner(-1);
      setErrorMessage(error.message);
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
      const sets = [set1, set2, set3, set4, set5];

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
    setTournamentName(tournament.name? tournament.name : "");
    setTournamentLocation(tournament.location ? tournament.location : "");
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
                <Menu>
                  <MenuButton
                    bg="#FFFFF"
                    colorScheme="ghost"
                    m={2}
                    as={Button}
                    aria-label="Options"
                    leftIcon={<HamburgerIcon />}
                    variant="outline"
                  >
                    Menu
                  </MenuButton>

                  <MenuList>
                    <MenuItem onClick={() => handlegoToHome()}>Home</MenuItem>
                    <MenuItem onClick={() => handleGoToTournaments()}>
                      My Tournaments
                    </MenuItem>
                  </MenuList>
                </Menu>

                <Button
                  colorScheme="blue"
                  margin={2}
                  onClick={async () => await handleGoogleLogin()}
                  ml={2}
                >
                  Sign in
                </Button>
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
                   // src={logo}
                    alt="SVG Image"
                    style={{ width: "50%", margin: "auto" }}
                  />
                </Box>

                <Flex>
                  {userLoggedIn && (
                    <Box>
                      <Button
                        bg="#F5F0BB"
                        onClick={() => handleCreateTournament()}
                        margin={0.5}
                      >
                        New Tournament
                      </Button>

                      <Button
                        bg="#F5F0BB"
                        onClick={() => handleShowMyTournaments()}
                        margin={0.5}
                      >
                        My tournaments
                      </Button>
                    </Box>
                  )}

                  <Box>
                    <Button
                      bg="#F5F0BB"
                      onClick={() => handleShowOpenTournaments()}
                      margin={0.5}
                    >
                      Open tournaments
                    </Button>
                  </Box>
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
                              />
                            </Center>
                          </Box>

                          <Box margin={2}>
                            <Tooltip
                              label={`Edit Tournament ${tournament.name}`}
                              aria-label="edit-tooltip"
                            >
                              <EditIcon
                                margin={10}
                                color="black"
                                boxSize={24}
                                _hover={{ cursor: "pointer" }}
                                aria-label="Edit Tournament"
                                onClick={() => handleEditTournament(tournament)
                                }
                              />
                            </Tooltip>

                            <Tooltip
                              label={`Delete Tournament ${tournament.name}`}
                              aria-label="delete-tooltip"
                            >
                              <DeleteIcon
                                color="black"
                                boxSize={24}
                                margin={10}
                                _hover={{ cursor: "pointer" }}
                                aria-label="Delete Tournament"
                                onClick={() => {
                                  const confirmDelete = window.confirm(
                                    `Are you sure you want to delete the tournament "${tournament.name}"?`
                                  );
                                  if (confirmDelete) {
                                    handleDeleteTournament(tournament);
                                  }
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </Center>
                      </Box>
                    );
                  })}
                {loading && (
                  <Center>
                    <Text>Tournaments are loading, please be patient</Text>
                    <Spinner size="xl" />
                  </Center>
                )}
              </Box>
            )}

            {showCreateTournament && (
              <Box>
                <Center>
                  <Stack>
                    <FormControl>
                      <Center>
                        <FormLabel>{editTournament === true ? "Edit Tournament " + currentTournament?.name : "Create new Tournament"}</FormLabel>
                      </Center>

                      <Box p={2}>
                        <Input
                          isRequired
                          borderRadius="md"
                          bg={"white"}
                          value={tournamentName}
                          onChange={handleChange}
                          placeholder={currentTournament?.name ? currentTournament?.name : "Name"}
                          size="lg"
                        />
                      </Box>
                      <Box p={2}>
                        <Input
                          bg={"white"}
                          value={tournamentDateFrom}
                          placeholder="Select Date and Time"
                          size="lg"
                          type="datetime-local"
                          onChange={(e) =>
                            setTournamentDateFrom(e.target.value)
                          }
                        ></Input>
                      </Box>
                      <Box p={2}>
                        <Input
                          bg={"white"}
                          value={tournamentDateTo}
                          placeholder="Select Date and Time"
                          size="lg"
                          type="datetime-local"
                          onChange={(e) => setTournamentDateTo(e.target.value)}
                        ></Input>
                      </Box>
                      <Box p={2}>
                        <Input
                          borderRadius="md"
                          bg={"white"}
                          value={tournamentLocation}
                          onChange={handleLocationChange}
                          placeholder={currentTournament?.location ? currentTournament?.location : "Location"}
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

                          disabled={tournamentName === ""}
                            style={{
                              visibility:
                                tournamentName === "" ? "hidden" : "visible",
                            }}
                        >
                          Done
                        </Button>


                       
                      </Center>
                      {/** 
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
                          <ModalBody pb={8}>
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
                                  Uneven amount of players into groups of 3 or
                                  5?.
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
                                  Number of sets
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
                                createTournament();
                                onClose();
                              }}
                              colorScheme="blue"
                            >
                              Save and Close
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                            */}
                    </FormControl>
                  </Stack>
                </Center>
              </Box>
            )}

            {showOpenTournaments && (
              <Box maxWidth="100vw">
                {openTournaments && (
                  <Box m={4}>
                    <Center>
                      <Heading fontWeight={"bold"}>Open Tournaments</Heading>
                    </Center>
                  </Box>
                )}
                {loadingOpenTournaments && (
                  <Center>
                    <Text>Tournaments are loading, please be patient</Text>
                    <Spinner size="xl" />
                  </Center>
                )}
                {openTournaments.map((tournament: Tournament) => {
                  return (
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
                          <Box>
                            <Center>
                              <Heading>{tournament.name}</Heading>
                            </Center>
                          </Box>
                          <Center>
                            <Flex>
                              <Button
                                m={2}
                                size={"md"}
                                fontSize={"24"}
                                mr={2}
                                bg="blue.200"
                                onClick={() => {
                                   handleJoinTournament(tournament);
                                }}
                              >
                                Info
                              </Button>
                              
                            </Flex>
                          </Center>
                        </Stack>
                      </Center>
                    </Box>
                  );
                })}
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
                      <Button bg="#F5F0BB" onClick={onOpenCreateClassModal}>
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
                          bg="green.200"
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
                            <Text fontSize={40}>{myClass.name}</Text>
                          </Tooltip>
                        </Box>
                      ))}
                    </Flex>
                  </Box>
                </Box>
              </Center>
            )}
            {/** Class info */}
            {showClassInfo && !classStarted && (
              <Box >
                <Center>
                  <Stack>
                    <Box>
                      {currentTournament && (
                        <Center>
                          <Heading fontWeight={"bold"}>
                            {currentTournament.name}
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
                        Add players
                      </Button>
                      <Button
                        size={"lg"}
                        fontSize={"30"}
                        colorScheme="blue"
                        m={2}
                        onClick={() => handleTournamentOverview(currentTournament!)}
                        
                      >
                        Classes
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
                          {filteredPlayers.slice(0, 25).map((player) => {
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
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          onClick={onCloseAddPlayersModal}
                          colorScheme="blue"
                          mr={3}
                        >
                          Done
                        </Button>
                        <Button variant="ghost">More players</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Center>
              </Box>
            )}
            {showTournamentButtons && !classStarted && (
              <>
                <Flex m={2} justifyContent="space-between">
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
                        onClick={() => handleDrawTournament()}
                      >
                        Draw Class
                      </Button>
                    )}
                  </Box>
                  <Box>
                    {currentClass && currentClass.readyToStart && (
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
                    {currentClass &&
                      (!currentClass.readyToStart || classStarted) && (
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
                </Flex>
              </>
            )}

            {showPlayersAndGroups && !classStarted && (
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
                <Box>
                  {/*console.log("currentClass", currentClass)*/}
                  <Center>
                    <Heading margin={5}>{currentClass?.name || ""}</Heading>
                  </Center>
                  <Flex justifyContent="space-between">
                    <Button
                      mr="5"
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
                      <ModalContent bg={"#DBDFAA"}>
                        <ModalHeader fontSize="24">
                          Report match score
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Box p={1}>
                            <Center>
                              <Flex>
                                <Text fontSize="24" fontWeight={"bold"}>
                                  Match ID
                                </Text>
                                <Spacer />
                                <Input
                                  ref={inputMatchIdRefA}
                                  bg={"white"}
                                  maxLength={5}
                                  fontWeight={"bold"}
                                  id="matchid"
                                  p={1}
                                  maxWidth={"30%"}
                                  maxHeight={"20%"}
                                  size="sm"
                                  value={matchId}
                                  onChange={(e) => setMatchId(e.target.value)}
                                />
                                <Spacer />
                                <Button
                                  bg={"#A0D8B3"}
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
                          </Box>
                          <Center>
                            <Box margin={5}>
                              {currentMatch && (
                                <Flex>
                                  {matchIdError === -1 ? (
                                    <>
                                      <Flex>
                                        <Center>
                                          <Text
                                            fontFamily={"bold"}
                                            fontSize="24"
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
                                        flexDirection="column"
                                        alignItems="center"
                                      >
                                        <Text m={5} fontSize="40">
                                          Match {currentMatch.matchId}
                                        </Text>
                                        <Flex
                                          justifyContent="space-between"
                                          alignItems="center"
                                        >
                                          <Box>
                                            <Box maxWidth={150}>
                                              <Text
                                                fontWeight="bold"
                                                fontSize="20"
                                                overflowWrap="break-word"
                                              >
                                                {currentMatch.player1?.name}
                                              </Text>
                                            </Box>
                                          </Box>
                                          <Spacer />
                                          <Box>
                                            <Box maxWidth={150}>
                                              <Text
                                                marginLeft={12}
                                                fontWeight="bold"
                                                fontSize="20"
                                                overflowWrap="break-word"
                                              >
                                                {currentMatch.player2?.name}
                                              </Text>
                                            </Box>
                                          </Box>
                                        </Flex>
                                      </Flex>
                                    </>
                                  )}
                                </Flex>
                              )}
                              {matchIdError === -1 && !currentMatch && (
                                <Center>
                                  <Text fontSize="40">Invalid MatchID</Text>
                                </Center>
                              )}
                            </Box>
                          </Center>

                          {(bo === "Bo3" || bo === "Bo5" || bo === "Bo7") && (
                            <Stack>
                              <Box p={1}>
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
                                      borderRadius={"5px"}
                                      maxWidth={"15%"}
                                      size="md"
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
                                      size="md"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                              <Box p={1}>
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
                                      borderRadius={"5px"}
                                      maxWidth={"15%"}
                                      size="md"
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
                                      size="md"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                              <Box p={1}>
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
                                      borderRadius={"5px"}
                                      maxWidth={"15%"}
                                      size="md"
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
                                      size="md"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                            </Stack>
                          )}

                          {(bo === "Bo5" || bo === "Bo7") && (
                            <Stack>
                              <Box p={1}>
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
                                      borderRadius={"5px"}
                                      maxWidth={"15%"}
                                      size="md"
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
                                      size="md"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                              <Box p={1}>
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
                                      borderRadius={"5px"}
                                      maxWidth={"15%"}
                                      size="md"
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
                                      size="md"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                            </Stack>
                          )}

                          {bo === "Bo7" && (
                            <Stack>
                              <Box p={1}>
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
                                      borderRadius={"5px"}
                                      maxWidth={"15%"}
                                      size="md"
                                      colorScheme="whiteAlpha"
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
                                      size="md"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                              <Box p={1}>
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
                                      borderRadius={"5px"}
                                      maxWidth={"15%"}
                                      size="md"
                                      colorScheme="whiteAlpha"
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
                                      size="md"
                                    />
                                  </Center>
                                </Flex>
                              </Box>
                            </Stack>
                          )}

                          <Popover>
                            <PopoverTrigger>
                              <Center>
                                <Button
                                  bg={"#FFF8D6"}
                                  margin={"4"}
                                  onClick={() => handleCheckWinner()}
                                >
                                  Check Winner
                                </Button>
                              </Center>
                            </PopoverTrigger>
                            {checkWinner == -1 && (
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>{errorMessage}</PopoverBody>
                              </PopoverContent>
                            )}
                            {checkWinner == 1 && (
                              <PopoverContent bg={"#F5F0BB"}>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <Center>
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
                                </Center>
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
                        </ModalBody>

                        <ModalFooter>
                          <Button
                            onClick={() => {
                              if (checkWinner !== 1) {
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
                            bg={"#A0D8B3"}
                            mr={3}
                          >
                            Done
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>

                    <Button
                      mr={5}
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
                      mr={5}
                      size={"lg"}
                      onClick={() => {
                        onOpenScoreModal();
                      }}
                      bg={"#F7E1AE"}
                    >
                      Report result
                    </Button>

                    <Button
                      mr={5}
                      fontSize={"30"}
                      size={"lg"}
                      bg={"blue.300"}
                      onClick={() => {
                        handleCheckGroupStatus();
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
                        marginRight={"5"}
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
                        mr={"5"}
                      >
                        Start bracket
                      </Button>
                    )}
                  </Flex>
                  <Box>
                    {showUnreportedMatches &&
                      unreportedMatches.length !== 0 && (
                        <Center>
                          <Text fontSize={"40"}>Unreported Matches</Text>
                        </Center>
                      )}
                    {showUnreportedMatches &&
                      unreportedMatches.length === 0 && (
                        <Center>
                          <Text fontSize={"30"}>No unreported matches</Text>
                        </Center>
                      )}
                    <Box p={3}>
                      {showUnreportedMatches &&
                        unreportedMatches.map((match) => {
                          if (!match.matchId) {
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
                                width={"50%"}
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
                  </Box>

                  {showGroups && (
                    <Box>
                      <Flex>
                        {currentClass?.groups
                          ?.reduce((columns: JSX.Element[][], group, index) => {
                            const columnIndex = Math.floor(index / 4);

                            if (!columns[columnIndex]) {
                              columns[columnIndex] = [];
                            }

                            columns[columnIndex].push(
                              <Box
                                margin={"5"}
                                width={
                                  currentClass.groups!.length < 4
                                    ? "30%"
                                    : currentClass.groups!.length > 12
                                    ? "80%"
                                    : "60%"
                                }
                                onClick={onOpenScoreModal}
                                key={group.name}
                              >
                                <Modal
                                  finalFocusRef={inputSetRef}
                                  isCentered
                                  onClose={onCloseScoreModal}
                                  isOpen={isOpenScoreModal}
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
                                    <ModalBody padding={5}>
                                      <Box>
                                        {currentPlayer &&
                                          currentClass?.matches && (
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
                                        onClick={onCloseScoreModal}
                                      >
                                        Close
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>

                                <GroupDisplayScore
                                  onPlayerClick={handleLookUpPlayerScore}
                                  seededPlayersIds={
                                    currentClass.seededPlayersIds
                                  }
                                  groupName={group.name}
                                  players={group.players}
                                />
                              </Box>
                            );

                            return columns;
                          }, [])
                          .map((column, columnIndex) => (
                            <Box flex="1" key={columnIndex}>
                              {column}
                            </Box>
                          ))}
                      </Flex>
                    </Box>
                  )}
                </Box>
              )}
            {showGroupResult && (
              <Box>
                {currentClass?.groups?.map((group) => {
                  console.log(group);
                  return (
                    <Box margin={5} width={"40%"} key={group.name}>
                      {" "}
                      {/* Add a key prop to the enclosing Box component */}
                      <GroupResult
                        name={group.name}
                        players={group.players}
                        matches={group.matches}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
            {startBracket && readyToStart && (
              <Box>
                <Text>HEJ</Text>
              </Box>
            )}
          </Flex>
        </ChakraProvider>
      </Flex>
    </Box>
  );
}

export default App;
