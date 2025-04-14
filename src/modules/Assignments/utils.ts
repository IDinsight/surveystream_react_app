import _ from "lodash";
import { IColumnItem, IConfigItem } from "./types";

function toPath(path: string): (string | number)[] {
  return _.toPath(path).map((segment) => {
    if (!isNaN(parseInt(segment))) {
      return parseInt(segment);
    }
    return segment;
  });
}

export const defaultSorter = (keys: any) => {
  return (a: any, b: any) => {
    const aValue = _.get(a, keys, null);
    const bValue = _.get(b, keys, null);

    // if the value is number
    if (!isNaN(aValue) && !isNaN(bValue)) {
      if (parseInt(aValue) < parseInt(bValue)) return -1;
      if (parseInt(bValue) < parseInt(aValue)) return 1;
    } else {
      if (aValue < bValue) return -1;
      if (bValue < aValue) return 1;
    }
    return 0;
  };
};

export const getFilterValues = (data: any, keys: Array<string | number>) => {
  // Retrieve the values from the data object using the list of keys
  const values = data?.map((item: any) => _.get(item, keys));

  // Deduplicate the values to get a unique list and format it for the Ant table filter
  const uniqueValues = values.filter(
    (val: any, i: any, arr: any) => arr.indexOf(val) === i
  );
  const uniqueFilterValues = uniqueValues
    .map((item: any) => ({ text: item, value: item }))
    .filter((item: any) => item.value !== null);

  return uniqueFilterValues;
};

export const getNestedObjectValue = (
  obj: any,
  keys: Array<number | string>
) => {
  let item = obj;
  for (const i in keys) {
    item = item?.[keys[i]] || null;
    if (item === null) return null;
  }
  return item;
};

export const getDataFromFilters = (
  filters: any,
  arr: any,
  key_reference: any
) => {
  let filterArr: any = [];
  for (const k in filters) {
    if (filters[k] !== null) {
      /*
        If we have multiple constraints of a same filter then Instead of using previuos filterArr,
        Use orignial param array for filtering and push new items into tempArr array.
        Ex: If key_reference (locations[0][location_name]) is [ "Uttar Pradesh", "Odisha" ]
        then we need to concat the results of Uttar Pradesh and Odisha.
      */
      const tempArr: any = [];
      filters[k].forEach((val: any) => {
        tempArr.push(
          ...arr.filter(
            (obj: any) => getNestedObjectValue(obj, key_reference[k]) === val
          )
        );
      });

      /*
        If filterArr has length then It means we already appiled some filters
        So we should use the filterArr as source for .filter() method.
      */
      if (filterArr.length > 1) {
        filterArr = [...filterArr].filter((obj: any) => tempArr.includes(obj));
      } else {
        filterArr = [...tempArr];
      }
    }
  }
  return filterArr;
};

export const performSearch = (
  arr: any,
  searchTerm: string,
  key_reference: any
) => {
  const searchKeys: string[] = Object.keys(key_reference);
  return arr?.filter((obj: any) => {
    for (let i = 0; i < searchKeys.length; i++) {
      const val = getNestedObjectValue(obj, key_reference[searchKeys[i]]);
      if (val) {
        const columnValue = val.toString().toLowerCase();
        if (columnValue && columnValue.indexOf(searchTerm.toLowerCase()) > -1)
          return true;
      }
    }
    return false;
  });
};

export const formatCsvHeaders = (columns: any) => {
  const headers: any = [];

  // Build the CSV header row
  columns.forEach((column: any) => {
    if ("children" in column) {
      column.children.forEach((childColumn: any) => {
        headers.push({
          label: column.title + ": " + childColumn.title,
          key: childColumn.key,
        });
      });
    } else {
      headers.push({ label: column.title, key: column.key });
    }
  });
  return headers;
};

export const formatCsvData = (data: any, columns: any, keyRefs: any) => {
  const getCellValue = (row: any, column: any) => {
    if (!Object.prototype.hasOwnProperty.call(keyRefs, column.key)) return "";
    const cellValue = getNestedObjectValue(row, keyRefs[column.key]);
    if (cellValue instanceof Array) return cellValue.join(", ");
    return cellValue;
  };

  const formattedData: any = [];

  // Build the formatted data object
  data.forEach((row: any) => {
    const formattedRow: any = {};
    columns.forEach((column: any) => {
      if ("children" in column) {
        column.children.forEach((childColumn: any) => {
          formattedRow[childColumn.key] = getCellValue(row, childColumn);
        });
      } else {
        formattedRow[column.key] = getCellValue(row, column);
      }
    });
    formattedData.push(formattedRow);
  });
  return formattedData;
};

export const buildColumnDefinition = (
  columnItem: IColumnItem,
  dataSource: any,
  dataFilter: any,
  specialAttribute?: any
) => {
  const colKey = columnItem.column_key;

  // This is the base column definition for non-special columns
  let columnDefinition: any = {
    title: columnItem.column_label,
    dataIndex: colKey,
    key: colKey,
    sorter: defaultSorter([colKey]),
    filters: getFilterValues(dataSource, [colKey]),
    filteredValue: dataFilter?.[colKey] || null,
    onFilter: (val: string, record: any) => record[colKey] === val,
    filterSearch: true,
  };

  const keyArray = toPath(colKey);
  if (keyArray.length > 1) {
    if (keyArray[0] === "supervisors") {
      columnDefinition = {
        ...columnDefinition,
        dataIndex: "supervisors",
        filters: getFilterValues(dataSource, keyArray),
        onFilter: (value: string | number, record: any) =>
          _.get(record, keyArray) === value,
        render: (val: any, record: any) => {
          const supervisorName = _.get(record, [
            ...keyArray.slice(0, 2),
            "supervisor_name",
          ]);

          const supervisorEmail = _.get(record, [
            ...keyArray.slice(0, 2),
            "supervisor_email",
          ]);

          if (!supervisorName && !supervisorEmail) {
            if (colKey.includes("supervisor_name")) {
              return {
                children: "*",
                props: {
                  style: { backgroundColor: "#fff1f0", color: "red" },
                  colSpan: 2,
                },
              };
            } else if (colKey.includes("supervisor_email")) {
              return {
                children: null,
                props: {
                  colSpan: 0,
                },
              };
            }
          }

          return colKey.includes("supervisor_name")
            ? supervisorName
            : supervisorEmail;
        },
        sorter: defaultSorter(keyArray),
      };
    }

    if (
      keyArray[0] === "target_locations" ||
      keyArray[0] === "surveyor_locations" ||
      keyArray[0] === "form_productivity"
    ) {
      columnDefinition = {
        ...columnDefinition,
        dataIndex: keyArray[0],
        filters: getFilterValues(dataSource, keyArray),
        onFilter: (value: string | number, record: any) =>
          _.get(record, keyArray) === value,
        render: (val: string, record: any) => _.get(record, keyArray) || null,
        sorter: defaultSorter(keyArray),
      };
    }

    if (keyArray[0] === "custom_fields") {
      columnDefinition = {
        ...columnDefinition,
        dataIndex: keyArray,
        filters: getFilterValues(dataSource, keyArray),
        onFilter: (value: string | number, record: any) =>
          _.get(record, keyArray) === value,
        sorter: defaultSorter(keyArray),
      };
    }
  }

  return {
    ...columnDefinition,
    ...(specialAttribute?.[colKey] || null),
  };
};

export const makeKeyRefs = (config: any) => {
  if (!config) {
    return {};
  }
  const keyRefs: any = {};
  config.forEach((item: IConfigItem) => {
    if (item.group_label) {
      item.columns.forEach((column: IColumnItem) => {
        const colKey = column.column_key;
        const keyArray = toPath(colKey);

        keyRefs[colKey] = keyArray.length > 1 ? [...keyArray] : [colKey];
      });
    } else {
      const colKey = item.columns[0].column_key;
      const keyArray = toPath(colKey);

      keyRefs[colKey] = keyArray.length > 1 ? [...keyArray] : [colKey];
    }
  });
  return keyRefs;
};
