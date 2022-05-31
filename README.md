# Express.js-Response-HTML-Table-Generator
This client-side module is made to work together with Axios post requests and express response objects. It analyzes responses and generates tables complete with any desired headers, search boxes (optional), and even pagination (optional)! Front-end developers, spend less time writing code and more time designing!

Requirements:

The element maker (which creates what I've dubbed 'table widgets') is meant to be used with Axios for making requests from the client, and processes response objects generated by Express.js. It has been tested using post requests, and is not guaranteed to work with get requests (although it should).

To make post requests from the client, you will need to first import the Axios library.

Add this <script> to your HTML file:
  
```  
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```
You will also need bootstrap. Don't ask me why, but it seems to only work if you have two versions. That's not all. You will need <link> tags in the head, and <script> tags right before the closing body tag for this to work. FOR BOTH. Don't ask me why!!
``` 
  <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <!-- Material Design Bootstrap -->
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.19.0/css/mdb.min.css"
      rel="stylesheet"
    />
  ``` 
  
```
  <body>
    <div id="tableWidget"> 
    </div>
   <script
      type="text/javascript"
      src="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.19.0/js/mdb.min.js"
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"
      integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
      crossorigin="anonymous"
    ></script>
  </body>
  ```
  I'll address the tableWidget div towards the bottom of this document.

You'll also need these:
  ```
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
  ```
Again, just use it. It works!
  
Next, you will need to install Express. You should already have this installed, so I will show you what a standard route looks like:
  
**BASIC ROUTE TEMPLATE**
  
```
  router.post("/doSomethingAndGetResponse", (req, res) => {
  let firstArg = req.body.firstArg;
  let secondArg = req.body.secondArg;
  db.query(
    "Some MySQL Query Goes Here",
    [
      firstArg, secondArg
    ],
    (err, result) => {
      if (result) {
        res.send(result);
      }

      if (err) {
        res.send(err);
      } else {
      }
    }
  );
}); 
  ```
  
As an aside, when defining your query, I recommend creating a function to replace the question marks in your query string with the variables that you need. Do not bother inserting variables inside the brackets, but instead generate a new query based on your response. I've found it to be quite buggy otherwise.
  
Here is a code snippet that will solve your problems:
```
  function replaceQMarks(query, arrayOfParms) {
  var x = 0;
  var str = [...query];
  for (var i in str) {
    if (str[i] === "?") {
      str[i] = arrayOfParms[x];
      x++;
      console.log("Made a replacement!");
    }
  }
  return str.join("");
}
  ```

Call this with your query string, and whatever parameters you want in your query. Note that some paramaters may appear twice in your arrayOfParms, depending on the situation.

**MAKING THE REQUEST**
  
Now that you have Axios, all requests will look roughly the same.

Here is a code snippet demonstrating an Axios request. It is a simple query meant to get a list of available student majors from a school website. 
Within one of your client-side js files:
  
  ``` 
  function getMajors() {

    axios.post("/All/Majors", {}).then((response) => {
      if (response.data) {
        console.log(response.data);
      }
    });
  }

  getMajors();
  ```
  
1. Call axios.post
2. Insert the route as argument one
3. The second argument is an object containing the request body. So, using our first route as an example, we would use:
  
axios.post("/doSomethingAndGetResponse", {arg1: "hello", arg2: "goodbye"}) as our first line, and the rest is boilerplate stuff that you need not give yourself a headache over.
  
**TABLE WIDGET USAGE**
  
Now, we need our element maker. Specifically, the method that we care about is 'initTableWidget'. It is the only export from that javascript file.
  
1. Import the element maker from wherever you placed it in your project folder:
```import { initTableWidget } from "../someDirectory/elementMaker.js";```
  
2. In whatever HTML file you want this table to appear, create a div anywhere. All that matters is that you give it an id of "tableWidget" so the module knows where to generate the table.

3. Decide what kind of table you want. initTableWidget takes five arguments:
header (string) - what text, if any, that you want above your table as the header. If you don't want any, use an empty string: "".
headers (array of strings) - the headers of your table, usually the different keys in your response object. These will appear in the uppermost cells of your table.
names of desired search boxes (array of strings) - basically, this table widget can generate search boxes automatically. Simply list whatever properties from the response object EXACTLY how they appear, and it will make search boxes for you. If you want none, use an empty array: []. It automatically will update the table for you as you add new search criteria.
the response.data object (array of objects) - this is what express sends back, and what we will ultimately be displaying. the lifeblood of our table.  
page buttons yes/no (boolean) - this will add pagination and create buttons for you
size of table (string) - options are "sm", "md", "lg". use whatever size depending on what you're doing.
  
4. Call initTableWidget using the appropriate arguments.
  
 ```
  function getMajors() {
    let headers = ["Major ID", "Major Name", "Department Name"];

    axios.post("/All/Majors", {}).then((response) => {
      if (response.data) {
        console.log(response.data);
        initTableWidget(
          "Majors",
          headers,
          ["Major ID", "Major Name", "Department Name"],
          response.data,
          true,
          "lg"
        );
      }
    });
  }

  getMajors();
  ```
  
This will generate a table with:
A header of "Majors",
With the table headers "Major ID", "Major Name", "Department Name"
 Search boxes for Major ID, Major Name, Department Name
 response.data from our express post request
  page buttons
  of size large.
  
That's it! All of your tables can now be generated with one function. Have fun!  
 
  ![Screenshot from 2022-05-31 00-49-07](https://user-images.githubusercontent.com/25509807/171095036-e1f5cb81-8f70-41f0-9c99-fee7380b73c4.png)



 
  
  


  
  
  
  
  

  
