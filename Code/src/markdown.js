/**
Copyright 2023, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is avalible at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

export default class Markdown
{

    constructor()
    {

        this.normal = new Alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
        this.bold = new Alphabet("𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇");
        this.italic = new Alphabet("𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻");
        this.double = new Alphabet("𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯");
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
    constructor(alpha)
    {
        this.glyphs = alpha;
    }

    isThisScript(test)
    {
        for (const char of [...this.glyphs])
        {
            if(test == char)
            {
                return true;
            }
        }
        return false;
    }

    getRelativeIndex(test)
    {
        var index = 0;
        for (const char of [...this.glyphs])
        {
            if(test == char)
            {
                return index;
            }
            index++;
        }
        return -1;
    }

    relativeIndexAsString(index)
    {
        var glyphSelector = 0;
        for (const char of [...this.glyphs])
        {
            if(glyphSelector == index)
            {
                return char;
            }
            glyphSelector++;
        }
        return "�";
    }
}