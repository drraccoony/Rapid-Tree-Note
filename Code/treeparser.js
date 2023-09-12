
export default class Parser
{
    constructor()
    {

    }

    push(text)
    {
        var lines = text.split("\n");
        var mainArr = new Array();
        for(var line of lines)
        {
            var indents = 0;
            for(var charIndex = 0; charIndex < line.length; charIndex++)
            {
                if(line[charIndex] == "\t")
                {
                    indents++;
                }
            }
            var holder = new Array();
            holder.push(indents);
            holder.push(line);
            mainArr.push(holder);
        }

        console.log(mainArr);
    }

}