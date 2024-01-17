import { Button, Flex, Heading, Spacer } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Header: React.FC<unknown> = () => {
  const navigate = useNavigate();

  return (
    <Flex gap={2} style={{ padding: "2rem" }}>
      <Heading
        size={"lg"}
        fontSize={"x-large"}
        role="link"
        cursor={"pointer"}
        onClick={() => navigate("/")}
      >
        Nats Board
      </Heading>
      <Spacer />
      <SettingsIcon boxSize={25} bgColor={"transparent"} color={"teal"} />
    </Flex>
  );
};

export default Header;
