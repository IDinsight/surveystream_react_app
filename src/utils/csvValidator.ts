import CSVFileValidator, {
  FieldSchema,
  ValidatorConfig,
} from "csv-file-validator";
import { message } from "antd";
import Papa, { ParseResult } from "papaparse";

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

export const checkCSVRows = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const maxRows = process.env.REACT_APP_MAX_UPLOAD_ROWS
      ? parseInt(process.env.REACT_APP_MAX_UPLOAD_ROWS)
      : 2000;

    reader.onload = () => {
      const csvData = reader.result as string;
      const rows = Papa.parse(csvData, { skipEmptyLines: true }).data;
      if (rows.length > maxRows) {
        const error = `CSV file should have a maximum of ${maxRows} rows; found ${rows.length}`;
        message.error(error);
        resolve({ status: false, rows: rows.length, error: error });
      } else {
        resolve({ status: true, rows: rows.length });
      }
    };

    reader.onerror = () => {
      reject(new Error("An error occurred while reading the CSV file."));
    };

    reader.readAsText(file);
  });
};

export const basicCSVValidations = async (file: File) => {
  const reader = new FileReader();
  // Validate file type
  const allowedFileTypes = ["text/csv"];
  const fileType = file.type;
  if (!allowedFileTypes.includes(fileType)) {
    message.error("Only CSV files are allowed.");
    return displayValidationErrors([
      `Only CSV files are allowed; found ${fileType}`,
    ]);
  }
  // Validate file size (number of rows)

  const maxRowsCheck: any = await checkCSVRows(file);
  if (!maxRowsCheck.status) {
    return displayValidationErrors([maxRowsCheck.error]);
  }
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
  const text = await readFileAsText(file);
  const parsedCsv: ParseResult<string[]> = Papa.parse(text, {
    skipEmptyLines: true,
  });
  const headers = parsedCsv?.data[0];
  const emptyRows: number[] = [];
  const emptyColumns: string[] = [];

  const headerResults = validateHeaders(headers);
  if (headerResults.length > 0) {
    return displayValidationErrors(headerResults);
  }

  const duplicateColumns = findDuplicateColumns(headers);

  if (duplicateColumns.length > 0) {
    return displayValidationErrors([
      `Duplicate columns found: ${duplicateColumns.join(", ")}`,
    ]);
  }

  for (let i = 1; i < parsedCsv.data.length; i++) {
    const line = parsedCsv.data[i];
    const isEmptyRow = line.every((cell: string) => cell.trim() === "");
    if (isEmptyRow) {
      emptyRows.push(i + 1); // Adding 1 to convert to 1-based index
    } else {
      for (let j = 0; j < line.length; j++) {
        const column = line[j];
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
    if (emptyRows.length > 0 || emptyColumns.length > 0) {
      const validationErrors: string[] = [];

      if (emptyRows.length > 0) {
        validationErrors.push(
          `Empty fields found at row(s): ${emptyRows.join(", ")}`
        );
      }

      if (emptyColumns.length > 0) {
        validationErrors.push(
          `Empty fields found in column(s): ${emptyColumns.join(", ")}`
        );
      }

      return displayValidationErrors(validationErrors);
    }

    const validationResults = await CSVFileValidator(file, validationConfig);

    return validationResults;
  } catch (error: any) {
    message.error("Validation went wrong");
  }
};
