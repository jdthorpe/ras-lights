"use strict";(self.webpackChunkweb=self.webpackChunkweb||[]).push([[876],{20742:function(e,t,o){o.d(t,{k:function(){return a}});var n=o(74812),i=o(3218);function a(e){var t=n.useState(e),o=t[0],a=t[1];return[o,{setTrue:(0,i.B)((function(){return function(){a(!0)}})),setFalse:(0,i.B)((function(){return function(){a(!1)}})),toggle:(0,i.B)((function(){return function(){a((function(e){return!e}))}}))}]}},71876:function(e,t,o){o.d(t,{V:function(){return oe}});var n=o(32734),i=o(7642),a=o(74812),s=o(39735),r=o(15526),l=o(48934),c=o(53390),d=o(16478),u=o(35962),p=o(82261),m=o(48134),h=o(20972),g=o(42911),f=g.D1.durationValue2,v={root:"ms-Modal",main:"ms-Dialog-main",scrollableContent:"ms-Modal-scrollableContent",isOpen:"is-open",layer:"ms-Modal-Layer"},y=o(53431),x=o(32330),b=o(67508),C=o(61891),D=o(53728),T=o(57767),S=o(71161),_=(0,o(19415).NF)((function(e,t){return{root:(0,g.y0)(e,t&&{touchAction:"none",selectors:{"& *":{userSelect:"none"}}})}})),N=o(2176),M={start:"touchstart",move:"touchmove",stop:"touchend"},I={start:"mousedown",move:"mousemove",stop:"mouseup"},k=function(e){function t(t){var o=e.call(this,t)||this;return o._currentEventType=I,o._events=[],o._onMouseDown=function(e){var t=a.Children.only(o.props.children).props.onMouseDown;return t&&t(e),o._currentEventType=I,o._onDragStart(e)},o._onMouseUp=function(e){var t=a.Children.only(o.props.children).props.onMouseUp;return t&&t(e),o._currentEventType=I,o._onDragStop(e)},o._onTouchStart=function(e){var t=a.Children.only(o.props.children).props.onTouchStart;return t&&t(e),o._currentEventType=M,o._onDragStart(e)},o._onTouchEnd=function(e){var t=a.Children.only(o.props.children).props.onTouchEnd;t&&t(e),o._currentEventType=M,o._onDragStop(e)},o._onDragStart=function(e){if("number"===typeof e.button&&0!==e.button)return!1;if(!(o.props.handleSelector&&!o._matchesSelector(e.target,o.props.handleSelector)||o.props.preventDragSelector&&o._matchesSelector(e.target,o.props.preventDragSelector))){o._touchId=o._getTouchId(e);var t=o._getControlPosition(e);if(void 0!==t){var n=o._createDragDataFromPosition(t);o.props.onStart&&o.props.onStart(e,n),o.setState({isDragging:!0,lastPosition:t}),o._events=[(0,N.on)(document.body,o._currentEventType.move,o._onDrag,!0),(0,N.on)(document.body,o._currentEventType.stop,o._onDragStop,!0)]}}},o._onDrag=function(e){"touchmove"===e.type&&e.preventDefault();var t=o._getControlPosition(e);if(t){var n=o._createUpdatedDragData(o._createDragDataFromPosition(t)),i=n.position;o.props.onDragChange&&o.props.onDragChange(e,n),o.setState({position:i,lastPosition:t})}},o._onDragStop=function(e){if(o.state.isDragging){var t=o._getControlPosition(e);if(t){var n=o._createDragDataFromPosition(t);o.setState({isDragging:!1,lastPosition:void 0}),o.props.onStop&&o.props.onStop(e,n),o.props.position&&o.setState({position:o.props.position}),o._events.forEach((function(e){return e()}))}}},o.state={isDragging:!1,position:o.props.position||{x:0,y:0},lastPosition:void 0},o}return(0,i.ZT)(t,e),t.prototype.componentDidUpdate=function(e){!this.props.position||e.position&&this.props.position===e.position||this.setState({position:this.props.position})},t.prototype.componentWillUnmount=function(){this._events.forEach((function(e){return e()}))},t.prototype.render=function(){var e=a.Children.only(this.props.children),t=e.props,o=this.props.position,n=this.state,s=n.position,r=n.isDragging,l=s.x,c=s.y;return o&&!r&&(l=o.x,c=o.y),a.cloneElement(e,{style:(0,i.pi)((0,i.pi)({},t.style),{transform:"translate("+l+"px, "+c+"px)"}),className:_(t.className,this.state.isDragging).root,onMouseDown:this._onMouseDown,onMouseUp:this._onMouseUp,onTouchStart:this._onTouchStart,onTouchEnd:this._onTouchEnd})},t.prototype._getControlPosition=function(e){var t=this._getActiveTouch(e);if(void 0===this._touchId||t){var o=t||e;return{x:o.clientX,y:o.clientY}}},t.prototype._getActiveTouch=function(e){return e.targetTouches&&this._findTouchInTouchList(e.targetTouches)||e.changedTouches&&this._findTouchInTouchList(e.changedTouches)},t.prototype._getTouchId=function(e){var t=e.targetTouches&&e.targetTouches[0]||e.changedTouches&&e.changedTouches[0];if(t)return t.identifier},t.prototype._matchesSelector=function(e,t){if(!e||e===document.body)return!1;var o=e.matches||e.webkitMatchesSelector||e.msMatchesSelector;return!!o&&(o.call(e,t)||this._matchesSelector(e.parentElement,t))},t.prototype._findTouchInTouchList=function(e){if(void 0!==this._touchId)for(var t=0;t<e.length;t++)if(e[t].identifier===this._touchId)return e[t]},t.prototype._createDragDataFromPosition=function(e){var t=this.state.lastPosition;return void 0===t?{delta:{x:0,y:0},lastPosition:e,position:e}:{delta:{x:e.x-t.x,y:e.y-t.y},lastPosition:t,position:e}},t.prototype._createUpdatedDragData=function(e){var t=this.state.position;return{position:{x:t.x+e.delta.x,y:t.y+e.delta.y},delta:e.delta,lastPosition:t}},t}(a.Component),w=o(81429),E=o(58037),P=o(19959),O=o(56714),H=o(20742),F=o(3218),B={x:0,y:0},L={isOpen:!1,isDarkOverlay:!0,className:"",containerClassName:""},A=(0,s.y)(),K=a.forwardRef((function(e,t){var o=(0,c.j)(L,e),n=o.allowTouchBodyScroll,s=o.className,r=o.children,l=o.containerClassName,g=o.scrollableContentClassName,v=o.elementToFocusOnDismiss,_=o.firstFocusableSelector,N=o.forceFocusInsideTrap,M=o.ignoreExternalFocusing,I=o.isBlocking,K=o.isAlert,R=o.isClickableOutsideFocusTrap,z=o.isDarkOverlay,W=o.onDismiss,U=o.layerProps,V=o.overlay,Q=o.isOpen,Y=o.titleAriaId,Z=o.styles,j=o.subtitleAriaId,q=o.theme,G=o.topOffsetFixed,J=o.responsiveMode,X=o.onLayerDidMount,$=o.isModeless,ee=o.dragOptions,te=o.onDismissed,oe=o.enableAriaHiddenSiblings,ne=a.useRef(null),ie=a.useRef(null),ae=a.useRef(null),se=(0,E.r)(ne,t),re=(0,C.q)(se),le=(0,P.M)("ModalFocusTrapZone"),ce=(0,w.zY)(),de=(0,O.L)(),ue=de.setTimeout,pe=de.clearTimeout,me=a.useState(Q),he=me[0],ge=me[1],fe=a.useState(Q),ve=fe[0],ye=fe[1],xe=a.useState(B),be=xe[0],Ce=xe[1],De=a.useState(),Te=De[0],Se=De[1],_e=(0,H.k)(!1),Ne=_e[0],Me=_e[1],Ie=Me.toggle,ke=Me.setFalse,we=(0,F.B)((function(){return{onModalCloseTimer:0,allowTouchBodyScroll:n,scrollableContent:null,lastSetCoordinates:B,events:new d.r({})}})),Ee=(ee||{}).keepInBounds,Pe=null!==K&&void 0!==K?K:I&&!$,Oe=void 0===U?"":U.className,He=A(Z,{theme:q,className:s,containerClassName:l,scrollableContentClassName:g,isOpen:Q,isVisible:ve,hasBeenOpened:we.hasBeenOpened,modalRectangleTop:Te,topOffsetFixed:G,isModeless:$,layerClassName:Oe,windowInnerHeight:null===ce||void 0===ce?void 0:ce.innerHeight,isDefaultDragHandle:ee&&!ee.dragHandleSelector}),Fe=(0,i.pi)((0,i.pi)({eventBubblingEnabled:!1},U),{onLayerDidMount:U&&U.onLayerDidMount?U.onLayerDidMount:X,insertFirst:$,className:He.layer}),Be=a.useCallback((function(e){e?we.allowTouchBodyScroll?(0,u.eC)(e,we.events):(0,u.C7)(e,we.events):we.events.off(we.scrollableContent),we.scrollableContent=e}),[we]),Le=function(){var e=ae.current,t=null===e||void 0===e?void 0:e.getBoundingClientRect();t&&(G&&Se(t.top),Ee&&(we.minPosition={x:-t.left,y:-t.top},we.maxPosition={x:t.left,y:t.top}))},Ae=a.useCallback((function(e,t){var o=we.minPosition,n=we.maxPosition;return Ee&&o&&n&&(t=Math.max(o[e],t),t=Math.min(n[e],t)),t}),[Ee,we]),Ke=function(){var e;we.lastSetCoordinates=B,ke(),we.isInKeyboardMoveMode=!1,ge(!1),Ce(B),null===(e=we.disposeOnKeyUp)||void 0===e||e.call(we),null===te||void 0===te||te()},Re=a.useCallback((function(){ke(),we.isInKeyboardMoveMode=!1}),[we,ke]),ze=a.useCallback((function(e,t){Ce((function(e){return{x:Ae("x",e.x+t.delta.x),y:Ae("y",e.y+t.delta.y)}}))}),[Ae]),We=a.useCallback((function(){ie.current&&ie.current.focus()}),[]);a.useEffect((function(){pe(we.onModalCloseTimer),Q&&(requestAnimationFrame((function(){return ue(Le,0)})),ge(!0),ee&&function(){var e=function(e){e.altKey&&e.ctrlKey&&e.keyCode===p.m.space&&(0,m.t)(we.scrollableContent,e.target)&&(Ie(),e.preventDefault(),e.stopPropagation())};we.disposeOnKeyUp||(we.events.on(ce,"keyup",e,!0),we.disposeOnKeyUp=function(){we.events.off(ce,"keyup",e,!0),we.disposeOnKeyUp=void 0})}(),we.hasBeenOpened=!0,ye(!0)),!Q&&he&&(we.onModalCloseTimer=ue(Ke,1e3*parseFloat(f)),ye(!1))}),[he,Q]),function(e){var t=a.useRef(e);t.current=e,a.useEffect((function(){return function(){var e;null===(e=t.current)||void 0===e||e.call(t)}}),[])}((function(){we.events.dispose()})),function(e,t){a.useImperativeHandle(e.componentRef,(function(){return{focus:function(){t.current&&t.current.focus()}}}),[t])}(o,ie);var Ue=a.createElement(h.P,{id:le,ref:ae,componentRef:ie,className:He.main,elementToFocusOnDismiss:v,isClickableOutsideFocusTrap:$||R||!I,ignoreExternalFocusing:M,forceFocusInsideTrap:$?!$:N,firstFocusableSelector:_,focusPreviouslyFocusedInnerElement:!0,onBlur:we.isInKeyboardMoveMode?function(){var e;we.lastSetCoordinates=B,we.isInKeyboardMoveMode=!1,null===(e=we.disposeOnKeyDown)||void 0===e||e.call(we)}:void 0,enableAriaHiddenSiblings:oe},ee&&we.isInKeyboardMoveMode&&a.createElement("div",{className:He.keyboardMoveIconContainer},ee.keyboardMoveIconProps?a.createElement(S.J,(0,i.pi)({},ee.keyboardMoveIconProps)):a.createElement(S.J,{iconName:"move",className:He.keyboardMoveIcon})),a.createElement("div",{ref:Be,className:He.scrollableContent,"data-is-scrollable":!0},ee&&Ne&&a.createElement(ee.menu,{items:[{key:"move",text:ee.moveMenuItemText,onClick:function(){var e=function(e){if(e.altKey&&e.ctrlKey&&e.keyCode===p.m.space)return e.preventDefault(),void e.stopPropagation();if(Ne&&(e.altKey||e.keyCode===p.m.escape)&&ke(),!we.isInKeyboardMoveMode||e.keyCode!==p.m.escape&&e.keyCode!==p.m.enter||(we.isInKeyboardMoveMode=!1,e.preventDefault(),e.stopPropagation()),we.isInKeyboardMoveMode){var t=!0,o=function(e){var t=10;return e.shiftKey?e.ctrlKey||(t=50):e.ctrlKey&&(t=1),t}(e);switch(e.keyCode){case p.m.escape:Ce(we.lastSetCoordinates);case p.m.enter:we.lastSetCoordinates=B;break;case p.m.up:Ce((function(e){return{x:e.x,y:Ae("y",e.y-o)}}));break;case p.m.down:Ce((function(e){return{x:e.x,y:Ae("y",e.y+o)}}));break;case p.m.left:Ce((function(e){return{x:Ae("x",e.x-o),y:e.y}}));break;case p.m.right:Ce((function(e){return{x:Ae("x",e.x+o),y:e.y}}));break;default:t=!1}t&&(e.preventDefault(),e.stopPropagation())}};we.lastSetCoordinates=be,ke(),we.isInKeyboardMoveMode=!0,we.events.on(ce,"keydown",e,!0),we.disposeOnKeyDown=function(){we.events.off(ce,"keydown",e,!0),we.disposeOnKeyDown=void 0}}},{key:"close",text:ee.closeMenuItemText,onClick:Ke}],onDismiss:ke,alignTargetEdge:!0,coverTarget:!0,directionalHint:T.b.topLeftEdge,directionalHintFixed:!0,shouldFocusOnMount:!0,target:we.scrollableContent}),r));return he&&re>=(J||D.eD.small)&&a.createElement(x.m,(0,i.pi)({ref:se},Fe),a.createElement(b.G,{role:Pe?"alertdialog":"dialog","aria-modal":!$,ariaLabelledBy:Y,ariaDescribedBy:j,onDismiss:W,shouldRestoreFocus:!M},a.createElement("div",{className:He.root,role:$?void 0:"document"},!$&&a.createElement(y.a,(0,i.pi)({"aria-hidden":!0,isDarkThemed:z,onClick:I?void 0:W,allowTouchBodyScroll:n},V)),ee?a.createElement(k,{handleSelector:ee.dragHandleSelector||"#"+le,preventDragSelector:"button",onStart:Re,onDragChange:ze,onStop:We,position:be},Ue):Ue)))||null}));K.displayName="Modal";var R=(0,n.z)(K,(function(e){var t,o=e.className,n=e.containerClassName,i=e.scrollableContentClassName,a=e.isOpen,s=e.isVisible,r=e.hasBeenOpened,l=e.modalRectangleTop,c=e.theme,d=e.topOffsetFixed,u=e.isModeless,p=e.layerClassName,m=e.isDefaultDragHandle,h=e.windowInnerHeight,y=c.palette,x=c.effects,b=c.fonts,C=(0,g.Cn)(v,c);return{root:[C.root,b.medium,{backgroundColor:"transparent",position:u?"absolute":"fixed",height:"100%",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,pointerEvents:"none",transition:"opacity "+f},d&&"number"===typeof l&&r&&{alignItems:"flex-start"},a&&C.isOpen,s&&{opacity:1,pointerEvents:"auto"},o],main:[C.main,{boxShadow:x.elevation64,borderRadius:x.roundedCorner2,backgroundColor:y.white,boxSizing:"border-box",position:"relative",textAlign:"left",outline:"3px solid transparent",maxHeight:"calc(100% - 32px)",maxWidth:"calc(100% - 32px)",minHeight:"176px",minWidth:"288px",overflowY:"auto",zIndex:u?g.bR.Layer:void 0},d&&"number"===typeof l&&r&&{top:l},m&&{cursor:"move"},n],scrollableContent:[C.scrollableContent,{overflowY:"auto",flexGrow:1,maxHeight:"100vh",selectors:(t={},t["@supports (-webkit-overflow-scrolling: touch)"]={maxHeight:h},t)},i],layer:u&&[p,C.layer,{position:"static",width:"unset",height:"unset"}],keyboardMoveIconContainer:{position:"absolute",display:"flex",justifyContent:"center",width:"100%",padding:"3px 0px"},keyboardMoveIcon:{fontSize:b.xLargePlus.fontSize,width:"24px"}}}),void 0,{scope:"Modal",fields:["theme","styles","enableAriaHiddenSiblings"]});R.displayName="Modal";var z=o(74399),W=o(77462),U=o(85554),V=o(42940),Q=o(23408),Y=(0,s.y)(),Z=a.createElement(Q.c,null).type,j=function(e){function t(t){var o=e.call(this,t)||this;return(0,z.l)(o),(0,W.b)("DialogContent",t,{titleId:"titleProps.id"}),o}return(0,i.ZT)(t,e),t.prototype.render=function(){var e,t=this.props,o=t.showCloseButton,n=t.className,s=t.closeButtonAriaLabel,r=t.onDismiss,c=t.subTextId,d=t.subText,u=t.titleProps,p=void 0===u?{}:u,m=t.titleId,h=t.title,g=t.type,f=t.styles,v=t.theme,y=t.draggableHeaderClassName,x=Y(f,{theme:v,className:n,isLargeHeader:g===l.i.largeHeader,isClose:g===l.i.close,draggableHeaderClassName:y}),b=this._groupChildren();return d&&(e=a.createElement("p",{className:x.subText,id:c},d)),a.createElement("div",{className:x.content},a.createElement("div",{className:x.header},a.createElement("div",(0,i.pi)({id:m,role:"heading","aria-level":1},p,{className:(0,U.i)(x.title,p.className)}),h),a.createElement("div",{className:x.topButton},this.props.topButtonsProps.map((function(e,t){return a.createElement(V.h,(0,i.pi)({key:e.uniqueId||t},e))})),(g===l.i.close||o&&g!==l.i.largeHeader)&&a.createElement(V.h,{className:x.button,iconProps:{iconName:"Cancel"},ariaLabel:s,onClick:r}))),a.createElement("div",{className:x.inner},a.createElement("div",{className:x.innerContent},e,b.contents),b.footers))},t.prototype._groupChildren=function(){var e={footers:[],contents:[]};return a.Children.map(this.props.children,(function(t){"object"===typeof t&&null!==t&&t.type===Z?e.footers.push(t):e.contents.push(t)})),e},t.defaultProps={showCloseButton:!1,className:"",topButtonsProps:[],closeButtonAriaLabel:"Close"},t=(0,i.gn)([D.Ae],t)}(a.Component),q={contentLgHeader:"ms-Dialog-lgHeader",close:"ms-Dialog--close",subText:"ms-Dialog-subText",header:"ms-Dialog-header",headerLg:"ms-Dialog--lgHeader",button:"ms-Dialog-button ms-Dialog-button--close",inner:"ms-Dialog-inner",content:"ms-Dialog-content",title:"ms-Dialog-title"},G=(0,n.z)(j,(function(e){var t,o,n,i=e.className,a=e.theme,s=e.isLargeHeader,r=e.isClose,l=e.hidden,c=e.isMultiline,d=e.draggableHeaderClassName,u=a.palette,p=a.fonts,m=a.effects,h=a.semanticColors,f=(0,g.Cn)(q,a);return{content:[s&&[f.contentLgHeader,{borderTop:"4px solid "+u.themePrimary}],r&&f.close,{flexGrow:1,overflowY:"hidden"},i],subText:[f.subText,p.medium,{margin:"0 0 24px 0",color:h.bodySubtext,lineHeight:"1.5",wordWrap:"break-word",fontWeight:g.lq.regular}],header:[f.header,{position:"relative",width:"100%",boxSizing:"border-box"},r&&f.close,d&&[d,{cursor:"move"}]],button:[f.button,l&&{selectors:{".ms-Icon.ms-Icon--Cancel":{color:h.buttonText,fontSize:g.ld.medium}}}],inner:[f.inner,{padding:"0 24px 24px",selectors:(t={},t["@media (min-width: "+g.QQ+"px) and (max-width: "+g.mV+"px)"]={padding:"0 16px 16px"},t)}],innerContent:[f.content,{position:"relative",width:"100%"}],title:[f.title,p.xLarge,{color:h.bodyText,margin:"0",minHeight:p.xLarge.fontSize,padding:"16px 46px 20px 24px",lineHeight:"normal",selectors:(o={},o["@media (min-width: "+g.QQ+"px) and (max-width: "+g.mV+"px)"]={padding:"16px 46px 16px 16px"},o)},s&&{color:h.menuHeader},c&&{fontSize:p.xxLarge.fontSize}],topButton:[{display:"flex",flexDirection:"row",flexWrap:"nowrap",position:"absolute",top:"0",right:"0",padding:"15px 15px 0 0",selectors:(n={"> *":{flex:"0 0 auto"},".ms-Dialog-button":{color:h.buttonText},".ms-Dialog-button:hover":{color:h.buttonTextHovered,borderRadius:m.roundedCorner2}},n["@media (min-width: "+g.QQ+"px) and (max-width: "+g.mV+"px)"]={padding:"15px 8px 0 0"},n)}]}}),void 0,{scope:"DialogContent"}),J=(0,s.y)(),X={isDarkOverlay:!1,isBlocking:!1,className:"",containerClassName:"",topOffsetFixed:!1},$={type:l.i.normal,className:"",topButtonsProps:[]},ee=function(e){function t(t){var o=e.call(this,t)||this;return o._getSubTextId=function(){var e=o.props,t=e.ariaDescribedById,n=e.modalProps,i=e.dialogContentProps,a=e.subText,s=n&&n.subtitleAriaId||t;return s||(s=(i&&i.subText||a)&&o._defaultSubTextId),s},o._getTitleTextId=function(){var e=o.props,t=e.ariaLabelledById,n=e.modalProps,i=e.dialogContentProps,a=e.title,s=n&&n.titleAriaId||t;return s||(s=(i&&i.title||a)&&o._defaultTitleTextId),s},o._id=(0,r.z)("Dialog"),o._defaultTitleTextId=o._id+"-title",o._defaultSubTextId=o._id+"-subText",o}return(0,i.ZT)(t,e),t.prototype.render=function(){var e,t,o,n,s=this.props,r=s.className,l=s.containerClassName,c=s.contentClassName,d=s.elementToFocusOnDismiss,u=s.firstFocusableSelector,p=s.forceFocusInsideTrap,m=s.styles,h=s.hidden,g=s.ignoreExternalFocusing,f=s.isBlocking,v=s.isClickableOutsideFocusTrap,y=s.isDarkOverlay,x=s.isOpen,b=s.onDismiss,C=s.onDismissed,D=s.onLayerDidMount,T=s.responsiveMode,S=s.subText,_=s.theme,N=s.title,M=s.topButtonsProps,I=s.type,k=s.minWidth,w=s.maxWidth,E=s.modalProps,P=(0,i.pi)({},E?E.layerProps:{onLayerDidMount:D});D&&!P.onLayerDidMount&&(P.onLayerDidMount=D),E&&E.dragOptions&&!E.dragOptions.dragHandleSelector?(o="ms-Dialog-draggable-header",n=(0,i.pi)((0,i.pi)({},E.dragOptions),{dragHandleSelector:"."+o})):n=E&&E.dragOptions;var O=(0,i.pi)((0,i.pi)((0,i.pi)((0,i.pi)({},X),{className:r,containerClassName:l,isBlocking:f,isDarkOverlay:y,onDismissed:C}),E),{layerProps:P,dragOptions:n}),H=(0,i.pi)((0,i.pi)((0,i.pi)({className:c,subText:S,title:N,topButtonsProps:M,type:I},$),this.props.dialogContentProps),{draggableHeaderClassName:o,titleProps:(0,i.pi)({id:(null===(e=this.props.dialogContentProps)||void 0===e?void 0:e.titleId)||this._defaultTitleTextId},null===(t=this.props.dialogContentProps)||void 0===t?void 0:t.titleProps)}),F=J(m,{theme:_,className:O.className,containerClassName:O.containerClassName,hidden:h,dialogDefaultMinWidth:k,dialogDefaultMaxWidth:w});return a.createElement(R,(0,i.pi)({elementToFocusOnDismiss:d,firstFocusableSelector:u,forceFocusInsideTrap:p,ignoreExternalFocusing:g,isClickableOutsideFocusTrap:v,responsiveMode:T},O,{isOpen:void 0!==x?x:!h,className:F.root,containerClassName:F.main,onDismiss:b||O.onDismiss,subtitleAriaId:this._getSubTextId(),titleAriaId:this._getTitleTextId()}),a.createElement(G,(0,i.pi)({subTextId:this._defaultSubTextId,showCloseButton:O.isBlocking,onDismiss:b},H),this.props.children))},t.defaultProps={hidden:!0},t=(0,i.gn)([D.Ae],t)}(a.Component),te={root:"ms-Dialog"},oe=(0,n.z)(ee,(function(e){var t,o=e.className,n=e.containerClassName,i=e.dialogDefaultMinWidth,a=void 0===i?"288px":i,s=e.dialogDefaultMaxWidth,r=void 0===s?"340px":s,l=e.hidden,c=e.theme;return{root:[(0,g.Cn)(te,c).root,c.fonts.medium,o],main:[{width:a,outline:"3px solid transparent",selectors:(t={},t["@media (min-width: "+g.dd+"px)"]={width:"auto",maxWidth:r,minWidth:a},t)},!l&&{display:"flex"},n]}}),void 0,{scope:"Dialog"});oe.displayName="Dialog"},48934:function(e,t,o){var n;o.d(t,{i:function(){return n}}),function(e){e[e.normal=0]="normal",e[e.largeHeader=1]="largeHeader",e[e.close=2]="close"}(n||(n={}))},23408:function(e,t,o){o.d(t,{c:function(){return p}});var n=o(32734),i=o(7642),a=o(74812),s=o(39735),r=o(74399),l=(0,s.y)(),c=function(e){function t(t){var o=e.call(this,t)||this;return(0,r.l)(o),o}return(0,i.ZT)(t,e),t.prototype.render=function(){var e=this.props,t=e.className,o=e.styles,n=e.theme;return this._classNames=l(o,{theme:n,className:t}),a.createElement("div",{className:this._classNames.actions},a.createElement("div",{className:this._classNames.actionsRight},this._renderChildrenAsActions()))},t.prototype._renderChildrenAsActions=function(){var e=this;return a.Children.map(this.props.children,(function(t){return t?a.createElement("span",{className:e._classNames.action},t):null}))},t}(a.Component),d=o(42911),u={actions:"ms-Dialog-actions",action:"ms-Dialog-action",actionsRight:"ms-Dialog-actionsRight"},p=(0,n.z)(c,(function(e){var t=e.className,o=e.theme,n=(0,d.Cn)(u,o);return{actions:[n.actions,{position:"relative",width:"100%",minHeight:"24px",lineHeight:"24px",margin:"16px 0 0",fontSize:"0",selectors:{".ms-Button":{lineHeight:"normal"}}},t],action:[n.action,{margin:"0 4px"}],actionsRight:[n.actionsRight,{textAlign:"right",marginRight:"-4px",fontSize:"0"}]}}),void 0,{scope:"DialogFooter"})}}]);
//# sourceMappingURL=876.e155dd6b.chunk.js.map