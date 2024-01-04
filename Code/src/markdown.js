export default class Markdown
{

    constructor()
    {

        this.normal = new Alphabet(65); //65 - 117
        this.bold = new Alphabet(120276); //120276-120327
        this.italic = new Alphabet(120328); //120328-120379
        this.double = new Alphabet(120380); //120380-120431
    }

    test()
    {
        const one = "ABC_abc";
        const two = "𝗔𝗕𝗖_𝗮𝗯𝗰";
        const three = "𝘈𝘉𝘊_𝘢𝘣𝘤";
        const four = "𝘼𝘽𝘾_𝙖𝙗𝙘";

        console.log("-----");
        console.log(this.addBold(one));
        console.log(this.removeBold(one));
        console.log(this.addItalic(one));
        console.log(this.removeItalic(one));
        console.log("-----");
        console.log(this.addBold(two));
        console.log(this.removeBold(two));
        console.log(this.addItalic(two));
        console.log(this.removeItalic(two));
        console.log("-----");
        console.log(this.addBold(three));
        console.log(this.removeBold(three));
        console.log(this.addItalic(three));
        console.log(this.removeItalic(three));
        console.log("-----");
        console.log(this.addBold(four));
        console.log(this.removeBold(four));
        console.log(this.addItalic(four));
        console.log(this.removeItalic(four));
        console.log("-----");
    }

    getIndex(character)
    {
        if(this.normal.isThisScript(character))
        {
            return this.normal.getRelativeIndex(character);
        }
        else if(this.bold.isThisScript(character))
        {
            return this.bold.getRelativeIndex(character);
        }
        else if(this.italic.isThisScript(character))
        {
            return this.italic.getRelativeIndex(character);
        }
        else if(this.double.isThisScript(character))
        {
            return this.double.getRelativeIndex(character);
        }
        else
        {
            return -1;
        }
    }

    addBold(string)
    {
        var result = "";
        
        for (const char of [...string])
        {
            var offset = this.getIndex(char);

            if(this.normal.isThisScript(char))
            {
                result += this.bold.relativeIndexAsString(offset);
            }
            else if(this.bold.isThisScript(char))
            {
                result += this.bold.relativeIndexAsString(offset);
            }
            else if(this.italic.isThisScript(char))
            {
                result += this.double.relativeIndexAsString(offset);
            }
            else if(this.double.isThisScript(char))
            {
                result += this.double.relativeIndexAsString(offset);
            }
            else
            {
                result += char;
            }
        }
        return result;
    }

    removeBold(string)
    {
        var result = "";
        for (const char of [...string])
        {
            var offset = this.getIndex(char);

            if(this.normal.isThisScript(char))
            {
                result += this.normal.relativeIndexAsString(offset);
            }
            else if(this.bold.isThisScript(char))
            {
                result += this.normal.relativeIndexAsString(offset);
            }
            else if(this.italic.isThisScript(char))
            {
                result += this.italic.relativeIndexAsString(offset);
            }
            else if(this.double.isThisScript(char))
            {
                result += this.italic.relativeIndexAsString(offset);
            }
            else
            {
                result += char;
            }
        }
        return result;
    }

    addItalic(string)
    {
        var result = "";
        for (const char of [...string])
        {
            var offset = this.getIndex(char);

            if(this.normal.isThisScript(char))
            {
                result += this.italic.relativeIndexAsString(offset);
            }
            else if(this.bold.isThisScript(char))
            {
                result += this.double.relativeIndexAsString(offset);
            }
            else if(this.italic.isThisScript(char))
            {
                result += this.italic.relativeIndexAsString(offset);
            }
            else if(this.double.isThisScript(char))
            {
                result += this.double.relativeIndexAsString(offset);
            }
            else
            {
                result += char;
            }
        }
        return result;
    }

    removeItalic(string)
    {
        var result = "";
        for (const char of [...string])
        {
            var offset = this.getIndex(char);

            if(this.normal.isThisScript(char))
            {
                result += this.normal.relativeIndexAsString(offset);
            }
            else if(this.bold.isThisScript(char))
            {
                result += this.bold.relativeIndexAsString(offset);
            }
            else if(this.italic.isThisScript(char))
            {
                result += this.normal.relativeIndexAsString(offset);
            }
            else if(this.double.isThisScript(char))
            {
                result += this.bold.relativeIndexAsString(offset);
            }
            else
            {
                result += char;
            }
        }
        return result;
    }


}

class Alphabet
{
    constructor(startingPoint)
    {
        this.root = startingPoint;
    }

    isThisScript(char)
    {
        if(this.root != 65)
        {
            var greater_than_root = char.codePointAt(0) >= this.root;
            var less_than_celing = char.codePointAt(0) <= this.root + 51;
            var soln = greater_than_root && less_than_celing;
            return soln;
        }
        else
        {
            var soln = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(char);
            return (soln != -1); 
        }
    }

    getRelativeIndex(char)
    {
        //console.log(char, char.codePointAt(0), this);
        if(this.root != 65)
        {
            return char.codePointAt(0) - this.root;
        }
        else
        {
            var soln = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(char);
            return (soln); 
        }
    }

    relativeIndexAsString(index)
    {
        //console.log(index);
        //console.log(this.root);
        if(this.root != 65)
        {
            return String.fromCodePoint(this.root + index);
        }
        else
        {
            var soln = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[index];
            return (soln); 
        }
    }
}