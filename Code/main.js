import { Line, Fork, Bend, Gap, Data, New, End, Null } from "./treeblocks.js";

export default class Schema
{
    constructor(textArea)
    {
        this.real = new RealBuffer(textArea);

        textArea.addEventListener("keydown", (event) => {this.real.keyHandler(event)});
    }
}

export class Tree
{
    constructor()
    {
        this.nodes = new Array();
    }

    push(line)
    {
        var level = getNumTabs(line);
        var data = removeTabs(line);

        this.nodes.push(new Node(data, level));

        //console.log(this);

        
        function removeTabs(input)
        {
            return input.replaceAll(/\t/g, "");
        }

        function getNumTabs(input)
        {
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

    format()
    {
        var mainArr = new Array();
        for(var node of this.nodes)
        {
            var holder = new Array();
            for(var i = 0; i < node.level; i++)
            {
                holder.push(new New());
            }
            if(node.value == "")
            {
                holder.push(new End());
            }
            else
            {
                holder.push(new Data(node.value));
            }
            mainArr.push(holder);
        }

        
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
                    /**
                    var rightIsData = access(line,index+1,mainArr)=="Data";
                    if(rightIsData)
                    {
                        var shouldBend = false;
                        var lock = false;
                        var offset = 0;
                        var holder;
                        var leftData;
                        var downData;
                        console.log(mainArr);

                        if(access(line+1,i,mainArr) == "Data")
                        {
                            shouldBend = true;
                            lock = true;
                        }

                        while(!lock)
                        {
                            console.log("QUERT" + access(line+offset+1,index,mainArr));
                            if(access(line+offset+1,index,mainArr) == "Null")
                            {
                                leftData = false;
                                downData = false;
                                lock = true;
                                shouldBend = true;
                                console.log("exiting early");
                            }

                            else
                            {
                                console.log("slicing line " + (line+offset) + " from 0 to " + (index-1));
                                console.log("from context of " + line + "," + index);
                                holder = mainArr[line+offset].slice(0,index-1);
                                console.log(holder);
                                leftData = holder.includes("Data");
                                downData = access(line + offset, index + 1, mainArr) == "Data";
                            }
                            
                            if(!leftData && !downData)
                            {
                                offset++;
                                console.log("A");
                            }
                            if(!leftData && downData)
                            {
                                shouldBend = false;
                                lock = true;
                                console.log("B");
                            }
                            if(leftData && !downData)
                            {
                                shouldBend = true;
                                lock = true;
                                console.log("C");
                            }
                            if(leftData && downData)
                            {
                                console.warn("Edge case at " + line + "," + index);
                                shouldBend = false;
                                lock = true;
                            }
                        }
                        if(shouldBend)
                        {
                            mainArr[line][index] = new Bend();
                            solution = "Bend";
                        }
                    }
                    */
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
                
                //console.log("Solved: [" + line + "][" + index + "] with answer " + solution);
            }
        }
        
        console.log(mainArr);

        var result = "";
        for(var line = 0; line < mainArr.length; line++)
        {
            for(var index = 0; index < mainArr[line].length; index++)
            {
                result += mainArr[line][index].data;
            }
            result += "\n";
        }

        return result;

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


}

class Node
{
    constructor(value, level)
    {
        this.value = value;
        this.level = level;
    }
}

class RealBuffer
{
    constructor(textArea)
    {
        this.ref = textArea;
        this.start = textArea.selectionStart;
        this.end = textArea.selectionEnd;
        this.raw = new RawBuffer(this);
        this.exe = new ExecutiveBuffer(this);
        this.state = "UNLOCKED";
    }

    write(vb)
    {
        this.ref.value = vb.value;
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


    keyHandler(event)
    {
        if(this.state == "LOCKED")
        {
            setTimeout(() => {this.keyHandler(event)}, 10);
            return;
        } 
        this.readCarrat();
        this.write(this.raw);
        this.writeCarrat();

        if(event.key == "Tab")
        {
            event.preventDefault();
            this.ref.value = this.ref.value.substring(0,this.start) + "\t" + this.ref.value.substring(this.end);
            this.moveCarrat(1);
        }
        if(event.key == "Enter")
        {
            event.preventDefault();
            var autoIndent = this.countCaretLeft();
            this.ref.value = this.ref.value.substring(0,this.start) + "\n" + this.ref.value.substring(this.end);
            this.moveCarrat(1);
            for(var i = 0; i < autoIndent; i++)
            {
                this.ref.value = this.ref.value.substring(0,this.start) + "\t" + this.ref.value.substring(this.end);
                this.moveCarrat(1);
            }

        }

        this.state = "LOCKED";
        setTimeout(() => {this.display()}, 10);
    }

    display()
    {
        this.raw.update();
        this.exe.update();
        this.readCarrat();
        this.write(this.exe);
        this.writeCarrat();
        //this.formatCaretForward();
        console.log(this);
        this.state = "UNLOCKED";
    }

    countCaretLeft()
    {
        var lines = this.raw.value.substring(0, this.raw.selectionStart).split("\n");
        var lastLine = lines[lines.length-1];
        var numTabs = lastLine.split("\t").length - 1;
        return numTabs;
    }
}

class VirtualBuffer
{
    constructor(realBuffer, color)
    {
        this.ref = realBuffer.ref;
        this.value = "";
        this.start = this.ref.selectionStart;
        this.end = this.ref.selectionEnd;
        this.color = color;
    }

    update()
    {
        this.value = this.ref.value.slice();
        this.ref.style.color = this.color;
        this.start = this.ref.selectionStart;
        this.end = this.ref.selectionEnd;
    }
}

class RawBuffer extends VirtualBuffer
{
    constructor(realBuffer)
    {
        super(realBuffer, "whitesmoke");
    }

    update()
    {
        super.update();
        
    }
}

class ExecutiveBuffer extends VirtualBuffer
{
    constructor(realBuffer)
    {
        super(realBuffer, "whitesmoke");
        this.tree = new Tree();
    }

    update()
    {
        super.update();
        this.value = this.convert(this.value);
        
    }

    convert(input)
    {
        this.tree = new Tree();
        var lines = input.split("\n");
        for(var line of lines)
        {
            this.tree.push(line);
        }

        console.log(this.tree);
        console.log(new Date(Date.now()).getMilliseconds());
        var result = this.tree.format();
        console.log(new Date(Date.now()).getMilliseconds());

        document.getElementById("display").value = result;


        return input;
    }
}



