import { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  Text,
  Dropdown,
  Option,
  Field,
  Body1,
  Caption1,
  Divider,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  Eye20Regular,
  EyeOff20Regular,
  Key20Regular,
  Globe20Regular,
  CheckmarkCircle20Filled,
} from "@fluentui/react-icons";
import { useStoredToken } from "../hooks/useStoredToken";

const useStyles = makeStyles({
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: tokens.spacingVerticalL,
  },
  card: {
    padding: tokens.spacingVerticalL,
    gap: tokens.spacingVerticalM,
    display: "flex",
    flexDirection: "column",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  buttonGroup: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap",
  },
  savedInfo: {
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  urlContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  customUrlInput: {
    marginTop: tokens.spacingVerticalS,
  },
  icon: {
    color: tokens.colorBrandBackground,
  },
});

const KPI_URLS = [
  { key: "custom", text: "Custom URL", value: "custom" },
  { key: "eu", text: "EU - eu.kobotoolbox.org", value: "https://eu.kobotoolbox.org" },
  { key: "kf", text: "KF - kf.kobotoolbox.org", value: "https://kf.kobotoolbox.org" },
  { key: "ee", text: "EE - ee.eu.kobotoolbox.org", value: "https://ee.eu.kobotoolbox.org" },
];

export const TokenManager = () => {
  const { token, saveToken, clearToken, kpiUrl, saveKpiUrl, clearKpiUrl } = useStoredToken();
  const styles = useStyles();

  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [showCustomUrl, setShowCustomUrl] = useState(false);

  const handleSaveToken = async () => {
    if (tokenInput.trim()) {
      await saveToken(tokenInput.trim());
      setTokenInput("");
    }
  };

  const handleSaveKpiUrl = async () => {
    const urlToSave = selectedUrl === "custom" ? customUrl.trim() : selectedUrl;
    if (urlToSave) {
      await saveKpiUrl(urlToSave);
      setSelectedUrl("");
      setCustomUrl("");
      setShowCustomUrl(false);
    }
  };

  const handleUrlChange = (_: any, data: any) => {
    const value = data.optionValue || "";
    setSelectedUrl(value);
    setShowCustomUrl(value === "custom");
  };

  const isUrlSaveDisabled = () => {
    if (selectedUrl === "custom") {
      return !customUrl.trim();
    }
    return !selectedUrl;
  };

  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <div style={{ display: "flex", alignItems: "center", gap: tokens.spacingHorizontalS }}>
            <Key20Regular className={styles.icon} />
            <Body1>API Configuration</Body1>
          </div>
          <Caption1>Configure your API token and KoBoToolbox server URL</Caption1>
        </CardHeader>

        <div className={styles.section}>
          <Field label="API Token" required>
            <Input
              type={showToken ? "text" : "password"}
              placeholder="Enter your API token"
              value={tokenInput}
              onChange={(e) => setTokenInput((e.target as HTMLInputElement).value)}
              contentAfter={
                <Button
                  appearance="transparent"
                  icon={showToken ? <EyeOff20Regular /> : <Eye20Regular />}
                  onClick={toggleTokenVisibility}
                  size="small"
                  title={showToken ? "Hide token" : "Show token"}
                />
              }
            />
          </Field>

          <div className={styles.buttonGroup}>
            <Button
              appearance="primary"
              onClick={handleSaveToken}
              disabled={!tokenInput.trim()}
              icon={<CheckmarkCircle20Filled />}
            >
              Save Token
            </Button>
            <Button appearance="secondary" onClick={clearToken} disabled={!token}>
              Clear Token
            </Button>
          </div>

          {token && (
            <div className={styles.savedInfo}>
              <CheckmarkCircle20Filled style={{ color: tokens.colorPaletteGreenForeground1 }} />
              <div>
                <Text size={200} weight="semibold">
                  Token saved successfully
                </Text>
                <br />
                <Caption1>{showToken ? token : "•".repeat(Math.min(token.length, 20))}</Caption1>
              </div>
            </div>
          )}
        </div>

        <Divider />

        <div className={styles.section}>
          <Field label="KoBoToolbox Server" required>
            <div className={styles.urlContainer}>
              <Dropdown
                placeholder="Select a server"
                value={selectedUrl ? KPI_URLS.find((url) => url.value === selectedUrl)?.text : ""}
                selectedOptions={selectedUrl ? [selectedUrl] : []}
                onOptionSelect={handleUrlChange}
              >
                {KPI_URLS.map((url) => (
                  <Option key={url.key} value={url.value}>
                    {url.text}
                  </Option>
                ))}
              </Dropdown>

              {showCustomUrl && (
                <div className={styles.customUrlInput}>
                  <Input
                    placeholder="https://your-custom-server.com"
                    value={customUrl}
                    onChange={(e) => setCustomUrl((e.target as HTMLInputElement).value)}
                    contentBefore={<Globe20Regular />}
                  />
                </div>
              )}
            </div>
          </Field>

          <div className={styles.buttonGroup}>
            <Button
              appearance="primary"
              onClick={handleSaveKpiUrl}
              disabled={isUrlSaveDisabled()}
              icon={<CheckmarkCircle20Filled />}
            >
              Save URL
            </Button>
            <Button appearance="secondary" onClick={clearKpiUrl} disabled={!kpiUrl}>
              Clear URL
            </Button>
          </div>

          {kpiUrl && (
            <div className={styles.savedInfo}>
              <CheckmarkCircle20Filled style={{ color: tokens.colorPaletteGreenForeground1 }} />
              <div>
                <Text size={200} weight="semibold">
                  Server URL saved successfully
                </Text>
                <br />
                <Caption1>{kpiUrl}</Caption1>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
