"use strict";(self.webpackChunkweb=self.webpackChunkweb||[]).push([[356],{4356:function(e,n,t){t.r(n),t.d(n,{Docs:function(){return R},default:function(){return V}});var r,i,a,o,s,c=t(25571),d=t(97916),l=t(18487),p=t(41004),u=t(47476),f=t(32951),x=t.n(f),h=t(74812),m=t(72905),g=t(68484),v=t(7884),b=t(82311),w=t(38639),j=[{name:"Home",path:"index",level:1},{name:"Getting Started",path:"getting-started",level:1},{name:"Connecting to your Pi",path:"connecting-to-your-pi",level:2},{name:"Hardware Setup",path:"hardware-setup",level:2},{name:"Configuration",path:"configuration",level:2},{name:"Using the Editor",path:"editor",level:1},{name:"User Libraries",path:"user-library-overview",level:1},{name:"Initial Setup",path:"user-library-setup",level:2},{name:"Workflow",path:"user-library-workflow",level:2},{name:"Tips And Tricks",path:"tips-and-tricks",level:2},{name:'Using "this"',path:"using-this",level:2},{name:"Timers",path:"timers",level:2}],y=m.ZP.div(r||(r=(0,u.Z)(["\n    background-color: #353634;\n    color: #e6e6eb;\n    padding-left: .8rem;\n    padding-top: .8rem;\n    height: 100%;\n    width: 240px;\n    & a: {\n        color: inherit;\n        text-decoration: none;\n        outline: none;\n    }\n"]))),Z=m.ZP.ul(i||(i=(0,u.Z)(["\n    padding: 0;\n    margin: 0;\n    list-style: none;\n    text-decoration: none;\n    & link {\n        text-decoration: none;\n    }\n    & a {\n        text-decoration: none;\n    }\n"]))),k=m.ZP.li(a||(a=(0,u.Z)(["\n    font-size: ","px;\n    color: #eeeeee;\n    padding: 6px 0 6px 16px;\n    border-left: 4px solid transparent;\n    box-sizing: content-box;\n    text-decoration: none;\n    &:hover {\n        border-left-color:  #aaaaaa;\n    };\n"])),(function(e){return 1===e.level?"18":"16"})),P=function(e){var n=e.name,t=e.path,r=e.level,i=(0,b.TH)(),a="/docs/".concat(t);return(0,w.jsx)(v.rU,{to:a,style:{textDecoration:"none"},children:(0,w.jsx)(k,{level:r,style:{borderLeftColor:i.pathname===a?"#eeeeee":void 0,paddingLeft:"calc( 10px + ".concat(1.2*(r-1),"rem)")},children:n})})},U=function(e){return(0,w.jsx)(y,{children:(0,w.jsx)(Z,{children:j.map((function(e,n){return(0,w.jsx)(P,(0,c.Z)({},e),n)}))})})},C=t(4300),S=t(87935),T="markdown-style_markdown__KOYHk",W=t(98306),A=t(30073),H=t(43560),L=t(51710),N=t(946),D=t(36649),_=t(28971),z=t(65949),E=t(97384),O=t(89586),G=t(37415),I=t(78057),K=t(22765),Y=t(51733),$=["node","inline","className","children"],q=m.ZP.div(o||(o=(0,u.Z)(["\n    padding: 10px;\n    height: calc(100vh - 60px);\n    width: 100%;\n    overflow-y: scroll;\n"]))),B=m.ZP.div(s||(s=(0,u.Z)(["\n    display: flex;\n    flex-direction: row;\n"]))),F={configuration:H,"connecting-to-your-pi":L,editor:N,"getting-started":D,"hardware-setup":_,index:z,"user-library-overview":E,"user-library-setup":O,"user-library-workflow":G,"tips-and-tricks":I,"using-this":K,timers:Y},J=function(e){var n=e.url,t=(0,h.useState)(),r=(0,p.Z)(t,2),i=r[0],a=r[1];return(0,h.useEffect)((function(){(0,l.Z)(x().mark((function e(){var t;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(n);case 2:return t=e.sent,e.t0=a,e.next=6,t.text();case 6:e.t1=e.sent,(0,e.t0)(e.t1);case 8:case"end":return e.stop()}}),e)})))()}),[n]),"undefined"===typeof i?(0,w.jsx)(g.gb,{}):(0,w.jsx)("div",{style:{marginLeft:15,maxWidth:800},children:(0,w.jsx)(A.D,{rehypePlugins:[W.Z],children:i,className:T,components:{a:function(e){return e.href.match(/^(https?:)?\/\//)?(0,w.jsx)("a",{href:e.href,children:e.children}):(0,w.jsx)(v.rU,{to:e.href,children:e.children})},code:function(e){e.node;var n=e.inline,t=e.className,r=e.children,i=(0,d.Z)(e,$),a=/language-(\w+)/.exec(t||"");return!n&&a?(0,w.jsx)(C.Z,(0,c.Z)({children:String(r).replace(/\n$/,""),style:S.Z,language:a[1],PreTag:"div"},i)):(0,w.jsx)("code",(0,c.Z)((0,c.Z)({className:t},i),{},{children:r}))}}})})},M=function(e){var n=e.page,t=n&&F[n];return"undefined"===typeof t?(0,w.jsx)(g.e9,{}):(0,w.jsx)(J,{url:t})},Q=function(){var e=(0,b.UO)().page;return(0,w.jsx)(M,{page:e})},R=function(){return(0,w.jsxs)(B,{children:[(0,w.jsx)("div",{children:(0,w.jsx)(U,{})}),(0,w.jsx)(q,{children:(0,w.jsxs)(b.Z5,{children:[(0,w.jsx)(b.AW,{path:"/:page",element:(0,w.jsx)(Q,{})}),(0,w.jsx)(b.AW,{path:"/",element:(0,w.jsx)(M,{page:"index"})}),(0,w.jsx)(b.AW,{path:"*",element:(0,w.jsx)(g.e9,{})})]})})]})},V=R},43560:function(e,n,t){e.exports=t.p+"static/media/configuration.054da11fc2aaf89e2bd9.md"},51710:function(e,n,t){e.exports=t.p+"static/media/connecting-to-your-pi.5edf2d998f9d187d5540.md"},946:function(e,n,t){e.exports=t.p+"static/media/editor.5d7cf769a383f2b1c0f2.md"},36649:function(e,n,t){e.exports=t.p+"static/media/getting-started.26a0e0c132843fd3a168.md"},28971:function(e,n,t){e.exports=t.p+"static/media/hardware-setup.b19449b844eaec2b089a.md"},65949:function(e,n,t){e.exports=t.p+"static/media/index.b347acf792fb121f7847.md"},51733:function(e,n,t){e.exports=t.p+"static/media/timers.46e652c162afe10dd1cf.md"},78057:function(e,n,t){e.exports=t.p+"static/media/tips-and-tricks.17ddc3ed79906a4ea082.md"},97384:function(e,n,t){e.exports=t.p+"static/media/user-library-overview.78002275b74849860895.md"},89586:function(e,n,t){e.exports=t.p+"static/media/user-library-setup.4df57a6f0f6f1b83e7d3.md"},37415:function(e,n,t){e.exports=t.p+"static/media/user-library-workflow.10ea35cfd7891b956950.md"},22765:function(e,n,t){e.exports=t.p+"static/media/using-this.2543f71e988257ed12cc.md"}}]);
//# sourceMappingURL=356.70875696.chunk.js.map