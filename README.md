# Week 1: Site Creation

## W01 Tools and Setup

### Install MS Teams

### Install Visual Studio Code

### Create a GitHub.com Account

### VSCode Shortcuts

### Cloning Git Repositories

### Install VSCode Extensions

### Install Node

### Install PNPM Node Package Installer

## W01 Group Sign-up

## W01 Node.JS Overview

### Request - Response Basics

### Node References

### Build a simple Application

#### Build the Sample Folder

```bash
# In the terminal
cd ~/WebstormProjects/cse340-spring-2024-block-one/
mkdir sample
cd sample
pnpm init

# Open up this cse340-spring-2024-block-one/sample folder in VSCode
```

#### Add Express

```bash
# In the terminal
pnpm add express
```

#### Add server.js inside the sample folder with the following content

```javascript
/* ******************************************
 * This is the application server
 * ******************************************/
const express = require("express")

const app = express()

/* ******************************************
 * Server host name and port
 * ***************************************** */
const HOST = 'localhost'
const PORT = 3000

/* ***********************
* Log statement to confirm server operation
* *********************** */
app.listen(PORT, () => {
  console.log(`trial app listening on ${HOST}:${PORT}`)
})
```

#### Test the server

```bash
node server.js

# In your browser, go to localhost:3000
```

#### Add a route into the server.js file

```javascript
/* ******************************************
 * This is the application server
 * ******************************************/
const express = require("express")

const app = express()

/* ******************************************
 * Default GET route
 * ***************************************** */
app.get("/", (req, res) => {
  res.send("Welcome home!")
})

/* ******************************************
 * Server host name and port
 * ***************************************** */
const HOST = 'localhost'
const PORT = 3000

/* ***********************
* Log statement to confirm server operation
* *********************** */
app.listen(PORT, () => {
  console.log(`trial app listening on ${HOST}:${PORT}`)
})
```

## W01 EJS Templates

### Download and Implement Server Code (https://blainerobertson.github.io/340-js/views/github-starter.html)

### Review the starter files

### Build the application

```bash
# In the terminal
cd ~/WebstormProjects/cse340-spring-2024-block-one/
pnpm install
```

### EJS View Engine

#### Install the packages

```bash
# In the terminal
pnpm add ejs express-ejs-layouts
```

#### View Engine Setup

##### Update your server.js file to look like this:

```javascript
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
```

##### Layouts folder and layout.ejs file in the views folder

```bash
# In the terminal
mkdir -p views/layouts
touch views/layouts/layout.ejs
```

```ejs
<!DOCTYPE html>
<html lang="en">
<%- include('../partials/head') %>

<body>
<div id="wrapper">
    <%- include('../partials/header') %>
    <%- include('../partials/navigation') %>

    <main>
        <%- body %>
    </main>

    <%- include('../partials/footer') %>
</div>
</body>
</html>
```

##### Partials folder and head.ejs, header, navigation and footer files in the views folder

```bash
# In the terminal
mkdir -p views/partials
touch views/partials/head.ejs
touch views/partials/header.ejs
touch views/partials/navigation.ejs
touch views/partials/footer.ejs
```

```ejs
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%- title %> | CSE 340 App</title>
    <link rel="icon" type="image/png" sizes="32x32" href="/images/site/favicon-32x32.png">
    <link rel="stylesheet" href="/css/styles.css">
</head>
```

```ejs
<header id="top-header">
  <span class="siteName">
    <a href="/" title="Return to home page">CSE Motors</a>
  </span>
    <div id="tools">
        <a title="Click to log in" href="/account/login">My Account</a>
    </div>
</header>
```

```ejs
<nav>
    <ul>
        <li>Home</li>
        <li>Custom</li>
        <li>Sedan</li>
        <li>SUV</li>
        <li>Truck</li>
    </ul>
</nav>
```

```ejs
<% const d = new Date()
let year = d.getFullYear() %>
<footer>
    <p class="copyright">&copy; <%= year %>, CSE 340 App</p>
</footer>
```

### Implement index route with Express and EJS

#### The "index" route. Update your server.js file to look like this:

```javascript
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", function(req, res) {
  res.render("index", {title: "Home"})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
```

#### Build the index.ejs view file

```ejs
<h1>Daniel Stephenson</h1>
```

### Add a render.com application service

### Deploy updates and test the application

## W01 Assignment: Site Creation
**Note: This assignment is due by the end of Week 1 and is completely on the students.**

### Build the general structure of the site, both desktop and mobile
**Note: in layouts.ejs, we have the <body> tag and a <div id="wrapper"> tag, we're going to style these two things.**

```css
/* styles.css */
@import url("https://fonts.googleapis.com/css2?family=Inter&family=Literata:opsz@7..72&display=swap");

/******* Change Box Model ***************/
*,
*:before,
*:after {
  box-sizing: border-box;
}

:root {
  --primary-background: #fff;
  --main-accent: #01b0d3;
  --body-font: Inter;
}

body {
  font-family: var(--body-font), sans-serif;
  margin: 0;
}

#wrapper {
  width: 95%;
  background-color: var(--primary-background);
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 1em;
}

@media only screen and (min-width: 768px) {
  body {
    background-image: linear-gradient(45deg, #000 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #000 75%),
    linear-gradient(45deg, transparent 75%, #000 75%),
    linear-gradient(45deg, #000 25%, #fff 25%);
    background-size: 100px 100px;
    background-position: 0 0, 0 0, -50px -50px, 50px 50px;
  }

  #wrapper {
    border: 5px solid var(--main-accent);
    border-radius: 10px;
    margin-top: 1rem;
    padding: 1vw;
    width: 75vw;
    max-width: 1200px;
  }
}
```

### Build the header
**Note: In the header.ejs, we have the following elements to style: <header id="top-header">, <span class="siteName">, and <div id="tools">**

```css
/* styles.css */
:root {
  --primary-text: #242333;
}

#top-header {
  display: flex;
  justify-content: space-between;
}

.siteName {
  font-size: 2rem;
  font-weight: 800;
}

#tools {
  font-size: 3.5vw;
  font-variant: small-caps;
  display: flex;
  width: 20%;
  justify-content: space-evenly;
}

header > img {
  max-width: 40%;
}

header a {
  text-decoration: none;
  color: var(--primary-text);
  display: inline-block;
  padding: 2vh 0;
}

@media only screen and (min-width: 768px) {
  /* header.ejs */
  #tools {
    font-size: inherit;
  }
}
```

### Build the navigation
**Note: In the navigation.ejs, we have the following elements to style: <nav>, <ul>, and <li>**

```css
/* styles.css */
nav {
  background-color: var(--primary-text);
  color: var(--primary-background);
}

nav ul {
  display: flex;
  padding: 0 1vw;
  justify-content: space-around;
}

nav li {
  list-style: none;
  padding-top: 1em;
  padding-bottom: 1em;
}

@media only screen and (min-width: 768px) {
  nav {
    margin-top: 0.75rem;
  }

  nav ul {
    justify-content: space-evenly;
    padding: 0.5rem 0;
    margin: 0;
  }

  nav li {
    margin: 0;
    padding: 0;
    text-align: center;
  }
}
```

### Build the footer
**Note: In the footer.ejs, we have the following elements to style: <footer>, and <p class="copyright">**

```css
/* styles.css */
footer {
  margin-top: 2rem;
}

footer p {
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
}

hr {
  border: 2px solid var(--primary-text);
  margin: 0;
}
```

### Build the index.ejs

#### HTML structure

```ejs
<h1>Welcome to CSE Motors!</h1>

<section id="hero">
    <ul>
        <li>
            <h2>DMC Delorean</h2>
        </li>
        <li>3 Cup holders</li>
        <li>Superman doors</li>
        <li>Fuzzy dice!</li>
        <li>
            <button id="actionbtn">Own Today</button>
        </li>
    </ul>
</section>
<div class="flex-content">
    <section id="review">
        <h2>DMC Delorean Reviews</h2>
        <ul>
            <li>"So fast it's almost like traveling in time." (4/5)</li>
            <li>"Coolest ride on the road." (4/5)</li>
            <li>"I'm feeling McFly!" (5/5)</li>
            <li>"The most futuristic ride of our day." (4.5/5)</li>
            <li>"80's livin and I love it!" (5/5)</li>
        </ul>
    </section>
    <section id="add-ons">
        <h2>Delorean Upgrades</h2>
        <div class="flex">
            <a href="#" title="flux-capacitor">
                <figure>

                    <div class="add-col"><img src="./images/upgrades/flux-cap.png" alt="Flux-Capacitor"></div>
                    <figcaption>Flux Capacitor</figcaption>
                </figure>
            </a>
            <a href="#" title="flame decals">
                <figure>
                    <div class="add-col"><img src="./images/upgrades/flame.jpg" alt="flame decal"></div>
                    <figcaption>Flame Decals</figcaption>
                </figure>
            </a>

        </div>
        <div class="flex">
            <a href="#" title="bumper stickers">
                <figure>
                    <div class="add-col"><img src="./images/upgrades/bumper_sticker.jpg" alt="Bumper Stickers"></div>
                    <figcaption>Bumper Stickers</figcaption>
                </figure>
            </a>
            <a href="#" title="hub caps">
                <figure>
                    <div class="add-col"><img src="./images/upgrades/hub-cap.jpg" alt="Hub Caps"></div>
                    <figcaption>Hub Caps</figcaption>
                </figure>
            </a>

        </div>
    </section>
</div>
```

#### CSS structure
**Note: In the index.ejs, we have the following elements to style: <h1>, <h2>, <section id="hero">, <ul>, <li>, <button id="actionbtn">, <div class="flex-content">, <section id="review">, <section id="add-ons">, <div class="flex">, <a>, <figure>, <div class="add-col">, <img>, and <figcaption>**

```css
/* styles.css */
:root {
  --heading-font: Literata;
}

h1,
h2 {
  font-size: 1.2em;
  font-family: var(--heading-font), serif;
}

#hero {
  background-image: url("/images/vehicles/delorean.jpg");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  margin-left: auto;
  margin-right: auto;
  display: flex;
}

#hero h2 {
  margin-left: 0;
}

#hero a:hover {
  opacity: 0.5;
}

#hero li {
  list-style: none;
  color: var(--main-accent);
}

#hero li h2 {
  margin-top: 0;
  margin-bottom: 0;
  color: var(--main-accent);
}

#hero ul {
  padding-left: 0;
  margin-top: 0;
  max-width: 200px;
  margin-left: 0.5em;
  margin-bottom: 2rem;
  background-color: rgba(255, 255, 255, 0.7);
}

#hero li {
  font-size: 0.85em;
}

#actionbtn {
  display: inline-block;
  max-width: 25vw;
  max-height: 10vh;
  padding: 0.5rem;
  background-color: var(--main-accent);
  color: var(--primary-text);
  font-weight: 800;
  border-radius: 0.25rem;
}

#actionbtn:hover {
  opacity: 0.5;
}

/* For Delorian list */
section ul {
  padding: 0 0 0 1rem;
}

#review li {
  font-size: 0.9em;
  margin-bottom: 1em;
}

.flex {
  display: flex;
  margin-bottom: 2em;
  justify-content: center;
  width: 100%;
  padding-left: 0.25em;
}

.flex a {
  width: 100%;
}

.add-col {
  background-color: var(--main-accent);
  height: 5.5em;
  width: 95%;
  border: var(--primary-text) solid 1px;
}

a figure {
  margin: 0;
}

figure img {
  display: block;
  margin: auto;
  padding-top: 0.5em;
}

figure figcaption {
  text-align: center;
}

section {
  margin-bottom: 2em;
  margin-top: 1em;
}
```

# Week 2: Databases and SQL

## W02 SQL Basics

### Relational Database Terms

### Introduction to SQL, Chapter 1

### PostgreSQL Crash Course

## W02 Server Setup

### Create a Render.com Account

### Connect VSCode to the remote database

## W02 DB Creation and Practice

### Create a database type

```sql
DROP TYPE IF EXISTS public.account_type;
CREATE TYPE public.account_type AS ENUM(
  'Client',
  'Employee',
  'Admin'
);
```

### Create the database tables

```sql
-- Table structure for table `classification`
CREATE TABLE public.classification (
  classification_id INT GENERATED BY DEFAULT AS IDENTITY,
  classification_name CHARACTER VARYING NOT NULL,
  CONSTRAINT classification_pk PRIMARY KEY (classification_id)
);

-- Table structure for table `inventory`
CREATE TABLE IF NOT EXISTS public.inventory
(
    inv_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    inv_make character varying NOT NULL,
    inv_model character varying NOT NULL,
    inv_year character(4) NOT NULL,
    inv_description text NOT NULL,
    inv_image character varying NOT NULL,
    inv_thumbnail character varying NOT NULL,
    inv_price numeric(9, 0) NOT NULL,
    inv_miles integer NOT NULL,
    inv_color character varying NOT NULL,
    classification_id integer NOT NULL,
    CONSTRAINT inventory_pkey PRIMARY KEY (inv_id)
);

-- Create relationship between `classification` and `inventory` tables
ALTER TABLE IF EXISTS public.inventory
    ADD CONSTRAINT fk_classification FOREIGN KEY (classification_id)
    REFERENCES public.classification (classification_id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

-- Table structure for table `account`
CREATE TABLE IF NOT EXISTS public.account
(
    account_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    account_firstname character varying NOT NULL,
    account_lastname character varying NOT NULL,
    account_email character varying NOT NULL,
    account_password character varying NOT NULL,
    account_type account_type NOT NULL DEFAULT 'Client'::account_type,
    CONSTRAINT account_pkey PRIMARY KEY (account_id)
);
```

### Add data to the tables

```sql
INSERT INTO public.classification (classification_name)
VALUES ('Custom'),
  ('Sport'),
  ('SUV'),
  ('Truck'),
  ('Sedan');


-- Data for table `inventory`
INSERT INTO public.inventory (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
VALUES   (
    'Chevy',
    'Camaro',
    '2018',
    'If you want to look cool this is the ar you need! This car has great performance at an affordable price. Own it today!',
    '/images/camaro.jpg',
    '/images/camaro-tn.jpg',
    25000,
    101222,
    'Silver',
    2
  ), (
    'Batmobile',
    'Custom',
    '2007',
    'Ever want to be a super hero? now you can with the batmobile. This car allows you to switch to bike mode allowing you to easily maneuver through trafic during rush hour.',
    '/images/bat.jpg',
    '/images/bat-tn.jpg',
    65000,
    29887,
    'Black',
    1
  ), (
    'FBI',
    'Surveillance Van',
    '2016',
    'do you like police shows? You will feel right at home driving this van, come complete with survalence equipments for and extra fee of $2,000 a month. ',
    '/images/fbi.jpg',
    '/images/fbi-tn.jpg',
    20000,
    19851,
    'Green',
    1
  ), (
    'Dog ',
    'Car',
    '1997',
    'Do you like dogs? Well this car is for you straight from the 90s from Aspen, Colorado we have the orginal Dog Car complete with fluffy ears.',
    '/images/dog.jpg',
    '/images/dog-tn.jpg',
    35000,
    71632,
    'Brown',
    1
  ), (
    'Jeep',
    'Wrangler',
    '2019',
    'The Jeep Wrangler is small and compact with enough power to get you where you want to go. Its great for everyday driving as well as offroading weather that be on the the rocks or in the mud!',
    '/images/jeep-wrangler.jpg',
    '/images/jeep-wrangler-tn.jpg',
    28045,
    41205,
    'Orange',
    3
  ), (
    'Lamborghini',
    'Adventador',
    '2016',
    'This V-12 engine packs a punch in this sporty car. Make sure you wear your seatbelt and obey all traffic laws. ',
    '/images/lambo-Adve.jpg',
    '/images/lambo-Adve-tn.jpg',
    417650,
    71003,
    'Blue',
    2
  ), (
    'Aerocar International',
    'Aerocar',
    '1963',
    'Are you sick of rushhour trafic? This car converts into an airplane to get you where you are going fast. Only 6 of these were made, get them while they last!',
    '/images/aerocar.jpg',
    '/images/aerocar-tn.jpg',
    700000,
    18956,
    'Red',
    1
  ), (
    'Monster',
    'Truck',
    '1995',
    'Most trucks are for working, this one is for fun. this beast comes with 60in tires giving you tracktions needed to jump and roll in the mud.',
    '/images/monster.jpg',
    '/images/monster-tn.jpg',
    150000,
    3998,
    'purple',
    1
  ), (
    'Cadillac',
    'Escalade',
    '2019',
    'This stylin car is great for any occasion from going to the beach to meeting the president. The luxurious inside makes this car a home away from home.',
    '/images/escalade.jpg',
    '/images/escalade-tn.jpg',
    75195,
    41958,
    'Black',
    4
  ), (
    'GM',
    'Hummer',
    '2016',
    'Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.',
    '/images/hummer.jpg',
    '/images/hummer-tn.jpg',
    58800,
    56564,
    'Yellow',
    4
  ), (
    'Mechanic',
    'Special',
    '1964',
    'Not sure where this car came from. however with a little tlc it will run as good a new.',
    '/images/ms.jpg',
    '/images/ms-tn.jpg',
    100,
    200125,
    'Rust',
    5
  ), (
    'Ford',
    'Model T',
    '1921',
    'The Ford Model T can be a bit tricky to drive. It was the first car to be put into production. You can get it in any color you want as long as it is black.',
    '/images/ford-modelt.jpg',
    '/images/ford-modelt-tn.jpg',
    30000,
    26357,
    'Black',
    5
  ), (
    'Mystery',
    'Machine',
    '1999',
    'Scooby and the gang always found luck in solving their mysteries because of there 4 wheel drive Mystery Machine. This Van will help you do whatever job you are required to with a success rate of 100%.',
    '/images/mm.jpg',
    '/images/mm-tn.jpg',
    10000,
    128564,
    'Green',
    1
  ),
  (
    'Spartan',
    'Fire Truck',
    '2012',
    'Emergencies happen often. Be prepared with this Spartan fire truck. Comes complete with 1000 ft. of hose and a 1000 gallon tank.',
    '/images/fire-truck.jpg',
    '/images/fire-truck-tn.jpg',
    50000,
    38522,
    'Red',
    4
  ), (
    'Ford',
    'Crown Victoria',
    '2013',
    'After the police force updated their fleet these cars are now available to the public! These cars come equiped with the siren which is convenient for college students running late to class.',
    '/images/crown-vic.jpg',
    '/images/crown-vic-tn.jpg',
    10000,
    108247,
    'White',
    5
  );
```

## W02 Assignment: Complete your Database

### assignment2.sql

```sql
INSERT INTO account (account_firstname, account_lastname, account_email, account_password) Values ('Tony', 'Stark', 'tony@starkent.com', ' Iam1ronM@n');

UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

DELETE FROM account WHERE account_id = 1;

UPDATE inventory SET inv_description = replace(inv_description, 'small interiors', 'a huge interior') WHERE inv_id = 10;

SELECT inv_make, inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE i.classification_id = 2;

UPDATE inventory SET inv_image=replace(inv_image,'/images','/images/vehicles'), inv_thumbnail=replace(inv_thumbnail, '/images', '/images/vehicles');
```

### db-rebuild.sql destroy and rebuild the database

```sql
--
-- Database: 'cse 340 project', .public schema
-- Assignment 2, Task 2
--

DROP TABLE IF EXISTS public.account;
DROP TABLE IF EXISTS public.inventory;
DROP TABLE IF EXISTS public.classification;

-- Create client_type data type
DROP TYPE IF EXISTS public.account_type;
CREATE TYPE public.account_type AS ENUM(
  'Client',
  'Employee',
  'Admin');

-- Table structure for table `classification`
CREATE TABLE public.classification (
  classification_id INT GENERATED BY DEFAULT AS IDENTITY,
  classification_name CHARACTER VARYING NOT NULL,
  CONSTRAINT classification_pk PRIMARY KEY (classification_id)
);

-- Table structure for table `inventory`
CREATE TABLE IF NOT EXISTS public.inventory
(
    inv_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    inv_make character varying NOT NULL,
    inv_model character varying NOT NULL,
    inv_year character(4) NOT NULL,
    inv_description text NOT NULL,
    inv_image character varying NOT NULL,
    inv_thumbnail character varying NOT NULL,
    inv_price numeric(9, 0) NOT NULL,
    inv_miles integer NOT NULL,
    inv_color character varying NOT NULL,
    classification_id integer NOT NULL,
    CONSTRAINT inventory_pkey PRIMARY KEY (inv_id)
);

-- Create relationship between `classification` and `inventory` tables
ALTER TABLE IF EXISTS public.inventory
    ADD CONSTRAINT fk_classification FOREIGN KEY (classification_id)
    REFERENCES public.classification (classification_id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

-- Table structure for table `account`
CREATE TABLE IF NOT EXISTS public.account
(
    account_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    account_firstname character varying NOT NULL,
    account_lastname character varying NOT NULL,
    account_email character varying NOT NULL,
    account_password character varying NOT NULL,
    account_type account_type NOT NULL DEFAULT 'Client'::account_type,
    CONSTRAINT account_pkey PRIMARY KEY (account_id)
);

-- Data for table `classification`
INSERT INTO public.classification (classification_name)
VALUES ('Custom'),
  ('Sport'),
  ('SUV'),
  ('Truck'),
  ('Sedan');


-- Data for table `inventory`
INSERT INTO public.inventory (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
VALUES   (
    'Chevy',
    'Camaro',
    '2018',
    'If you want to look cool this is the ar you need! This car has great performance at an affordable price. Own it today!',
    '/images/camaro.jpg',
    '/images/camaro-tn.jpg',
    25000,
    101222,
    'Silver',
    2
  ), (
    'Batmobile',
    'Custom',
    '2007',
    'Ever want to be a super hero? now you can with the batmobile. This car allows you to switch to bike mode allowing you to easily maneuver through trafic during rush hour.',
    '/images/batmobile.jpg',
    '/images/batmobile-tn.jpg',
    65000,
    29887,
    'Black',
    1
  ), (
    'FBI',
    'Surveillance Van',
    '2016',
    'do you like police shows? You will feel right at home driving this van, come complete with surveillance equipments for and extra fee of $2,000 a month. ',
    '/images/survan.jpg',
    '/images/survan-tn.jpg',
    20000,
    19851,
    'Green',
    1
  ), (
    'Dog ',
    'Car',
    '1997',
    'Do you like dogs? Well this car is for you straight from the 90s from Aspen, Colorado we have the original Dog Car complete with fluffy ears.',
    '/images/dog-car.jpg',
    '/images/dog-car-tn.jpg',
    35000,
    71632,
    'Brown',
    1
  ), (
    'Jeep',
    'Wrangler',
    '2019',
    'The Jeep Wrangler is small and compact with enough power to get you where you want to go. Its great for everyday driving as well as off-roading whether that be on the the rocks or in the mud!',
    '/images/wrangler.jpg',
    '/images/wrangler-tn.jpg',
    28045,
    41205,
    'Orange',
    3
  ), (
    'Lamborghini',
    'Adventador',
    '2016',
    'This V-12 engine packs a punch in this sporty car. Make sure you wear your seatbelt and obey all traffic laws. ',
    '/images/adventador.jpg',
    '/images/adventador-tn.jpg',
    417650,
    71003,
    'Blue',
    2
  ), (
    'Aerocar International',
    'Aerocar',
    '1963',
    'Are you sick of rush-hour traffic? This car converts into an airplane to get you where you are going fast. Only 6 of these were made, get them while they last!',
    '/images/aerocar.jpg',
    '/images/aerocar-tn.jpg',
    700000,
    18956,
    'Red',
    1
  ), (
    'Monster',
    'Truck',
    '1995',
    'Most trucks are for working, this one is for fun. This beast comes with 60 inch tires giving you traction needed to jump and roll in the mud.',
    '/images/monster-truck.jpg',
    '/images/monster-truck-tn.jpg',
    150000,
    3998,
    'purple',
    1
  ), (
    'Cadillac',
    'Escalade',
    '2019',
    'This stylin car is great for any occasion from going to the beach to meeting the president. The luxurious inside makes this car a home away from home.',
    '/images/escalade.jpg',
    '/images/escalade-tn.jpg',
    75195,
    41958,
    'Black',
    4
  ), (
    'GM',
    'Hummer',
    '2016',
    'Do you have 6 kids and like to go off roading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.',
    '/images/hummer.jpg',
    '/images/hummer-tn.jpg',
    58800,
    56564,
    'Yellow',
    4
  ), (
    'Mechanic',
    'Special',
    '1964',
    'Not sure where this car came from. however with a little TLC it will run as good a new.',
    '/images/mechanic.jpg',
    '/images/mechanic-tn.jpg',
    100,
    200125,
    'Rust',
    5
  ), (
    'Ford',
    'Model T',
    '1921',
    'The Ford Model T can be a bit tricky to drive. It was the first car to be put into production. You can get it in any color you want as long as it is black.',
    '/images/model-t.jpg',
    '/images/model-t-tn.jpg',
    30000,
    26357,
    'Black',
    5
  ), (
    'Mystery',
    'Machine',
    '1999',
    'Scooby and the gang always found luck in solving their mysteries because of there 4 wheel drive Mystery Machine. This Van will help you do whatever job you are required to with a success rate of 100%.',
    '/images/mystery-van.jpg',
    '/images/mystery-van-tn.jpg',
    10000,
    128564,
    'Green',
    1
  ),
  (
    'Spartan',
    'Fire Truck',
    '2012',
    'Emergencies happen often. Be prepared with this Spartan fire truck. Comes complete with 1000 ft. of hose and a 1000 gallon tank.',
    '/images/fire-truck.jpg',
    '/images/fire-truck-tn.jpg',
    50000,
    38522,
    'Red',
    4
  ), (
    'Ford',
    'Crown Victoria',
    '2013',
    'After the police force updated their fleet these cars are now available to the public! These cars come equipped with the siren which is convenient for college students running late to class.',
    '/images/crwn-vic.jpg',
    '/images/crwn-vic-tn.jpg',
    10000,
    108247,
    'White',
    5
  );


UPDATE inventory SET inv_image=replace(inv_image,'/images','/images/vehicles'), inv_thumbnail=replace(inv_thumbnail, '/images', '/images/vehicles');
```

# Week 3: Content Delivery and the MVC Pattern

## W03: Dynamic Websites and the MVC Pattern

### The Dynamic Model

### Node-postgres Prepared Statements

### MVC Illustration

### Review: JavaScript Variables

### MVC Getting Started

#### Get Organized

```bash
mkdir -p {database,models,controllers}
touch database/index.js
touch models/inventory-model.js
touch controllers/baseController.js
```

#### Database Connection

```bash
# Add the following to your .env file
NODE_ENV='development'
# DATABASE_URL is the external URL from your render.com PostgreSQL service
DATABASE_URL='postgres://cse340:XZbnipbisMrOWDw7cZleuTn1m8A1mLrM@dpg-cop4tbe3e1ms73c8i82g-a.oregon-postgres.render.com/cse340_39d4'
```

```javascript
// Add the following to your database/index.js file
const { Pool } = require("pg")
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool
if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

// Added for troubleshooting queries
// during development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        return res
      } catch (error) {
        console.error("error in query", { text })
        throw error
      }
    },
  }
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}
```

```javascript
const pool = require("../database/")

const inventoryModel = {}

/* ***************************
 *  Get all classification data
 * ************************** */
inventoryModel.getClassifications = async function() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = inventoryModel
```

```javascript
const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController
```

#### Alter the "Index Route"

```javascript
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
```

#### Build the Utilities file and functions

```javascript
const inventoryModel = require("../models/inventoryModel")
const utilities = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
utilities.getNav = async function (req, res, next) {
  let data = await inventoryModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inventory/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

module.exports = utilities
```

#### Adjust the navigation.ejs Partial file

```html
<nav>
    <%- nav %>
</nav>
```

```css
nav a {
  color: var(--primary-background);
  text-decoration: none;
  font-size: .85rem;
  padding-top: 1em;
  padding-bottom: 1em;
}

@media only screen and (min-width: 768px) {
  nav a {
    display: inline-block;
    width: 4.5em;
    padding: .25rem 0;
    font-size: 1rem;
  }

  nav a:hover {
    color: var(--primary-text);
    background-color: var(--primary-background);
  }
}
```

#### Time to test

### Read: Understanding Data Results

### Build Inventory route, controller and model

#### Inventory Routes

```javascript
// In the routes/inventoryRoute.js file
const express = require("express")
const router = new express.Router()
const inventoryController = require("../controllers/inventoryController")

// Route to build inventory by classification view
router.get("/type/:classificationId", inventoryController.buildByClassificationId);

module.exports = router;
```

```javascript
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inventory", inventoryRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
```

```javascript
const inventoryModel = require("../models/inventoryModel")
const utilities = require("../utilities/")

const inventoryController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
inventoryController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await inventoryModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = inventoryController
```

```javascript
const pool = require("../database/")

const inventoryModel = {}

/* ***************************
 *  Get all classification data
 * ************************** */
inventoryModel.getClassifications = async function () {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
inventoryModel.getInventoryByClassificationId = async function (classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
          JOIN public.classification AS c 
          ON i.classification_id = c.classification_id 
          WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

module.exports = inventoryModel
```

```javascript
// In the utilities/index.js file
const inventoryModel = require("../models/inventoryModel")
const utilities = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
utilities.getNav = async function (req, res, next) {
  let data = await inventoryModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inventory/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
utilities.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inventory/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inventory/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

module.exports = utilities
```

### Build the classification view

#### Create the classification.ejs view

```html
<% if (title) { %>
    <h1><%= title %></h1>
<% } else {
    res.redirect('/')
} %>

<%# messages() %>

<%- grid %>
```

#### Build the CSS for the classification view

```css
#inv-display {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

#inv-display li {
  margin-bottom: .5em;
  border: 1px #ccc solid;
  list-style-type: none;
  flex: 1 1 auto;
  text-align: center;
}

#inv-display li img {
  object-fit: fill;
}

@media only screen and (min-width: 768px) {
  #inv-display {
    flex-flow: row wrap;
    justify-content: space-evenly;
  }

  #inv-display h2 {
    font-size: 1rem;
  }

  #inv-display li {
    max-width: 200px;
    flex: 1 0 auto;
    text-align: center;
    height: 250px;
    display: grid;
    border-radius: 10px;
  }

  #inv-display a {
    height: 150px;
  }

  #inv-display img {
    border-radius: 10px 10px;
  }

  #inv-display div {
    width: 100%;
    height: 100px;
  }
}
```

#### Time to test

### Deployment and Testing

#### Error Handling, Basic Error Handling

```javascript
// server.js
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inventory", inventoryRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
```

// errors/error.ejs file
```html
<% if (title) { %>
    <h1><%= title %></h1>
<% } else {
    res.redirect('/')
} %>

<%- message %>
```

#### Time to test

```text
Start up your local server and go to a URL you know does not exist (e.g. http://localhost:5500/chewbacca)
```

#### Error Handling, Robust Error Handling

```javascript
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
utilities.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
```

```javascript
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inventory", inventoryRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  if (err.status == 404) {
    message = err.message
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?"
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
```

#### Time to test

```text
In the baseController.js, comment out the getNav() call and run your server.
```

### W03 Assignment: Vehicle Detail Page

#### Create the vehicle detail route

```javascript
// In the routes/inventoryRoute.js file
const express = require("express")
const router = new express.Router()
const inventoryController = require("../controllers/inventoryController")

// Route to build inventory by classification view
router.get("/type/:classificationId", inventoryController.buildByClassificationId);

// Vehicle Detail Route
router.get("/detail/:id", utilities.handleErrors(inventoryController.buildDetail))

module.exports = router;
```

#### Create the buildDetail() function in inventoryController.js

```javascript
const inventoryModel = require("../models/inventoryModel")
const utilities = require("../utilities/")

const inventoryController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
inventoryController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await inventoryModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

inventoryController.buildDetail = async function (req, res, next) {
  const invId = req.params.id
  let vehicle = await inventoryModel.getInventoryById(invId)
  const htmlData = await utilities.buildSingleVehicleDisplay(vehicle)
  let nav = await utilities.getNav()
  const vehicleTitle =
    vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    message: null,
    htmlData,
  })
}

module.exports = inventoryController
```

#### Create the getInventoryById() function in inventoryModel.js

```javascript
const pool = require("../database/")

const inventoryModel = {}

/* ***************************
 *  Get all classification data
 * ************************** */
inventoryModel.getClassifications = async function () {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
inventoryModel.getInventoryByClassificationId = async function (classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
          JOIN public.classification AS c 
          ON i.classification_id = c.classification_id 
          WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

inventoryModel.getInventoryById = async function (invId) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    console.error(error)
  }
}

module.exports = inventoryModel
```

#### Create the buildSingleVehicleDisplay() function in utilities

```javascript
const inventoryModel = require("../models/inventoryModel")
const utilities = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
utilities.getNav = async function (req, res, next) {
  let data = await inventoryModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inventory/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
utilities.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inventory/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inventory/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
utilities.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

utilities.buildSingleVehicleDisplay = async (vehicle) => {
  let svd = '<section id="vehicle-display">'
  svd += "<div>"
  svd += '<section class="imagePrice">'
  svd +=
    "<img src='" +
    vehicle.inv_image +
    "' alt='Image of " +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    " on cse motors' id='mainImage'>"
  svd += "</section>"
  svd += '<section class="vehicleDetail">'
  svd += "<h3> " + vehicle.inv_make + " " + vehicle.inv_model + " Details</h3>"
  svd += '<ul id="vehicle-details">'
  svd +=
    "<li><h4>Price: $" +
    new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    "</h4></li>"
  svd += "<li><h4>Description:</h4> " + vehicle.inv_description + "</li>"
  svd += "<li><h4>Color:</h4> " + vehicle.inv_color + "</li>"
  svd +=
    "<li><h4>Miles:</h4> " +
    new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
    "</li>"
  svd += "</ul>"
  svd += "</section>"
  svd += "</div>"
  svd += "</section>"
  return svd
}

module.exports = utilities
```

#### Create detail.ejs view

```html
<% if (title) { %>
    <h1><%= title %></h1>
<% } else {
    res.redirect('/')
} %>

<%# // See https://attacomsian.com/blog/check-if-javascript-object-is-empty %>

<% if(Object.entries(htmlData).length > 0){ %>

    <%- htmlData %>
<% } else { %>
    <p class="notice">Sorry, no matching vehicle could be found.</p>
<% } %>

<script src="/js/script.js"></script>
```

#### Style the detail.ejs view

```css
#detail {
  display: flex;
  align-items: start;
  position: relative;
  flex-direction: column;
}

#vehicle-display img {
  max-width: 100%;
}

#vehicle-display ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

#vehicle-display li {
  margin: 0;
  padding: 1rem;
}

#vehicle-display h4 {
  display: inline-block;
  font-size: large;
  margin: 0;
  font-weight: 800;
}

#vehicle-display li:nth-child(odd) {
  background-color: #f5f5f5;
}

@media only screen and (min-width: 768px) {
  #detail #vehicle-display {
    margin: 0 0 1rem;
  }

  #vehicle-display>div {
    display: flex;
  }

  .imagePrice {
    flex: 1 0 45%;
    margin-right: 1rem;
  }

  #vehicle-display #mainImage {
    width: auto;
    object-fit: contain;
  }
}
```

#### Add the broken link to the footer.ejs

```html
<% const d = new Date()
let year = d.getFullYear() %>
<footer>
    <p class="copyright">&copy; <%= year %>, CSE 340 App</p>
    <p><a href="/inventory/broken" title="Will trigger intentional exception">Error Link</a></p>
</footer>
```

#### Create a broken route

```javascript
// In the routes/inventoryRoute.js file
// In the routes/inventoryRoute.js file
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const inventoryController = require("../controllers/inventoryController")

// Route to build inventory by classification view
router.get("/type/:classificationId", inventoryController.buildByClassificationId);

// Vehicle Detail Route
router.get("/detail/:id", utilities.handleErrors(inventoryController.buildDetail))

// Broken route
router.get("/broken", utilities.handleErrors(inventoryController.throwError))

module.exports = router;
```

```javacript
const inventoryModel = require("../models/inventoryModel")
const utilities = require("../utilities/")

const inventoryController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
inventoryController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await inventoryModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

inventoryController.buildDetail = async function (req, res, next) {
  const invId = req.params.id
  let vehicle = await inventoryModel.getInventoryById(invId)
  const htmlData = await utilities.buildSingleVehicleDisplay(vehicle)
  let nav = await utilities.getNav()
  const vehicleTitle =
    vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    message: null,
    htmlData,
  })
}

inventoryController.throwError = async function (req, res) {
  throw new Error("I am an intentional error")
}

module.exports = inventoryController
```

#### Time to test

```text
Start up the server and go to both http://localhost:5500/inventory/broken to test the 500 error and http://localhost:5500/inventory/chewbacca to test the 404 error.
```