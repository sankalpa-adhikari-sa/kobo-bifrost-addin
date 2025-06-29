import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useDestructiveStyles = makeStyles({
  destructive: {
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorStatusDangerBackground3,
    ...shorthands.border("1px", "solid", tokens.colorStatusDangerBackground3),
    "&:hover": {
      backgroundColor: tokens.colorStatusDangerBackground3Hover,
      color: tokens.colorNeutralForegroundOnBrand,
      ...shorthands.border("1px", "solid", tokens.colorStatusDangerBackground3Hover),
    },
    "&:active": {
      backgroundColor: `${tokens.colorStatusDangerBackground3Pressed} !important`,
      color: `${tokens.colorNeutralForegroundOnBrand} !important`,
      ...shorthands.border(
        "1px",
        "solid",
        `${tokens.colorStatusDangerBackground3Pressed} !important`
      ),
    },
    "&:disabled": {
      color: `${tokens.colorNeutralForegroundDisabled} !important`,
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      ...shorthands.border("none"),
    },
    "&:hover:disabled": {
      backgroundColor: tokens.colorNeutralBackgroundDisabled,
      color: tokens.colorNeutralForegroundDisabled,
      border: "none",
    },
    "&:disabled:active": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      color: `${tokens.colorNeutralForegroundDisabled} !important`,
      ...shorthands.border("none"),
    },
  },
  destructiveIcon: {
    color: tokens.colorNeutralForegroundOnBrand,
  },
});

export const useSuccessStyles = makeStyles({
  success: {
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorStatusSuccessBackground3,
    ...shorthands.border("1px", "solid", tokens.colorStatusSuccessBackground3),
    "&:hover": {
      backgroundColor: "#0e700e",
      color: tokens.colorNeutralForegroundOnBrand,
      ...shorthands.border("1px", "solid", "#0e700e"),
    },
    "&:active": {
      backgroundColor: "#094509 !important",
      color: `${tokens.colorNeutralForegroundOnBrand} !important`,
      ...shorthands.border("1px", "solid", "#094509 !important"),
    },
    "&:disabled": {
      color: `${tokens.colorNeutralForegroundDisabled} !important`,
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      ...shorthands.border("none"),
    },
    "&:hover:disabled": {
      backgroundColor: tokens.colorNeutralBackgroundDisabled,
      color: tokens.colorNeutralForegroundDisabled,
      border: "none",
    },
    "&:disabled:active": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      color: `${tokens.colorNeutralForegroundDisabled} !important`,
      ...shorthands.border("none"),
    },
  },
  successIcon: {
    color: tokens.colorNeutralForegroundOnBrand,
  },
});

export const useWarningStyles = makeStyles({
  warning: {
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorStatusWarningBackground3,
    ...shorthands.border("1px", "solid", tokens.colorStatusWarningBackground3),
    "&:hover": {
      backgroundColor: "#bc4b09",
      color: tokens.colorNeutralForegroundOnBrand,
      ...shorthands.border("1px", "solid", "#bc4b09"),
    },
    "&:active": {
      backgroundColor: "#8a3707 !important",
      color: `${tokens.colorNeutralForegroundOnBrand} !important`,
      ...shorthands.border("1px", "solid", "#8a3707 !important"),
    },
    "&:disabled": {
      color: `${tokens.colorNeutralForegroundDisabled} !important`,
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      ...shorthands.border("none"),
    },
    "&:hover:disabled": {
      backgroundColor: tokens.colorNeutralBackgroundDisabled,
      color: tokens.colorNeutralForegroundDisabled,
      border: "none",
    },
    "&:disabled:active": {
      backgroundColor: `${tokens.colorNeutralBackgroundDisabled} !important`,
      color: `${tokens.colorNeutralForegroundDisabled} !important`,
      ...shorthands.border("none"),
    },
  },
  warningIcon: {
    color: tokens.colorNeutralForegroundOnBrand,
  },
});
