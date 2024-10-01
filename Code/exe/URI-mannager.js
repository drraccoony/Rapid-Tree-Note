/**
Copyright 2023, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

export class URIMannager{constructor(){this.maxURILength=8192,this.defaultCompression="LZMA2",this.defaultEncoding="URI-B64",this.lastAlert=new Date(0)}alertNoSpam(){new Date().getTime()-this.lastAlert>=3e4&&alert('Maxium URL Length Reached!\n\nShorten your document or prepare to save the raw text contents instead of the URL!\n\nYou can click the header of the page ("Rapid Tree Notetaker" to save the document as a `.rtn` file.'),this.lastAlert=new Date().getTime()}pull(e){var r=this.getURL(e),t=r.data;if(window.location.href.endsWith("program.html"))return"";if(""==t)return"Error\n	No data parameter provided";var n=r.compressor,a=r.encoding;try{t=this.decode(t,a),t=this.decompress(t,n);let o=new TextDecoder("utf-8");var t=o.decode(t)}catch(s){t=(t=s.stack).replace(/[\t ]{4,}/g,"	")}return(""==t||null==t)&&(t="Couldn't decode the provided link.\nAre you sure it was made by the RTN?"),t=t.replace(/\s+$/gm,"")}push(e){let r=new TextEncoder;var t=r.encode(e);return t=this.compress(t,this.defaultCompression),t=this.encode(t,this.defaultEncoding),this.setURL(t,this.defaultCompression,this.defaultEncoding),null}setURL(e,r,t){var n=window.location.href.split("?")[0],a=n+"?enc="+t+"&cmpr="+r+"&data="+e;window.link_full=a,a.length+512>this.maxURILength&&(a=n+"?enc="+t+"&cmpr="+r+"&data=MAXIMUM-LINK-LENGTH-EXCEEDED",this.alertNoSpam()),history.replaceState({},"",a)}getURL(){var e=/(?:data=)([^\&\=\?]*)/gm.exec(window.location.href);e=null==e||""==e[1]?"":e[1];var r=/(?:cmpr=)([^\&\=\?]*)/gm.exec(window.location.href);r=null==r||""==r[1]?"ZLIB":r[1];var t=/(?:enc=)([^\&\=\?]*)/gm.exec(window.location.href);t=null==t||""==t[1]?"URI-B64":t[1];var n={};return n.encoding=t,n.compressor=r,n.data=e,n}encode(e,r){return"URI-B64"===r?function e(r){var t="";for(var n of r)t+=String.fromCodePoint(n);var a=btoa(t);return a.replace(/\+/g,"-").replace(/\//g,"_").replace(/\=/g,"")}(e):(console.warn("unrecognized encoding argument: "+r),null)}decode(e,r){return"URI-B64"===r?function e(r){var t=atob(r=r.replace(/\-/g,"+").replace(/\_/g,"/")),n=[];for(var a of t)n.push(a.charCodeAt(0));return new Uint8Array(n)}(e):(console.warn("unrecognized encoding argument: "+r),null)}decompress(e,r){switch(r){case"ZLIB":return function e(r){try{r=pako.inflate(r)}catch(t){r="There was a problem decoding the data in the link.\nAre you sure it was produced by this program?\nError has been printed to console.",console.error(t)}return r}(e);case"LZMA2":return function e(r){var t=[];for(var n of r)t.push(n-128);var r=LZMA.decompress(t),a=[];for(var n of r)a.push(n+128);return a=new Uint8Array(a),console.debug(a),a}(e);default:return console.warn("unrecognized decompression argument: "+r),null}}compress(e,r){switch(r){case"ZLIB":var t;return t=e,t=pako.deflate(t,{level:9});case"LZMA2":return function e(r){var t=[];for(var n of r)t.push(n-128);r=LZMA.compress(t,9);var a=[];for(var n of r)a.push(n+128);return new Uint8Array(a)}(e);default:return console.warn("unrecognized compression argument: "+r),null}}}