Hi! i need to change the components for create a new two sections for create the facture:

# Objective
I want to creeate a two new secctions in dialog when create a new facture, i want what add two sections what be (first) add the data of the client and (second) add the data of the company.Therefore I need you to modify the current data system to accommodate these new sections. The new sections should allow users to input client and company information when creating a new invoice.

# Tools
Use the MCP (Use the FS) tool to navigate and get all necesary files and information to complete the task.

# Context
- `src`:  This directory contains the source code for the application.
- `components`: This directory contains the React components used in the application.
    - `Table`: This folder contains all data of the how to create a table and data
        - `columns.tsx`: This file defines the columns for the table, including the headers and data types.
        - `data-table.tsx`: This file contains the data to be displayed in the table, including the structure and sample data.
- `lib`: this directory contains utility functions and libraries used in the application.
    - `parse.ts`: this file contains functions and tools to parse the data for the application and send to the server to convert, its necessary what learn as know manage the data and render it correctly.
- `pages`: This directory contains the main pages of the application.
    - `Editor.tsx`: This file is the main editor page where users can create and edit their documents.
    - `Menu.tsx`: This file contains the menu component that allows users to navigate through the application.