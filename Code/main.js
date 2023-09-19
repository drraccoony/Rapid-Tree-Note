import { Line, Fork, Bend, Gap, Data, New, End, Null } from "./treeblocks.js";

export default class Schema
{
    constructor(textArea)
    {
        this.raw = new RawBuffer(document.getElementById("source"));
        this.exe = new ExeBuffer(document.getElementById("display"));
        this.state = "UNLOCKED";

        

        this.raw.ref.addEventListener("keydown", (event) => this.keyPreRouter(event));
        this.raw.ref.addEventListener("copy", (event) => this.handleCopy(event));

        this.raw.ref.addEventListener('scroll', (event) => this.syncScrollbars(event));
        this.raw.ref.addEventListener('paste', (event) => this.handlePaste(event));

        setInterval(() => this.keyPostRouter(), 1000);
        setInterval(() => this.syncScrollbars(), 1000);
    }

    keyPreRouter(event)
    {
        this.raw.keyHandler(event, (event) => this.keyPostRouter(event));
    }

    keyPostRouter()
    {
        this.raw.update();
        this.exe.ref.value = this.raw.ref.value;
        this.exe.tree.totalParse();
        this.exe.update();

        //console.log(this);
    }

    handlePaste(event)
    {
        setTimeout((event) => this.syncScrollbars(event), 100);
    }

    handleCopy(event)
    {
        event.preventDefault()

        //make sure that async changes like autocorrect are accounted for
        this.keyPostRouter();

        //Determine the number of tabs before the start of the selection to push the exe select forward by that times 7
        var preOffset = this.raw.ref.selectionStart;
        var preString = this.raw.ref.value.substring(0,preOffset);
        var preTabs = getTabs(preString);

        //Determine the number of tabs between the start and end of the selection to widen the exe select by that times 7
        var postOffset = this.raw.ref.selectionEnd;
        var postString = this.raw.ref.value.substring(preOffset, postOffset);
        var postTabs = getTabs(postString);
        
        //Calculate the new start and ends and pull that off the exe buffer
        var selectStart = this.raw.ref.selectionStart + (7 * preTabs);
        var selectEnd = this.raw.ref.selectionEnd + (7 * preTabs) + (7 * postTabs);
        var payload = this.exe.ref.value.substring(selectStart, selectEnd);

        //Put that value onto the clipboard
        navigator.clipboard.writeText(payload);

        function getTabs(string)
        {
            var count = string.match(/\t/gm);
            if(count != null)
            {
                count = count.length;
            }
            else
            {
                count = 0;
            }
            return count;
        }
    }

    syncScrollbars(event)
    {
        this.exe.ref.scrollTop = this.raw.ref.scrollTop;
    }
}

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
    constructor(input)
    {
        this.input = input;
        this.nodes = new Array();
        this.blocks = new Array();
        this.output = "";
    }

    toNodes()
    {
        var lines = this.input.split("\n");

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

class VirtualBuffer
{
    constructor(textArea)
    {
        this.ref = textArea;
        this.start = textArea.selectionStart;
        this.end = textArea.selectionEnd;
        this.state = "UNLOCKED";
    }

    writeCarrat()
    {
        this.ref.selectionStart = this.start;
        this.ref.selectionEnd = this.end;
    }

    readCarrat()
    {
        this.start = this.ref.selectionStart;
        this.end = this.ref.selectionEnd;
    }

    moveCarrat(vector)
    {
        this.start += vector;
        this.end += vector;
        this.writeCarrat();
    }

    countCaretLeft()
    {
        var lines = this.ref.value.substring(0, this.start).split("\n");
        var lastLine = lines[lines.length-1];
        var numTabs = lastLine.split("\t").length - 1;
        return numTabs;
    }

    keyHandler(event, callback)
    {

        
        
        if(this.state == "LOCKED")
        {
            setTimeout(() => {this.keyHandler(event, callback)}, 10);
            return;
        }

        this.readCarrat();

        if(event.key == "Tab")
        {
            event.preventDefault();
            if(shouldTab(this.ref.value, this.start))
            {
                this.ref.value = this.ref.value.substring(0,this.start) + "\t" + this.ref.value.substring(this.end);
                this.moveCarrat(1);
            }
        }
        if(event.key == "Enter")
        {
            event.preventDefault();
            if(shouldNewline(this.ref.value, this.start))
            {
                var autoIndent = this.countCaretLeft();
                this.ref.value = this.ref.value.substring(0,this.start) + "\n" + this.ref.value.substring(this.end);
                this.moveCarrat(1);
                for(var i = 0; i < autoIndent; i++)
                {
                    this.ref.value = this.ref.value.substring(0,this.start) + "\t" + this.ref.value.substring(this.end);
                    this.moveCarrat(1);
                }
            }
        }

        this.state = "LOCKED";
        setTimeout(() => {callback()}, 10);

        function shouldTab(string, start)
        {
            string = string.substring(0, start);
            var lines = string.split("\n");
            var current = lines[lines.length-1];
            var prev = "";
            if(lines.length > 1)
            {
                prev = lines[lines.length-2]
            }
            var prevChar = string.substring(start-1,start);

            var noEntombment = (prevChar == "\t" || prevChar == "\n");
            var noLeading = (countTabs(current)<=countTabs(prev));

            return (noEntombment && noLeading);

            function countTabs(input)
            {
                var count = input.match(/^\t*(\t)/gm);
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

        function shouldNewline(string, start)
        {
            var prestring = string.substring(0, start);
            var prelines = prestring.split("\n");
            var current = prelines[prelines.length-1];

            var prevLineContent = (countNonWhitespace(current) > 0);

            var totalstring = string;
            var totallines = totalstring.split("\n");
            var nextline = totallines[prelines.length];

            if(nextline == null)
            {
                nextline = "PROCEED";
            }

            var nextLineContent = (countNonWhitespace(nextline) > 0);

            var should = ((prevLineContent == true) && (nextLineContent == true));

            return (should);

            function countNonWhitespace(input)
            {
                var count = input.match(/\S/gm);
                if(count != null)
                {
                    count = count.length;
                }
                else
                {
                    count = 0;
                }
                return count;
            }
        }
    }

    update()
    {
        //do something that changes the value of this.ref.value
        this.state = "UNLOCKED";
        this.readCarrat();
    }

}


class RawBuffer extends VirtualBuffer
{
    constructor(textArea)
    {
        super(textArea);
    }

    update()
    {
        this.ref.value = this.ref.value.replace(/├────── |│       |└────── |        /gm, "\t");
        this.ref.value = this.ref.value.replace(/├── |│   |└── |    /gm, "\t");
        this.ref.value = this.ref.value.replace(/(?:\t+[\S ]+)(\t+)/gm, "\t");
        super.update();
    }
}

class ExeBuffer extends VirtualBuffer
{
    constructor(textArea)
    {
        super(textArea);
        this.tree = new ProcessingTree("");
    }

    update()
    {
        this.tree.input = this.ref.value;
        this.tree.totalParse();
        this.ref.value = this.tree.output;
        super.update();
    }
}