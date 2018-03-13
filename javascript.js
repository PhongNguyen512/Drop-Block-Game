//array for random color
var ColorName = ["red", "green", "yellow", "blue", "purple"];
//total of the same color next to selected cell
var neighbourCell = 0;
//total score
var Score = 0;
//empty array for holding cells
var arrayGrid = [];
//max column
var maxC = 0;
//max row
var maxR = 0;
//the number of selected color for random color base on level
var selectColor = 0;

window.onload = function ()
{
    //event handle for clicking 
    document.getElementById("Start").onclick = NewGame;
    //initialize a game in default level(Easy)
    NewGame();
};

// Cell Object Prototype - Constructor with row and col number of the cell
function Cell(row, col) {
    //convert row and col into number
    this.row = Number(row);
    this.col = Number(col);
    //random color
    this.color = ColorName[Math.floor(Math.random() * selectColor)];
    //boolean for highlight and alive
    this.highlight = false;
    this.alive = true;
}

function NewGame() {
    //reset initial value
    Score = 0;
    document.getElementById("labelScore").innerHTML = 0;
    document.getElementById("labelNeighbor").innerHTML = 0 + " block(s)";
    
    //check level for set max of row and col, and color
    switch (document.getElementById("Level").value)
    {
        case "easy":
            maxR = 3;
            maxC = 8;
            selectColor = 3;
            break;
        case "medium":
            maxR = 6;
            maxC = 10;
            selectColor = 4;
            break;
        case "hard":
            maxR = 10;
            maxC = 12;
            selectColor = 5;
            break;
    }
    //create 2D array
    for (var r = 0; r < maxR; r++) {
        //create an array of max column for a row
        arrayGrid[r] = new Array();

        for (var c = 0; c < maxC; c++) {
            //adding Cell in to each column
            arrayGrid[r].push(new Cell(r, c));
        }
    }
    //create table for Cell
    NewGrid();
    //bind all button
    BindGrid();
}

//Create table for Cell
function NewGrid()
{
    //create the start of the table
    //with addition class for centering the table
    var table = "<table class=Center>";

    //nested loop for creating each Cell
    for (var r = 0; r < maxR; r++)
    {
        //start a row
        table += "<tr>";

        //create Cell for each column in row
        for (var c = 0; c < maxC; c++)
        {
            table += "<td> <button type='button' class='cell'"
                    + "id='" + r + "-" + c + "'"
                    + "></td>";
        }
        //end of row
        table += "</tr>";
    }
    //end of table
    table += "</table>";

    //paste whole created table into HTML
    document.getElementById("table").innerHTML = table;
    //display table
    ShowGrid();
}

//Show all Cell
function ShowGrid()
{
    for (var r = 0; r < maxR; r++)
        for (var c = 0; c < maxC; c++)
            arrayGrid[r][c].Show();

    //display the total score from the game
    document.getElementById("labelScore").innerHTML = Number(Score);
}

//bind each Cell to button
function BindGrid()
{
    for (var r = 0; r < maxR; r++)
        for (var c = 0; c < maxC; c++)
            arrayGrid[r][c].Bind();
}

//display a Cell
Cell.prototype.Show = function () {
    //get the location of the Cell
    var Cell = this.row + "-" + this.col;

    //if Cell still survive through the STORM
    if (this.alive)
    {
        //set the background by the color of its from constructor
        document.getElementById(Cell).style.backgroundColor = this.color;

        if (this.highlight)
            document.getElementById(Cell).style.border = "3px solid lightblue";
        else
            document.getElementById(Cell).style.border = "3px solid black";
    }
    //if Cell dead
    else
    {
        document.getElementById(Cell).style.backgroundColor = "white";
        document.getElementById(Cell).style.border = "3px solid white";
    }
};

//handle some mouse event handle - over, out, and click
Cell.prototype.Bind = function () {
    //local variable for holding row and col
    var row = this.row;
    var col = this.col;

    //name of Cell for easy call
    var ID = row + "-" + col;

    //mouse event for highlighting matching colors
    document.getElementById(ID).onmouseover = function () {
        //run a Check() with current location and color
        //for finding its matching friends in lonely nights
        Check(row, col, this.style.backgroundColor);

        //display how many found
        document.getElementById("labelNeighbor").innerHTML = neighbourCell + " block(s)";

        //display highlight Cells
        ShowGrid();
    };
    //mouse event for unhighlighting Cell
    document.getElementById(ID).onmouseout = MouseOut;

    //mouse event for assassinating all matching color
    document.getElementById(ID).onclick = MouseClick;
};

//Mouse event for unhighlighting Cell
function MouseOut() {
    //reset neighbour count
    neighbourCell = 0;
    document.getElementById("labelNeighbor").innerHTML = neighbourCell + " block(s)";

    for (var r = 0; r < maxR; r++)
        for (var c = 0; c < maxC; c++) {
            if (arrayGrid[r][c].highlight)
                arrayGrid[r][c].highlight = false;
        }
    ShowGrid();
}

function MouseClick() {
    //count for killed Cell
    var found = 0;

    for (var r = 0; r < maxR; r++)
        for (var c = 0; c < maxC; c++) {
            //check if Cell is alive and is hovering
            if (arrayGrid[r][c].highlight && arrayGrid[r][c].alive) {
                found++;
                //kill it and turn the light off
                arrayGrid[r][c].alive = arrayGrid[r][c].highlight = false;
            }
        }

    //update the score by the total killed
    //I love Simple
    Score += found;

    //Droppppping down the alive Cell
    Drop();
    //Shiftttting left the alive Cell
    ShiftLeft();
    ShowGrid();

    //Display string when finish game
    if (!arrayGrid[maxR - 1][0].alive)
        document.getElementById("status").innerHTML
                = "Won! Click 'Start Game' to play again";
}

//drop down alive Cell
function Drop() {
    //count for how many drop down
    var totalDrop = 0;

    for (var row = 0; row < maxR; row++)
    {
        for (var col = 0; col < maxC; col++)
        {
            //if Cell still Breath
            if (!arrayGrid[row][col].alive)
            {
                if (row > 0)
                    //if the above Cell still Breath
                    if (arrayGrid[row - 1][col].alive)
                    {
                        //replace the current and above
                        arrayGrid[row][col].Move(arrayGrid[row - 1][col]);

                        totalDrop++;
                    }
            }
        }
    }
    //if something drop down
    //do again for make sure nothing can be dropped down
    if (totalDrop > 0)
        return Drop();

}

//using for assign the above Cell's color and alive state to the Cell below it
Cell.prototype.Move = function (other)
{
    this.alive = other.alive;
    this.color = other.color;
    other.alive = false;
};

//function move all columns to the left when there is a gap in table
function ShiftLeft()
{
    do {
        //local variable for doing checking
        var bool = false;
        var tempC = 0;

        for (var c = 0; c < maxC - 1; c++) {
            //if the Cell on the lowest row is DEAD
            if (!arrayGrid[maxR - 1][c].alive)
            {
                //assigning the column into Temp column for checking later
                if (tempC === 0)
                    tempC = c;

                //shift entire column over to the left
                for (var r = 0; r < maxR; r++) {
                    arrayGrid[r][c].Move(arrayGrid[r][c + 1]);
                }

                //checking the column next to the shifted column
                if (arrayGrid[maxR - 1][tempC + 1].alive)
                    bool = true;

            }
        }
        //run until no gap between columns
    } while (bool);
}

//method for checking match color around a Cell
function Check(row, col, Color) {
    //stop when column or row out of bounds
    if (col < 0 || col >= maxC || row < 0 || row >= maxR)
        return 0;

    //if Cell id Dead 
    //OR color of selected and other Cell are not matched
    //OR its highlight already
    if (!arrayGrid[row][col].alive
            || (arrayGrid[row][col].color !== Color)
            || arrayGrid[row][col].highlight)
        return 0;
    else {
        //highlight it first
        arrayGrid[row][col].highlight = true;

        //updating found neighbour
        neighbourCell++;

        //recursively check all Cell of all directions
        Check(row - 1, col, Color);
        Check(row, col - 1, Color);
        Check(row + 1, col, Color);
        Check(row, col + 1, Color);
    }
}