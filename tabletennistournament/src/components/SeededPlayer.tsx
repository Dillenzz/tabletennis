import { Box, Text } from "@chakra-ui/react";

interface Player {
  worldRanking?: null | string;
  nationalRanking?: string;
  pastRanking?: string;
  name?: string;
  birthYear?: string;
  club?: string;
  points?: number | null;
  pointsChange?: number;
  gender?: string;
  id?: number;
  class?: string;
  isTopPlayer?: boolean;
  onClick?: () => void;
  css?: string;
}

function SeededPlayer(props: Player) {
  const isGroupPlayer = props.css === "group-player";

  const backgroundColor = isGroupPlayer ? "transparent" : "#F5F0BB";
  const hoverStyle = isGroupPlayer
    ? {}
    : { bg: "green.100", cursor: "pointer" };

  return (
    <Box
      onClick={props.onClick}
      width="100%"
      p="1"
      _hover={hoverStyle}
      bg={backgroundColor}
      rounded="lg"
    >
      <Text fontWeight="bold">
        {props.name} - {props.club} ({props.class}) {props.points}
      </Text>
    </Box>
  );
}

export default SeededPlayer;
