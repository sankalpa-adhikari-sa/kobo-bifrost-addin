import React from "react";
import { Card, CardHeader, CardPreview, Divider } from "@fluentui/react-components";
import { Text, Button } from "@fluentui/react-components";
import { Link, useNavigate } from "react-router";
import { useStoredToken } from "../hooks/useStoredToken";
import { DocumentRegular, LinkRegular, Settings16Regular } from "@fluentui/react-icons";

const About: React.FC = () => {
  const navigate = useNavigate();
  const { token, kpiUrl } = useStoredToken();

  return (
    <div className="p-3 min-h-screen flex flex-col">
      <Card
        style={{
          backgroundColor: "var(--colorNeutralBackground3)",
        }}
        className="w-full mb-4"
      >
        <CardHeader
          header={
            <Text weight="semibold" size={300}>
              KoboToolbox Add-in
            </Text>
          }
        />
        <CardPreview className="pt-1 pb-3 px-3">
          <Text
            style={{
              color: "var(--colorNeutralForeground3Hover)",
            }}
            size={200}
            className="leading-relaxed"
          >
            Streamline your survey data workflows directly from Office applications.
          </Text>
        </CardPreview>
      </Card>

      {!token || !kpiUrl ? (
        <Card
          style={{
            backgroundColor: "var(--colorNeutralBackground3)",
          }}
          appearance="filled-alternative"
          className="w-full border-l-4 border-l-orange-400"
        >
          <CardPreview className="p-3">
            <div className="flex flex-col gap-2">
              <div className="text-orange-700 w-full font-semibold">Setup Required</div>
              <Text
                style={{
                  color: "var(--colorNeutralForeground3Hover)",
                }}
                size={100}
                className=" mb-2"
              >
                Configure your account to get started
              </Text>
              <Button
                appearance="primary"
                size="small"
                icon={<Settings16Regular />}
                onClick={() => navigate("/token-manager")}
                className="float-right"
              >
                Setup Account
              </Button>
            </div>
          </CardPreview>
        </Card>
      ) : (
        <Card
          style={{
            backgroundColor: "var(--colorNeutralBackground3)",
          }}
          className=" border-l-4 border-l-green-400"
        >
          <CardPreview className=" p-3">
            <div className="flex flex-col gap-2">
              <div className=" w-full font-semibold">Account ready</div>
              <Text
                style={{
                  color: "var(--colorNeutralForeground3Hover)",
                }}
                size={100}
                className=" mb-2"
              >
                Let's get started
              </Text>
              <Button
                appearance="primary"
                size="small"
                icon={<DocumentRegular />}
                onClick={() => navigate("/assets")}
                className="float-right"
              >
                Go to Projects
              </Button>
            </div>
          </CardPreview>
        </Card>
      )}
      <Divider />
      <Link
        to="#"
        className="inline-flex items-center gap-1.5 text-xs no-underline hover:underline transition-colors"
      >
        <LinkRegular className="w-3 h-3" />
        View on GitHub
      </Link>
    </div>
  );
};

export default About;
