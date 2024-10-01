/**
Copyright 2023, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

import{Line as e,Fork as t,Bend as r,Gap as s,Data as n,New as a,End as i,Null as l}from"./treeblocks.js";import{URIMannager as o}from"./URI-mannager.js";import{Provider as h}from"./provider.js";export default class c{constructor(e,t,r){this.maxURLLength=8192,this.uri=new o,window.main=this,this.provider=new h("file_save");var s=this.pullURL();this.raw=new RawBuffer(e),this.exe=new ExeBuffer(t),this.wrap=r,this.state="UNLOCKED",this.raw.ref.addEventListener("keydown",e=>this.keyPreRouter(e)),this.raw.ref.addEventListener("input",()=>this.keyPostRouter()),this.raw.ref.addEventListener("copy",e=>this.handleCopy(e)),this.raw.ref.addEventListener("click",e=>this.urlPreEncodeOnIdle(e)),this.raw.ref.addEventListener("input",()=>this.urlPreEncodeOnIdle()),this.raw.ref.addEventListener("paste",e=>this.handlePaste(e)),this.raw.ref.addEventListener("keydown",e=>this.syncScrollbars(e)),this.raw.ref.addEventListener("click",e=>this.syncScrollbars(e)),document.addEventListener("wheel",e=>this.scaleTextOnZoom(e),{passive:!1}),this.intervalUpdater=setInterval(()=>this.intervalUpdate(),1e3),this.focused=!0,document.addEventListener("visibilitychange",e=>this.focusToggle(e)),window.addEventListener("beforeunload",e=>this.safeShutdown(e)),this.setURL(s),this.keyPostRouter(),this.syncScrollbars(),this.handlePaste(),this.urlPreEncodeOnIdle(),""!=s&&null!=s&&(document.title=this.exe.ref.textContent.split("\n")[0].substring(0,32))}debugDump(){console.debug("=====STARTING=DEBUG=DUMP====="),console.debug("Source Value:"),console.debug(this.raw.ref.value.replaceAll("\n","\\n").replaceAll("	","\\t")),console.debug("-----------------"),console.debug("Display Value:"),console.debug(this.exe.ref.innerHTML.replaceAll("\n","\\n").replaceAll("	","\\t")),console.debug("=====END=DEBUG=DUMP=====")}safeShutdown(e){clearInterval(this.intervalUpdater),console.debug("RTN Safe Shutdown Complete.")}focusToggle(e){this.focused=!this.focused,"hidden"===document.visibilityState?this.focused=!1:"visible"===document.visibilityState&&(this.focused=!0)}scaleTextOnZoom(e){if(!e.ctrlKey)return;e.preventDefault();let t=parseFloat(document.getElementById("display").style.fontSize),r=parseFloat(document.getElementById("display").style.top),s=parseFloat(document.getElementById("source").style.fontSize);e.deltaY>0&&(t=Math.max(.5,t-.1),s=Math.max(.5,s-.1)),e.deltaY<0&&(t=Math.min(2,t+.1),s=Math.min(2,s+.1)),r=-1*t,document.getElementById("display").style.fontSize=t+"vw",document.getElementById("source").style.fontSize=s+"vw",document.getElementById("display").style.top=r+"vw"}intervalUpdate(){this.focused&&this.keyPostRouter()}darkenBorder(){var e=document.getElementById("display").style.border;if(""!=e){var t=parseInt(e.substring(17,20));if(0==t){clearInterval(this.outlineInterval);return}t=Math.max(t-5,0),document.getElementById("display").style.border=`0.25vw solid rgb(${t},${t},${t})`}}urlPreEncodeOnIdle(){let e=8192*Math.random()+0;this.shouldEncode=e,setTimeout(()=>this.urlPostEncodeOnIdle(e),1e3)}urlPostEncodeOnIdle(e){if(this.shouldEncode==e){this.pushURL(),document.getElementById("display").style.border="0.25vw solid rgb(255,255,255)",this.outlineInterval=setInterval(()=>this.darkenBorder(),10),document.title=this.exe.ref.textContent.split("\n")[0].substring(0,32),this.provider.clear();var t=document.title;t=t.replace(/[^A-Za-z0-9_-]/g,"_"),t+=".rtn";var r='{\n  "how_to_open": "Visit the link contained in the value of the `.link` property. If no suitable copy of the RTN software exists, see `.data_recovery`.",\n  "link": "{{DATA}}",\n  "data_structure": "Each RTN link consists of 3 URI parameters: `enc=`, `cmpr=`, and `data=`. These stand for `encoding`, `compression`, and `data` respectively. Extraction of these components may be necessary for data recovery.",\n  "data_recovery": "In the event that no copy of the RTN software is available, it is still possible to recover the included data. Data is encoded with the `.encoding` encoding type and compressed with the `.compression` compression scheme. For URI-B64 encoding, replace `-_` with `+/` and then handle with normal base64_decode. For LZMA2 compression, gzinflate data[2:]."\n}';r=r.replace("{{DATA}}",window.link_full),this.provider.provide(t,"text/plain",r)}}pullURL(){return this.uri.pull()}setURL(e){""!=e?this.raw.ref.value=e:this.raw.ref.value="Rapid Tree Notetaker\n	What is this?\n		The Rapid Tree Notetaker (RTN) is a notetaking tool developed by computer science student Brendan Rood at the University of Minnesota Duluth.\n		It aims to provide an easy way to take notes formatted similar to a Reddit thread, with indentation following a tree-like structure allowing for grouping.\n		It also prioritizes ease of sharing, as the URL can be shared to instantly communicate the note's contents.\n			Notice how the border is flashing?\n			Every time you see that, it means that the document has been saved to the URL!\n			If the URL ever becomes longer than 8192 characters, it will alert you that saving is no longer possible.\n			You can click the header of the page to save the document as a `.rtn` file.\n		It is free to use and will never ask you to log in.\n	Sample\n		Edit this text\n		to generate\n			a\n			document\n		formatted\n			like a tree!\n			:3\n	Additional Instructions - *Click links to view!*\n		[Indentation](./Redir/indentation.html)\n			Use TAB to indent\n		[Text Formatting](./Redir/textformat.html)\n		[Color and Highlighting](./Redir/color.html)\n		[DNL Links / Intradocument References](./Redir/dirnavlink.html)"}pushURL(){var e=this.exe.ref.textContent.replace(/[\s]+$/,"");this.exe.tree.input=e,this.exe.tree.totalParse(),e=(e=(e=(e=(e=(e=(e=this.exe.tree.output).replace(/├────── ​/gm,"├── ​")).replace(/└────── ​/gm,"└── ​")).replace(/│       ​/gm,"│   ​")).replace(/        ​/gm,"    ​")).replace(/<[^>]*>/g,"")).replace(/(\s*)(•)(.*)/gm,"$1-$3"),this.uri.push(e)}keyPreRouter(e){this.raw.keyHandler(e,e=>this.keyPostRouter(e)),this.urlPreEncodeOnIdle()}keyPostRouter(){this.raw.update(),this.exe.ref.innerHTML=this.raw.ref.value.replace(/\</g,"&lt;").replace(/\>/g,"&gt;"),this.exe.update(),this.syncScrollbars()}handlePaste(e){setTimeout(()=>{this.raw.ref.value=this.raw.ref.value.replace(/├────── |│       |└────── |        /gm,"	"),this.raw.ref.value=this.raw.ref.value.replace(/├── |│   |└── |    /gm,"	")},100),setTimeout(e=>this.syncScrollbars(e),100)}handleCopy(e){e.preventDefault(),this.keyPostRouter();var t=this.raw.ref.selectionStart,r=this.raw.ref.value.substring(0,t),s=c(r),n=this.raw.ref.selectionEnd,a=this.raw.ref.value.substring(t,n),i=c(a),l=this.raw.ref.selectionStart+8*s,o=this.raw.ref.selectionEnd+8*s+8*i,h=this.exe.ref.textContent.substring(l,o);function c(e){var t=e.match(/\t/gm);return null!=t?t.length:0}this.exe.tree.input=h,this.exe.tree.totalParse(),h=(h=(h=(h=(h=(h=(h=this.exe.tree.output).replace(/├────── ​/gm,"├── ​")).replace(/└────── ​/gm,"└── ​")).replace(/│       ​/gm,"│   ​")).replace(/        ​/gm,"    ​")).replace(/(\s*)(•)(.*)/gm,"$1-$3")).replace(/\s$/,""),navigator.clipboard.writeText(h)}syncScrollbars(e){let t=document.getElementById("display"),r=document.getElementById("source"),s=document.getElementById("main"),n=document.getElementById("header");s.style.top=`${n.offsetHeight+10}px`;let a=`${t.offsetHeight+50}px`,i=`${t.offsetWidth+s.offsetLeft}px`;s.style.height=a,s.style.width=i,r.style.height=`${t.offsetHeight}px`,r.style.width=`${t.offsetWidth+s.offsetLeft}px`,s.style.minWidth=`${n.offsetWidth}px`,r.style.minWidth=`${n.offsetWidth}px`,t.style.minWidth=`${n.offsetWidth}px`}hardFix(){this.raw.update(),this.exe.ref.tree.input=this.raw.ref.value,this.exe.tree.totalParse(),this.exe.update();var e=this.raw.ref.selectionStart,t=this.raw.ref.selectionEnd;this.raw.ref.value=this.exe.tree.content.substring(0,this.exe.tree.content.length-1),this.raw.update(),this.exe.ref.textContent=this.raw.ref.value,this.exe.tree.totalParse(),this.exe.update(),this.raw.ref.selectionStart=e,this.raw.ref.selectionEnd=t}scrollToCaret(e){var t=document.createElement("div");t.style.position="absolute",t.style.color="red",t.style.padding="5px",t.style.wordBreak="normal",t.style.whiteSpace="pre-wrap",t.style.border="solid 0.25vw transparent",t.style.fontSize=document.getElementById("source").style.fontSize,document.getElementById("main").appendChild(t),t.innerHTML=e.value.substring(0,e.selectionEnd)+'<span id="scrollCarrat"></span>',document.getElementById("scrollCarrat").scrollIntoView({behavior:"smooth",block:"center",inline:"end"}),document.getElementById("scrollCarrat").remove(),document.getElementById("main").removeChild(t)}dirnav(e,t,r,s=!1){if(s||e.preventDefault(),!0==document.getElementById("source").hidden){e.preventDefault();return}for(var n=this.raw.ref.value.split("\n"),a=n.length-1,i=r,l=t.split("/").filter(e=>null!=e&&""!==e&&"DNL."!==e&&"RTN."!=e&&"DL."!=e),o={Payload:t,Index:r,Lines:n,LowerBound:0,UpperBound:a,Actions:l};0!=l.length;)switch(l[0]){case"RTN.":case"DNL.":case"DL.":l.shift();break;case"RTN":case"DNL":case"DL":var h=0;if(h<0)return console.debug("DirNav called for invalid Indent Level "+h,o),!1;for(;i>=0&&m(n[i])!=h;)i--;if(i<0)return console.debug("DirNav could not find a proper parent...",o),!1;l.shift();break;case"RTN~":case"DNL~":case"DL~":var h=1;if(h<0)return console.debug("DirNav called for invalid Indent Level "+h,o),!1;for(;i>=0&&m(n[i])!=h;)i--;if(i<0)return console.debug("DirNav could not find a proper parent...",o),!1;l.shift();break;case"..":var h=m(n[i])-1;if(h<0)return console.debug("DirNav called for invalid Indent Level "+h,o),!1;for(;i>=0&&m(n[i])!=h;)i--;if(i<0)return console.debug("DirNav could not find a proper parent...",o),!1;l.shift();break;default:var c=m(n[i]);if(l[0].match(/\[[0-9]*\]/)){for(var d=parseInt(l[0].substring(1,l[0].length-1),10),u=-1;u<d&&i<=a;){if(m(n[++i])<=c)return console.debug("DirNav failed to find a child of index ["+d+"] before exhausting the domain!",o),!1;m(n[i])==c+1&&u++}l.shift()}else{let p=l[0].substring(1,l[0].length-1).replace(/^([^a-zA-Z0-9]*)(.*)/,"$2"),f=RegExp("^\\s*[^a-zA-Z0-9]*"+p+".*");for(;!n[i].match(f)&&i<=a;)if(m(n[++i])<=c){if(p.startsWith("Invalid links will do nothing when clicked"))return!1;return console.debug("DirNav failed to find a child of key ["+p+"] before exhausting the domain!",o),!1}l.shift()}}if(s)return!0;for(var g="",v=0;v<i;v++)g+=n[v]+"\n";var b=(g=g.substring(0,g.length-1)).length,$=n[i].match(/^(\s*)([^\n]*)/),y=$[1].length,_=$[2].length;return this.raw.start=b+y,this.raw.end=b+y+_,0!=this.raw.start&&(this.raw.start++,this.raw.end++),this.raw.ref.focus(),this.raw.writeCarrat(),this.scrollToCaret(this.raw.ref),!0;function m(e){return null==e||""==e?0:e.split("	").length-1}}};class LevelNode{constructor(e,t){this.level=e,this.value=t}}class ProcessingTree{constructor(e){this.input=e,this.nodes=[],this.blocks=[],this.output=""}toNodes(){var e=this.input.split("\n");for(var t of e){var r=n(t);t=s(t),this.nodes.push(new LevelNode(r,t))}function s(e){var t=e;return t.replaceAll(/\t/g,"")}function n(e){var t=e.match(/^\t*(\t)/gm);return null!=t?t[0].length:0}}toBlocks(){for(var e of this.nodes){for(var t=[],r=0;r<e.level;r++)t.push(new a);""==e.value?t.push(new i):t.push(new n(e.value)),this.blocks.push(t)}}parseNewBlocks(){for(var n=this.blocks,a=0;a<n.length;a++)for(var i=0;i<n[a].length;i++){var l="";if(""==l&&"Data"==p(a,i,n)&&(l="Data"),""==l){var o=null;if("Data"==p(a,i+1,n)&&(("Null"==p(a+1,i,n)||"Data"==p(a+1,i,n))&&(o=!0),null==o)){var h=d(a,i,n),c=u(a,i,n);function d(e,t,r){for(var s=0;e<r.length&&!(e+1>r.length-1);){var n=p(e+1,t,r);if("Data"==n||"Null"==n)break;s++,e++}return s}function u(e,t,r){for(var s=0;e<r.length&&!(e+1>r.length-1);){var n=p(e+1,t+1,r);if("Data"==n||"Null"==n)break;s++,e++}return s}o=h<=c}o&&(n[a][i]=new r,l="Fork")}""==l&&"Data"==p(a,i+1,n)&&(n[a][i]=new t,l="Fork"),""==l&&("Gap"==p(a-1,i,n)||"Bend"==p(a-1,i,n))&&(n[a][i]=new s,l="Gap"),""==l&&("Line"==p(a-1,i,n)||"Fork"==p(a-1,i,n))&&(n[a][i]=new e,l="Line")}function p(e,t,r){return e<0||t<0||r.length-1<e||r[e].length-1<t?"Null":r[e][t].type}this.blocks=n}toString(){for(var e="",t=this.blocks,r=0;r<t.length;r++){for(var s=0;s<t[r].length;s++)e+=t[r][s].data;e+="\n"}this.output=e}totalParse(){this.nodes=[],this.blocks=[],this.output="",this.toNodes(),this.toBlocks(),this.parseNewBlocks(),this.toString()}}class VirtualBuffer{constructor(e){this.ref=e,this.start=e.selectionStart,this.end=e.selectionEnd,this.state="UNLOCKED"}writeCarrat(){this.ref.selectionStart=this.start,this.ref.selectionEnd=this.end}readCarrat(){this.start=this.ref.selectionStart,this.end=this.ref.selectionEnd}moveCarrat(e){this.start+=e,this.end+=e,this.writeCarrat()}countCaretLeft(){var e=this.ref.value.substring(0,this.start).split("\n");return e[e.length-1].split("	").length-1}keyHandler(e,t){if(console.debug(e),void 0==e&&(e={key:"none"}),"LOCKED"==this.state){setTimeout(()=>{this.keyHandler(e,t)},10);return}if(this.readCarrat(),"Tab"==e.key){if(e.preventDefault(),this.start==this.end)c(this.ref.value,this.start)&&(this.ref.value=this.ref.value.substring(0,this.start)+"	"+this.ref.value.substring(this.end),this.moveCarrat(1));else{for(var r=this.start,s=this.end-1;"\n"!=this.ref.value.substring(r,r+1)&&r>0;)r--;for(;"\n"!=this.ref.value.substring(s,s+1)&&s>0;)s--;var n=[],a=r;for(n.push(r);a<s-1;)a++,"\n"==this.ref.value.substring(a,a+1)&&n.push(a);if(s!=r&&n.push(s),e.shiftKey){var i=0;for(var l of n)"	"==this.ref.value.substring(l+i+1,l+i+2)&&(this.ref.value=this.ref.value.substring(0,l+i+1)+""+this.ref.value.substring(l+i+2),i--,this.ref.selectionStart=l+i,this.ref.selectionEnd=l+i)}else{var i=0;for(var l of n)c(this.ref.value,l+i+1)&&(this.ref.value=this.ref.value.substring(0,l+i+1)+"	"+this.ref.value.substring(l+i+1),i++,this.ref.selectionStart=l+i,this.ref.selectionEnd=l+i)}}}if("Enter"==e.key&&(e.preventDefault(),function e(t,r){var s=t.substring(0,r).split("\n"),n=l(s[s.length-1])>0,a=t.split("\n")[s.length];null==a&&(a="PROCEED");var i=l(a)>0;return!0==n&&!0==i;function l(e){var t=e.match(/\S/gm);return null!=t?t.length:0}}(this.ref.value,this.start)&&this.start==this.end)){var o=this.countCaretLeft();this.ref.value=this.ref.value.substring(0,this.start)+"\n"+this.ref.value.substring(this.end),this.moveCarrat(1);for(var h=0;h<o;h++)this.ref.value=this.ref.value.substring(0,this.start)+"	"+this.ref.value.substring(this.end),this.moveCarrat(1);window.main.scrollToCaret(this.ref)}function c(e,t){var r=e.substring(0,t).split("\n").length,s=e.split("\n"),n=s[r-1],a="";s.length>1&&(a=s[r-2]);var i,l,o=c(n),h=c(a);if(n=(n=e.substring(0,t).split("\n"))[n.length-1],o<h+1&&(i=n,l=i.match(/([\S ]+)/g),!((l=null!=l?l[0].length:0)>0)))return!0;return!1;function c(e){if(""==e)return 0;var t=e.match(/^(\t*)/g);return null!=t?t[0].length:0}}this.state="LOCKED",setTimeout(()=>{t()},10)}update(){this.state="UNLOCKED",this.readCarrat()}}class RawBuffer extends VirtualBuffer{constructor(e){super(e)}update(){this.ref.value=this.ref.value.replace(/[└├│─ ]*​/gm,"	"),this.ref.value=this.ref.value.replace(/(?:\t+[\S ]+)(\t+)/gm,"	"),super.update()}}class ExeBuffer extends VirtualBuffer{constructor(e){super(e),this.tree=new ProcessingTree("")}update(){this.tree.input=this.ref.textContent,this.tree.totalParse();for(var e=this.tree.output,t=(e=(e=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")).replace(/(\[(.+?)\]\((.+?)\))|(https?:\/\/\S+)/g,function(e,t,r,s,n){return s?`<a style="z-index: 4; pointer-events: all; position: relative;" href="${s}" target="_blank" rel="noopener noreferrer"><b>[${r}](${s})</b></a>`:`<a style="z-index: 4; pointer-events: all; position: relative;" href="${n}" target="_blank" rel="noopener noreferrer"><b>${n}</b></a>`})).split("\n"),r=0;r<t.length;r++)window.dirnavIndex=r,t[r]=t[r].replace(/(DNL|RTN|DL)([\.\~]{0,1})((?:\/\.\.|\/\[[^\]]+\])+)(\/?)/g,function(e,t,r,s,n){var a=window.main.dirnav(null,t+r+s+n,window.dirnavIndex,!0)?"#52eb00":"#ff5555";let i=`<a style="z-index: 4; pointer-events: all; position: relative; color: ${a};" href="#" onclick="window.main.dirnav(event, '${t+r+s+n}', ${window.dirnavIndex});"><b>${t+r+s+n}</b></a>`;return i});var s="";for(var n of t)s+=n+"\n";e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=s=s.substring(0,s.length-1)).replace(/((?:\&lt\;)?)(-+|=+)((?:\&gt\;)?)/g,function(e,t,r,s){var n=t+r+s;return n.startsWith("&lt;")||n.split("").reverse().join("").startsWith(";tg&")?`<b>${n}</b>`:n})).replace(/(?<!\*|\\)(\*{1})([^\n*]+?)(\1)(?!\*|\\)/g,'<span style="color:cyan"><b>$1</b></span><i>$2</i><span style="color:cyan"><b>$3</b></span>')).replace(/^((?:[└├│─ ]*​)*)(-)( )/gm,'$1<span style="color: rgb(255,215,0)">•</span>$3')).replace(/^((?:[└├│─ ]*​)*)(\*)( )(?!.*\*)/gm,'$1<span style="color: rgb(255,215,0)">•</span>$3')).replace(/^((?:[└├│─ ]*​)*)([0-9]+\.)( )/gm,'$1<span style="color: rgb(255,215,0)"><b>$2</b></span>$3')).replace(/(?<!\_|\\)(\_{2})([^\n_]+?)(\1)(?!\_|\\)/g,'<span style="color:cyan"><b>$1</b></span><u>$2</u><span style="color:cyan"><b>$3</b></span>')).replace(/(?<!\||\\)(\|{2})([^\n\|]+?)(\1)(?!\||\\)/g,'<span style="color:cyan"><b>$1</b></span><a style="z-index: 4; pointer-events: all; position: relative;" href="#s" title="$2"><span style="font-size: 0vw;">$2</span></a><span style="color:cyan"><b>$3</b></span>')).replace(/(?<!\*|\\)(\*{2})([^\n*]+?)(\1)(?!\*|\\)/g,'<span style="color:cyan"><b>$1</b></span><b>$2</b><span style="color:cyan"><b>$3</b></span>')).replace(/(?<!\*|\\)(\*{3})([^\n*]+?)(\1)(?!\*|\\)/g,'<span style="color:cyan"><b>$1</b></span><i><b>$2</b></i><span style="color:cyan"><b>$3</b></span>')).replace(/(?<!\~|\\)(\~{2})([^\n~]+?)(\1)(?!\~|\\)/g,'<span style="color:cyan"><b>$1</b></span><del>$2</del><span style="color:cyan"><b>$3</b></span>')).replace(/(?<!\\|\!)(\^)(.*?)(\^)(?<!\\|\!)/g,'<b>$1</b><span style="display: inline-block; top: -0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;">$2</span><b>$3</b>')).replace(/(?<!\\)(\!\^)(.*?)(\!\^)(?<!\\)/g,'<b>$1</b><span style="display: inline-block; top: 0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;">$2</span><b>$3</b>')).replace(/(?<!\`)(\`{1})([^\n`]+?)(\1)(?!\`)/g,'<span style="color: rgb(232,145,45); background-color: rgb(44, 46, 54);"><b>$1</b>$2<b>$3</b></span>')).replace(/(RE)(\/)((?:[^\r\n\t\f\v ]|\\ )+)(\/)([gmixsuUAJD]*)/g,'<span style="background-color: rgb(44, 46, 54)"><span style="color: rgb(23,159,241)"><b>$1$2</b></span><span style="color: rgb(192,90,81)">$3</span><span style="color: rgb(23,159,241)"><b>$4$5</b></span></span>')).replace(/(\[hc)([0-9abcdef])([0-9abcdef])([0-9abcdef])(\])(.*?)(\1)(\2)(\3)(\4)(\5)/g,function(e,t,r,s,n,a,i,l,o,h,c,d){let u=parseInt(`${r}0`,16),p=parseInt(`${s}0`,16),f=parseInt(`${n}0`,16);return Math.max(u,p,f)>127?`<b>${t}${r}${s}${n}${a}</b><span style="color: #101010; background-color: #${r}0${s}0${n}0;"><b>${i}</b></span><b>${l}${o}${h}${c}${d}</b>`:`<b>${t}${r}${s}${n}${a}</b><span style="background-color: #${r}0${s}0${n}0;"><b>${i}</b></span><b>${l}${o}${h}${c}${d}</b>`})).replace(/(\[tc)([0-9abcdef])([0-9abcdef])([0-9abcdef])(\])(.*?)(\1)(\2)(\3)(\4)(\5)/g,function(e,t,r,s,n,a,i,l,o,h,c,d){return`<b>${t}${r}${s}${n}${a}</b><span style="color: #${r}0${s}0${n}0; text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;"><b>${i}</b></span><b>${l}${o}${h}${c}${d}</b>`})).replace(/[└├│─ ]*​/gm,function(e){return`<span style="color: cyan;">${e}</span>`}),this.ref.innerHTML=e,super.update()}}