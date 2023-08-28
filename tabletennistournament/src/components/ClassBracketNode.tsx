import Match from "./Match";

import { Box, Text} from "@chakra-ui/react";

interface ClassBracketNode {
    match?: Match;
    parent?: ClassBracketNode | null;
    up?: ClassBracketNode | null; // Child representing one path of advancement
    down?: ClassBracketNode | null; // Child representing another path of advancement
}


function ClassBracketNode(props: { node: ClassBracketNode }) {
    const { match, up, down } = props.node;

    return (
        <Box>
            {match && (
                <Text>
                    {match.player1?.name} - {match.player2?.name}
                </Text>
            )}
            {up && <ClassBracketNode node={up} />}
            {down && <ClassBracketNode node={down} />}
        </Box>
    );
}


export default ClassBracketNode;