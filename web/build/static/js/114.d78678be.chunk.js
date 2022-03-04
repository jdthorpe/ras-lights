"use strict";(self.webpackChunkweb=self.webpackChunkweb||[]).push([[114],{31966:function(e,n,t){t.r(n),t.d(n,{default:function(){return F}});var r,s,i,o,a=t(78464),c=t(18487),d=t(41004),u=t(47476),l=t(32951),f=t.n(l),h=t(74812),p=t(72905),x=t(39086),m=t(86776),v=t(26494),j=t(34878),y=t(12126),g=t.n(y),b=t(38639),w=p.ZP.div(r||(r=(0,u.Z)(["\n    display: flex;\n    flex-directio: row;\n    gap: 1rem;\n    align-items: flex-end;\n    margin: 0 1rem .6rem 1rem;\n"]))),Z={fieldGroup:{width:"15rem"}},k={dropdown:{width:"10rem"}},S="* * * * *",C=function(e){var n=e.modes,t=e.schedule,r=e.save,s=(0,h.useState)(t),i=(0,d.Z)(s,2),o=i[0],a=i[1],c=(0,h.useState)((null===t||void 0===t?void 0:t.schedule)||S),u=(0,d.Z)(c,2),l=u[0],f=u[1],p=(0,h.useState)(),y=(0,d.Z)(p,2),C=y[0],E=y[1],T=(0,h.useState)((null===t||void 0===t?void 0:t.name)||""),D=(0,d.Z)(T,2),P=D[0],G=D[1],N=(0,h.useState)(null===t||void 0===t?void 0:t.mode),O=(0,d.Z)(N,2),F=O[0],L=O[1];"undefined"===typeof t||Object.is(o,t)||(a(t),L(t.mode),G(t.name),f(null===t||void 0===t?void 0:t.schedule),E(void 0));var I="undefined"===typeof F||"undefined"===typeof P||"undefined"===typeof l||"undefined"!==typeof C||0===F.length||0===P.length||0===l.length||l===S;return(0,b.jsx)("div",{style:{backgroundColor:"#dddddd"},children:(0,b.jsxs)("div",{style:{width:"max-content",paddingTop:".5rem"},children:[(0,b.jsxs)(w,{children:[(0,b.jsx)(m.n,{label:"Schedule Name",value:P,onChange:function(e,n){return G(n)},styles:Z}),(0,b.jsx)(v.L,{label:"Mode",selectedKey:F,onChange:function(e,n,t){return n&&L(n.key)},placeholder:"Select mode",options:n.sort().map((function(e){return{key:e,text:e}})),styles:k}),(0,b.jsx)(j.K,{style:{marginLeft:"auto"},onClick:function(){return r({name:P,mode:F,schedule:l})},disabled:I,children:"Save"})]}),(0,b.jsx)(w,{children:(0,b.jsx)(x.Z,{value:l,setValue:f,onError:E})}),(0,b.jsx)(w,{children:(0,b.jsxs)("p",{children:[g().toString(l)," "]})})]})})},E=t(1430),T=t(9812),D=t(54329),P=t(22340),G=p.ZP.table(s||(s=(0,u.Z)(["\n    border-collapse: collapse;\n    tr:nth-child(even) {background: #DDD};\n    tr:nth-child(odd) {background: #FFF};\n    margin: 1rem;\n    max-width: 800px;\n"]))),N=p.ZP.th(i||(i=(0,u.Z)(["\n    border: 1px solid #999;\n    padding: 0.5rem;\n    text-align: left;\n"]))),O=p.ZP.td(o||(o=(0,u.Z)(["\n    border: 1px solid #999;\n    padding: 0.5rem;\n    text-align: left;\n"]))),F=function(){var e=(0,h.useState)(),n=(0,d.Z)(e,2),t=n[0],r=n[1],s=(0,h.useState)(),i=(0,d.Z)(s,2),o=i[0],u=i[1],l=(0,h.useState)(),p=(0,d.Z)(l,2),x=p[0],m=p[1],v=(0,h.useState)(),j=(0,d.Z)(v,2),y=j[0],w=j[1],Z=function(){var e=(0,c.Z)(f().mark((function e(n){var t;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return w(n),e.next=3,fetch("/api/schedule/",{method:"POST",cache:"no-cache",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});case 3:if(200===(t=e.sent).status){e.next=10;break}return e.t0=m,e.next=8,t.text();case 8:e.t1=e.sent,(0,e.t0)(e.t1);case 10:return e.next=12,k();case 12:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),k=function(){var e=(0,c.Z)(f().mark((function e(){var n,t;return f().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/schedule/");case 2:return n=e.sent,e.next=5,n.json();case 5:(t=e.sent).forEach((function(e){e.human=g().toString(e.schedule)})),r(t.sort((function(e,n){return e.name<n.name?-1:1})));case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,h.useEffect)((function(){"undefined"===typeof t&&k()}),[t]),(0,h.useEffect)((function(){if("undefined"===typeof o){var e=!1;return(0,c.Z)(f().mark((function n(){var t,r;return f().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,fetch("/api/mode/");case 2:return t=n.sent,n.prev=3,n.next=6,t.json();case 6:if(r=n.sent,!e){n.next=9;break}return n.abrupt("return");case 9:u(["off"].concat((0,a.Z)(r.map((function(e){return e.name}))))),n.next=16;break;case 12:n.prev=12,n.t0=n.catch(3),console.log('fetch("/api/mode/").json() failed with',n.t0),console.log("This usually means the app is running on a dev box without beign proxied via /nginx-dev.conf");case 16:case"end":return n.stop()}}),n,null,[[3,12]])})))(),function(){e=!0}}}),[o]),"undefined"===typeof t?(0,b.jsx)("div",{style:{paddingTop:"2rem"},children:(0,b.jsx)(D.$,{label:"I am definitely loading...",size:P.E.large})}):(0,b.jsxs)("div",{children:[(0,b.jsx)(C,{modes:o||[],schedule:y,save:Z}),x&&(0,b.jsxs)("p",{style:{color:"red"},children:["Somethig went wrong while saving: ",x]}),(0,b.jsxs)(G,{children:[(0,b.jsxs)("colgroup",{children:[(0,b.jsx)("col",{style:{minWidth:"11rem"}}),(0,b.jsx)("col",{style:{minWidth:"11rem"}}),(0,b.jsx)("col",{style:{width:"100%"}})]}),(0,b.jsx)("thead",{children:(0,b.jsxs)("tr",{children:[(0,b.jsx)(N,{children:"Name"}),(0,b.jsx)(N,{children:"Mode"}),(0,b.jsx)(N,{children:"Schedule"})]})}),(0,b.jsx)("tbody",{children:t.map((function(e,n){return(0,b.jsxs)("tr",{children:[(0,b.jsx)(O,{children:e.name}),(0,b.jsx)(O,{children:e.mode}),(0,b.jsxs)(O,{children:[e.human,(0,b.jsxs)("span",{style:{float:"right"},children:[(0,b.jsx)(E.G,{style:{margin:"0 7px"},icon:T.I7k,title:"Delete",onClick:function(){return function(e){"undefined"!==typeof t&&(0,c.Z)(f().mark((function n(){var r;return f().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,fetch("/api/schedule/",{method:"DELETE",cache:"no-cache",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t[e].name})});case 2:if(200===(r=n.sent).status){n.next=9;break}return n.t0=m,n.next=7,r.text();case 7:n.t1=n.sent,(0,n.t0)(n.t1);case 9:return n.next=11,k();case 11:case"end":return n.stop()}}),n)})))()}(n)}}),(0,b.jsx)(E.G,{style:{margin:"0 7px"},icon:T.Xcf,title:"Edit",onClick:function(){return function(e){"undefined"!==typeof t&&w(t[e])}(n)}}),(0,b.jsx)(E.G,{style:{margin:"0 7px"},title:"something",icon:T.byT})]})]})]},n)}))})]})]})}}}]);
//# sourceMappingURL=114.d78678be.chunk.js.map