// IMPORTANT
// YOU MUST HAVE A DIV W/ ID 'tableWidget' somewhere in HTML!

import { fix_formatting } from "./fix_formatting.js";

var curPage = 0; // To keep track of where we are
var curTable = [{}];
var headers = [];
var initialTable = [{}];
var initialTableInfoDividedIntoPages;
var prevFieldValLength = 0;
var totalPages = 0;
var newTable = [{}];
var tableDisplayingNow = [{}];
var currentTableState = [{}];
var originalTableState = [{}];
var previousTableState = [{}];
var table = [{}];
var tableDisplay = [{}];
function makeHeader(title, optDifWidget) {
  if (optDifWidget) var widget = document.getElementById(optDifWidget);
  else var widget = document.getElementById("tableWidget");
  var header;

  // make row
  var row = document.createElement("div");
  row.className = "row justify-content-center";

  //var row = (document.createElement("div").className =
  //"row justify-content-center");
  var col1 = document.createElement("div");
  col1.id = "col1";
  col1.className = "col-4 my-1";

  var headerTextContainer = document.createElement("div");
  headerTextContainer.id = "headerTextContainer";
  headerTextContainer.className = "col-auto my-1";

  var col3 = document.createElement("div");
  col3.className = "col-4 my-1";
  col3.id = "col3";

  var header = document.createElement("h1");

  header.id = "header";
  header.innerHTML = title;

  row.appendChild(col1);
  headerTextContainer.appendChild(header);
  row.appendChild(headerTextContainer);
  row.appendChild(col3);
  widget.appendChild(row);
}

// The table widget will always use col3 as an id when designating the header
// Therefore, the element we're looking for is statically of an id of col3.
// This isn't an optimal solution at all, but it's a small script that fixes
// the problem of having a skewed header if there are too many words in its innerHTML.
function fixOffsetWidgetHeader() {
  if (document.getElementById("col3")) {
    document.getElementById("col3").remove();
    document.getElementById("col1").className = "col-auto my-1";
  }
}

function makeTableContainer(desiredTableSize, optDifWidget) {
  var widget;
  if (optDifWidget) widget = document.getElementById(optDifWidget);
  else widget = document.getElementById("tableWidget");
  var row = document.createElement("div");
  row.className = "row justify-content-center";
  row.id = "tableContainer";
  if (desiredTableSize == "sm") {
    var col1 = document.createElement("div");
    col1.className = "col-4 my-1";
    col1.id = "col1";

    var col2 = document.createElement("div");
    col2.className = "col-4 my-1";
    col2.id = "col2";

    if (optDifWidget) {
      var tableGoesHere = document.createElement("div");
      tableGoesHere.id = "myTable_secondary";
    } else {
      var tableGoesHere = document.createElement("div");
      tableGoesHere.id = "myTable";
    }

    var col3 = document.createElement("div");
    col3.className = "col-4 my-1";
    col3.id = "col3";
  } else if (desiredTableSize == "md") {
    var col1 = document.createElement("div");
    col1.className = "col-3 my-1";
    col1.id = "col1";

    var col2 = document.createElement("div");
    col2.className = "col-6 my-1";
    col2.id = "col2";

    if (optDifWidget) {
      var tableGoesHere = document.createElement("div");
      tableGoesHere.id = "myTable_secondary";
    } else {
      var tableGoesHere = document.createElement("div");
      tableGoesHere.id = "myTable";
    }

    var col3 = document.createElement("div");
    col3.className = "col-3 my-1";
    col3.id = "col3";
  } else if (desiredTableSize == "lg") {
    var col1 = document.createElement("div");
    col1.className = "col-1 my-1";
    col1.id = "col1";

    var col2 = document.createElement("div");
    col2.className = "col-10 my-1";
    col2.id = "col2";

    if (optDifWidget) {
      var tableGoesHere = document.createElement("div");
      tableGoesHere.id = "myTable_secondary";
    } else {
      var tableGoesHere = document.createElement("div");
      tableGoesHere.id = "myTable";
    }

    var col3 = document.createElement("div");
    col3.className = "col-1 my-1";
    col3.id = "col3";
  }

  row.appendChild(col1);
  col2.appendChild(tableGoesHere);
  row.appendChild(col2);
  row.appendChild(col3);
  console.log(widget);
  widget.appendChild(row);
}

function makePageNavigationButtons(optTableID) {
  var widget;
  //if (optTableID) widget = document.getElementById(optTableID);
  widget = document.getElementById("tableWidget");

  var row = document.createElement("div");
  row.className = "row justify-content-center";

  var col1 = document.createElement("div");
  col1.className = "col-auto my-1";
  col1.id = "col1";

  var prevPageButton = document.createElement("button");
  prevPageButton.className = "btn btn-primary";
  prevPageButton.id = "rightPgMv"; // Ignore that the id is backwards :p
  prevPageButton.innerHTML = "Prev";

  var col2 = document.createElement("div");
  col2.className = "col-auto my-1";
  col2.id = "col2";

  var nextPageButton = document.createElement("button");
  nextPageButton.className = "btn btn-primary";
  nextPageButton.id = "leftPgMv";
  nextPageButton.innerHTML = "Next";

  col1.appendChild(prevPageButton);
  col2.appendChild(nextPageButton);
  row.appendChild(col1);
  row.appendChild(col2);
  widget.appendChild(row);
}

function makePageNumberDisplay() {
  var widget = document.getElementById("tableWidget");

  var row = document.createElement("div");
  row.className = "row justify-content-center";

  var col1 = document.createElement("div");
  col1.className = "col-auto my-1";
  col1.id = "col1";

  var text = document.createElement("h3");
  text.id = "pageNum";

  col1.appendChild(text);
  row.appendChild(col1);
  widget.appendChild(row);
}

function makeNumberOfResultsDisplay() {
  var widget = document.getElementById("tableWidget");

  var row = document.createElement("div");
  row.className = "row justify-content-center";

  var col1 = document.createElement("div");
  col1.className = "col-auto my-1";
  col1.id = "col1";

  var text = document.createElement("h2");
  text.id = "numResults";

  col1.appendChild(text);
  row.appendChild(col1);
  widget.appendChild(row);
}

// gave this its own function so we can force it
// if need be, gonna export it
function removeSubheaderText() {
  if (document.getElementById("subheaderRow")) {
    while (document.getElementById("subheaderRow").firstChild) {
      document.getElementById("subheaderRow").lastChild.remove();
    }
    document.getElementById("subheaderRow").remove();
    console.log("Removed previous subheader successfully.");
  }
}
// Adds more text underneath the h1 element in initTableWidget
function appendSubheader(text) {
  removeSubheaderText();
  var container = document.getElementById("headerTextContainer");
  var row = document.createElement("div");
  row.className = "row justify-content-center text-align-center";
  row.id = "subheaderRow";
  var col = document.createElement("div");
  col.className = "col-auto my-1";

  var ele = document.createElement("h2");
  ele.innerHTML = text;
  col.appendChild(ele);
  row.appendChild(col);
  container.insertAdjacentElement("beforeend", row);
}

function getTableState(which) {
  if (which == "original") {
    // // console.log(`Got ${which} table state: \n`);
    // // console.log(originalTableState);
    return originalTableState;
  } else if (which == "previous") {
    // // console.log(`Got ${which} table state: \n`);
    // // console.log(previousTableState);
    return previousTableState;
  } else if (which == "current") {
    // // console.log(`Got ${which} table state: \n`);
    // // console.log(currentTableState);
    return currentTableState;
  } else {
    console.error("That table state doesn't exist! \n");
    console.error(originalTableState);
  }
}

function setTableState(table, which) {
  if (which == "original") {
    originalTableState = table;
    // // console.log(`Set ${which} table state to: \n`);
    // // console.log(originalTableState);
  } else if (which == "previous") {
    previousTableState = table;
    // // console.log(`Set ${which} table state to: \n`);
    // // console.log(previousTableState);
  } else if (which == "current") {
    currentTableState = table;
    // // console.log(`Set ${which} table state to: \n`);
    // // console.log(currentTableState);
  } else {
    console.error("That table state doesn't exist! \n");
    console.error(originalTableState);
  }
}

function generateTableAfterFilters(arrayOfKeys, collectionOfInputs, headers) {
  var val;
  table = initialTable;
  for (var i in collectionOfInputs) {
    if (collectionOfInputs[i].value) {
      if (isNaN(collectionOfInputs[i].value))
        // check for numbers
        val = collectionOfInputs[i].value;
      else val = collectionOfInputs[i].value.toString();
      // // console.log(val.length);
      // // console.log(typeof collectionOfInputs[i].value);
      if (typeof val == "number" && i < collectionOfInputs.length) {
        // console.log("Found a number");
        table = makeTableOfElementsContainingValue(
          val.toString(),
          table,
          arrayOfKeys[i],
          headers
        );
      }

      if (val.length > 0) {
        if (i == 0) {
          // Start
          table = makeTableOfElementsContainingValue(
            val,
            table,
            arrayOfKeys[0],
            headers
          );
          // console.log("Created initial table using search criteria " + val);
          // console.log(table);
        } else if (i == arrayOfKeys.length - 1) {
          // End, where we disdplay
          // console.log("The last field has a value. Searching " + val);
          table = makeTableOfElementsContainingValue(
            val,
            table,
            arrayOfKeys[i],
            headers
          );
          // console.log("Finished making a table");
        } else {
          // console.log(
          //  "Found another search field with a value. Searching " + val
          //);
          table = makeTableOfElementsContainingValue(
            val,
            table,
            arrayOfKeys[i],
            headers
          );
        }
        // console.log("Generating a table, looking for value :" + val);
        // console.log("Using key " + arrayOfKeys[i]);
      }
    }
  }
  // console.log("Table: ");
  // console.log(table);
  if (table.length != 0) {
    tableDisplay = divideIntoPagesOfXRows(table, 10);
    makeTableAndDisplay(tableDisplay[0], headers);
  } else {
    // console.log("No results");
    makeTableAndDisplay([{}], headers);
  }
  // console.log("Table display");
  // console.log(tableDisplay);
  if (table.length >= 1) {
    setCurPageAndDisplayNewMsg(0, "pageNum", tableDisplay.length);
  } else document.getElementById("pageNum").innerHTML = "No results found!";
}

function makeSearchFields(arrayOfIdsToSearchFor, tableHeaders) {
  var widget = document.getElementById("tableWidget");
  var table;

  var row = document.createElement("div");
  row.className = "row justify-content-center";

  if (arrayOfIdsToSearchFor) {
    console.log("Searching for");
    console.log(arrayOfIdsToSearchFor);
    arrayOfIdsToSearchFor.forEach((key) => {
      var input = document.createElement("input");
      input.placeholder = `Search by ${key}...`;
      var temp = " " + key + " ";
      if (temp.includes("num")) input.type = "number";
      else input.type = "string";

      var temp = [];
      // // console.log(indices);

      var col1 = document.createElement("div");
      col1.className = "col-auto my-1";
      col1.id = "col1";
      col1.appendChild(input);
      row.appendChild(col1);

      widget.appendChild(row);
      let arr = [];

      var collectionOfInputs = document.getElementsByTagName("input");
      collectionOfInputs.forEach((ele) => {
        console.log(ele);
        console.log(ele.id);
        console.log(ele.placeholder);
        let id = ele.id.toLowerCase();
        let className = ele.className.toLowerCase();
        console.log(className);
        if (className.includes("form-control") || id.includes("input")) {
          console.log(
            "Building our collection of inputs. Found an input field - we don't want to count that when generating search fields!"
          );
        } else {
          console.log("Adding to the collection of inputs array...");
          arr.push(ele);
        }
      });
      console.log("Our completed input array: (without any form input fields)");
      console.log(arr);
      input.onkeyup = function () {
        console.log("Array of IDs: ");
        console.log(arrayOfIdsToSearchFor);

        console.log("Collection of inputs: ");
        console.log(collectionOfInputs);

        generateTableAfterFilters(arrayOfIdsToSearchFor, arr, tableHeaders);
      };
    });
  }
}
function mvPgUp(table, tableHeaders) {
  // // console.log("Moving page up");
  if (localStorage.getItem("curPage")) {
    curPage = parseInt(localStorage.getItem("curPage"));
    //  // console.log("Current page: ");
    // // console.log(curPage);

    if (curPage + 1 < table.length) {
      makeTableAndDisplay(table[curPage + 1], tableHeaders);
      // console.log("Going up");
      setCurPageAndDisplayNewMsg(curPage + 1, "pageNum", table.length);
    } else {
      // console.log("Can't go up any further");
    }
  }
}

function mvPgDown(table, tableHeaders) {
  // // console.log("Moving page down");

  if (localStorage.getItem("curPage")) {
    curPage = parseInt(localStorage.getItem("curPage"));
    // // console.log("Current page: ");
    // // console.log(curPage);

    if (curPage - 1 >= 0) {
      makeTableAndDisplay(table[curPage - 1], tableHeaders);
      // // console.log("Going down");
      setCurPageAndDisplayNewMsg(curPage - 1, "pageNum", table.length);
    } else {
      // console.log("Can't go down any further");
    }
  }
}

// arrayOfObjs is typically the query response object
function makeTableAndDisplay(arrayOfObjs, headers, optTableID) {
  // Nuke the table before making another

  if (optTableID) {
    console.log(document.getElementsByTagName("div"));

    //    var myTable = document.getElementById("myTable_secondary");
    var ele = document.getElementById("main").cloneNode(true);
    ele.id = "main_2";
    document.getElementById("main").insertAdjacentElement("afterend", ele);
    document.getElementById("main").remove();

    var myTable = document.getElementById("myTable");
  } else {
    var myTable = document.getElementById("myTable");

    if (document.getElementById("main"))
      document.getElementById("main").remove();
  }

  // console.log("Generating table!");
  // Create table

  let table = document.createElement("table");
  table.id = "main";

  // let table = document.createElement("table");
  // Create search bar

  table.className = "datatable table table-striped table-bordered table-sm";
  let headerRow = document.createElement("tr");
  headers.forEach((headerText) => {
    let header = document.createElement("th");
    let textNode = document.createTextNode(headerText);
    header.appendChild(textNode);
    headerRow.appendChild(header);
  });
  table.appendChild(headerRow);
  arrayOfObjs.forEach((emp) => {
    let row = document.createElement("tr");
    Object.values(emp).forEach((text) => {
      let cell = document.createElement("td");
      let textNode;

      textNode = document.createTextNode(text);

      cell.appendChild(textNode);
      row.appendChild(cell);
    });
    table.appendChild(row);
  });
  myTable.appendChild(table);
}

function divideIntoPagesOfXRows(arrayOfObjs, desiredRowsPerPage) {
  // // console.log("Data \n");
  // // console.log(arrayOfObjs);
  // 1st - separate the data by row
  // console.log("starting");
  var storeObjsInThisArray = [];
  var temp = [];

  for (var i = 0; i < arrayOfObjs.length; i++) {
    temp.push(arrayOfObjs[i]);
    if (temp.length == desiredRowsPerPage) {
      storeObjsInThisArray.push(temp);
      temp = [];
    }
  }
  if (temp.length > 0) storeObjsInThisArray.push(temp); // in case we don't have even distribution of 10's
  // console.log(storeObjsInThisArray);
  return storeObjsInThisArray;
}

function setCurPageAndDisplayNewMsg(page, msgEleId, totalPages) {
  // Takes new page #, and element ID for the element displaying what page it is (as a string).
  localStorage.setItem("curPage", JSON.stringify(page));

  document.getElementById(msgEleId).innerHTML =
    "You're on Page #" + (page + 1) + "/" + totalPages + "!";
}

function makeTableOfElementsContainingValue(val, data, key, headers) {
  var temp = " " + key + " ";
  var hasANumber = false;
  if (temp.includes("num")) {
    hasANumber = true;
  }

  var regex = RegExp(`^.*${val}.*`, "i"); // i flag means case insensitive
  // Regular expression is what we're searching for

  // console.log(regex);

  // Tables is the initial data, since that's what we're searching. It could be whatever though

  var tables = data;

  var temp3 = [];

  // Temp is where we're storaging the new object!

  var obj;
  // // console.log(tables);

  // For each object in tables...
  tables.forEach((object) => {
    obj = object;

    // Grab the values of said object, which could be whatever

    var values = Object.values(object);

    // For each value ["AA101", "Business"]
    // The object itself would just be 'object'
    // I don't think a fancy checkForPrimaryKey function is needed
    //    // console.log("Values: \n" + values);
    for (var i in values) {
      //    // console.log("Looping var i in values... \n");
      //  // console.log("i: \n" + i);
      //// console.log("values[i]: \n" + values[i]);
      // If the regex matches whatever value it is

      // console.log("Object: \n");
      // console.log(object);
      // console.log("Object[i]: \n");
      // console.log(object[i]);
      // console.log(object[key]);
      // console.log(object[key]);
      // console.log("Values[i]");
      // console.log(values[i]);
      // console.log("Regex test: ");
      // console.log(regex.exec(values[i]));
      if (object[key] == values[i]) {
        /*
        // console.log(
          "A match between object key " +
            object[key] +
            " and values [i] " +
            values[i]
        );*/
        // console.log("Is object[key] not an int?");
        // console.log(isNaN(object[key]));
        // console.log("Is values[i] not an int?");
        // console.log(isNaN(values[i]));
      }

      // As long as there are no duplicates
      if (
        regex.exec(values[i]) &&
        object[key] == values[i] &&
        !temp3.includes(object)
      ) {
        // console.log("Adding to array");
        temp3.push(object);
      } else if (temp3.includes(object)) {
        // console.log("Skipping. Duplicate.");
      } else {
      }
    }
  });

  tableDisplayingNow = temp3;
  // // console.log(
  //"Updating table displaying now, we just made a tablea fter a search: \n"
  //);
  // console.log(tableDisplayingNow);
  return temp3;
}

function checkForKey(arr, key, val) {
  // console.log("We are looking for val: " + val);
  var counter = 0;

  if (arr.length == 0) {
    return true;
  }
  if (arr.length >= 1) {
    arr.forEach((ele) => {
      // console.log(ele);
      // console.log(ele[key]);
      if (ele[key] == val) {
        counter++;
      }
    });
  }

  if (counter > 0) {
    return false;
  } else {
    return true;
  }
}

function search(val, key, table) {
  var lengthBeforeDivision;

  if (val && val.length > 0) {
    // If we already did a search
    /*
    if (curTable.length < initialTable.length) {
      table = curTable;
    }
*/
    // reset newTable each time!

    // If the field has something
    // Field is populated
    // console.log(initialTable);
    prevFieldValLength = val.length;
    var found;
    newTable = makeTableOfElementsContainingValue(
      val.toUpperCase(),
      tableDisplayingNow,
      key,
      headers
    ); //

    curTable = newTable;
    // // console.log(newTable);
    lengthBeforeDivision = newTable.length;
    newTable = divideIntoPagesOfXRows(newTable, 10);
    // // console.log("Length of table: " + newTable.length);
    curTable = newTable;

    // // console.log("Found something in the field");
    // // console.log(newTable);

    if (newTable.length == 1) {
      // If there are less than ten rows to display
      makeTableAndDisplay(newTable[0], headers); // Display a page
      setCurPageAndDisplayNewMsg(0, "pageNum", 1); // Total Pages is 1, current page is 1
      document.getElementById("numResults").innerHTML =
        lengthBeforeDivision + " result(s) found!";
    } else if (newTable.length == 0) {
      // If there are no results
      makeTableAndDisplay([{}], headers); // No matches
      document.getElementById("numResults").innerHTML = "No results found!";
      document.getElementById("pageNum").innerHTML = "";
    } else {
      // The table is more than one page
      totalPages = newTable.length;
      makeTableAndDisplay(newTable[0], headers);
      document.getElementById("numResults").innerHTML =
        lengthBeforeDivision + " result(s) found!";
      setCurPageAndDisplayNewMsg(0, "pageNum", totalPages);
    }
  } else {
    // Field is empty
    // Display the whole table
    document.getElementById("numResults").innerHTML = "";
    setCurPageAndDisplayNewMsg(
      0,
      "pageNum",
      initialTableInfoDividedIntoPages.length
    );

    makeTableAndDisplay(initialTableInfoDividedIntoPages[0], headers);
  }
}

function removeUnwantedSearchBoxes(arrOfNamesThatAreNotNecessarilyPrecise) {
  var eles = document.getElementsByTagName("input");
  eles.forEach((ele) => {
    arrOfNamesThatAreNotNecessarilyPrecise.forEach((str) => {
      if (ele.placeholder.includes(str)) {
        console.log("Removing element: ");
        console.log(ele);
        ele.style.display = "none";
        return;
      }
    });
  });
}

function initTableWidget(
  header,
  tableHeaders,
  arrayOfIdsToSearchFor,
  arrayOfObjs,
  doesWantPageButtons,
  desiredTableSize
) {
  if (!document.getElementById("tableWidget")) {
    console.error(
      "The element maker requires a div element defined in your HTML with ID 'tableWidget'. Please add that and try again."
    );
    return;
  }
  // Check if an existing widget is there, clear it out
  // before making a new one
  let optDifWidget = undefined;
  if (optDifWidget != undefined && document.getElementById(optDifWidget)) {
    console.log(document.getElementById(optDifWidget));
    var widget = document.getElementById(optDifWidget);
    console.log("Removing optional table stuff");
    while (widget.firstChild) {
      widget.removeChild(widget.firstChild);
    }
  } else if (!optDifWidget && document.getElementById("tableWidget")) {
    console.log("Removing regualr table stuff");
    var widget_ = document.getElementById("tableWidget");
    while (widget_.firstChild) {
      widget_.removeChild(widget_.firstChild);
    }
  } else {
    console.error("Something went wrong");
  }

  if (optDifWidget) {
    console.log("Building header for optional widget");
    makeHeader(header, optDifWidget);

    makeTableContainer(desiredTableSize, optDifWidget);
  } else {
    console.log("Building header for other thing");
    makeHeader(header);

    makeTableContainer(desiredTableSize);
  }
  if (doesWantPageButtons) {
    if (optDifWidget) makePageNavigationButtons(optDifWidget);
    else makePageNavigationButtons();
    makePageNumberDisplay();

    var leftPgMvButton = document.getElementById("leftPgMv");
    var rightPgMvButton = document.getElementById("rightPgMv");
    if (leftPgMvButton.addEventListener)
      leftPgMvButton.addEventListener(
        "click",
        () => {
          mvPgUp(tableDisplay);
        },
        false
      );
    else if (leftPgMvButton.attachEvent)
      leftPgMvButton.attachEvent("onClick", () => {
        mvPgUp(tableDisplay, tableHeaders);
      });

    if (rightPgMvButton.addEventListener)
      rightPgMvButton.addEventListener(
        "click",
        () => {
          mvPgDown(tableDisplay, tableHeaders);
        },
        false
      );
    else if (rightPgMvButton.attachEvent)
      rightPgMvButton.attachEvent("onClick", () => {
        mvPgDown(tableDisplay);
      });
  }
  if (arrayOfIdsToSearchFor != null) {
    makeSearchFields(arrayOfIdsToSearchFor, tableHeaders);
    // makeNumberOfResultsDisplay();
  }

  headers = tableHeaders;
  localStorage.setItem("curPage", JSON.stringify(1));
  initFirstTable(
    arrayOfObjs,
    doesWantPageButtons,
    desiredTableSize,
    optDifWidget,
    tableHeaders
  );

  let searchBoxesToRemove = [];
  if (arrayOfIdsToSearchFor.length > 0) {
    for (let i = 0; i < tableHeaders.length; i++) {
      if (!arrayOfIdsToSearchFor.includes(tableHeaders[i])) {
        searchBoxesToRemove.push(tableHeaders[i]);
      }
    }
    if (searchBoxesToRemove.length > 0) {
      removeUnwantedSearchBoxes(searchBoxesToRemove);
      console.log("Removed search boxes!");
    }
  }
}

function initFirstTable(
  arrayOfObjs,
  doesWantPageButtons,
  desiredTableSize,
  optDifWidget,
  tableHeaders
) {
  initialTable = arrayOfObjs;
  setTableState(initialTable, "original");
  // document.getElementById("numResults").innerHTML = "";
  initialTableInfoDividedIntoPages = divideIntoPagesOfXRows(arrayOfObjs, 10);
  tableDisplay = initialTableInfoDividedIntoPages;
  if (doesWantPageButtons) {
    setCurPageAndDisplayNewMsg(
      0,
      "pageNum",
      initialTableInfoDividedIntoPages.length
    );
  }
  curTable = initialTableInfoDividedIntoPages;
  makeTableAndDisplay(
    initialTableInfoDividedIntoPages[0],
    tableHeaders,
    optDifWidget
  );
}

window.onload = function () {
  /*
  initTableWidget(
    "Course Catalog",
    ["courseID", "courseName", "numCredits", "deptName"], // headers
    ["courseID", "courseName", "numCredits", "deptName"] // array of ids to search for
  );
  */
};

export { initTableWidget };
