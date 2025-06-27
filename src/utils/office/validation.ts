import Fuse from "fuse.js";

type SheetMessages = {
  survey: string[];
  choices: string[];
  settings: string[];
  entities: string[];
};
type ValidationResult = {
  errors: SheetMessages;
  warnings: SheetMessages;
  states?: {
    hasSurveySheet: boolean;
    hasChoicesSheet: boolean;
    hasSettingsSheet: boolean;
  };
};

type SheetName = keyof SheetMessages;
const requiredSheets: SheetName[] = ["survey", "choices"];
const optionalSheets: SheetName[] = ["settings", "entities"];
const surveyColumns = [
  "type",
  "name",
  "required",
  "relevant",
  "appearance",
  "default",
  "constraint",
  "calculation",
  "trigger",
  "choice_filter",
  "parameters",
  "repeat_count",
  "note",
];
const choicesColumn = ["list_name", "name"];
const multiLingualChoiceColumn = ["label"];
const multiLingualSurveyColumn = [
  "label",
  "hint",
  "image",
  "audio",
  "video",
  "constraint_message",
  "required_message",
  "guidance_hint",
];
export function ValidateNonMultiLingualColumnNames(headers: string[], sheet: SheetName) {
  const errors: SheetMessages = {
    survey: [],
    choices: [],
    settings: [],
    entities: [],
  };

  const warnings: SheetMessages = {
    survey: [],
    choices: [],
    settings: [],
    entities: [],
  };

  if (!["survey", "choices"].includes(sheet)) {
    return { errors, warnings };
  }

  const headersFuse = new Fuse(headers, {
    includeScore: true,
    threshold: 0.4,
  });

  const nonMultiLingualColumns =
    sheet === "survey" ? surveyColumns : sheet === "choices" ? choicesColumn : [];

  const requiredNonMultiLingualColumns: Record<SheetName, string[]> = {
    survey: ["name", "type"],
    choices: ["list_name", "name"],
    settings: [],
    entities: [],
  };

  const requiredColumns = requiredNonMultiLingualColumns[sheet];

  const normalizedHeaders = headers.map((h) => h.trim().toLowerCase());

  for (const required of requiredColumns) {
    if (!normalizedHeaders.includes(required)) {
      errors[sheet].push(`Missing required column '${required}'.`);
    }
  }

  for (const expectedHeader of nonMultiLingualColumns) {
    const expectedNormalized = expectedHeader.toLowerCase();

    const matchingIndex = headers.findIndex((h) => h.trim().toLowerCase() === expectedNormalized);

    if (matchingIndex === -1) {
      const suggestion = headersFuse.search(expectedHeader);
      if (suggestion.length > 0) {
        errors[sheet].push(
          `Missing column '${expectedHeader}'. Found similar column '${suggestion[0].item}'.`
        );
      }
    } else {
      const original = headers[matchingIndex];

      if (original !== original.trim()) {
        warnings[sheet].push(
          `Column '${original}' has leading or trailing whitespace. Column names should be trimmed.`
        );
      }

      if (original.trim() !== expectedHeader) {
        warnings[sheet].push(
          `Column '${original}' found, but expected '${expectedHeader}'. Column names should be lowercase.`
        );
      }
    }
  }

  return {
    errors,
    warnings,
  };
}

export function ValidateMultilingualColumnNames(headers: string[], sheet: SheetName) {
  const errors: SheetMessages = {
    survey: [],
    choices: [],
    settings: [],
    entities: [],
  };

  const warnings: SheetMessages = {
    survey: [],
    choices: [],
    settings: [],
    entities: [],
  };

  if (!["survey", "choices"].includes(sheet)) {
    return { errors, warnings };
  }

  const multiLingualColumns =
    sheet === "survey"
      ? multiLingualSurveyColumn
      : sheet === "choices"
        ? multiLingualChoiceColumn
        : [];

  const headersFuse = new Fuse(headers, {
    includeScore: true,
    threshold: 0.4,
  });

  const prefixesFuse = new Fuse(multiLingualColumns, {
    includeScore: true,
    threshold: 0.4,
  });

  for (const header of headers) {
    if (header.includes("::")) {
      const parts = header.split("::");
      if (parts.length !== 2) {
        warnings[sheet].push(
          `Invalid format in "${header}". Expected format: prefix::Language (code)`
        );
        continue;
      }

      const [prefix, languagePart] = parts;

      if (prefix !== prefix.trim()) {
        warnings[sheet].push(
          `Prefix '${prefix}' in "${header}" has leading or trailing whitespace. Expected format: prefix::Language (code)`
        );
      }

      if (languagePart !== languagePart.trim()) {
        warnings[sheet].push(
          `Language part '${languagePart}' in "${header}" has leading or trailing whitespace. Expected format: prefix::Language (code)`
        );
      }

      const prefixTrimmed = prefix.trim().toLowerCase();
      const isValidPrefix = multiLingualColumns.some((col) => col.toLowerCase() === prefixTrimmed);

      if (!isValidPrefix) {
        const suggestion = prefixesFuse.search(prefix.trim());
        if (suggestion.length > 0) {
          errors[sheet].push(
            `Invalid multilingual prefix '${prefix.trim()}' in "${header}". Did you mean '${suggestion[0].item}'?`
          );
        } else {
          errors[sheet].push(
            `Invalid multilingual prefix '${prefix.trim()}' in "${header}". Valid prefixes are: ${multiLingualColumns.join(", ")}`
          );
        }
      }

      const languagePartTrimmed = languagePart.trim();

      if (!languagePartTrimmed.includes("(") || !languagePartTrimmed.includes(")")) {
        warnings[sheet].push(
          `Language code in "${header}" must be enclosed in parentheses. Expected format: "Language (code)"`
        );
        continue;
      }

      const openParenIndex = languagePartTrimmed.lastIndexOf("(");
      const closeParenIndex = languagePartTrimmed.lastIndexOf(")");

      if (
        openParenIndex === -1 ||
        closeParenIndex === -1 ||
        closeParenIndex !== languagePartTrimmed.length - 1
      ) {
        warnings[sheet].push(
          `Invalid parentheses in "${header}". Language code must be at the end in format: "Language (code)"`
        );
        continue;
      }

      const languageName = languagePartTrimmed.substring(0, openParenIndex).trim();
      const languageCode = languagePartTrimmed.substring(openParenIndex + 1, closeParenIndex);

      if (!languageName) {
        warnings[sheet].push(
          `Missing language name in "${header}". Expected format: "Language (code)"`
        );
        continue;
      }

      const codeRegex = /^[a-zA-Z]{2,3}$/;
      if (!codeRegex.test(languageCode)) {
        if (languageCode.length < 2) {
          warnings[sheet].push(
            `Language code "${languageCode}" in "${header}" is too short. Code must be 2-3 letters.`
          );
        } else if (languageCode.length > 3) {
          warnings[sheet].push(
            `Language code "${languageCode}" in "${header}" is too long. Code must be 2-3 letters.`
          );
        } else {
          warnings[sheet].push(
            `Language code "${languageCode}" in "${header}" contains invalid characters. Code must contain only letters.`
          );
        }
        continue;
      }

      const spaceBeforeParen = languagePartTrimmed.substring(languageName.length, openParenIndex);
      if (spaceBeforeParen !== " ") {
        if (spaceBeforeParen.length === 0) {
          warnings[sheet].push(
            `Missing space before parentheses in "${header}". Expected single space before language code.`
          );
        } else if (spaceBeforeParen.length > 1) {
          warnings[sheet].push(
            `Extra whitespace before parentheses in "${header}". Expected single space before language code.`
          );
        } else {
          warnings[sheet].push(
            `Invalid character before parentheses in "${header}". Expected single space before language code.`
          );
        }
      }

      if (languageName !== languageName.trim()) {
        if (languageName !== languageName.trimStart()) {
          warnings[sheet].push(
            `Language name has leading whitespace in "${header}". Expected format: prefix::Language (code)`
          );
        }
        if (languageName !== languageName.trimEnd()) {
          warnings[sheet].push(
            `Language name has trailing whitespace in "${header}". Expected format: prefix::Language (code)`
          );
        }
      }
    }
  }

  for (const expectedHeader of multiLingualColumns) {
    const expectedNormalized = expectedHeader.toLowerCase();

    const nonMultilingualIndex = headers.findIndex(
      (h) => h.trim().toLowerCase() === expectedNormalized
    );
    const hasNonMultilingual = nonMultilingualIndex !== -1;
    const multilingualVersions = headers.filter((h) => {
      if (h.includes("::")) {
        const [prefix] = h.split("::");
        return prefix.trim().toLowerCase() === expectedNormalized;
      }
      return false;
    });
    const hasMultilingual = multilingualVersions.length > 0;

    if (hasNonMultilingual && hasMultilingual) {
      warnings[sheet].push(
        `Mixed multilingual usage for '${expectedHeader}'. Found both non-multilingual '${headers[nonMultilingualIndex]}' and multilingual versions: ${multilingualVersions.join(", ")}. Use either one non-multilingual column OR multiple multilingual columns, not both.`
      );
    }

    if (!hasNonMultilingual && !hasMultilingual) {
      const suggestion = headersFuse.search(expectedHeader);
      if (suggestion.length > 0) {
        errors[sheet].push(
          `Missing column '${expectedHeader}'. Found similar column '${suggestion[0].item}'.`
        );
      }
    }

    if (hasNonMultilingual) {
      const original = headers[nonMultilingualIndex];

      if (original !== original.trim()) {
        warnings[sheet].push(
          `Column '${original}' has leading or trailing whitespace. Column names should be trimmed.`
        );
      }

      if (original.trim() !== expectedHeader) {
        warnings[sheet].push(
          `Column '${original}' found, but expected '${expectedHeader}'. Column names should be lowercase.`
        );
      }
    }
  }

  const hasMultilingualHeaders = headers.some((h) => h.includes("::"));
  const hasNonMultilingualVersions = multiLingualColumns.some((col) =>
    headers.some((h) => h.trim().toLowerCase() === col.toLowerCase())
  );

  if (!hasMultilingualHeaders && !hasNonMultilingualVersions) {
    warnings[sheet].push(
      `No multilingual columns found. Consider adding columns like: ${multiLingualColumns.map((col) => `${col}::English (en)`).join(", ")}`
    );
  }

  return {
    errors,
    warnings,
  };
}

export function ValidateSheetnames(sheets: Excel.WorksheetCollection): ValidationResult {
  const sheetNames = sheets.items.map((sheet) => sheet.name);

  const errors: SheetMessages = {
    survey: [],
    choices: [],
    settings: [],
    entities: [],
  };
  const warnings: SheetMessages = {
    survey: [],
    choices: [],
    settings: [],
    entities: [],
  };

  const sheetNameFuse = new Fuse(sheetNames, {
    includeScore: true,
    threshold: 0.4,
  });

  for (const required of requiredSheets) {
    if (!sheetNames.includes(required)) {
      const suggestion = sheetNameFuse.search(required);
      if (suggestion.length > 0) {
        errors[required].push(
          `Required sheet '${required}' is missing. Found similar sheet '${suggestion[0].item}'.`
        );
      } else {
        errors[required].push(`Required sheet '${required}' is missing.`);
      }
    }
  }

  for (const optional of optionalSheets) {
    if (!sheetNames.includes(optional)) {
      const suggestion = sheetNameFuse.search(optional);
      if (suggestion.length > 0) {
        warnings[optional].push(
          `Optional sheet '${optional}' is missing. Found similar sheet '${suggestion[0].item}'.`
        );
      } else {
        warnings[optional].push(`Optional sheet '${optional}' is missing.`);
      }
    }
  }

  return {
    errors,
    warnings,
  };
}

export function XLSFormValidation() {
  return Excel.run(async (context) => {
    let errors: SheetMessages = {
      survey: [],
      choices: [],
      settings: [],
      entities: [],
    };
    let warnings: SheetMessages = {
      survey: [],
      choices: [],
      settings: [],
      entities: [],
    };

    const sheets = context.workbook.worksheets;
    sheets.load("items/name");
    await context.sync();

    const sheetNameVal = ValidateSheetnames(sheets);
    mergeMessages(errors, warnings, sheetNameVal);

    const sheetNames = sheets.items.map((sheet) => sheet.name);
    const hasSurvey = sheetNames.includes("survey");
    const hasChoices = sheetNames.includes("choices");

    if (hasSurvey) {
      const surveySheet = sheets.getItem("survey");
      const usedRange = surveySheet.getUsedRange();
      usedRange.load("values");
      await context.sync();
      const headerRow = usedRange.values?.[0] ?? [];

      const nonMultiLingualVal = ValidateNonMultiLingualColumnNames(headerRow, "survey");
      const multiLingualVal = ValidateMultilingualColumnNames(headerRow, "survey");

      mergeMessages(errors, warnings, nonMultiLingualVal);
      mergeMessages(errors, warnings, multiLingualVal);
    }

    if (hasChoices) {
      const choicesSheet = sheets.getItem("choices");
      const usedRange = choicesSheet.getUsedRange();
      usedRange.load("values");
      await context.sync();
      const headerRow = usedRange.values?.[0] ?? [];

      const nonMultiLingualVal = ValidateNonMultiLingualColumnNames(headerRow, "choices");
      const multiLingualVal = ValidateMultilingualColumnNames(headerRow, "choices");

      mergeMessages(errors, warnings, nonMultiLingualVal);
      mergeMessages(errors, warnings, multiLingualVal);
    }

    return { errors, warnings };
  });
}

function mergeMessages(
  errors: SheetMessages,
  warnings: SheetMessages,
  result: { errors: SheetMessages; warnings: SheetMessages }
) {
  for (const key of Object.keys(result.errors) as (keyof SheetMessages)[]) {
    errors[key].push(...result.errors[key]);
  }
  for (const key of Object.keys(result.warnings) as (keyof SheetMessages)[]) {
    warnings[key].push(...result.warnings[key]);
  }
}
