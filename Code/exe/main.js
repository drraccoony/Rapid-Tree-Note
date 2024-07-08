/**
Copyright 2023, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is avalible at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

import{Line as t,Fork as e,Bend as r,Gap as s,Data as a,New as n,End as i,Null as l}from"./treeblocks.js";import{URIMannager as o}from"./URI-mannager.js";export default class h{constructor(t,e,r){this.maxURLLength=8192,this.uri=new o,window.main=this;var s=this.pullURL();this.raw=new RawBuffer(t),this.exe=new ExeBuffer(e),this.wrap=r,this.state="UNLOCKED",this.raw.ref.addEventListener("keydown",t=>this.keyPreRouter(t)),this.raw.ref.addEventListener("input",()=>this.keyPostRouter()),this.raw.ref.addEventListener("copy",t=>this.handleCopy(t)),this.raw.ref.addEventListener("click",t=>this.urlPreEncodeOnIdle(t)),this.raw.ref.addEventListener("paste",t=>this.handlePaste(t)),this.raw.ref.addEventListener("keydown",t=>this.syncScrollbars(t)),this.raw.ref.addEventListener("click",t=>this.syncScrollbars(t)),document.addEventListener("wheel",t=>this.scaleTextOnZoom(t),{passive:!1}),this.intervalUpdater=setInterval(()=>this.intervalUpdate(),1e3),this.focused=!0,document.addEventListener("visibilitychange",t=>this.focusToggle(t)),window.addEventListener("beforeunload",t=>this.safeShutdown(t)),this.setURL(s),this.keyPostRouter(),this.syncScrollbars(),this.handlePaste(),""!=s&&null!=s&&(document.title=this.exe.ref.textContent.split("\n")[0].substring(0,32))}debugDump(){console.debug("=====STARTING=DEBUG=DUMP====="),console.debug("Source Value:"),console.debug(this.raw.ref.value.replaceAll("\n","\\n").replaceAll("	","\\t")),console.debug("-----------------"),console.debug("Display Value:"),console.debug(this.exe.ref.innerHTML.replaceAll("\n","\\n").replaceAll("	","\\t")),console.debug("=====END=DEBUG=DUMP=====")}safeShutdown(t){clearInterval(this.intervalUpdater),console.debug("RTN Safe Shutdown Complete.")}focusToggle(t){this.focused=!this.focused,"hidden"===document.visibilityState?this.focused=!1:"visible"===document.visibilityState&&(this.focused=!0)}scaleTextOnZoom(t){if(!t.ctrlKey)return;t.preventDefault();let e=parseFloat(document.getElementById("display").style.fontSize),r=parseFloat(document.getElementById("display").style.top),s=parseFloat(document.getElementById("source").style.fontSize);t.deltaY>0&&(e=Math.max(.5,e-.1),s=Math.max(.5,s-.1)),t.deltaY<0&&(e=Math.min(2,e+.1),s=Math.min(2,s+.1)),r=-1*e,document.getElementById("display").style.fontSize=e+"vw",document.getElementById("source").style.fontSize=s+"vw",document.getElementById("display").style.top=r+"vw"}intervalUpdate(){this.focused&&this.keyPostRouter()}darkenBorder(){var t=document.getElementById("display").style.border;if(""!=t){var e=parseInt(t.substring(14,17));if(0==e){clearInterval(this.outlineInterval);return}e=Math.max(e-5,0),document.getElementById("display").style.border=`4px solid rgb(${e},${e},${e})`}}urlPreEncodeOnIdle(){let t=8192*Math.random()+0;this.shouldEncode=t,setTimeout(()=>this.urlPostEncodeOnIdle(t),1e3)}urlPostEncodeOnIdle(t){this.shouldEncode==t&&(this.pushURL(),document.getElementById("display").style.border="4px solid rgb(255,255,255)",this.outlineInterval=setInterval(()=>this.darkenBorder(),10))}pullURL(){return this.uri.pull()}setURL(t){""!=t?this.raw.ref.value=t:this.raw.ref.value="Rapid Tree Notetaker\n	What is this?\n		The Rapid Tree Notetaker (RTN) is a notetaking tool developed by computer science student Brendan Rood at the University of Minnesota Duluth.\n		It aims to provide an easy way to take notes formatted similar to a Reddit thread, with indentation following a tree-like structure allowing for grouping.\n		It also prioritizes ease of sharing, as the URL can be shared to instantly communicate the note's contents.\n			Notice how the border is flashing?\n			Every time you see that, it means that the document has been saved to the URL!\n			If the URL ever becomes longer than 8192 characters, it will alert you that saving is no longer possible.\n		It is free to use and will never ask you to log in.\n	Sample\n		Edit this text\n		to generate\n			a\n			document\n		formatted\n			like a tree!\n			:3\n	Misc. Instructions\n		Indentation\n			Use TAB to indent\n			Supports block indentation editing\n		Text Formatting\n			*You can wrap text with single asterisks to make it italic*\n			**You can wrap text with double asterisks to make it bold**\n			***You can wrap text in triple asterisks to make it both bold and italic***\n			__You can wrap text in double underscores to make it underlined__\n			You can wrap text in double vertical lines to apply a spoiler\n				Hover to reveal -> ||The cake is a Lie||\n			`You can wrap text in backticks to mark it as computer code`\n			RE/Regular\\ Expressions\\ will\\ be\\ formatted\\ .*[^7]/gmU - **Make sure to escape spaces!**\n			~~You can wrap text with double tildes to strike it though~~\n			- Starting a line with a dash or a single asterisk will turn it into a bullet point\n			69. Start a line with a number and a period to format it as an ordered list\n			[You can declare a link title](and a link address) to create a link\n				Normal links will also become clickable - EX: https://google.com\n			You can wrap text with carets to make it ^superscript^ text\n			You can wrap text with exclamation-point carets to make it !^subscript!^ text\n		Color Control\n			Text color can be manually controlled via a glyph in the format [tc###]...text here...[tc###]\n			Color can be specified with 3 hex values in the place of the #'s, 4-bit color depth.\n				[tcf00] red text; with red 100%, green 0%, blue 0% [tcf00]\n				[tc0fa]turquoise text; with red 0%, green 100%, blue 62.5%[tc0fa]\n		Directory-Style Document Navigation Links\n			The RTN allows you to link to other locations in the same document via a directory-style link\n			For Example, DNL./../../../[Samp]/[2]/[1] will bring you to the smiley face in this document\n			Note that DirNav links always start with `DNL./`, `DL./`, or `RTN./`, followed by 1 or more navigational tokens\n				`..` - Navigate to the PARENT\n				`[0-9]` - Navigate to the CHILD at the provided Index. (Uses 0-Index Base)\n				`[.*]` - Navigate to the CHILD who's value starts with the provided string\n			DNL./[Invalid links will do nothing when clicked, and will appear RED]"}pushURL(){var t=this.exe.ref.textContent.replace(/[\s]+$/,"");this.exe.tree.input=t,this.exe.tree.totalParse(),t=(t=(t=(t=(t=(t=this.exe.tree.output).replace(/├────── ​/gm,"├── ​")).replace(/└────── ​/gm,"└── ​")).replace(/│       ​/gm,"│   ​")).replace(/        ​/gm,"    ​")).replace(/<[^>]*>/g,""),console.debug(t),this.uri.push(t),document.title=this.exe.ref.textContent.split("\n")[0].substring(0,32)}keyPreRouter(t){this.raw.keyHandler(t,t=>this.keyPostRouter(t)),this.urlPreEncodeOnIdle()}keyPostRouter(){this.raw.update(),this.exe.ref.innerHTML=this.raw.ref.value.replace(/\</g,"&lt;").replace(/\>/g,"&gt;"),this.exe.update(),this.syncScrollbars()}handlePaste(t){setTimeout(t=>this.syncScrollbars(t),100),setTimeout(()=>{this.raw.ref.value=this.raw.ref.value.replace(/├────── |│       |└────── |        /gm,"	"),this.raw.ref.value=this.raw.ref.value.replace(/├── |│   |└── |    /gm,"	")},100)}handleCopy(t){t.preventDefault(),this.keyPostRouter();var e=this.raw.ref.selectionStart,r=this.raw.ref.value.substring(0,e),s=u(r),a=this.raw.ref.selectionEnd,n=this.raw.ref.value.substring(e,a),i=u(n),l=this.raw.ref.selectionStart+8*s,o=this.raw.ref.selectionEnd+8*s+8*i,h=this.exe.ref.textContent.substring(l,o);function u(t){var e=t.match(/\t/gm);return null!=e?e.length:0}this.exe.tree.input=h,this.exe.tree.totalParse(),h=(h=(h=(h=(h=(h=(h=this.exe.tree.output).replace(/├────── ​/gm,"├── ​")).replace(/└────── ​/gm,"└── ​")).replace(/│       ​/gm,"│   ​")).replace(/        ​/gm,"    ​")).replace(/(\s*)(•)(.*)/gm,"$1-$3")).replace(/\s$/,""),navigator.clipboard.writeText(h)}syncScrollbars(t){let e=document.getElementById("display"),r=document.getElementById("source"),s=document.getElementById("main"),a=document.getElementById("header");s.style.top=`${a.offsetHeight+10}px`;let n=`${e.offsetHeight+50}px`,i=`${e.offsetWidth+s.offsetLeft}px`;s.style.height=n,s.style.width=i,r.style.height=`${e.offsetHeight}px`,r.style.width=`${e.offsetWidth+s.offsetLeft}px`,s.style.minWidth=`${a.offsetWidth}px`,r.style.minWidth=`${a.offsetWidth}px`,e.style.minWidth=`${a.offsetWidth}px`}hardFix(){this.raw.update(),this.exe.ref.tree.input=this.raw.ref.value,this.exe.tree.totalParse(),this.exe.update();var t=this.raw.ref.selectionStart,e=this.raw.ref.selectionEnd;this.raw.ref.value=this.exe.tree.content.substring(0,this.exe.tree.content.length-1),this.raw.update(),this.exe.ref.textContent=this.raw.ref.value,this.exe.tree.totalParse(),this.exe.update(),this.raw.ref.selectionStart=t,this.raw.ref.selectionEnd=e}dirnav(t,e,r,s=!1){if(s||t.preventDefault(),!0==document.getElementById("source").hidden){t.preventDefault();return}var a=this.raw.ref.value.split("\n"),n=a.length-1,i=r,l=e.split("/").filter(t=>null!=t&&""!==t&&"DNL."!==t&&"RTN."!=t&&"DL."!=t),o={Payload:e,Index:r,Lines:a,LowerBound:0,UpperBound:n,Actions:l};for(console.debug(o.Actions);0!=l.length;)if(".."==l[0]){var h=x(a[i])-1;if(h<0)return console.error("DirNav called for invalid Indent Level "+h,o),!1;for(;i>=0&&x(a[i])!=h;)i--;if(i<0)return console.error("DirNav could not find a proper parent...",o),!1;l.shift()}else{var u=x(a[i]);if(l[0].match(/\[[0-9]*\]/)){for(var d=parseInt(l[0].substring(1,l[0].length-1),10),c=-1;c<d&&i<=n;){if(x(a[++i])<=u)return console.error("DirNav failed to find a child of index ["+d+"] before exhausting the domain!",o),!1;x(a[i])==u+1&&c++}l.shift()}else{let p=l[0].substring(1,l[0].length-1).replace(/^([^a-zA-Z0-9]*)(.*)/,"$2"),f=RegExp("^\\s*[^a-zA-Z0-9]*"+p+".*");for(;!a[i].match(f)&&i<=n;)if(x(a[++i])<=u){if(p.startsWith("Invalid links will do nothing when clicked"))return!1;return console.error("DirNav failed to find a child of key ["+p+"] before exhausting the domain!",o),!1}l.shift()}}if(s)return!0;for(var g="",v=0;v<i;v++)g+=a[v]+"\n";var b,y,$=(g=g.substring(0,g.length-1)).length,m=a[i].match(/^(\s*)([^\n]*)/),w=m[1].length,_=m[2].length;return this.raw.start=$+w,this.raw.end=$+w+_,0!=this.raw.start&&(this.raw.start++,this.raw.end++),this.raw.ref.focus(),this.raw.writeCarrat(),b=this.raw.ref,(y=document.createElement("div")).style.position="absolute",y.style.color="red",y.style.padding="5px",y.style.wordBreak="normal",y.style.whiteSpace="pre-wrap",y.style.border="solid 4px transparent",y.style.fontSize=document.getElementById("source").style.fontSize,document.getElementById("main").appendChild(y),y.innerHTML=b.value.substring(0,b.selectionEnd)+'<span id="dirNavCarrat"></span>',document.getElementById("dirNavCarrat").scrollIntoView(),window.scrollBy(0,-1*document.getElementById("header").offsetHeight-24),document.getElementById("dirNavCarrat").remove(),document.getElementById("main").removeChild(y),!0;function x(t){return null==t||""==t?0:t.split("	").length-1}}};class LevelNode{constructor(t,e){this.level=t,this.value=e}}class ProcessingTree{constructor(t){this.input=t,this.nodes=[],this.blocks=[],this.output=""}toNodes(){var t=this.input.split("\n");for(var e of t){var r=a(e);e=s(e),this.nodes.push(new LevelNode(r,e))}function s(t){var e=t;return e.replaceAll(/\t/g,"")}function a(t){var e=t.match(/^\t*(\t)/gm);return null!=e?e[0].length:0}}toBlocks(){for(var t of this.nodes){for(var e=[],r=0;r<t.level;r++)e.push(new n);""==t.value?e.push(new i):e.push(new a(t.value)),this.blocks.push(e)}}parseNewBlocks(){for(var a=this.blocks,n=0;n<a.length;n++)for(var i=0;i<a[n].length;i++){var l="";if(""==l&&"Data"==p(n,i,a)&&(l="Data"),""==l){var o=null;if("Data"==p(n,i+1,a)&&(("Null"==p(n+1,i,a)||"Data"==p(n+1,i,a))&&(o=!0),null==o)){var h=d(n,i,a),u=c(n,i,a);function d(t,e,r){for(var s=0;t<r.length&&!(t+1>r.length-1);){var a=p(t+1,e,r);if("Data"==a||"Null"==a)break;s++,t++}return s}function c(t,e,r){for(var s=0;t<r.length&&!(t+1>r.length-1);){var a=p(t+1,e+1,r);if("Data"==a||"Null"==a)break;s++,t++}return s}o=h<=u}o&&(a[n][i]=new r,l="Fork")}""==l&&"Data"==p(n,i+1,a)&&(a[n][i]=new e,l="Fork"),""==l&&("Gap"==p(n-1,i,a)||"Bend"==p(n-1,i,a))&&(a[n][i]=new s,l="Gap"),""==l&&("Line"==p(n-1,i,a)||"Fork"==p(n-1,i,a))&&(a[n][i]=new t,l="Line")}function p(t,e,r){return t<0||e<0||r.length-1<t||r[t].length-1<e?"Null":r[t][e].type}this.blocks=a}toString(){for(var t="",e=this.blocks,r=0;r<e.length;r++){for(var s=0;s<e[r].length;s++)t+=e[r][s].data;t+="\n"}this.output=t}totalParse(){this.nodes=[],this.blocks=[],this.output="",this.toNodes(),this.toBlocks(),this.parseNewBlocks(),this.toString()}}class VirtualBuffer{constructor(t){this.ref=t,this.start=t.selectionStart,this.end=t.selectionEnd,this.state="UNLOCKED"}writeCarrat(){this.ref.selectionStart=this.start,this.ref.selectionEnd=this.end}readCarrat(){this.start=this.ref.selectionStart,this.end=this.ref.selectionEnd}moveCarrat(t){this.start+=t,this.end+=t,this.writeCarrat()}countCaretLeft(){var t=this.ref.value.substring(0,this.start).split("\n");return t[t.length-1].split("	").length-1}keyHandler(t,e){if(void 0==t&&(t={key:"none"}),"LOCKED"==this.state){setTimeout(()=>{this.keyHandler(t,e)},10);return}if(this.readCarrat(),"Tab"==t.key){if(t.preventDefault(),this.start==this.end)u(this.ref.value,this.start)&&(this.ref.value=this.ref.value.substring(0,this.start)+"	"+this.ref.value.substring(this.end),this.moveCarrat(1));else{for(var r=this.start,s=this.end-1;"\n"!=this.ref.value.substring(r,r+1)&&r>0;)r--;for(;"\n"!=this.ref.value.substring(s,s+1)&&s>0;)s--;var a=[],n=r;for(a.push(r);n<s-1;)n++,"\n"==this.ref.value.substring(n,n+1)&&a.push(n);if(s!=r&&a.push(s),t.shiftKey){var i=0;for(var l of a)"	"==this.ref.value.substring(l+i+1,l+i+2)&&(this.ref.value=this.ref.value.substring(0,l+i+1)+""+this.ref.value.substring(l+i+2),i--,this.ref.selectionStart=l+i,this.ref.selectionEnd=l+i)}else{var i=0;for(var l of a)u(this.ref.value,l+i+1)&&(this.ref.value=this.ref.value.substring(0,l+i+1)+"	"+this.ref.value.substring(l+i+1),i++,this.ref.selectionStart=l+i,this.ref.selectionEnd=l+i)}}}if("Enter"==t.key&&(t.preventDefault(),function t(e,r){var s=e.substring(0,r).split("\n"),a=l(s[s.length-1])>0,n=e.split("\n")[s.length];null==n&&(n="PROCEED");var i=l(n)>0;return!0==a&&!0==i;function l(t){var e=t.match(/\S/gm);return null!=e?e.length:0}}(this.ref.value,this.start))){var o=this.countCaretLeft();this.ref.value=this.ref.value.substring(0,this.start)+"\n"+this.ref.value.substring(this.end),this.moveCarrat(1);for(var h=0;h<o;h++)this.ref.value=this.ref.value.substring(0,this.start)+"	"+this.ref.value.substring(this.end),this.moveCarrat(1)}function u(t,e){var r=(t=t.substring(0,e)).split("\n"),s=r[r.length-1],a="";r.length>1&&(a=r[r.length-2]);var n=t.substring(e-1,e),i=l(s)<=l(a);return("	"==n||"\n"==n)&&i;function l(t){var e=t.match(/^\t*(\t)/gm);return null!=e?e[0].length:0}}this.state="LOCKED",setTimeout(()=>{e()},10)}update(){this.state="UNLOCKED",this.readCarrat()}}class RawBuffer extends VirtualBuffer{constructor(t){super(t)}update(){this.ref.value=this.ref.value.replace(/[└├│─ ]*​/gm,"	"),this.ref.value=this.ref.value.replace(/(?:\t+[\S ]+)(\t+)/gm,"	"),super.update()}}class ExeBuffer extends VirtualBuffer{constructor(t){super(t),this.tree=new ProcessingTree("")}update(){this.tree.input=this.ref.textContent,this.tree.totalParse();for(var t=this.tree.output,e=(t=(t=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")).replace(/(\[(.+?)\]\((.+?)\))|(https?:\/\/\S+)/g,function(t,e,r,s,a){return s?`<a style="z-index: 4; pointer-events: all; position: relative;" href="${s}"><b>[${r}](${s})</b></a>`:`<a style="z-index: 4; pointer-events: all; position: relative;" href="${a}"><b>${a}</b></a>`})).split("\n"),r=0;r<e.length;r++)window.dirnavIndex=r,e[r]=e[r].replace(/(DNL|RTN|DL)(\.)((?:\/\.\.|\/\[[^\]]+\])+)(\/?)/g,function(t,e,r,s,a){var n=window.main.dirnav(null,e+r+s+a,window.dirnavIndex,!0)?"#52eb00":"#ff5555";let i=`<a style="z-index: 4; pointer-events: all; position: relative; color: ${n};" href="#" onclick="window.main.dirnav(event, '${e+r+s+a}', ${window.dirnavIndex});"><b>${e+r+s+a}</b></a>`;return i});var s="";for(var a of e)s+=a+"\n";t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=s=s.substring(0,s.length-1)).replace(/(?<!\*|\\)(\*{1})([^\n*]+?)(\1)(?!\*|\\)/g,'<span style="color:cyan"><b>$1</b></span><i>$2</i><span style="color:cyan"><b>$3</b></span>')).replace(/^((?:[└├│─ ]*​)*)(-)( )/gm,'$1<span style="color: rgb(255,215,0)">•</span>$3')).replace(/^((?:[└├│─ ]*​)*)(\*)( )(?!.*\*)/gm,'$1<span style="color: rgb(255,215,0)">•</span>$3')).replace(/^((?:[└├│─ ]*​)*)([0-9]+\.)( )/gm,'$1<span style="color: rgb(255,215,0)"><b>$2</b></span>$3')).replace(/(?<!\_|\\)(\_{2})([^\n_]+?)(\1)(?!\_|\\)/g,'<span style="color:cyan"><b>$1</b></span><u>$2</u><span style="color:cyan"><b>$3</b></span>')).replace(/(?<!\||\\)(\|{2})([^\n\|]+?)(\1)(?!\||\\)/g,'<span style="color:cyan"><b>$1</b></span><a style="z-index: 4; pointer-events: all; position: relative;" href="#s" title="$2"><span style="font-size: 0px;">$2</span></a><span style="color:cyan"><b>$3</b></span>')).replace(/(?<!\*|\\)(\*{2})([^\n*]+?)(\1)(?!\*|\\)/g,'<span style="color:cyan"><b>$1</b></span><b>$2</b><span style="color:cyan"><b>$3</b></span>')).replace(/(?<!\*|\\)(\*{3})([^\n*]+?)(\1)(?!\*|\\)/g,'<span style="color:cyan"><b>$1</b></span><i><b>$2</b></i><span style="color:cyan"><b>$3</b></span>')).replace(/(?<!\~|\\)(\~{2})([^\n~]+?)(\1)(?!\~|\\)/g,'<span style="color:cyan"><b>$1</b></span><del>$2</del><span style="color:cyan"><b>$3</b></span>')).replace(/(?<!\\|\!)(\^)(.*?)(\^)(?<!\\|\!)/g,'<b>$1</b><span style="display: inline-block; top: -0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;">$2</span><b>$3</b>')).replace(/(?<!\\)(\!\^)(.*?)(\!\^)(?<!\\)/g,'<b>$1</b><span style="display: inline-block; top: 0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;">$2</span><b>$3</b>')).replace(/(?<!\`)(\`{1})([^\n`]+?)(\1)(?!\`)/g,'<span style="color: rgb(232,145,45); background-color: rgb(44, 46, 54);"><b>$1</b>$2<b>$3</b></span>')).replace(/(RE)(\/)((?:[^\r\n\t\f\v ]|\\ )+)(\/)([gmixsuUAJD]*)/g,'<span style="background-color: rgb(44, 46, 54)"><span style="color: rgb(23,159,241)"><b>$1$2</b></span><span style="color: rgb(192,90,81)">$3</span><span style="color: rgb(23,159,241)"><b>$4$5</b></span></span>')).replace(/(\[tc)([0-9abcdef])([0-9abcdef])([0-9abcdef])(\])(.*?)(\1)(\2)(\3)(\4)(\5)/g,function(t,e,r,s,a,n,i,l,o,h,u,d){return`<b>${e}${r}${s}${a}${n}</b><span style="color: #${r}0${s}0${a}0;">${i}</span><b>${l}${o}${h}${u}${d}</b>`})).replace(/[└├│─ ]*​/gm,function(t){return`<span style="color: cyan;">${t}</span>`}),this.ref.innerHTML=t,super.update()}}