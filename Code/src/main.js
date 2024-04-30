/**
Copyright 2023, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is avalible at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

import { Line, Fork, Bend, Gap, Data, New, End, Null } from "./treeblocks.js";
import "./markdown.js";
import Markdown from "./markdown.js";
import { URIMannager } from "./URI-mannager.js";

/* The Schema class is a container that handles user input, generates a formatted document, and
synchronizes scrollbars. */
export default class Schema
{
    /**
     * The constructor function initializes a coding assistant object with input and output text areas,
     * sets event listeners for keydown, copy, scroll, and paste events, and sets intervals for key
     * post routing and scrollbar synchronization.
     * 
     * @param inputPre The inputPre parameter is the text area element where the user can
     * input their text. It is used to capture the user's input and handle events such as keydown,
     * copy, scroll, and paste.
     * @param outputPre The outputPre parameter is the text area element where the generated
     * document will be displayed. It is not directly accessible to the user.
     */
    constructor(inputPre, outputPre)
    {
        //static config
        this.maxURLLength = 8192;
        //this.marker = new Markdown();
        this.uri = new URIMannager();
        window.main = this;
        
        //var urlData = this.pullURL();

        {
            this.raw = new RawBuffer(inputPre);
            this.exe = new ExeBuffer(outputPre);
            this.state = "UNLOCKED";
        }

        {
            this.raw.ref.addEventListener("input", () => this.keyPostRouter());
            this.raw.ref.addEventListener("keydown", (event) => this.keyPreRouter(event));
            this.raw.ref.addEventListener("copy", (event) => this.handleCopy(event));
        }

        {
            this.raw.ref.addEventListener('scroll', (event) => this.syncScrollbars(event));
            this.raw.ref.addEventListener('paste', (event) => this.handlePaste(event));
        }

        {
            //this.intervalUpdater = setInterval(() => this.intervalUpdate(), 1000);
            this.focused = true;
            document.addEventListener("visibilitychange", (event) => this.focusToggle(event));
        }

        window.addEventListener('beforeunload', (event) => this.safeShutdown(event));

        //force inital values
        //this.setURL(urlData);
        this.keyPostRouter();

        //update the URL Title
        //if(urlData != "" && urlData != null)
        //{
        //    document.title = this.exe.textContent.split("\n")[0].substring(0,32);
        //}

        //setInterval(() => {
        //    console.log(this.raw.textContent);
        //}, 1000);

    }

    /**
     * The function "safeShutdown" clears all interval IDs stored in the "intervalIDs" array.
     * @param event - A dummy event associated with the 'beforeunload' event. Its values are not used.
     * This is necessary to avoid browser hanging in some edge cases.
     */
    safeShutdown(event)
    {
        clearInterval(this.intervalUpdater);
        console.log("RTN Safe Shutdown Complete.");
    }

    /**
     * The function toggles the value of the "focused" variable based on the visibility state of the
     * document.
     * @param event - The event parameter is the event object that is passed to the function when it is
     * called. It contains information about the event that triggered the function, such as the type of
     * event, the target element, and any additional data associated with the event. NOT USED
     */
    focusToggle(event)
    {
        this.focused = !this.focused;
        if (document.visibilityState === 'hidden') 
        {
            this.focused = false;
        } 
        else if (document.visibilityState === 'visible') 
        {
            this.focused = true;
        }
    }

    /**
     * The function `intervalUpdate()` checks if the page is focused and performs certain actions if it
     * is. These actions keep the page looking clean up-to-date.
     */
    intervalUpdate()
    {
        if(this.focused)
        {
            //stuff here is done once every 1000ms, regardless of program state
            this.keyPostRouter();
        }
    }

    /**
     * This function is called every time a key is pressed
     * The function generates a random number between 0 and 8192 and sets it as the value of
     * "shouldEncode", then it calls the "urlPostEncodeOnIdle" function after one second with the generated
     * number as an argument.
     * If this function hasn't been called in the last 1000ms, the value of this.shouldEncode will be the same as
     * the this.urlPostEncodeOnIdle parameter was set as
     */
    urlPreEncodeOnIdle()
    {
        const min = 0;
        const max = 8192;
        const randomDecimalInRange = Math.random() * (max - min) + min;

        this.shouldEncode = randomDecimalInRange;

        //console.log("random idle value was " + randomDecimalInRange);

        setTimeout(() => this.urlPostEncodeOnIdle(randomDecimalInRange), 1000);
     
    }

    /**
     * The function `urlPostEncodeOnIdle` checks if `shouldEncode` is still equal to `staticOldValue` and if
     * so, it calls the `pushURL` function. This will only be the case if this.urlPreEncodeOnIdle hasn't
     * been called within the last 1000ms.
     * @param staticOldValue - The value of the staticOldValue parameter is a variable that represents
     * the previous value of the variable.
     */
    urlPostEncodeOnIdle(staticOldValue)
    {
        this.markdownParse();
        if(this.shouldEncode == staticOldValue)
        {
            //this.pushURL();
        }
       
    }

    /**
     * The function `pullURL()` extracts and decodes the URL parameter "data", converts it from hexadecimal to
     * base 10, inflates it using the pako library, and returns the result as a string.
     * @returns the decoded and decompressed URL as a string.
     */
    pullURL()
    {
        return this.uri.pull();
    }

    /**
     * The function `setURL` sets the value of a text input field to the provided data, or a default
     * value if the data is empty.
     * @param data - The `data` parameter is a string that represents the URL that needs to be set.
     */
    setURL(data)
    {
        if(data != "")
        {
            this.raw.textContent = data;
        }
        else
        {
            this.raw.textContent = "Rapid Tree Notetaker\n\tWhat is this?\n\t\tThe Rapid Tree Notetaker (RTN) is a notetaking tool developed by computer science student Brendan Rood at the University of Minnesota Duluth.\n\t\tIt aims to provide an easy way to take notes formatted similar to a Reddit thread, with indentation following a tree-like structure allowing for grouping.\n\t\tIt also prioritizes ease of sharing, as the URL can be shared to instantly communicate the note's contents.\n\t\tIt is free to use and will never ask you to log in.\n\tSample\n\t\tEdit this text\n\t\tto generate\n\t\t\ta\n\t\t\tdocument\n\t\tformatted\n\t\t\tlike a tree!\n\tMisc. Instructions\n\t\tIndentation\n\t\t\tUse TAB to indent\n\t\t\tSupports block indentation editing\n\t\tLimited Markdown Support\n\t\t\t%!𝗬𝗼𝘂 𝗰𝗮𝗻 𝘄𝗿𝗮𝗽 𝘁𝗲𝘅𝘁 𝘄𝗶𝘁𝗵 𝗽𝗲𝗿𝗰𝗲𝗻𝘁 𝗲𝘅𝗰𝗹𝗮𝗺𝗮𝘁𝗶𝗼𝗻 𝗽𝗼𝗶𝗻𝘁𝘀 𝘁𝗼 𝗺𝗮𝗸𝗲 𝗶𝘁 𝗯𝗼𝗹𝗱%!\n\t\t\t%*𝘠𝘰𝘶 𝘤𝘢𝘯 𝘸𝘳𝘢𝘱 𝘵𝘦𝘹𝘵 𝘸𝘪𝘵𝘩 𝘱𝘦𝘳𝘤𝘦𝘯𝘵 𝘢𝘴𝘵𝘦𝘳𝘪𝘴𝘬𝘴 𝘵𝘰 𝘮𝘢𝘬𝘦 𝘪𝘵 𝘪𝘵𝘢𝘭𝘪𝘤%*\n\t\t\t%~̶Y̶o̶u̶ ̶c̶a̶n̶ ̶w̶r̶a̶p̶ ̶t̶e̶x̶t̶ ̶w̶i̶t̶h̶ ̶p̶e̶r̶c̶e̶n̶t̶ ̶t̶i̶l̶d̶e̶s̶ ̶t̶o̶ ̶s̶t̶r̶i̶k̶e̶ ̶i̶t̶ ̶t̶h̶r̶o̶u̶g̶h%~";
        }
    }

    /**
     * The function `pushURL()` compresses a string with the pako library, converts it to hexadecimal, encodes it, and
     * updates the URL with the encoded data.
     */
    pushURL()
    {
        var payload = this.exe.textContent.substring(0,this.exe.textContent.length-1);
        this.uri.push(payload);

        document.title = this.exe.textContent.split("\n")[0].substring(0,32);
        
    }

    /**
     * The function "keyPreRouter" is a member of the RawBuffer "raw" that handles key events and passes them to
     * another function called "keyPostRouter".
     * @param event - The event parameter is an object that represents the keyboard event that
     * occurred. It contains information about the key that was pressed, such as the key code, key
     * name, and any modifiers that were pressed (e.g., shift, alt, ctrl).
     */
    keyPreRouter(event)
    {
        this.raw.keyHandler(event, (event) => this.keyPostRouter(event));
        this.urlPreEncodeOnIdle();
    }

    /**
     * The function `keyPostRouter()` updates and parses the data from RawBuffer "raw" before updating ExecutiveBuffer "exe".
     */
    keyPostRouter()
    {
        this.raw.update();
        this.exe.ref.innerHTML = this.raw.ref.innerHTML;
        this.exe.update();
        this.exe.tree.totalParse();
    }

    markdownParse()
    {
        return;
        this.raw.readCarrat();
        var hold_start = this.raw.start;
        var hold_end = this.raw.end;

        {//revert everything to basic
            this.raw.textContent = this.marker.removeBold(this.raw.textContent);
            this.raw.textContent = this.marker.removeItalic(this.raw.textContent);
            this.raw.textContent = this.marker.removeStrikethrough(this.raw.textContent);
        }

        {//bold what is needed
            if(countCharOccurances(this.raw.textContent, "\%\!") > 0) //bypass this logic if it is unneeded
            {
                var lines = this.raw.textContent.split("\n");
                var result = "";
                for(var i = 0; i < lines.length; i++)
                {
                    var line = lines[i];
                    var components = line.split("\%\!");
                    for(var j = 0; j < components.length; j++)
                    {
                        // Check if the component should be bold
                        if((j % 2 == 1) && (components.length-1 > j))
                        {
                            // Apply bold to the component
                            components[j] = this.marker.addBold(components[j]);
                        }
                        // Reconstruct the line with bold applied where necessary
                        result += components[j];
                        // Add the "%!" back to the result, except for the last component of each line
                        if(j < components.length - 1)
                        {
                            result += "\%\!";
                        }
                    }
                    // Add a newline character after each line, except for the last line
                    if(i < lines.length - 1)
                    {
                        result += "\n";
                    }
                }
                // Ensure the result does not end with a newline character if the original text did not
                if(this.raw.textContent.endsWith("\n") && !result.endsWith("\n"))
                {
                    result = result.substring(0, result.length-1);
                }
                this.raw.textContent = result;
            }
        }

        {//italicise what is needed
            if(countCharOccurances(this.raw.textContent, "\%\*") > 0) //bypass this logic if it is unneeded
            {
                var lines = this.raw.textContent.split("\n");
                var result = "";
                for(var i = 0; i < lines.length; i++)
                {
                    var line = lines[i];
                    var components = line.split("\%\*");
                    for(var j = 0; j < components.length; j++)
                    {
                        // Check if the component should be italics
                        if((j % 2 == 1) && (components.length-1 > j))
                        {
                            // Apply italics to the component
                            components[j] = this.marker.addItalic(components[j]);
                        }
                        // Reconstruct the line with italics applied where necessary
                        result += components[j];
                        // Add the "%*" back to the result, except for the last component of each line
                        if(j < components.length - 1)
                        {
                            result += "\%\*";
                        }
                    }
                    // Add a newline character after each line, except for the last line
                    if(i < lines.length - 1)
                    {
                        result += "\n";
                    }
                }
                // Ensure the result does not end with a newline character if the original text did not
                if(this.raw.textContent.endsWith("\n") && !result.endsWith("\n"))
                {
                    result = result.substring(0, result.length-1);
                }
                this.raw.textContent = result;
            }
        }

        {//strikethough what is needed
            if(countCharOccurances(this.raw.textContent, "\%\~") > 0) //bypass this logic if it is unneeded
            {
                var lines = this.raw.textContent.split("\n");
                var result = "";
                for(var i = 0; i < lines.length; i++)
                {
                    var line = lines[i];
                    var components = line.split("\%\~");
                    for(var j = 0; j < components.length; j++)
                    {
                        // Check if the component should be strikethrough
                        if((j % 2 == 1) && (components.length-1 > j))
                        {
                            // Apply strikethrough to the component
                            components[j] = this.marker.addStrikethough(components[j]);
                        }
                        // Reconstruct the line with strikethrough applied where necessary
                        result += components[j];
                        // Add the "%~" back to the result, except for the last component of each line
                        if(j < components.length - 1)
                        {
                            result += "\%\~";
                        }
                    }
                    // Add a newline character after each line, except for the last line
                    if(i < lines.length - 1)
                    {
                        result += "\n";
                    }
                }
                // Ensure the result does not end with a newline character if the original text did not
                if(this.raw.textContent.endsWith("\n") && !result.endsWith("\n"))
                {
                    result = result.substring(0, result.length-1);
                }
                this.raw.textContent = result;
            }
        }

        this.keyPostRouter();

        this.raw.start = hold_start;
        this.raw.end = hold_end;
        this.raw.writeCarrat();

        function countCharOccurances(inputString, searchfor)
        {
            const regex = new RegExp("\\" + searchfor, 'g');
            const matches = inputString.match(regex);
            return matches ? matches.length : 0;
        }

    }

    /**
     * The handlePaste function sets a timeout to call syncronize the scrollbars after 100
     * milliseconds.
     * 
     * @param event The event parameter is an object that represents the event that triggered the
     * handlePaste function. It contains information about the event, such as the type of event, the
     * target element, and any additional data associated with the event.
     */
    handlePaste(event)
    {
        setTimeout(() => //do misc glyph replacement for forward conversion to zero-width-deliminated glyphs
        {
            this.raw.textContent = this.raw.textContent.replace(/├────── |│       |└────── |        /gm, "\t"); //size 8 glyphs
            this.raw.textContent = this.raw.textContent.replace(/├── |│   |└── |    /gm, "\t"); //size 4 glyphs
        }, 100);
    }

    /**
     * The `handleCopy` function in JavaScript handles copying selected text from a Pre to the
     * clipboard, accounting for tab indentation.
     * 
     * @param event The event parameter is an object that represents the event that triggered the copy
     * action. It contains information about the event, such as the target element and any additional
     * data associated with the event. In this case, it is used to prevent the default copy behavior.
     */
    handleCopy(event)
    {
        //make sure that async changes like autocorrect are accounted for
        this.keyPostRouter();

        //after 10 ms, adjust the clipboard
        setTimeout(async function(){
            var payload = await navigator.clipboard.readText();
            payload = payload.replace(/├────── ​/gm, "├── ​");
            payload = payload.replace(/└────── ​/gm, "└── ​");
            payload = payload.replace(/│       ​/gm, "│   ​");
            payload = payload.replace(/        ​/gm, "    ​");
            navigator.clipboard.writeText(payload);
        }, 10);
    }
}

/* The LevelNode class represents a node in a tree structure with a level and a value. */
class LevelNode
{
    constructor(level, value)
    {
        this.level = level;
        this.value = value;
    }
}

class ProcessingTree
{
    /**
     * The constructor function initializes the input, nodes, blocks, and output properties.
     * 
     * @param input The `input` parameter is the input data that will be used in the constructor. It
     * can be any type of data, such as a string, number, array, or object.
     */
    constructor(input)
    {
        this.input = input;
        this.nodes = new Array();
        this.blocks = new Array();
        this.output = "";
    }

    /**
     * The `toNodes()` function takes an input string and converts it into an array of `LevelNode`
     * objects, where each object represents a line of data (tabs removed) with its corresponding indentation level.
     */
    toNodes()
    {
        const regex = /<div>.*?<\/div>/g;
        const matches = [...this.input.matchAll(regex)];
        var lines = matches.map(match => match[0]);

        for(var i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace(/\<\/?div\>/g, "");
            lines[i] = lines[i].replace(/\<br\>/g, "");
        }

        for(var line of lines)
        {
            var level = getIndentLevel(line);
            line = unindent(line);
            this.nodes.push(new LevelNode(level, line));
        }

        function unindent(input)
        {
            var result = input;
            result = result.replaceAll(/\t/g, "");
            return result;
        }

        function getIndentLevel(string)
        {
            var count = string.match(/^\t*(\t)/gm);
            if(count != null)
            {
                count = count[0].length;
            }
            else
            {
                count = 0;
            }
            return count;
        }
    }

    /**
     * The function converts JavaScript code into a treeblock-based representation.
     * If it produces an array of arrays, where each sub-array's content equals N "New" blocks followed by one "End"/"Data" block.
     */
    toBlocks()
    {
        for(var node of this.nodes)
        {
            var blockLine = new Array();
            for(var i = 0; i < node.level; i++)
            {
                blockLine.push(new New());
            }
            if(node.value == "")
            {
                blockLine.push(new End());
            }
            else
            {
                blockLine.push(new Data(node.value));
            }
            this.blocks.push(blockLine);
        }
    }

    /**
     * The function `parseNewBlocks()` iterates over a 2D array of blocks and converts blocks of type
     * "New" to other non-Data, non-End types based on certain conditions.
     */
    parseNewBlocks()
    {
        //convert var name to handle migration
        var mainArr = this.blocks;

        //iterate over block array to convert type "New" to other non-Data, non-End types
        for(var line = 0; line < mainArr.length; line++)
        {
            for(var index = 0; index < mainArr[line].length; index++)
            {
                var solution = "";
                //Data
                if(solution == "")
                {
                    if(access(line,index,mainArr) == "Data")
                    {
                        solution = "Data";
                    }
                }
                //Bend
                if(solution == "")
                {
                    var shouldBend = null;
                    var rightIsData = access(line,index+1,mainArr)=="Data";
                    if(rightIsData)
                    {
                        if(access(line+1,index,mainArr) == "Null" || access(line+1,index,mainArr) == "Data")
                        {
                            shouldBend = true;
                        }
                        if(shouldBend == null)
                        {
                            var downDistanceToData = findDataDown(line,index,mainArr);
                            var rightDistanceToData = findDataRight(line,index,mainArr);

                            //console.log(line, index, downDistanceToData, rightDistanceToData);

                            if(downDistanceToData <= rightDistanceToData)
                            {
                                shouldBend = true;
                            }
                            else
                            {
                                shouldBend = false;
                            }

                            function findDataDown(line, index, mainArr) //look down until EOF or Data is found
                            {
                                //console.log("D", line, index, mainArr);
                                var distance = 0;
                                while(line < mainArr.length)
                                {
                                    //console.log("D", line, index);
                                    if(line+1 > mainArr.length - 1)
                                    {
                                        return distance;
                                    }
                                    var holder = access(line+1,index,mainArr);
                                    if(holder == "Data" || holder == "Null")
                                    {
                                        return distance;
                                    }
                                    distance++;
                                    line++;
                                }
                                return distance;
                            }

                            function findDataRight(line, index, mainArr) //Look down from the block to the right until EOF or Data is found
                            {
                                //console.log("R", line, index, mainArr);
                                var distance = 0;
                                while(line < mainArr.length)
                                {
                                    //console.log("D", line, index);
                                    if(line+1 > mainArr.length - 1)
                                    {
                                        return distance;
                                    }
                                    var holder = access(line+1,index+1,mainArr);
                                    if(holder == "Data" || holder == "Null")
                                    {
                                        return distance;
                                    }
                                    distance++;
                                    line++;
                                }
                                return distance;
                            }
                        }
                    }
                    if(shouldBend)
                    {
                        mainArr[line][index] = new Bend();
                        solution = "Fork";
                    }
                }
                //Fork
                if(solution == "")
                {
                    if(access(line,index+1,mainArr)=="Data")
                    {
                        mainArr[line][index] = new Fork();
                        solution = "Fork";
                    }
                }
                //Gap
                if(solution == "")
                {
                    if((access(line-1,index,mainArr)=="Gap" || access(line-1,index,mainArr)=="Bend"))
                    {
                        mainArr[line][index] = new Gap();
                        solution = "Gap";
                    }
                }
                //Line
                if(solution == "")
                {
                    if((access(line-1,index,mainArr)=="Line" || access(line-1,index,mainArr)=="Fork"))
                    {
                        mainArr[line][index] = new Line();
                        solution = "Line";
                    }
                }
            }
        }

        this.blocks = mainArr;

        /**
         * The function "access" checks if a given row and index are within the bounds of a 2D array
         * and returns the type of the element at that position if it is.
         * 
         * @param row The row parameter represents the row index in the mainArr array.
         * @param index The index parameter represents the column index of the element you want to
         * access in the 2D array.
         * @param mainArr The mainArr parameter is an array of arrays. Each inner array represents a
         * row in a table or grid.
         * @return the type of the element at the specified row and index in the mainArr, or "Null".
         */
        function access(row,index,mainArr)
        {
            //console.log(row, index, mainArr);
            if(row < 0 || index < 0)
            {
                return "Null";
            }
            if(mainArr.length - 1 < row)
            {
                return "Null";
            }
            if(mainArr[row].length - 1 < index)
            {
                return "Null";
            }
            return mainArr[row][index].type;
        }
    }

    /**
     * The `toString()` function assembles a string by concatenating the data from each block in the
     * `mainArr` array, separated by new lines.
     */
    toString()
    {
        //assemble a string
        var result = "";
        var mainArr = this.blocks;
        for(var line = 0; line < mainArr.length; line++)
        {
            for(var index = 0; index < mainArr[line].length; index++)
            {
                result += mainArr[line][index].data;
            }
            result += "\n";
        }

        this.output = result;
    }

    /**
     * The function `totalParse()` converts input into nodes, then into blocks, parses new blocks, and
     * finally converts the result into a string. That final string is written to this.output.
     */
    totalParse()
    {
        this.nodes = new Array();
        this.blocks = new Array();
        this.output = "";

        this.toNodes();
        this.toBlocks();
        this.parseNewBlocks();
        this.toString();

        //console.log(this);
    }
}

/* The VirtualBuffer class is a JavaScript class that provides methods for handling text input in a
Pre element, including tab and newline functionality. */
class VirtualBuffer
{
    /**
     * The constructor function initializes a Pre object with properties for the reference, carrat start,
     * and carrat end positions of the selection, and the state of the object.
     * 
     * @param Pre The `Pre` parameter is the reference to the HTML Pre element that you
     * want to work with. It is used to access and manipulate the text content and selection of the
     * Pre.
     */
    constructor(Pre)
    {
        this.ref = Pre;
        this.start = 0;
        this.end = 0;
        this.state = "UNLOCKED";
        this.ref.innerHTML = "<div>DEFAULT<br></div>";
    }

    /**
     * The `keyHandler` function in JavaScript handles key events, such as pressing the Tab or Enter
     * key, and performs specific actions based on the current state and caret position in a text input
     * field.
     * @param event - The `event` parameter is an object that represents the keyboard event that
     * occurred. It contains information about the key that was pressed, such as the key code and key
     * value.
     * @param callback - The `callback` parameter is a function that will be called after processing
     * the key event. It is used to handle any additional logic or actions that need to be performed
     * after processing the key event.
     * @returns The function `keyHandler` does not explicitly return a value, but functionally returns by
     * executing its callaback after 10ms
     */
    keyHandler(event, callback)
    {
        /* The below code is checking the value of the "state" property. If the value is "LOCKED", it
        sets a timeout of 10 milliseconds and calls this function with the provided
        event and callback parameters, effectively processing the command later if it can't currently be done. */
        if(this.state == "LOCKED")
        {
            setTimeout(function() {
                this.keyHandler(event, callback);
            }.bind(this), 10);
            return;
        }

        /* The below code is checking if the key pressed is the "Tab" key. If it is, it prevents the
        default behavior of the tab key (which is to move focus to the next element) and insets a "\t"
        at the appropriate position if shouldTab() returns true. */
        if(event.key == "Tab")
        {
            event.preventDefault();

            // Get the current selection
            var selection = window.getSelection();
            var range = selection.getRangeAt(0);

            // Create a new text node with a tab character
            var tabNode = document.createTextNode("\t");

            // Insert the tab character at the start of the selection
            range.insertNode(tabNode);

            // Move the cursor to the right of the inserted tab character
            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        this.state = "LOCKED";
        setTimeout(() => {callback()}, 10);

    }

    /**
     * The update function changes the value of this.ref.textContent, sets the state to "UNLOCKED", and calls
     * the readCarrat function.
     */
    update()
    {
        //do something that changes the value of this.ref.textContent
        this.state = "UNLOCKED";
    }

}


/* The `RawBuffer` class extends the `VirtualBuffer` class and overrides the `update()` function to
* replace specific glyphs with tabs and then calls the parent class's `update()` function.
* It is used as the data processor for the "source" Pre. */
class RawBuffer extends VirtualBuffer
{
    constructor(Pre)
    {
        super(Pre);
    }

    /**
     * The `update()` function replaces glyphs of length 8 and 4 in a string with tabs, removes interal tabs, and then calls the
     * `update()` function of the parent class.
     */
    update()
    {
        //this.ref.textContent = this.ref.textContent.replace(/[└├│─ ]*​/gm, "\t");
        //this.ref.textContent = this.ref.textContent.replace(/(?:\t+[\S ]+)(\t+)/gm, "\t");
        super.update();
    }
}

/* The `ExeBuffer` class extends the `VirtualBuffer` class and provides a way to update the input value
of a tree object, parse it, and update the output value. It is used for the "display" Pre. */
class ExeBuffer extends VirtualBuffer
{
    constructor(Pre)
    {
        super(Pre);
        this.tree = new ProcessingTree("");
    }

    /**
     * The `update()` function updates the input value of a tree object, parses it, and updates the
     * output value.
     */
    update()
    {
        this.tree.input = this.ref.innerHTML;
        this.tree.totalParse();
        this.ref.innerHTML = this.tree.output;
        super.update();
    }
}
