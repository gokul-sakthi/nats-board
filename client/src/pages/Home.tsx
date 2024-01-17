import { Button, Flex, Spacer, Stack } from "@chakra-ui/react";
import Header from "../component/Header";
import StatusHandler from "../component/StatusHandler";
import JetStreamHolder from "../component/JetStream";

const Home: React.FC<unknown> = () => {
  return (
    <>
      <Header />
      <Stack direction={"row"} padding={5}>
        <Spacer />
        <StatusHandler />
      </Stack>

      <JetStreamHolder />
    </>
  );
};

export default Home;
