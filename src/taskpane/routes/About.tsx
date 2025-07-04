import React from "react";
import { Card, CardHeader, CardPreview, Divider } from "@fluentui/react-components";
import { Text, Button } from "@fluentui/react-components";
import { Link, useNavigate } from "react-router";
import { useStoredToken } from "../hooks/useStoredToken";
import { EmptyDocumentIcon, OpenLinkIcon, SettingsIcon } from "../components/primitives/icons";

const About: React.FC = () => {
  const navigate = useNavigate();
  const { token, kpiUrl } = useStoredToken();

  return (
    <div className="p-3 min-h-screen">
      <Card
        style={{
          backgroundColor: "var(--colorNeutralBackground3)",
        }}
        className="w-full mb-4"
      >
        <CardHeader
          header={
            <Text weight="semibold" size={300}>
              Kobo-bifrost
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
                icon={<SettingsIcon />}
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
                icon={<EmptyDocumentIcon />}
                onClick={() => navigate("/assets")}
                className="float-right"
              >
                Go to Projects
              </Button>
            </div>
          </CardPreview>
        </Card>
      )}
      <Divider className="my-4" />
      <Card
        style={{
          backgroundColor: "var(--colorNeutralBackground3)",
        }}
        className=" rounded-2xl shadow-sm  "
      >
        <h3 className="text-sm font-semibold">Helpful Resources</h3>
        <Divider />

        <ul className="flex flex-col gap-3 text-sm">
          <li>
            <Link
              to="https://docs.getodk.org/tutorial-first-form/"
              target="_blank"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline transition-all"
            >
              <OpenLinkIcon className="w-4 h-4 text-blue-500 group-hover:text-blue-700" />
              GetODK Docs
            </Link>
          </li>
          <li>
            <Link
              to="https://xlsform.org/en/"
              target="_blank"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline transition-all"
            >
              <OpenLinkIcon className="w-4 h-4 text-blue-500 group-hover:text-blue-700" />
              XLSForm Docs
            </Link>
          </li>
          <li>
            <Link
              to="https://www.kobotoolbox.org/"
              target="_blank"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline transition-all"
            >
              <OpenLinkIcon className="w-4 h-4 text-blue-500 group-hover:text-blue-700" />
              KoboToolbox
            </Link>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default About;
