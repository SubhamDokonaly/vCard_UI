/** Check Duplicates in an array and return an array with no duplicates */
const checkDuplicates = (array) => {
  if (typeof array !== "object") {
    return "Should be an Array or Object";
  }
  const removeDuplicates = [
    ...new Set(array.map((e) => JSON.stringify(e))),
  ].map((e) => JSON.parse(e));
  return removeDuplicates;
};

/** Remove Duplicates from the Array of Object */
function removeDuplicateFromArrOfObj(data, keyName) {
  const uniquePhCodes = new Set();
  const uniquePhoneNumbers = data.filter((phoneNumber) => {
    if (!uniquePhCodes.has(phoneNumber[keyName])) {
      uniquePhCodes.add(phoneNumber[keyName]);
      return true;
    }
    return false;
  });

  return uniquePhoneNumbers;
}

/** Opens file in a New Window */
const openFileNewWindow = async (fileData) => {
  if (typeof fileData !== "string") {
    throw new Error("Uploaded File is Not a String");
  }
  const responseData = await fetch(fileData);
  const blobData = await responseData.blob();
  const blobUrl = URL.createObjectURL(blobData);
  const userAgent = window.navigator.userAgent;

  if (userAgent.includes("Windows")) {
    const win = window.open();
    win.document.write(
      '<iframe src="' +
        blobUrl +
        '" frameborder="0" style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;" allowfullscreen></iframe>'
    );
  } else {
    window.open(blobUrl, "width=100%,height=100%,top=0,left=0,fullscreen=yes");
  }
};

/** Checks whether a value exists in a array objects and return the object */
const keyMatchLoop = (key, data, value) => {
  if (Array.isArray(data) === false && data != null) {
    throw new Error("Data should be an array");
  } else if (typeof key !== "string" || key?.trim()?.length === 0) {
    throw new Error("Key should be a string type and cannot be empty");
  } else if (typeof value !== "string") {
    throw new Error("Value should be a string");
  } else {
    for (let i = 0; i < data?.length; i++) {
      if (data[i][key] === value) {
        return data[i];
      }
    }
    return "";
  }
};

/**
 * Function for reading files and returning them as base64 string
 * @param {Object} fileReaderObject - Object parameters for fileReader
 * @param {Object} fileReaderObject.errorMessage - Object paramters for error messages
 * @param {String} fileReaderObject.errorMessage.NoFileError - Error Message for no File
 * @param {String} fileReaderObject.errorMessage.fileTypeErr - Error Message for file Type mismatch
 * @param {String} fileReaderObject.errorMessage.fileSizeErr - Error Message if file size exceeds than the provided one
 * @param {Object} fileReaderObject.fileEvent - File Event from input event callback
 * @param {String} fileReaderObject.fileType - Type of File that should be accepted.
 * @param {Number} fileReaderObject.fileSize - Maximum file Size in bytes.
 * @param {String} [fileReaderObject.fileRead = "readAsArrayBuffer"] - Type of File Reader we can use. Default is readAsArrayBuffer
 * @param {String} [fileReaderObject.noLimit = false] - Limit on filesize, if true will not consider fileSize. Default is false
 * @returns {Promise} Promise object which File Object with name, data, size and type. If multiple files uploaded array of file Objects will be returned.
 * @example
 * fileReaderFunction({
 * 	fileEvent:event,
 * 	fileType:"pdf",
 * 	fileSize:100000,
 * 	errorMessage:{
        * NoFileError:"Please Upload File"
        fileTypeErr:"PDF only"
        fileSizeErr:"Size Exceeds more than 10 MB"}
    })
 */

const fileReaderFunction = async ({
  fileEvent,
  fileType,
  fileSize,
  errorMessage,
  fileRead = "readAsArrayBuffer",
  noLimit = false,
}) => {
  let fileDataArray;
  const file = fileEvent.target.files;
  const fileLength = fileEvent.target.files.length;
  if (!fileType || (!fileSize && noLimit === false) || !errorMessage) {
    throw new Error("Some arguments are missing");
  } else if (typeof fileType !== "string") {
    throw new Error("fileType should be a String");
  } else if (typeof fileSize !== "number" && noLimit === false) {
    throw new Error("fileSize should be a Number");
  } else if (typeof errorMessage !== "object") {
    throw new Error("errorMessage should be an Object");
  } else if (
    !errorMessage.NoFileError ||
    !errorMessage.fileTypeErr ||
    !errorMessage.fileSizeErr
  ) {
    throw new Error("Some Keys of errorMessage Object is missing");
  } else if (!file) {
    throw new Error(errorMessage.NoFileError);
  }

  function readFile(file) {
    const fileObject = {};
    const reader = new FileReader();
    if (!file.type.includes(fileType)) {
      throw new Error(errorMessage.fileTypeErr);
    } else if (file.size > fileSize && noLimit === false) {
      throw new Error(errorMessage.fileSizeErr);
    }
    const promiseFileFunction = new Promise((_resolve) => {
      reader.onload = (event) => {
        fileObject.fileData = event.target.result;
        fileObject.fileName = file.name;
        fileObject.fileSize = file.size;
        fileObject.fileType = file.type;
        _resolve(fileObject);
      };
      reader[fileRead](file);
    });
    return promiseFileFunction;
  }

  // eslint-disable-next-line no-useless-catch
  try {
    fileDataArray = Array.from(file).map((singleFile) =>
      readFile(singleFile, fileRead)
    );
  } catch (error) {
    throw error;
  }

  const returnData = await Promise.all(fileDataArray);

  if (fileLength === 1) {
    return returnData[0];
  } else {
    let size = returnData
      .map((file) => file.fileSize)
      .reduce((prev, curr) => prev + curr, 0);
    if (size > fileSize && noLimit === false) {
      throw new Error(errorMessage.fileSizeErr);
    }
    return returnData;
  }
};

/**
 * Function for fetching Data
 * @param {Object} fetchObject - Object paramters for fetch function
 * @param {String} fetchObject.url - URL for fetching data
 * @param {String} [fetchObject.method = 'GET'] - Method for fetching data. Default is GET
 * @param {Object} [fetchObject.headers = {}] - Headers configuration for fetching data.
 * @param {Object} [fetchObject.isAuthRequired = false] - Require Auth Token or not. Default is false
 * @param {Object} [fetchObject.returnFullPayload = false] - Return Full Payload or not. Default is false
 * @param {Object} [fetchObject.parseJson = true] - Return Full Payload or not. Default is false
 * @param {Object} data - Data that can be used for POST call. Method should be POST if data is provided
 * @returns {Promise} Promise object which contains result of boolean type and data which can be error or result data of API.
 * @example
 * //For GET
 * fetchData({url:sampleUrl.com})
 * //For Others
 * fetchData({url:sampleUrl.com,method:'POST',headers:{AUTH:AUTH}},[data:{}])
 */
const fetchData = async (
  {
    url,
    method = "GET",
    headers = {},
    isAuthRequired = false,
    returnFullPayload = false,
    parseJson = true,
  } = {},
  data
) => {
  if (typeof url !== "string") {
    throw new Error("URL is not in string");
  }
  if (typeof isAuthRequired !== "boolean") {
    throw new Error("isAuth is not a boolean");
  }
  headers["Content-Type"] = "application/json";
  if (isAuthRequired === true) {
    headers.Authorization = `Bearer ${localStorage.getItem("allMasterToken")}`;
  }
  const fetchObject = {
    method,
    headers,
  };
  if (method === "POST") {
    if (data === null || data === undefined) {
      throw new Error("Data is not given for a post call");
    } else {
      fetchObject.body = JSON.stringify(data);
    }
  }
  try {
    const response = await fetch(url, fetchObject);
    const status = response.status;
    if (status === 200) {
      const responseData = await response.json();
      if (responseData.status === 1) {
        if (returnFullPayload) {
          return responseData;
        } else {
          if (parseJson) {
            return Object.prototype.hasOwnProperty.call(responseData, "data")
              ? JSON.parse(responseData.data)
              : responseData.response;
          } else {
            return Object.prototype.hasOwnProperty.call(responseData, "data")
              ? responseData.data
              : responseData.response;
          }
        }
      } else {
        throw new Error(responseData.response);
      }
    }
    if (status === 401) {
      window.location.replace("/login");
      localStorage.clear();
      throw new Error("Unauthorized Access");
    } else {
      throw new Error("Requests limit exceeds. Wait for few seconds");
    }
  } catch (error) {
    throw new Error(error);
  }
};

/** Trims the unwanted space from string */
const trimString = (string) => {
  if (typeof string !== "string") {
    return "DataType should be a string";
  }
  return string.trim();
};

/** Combines all arrays and nested arrays into a single array */
const combineArray = (...args) => {
  const array = [...args];
  if (array.length <= 1) {
    return "Send more than an array";
  }
  return [...args].flat();
};

/**
 * Removes all the spaces in string
 * @param {string} string String to remove all the spaces
 * @returns {string} String
 */
const removeSpacesInString = (string) => {
  if (typeof string !== "string") {
    return "Given parameter is not a string";
  }
  return string.replace(/\s/g, "");
};

/** Remove space and return them in lowercase */
const convertLowerRemoveSpacesInString = (string) => {
  if (typeof string !== "string") {
    return "Given parameter is not a string";
  }
  return string.toLocaleLowerCase().replace(/\s/g, "");
};

const inputLengthRestriction = (event, length) => {
  const maxLength = length;
  const value = event.target.value;
  if (value.length > maxLength) {
    event.target.value = value.slice(0, maxLength);
  }
};

/** Returns a string with first letter as Uppercase */
const convertFirstLettersAsUpperCase = (value) => {
  if (typeof value !== "string") {
    throw new Error("Value is not a string type");
  }
  return value
    .split(" ")
    .map((string) =>
      string
        .substring(0, 1)
        .toUpperCase()
        .concat(string.substring(1, string.length))
    )
    .join(" ");
};

const removeDuplicates = (array, key) => {
  return array.reduce((arr, item) => {
    const filtered = arr.filter((value) => value[key] !== item[key]);
    return [...filtered, item];
  }, []);
};

/**
 * Function to convert other metrics to cm
 * @param {Number} value Number that needs to converted to cm
 * @param {String} metric Metric unit
 * @returns {Number}
 */
function convertIntoCm(value, metric) {
  switch (metric) {
    case "M":
      return formatNumber(value * 100);
    case "IN":
      return formatNumber(value * 2.54);
    case "CM":
      return formatNumber(value);
    case "MM":
      return formatNumber(value / 10);
    default:
      return 0;
  }
}

/**
 * Function to convert cm to other metrics
 * @param {Number} value Number that needs to converted to desired metric
 * @param {String} metric Metric unit
 * @returns {Number}
 */
function convertFromCm(value, metric) {
  switch (metric) {
    case "M":
      return formatNumber(value / 100);
    case "IN":
      return formatNumber(value / 2.54);
    case "CM":
      return formatNumber(value);
    case "MM":
      return formatNumber(value * 10);
    default:
      return 0;
  }
}

/**
 * Function to round to decimals
 * @param {number} number
 * @returns {number} Number with fixed decimals
 */
const roundToDecimal = (number) => {
  if (Number.isInteger(number)) {
    return number === 0 ? "" : number;
  } else {
    return number.toFixed(1);
  }
};

function formatNumber(input) {
  const numericValue = parseFloat(input);
  if (!isNaN(numericValue)) {
    if (Number.isInteger(numericValue)) {
      return numericValue;
    } else {
      return numericValue.toFixed(1);
    }
  }
}

/**
 * Function to calculate volume based on package type
 * @param {Object} cargoDetails
 * @returns {Number} Volume based on package type
 */
function calculateVolumePerCargo(cargoDetails) {
  try {
    const {
      packageType,
      length,
      breadth,
      noOfPackage,
      height,
      radius,
      metric,
    } = cargoDetails;
    if (packageType === "barrels" || packageType === "rolls") {
      const cmRadius = convertIntoCm(Number(radius), metric);

      return (
        (parseFloat(3.14) *
          cmRadius *
          cmRadius *
          convertIntoCm(Number(height), metric) *
          Number(noOfPackage)) /
        1000000
      );
    } else {
      return (
        (convertIntoCm(Number(length), metric) *
          convertIntoCm(Number(breadth), metric) *
          convertIntoCm(Number(height), metric) *
          Number(noOfPackage)) /
        1000000
      );
    }
  } catch (error) {
    return false;
  }
}

const finalVolume = (volume) => {
  if (volume === 0) {
    return 0;
  } else if (volume >= 1) {
    if (Number.isInteger(volume)) {
      return Number(volume);
    }
    return Number(volume).toFixed(1);
  }

  return 1;
};

function findGreaterNumber(charge, weightToCbm) {
  if (charge > weightToCbm) {
    return charge.toString();
  }

  return weightToCbm.toString();
}

/**
 * Function to calculate gross weight from cargoDetails
 * @param {Object} cargoDetails
 * @returns {Number} Gross weight from cargoDetails
 */
function calculateGrossWeightPerCargo(cargoDetails) {
  try {
    const { noOfPackage, weightPerPackage } = cargoDetails;
    return noOfPackage * weightPerPackage;
  } catch (error) {
    return false;
  }
}

/**
 * Function to get Number suffixed with oridinal
 * @param {*} number
 * @returns {String} Number with oridinal Suffixed
 */
function getOrdinal(number) {
  const ord = ["st", "nd", "rd"];
  const exceptions = [11, 12, 13];
  const nth =
    ord[(number % 10) - 1] == null || exceptions.includes(number % 100)
      ? "th"
      : ord[(number % 10) - 1];
  return number + nth;
}

export {
  checkDuplicates,
  removeDuplicateFromArrOfObj,
  removeSpacesInString,
  openFileNewWindow,
  keyMatchLoop,
  fileReaderFunction,
  fetchData,
  trimString,
  convertFirstLettersAsUpperCase,
  combineArray,
  convertLowerRemoveSpacesInString,
  inputLengthRestriction,
  removeDuplicates,
  convertIntoCm,
  roundToDecimal,
  formatNumber,
  convertFromCm,
  calculateVolumePerCargo,
  finalVolume,
  findGreaterNumber,
  calculateGrossWeightPerCargo,
  getOrdinal,
};
