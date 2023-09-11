import CSVFileValidator, {
  FieldSchema,
  ValidatorConfig,
} from "csv-file-validator";
import { message } from "antd";

interface ErrorSummary {
  type: string;
  count: number;
  message: string[];
}

interface ValidationResult {
  isValid: boolean;
  inValidData: string[];
}

const csvValidationRules: FieldSchema[] = [];

export const isEmailValid = (email: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};

export const validateHeaders = (headers: string[]): string[] => {
  const errors: string[] = [];

  // Assuming headers should not be empty
  if (headers.length === 0 || headers.some((header) => header.trim() === "")) {
    errors.push("Headers are missing or empty.");
  }

  return errors;
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read the file."));
      }
    };
    reader.readAsText(file);
  });
};
export const findDuplicateColumns = (headers: string[]): string[] => {
  const duplicateColumns: string[] = [];
  const seenColumns: Set<string> = new Set();

  for (const header of headers) {
    const trimmedHeader = header.trim(); // Remove leading/trailing whitespace
    if (seenColumns.has(trimmedHeader)) {
      duplicateColumns.push(trimmedHeader);
    } else {
      seenColumns.add(trimmedHeader);
    }
  }

  return duplicateColumns;
};

export const countEmptyRows = (lines: string[]): number => {
  return lines.slice(1).filter((line) => line.trim() === "").length;
};

export const displayValidationErrors = (errors: string[]): ValidationResult => {
  return { isValid: false, inValidData: errors };
};

export const classifyErrorsForColumns = (
  errorList: string[],
  rules: FieldSchema[]
): ErrorSummary[] => {
  const errorSummaryMap: { [key: string]: ErrorSummary } = {};

  for (const error of errorList) {
    if (error.includes("Duplicate columns")) {
      const errorType = "Duplicate Columns";
      const errorMessage = error;
      if (!errorSummaryMap[errorType]) {
        errorSummaryMap[errorType] = {
          type: errorType,
          count: 1,
          message: [errorMessage],
        };
      } else {
        errorSummaryMap[errorType].count++;
        errorSummaryMap[errorType].message.push(errorMessage);
      }
      continue;
    }

    const errorType = "Validation Errors";
    const errorMessage: string = error;

    if (!errorSummaryMap[errorType]) {
      errorSummaryMap[errorType] = {
        type: errorType,
        count: 1,
        message: [errorMessage],
      };
    } else {
      errorSummaryMap[errorType].count++;
      errorSummaryMap[errorType].message.push(errorMessage);
    }
  }

  return Object.values(errorSummaryMap);
};

export const validateCSVData = async (file: File) => {
  console.log("file", file);
  const text = await readFileAsText(file);
  const lines = text.split("\n");
  const headers = lines[0].split(",");
  const emptyRows: number[] = [];
  const emptyColumns: string[] = [];

  const headerResults = validateHeaders(headers);
  if (headerResults.length > 0) {
    return displayValidationErrors(headerResults);
  }

  const duplicateColumns = findDuplicateColumns(headers);

  console.log("duplicateColumns", duplicateColumns);

  if (duplicateColumns.length > 0) {
    return displayValidationErrors([
      `Duplicate columns found: ${duplicateColumns.join(", ")}`,
    ]);
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") {
      emptyRows.push(i + 1); // Adding 1 to convert to 1-based index
    } else {
      const columns = line.split(",");
      for (let j = 0; j < columns.length; j++) {
        const column = columns[j];
        if (column.trim() === "") {
          emptyColumns.push(headers[j]);
        }
      }
    }
  }

  // Implement this to cover all fields
  const validationConfig: ValidatorConfig = {
    headers: csvValidationRules,
    isHeaderNameOptional: false,
    isColumnIndexAlphabetic: true,
  };

  try {
    const validationResults = await CSVFileValidator(file, validationConfig);
    if (emptyRows.length > 0 || emptyColumns.length > 0) {
      const validationErrors: string[] = [];

      if (emptyRows.length > 0) {
        validationErrors.push(
          `Empty rows found at row(s): ${emptyRows.join(", ")}`
        );
      }

      if (emptyColumns.length > 0) {
        validationErrors.push(
          `Empty columns found in column(s): ${emptyColumns.join(", ")}`
        );
      }

      return displayValidationErrors(validationErrors);
    }

    return validationResults;
  } catch (error: any) {
    message.error("Validation went wrong");
  }
};
