/**
Copyright 2023, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is avalible at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

export class URIMannager
{
    constructor()
    {
        this.maxURILength = 8192;
        this.defaultCompression = "LZMA2";
        this.defaultEncoding = "URI-B64";
    }

    pull() //turn URL into data
    {
        var URI = this.getURL();
        var data = URI.data;
        var compression = URI.compressor;
        var encoding = URI.encoding;

        data = this.decode(data, encoding);

        data = this.decompress(data, compression);

        const decoder = new TextDecoder("utf-8");
        var data = decoder.decode(data);

        return data;
    }

    push(string) //turn data into URL
    {
        var title = string.split("\n")[0];
        const encoder = new TextEncoder();
        var data = encoder.encode(string);

        data = this.compress(data, this.defaultCompression);
        title = this.compress(title, "ZLIB");

        data = this.encode(data, this.defaultEncoding);
        title = this.encode(title, "URI-B64");

        this.setURL(data, title, this.defaultCompression, this.defaultEncoding);

        return null;
    }

    setURL(encodedData, title, compressionType, encoding) //set the url given the 3 URI params
    {
        var baseURL = window.location.href.split("?")[0];
        var URL = baseURL + "?title=" + title + "&enc=" + encoding + "&cmpr=" + compressionType + "&data=" + encodedData;

        if(URL.length + 512 > this.maxURILength)
        {
            URL = baseURL + "?title=" + title + "&enc=" + encoding + "&cmpr=" + compressionType + "&data=" + "MAXIMUM-LINK-LENGTH-EXCEEDED";
        }

        history.replaceState({}, "", URL);
    }

    getURL() //extract URI components
    {
        var data = /(?:data=)([^\&\=\?]*)/gm;
        var compressor = /(?:cmpr=)([^\&\=\?]*)/gm;
        var encoding = /(?:enc=)([^\&\=\?]*)/gm;

        var uriData = data.exec(window.location.href);
        if(uriData == null || uriData[1] == "")
        {
            uriData = "";
        }
        else
        {
            uriData = uriData[1];
        }

        var uriCompressor = compressor.exec(window.location.href);
        if(uriCompressor == null || uriCompressor[1] == "")
        {
            uriCompressor = "ZLIB"; //fallback to old
        }
        else
        {
            uriCompressor = uriCompressor[1];
        }

        var uriEncoding = encoding.exec(window.location.href);
        if(uriEncoding == null || uriEncoding[1] == "")
        {
            uriEncoding = "URI-B64"; //fallback to old
        }
        else
        {
            uriEncoding = uriEncoding[1];
        }
        
        var URI = ({});
        URI.encoding = uriEncoding;
        URI.compressor = uriCompressor;
        URI.data = uriData;
        return URI;
    }

    encode(compressedData, encodingType) //encode the given uint8 array as a string with the given compresison type
    {
        switch (encodingType)
        {
            case "URI-B64":
                return URIB64(compressedData);
            default:
                console.warn("unrecognized encoding argument: " + encodingType);
                return null;
        }

        function URIB64(data)
        {
            var utf8str = "";
            for(var item of data)
            {
                utf8str += String.fromCodePoint(item);
            }
            var payload = btoa(utf8str);
            payload = payload.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, "");
            return payload;
        }
    }

    decode(encodedData, encodingType) //decode the given string with the given encoding type
    {
        switch (encodingType)
        {
            case "URI-B64":
                return URIB64(encodedData);
            default:
                console.warn("unrecognized encoding argument: " + encodingType);
                return null;
        }

        function URIB64(data)
        {
            data = data.replace(/\-/g, '+').replace(/\_/g, '/');
            var utf8str = atob(data);
            var u8 = new Array();
            for(var char of utf8str)
            {
                u8.push(char.charCodeAt(0));
            }
            u8 = new Uint8Array(u8);
            return u8;
        }
    }

    decompress(uint8_compressed, compressionType) //turn compression type and compressed unit8array into decompressed uint8array
    {
        switch (compressionType)
        {
            case "ZLIB":
                return zlib(uint8_compressed);
            case "LZMA2":
                return lzma2(uint8_compressed);
            default:
                console.warn("unrecognized decompression argument: " + compressionType);
                return null;
        }

        function zlib(data)
        {
            try
            {
                data = pako.inflate(data);
            }
            catch (error)
            {
                data = "There was a problem decoding the data in the link.\nAre you sure it was produced by this program?\nError has been printed to console.";
                console.error(error);
            }
            return data;
        }

        function lzma2(data)
        {
            var s8 = new Array();
            for(var val of data)
            {
                s8.push(val-128);
            }
            var data = LZMA.decompress(s8);
            var u8 = new Array();
            for(var val of data)
            {
                u8.push(val+128);
            }
            u8 = new Uint8Array(u8);
            console.log(u8);
            return u8;
        }
    }

    compress(uint8_raw, compressionType)
    {
        switch(compressionType)
        {
            case "ZLIB":
                return zlib(uint8_raw);
            case "LZMA2":
                return lzma2(uint8_raw);
            default:
                console.warn("unrecognized compression argument: " + compressionType);
                return null;
        }

        function zlib(data)
        {
            data = pako.deflate(data, { level: 9});
            return data;
        }

        function lzma2(data)
        {
            var s8 = new Array();
            for(var val of data)
            {
                s8.push(val-128);
            }
            data = LZMA.compress(s8, 9);
            var u8 = new Array();
            for(var val of data)
            {
                u8.push(val+128);
            }
            u8 = new Uint8Array(u8);
            return u8;
        }
    }
}