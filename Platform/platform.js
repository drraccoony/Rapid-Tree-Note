import { Provider } from "./provider.js";

export class Platform
{
    constructor()
    {
        this.provider = new Provider("stats_download");
        this.payload = "";
    }

    printObject(object, indent)
    {
        var output = "";
        for(var attribute in object)
        {
            if(object[attribute] != null)
            {
            if(typeof object[attribute] == "object" && indent < 5)
            {
                output += "\t".repeat(indent) + `"${attribute}","${object[attribute]}","${typeof object[attribute]}"\n`;
                output += this.printObject(object[attribute], indent+1); 
            }
            else
            {
                if(typeof object[attribute] !== "function")
                {
                output += "\t".repeat(indent) + `"${attribute}","${object[attribute]}","${typeof object[attribute]}"\n`;
                }
            }
            }
        }
        return output;
    }
}