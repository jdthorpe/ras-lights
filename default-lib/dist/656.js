(self.webpackChunkdefault_lib=self.webpackChunkdefault_lib||[]).push([[656,179],{168:(e,t,n)=>{const r=n(874),a={};for(const e of Object.keys(r))a[r[e]]=e;const l={rgb:{channels:3,labels:"rgb"},hsl:{channels:3,labels:"hsl"},hsv:{channels:3,labels:"hsv"},hwb:{channels:3,labels:"hwb"},cmyk:{channels:4,labels:"cmyk"},xyz:{channels:3,labels:"xyz"},lab:{channels:3,labels:"lab"},lch:{channels:3,labels:"lch"},hex:{channels:1,labels:["hex"]},keyword:{channels:1,labels:["keyword"]},ansi16:{channels:1,labels:["ansi16"]},ansi256:{channels:1,labels:["ansi256"]},hcg:{channels:3,labels:["h","c","g"]},apple:{channels:3,labels:["r16","g16","b16"]},gray:{channels:1,labels:["gray"]}};e.exports=l;for(const e of Object.keys(l)){if(!("channels"in l[e]))throw new Error("missing channels property: "+e);if(!("labels"in l[e]))throw new Error("missing channel labels property: "+e);if(l[e].labels.length!==l[e].channels)throw new Error("channel and label counts mismatch: "+e);const{channels:t,labels:n}=l[e];delete l[e].channels,delete l[e].labels,Object.defineProperty(l[e],"channels",{value:t}),Object.defineProperty(l[e],"labels",{value:n})}l.rgb.hsl=function(e){const t=e[0]/255,n=e[1]/255,r=e[2]/255,a=Math.min(t,n,r),l=Math.max(t,n,r),o=l-a;let s,i;l===a?s=0:t===l?s=(n-r)/o:n===l?s=2+(r-t)/o:r===l&&(s=4+(t-n)/o),s=Math.min(60*s,360),s<0&&(s+=360);const c=(a+l)/2;return i=l===a?0:c<=.5?o/(l+a):o/(2-l-a),[s,100*i,100*c]},l.rgb.hsv=function(e){let t,n,r,a,l;const o=e[0]/255,s=e[1]/255,i=e[2]/255,c=Math.max(o,s,i),u=c-Math.min(o,s,i),h=function(e){return(c-e)/6/u+.5};return 0===u?(a=0,l=0):(l=u/c,t=h(o),n=h(s),r=h(i),o===c?a=r-n:s===c?a=1/3+t-r:i===c&&(a=2/3+n-t),a<0?a+=1:a>1&&(a-=1)),[360*a,100*l,100*c]},l.rgb.hwb=function(e){const t=e[0],n=e[1];let r=e[2];const a=l.rgb.hsl(e)[0],o=1/255*Math.min(t,Math.min(n,r));return r=1-1/255*Math.max(t,Math.max(n,r)),[a,100*o,100*r]},l.rgb.cmyk=function(e){const t=e[0]/255,n=e[1]/255,r=e[2]/255,a=Math.min(1-t,1-n,1-r);return[100*((1-t-a)/(1-a)||0),100*((1-n-a)/(1-a)||0),100*((1-r-a)/(1-a)||0),100*a]},l.rgb.keyword=function(e){const t=a[e];if(t)return t;let n,l=1/0;for(const t of Object.keys(r)){const a=(s=r[t],((o=e)[0]-s[0])**2+(o[1]-s[1])**2+(o[2]-s[2])**2);a<l&&(l=a,n=t)}var o,s;return n},l.keyword.rgb=function(e){return r[e]},l.rgb.xyz=function(e){let t=e[0]/255,n=e[1]/255,r=e[2]/255;return t=t>.04045?((t+.055)/1.055)**2.4:t/12.92,n=n>.04045?((n+.055)/1.055)**2.4:n/12.92,r=r>.04045?((r+.055)/1.055)**2.4:r/12.92,[100*(.4124*t+.3576*n+.1805*r),100*(.2126*t+.7152*n+.0722*r),100*(.0193*t+.1192*n+.9505*r)]},l.rgb.lab=function(e){const t=l.rgb.xyz(e);let n=t[0],r=t[1],a=t[2];return n/=95.047,r/=100,a/=108.883,n=n>.008856?n**(1/3):7.787*n+16/116,r=r>.008856?r**(1/3):7.787*r+16/116,a=a>.008856?a**(1/3):7.787*a+16/116,[116*r-16,500*(n-r),200*(r-a)]},l.hsl.rgb=function(e){const t=e[0]/360,n=e[1]/100,r=e[2]/100;let a,l,o;if(0===n)return o=255*r,[o,o,o];a=r<.5?r*(1+n):r+n-r*n;const s=2*r-a,i=[0,0,0];for(let e=0;e<3;e++)l=t+1/3*-(e-1),l<0&&l++,l>1&&l--,o=6*l<1?s+6*(a-s)*l:2*l<1?a:3*l<2?s+(a-s)*(2/3-l)*6:s,i[e]=255*o;return i},l.hsl.hsv=function(e){const t=e[0];let n=e[1]/100,r=e[2]/100,a=n;const l=Math.max(r,.01);return r*=2,n*=r<=1?r:2-r,a*=l<=1?l:2-l,[t,100*(0===r?2*a/(l+a):2*n/(r+n)),(r+n)/2*100]},l.hsv.rgb=function(e){const t=e[0]/60,n=e[1]/100;let r=e[2]/100;const a=Math.floor(t)%6,l=t-Math.floor(t),o=255*r*(1-n),s=255*r*(1-n*l),i=255*r*(1-n*(1-l));switch(r*=255,a){case 0:return[r,i,o];case 1:return[s,r,o];case 2:return[o,r,i];case 3:return[o,s,r];case 4:return[i,o,r];case 5:return[r,o,s]}},l.hsv.hsl=function(e){const t=e[0],n=e[1]/100,r=e[2]/100,a=Math.max(r,.01);let l,o;o=(2-n)*r;const s=(2-n)*a;return l=n*a,l/=s<=1?s:2-s,l=l||0,o/=2,[t,100*l,100*o]},l.hwb.rgb=function(e){const t=e[0]/360;let n=e[1]/100,r=e[2]/100;const a=n+r;let l;a>1&&(n/=a,r/=a);const o=Math.floor(6*t),s=1-r;l=6*t-o,0!=(1&o)&&(l=1-l);const i=n+l*(s-n);let c,u,h;switch(o){default:case 6:case 0:c=s,u=i,h=n;break;case 1:c=i,u=s,h=n;break;case 2:c=n,u=s,h=i;break;case 3:c=n,u=i,h=s;break;case 4:c=i,u=n,h=s;break;case 5:c=s,u=n,h=i}return[255*c,255*u,255*h]},l.cmyk.rgb=function(e){const t=e[0]/100,n=e[1]/100,r=e[2]/100,a=e[3]/100;return[255*(1-Math.min(1,t*(1-a)+a)),255*(1-Math.min(1,n*(1-a)+a)),255*(1-Math.min(1,r*(1-a)+a))]},l.xyz.rgb=function(e){const t=e[0]/100,n=e[1]/100,r=e[2]/100;let a,l,o;return a=3.2406*t+-1.5372*n+-.4986*r,l=-.9689*t+1.8758*n+.0415*r,o=.0557*t+-.204*n+1.057*r,a=a>.0031308?1.055*a**(1/2.4)-.055:12.92*a,l=l>.0031308?1.055*l**(1/2.4)-.055:12.92*l,o=o>.0031308?1.055*o**(1/2.4)-.055:12.92*o,a=Math.min(Math.max(0,a),1),l=Math.min(Math.max(0,l),1),o=Math.min(Math.max(0,o),1),[255*a,255*l,255*o]},l.xyz.lab=function(e){let t=e[0],n=e[1],r=e[2];return t/=95.047,n/=100,r/=108.883,t=t>.008856?t**(1/3):7.787*t+16/116,n=n>.008856?n**(1/3):7.787*n+16/116,r=r>.008856?r**(1/3):7.787*r+16/116,[116*n-16,500*(t-n),200*(n-r)]},l.lab.xyz=function(e){let t,n,r;n=(e[0]+16)/116,t=e[1]/500+n,r=n-e[2]/200;const a=n**3,l=t**3,o=r**3;return n=a>.008856?a:(n-16/116)/7.787,t=l>.008856?l:(t-16/116)/7.787,r=o>.008856?o:(r-16/116)/7.787,t*=95.047,n*=100,r*=108.883,[t,n,r]},l.lab.lch=function(e){const t=e[0],n=e[1],r=e[2];let a;return a=360*Math.atan2(r,n)/2/Math.PI,a<0&&(a+=360),[t,Math.sqrt(n*n+r*r),a]},l.lch.lab=function(e){const t=e[0],n=e[1],r=e[2]/360*2*Math.PI;return[t,n*Math.cos(r),n*Math.sin(r)]},l.rgb.ansi16=function(e,t=null){const[n,r,a]=e;let o=null===t?l.rgb.hsv(e)[2]:t;if(o=Math.round(o/50),0===o)return 30;let s=30+(Math.round(a/255)<<2|Math.round(r/255)<<1|Math.round(n/255));return 2===o&&(s+=60),s},l.hsv.ansi16=function(e){return l.rgb.ansi16(l.hsv.rgb(e),e[2])},l.rgb.ansi256=function(e){const t=e[0],n=e[1],r=e[2];return t===n&&n===r?t<8?16:t>248?231:Math.round((t-8)/247*24)+232:16+36*Math.round(t/255*5)+6*Math.round(n/255*5)+Math.round(r/255*5)},l.ansi16.rgb=function(e){let t=e%10;if(0===t||7===t)return e>50&&(t+=3.5),t=t/10.5*255,[t,t,t];const n=.5*(1+~~(e>50));return[(1&t)*n*255,(t>>1&1)*n*255,(t>>2&1)*n*255]},l.ansi256.rgb=function(e){if(e>=232){const t=10*(e-232)+8;return[t,t,t]}let t;return e-=16,[Math.floor(e/36)/5*255,Math.floor((t=e%36)/6)/5*255,t%6/5*255]},l.rgb.hex=function(e){const t=(((255&Math.round(e[0]))<<16)+((255&Math.round(e[1]))<<8)+(255&Math.round(e[2]))).toString(16).toUpperCase();return"000000".substring(t.length)+t},l.hex.rgb=function(e){const t=e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);if(!t)return[0,0,0];let n=t[0];3===t[0].length&&(n=n.split("").map((e=>e+e)).join(""));const r=parseInt(n,16);return[r>>16&255,r>>8&255,255&r]},l.rgb.hcg=function(e){const t=e[0]/255,n=e[1]/255,r=e[2]/255,a=Math.max(Math.max(t,n),r),l=Math.min(Math.min(t,n),r),o=a-l;let s,i;return s=o<1?l/(1-o):0,i=o<=0?0:a===t?(n-r)/o%6:a===n?2+(r-t)/o:4+(t-n)/o,i/=6,i%=1,[360*i,100*o,100*s]},l.hsl.hcg=function(e){const t=e[1]/100,n=e[2]/100,r=n<.5?2*t*n:2*t*(1-n);let a=0;return r<1&&(a=(n-.5*r)/(1-r)),[e[0],100*r,100*a]},l.hsv.hcg=function(e){const t=e[1]/100,n=e[2]/100,r=t*n;let a=0;return r<1&&(a=(n-r)/(1-r)),[e[0],100*r,100*a]},l.hcg.rgb=function(e){const t=e[0]/360,n=e[1]/100,r=e[2]/100;if(0===n)return[255*r,255*r,255*r];const a=[0,0,0],l=t%1*6,o=l%1,s=1-o;let i=0;switch(Math.floor(l)){case 0:a[0]=1,a[1]=o,a[2]=0;break;case 1:a[0]=s,a[1]=1,a[2]=0;break;case 2:a[0]=0,a[1]=1,a[2]=o;break;case 3:a[0]=0,a[1]=s,a[2]=1;break;case 4:a[0]=o,a[1]=0,a[2]=1;break;default:a[0]=1,a[1]=0,a[2]=s}return i=(1-n)*r,[255*(n*a[0]+i),255*(n*a[1]+i),255*(n*a[2]+i)]},l.hcg.hsv=function(e){const t=e[1]/100,n=t+e[2]/100*(1-t);let r=0;return n>0&&(r=t/n),[e[0],100*r,100*n]},l.hcg.hsl=function(e){const t=e[1]/100,n=e[2]/100*(1-t)+.5*t;let r=0;return n>0&&n<.5?r=t/(2*n):n>=.5&&n<1&&(r=t/(2*(1-n))),[e[0],100*r,100*n]},l.hcg.hwb=function(e){const t=e[1]/100,n=t+e[2]/100*(1-t);return[e[0],100*(n-t),100*(1-n)]},l.hwb.hcg=function(e){const t=e[1]/100,n=1-e[2]/100,r=n-t;let a=0;return r<1&&(a=(n-r)/(1-r)),[e[0],100*r,100*a]},l.apple.rgb=function(e){return[e[0]/65535*255,e[1]/65535*255,e[2]/65535*255]},l.rgb.apple=function(e){return[e[0]/255*65535,e[1]/255*65535,e[2]/255*65535]},l.gray.rgb=function(e){return[e[0]/100*255,e[0]/100*255,e[0]/100*255]},l.gray.hsl=function(e){return[0,0,e[0]]},l.gray.hsv=l.gray.hsl,l.gray.hwb=function(e){return[0,100,e[0]]},l.gray.cmyk=function(e){return[0,0,0,e[0]]},l.gray.lab=function(e){return[e[0],0,0]},l.gray.hex=function(e){const t=255&Math.round(e[0]/100*255),n=((t<<16)+(t<<8)+t).toString(16).toUpperCase();return"000000".substring(n.length)+n},l.rgb.gray=function(e){return[(e[0]+e[1]+e[2])/3/255*100]}},85:(e,t,n)=>{const r=n(168),a=n(111),l={};Object.keys(r).forEach((e=>{l[e]={},Object.defineProperty(l[e],"channels",{value:r[e].channels}),Object.defineProperty(l[e],"labels",{value:r[e].labels});const t=a(e);Object.keys(t).forEach((n=>{const r=t[n];l[e][n]=function(e){const t=function(...t){const n=t[0];if(null==n)return n;n.length>1&&(t=n);const r=e(t);if("object"==typeof r)for(let e=r.length,t=0;t<e;t++)r[t]=Math.round(r[t]);return r};return"conversion"in e&&(t.conversion=e.conversion),t}(r),l[e][n].raw=function(e){const t=function(...t){const n=t[0];return null==n?n:(n.length>1&&(t=n),e(t))};return"conversion"in e&&(t.conversion=e.conversion),t}(r)}))})),e.exports=l},111:(e,t,n)=>{const r=n(168);function a(e,t){return function(n){return t(e(n))}}function l(e,t){const n=[t[e].parent,e];let l=r[t[e].parent][e],o=t[e].parent;for(;t[o].parent;)n.unshift(t[o].parent),l=a(r[t[o].parent][o],l),o=t[o].parent;return l.conversion=n,l}e.exports=function(e){const t=function(e){const t=function(){const e={},t=Object.keys(r);for(let n=t.length,r=0;r<n;r++)e[t[r]]={distance:-1,parent:null};return e}(),n=[e];for(t[e].distance=0;n.length;){const e=n.pop(),a=Object.keys(r[e]);for(let r=a.length,l=0;l<r;l++){const r=a[l],o=t[r];-1===o.distance&&(o.distance=t[e].distance+1,o.parent=e,n.unshift(r))}}return t}(e),n={},a=Object.keys(t);for(let e=a.length,r=0;r<e;r++){const e=a[r];null!==t[e].parent&&(n[e]=l(e,t))}return n}},874:e=>{"use strict";e.exports={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]}},656:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.load=void 0;const r=n(682);t.load=function(e){for(let t of r.defs)e(t)},n(607)},682:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.register=t.defs=void 0,t.defs=[],t.register=function(e){t.defs.push(e)}},153:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(682),a=n(593);(0,r.register)({name:"Alternate",func:function(e){void 0!==this.start_time&&void 0!==this.cycle_time||(this.start_time=+new Date,this.cycle_time=2*(e.fade+e.hold));const t=(+new Date-this.start_time)%this.cycle_time;return t<e.hold?e.b:t<e.hold+e.fade?(0,a.average)(e.b,e.a,(t-e.hold)/e.fade):t<2*e.hold+e.fade?e.a:(0,a.average)(e.a,e.b,(t-(2*e.hold+e.fade))/e.fade)},input:[{key:"a",type:"rgb",label:"First Color",default:[255,0,0]},{key:"b",type:"rgb",label:"Second Color",default:[0,0,255]},{key:"fade",type:"number",label:"Fade Time (ms)",default:1e3,min:1,max:36e5},{key:"hold",type:"number",label:"Hold Time (ms)",default:1e3,min:1,max:36e5}],output:"rgb"})},253:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),(0,n(682).register)({name:"Dimmer",func:function(e){const t=Math.max(0,Math.min(e.intensity,100))/100;return e.main.map((e=>[Math.floor(e[0]*t),Math.floor(e[1]*t),Math.floor(e[2]*t)]))},input:[{key:"main",type:"rgb[]",label:"Main",default:[[0,0,255],[0,255,255],[100,0,255]]},{key:"intensity",type:"number",label:"Brightness",default:90,min:0,max:100}],output:"rgb[]"})},834:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(682),a=n(593);(0,r.register)({name:"Gradient",func:function(e,t){const n=[];for(let r=0;r<t.leds;r++)n.push((0,a.average)(e.a,e.b,r/Math.max(t.leds-1,1)));return n},input:[{key:"a",type:"rgb",label:"First Color",default:[255,0,0]},{key:"b",type:"rgb",label:"Second Color",default:[0,0,255]}],output:"rgb[]"})},607:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(153),n(253),n(834),n(72),n(37),n(232),n(229)},72:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(682),a=n(85);(0,r.register)({name:"Rainbow Stripes",func:function(e,t){const{n}=e,r=[];for(let e=0;e<t.leds;e++)r.push(a.hsv.rgb([360*Math.floor(e*n/t.leds)/n,100,100]));return r},input:[{key:"n",type:"integer",label:"Colors (count)",default:6,min:1,max:100}],output:"rgb[]"})},37:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),(0,n(682).register)({name:"Rotate",func:function(e){void 0===this.starttime&&(this.starttime=+new Date);const t=Math.ceil(1e3*e.period);let n=Math.floor(e.in.length*((+new Date-this.starttime)%t)/t);return e.backwards&&(n*=-1),e.in.slice(n).concat(e.in.slice(0,n))},input:[{key:"in",type:"rgb[]",label:"Color Array",default:[[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255]]},{key:"period",type:"number",label:"Period (s)",default:1,min:1,max:600},{key:"backwards",type:"boolean",label:"Reverse Direction",default:!1}],output:"rgb[]"})},232:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),(0,n(682).register)({name:"Solid",func:function(e){return[e.a]},input:[{key:"a",type:"rgb",label:"Color",default:[0,255,0]}],output:"rgb[]"})},229:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),(0,n(682).register)({name:"Unzip",func:function(e,t){return[...e.colors.filter(((e,t)=>t%2==0)),...e.colors.filter(((e,t)=>t%2==1)).reverse()]},input:[{key:"colors",type:"rgb[]",label:"Input Colors",default:[[0,0,255],[0,255,255],[100,0,255]]}],output:"rgb[]"})},593:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.average=void 0,t.average=function(e,t,n){return[Math.floor(e[0]*(1-n)+t[0]*n),Math.floor(e[1]*(1-n)+t[1]*n),Math.floor(e[2]*(1-n)+t[2]*n)]}}}]);
//# sourceMappingURL=656.js.map