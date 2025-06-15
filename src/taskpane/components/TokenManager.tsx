import React, { useState } from "react";
import { Input, Button, Card, CardHeader, CardFooter, Text } from "@fluentui/react-components";
import { useStoredToken } from "../hooks/useStoredToken";

export const TokenManager = () => {
  const { token, saveToken, clearToken } = useStoredToken();
  const [input, setInput] = useState("");

  const handleSave = async () => {
    await saveToken(input);
    setInput("");
  };

  return (
    <Card>
      <CardHeader>
        <Text weight="semibold">API Token</Text>
      </CardHeader>

      <Input
        placeholder="Enter your token"
        value={input}
        onChange={(e) => setInput((e.target as HTMLInputElement).value)}
      />

      <CardFooter>
        <Button appearance="primary" onClick={handleSave} disabled={!input}>
          Save Token
        </Button>
        <Button
          appearance="secondary"
          onClick={clearToken}
          disabled={!token}
          style={{ marginLeft: 8 }}
        >
          Clear Token
        </Button>
      </CardFooter>

      {token && (
        <Text size={300} style={{ marginTop: 10 }}>
          <strong>Saved Token:</strong> {token}
        </Text>
      )}
    </Card>
  );
};
