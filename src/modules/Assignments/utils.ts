import _ from "lodash";

export interface IColumnItem {
  column_key: string;
  column_label: string;
}

export interface IConfigItem {
  columns: IColumnItem[];
  group_label: string;
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

export const buildColumnDefinition = (
  columnItem: IColumnItem,
  dataSource: any,
  dataFilter: any,
  specialAttribute?: any
) => {
  const colKey = columnItem.column_key;

  // This is the base column definition for non-special columns
  let columnDefinition = {
    title: columnItem.column_label,
    dataIndex: colKey,
    key: colKey,
    sorter: defaultSorter([colKey]),
    filters: getFilterValues(dataSource, [colKey]),
    filteredValue: dataFilter?.[colKey] || null,
    onFilter: (val: string, record: any) => record[colKey] === val,
    filterSearch: true,
  };

  const keyArray = _.toPath(colKey);
  if (keyArray.length > 1) {
    if (
      keyArray[0] === "target_locations" ||
      keyArray[0] === "form_productivity"
    ) {
      columnDefinition = {
        ...columnDefinition,
        ...{
          dataIndex: keyArray[0],
          filters: getFilterValues(dataSource, keyArray),
          onFilter: (value, record) => _.get(record, colKey) === value,
          render: (val: string, record: any) => {
            return _.get(record, colKey) || null;
          },
          sorter: defaultSorter(keyArray),
        },
      };
    }

    if (keyArray[0] === "custom_fields") {
      columnDefinition = {
        ...columnDefinition,
        ...{
          dataIndex: keyArray[0],
          filters: getFilterValues(dataSource, keyArray),
          onFilter: (value, record) => _.get(record, colKey) === value,
          sorter: defaultSorter(keyArray),
        },
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
        keyRefs[column.column_key] = [column.column_key];
      });
    } else {
      keyRefs[item.columns[0].column_key] = [item.columns[0].column_key];
    }
  });
  return keyRefs;
};
