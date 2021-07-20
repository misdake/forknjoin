!function(e){var t={};function s(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=e,s.c=t,s.d=function(e,t,o){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(s.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)s.d(o,r,function(t){return e[t]}.bind(null,r));return o},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=5)}([function(e,t,s){"use strict";var o;Object.defineProperty(t,"__esModule",{value:!0}),t.LayerId=t.Action=t.SoundAsset=t.FORKJOIN_PLAYER_MAPPING=t.PLAYER_FORK_MAPPING=t.PLAYER_JOIN_MAPPING=t.ImageAsset=void 0,function(e){e.placeholder="placeholder.png",e.player_u="player_u.png",e.player_d="player_d.png",e.player_l="player_l.png",e.player_r="player_r.png",e.fork_u="fork_u.png",e.fork_d="fork_d.png",e.fork_l="fork_l.png",e.fork_r="fork_r.png",e.join_u="join_u.png",e.join_d="join_d.png",e.join_l="join_l.png",e.join_r="join_r.png",e.crack_1="crack_1.png",e.crack_2="crack_2.png",e.crack_3="crack_3.png",e.crate_wood="crate_wood.png",e.crate_metal="crate_metal.png",e.target_wood_1="target_wood_1.png",e.target_wood_2="target_wood_2.png",e.target_metal_1="target_metal_1.png",e.target_metal_2="target_metal_2.png",e.target_player_1="target_player_1.png",e.target_player_2="target_player_2.png",e.wall="wall.png",e.bg1="bg1.png",e.bg2="bg2.png",e.bg3="bg3.png",e.bg4="bg4.png"}(o=t.ImageAsset||(t.ImageAsset={})),t.PLAYER_JOIN_MAPPING=new Map([[o.fork_u,o.join_u],[o.fork_d,o.join_d],[o.fork_l,o.join_l],[o.fork_r,o.join_r],[o.join_u,o.join_u],[o.join_d,o.join_d],[o.join_l,o.join_l],[o.join_r,o.join_r],[o.player_u,o.join_u],[o.player_d,o.join_d],[o.player_l,o.join_l],[o.player_r,o.join_r]]),t.PLAYER_FORK_MAPPING=new Map([[o.fork_u,o.fork_u],[o.fork_d,o.fork_d],[o.fork_l,o.fork_l],[o.fork_r,o.fork_r],[o.join_u,o.fork_u],[o.join_d,o.fork_d],[o.join_l,o.fork_l],[o.join_r,o.fork_r],[o.player_u,o.fork_u],[o.player_d,o.fork_d],[o.player_l,o.fork_l],[o.player_r,o.fork_r]]),t.FORKJOIN_PLAYER_MAPPING=new Map([[o.fork_u,o.player_u],[o.fork_d,o.player_d],[o.fork_l,o.player_l],[o.fork_r,o.player_r],[o.join_u,o.player_u],[o.join_d,o.player_d],[o.join_l,o.player_l],[o.join_r,o.player_r],[o.player_u,o.player_u],[o.player_d,o.player_d],[o.player_l,o.player_l],[o.player_r,o.player_r]]),function(e){e.fork="fork.wav",e.join="join.wav",e.done="done.wav",e.move="move.wav"}(t.SoundAsset||(t.SoundAsset={})),function(e){e[e.up=1]="up",e[e.down=2]="down",e[e.left=3]="left",e[e.right=4]="right",e[e.idle=5]="idle",e[e.undo=6]="undo",e[e.redo=7]="redo",e[e.fork=10]="fork",e[e.join=11]="join",e[e.restart=20]="restart"}(t.Action||(t.Action={})),function(e){e[e.bg=1]="bg",e[e.crack=2]="crack",e[e.crate=3]="crate",e[e.target=4]="target",e[e.fork=5]="fork",e[e.player=6]="player",e[e.wall=7]="wall"}(t.LayerId||(t.LayerId={}))},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.H=t.W=t.TILE_SIZE=void 0,t.TILE_SIZE=64,t.W=9,t.H=9},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ImageAssets=void 0;const o=s(0);class r{static init(){let e=Object.values(o.ImageAsset);return Promise.all(e.map(e=>(console.log("loaded image",e),new Promise(t=>{let s=new Image;s.src="assets/"+e,r.images.set(e,s),s.onload=()=>{t()},s.onerror=()=>{console.log("image onerror, use fallback: ",e),s.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="}}))))}static get(e){return r.images.get(e.valueOf())}}t.ImageAssets=r,r.images=new Map},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.startLevel=t.levels=t.ALL_CELL_TYPES=t.CELL_LAYER_MAPPING=t.CELL_IMAGE_MAPPING=t.o=t.w=t.c=t.Z=t.Y=t.X=t.V=t.U=t.P=void 0;const o=s(0);t.P=1,t.U=2,t.V=3,t.X=4,t.Y=5,t.Z=6,t.c=7,t.w=8,t.o=9,t.CELL_IMAGE_MAPPING=[],t.CELL_IMAGE_MAPPING[t.P]=o.ImageAsset.player_d,t.CELL_IMAGE_MAPPING[t.U]=o.ImageAsset.crate_wood,t.CELL_IMAGE_MAPPING[t.V]=o.ImageAsset.crate_metal,t.CELL_IMAGE_MAPPING[t.X]=o.ImageAsset.target_wood_1,t.CELL_IMAGE_MAPPING[t.Y]=o.ImageAsset.target_metal_1,t.CELL_IMAGE_MAPPING[t.Z]=o.ImageAsset.target_player_1,t.CELL_IMAGE_MAPPING[t.c]=o.ImageAsset.crack_1,t.CELL_IMAGE_MAPPING[t.w]=o.ImageAsset.wall,t.CELL_LAYER_MAPPING=[],t.CELL_LAYER_MAPPING[t.P]=o.LayerId.player,t.CELL_LAYER_MAPPING[t.U]=o.LayerId.crate,t.CELL_LAYER_MAPPING[t.V]=o.LayerId.crate,t.CELL_LAYER_MAPPING[t.X]=o.LayerId.target,t.CELL_LAYER_MAPPING[t.Y]=o.LayerId.target,t.CELL_LAYER_MAPPING[t.Z]=o.LayerId.target,t.CELL_LAYER_MAPPING[t.c]=o.LayerId.crack,t.CELL_LAYER_MAPPING[t.w]=o.LayerId.wall,t.ALL_CELL_TYPES=[t.P,t.U,t.V,t.X,t.Y,t.o,t.w],function(){let e=window;e.P=t.P,e.U=t.U,e.V=t.V,e.X=t.X,e.Y=t.Y,e.Z=t.Z,e.c=t.c,e.w=t.w,e.o=t.o}(),t.levels=[{name:"Sokoban",maxtime:-1,startimes:[20,15,13],besttime:13,showkey:!1,map:[t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.X,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.o,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.U,t.w,t.w,t.w,t.w,t.P,t.o,t.o,t.o,t.o,t.o,t.o,t.o,t.Z,t.w,t.w,t.w,t.w,t.V,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.o,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.Y,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w]},{name:"Wood and Metal",maxtime:-1,startimes:[30,24,17],besttime:17,showkey:!1,map:[t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.o,t.o,t.o,t.o,t.o,t.o,t.o,t.w,t.w,t.o,t.o,t.o,t.o,t.o,t.o,t.o,t.w,t.w,t.o,t.o,t.U,t.o,t.Y,t.o,t.o,t.w,t.P,t.c,t.o,t.o,t.o,t.o,t.o,t.c,t.Z,t.w,t.o,t.o,t.V,t.o,t.X,t.o,t.o,t.w,t.w,t.o,t.o,t.o,t.o,t.o,t.o,t.o,t.w,t.w,t.o,t.o,t.o,t.o,t.o,t.o,t.o,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w]},{name:"K to Fork<br>Then J to Join",maxtime:-1,startimes:[30,22,15],besttime:15,showkey:!0,map:[t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.o,t.o,t.o,t.o,t.U,t.o,t.X,t.w,t.w,t.c,t.w,t.w,t.w,t.o,t.w,t.w,t.w,t.P,t.o,t.w,t.w,t.w,t.o,t.o,t.o,t.Z,t.w,t.c,t.w,t.w,t.w,t.o,t.w,t.w,t.w,t.w,t.o,t.o,t.o,t.o,t.V,t.o,t.Y,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w]},{name:"Help each other",maxtime:-1,startimes:[30,25,17],besttime:17,showkey:!0,map:[t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.o,t.o,t.o,t.c,t.o,t.o,t.o,t.w,t.w,t.o,t.w,t.w,t.U,t.w,t.w,t.w,t.w,t.P,t.o,t.w,t.w,t.o,t.w,t.o,t.o,t.Z,t.w,t.o,t.w,t.w,t.o,t.w,t.o,t.o,t.w,t.w,t.o,t.o,t.o,t.o,t.o,t.o,t.X,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w]},{name:"Insider",maxtime:-1,startimes:[50,38,33],besttime:31,showkey:!0,map:[t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.o,t.w,t.w,t.w,t.o,t.o,t.w,t.w,t.w,t.o,t.U,t.o,t.o,t.o,t.o,t.o,t.w,t.P,t.o,t.U,t.w,t.X,t.X,t.w,t.o,t.Z,t.w,t.o,t.o,t.o,t.o,t.w,t.w,t.o,t.w,t.w,t.o,t.o,t.o,t.o,t.w,t.w,t.o,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w]},{name:"Corner",maxtime:-1,startimes:[120,70,50],besttime:37,showkey:!0,map:[t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.o,t.w,t.w,t.w,t.o,t.o,t.w,t.w,t.w,t.o,t.V,t.o,t.o,t.o,t.o,t.o,t.w,t.P,t.o,t.U,t.w,t.Y,t.X,t.w,t.o,t.Z,t.w,t.o,t.o,t.o,t.o,t.w,t.w,t.o,t.w,t.w,t.o,t.o,t.o,t.o,t.w,t.w,t.o,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w]},{name:"One more",maxtime:-1,startimes:[150,110,85],besttime:78,showkey:!0,map:[t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.o,t.w,t.w,t.w,t.o,t.o,t.w,t.w,t.w,t.o,t.V,t.o,t.X,t.o,t.o,t.o,t.w,t.P,t.o,t.U,t.w,t.Y,t.X,t.w,t.o,t.Z,t.w,t.o,t.U,t.o,t.o,t.w,t.w,t.o,t.w,t.w,t.o,t.o,t.o,t.o,t.w,t.w,t.o,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w]},{name:"Kill-stealing",maxtime:-1,startimes:[200,130,110],showkey:!0,map:[t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.o,t.o,t.o,t.w,t.w,t.w,t.o,t.w,t.w,t.o,t.U,t.U,t.X,t.X,t.w,t.o,t.w,t.w,t.P,t.U,t.o,t.X,t.X,t.V,t.o,t.w,t.w,t.o,t.o,t.w,t.U,t.Y,t.o,t.o,t.Z,t.w,t.o,t.o,t.o,t.o,t.w,t.o,t.o,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w]},{name:"Teamwork<br>80 turns",maxtime:80,startimes:[80,70,62],showkey:!0,map:[t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.o,t.o,t.o,t.w,t.o,t.o,t.o,t.w,t.w,t.P,t.X,t.X,t.o,t.U,t.U,t.o,t.w,t.w,t.o,t.X,t.V,t.o,t.U,t.Y,t.o,t.w,t.w,t.o,t.V,t.V,t.o,t.Y,t.Y,t.o,t.Z,t.w,t.o,t.o,t.o,t.w,t.o,t.o,t.o,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w,t.w]}],t.startLevel=0},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SoundAssets=void 0;const o=s(0);class r{static init(){window.play1=()=>r.play(o.SoundAsset.done),window.play2=()=>r.play(o.SoundAsset.fork),window.play3=()=>r.play(o.SoundAsset.join);let e=Object.values(o.SoundAsset);return Promise.all(e.map(e=>(console.log("loaded sound",e),new Promise(t=>{let s=new XMLHttpRequest;s.open("GET","assets/"+e,!0),s.responseType="arraybuffer",s.onload=function(){r.context.decodeAudioData(s.response).then(s=>{r.sounds.set(e,s),t()}).catch(()=>{t()})},s.send()}))))}static play(e){console.log(e);let t=r.sounds.get(e.valueOf());if(t){let e=r.context.createBufferSource();e.buffer=t,e.connect(r.context.destination),e.start()}}}t.SoundAssets=r,r.context=new AudioContext,r.sounds=new Map},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=s(2),r=s(6),a=s(1),i=s(0),l=s(4);let n=document.getElementById("container"),w=document.getElementById("canvas"),c=w.getContext("2d"),d=document.getElementsByClassName("hint"),h=a.TILE_SIZE*a.W,y=a.TILE_SIZE*a.H;w.width=h,w.height=y,w.style.width=h+"px",w.style.height=y+"px";for(let e of d){let t=e;t.style.width=h+"px",t.style.height=y+"px"}n.style.width=h+150+"px",n.style.height=y+"px",c.clearRect(0,0,h,y),c.strokeStyle="gray",c.strokeRect(0,0,h,y),"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?(document.getElementById("touchbuttons").style.display="block",document.getElementById("keymap").style.display="none"):(document.getElementById("touchbuttons").style.display="none",document.getElementById("keymap").style.display="block"),async function(){await o.ImageAssets.init(),await l.SoundAssets.init(),document.getElementById("loading").style.display="none";let e=new r.Game(w,c);window.onkeypress=t=>{let s=null;switch(t.key){case"w":s=i.Action.up;break;case"a":s=i.Action.left;break;case"s":s=i.Action.down;break;case"d":s=i.Action.right;break;case" ":s=i.Action.idle;break;case"j":s=i.Action.join;break;case"k":s=i.Action.fork;break;case"z":s=i.Action.undo;break;case"x":s=i.Action.redo;break;case"r":s=i.Action.restart}s&&e.update(s)}}()},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Game=void 0;const o=s(7),r=s(1),a=s(10),i=s(0),l=s(3);t.Game=class{constructor(e,t){this.canvas=e,this.context=t,this.map=new o.GameMap(e,t),this.init(),window.loadlevel=e=>{l.levels[0]=e,this.gamelogic.load(0)},this.gamelogic=new a.Gamelogic(this.map),this.gamelogic.load(l.startLevel)}init(){this.map.visitLayer(i.LayerId.bg,e=>{for(let t=0;t<r.W;t++)for(let s=0;s<r.H;s++){let o=Math.floor(4*Math.random())+1,r=i.ImageAsset.placeholder;switch(o){case 1:r=i.ImageAsset.bg1;break;case 2:r=i.ImageAsset.bg2;break;case 3:r=i.ImageAsset.bg3;break;case 4:r=i.ImageAsset.bg4}e.createSprite(t,s,r)}});let e="";for(let t=0;t<l.levels.length;t++)e+=`\n                <div style="position: relative;">\n                    <div class="levelbutton-bg" id="load${t}bg"></div>\n                    <button class="levelbutton" id="load${t}">${t+1}</button>\n                </div>\n\n            `;document.getElementById("levels").innerHTML=e;for(let e=0;e<l.levels.length;e++){let t=document.getElementById("load"+e);t.onclick=()=>{this.gamelogic.load(e),t.blur()}}}update(e){if(this.gamelogic.update(e),this.gamelogic.check()){console.log("levelDone");let e=this.gamelogic.hasNextLevel();e>0?setTimeout(()=>{this.gamelogic.load(e)},1e3):(console.log("all done!"),document.getElementById("alldone").style.display="block")}}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.GameMap=void 0;const o=s(8),r=s(0),a=s(1);t.GameMap=class{constructor(e,t){this.canvas=e,this.context=t;let s=Object.values(r.LayerId);this.layers=[];for(let e of s)"number"==typeof e&&(this.layers[e]=new o.Layer(e))}clearLayers(){this.getLayer(r.LayerId.player).clear(),this.getLayer(r.LayerId.fork).clear(),this.getLayer(r.LayerId.crate).clear(),this.getLayer(r.LayerId.target).clear(),this.getLayer(r.LayerId.wall).clear(),this.getLayer(r.LayerId.crack).clear()}clearMovable(){this.getLayer(r.LayerId.player).clear(),this.getLayer(r.LayerId.fork).clear(),this.getLayer(r.LayerId.crate).clear(),this.getLayer(r.LayerId.crack).clear()}getLayer(e){return this.layers[e.valueOf()]}visitLayer(e,t){let s=this.layers[e.valueOf()];s&&t(s)}getSprite(e,t,...s){if(e<0||e>=a.W)return null;if(t<0||t>=a.H)return null;for(let o of s){let s=this.layers[o];if(s){let o=s.get(e,t);if(o)return o}}return null}isSprite(e,t,s,...o){let r=this.getSprite(t,s,...o);return!!r&&r.asset===e}draw(){let e=this.canvas,t=this.context;t.clearRect(0,0,e.width,e.height),t.strokeStyle="gray",t.strokeRect(0,0,e.width,e.height);for(let s of this.layers)s&&s.draw(e,t)}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Layer=void 0;const o=s(9),r=s(1),a=s(2);t.Layer=class{constructor(e){this.id=e,this.cells=[];for(let e=0;e<r.W;e++){this.cells[e]=[];for(let t=0;t<r.H;t++)this.cells[e][t]=null}this.set=new Set}draw(e,t){for(let e of this.set){let s=a.ImageAssets.get(e.asset);t.globalAlpha=e.alpha,t.drawImage(s,e.x*r.TILE_SIZE,e.y*r.TILE_SIZE,r.TILE_SIZE,r.TILE_SIZE)}}createSpriteWithData(e){return this.createSprite(e.x,e.y,e.asset)}createSprite(e,t,s){this.get(e,t)&&console.log("new sprite target is not empty!");let r=new o.Sprite(s,this);return r.x=e,r.y=t,this.set.add(r),this.cells[e][t]=r,r}deleteSprite(e){this.set.has(e)?(this.set.delete(e),this.cells[e.x][e.y]=null):console.log("sprite is not on layer")}get(e,t){return e<0||e>=r.W||t<0||t>=r.H?null:this.cells[e][t]}is(e,t,s){let o=this.get(e,t);return!o&&!s||o.asset===s}move(e,t,s){if(t<0||t>=r.W)return null;if(s<0||s>=r.H)return null;if(!this.set.has(e))return console.log("sprite is not on this layer!"),!1;return this.get(t,s)?(console.log("move target is not empty!"),!1):(this.cells[e.x][e.y]=null,this.cells[t][s]=e,e.x=t,e.y=s,!0)}clear(){let e=Array.from(this.set);for(let t of e)this.deleteSprite(t)}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Sprite=t.SpriteData=void 0;class o{clone(){let e=new o;return e.x=this.x,e.y=this.y,e.asset=this.asset,e}}t.SpriteData=o;t.Sprite=class extends o{constructor(e,t){super(),this.alpha=1,this.asset=e,this.layer=t}move(e,t){this.layer.move(this,e,t)}toData(){let e=new o;return e.x=this.x,e.y=this.y,e.asset=this.asset,e}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Gamelogic=t.GameStatus=void 0;const o=s(0),r=s(3),a=s(1),i=s(4),l=s(11);class n{constructor(e){this.time=0,this.done=!1,this.soundPlayed=!1,this.player=null,this.forks=[],this.crateWood=[],this.crateMetal=[],this.targetWood=[],this.targetMetal=[],this.targetPlayer=[],this.cracks=[],this.history=new l.History,this.forkStatus="",this.joined=new Set,this.index=e}fromHistoryNode(e,t,s){this.time=e.time,this.forkStatus=e.forkStatus,this.joined=new Set(e.joined),t.clearMovable(),this.player=t.getLayer(o.LayerId.player).createSpriteWithData(e.player),s.isJoin()?this.player.asset=o.PLAYER_JOIN_MAPPING.get(this.player.asset):s.isFork()&&(this.player.asset=o.PLAYER_FORK_MAPPING.get(this.player.asset)),this.cracks=e.cracks.map(e=>t.getLayer(o.LayerId.crack).createSpriteWithData(e)),this.crateWood=e.crateWood.map(e=>t.getLayer(o.LayerId.crate).createSpriteWithData(e)),this.crateMetal=e.crateMetal.map(e=>t.getLayer(o.LayerId.crate).createSpriteWithData(e));let r=this.history.getNodesByTime(e.time);this.forks=r.filter(t=>t!==e&&!this.joined.has(t.forkStatus)).map(e=>({node:e,sprite:t.getLayer(o.LayerId.fork).createSpriteWithData(e.parent.player)}))}toHistoryNode(e){let t=new l.HistoryNode;return t.time=this.time,t.forkStatus=this.forkStatus,t.action=e,t.player=this.player.toData(),t.cracks=this.cracks.map(e=>e.toData()),t.crateWood=this.crateWood.map(e=>e.toData()),t.crateMetal=this.crateMetal.map(e=>e.toData()),t.joined=new Set(this.joined),t}}t.GameStatus=n;let w=null;t.Gamelogic=class{constructor(e){this.map=e}hasNextLevel(){if(this.level){let e=this.level.index+1;if(r.levels[e])return e}return-1}load(e){document.getElementById("alldone").style.display="none",document.getElementById("timehint").style.display="none",document.getElementById("joinhint").style.display="none";let t=r.levels[e];this.level=new n(e),t.map.length!==a.W*a.H&&console.log("map size doesn't match!"),document.getElementById("titlehint").style.opacity="1.0",document.getElementById("title").innerHTML=t.name,document.getElementById("showkey1").style.display=t.showkey?"block":"none",document.getElementById("showkey2").style.display=t.showkey?"block":"none",w&&clearTimeout(w),w=setTimeout(()=>document.getElementById("titlehint").style.opacity="0.0",2e3),this.map.clearLayers();for(let e=0;e<a.H;e++)for(let s=0;s<a.W;s++){let i=s+e*a.W,l=t.map[i],n=r.CELL_LAYER_MAPPING[l],w=r.CELL_IMAGE_MAPPING[l];if(n&&w){let t=this.map.getLayer(n).createSprite(s,e,w);switch(w){case o.ImageAsset.player_d:this.level.player=t;break;case o.ImageAsset.crate_wood:this.level.crateWood.push(t);break;case o.ImageAsset.crate_metal:this.level.crateMetal.push(t);break;case o.ImageAsset.target_wood_1:this.level.targetWood.push(t);break;case o.ImageAsset.target_metal_1:this.level.targetMetal.push(t);break;case o.ImageAsset.target_player_1:this.level.targetPlayer.push(t);break;case o.ImageAsset.crack_1:this.level.cracks.push(t)}}}this.level.history.init(this.level.toHistoryNode(null)),this.check(),this.map.draw(),this.updateUi()}updateUi(){document.getElementById("currentlevel").innerHTML=`${this.level.index+1}. ${r.levels[this.level.index].name}`;let e=r.levels[this.level.index].maxtime,t=this.level.time,s="";t>e&&e>0&&(s=" style='color:red;'");let o="";for(let e of r.levels[this.level.index].startimes)t<=e&&(o+="★");let a=`<span style="color: gold; white-space: pre-wrap;">${o}</span>`;document.getElementById("maxtime").innerHTML=e>0?`Turns: <span${s}>${t}</span> / ${e}<br/>${a}`:`Turns: <span${s}>${t}</span><br/>${a}`;this.level.forkStatus;let i="",l="";this.isFork()&&(i="forked",l=" style='color:red;'"),this.isJoin()&&(i="join",l=" style='color:red;'"),this.level.forkStatus.length&&this.isJoinedTogether()&&(i="joined together!",l=" style='color:green;'"),document.getElementById("joinstatus").innerHTML=`<span${l}>${i}</span>`}update(e){if(!this.level.done){switch(e){case o.Action.up:this.tryMove(0,-1,this.level.player),this.level.player.asset=o.ImageAsset.player_u,this.saveMove(e);break;case o.Action.down:this.tryMove(0,1,this.level.player),this.level.player.asset=o.ImageAsset.player_d,this.saveMove(e);break;case o.Action.left:this.tryMove(-1,0,this.level.player),this.level.player.asset=o.ImageAsset.player_l,this.saveMove(e);break;case o.Action.right:this.tryMove(1,0,this.level.player),this.level.player.asset=o.ImageAsset.player_r,this.saveMove(e);break;case o.Action.idle:this.saveMove(e);break;case o.Action.undo:this.undo();break;case o.Action.redo:this.redo();break;case o.Action.fork:this.level.forks.length||this.fork();break;case o.Action.join:this.join();break;case o.Action.restart:this.load(this.level.index)}this.updateUi(),this.map.draw()}}hasFork(){return this.level.forks.length>0}isJoin(e=this.level.forkStatus){let t=e;return""!==t&&"n"===t.charAt(t.length-1)&&this.hasFork()}isFork(e=this.level.forkStatus){let t=e;return""!==t&&"f"===t.charAt(t.length-1)}isJoinedTogether(e=this.level.forkStatus){let t=e;return""===t||"n"===t.charAt(t.length-1)&&!this.hasFork()}tryMove(e,t,s){let r=s.x,a=s.y,l=r+e,n=a+t;if(this.map.getSprite(l,n,o.LayerId.bg)&&!this.map.getSprite(l,n,o.LayerId.wall))if(this.isPlayerOk(l,n))s.move(l,n);else{let w=this.map.getSprite(l,n,o.LayerId.crate);if(w){let c=r+2*e,d=a+2*t;this.isCrateOk(c,d)&&(s.move(l,n),w.move(c,d),i.SoundAssets.play(o.SoundAsset.move))}}}isPlayerOk(e,t){return this.map.getSprite(e,t,o.LayerId.bg)&&!this.map.getSprite(e,t,o.LayerId.wall,o.LayerId.crate)&&!this.map.isSprite(o.ImageAsset.crack_3,e,t,o.LayerId.crack)}isCrateOk(e,t){return this.map.getSprite(e,t,o.LayerId.bg)&&!this.map.getSprite(e,t,o.LayerId.wall,o.LayerId.player,o.LayerId.crate,o.LayerId.crack)}saveMove(e){this.level.time+=1,this.tick();let t=this.level.toHistoryNode(e);this.level.history.writeNext(t),this.redo()}applyHistoryNode(e){this.level.fromHistoryNode(e,this.map,this),this.forksMove(),this.tick(),this.check(),console.log("time",this.level.time,"forkStatus",this.level.forkStatus)}undo(){this.level.history.undo(e=>{this.applyHistoryNode(e)})}redo(){this.level.history.redo(e=>{this.applyHistoryNode(e)})}fork(){this.level.history.forkNext(),i.SoundAssets.play(o.SoundAsset.fork),this.redo()}join(){this.level.history.backToForkNext(e=>{i.SoundAssets.play(o.SoundAsset.join),this.applyHistoryNode(e)})}tick(){for(let e of this.level.cracks)switch(e.asset){case o.ImageAsset.crack_1:this.map.getSprite(e.x,e.y,o.LayerId.player,o.LayerId.fork)&&(e.asset=o.ImageAsset.crack_2);break;case o.ImageAsset.crack_2:this.map.getSprite(e.x,e.y,o.LayerId.player,o.LayerId.fork)||(e.asset=o.ImageAsset.crack_3)}let e=this.map.getSprite(this.level.player.x,this.level.player.y,o.LayerId.fork);if(e&&this.isJoin()){let t=this.level.forks.find(t=>t.sprite===e);t.node.next||(this.level.joined.add(t.node.forkStatus),i.SoundAssets.play(o.SoundAsset.join),this.level.forks=this.level.forks.filter(t=>t.sprite!==e),this.map.getLayer(o.LayerId.fork).deleteSprite(e),this.isJoinedTogether()&&(this.level.player.asset=o.FORKJOIN_PLAYER_MAPPING.get(this.level.player.asset)))}}forksMove(){this.level.forks.forEach(e=>{switch(e.sprite.alpha=!e.node.next&&this.isJoin()?1:.5,e.sprite.asset=this.isJoin(e.node.forkStatus)?o.PLAYER_JOIN_MAPPING.get(e.sprite.asset):o.PLAYER_FORK_MAPPING.get(e.sprite.asset),e.node.action){case o.Action.up:this.tryMove(0,-1,e.sprite),e.sprite.asset=o.ImageAsset.fork_u;break;case o.Action.down:this.tryMove(0,1,e.sprite),e.sprite.asset=o.ImageAsset.fork_d;break;case o.Action.left:this.tryMove(-1,0,e.sprite),e.sprite.asset=o.ImageAsset.fork_l;break;case o.Action.right:this.tryMove(1,0,e.sprite),e.sprite.asset=o.ImageAsset.fork_r}e.node.player.x=e.sprite.x,e.node.player.y=e.sprite.y})}check(){document.getElementById("timehint").style.display="none",document.getElementById("joinhint").style.display="none";let e=this.checkTarget(this.level.targetMetal,o.ImageAsset.crate_metal,o.LayerId.crate,o.ImageAsset.target_metal_1,o.ImageAsset.target_metal_2),t=this.checkTarget(this.level.targetWood,o.ImageAsset.crate_wood,o.LayerId.crate,o.ImageAsset.target_wood_1,o.ImageAsset.target_wood_2),s=this.checkTarget(this.level.targetPlayer,null,o.LayerId.player,o.ImageAsset.target_player_1,o.ImageAsset.target_player_2),a=t&&e&&s,l=r.levels[this.level.index].maxtime,n=this.level.time;if(a&&this.level.forks.length&&(document.getElementById("joinhint").style.display="block",a=!1),a&&n>l&&l>0&&(document.getElementById("timehint").style.display="block",a=!1),this.level.done=this.level.done||a,a&&!this.level.soundPlayed){let e="";for(let t of r.levels[this.level.index].startimes)n<=t&&(e+="★");document.getElementById(`load${this.level.index}bg`).innerHTML=e,this.level.soundPlayed=!0,i.SoundAssets.play(o.SoundAsset.done)}return a}checkTarget(e,t,s,o,r){let a=!0;for(let i of e){let e=this.map.getSprite(i.x,i.y,s),l=e&&(!t||e.asset===t);a=a&&l,i.asset=l?r:o}return a}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.HistoryNode=t.History=void 0;const o=s(0);class r{init(e){this.current=e,this.root=e,e.parent=null,e.forkStatus="",this.forkStatus=""}getNodesByTime(e){return this.visit(this.root,t=>t.time===e||t.time<e&&!t.next,[])}visit(e,t,s){return t(e)&&s.push(e),e.next&&this.visit(e.next,t,s),e.fork&&this.visit(e.fork,t,s),s}writeNext(e){this.current.next=e,e.parent=this.current,this.forkStatus=e.forkStatus}forkNext(){let e=this.current.cloneData(o.Action.fork),t=this.current.cloneData(o.Action.fork);e.time+=1,e.forkStatus+="n",t.time+=1,t.forkStatus+="f",this.current.next=e,this.current.fork=t,e.parent=this.current,t.parent=this.current,this.forkStatus=t.forkStatus}static findParent(e,t){for(;!t(e)&&e.parent;)e=e.parent;return t(e)?e:null}backToForkNext(e){let t=this.current.forkStatus;for(;t.length>0&&"n"===t.charAt(t.length-1);)t=t.substring(0,t.length-1);if(0===t.length)return void console.log("no valid parent");let s=t.substring(0,t.length-1),o=r.findParent(this.current,e=>e.forkStatus===s);o=o.next,console.log(`look for status: ${this.current.forkStatus}=>${s}, result:`,o),o&&(this.current=o,this.forkStatus=this.current.forkStatus,e(this.current))}undo(e){this.current.parent&&(this.current=this.current.parent,e(this.current))}redo(e){return this.current.fork&&this.forkStatus.startsWith(this.current.fork.forkStatus)?(this.current=this.current.fork,void e(this.current)):this.current.next&&this.forkStatus.startsWith(this.current.next.forkStatus)?(this.current=this.current.next,void e(this.current)):void console.log("no redo!")}}t.History=r;class a{constructor(){this.joined=new Set}cloneData(e){let t=new a;return t.time=this.time,t.forkStatus=this.forkStatus,t.action=e,t.player=this.player.clone(),t.cracks=this.cracks.map(e=>e.clone()),t.crateWood=this.crateWood.map(e=>e.clone()),t.crateMetal=this.crateMetal.map(e=>e.clone()),t.joined=new Set(this.joined),t}}t.HistoryNode=a}]);