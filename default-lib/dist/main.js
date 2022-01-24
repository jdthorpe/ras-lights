(()=>{var e={168:(e,t,n)=>{const r=n(874),a={};for(const e of Object.keys(r))a[r[e]]=e;const o={rgb:{channels:3,labels:"rgb"},hsl:{channels:3,labels:"hsl"},hsv:{channels:3,labels:"hsv"},hwb:{channels:3,labels:"hwb"},cmyk:{channels:4,labels:"cmyk"},xyz:{channels:3,labels:"xyz"},lab:{channels:3,labels:"lab"},lch:{channels:3,labels:"lch"},hex:{channels:1,labels:["hex"]},keyword:{channels:1,labels:["keyword"]},ansi16:{channels:1,labels:["ansi16"]},ansi256:{channels:1,labels:["ansi256"]},hcg:{channels:3,labels:["h","c","g"]},apple:{channels:3,labels:["r16","g16","b16"]},gray:{channels:1,labels:["gray"]}};e.exports=o;for(const e of Object.keys(o)){if(!("channels"in o[e]))throw new Error("missing channels property: "+e);if(!("labels"in o[e]))throw new Error("missing channel labels property: "+e);if(o[e].labels.length!==o[e].channels)throw new Error("channel and label counts mismatch: "+e);const{channels:t,labels:n}=o[e];delete o[e].channels,delete o[e].labels,Object.defineProperty(o[e],"channels",{value:t}),Object.defineProperty(o[e],"labels",{value:n})}o.rgb.hsl=function(e){const t=e[0]/255,n=e[1]/255,r=e[2]/255,a=Math.min(t,n,r),o=Math.max(t,n,r),l=o-a;let s,i;o===a?s=0:t===o?s=(n-r)/l:n===o?s=2+(r-t)/l:r===o&&(s=4+(t-n)/l),s=Math.min(60*s,360),s<0&&(s+=360);const c=(a+o)/2;return i=o===a?0:c<=.5?l/(o+a):l/(2-o-a),[s,100*i,100*c]},o.rgb.hsv=function(e){let t,n,r,a,o;const l=e[0]/255,s=e[1]/255,i=e[2]/255,c=Math.max(l,s,i),u=c-Math.min(l,s,i),h=function(e){return(c-e)/6/u+.5};return 0===u?(a=0,o=0):(o=u/c,t=h(l),n=h(s),r=h(i),l===c?a=r-n:s===c?a=1/3+t-r:i===c&&(a=2/3+n-t),a<0?a+=1:a>1&&(a-=1)),[360*a,100*o,100*c]},o.rgb.hwb=function(e){const t=e[0],n=e[1];let r=e[2];const a=o.rgb.hsl(e)[0],l=1/255*Math.min(t,Math.min(n,r));return r=1-1/255*Math.max(t,Math.max(n,r)),[a,100*l,100*r]},o.rgb.cmyk=function(e){const t=e[0]/255,n=e[1]/255,r=e[2]/255,a=Math.min(1-t,1-n,1-r);return[100*((1-t-a)/(1-a)||0),100*((1-n-a)/(1-a)||0),100*((1-r-a)/(1-a)||0),100*a]},o.rgb.keyword=function(e){const t=a[e];if(t)return t;let n,o=1/0;for(const t of Object.keys(r)){const a=(s=r[t],((l=e)[0]-s[0])**2+(l[1]-s[1])**2+(l[2]-s[2])**2);a<o&&(o=a,n=t)}var l,s;return n},o.keyword.rgb=function(e){return r[e]},o.rgb.xyz=function(e){let t=e[0]/255,n=e[1]/255,r=e[2]/255;return t=t>.04045?((t+.055)/1.055)**2.4:t/12.92,n=n>.04045?((n+.055)/1.055)**2.4:n/12.92,r=r>.04045?((r+.055)/1.055)**2.4:r/12.92,[100*(.4124*t+.3576*n+.1805*r),100*(.2126*t+.7152*n+.0722*r),100*(.0193*t+.1192*n+.9505*r)]},o.rgb.lab=function(e){const t=o.rgb.xyz(e);let n=t[0],r=t[1],a=t[2];return n/=95.047,r/=100,a/=108.883,n=n>.008856?n**(1/3):7.787*n+16/116,r=r>.008856?r**(1/3):7.787*r+16/116,a=a>.008856?a**(1/3):7.787*a+16/116,[116*r-16,500*(n-r),200*(r-a)]},o.hsl.rgb=function(e){const t=e[0]/360,n=e[1]/100,r=e[2]/100;let a,o,l;if(0===n)return l=255*r,[l,l,l];a=r<.5?r*(1+n):r+n-r*n;const s=2*r-a,i=[0,0,0];for(let e=0;e<3;e++)o=t+1/3*-(e-1),o<0&&o++,o>1&&o--,l=6*o<1?s+6*(a-s)*o:2*o<1?a:3*o<2?s+(a-s)*(2/3-o)*6:s,i[e]=255*l;return i},o.hsl.hsv=function(e){const t=e[0];let n=e[1]/100,r=e[2]/100,a=n;const o=Math.max(r,.01);return r*=2,n*=r<=1?r:2-r,a*=o<=1?o:2-o,[t,100*(0===r?2*a/(o+a):2*n/(r+n)),(r+n)/2*100]},o.hsv.rgb=function(e){const t=e[0]/60,n=e[1]/100;let r=e[2]/100;const a=Math.floor(t)%6,o=t-Math.floor(t),l=255*r*(1-n),s=255*r*(1-n*o),i=255*r*(1-n*(1-o));switch(r*=255,a){case 0:return[r,i,l];case 1:return[s,r,l];case 2:return[l,r,i];case 3:return[l,s,r];case 4:return[i,l,r];case 5:return[r,l,s]}},o.hsv.hsl=function(e){const t=e[0],n=e[1]/100,r=e[2]/100,a=Math.max(r,.01);let o,l;l=(2-n)*r;const s=(2-n)*a;return o=n*a,o/=s<=1?s:2-s,o=o||0,l/=2,[t,100*o,100*l]},o.hwb.rgb=function(e){const t=e[0]/360;let n=e[1]/100,r=e[2]/100;const a=n+r;let o;a>1&&(n/=a,r/=a);const l=Math.floor(6*t),s=1-r;o=6*t-l,0!=(1&l)&&(o=1-o);const i=n+o*(s-n);let c,u,h;switch(l){default:case 6:case 0:c=s,u=i,h=n;break;case 1:c=i,u=s,h=n;break;case 2:c=n,u=s,h=i;break;case 3:c=n,u=i,h=s;break;case 4:c=i,u=n,h=s;break;case 5:c=s,u=n,h=i}return[255*c,255*u,255*h]},o.cmyk.rgb=function(e){const t=e[0]/100,n=e[1]/100,r=e[2]/100,a=e[3]/100;return[255*(1-Math.min(1,t*(1-a)+a)),255*(1-Math.min(1,n*(1-a)+a)),255*(1-Math.min(1,r*(1-a)+a))]},o.xyz.rgb=function(e){const t=e[0]/100,n=e[1]/100,r=e[2]/100;let a,o,l;return a=3.2406*t+-1.5372*n+-.4986*r,o=-.9689*t+1.8758*n+.0415*r,l=.0557*t+-.204*n+1.057*r,a=a>.0031308?1.055*a**(1/2.4)-.055:12.92*a,o=o>.0031308?1.055*o**(1/2.4)-.055:12.92*o,l=l>.0031308?1.055*l**(1/2.4)-.055:12.92*l,a=Math.min(Math.max(0,a),1),o=Math.min(Math.max(0,o),1),l=Math.min(Math.max(0,l),1),[255*a,255*o,255*l]},o.xyz.lab=function(e){let t=e[0],n=e[1],r=e[2];return t/=95.047,n/=100,r/=108.883,t=t>.008856?t**(1/3):7.787*t+16/116,n=n>.008856?n**(1/3):7.787*n+16/116,r=r>.008856?r**(1/3):7.787*r+16/116,[116*n-16,500*(t-n),200*(n-r)]},o.lab.xyz=function(e){let t,n,r;n=(e[0]+16)/116,t=e[1]/500+n,r=n-e[2]/200;const a=n**3,o=t**3,l=r**3;return n=a>.008856?a:(n-16/116)/7.787,t=o>.008856?o:(t-16/116)/7.787,r=l>.008856?l:(r-16/116)/7.787,t*=95.047,n*=100,r*=108.883,[t,n,r]},o.lab.lch=function(e){const t=e[0],n=e[1],r=e[2];let a;return a=360*Math.atan2(r,n)/2/Math.PI,a<0&&(a+=360),[t,Math.sqrt(n*n+r*r),a]},o.lch.lab=function(e){const t=e[0],n=e[1],r=e[2]/360*2*Math.PI;return[t,n*Math.cos(r),n*Math.sin(r)]},o.rgb.ansi16=function(e,t=null){const[n,r,a]=e;let l=null===t?o.rgb.hsv(e)[2]:t;if(l=Math.round(l/50),0===l)return 30;let s=30+(Math.round(a/255)<<2|Math.round(r/255)<<1|Math.round(n/255));return 2===l&&(s+=60),s},o.hsv.ansi16=function(e){return o.rgb.ansi16(o.hsv.rgb(e),e[2])},o.rgb.ansi256=function(e){const t=e[0],n=e[1],r=e[2];return t===n&&n===r?t<8?16:t>248?231:Math.round((t-8)/247*24)+232:16+36*Math.round(t/255*5)+6*Math.round(n/255*5)+Math.round(r/255*5)},o.ansi16.rgb=function(e){let t=e%10;if(0===t||7===t)return e>50&&(t+=3.5),t=t/10.5*255,[t,t,t];const n=.5*(1+~~(e>50));return[(1&t)*n*255,(t>>1&1)*n*255,(t>>2&1)*n*255]},o.ansi256.rgb=function(e){if(e>=232){const t=10*(e-232)+8;return[t,t,t]}let t;return e-=16,[Math.floor(e/36)/5*255,Math.floor((t=e%36)/6)/5*255,t%6/5*255]},o.rgb.hex=function(e){const t=(((255&Math.round(e[0]))<<16)+((255&Math.round(e[1]))<<8)+(255&Math.round(e[2]))).toString(16).toUpperCase();return"000000".substring(t.length)+t},o.hex.rgb=function(e){const t=e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);if(!t)return[0,0,0];let n=t[0];3===t[0].length&&(n=n.split("").map((e=>e+e)).join(""));const r=parseInt(n,16);return[r>>16&255,r>>8&255,255&r]},o.rgb.hcg=function(e){const t=e[0]/255,n=e[1]/255,r=e[2]/255,a=Math.max(Math.max(t,n),r),o=Math.min(Math.min(t,n),r),l=a-o;let s,i;return s=l<1?o/(1-l):0,i=l<=0?0:a===t?(n-r)/l%6:a===n?2+(r-t)/l:4+(t-n)/l,i/=6,i%=1,[360*i,100*l,100*s]},o.hsl.hcg=function(e){const t=e[1]/100,n=e[2]/100,r=n<.5?2*t*n:2*t*(1-n);let a=0;return r<1&&(a=(n-.5*r)/(1-r)),[e[0],100*r,100*a]},o.hsv.hcg=function(e){const t=e[1]/100,n=e[2]/100,r=t*n;let a=0;return r<1&&(a=(n-r)/(1-r)),[e[0],100*r,100*a]},o.hcg.rgb=function(e){const t=e[0]/360,n=e[1]/100,r=e[2]/100;if(0===n)return[255*r,255*r,255*r];const a=[0,0,0],o=t%1*6,l=o%1,s=1-l;let i=0;switch(Math.floor(o)){case 0:a[0]=1,a[1]=l,a[2]=0;break;case 1:a[0]=s,a[1]=1,a[2]=0;break;case 2:a[0]=0,a[1]=1,a[2]=l;break;case 3:a[0]=0,a[1]=s,a[2]=1;break;case 4:a[0]=l,a[1]=0,a[2]=1;break;default:a[0]=1,a[1]=0,a[2]=s}return i=(1-n)*r,[255*(n*a[0]+i),255*(n*a[1]+i),255*(n*a[2]+i)]},o.hcg.hsv=function(e){const t=e[1]/100,n=t+e[2]/100*(1-t);let r=0;return n>0&&(r=t/n),[e[0],100*r,100*n]},o.hcg.hsl=function(e){const t=e[1]/100,n=e[2]/100*(1-t)+.5*t;let r=0;return n>0&&n<.5?r=t/(2*n):n>=.5&&n<1&&(r=t/(2*(1-n))),[e[0],100*r,100*n]},o.hcg.hwb=function(e){const t=e[1]/100,n=t+e[2]/100*(1-t);return[e[0],100*(n-t),100*(1-n)]},o.hwb.hcg=function(e){const t=e[1]/100,n=1-e[2]/100,r=n-t;let a=0;return r<1&&(a=(n-r)/(1-r)),[e[0],100*r,100*a]},o.apple.rgb=function(e){return[e[0]/65535*255,e[1]/65535*255,e[2]/65535*255]},o.rgb.apple=function(e){return[e[0]/255*65535,e[1]/255*65535,e[2]/255*65535]},o.gray.rgb=function(e){return[e[0]/100*255,e[0]/100*255,e[0]/100*255]},o.gray.hsl=function(e){return[0,0,e[0]]},o.gray.hsv=o.gray.hsl,o.gray.hwb=function(e){return[0,100,e[0]]},o.gray.cmyk=function(e){return[0,0,0,e[0]]},o.gray.lab=function(e){return[e[0],0,0]},o.gray.hex=function(e){const t=255&Math.round(e[0]/100*255),n=((t<<16)+(t<<8)+t).toString(16).toUpperCase();return"000000".substring(n.length)+n},o.rgb.gray=function(e){return[(e[0]+e[1]+e[2])/3/255*100]}},85:(e,t,n)=>{const r=n(168),a=n(111),o={};Object.keys(r).forEach((e=>{o[e]={},Object.defineProperty(o[e],"channels",{value:r[e].channels}),Object.defineProperty(o[e],"labels",{value:r[e].labels});const t=a(e);Object.keys(t).forEach((n=>{const r=t[n];o[e][n]=function(e){const t=function(...t){const n=t[0];if(null==n)return n;n.length>1&&(t=n);const r=e(t);if("object"==typeof r)for(let e=r.length,t=0;t<e;t++)r[t]=Math.round(r[t]);return r};return"conversion"in e&&(t.conversion=e.conversion),t}(r),o[e][n].raw=function(e){const t=function(...t){const n=t[0];return null==n?n:(n.length>1&&(t=n),e(t))};return"conversion"in e&&(t.conversion=e.conversion),t}(r)}))})),e.exports=o},111:(e,t,n)=>{const r=n(168);function a(e,t){return function(n){return t(e(n))}}function o(e,t){const n=[t[e].parent,e];let o=r[t[e].parent][e],l=t[e].parent;for(;t[l].parent;)n.unshift(t[l].parent),o=a(r[t[l].parent][l],o),l=t[l].parent;return o.conversion=n,o}e.exports=function(e){const t=function(e){const t=function(){const e={},t=Object.keys(r);for(let n=t.length,r=0;r<n;r++)e[t[r]]={distance:-1,parent:null};return e}(),n=[e];for(t[e].distance=0;n.length;){const e=n.pop(),a=Object.keys(r[e]);for(let r=a.length,o=0;o<r;o++){const r=a[o],l=t[r];-1===l.distance&&(l.distance=t[e].distance+1,l.parent=e,n.unshift(r))}}return t}(e),n={},a=Object.keys(t);for(let e=a.length,r=0;r<e;r++){const e=a[r];null!==t[e].parent&&(n[e]=o(e,t))}return n}},874:e=>{"use strict";e.exports={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]}},607:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.load=t.register=void 0;const r=[];t.register=function(e){r.push(e)},t.load=function(e){for(let t of r)e(t)},n(346),n(27),n(651)},636:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(607),a=n(593);(0,r.register)({name:"Alternate",func:function(e){void 0!==this.starttime&&void 0!==this.cycletime||(this.starttime=+new Date,this.cycletime=2*(e.fade+e.hold));const t=(+new Date-this.starttime)%this.cycletime;return t<e.hold?e.b:t<e.hold+e.fade?(0,a.average)(e.b,e.a,(t-e.hold)/e.fade):t<2*e.hold+e.fade?e.a:(0,a.average)(e.a,e.b,(t-(2*e.hold+e.fade))/e.fade)},input:[{key:"a",type:"rgb",label:"First Color",default:[255,0,0]},{key:"b",type:"rgb",label:"Second Color",default:[0,0,255]},{key:"fade",type:"number",label:"Fade Time (ms)",default:1e3,min:1,max:36e5},{key:"hold",type:"number",label:"Hold Time (ms)",default:1e3,min:1,max:36e5}],output:"rgb"})},363:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),(0,n(607).register)({name:"Dimmer",func:function(e){const t=Math.max(0,Math.min(e.intensity,100))/100;return e.main.map((e=>[Math.floor(e[0]*t),Math.floor(e[1]*t),Math.floor(e[2]*t)]))},input:[{key:"main",type:"rgb[]",label:"Main",default:[[0,0,255],[0,255,255],[100,0,255]]},{key:"intensity",type:"number",label:"Brightness",default:90,min:0,max:100}],output:"rgb[]"})},622:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(607),a=n(593);(0,r.register)({name:"Gradient",func:function(e,t){const n=[];for(let r=0;r<t.leds;r++)n.push((0,a.average)(e.a,e.b,r/Math.max(t.leds-1,1)));return n},input:[{key:"a",type:"rgb",label:"First Color",default:[255,0,0]},{key:"b",type:"rgb",label:"Second Color",default:[0,0,255]}],output:"rgb[]"})},346:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(636),n(363),n(622),n(98),n(311),n(640)},98:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(607),a=n(85);(0,r.register)({name:"Rainbow Stripes",func:function(e,t){const{n}=e,r=[];for(let e=0;e<t.leds;e++)r.push(a.hsv.rgb([360*Math.floor(e*n/t.leds)/n,100,100]));return r},input:[{key:"n",type:"integer",label:"Colors (count)",default:6,min:1,max:100}],output:"rgb[]"})},311:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),(0,n(607).register)({name:"Rotate",func:function(e){void 0===this.starttime&&(this.starttime=+new Date);const t=Math.ceil(1e3*e.period);let n=Math.floor(e.in.length*((+new Date-this.starttime)%t)/t);return e.backwards&&(n*=-1),e.in.slice(n).concat(e.in.slice(0,n))},input:[{key:"in",type:"rgb[]",label:"Color Array",default:[[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255]]},{key:"period",type:"number",label:"Period (s)",default:1,min:1,max:600},{key:"backwards",type:"boolean",label:"Reverse Direction",default:!1}],output:"rgb[]"})},640:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),(0,n(607).register)({name:"Solid",func:function(e){return[e.a]},input:[{key:"a",type:"rgb",label:"Color",default:[0,255,0]}],output:"rgb[]"})},27:()=>{},593:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.average=void 0,t.average=function(e,t,n){return[Math.floor(e[0]*(1-n)+t[0]*n),Math.floor(e[1]*(1-n)+t[1]*n),Math.floor(e[2]*(1-n)+t[2]*n)]}},651:()=>{}},t={};!function n(r){var a=t[r];if(void 0!==a)return a.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,n),o.exports}(607)})();
//# sourceMappingURL=main.js.map