import { Box, SimpleGrid, Text } from "@chakra-ui/react";

interface JetStreamHolderList {
  name: string;
  key: string;
  navigateTo: string;
}

const JetStreamHolder: React.FC<unknown> = () => {
  const ListHolder: JetStreamHolderList[] = [
    {
      key: "jetstream-holder",
      name: "Streams",
      navigateTo: "/jetstream/streams",
    },
  ];

  return (
    <SimpleGrid margin={5}>
      {ListHolder.map((l) => (
        <Box
          width={"17rem"}
          minHeight={"10rem"}
          padding={5}
          display={"inline-flex"}
          bgColor={"teal"}
          borderRadius={5}
          cursor={"pointer"}
          shadow={20}
        >
          <Text fontSize={25} color={"white"}>
            {l.name}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default JetStreamHolder;
