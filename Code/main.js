import { Line, Fork, Bend, Gap, Data, New, End, Null } from "./treeblocks.js";

export default class RealBuffer
{
    constructor(textArea)
    {
        this.ref = textArea;
        this.raw = new RawBuffer(textArea);
        this.exe = new ExeBuffer(textArea);
        this.state = "EXE"; //RAW or EXE
        this.lock = "UNLOCKED";

        this.ref.addEventListener("keydown", (event) => this.keyPreRouter(event));
    }

    

    keyPreRouter(event)
    {
        console.log(Date.now());
        
        this.ref.value = this.raw.value;
        this.ref.selectionStart = this.raw.start;
        this.ref.selectionEnd = this.raw.end;

        this.keyHandler(event, () => this.keyPostRouter());
    }

    keyPostRouter()
    {
        this.lock = "UNLOCKED";

        this.raw.value = this.ref.value;
        this.raw.start = this.ref.selectionStart;
        this.raw.end = this.ref.selectionEnd;
        this.raw.update();

        this.exe.value = this.raw.value;
        this.exe.start = this.raw.start;
        this.exe.end = this.raw.end;
        this.exe.update();

        this.ref.value = this.exe.value;
        this.ref.selectionStart = this.exe.start;
        this.ref.selectionEnd = this.exe.end;

        console.log(this);

        console.log(Date.now());
    }

    keyHandler(event)
    {
        
        if(this.lock == "LOCKED")
        {
            setTimeout(() => {this.keyHandler(event, callback)}, 1);
            return;
        }

        if(event.key == "Tab")
        {
            event.preventDefault();
            if(shouldTab(this.ref.value, this.ref.selectionStart))
            {
                this.ref.value = this.ref.value.substring(0,this.ref.selectionStart) + "\t" + this.ref.value.substring(this.ref.selectionEnd);
                this.ref.selectionStart++;
                this.ref.selectionEnd++;
            }
        }
        if(event.key == "Enter")
        {
            event.preventDefault();
            var autoIndent = countCaretLeft(this.ref.value, this.ref.selectionStart);
            var spliceval = "\n";
            for(var i = 0; i < autoIndent; i++)
            {
                spliceval += "\t";
            }
            this.ref.value = this.ref.value.substring(0,this.ref.selectionStart) + spliceval + this.ref.value.substring(this.ref.selectionEnd);
            this.ref.selectionStart += spliceval.length;
            this.ref.selectionEnd += spliceval.length;
        }

        this.lock = "LOCKED";
        setTimeout(() => {this.keyPostRouter()}, 3);

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

        function countCaretLeft(string, start)
        {
            var input = string.substring(0,start);
            var lines = input.split("\n");
            var line = lines[lines.length-1];
            var count = line.match(/^\t*(\t)/gm);
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

                            function findDataDown(line, index, mainArr)
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

                            function findDataRight(line, index, mainArr)
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
            if(line < mainArr.length - 1)
            {
                result += "\n";
                //console.log("BBB");
            }
            
            
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
        this.parent = textArea;
        this.value = "";
        this.start = this.parent.selectionStart;
        this.end = this.parent.selectionEnd;
        this.state = "UNLOCKED";
    }

    writeCarrat()
    {
        this.parent.selectionStart = this.start;
        this.parent.selectionEnd = this.end;
    }

    readCarrat()
    {
        this.start = this.parent.selectionStart;
        this.end = this.parent.selectionEnd;
    }

    moveCarrat(vector)
    {
        this.start += vector;
        this.end += vector;
        this.writeCarrat();
    }

    

    update()
    {
        //do something that changes the value of this.ref.value
        this.state = "UNLOCKED";
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
        this.value = this.value.replace(/├── |│   |└── |    /gm, "\t");
        super.update();
    }

    correctCarrat()
    {
        var lead = this.tree.input.substring(0,this.start);

        //console.log("CONSIDERING >" + lead + "<");

        var correctionVector = ((countGlyphs(lead)) * 3);
        this.start = this.start - correctionVector;
        this.end = this.end - correctionVector;


        function countGlyphs(input)
        {
            var count = input.match(/├── |│   |└── |    /gm);
            //console.log(count);
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

class ExeBuffer extends VirtualBuffer
{
    constructor(textArea)
    {
        super(textArea);
        this.tree = new ProcessingTree("");
    }

    update()
    {
        this.tree.input = this.value;
        this.tree.totalParse();
        this.value = this.tree.output;
        this.correctCarrat();
        super.update();
    }

    correctCarrat()
    {
        var lead = this.tree.input.substring(0,this.start);

        //console.log("CONSIDERING >" + lead + "<");

        var correctionVector = ((countTabs(lead)) * 3);
        this.start = this.start + correctionVector;
        this.end = this.end + correctionVector;


        function countTabs(input)
        {
            var count = input.match(/\t/gm);
            //console.log(count);
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