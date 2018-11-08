# Food Tracker

#### A daily food tracking app that allows users to add food consumed and track protein consumption

#### By Katrina Hockman, Tavish O'Keefe, Ralph Perdomo, Devin Sweeting. November 2018

## Description

A food tracking app that allows user to manually enter food they consumed or search the [USDA Food Composition Databases](https://ndb.nal.usda.gov/ndb/search/list) to quickly track food.

## Setup/Installation Requirements

* clone this repository using `git clone https://github.com/pseudoralph/food-tracker`
* navigate to the downloaded repo
* launch `index.html` in a browser of your choice

Alternatively, this site can be viewed at [https://pseudoralph.github.io/food-tracker/](https://pseudoralph.github.io/food-tracker/)



## Technologies Used

HTML, CSS, JS and jQuery

## Specifications
* It should let the user search for a food item
  * Input: "pizza"
  * Expected output: Will display results of food containing "pizza" in its name
* It should let the user select a food item from the search results
  * Input: Click "pizza"
  * Expected output: Will populate form fields with USDA-linked data
* It should let the modify USDA-populated fields
  * Input: 400 in Calories form field
  * Expected output: Will keep user's modified value
* It should let the user manually add a food
  * Input: Values entered in form
  * Expected output: Will retain user's values
* It should add text entered in form fields into food log
  * Action: Clicking 'add to food log'
  * Result: Will add food name to 'daily food log section'
* It should show food details (ex: calories, protein) upon food log item  'click'
  * Action: Click food name in food log
  * Result: Populate nutrition data with foods Values
* It should allow user to 'favorite' a food
  * Action: Click favorite button in nutrition panel
  * Result: Will add food to Favorite Foods panel
* It should allow user to remove a food
  * Action: Click delete button in nutrition panel
  * Result: Will  remove food from daily food log
* It should allow user to add food from Favorite Foods panel
  * Action: Click food name in Favorite Foods panel
  * Result: Food item added to daily food log
* It will add nutritional value to daily progress indicator
  * Action: Food items with 50g Protein
  * Result: Protein daily progress = 100%
* It will delete nutritional value when food item is subtracted
  * Action: Delete food item with 25g Protein
  * Result: Protein daily progress = 50%
* It will update servings size
  * Action: Click on +/- will increase/decrease serving Size
  * Expected output: serving size will increment/decrement by one unit

---

### License

MIT License

Copyright (c) 2018, Katrina Hockman, Tavish O'Keefe, Ralph Perdomo, Devin Sweeting

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
