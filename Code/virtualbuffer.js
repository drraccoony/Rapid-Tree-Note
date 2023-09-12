
export default class VirtualBuffer
{
    constructor(textArea)
    {
        this.buffer = textArea;
        this.raw = textArea.value;
        this.display = "";

        this.start = textArea.selectionStart;
        this.end = textArea.selectionEnd;

        this.state = "UNLOCKED";
        var vb = this;
        this.buffer.addEventListener("keydown", (event) => {this.keyHandler(event)});
    }

    keyHandler(event)
    {
        if(this.state == "UNLOCKED")
        {
            this.start = this.buffer.selectionStart;
            this.end = this.buffer.selectionEnd;

            this.buffer.value = this.raw;

            this.buffer.selectionStart = this.start;
            this.buffer.selectionEnd = this.end;

            if(event.key == "Tab")
            {
                event.preventDefault();
                this.insert("\t");
            }
            this.state = "LOCKED";
            console.log(this);
            setTimeout(() => {this.pullraw()}, 10);
        }
        else
        {
            event.preventDefault(); 
        }
        
    }

    pullraw()
    {
        this.start = this.buffer.selectionStart;
        this.end = this.buffer.selectionEnd;
        this.raw = this.buffer.value;
        this.display = this.convert(this.raw);
        this.buffer.value = this.display;
        this.buffer.selectionStart = this.start;
        this.buffer.selectionEnd = this.end;
        this.state = "UNLOCKED";
    }

    insert(value)
    {
        this.drop(this.start, this.end-this.start);
        this.buffer.value = this.buffer.value.substring(0, this.start) + value + this.buffer.value.substring(this.start + value.length);
        this.start += 1;
        this.end += 1;
    }

    drop(start, length)
    {
        this.buffer.value = this.buffer.value.substring(0, start) + this.buffer.value.substring(start + length + 1);
    }

    convert(inputstring)
    {
        var lines = inputstring.split("\n");
        var indexed = new Array();
        for(var line of lines)
        {
            var count = line.match(/^\t*(\t)/gm);
            console.log(count);
            if(count != null)
            {
                count = count[0].length;
            }
            else
            {
                count = 0;
            }
            var content = line.replace(/(\t)/g, "░");

            indexed.push(new Array(content, count));
        }

        this.Tree = new Tree();


        for(var index of indexed)
        {
            this.Tree.push(index[0], index[1]);
        }
        

        console.log(this.Tree);


        var result = "";
        for(var i = 0; i < indexed.length; i++)
        {

            if(i < indexed.length - 1)
            {
                result += indexed[i][0] + "\n";
            }
            else
            {
                result += indexed[i][0];
            }
        }
        

        console.log(indexed);

        return result;
    }
    

}

class TreeLine
{
    constructor(value, indents)
    {
        this.value = value.replaceAll(/░/g, "");
        this.level = indents;
    }


}

class Tree
{
    constructor()
    {
        this.lines = new Array();
    }

    push(value, level)
    {
        this.lines.push(new TreeLine(value,level));
    }
}