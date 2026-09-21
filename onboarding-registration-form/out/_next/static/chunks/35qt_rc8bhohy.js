(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,49190,(e,t,r)=>{"use strict";function n(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,t.qualities[0]):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return n}})},21787,(e,t,r)=>{"use strict";e.i(14726),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return a}});let n=e.r(49190),i=e.r(85274);function o({config:e,src:t,width:r,quality:a}){let s=(0,i.getDeploymentId)();if(t.startsWith("/")&&!t.startsWith("//"))if(t.includes("/_next/static/immutable")&&!(0,i.getAssetToken)())s=void 0;else{let e=t.indexOf("?");if(-1!==e){let r=new URLSearchParams(t.slice(e+1)),n=r.get("dpl");if(n){s=n,r.delete("dpl");let i=r.toString();t=t.slice(0,e)+(i?"?"+i:"")}}}if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let l=(0,n.findClosestQuality)(a,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${l}${t.startsWith("/")&&s?`&dpl=${s}`:""}`}o.__next_img_default=!0;let a=o},15840,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return i}});let n=e.r(68086);function i(e,t){let r=(0,n.useRef)(null),i=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(r.current=o(e,n)),t&&(i.current=o(t,n))},[e,t])}function o(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},15048,(e,t,r)=>{"use strict";e.i(14726),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return v}});let n=e.r(30322),i=e.r(54689),o=e.r(29196),a=i._(e.r(68086)),s=n._(e.r(15421)),l=n._(e.r(42895)),d=e.r(70595),c=e.r(20786),u=e.r(36607),p=e.r(36299),h=n._(e.r(21787)),f=e.r(15840),g={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image/",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0};function m(e,t,r,n,i,o,a){let s=e?.src;e&&e["data-loaded-src"]!==s&&(e["data-loaded-src"]=s,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&i(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let n=!1,i=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>n,isPropagationStopped:()=>i,persist:()=>{},preventDefault:()=>{n=!0,t.preventDefault()},stopPropagation:()=>{i=!0,t.stopPropagation()}})}n?.current&&n.current(e)}}))}function b(e){return a.use?{fetchPriority:e}:{fetchpriority:e}}"u"<typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let y="u"<typeof window?a.useEffect:a.useLayoutEffect,x=(0,a.forwardRef)(({src:e,srcSet:t,sizes:r,height:n,width:i,decoding:s,className:l,style:d,fetchPriority:c,placeholder:u,loading:p,unoptimized:h,fill:g,onLoadRef:x,onLoadingCompleteRef:w,setBlurComplete:v,setShowAltText:j,sizesInput:_,onLoad:S,onError:O,...C},R)=>{let E=(0,a.useRef)(!1),N=(0,a.useRef)(null);y(()=>{let{current:e}=E,{current:t}=N;e||null===t||(O&&(t.src=t.src),t.complete&&m(t,u,x,w,v,h,_),E.current=!0)},[e,u,x,w,O,h,_]);let P=(0,f.useMergedRef)(R,N);return(0,o.jsx)("img",{...C,...b(c),loading:p,width:i,height:n,decoding:s,"data-nimg":g?"fill":"1",className:l,style:d,sizes:r,srcSet:t,src:e,ref:P,onLoad:e=>{m(e.currentTarget,u,x,w,v,h,_)},onError:e=>{j(!0),"empty"!==u&&v(!0),O&&O(e)}})});function w({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...b(t.fetchPriority)};return e&&s.default.preload?(s.default.preload(t.src,r),null):(0,o.jsx)(l.default,{children:(0,o.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let v=(0,a.forwardRef)((e,t)=>{let r=(0,a.useContext)(p.RouterContext),n=(0,a.useContext)(u.ImageConfigContext),i=(0,a.useMemo)(()=>{let e=g||n||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),i=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:i,localPatterns:"u"<typeof window?n?.localPatterns:e.localPatterns}},[n]),{onLoad:s,onLoadingComplete:l}=e,f=(0,a.useRef)(s);(0,a.useEffect)(()=>{f.current=s},[s]);let m=(0,a.useRef)(l);(0,a.useEffect)(()=>{m.current=l},[l]);let[b,y]=(0,a.useState)(!1),[v,j]=(0,a.useState)(!1),{props:_,meta:S}=(0,d.getImgProps)(e,{defaultLoader:h.default,imgConf:i,blurComplete:b,showAltText:v});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(x,{..._,unoptimized:S.unoptimized,placeholder:S.placeholder,fill:S.fill,onLoadRef:f,onLoadingCompleteRef:m,setBlurComplete:y,setShowAltText:j,sizesInput:e.sizes,ref:t}),S.preload?(0,o.jsx)(w,{isAppRouter:!r,imgAttributes:_}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},31374,(e,t,r)=>{"use strict";e.i(14726),Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return c},getImageProps:function(){return d}};for(var i in n)Object.defineProperty(r,i,{enumerable:!0,get:n[i]});let o=e.r(30322),a=e.r(70595),s=e.r(15048),l=o._(e.r(21787));function d(e){let{props:t}=(0,a.getImgProps)(e,{defaultLoader:l.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image/",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let c=s.Image},54170,(e,t,r)=>{t.exports=e.r(31374)},68103,e=>{"use strict";let t,r,n,i;var o,a,s,l,d,c,u,p=e.i(14726),h=e.i(29196),f=e.i(68086),g=e.i(46522);Object.create(null);var m="-ms-",b="-moz-",y="-webkit-",x="comm",w="rule",v="decl",j="@keyframes",_=Math.abs,S=String.fromCharCode,O=Object.assign;function C(e,t){return(e=t.exec(e))?e[0]:e}function R(e,t,r){return e.replace(t,r)}function E(e,t,r){return e.indexOf(t,r)}function N(e,t){return 0|e.charCodeAt(t)}function P(e,t,r){return e.slice(t,r)}function A(e){return e.length}function k(e,t){return t.push(e),e}function T(e,t){return e.filter(function(e){return!C(e,t)})}var I=1,F=1,$=0,z=0,D=0,L="";function B(e,t,r,n,i,o,a,s){return{value:e,root:t,parent:r,type:n,props:i,children:o,line:I,column:F,length:a,return:"",siblings:s}}function U(e,t){return O(B("",null,null,"",null,null,0,e.siblings),e,{length:-e.length},t)}function M(e){for(;e.root;)e=U(e.root,{children:[e]});k(e,e.siblings)}function q(){return D=z<$?N(L,z++):0,F++,10===D&&(F=1,I++),D}function X(){return N(L,z)}function W(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function H(e){var t,r;return(t=z-1,r=function e(t){for(;q();)switch(D){case t:return z;case 34:case 39:34!==t&&39!==t&&e(D);break;case 40:41===t&&e(t);break;case 92:q()}return z}(91===e?e+2:40===e?e+1:e),P(L,t,r)).trim()}function G(e,t){for(var r="",n=0;n<e.length;n++)r+=t(e[n],n,e,t)||"";return r}function Y(e,t,r,n){switch(e.type){case"@layer":if(e.children.length)break;case"@import":case"@namespace":case v:return e.return=e.return||e.value;case x:return"";case j:return e.return=e.value+"{"+G(e.children,n)+"}";case w:if(!A(e.value=e.props.join(",")))return""}return A(r=G(e.children,n))?e.return=e.value+"{"+r+"}":""}function J(e,t,r,n){if(e.length>-1&&!e.return)switch(e.type){case v:e.return=function e(t,r,n){var i;switch(i=r,45^N(t,0)?(((i<<2^N(t,0))<<2^N(t,1))<<2^N(t,2))<<2^N(t,3):0){case 5103:return y+"print-"+t+t;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:case 6391:case 5879:case 5623:case 6135:case 4599:return y+t+t;case 4855:return y+t.replace("add","source-over").replace("substract","source-out").replace("intersect","source-in").replace("exclude","xor")+t;case 4789:return b+t+t;case 5349:case 4246:case 4810:case 6968:case 2756:return y+t+b+t+m+t+t;case 5936:switch(N(t,r+11)){case 114:return y+t+m+R(t,/[svh]\w+-[tblr]{2}/,"tb")+t;case 108:return y+t+m+R(t,/[svh]\w+-[tblr]{2}/,"tb-rl")+t;case 45:return y+t+m+R(t,/[svh]\w+-[tblr]{2}/,"lr")+t}case 6828:case 4268:case 2903:return y+t+m+t+t;case 6165:return y+t+m+"flex-"+t+t;case 5187:return y+t+R(t,/(\w+).+(:[^]+)/,y+"box-$1$2"+m+"flex-$1$2")+t;case 5443:return y+t+m+"flex-item-"+R(t,/flex-|-self/g,"")+(C(t,/flex-|baseline/)?"":m+"grid-row-"+R(t,/flex-|-self/g,""))+t;case 4675:return y+t+m+"flex-line-pack"+R(t,/align-content|flex-|-self/g,"")+t;case 5548:return y+t+m+R(t,"shrink","negative")+t;case 5292:return y+t+m+R(t,"basis","preferred-size")+t;case 6060:return y+"box-"+R(t,"-grow","")+y+t+m+R(t,"grow","positive")+t;case 4554:return y+R(t,/([^-])(transform)/g,"$1"+y+"$2")+t;case 6187:return R(R(R(t,/(zoom-|grab)/,y+"$1"),/(image-set)/,y+"$1"),t,"")+t;case 5495:case 3959:return R(t,/(image-set\([^]*)/,y+"$1$`$1");case 4968:return R(R(t,/(.+:)(flex-)?(.*)/,y+"box-pack:$3"+m+"flex-pack:$3"),/space-between/,"justify")+y+t+t;case 4200:if(!C(t,/flex-|baseline/))return m+"grid-column-align"+P(t,r)+t;break;case 2592:case 3360:return m+R(t,"template-","")+t;case 4384:case 3616:if(n&&n.some(function(e,t){return r=t,C(e.props,/grid-\w+-end/)}))return~E(t+(n=n[r].value),"span",0)?t:m+R(t,"-start","")+t+m+"grid-row-span:"+(~E(n,"span",0)?C(n,/\d+/):C(n,/\d+/)-C(t,/\d+/))+";";return m+R(t,"-start","")+t;case 4896:case 4128:return n&&n.some(function(e){return C(e.props,/grid-\w+-start/)})?t:m+R(R(t,"-end","-span"),"span ","")+t;case 4095:case 3583:case 4068:case 2532:return R(t,/(.+)-inline(.+)/,y+"$1$2")+t;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(A(t)-1-r>6)switch(N(t,r+1)){case 109:if(45!==N(t,r+4))break;case 102:return R(t,/(.+:)(.+)-([^]+)/,"$1"+y+"$2-$3$1"+b+(108==N(t,r+3)?"$3":"$2-$3"))+t;case 115:return~E(t,"stretch",0)?e(R(t,"stretch","fill-available"),r,n)+t:t}break;case 5152:case 5920:return R(t,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,function(e,r,n,i,o,a,s){return m+r+":"+n+s+(i?m+r+"-span:"+(o?a:a-n)+s:"")+t});case 4949:if(121===N(t,r+6))return R(t,":",":"+y)+t;break;case 6444:switch(N(t,45===N(t,14)?18:11)){case 120:return R(t,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+y+(45===N(t,14)?"inline-":"")+"box$3$1"+y+"$2$3$1"+m+"$2box$3")+t;case 100:return R(t,":",":"+m)+t}break;case 5719:case 2647:case 2135:case 3927:case 2391:return R(t,"scroll-","scroll-snap-")+t}return t}(e.value,e.length,r);return;case j:return G([U(e,{value:R(e.value,"@","@"+y)})],n);case w:if(e.length){var i,o;return i=r=e.props,o=function(t){switch(C(t,n=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":M(U(e,{props:[R(t,/:(read-\w+)/,":"+b+"$1")]})),M(U(e,{props:[t]})),O(e,{props:T(r,n)});break;case"::placeholder":M(U(e,{props:[R(t,/:(plac\w+)/,":"+y+"input-$1")]})),M(U(e,{props:[R(t,/:(plac\w+)/,":"+b+"$1")]})),M(U(e,{props:[R(t,/:(plac\w+)/,m+"input-$1")]})),M(U(e,{props:[t]})),O(e,{props:T(r,n)})}return""},i.map(o).join("")}}}function V(e,t,r,n,i,o,a,s,l,d,c,u){for(var p=i-1,h=0===i?o:[""],f=h.length,g=0,m=0,b=0;g<n;++g)for(var y=0,x=P(e,p+1,p=_(m=a[g])),v=e;y<f;++y)(v=(m>0?h[y]+" "+x:R(x,/&\f/g,h[y])).trim())&&(l[b++]=v);return B(e,t,r,0===i?w:s,l,d,c,u)}function K(e,t,r,n,i){return B(e,t,r,v,P(e,0,n),P(e,n+1,-1),n,i)}let Q=void 0!==p.default&&void 0!==p.default.env&&(p.default.env.REACT_APP_SC_ATTR||p.default.env.SC_ATTR)||"data-styled",Z="active",ee="data-styled-version",et="6.5.3",er="/*!sc*/\n",en="u">typeof window&&"u">typeof document;function ei(e){if(void 0!==p.default&&void 0!==p.default.env){let t=p.default.env[e];if(void 0!==t&&""!==t)return"false"!==t}}let eo=!!("boolean"==typeof SC_DISABLE_SPEEDY?SC_DISABLE_SPEEDY:null!=(c=null!=(d=ei("REACT_APP_SC_DISABLE_SPEEDY"))?d:ei("SC_DISABLE_SPEEDY"))?c:void 0!==p.default&&void 0!==p.default.env&&!1),ea="sc-keyframes-",es={};function el(e,...t){return Error(`An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#${e} for more information.${t.length>0?` Args: ${t.join(", ")}`:""}`)}let ed=new Map,ec=new Map,eu=1,ep=e=>{if(ed.has(e))return ed.get(e);for(;ec.has(eu);)eu++;let t=eu++;return ed.set(e,t),ec.set(t,e),t},eh=e=>ec.get(e),ef=(e,t)=>{eu=t+1,ed.set(e,t),ec.set(t,e)},eg=Object.freeze([]),em=Object.freeze({});function eb(e,t,r=em){return e.theme!==r.theme&&e.theme||t||r.theme}let ey=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,ex=/(^-|-$)/g;function ew(e){return e.replace(ey,"-").replace(ex,"")}let ev=/(a)(d)/gi,ej=e=>String.fromCharCode(e+(e>25?39:97));function e_(e){let t,r="";for(t=Math.abs(e);t>52;t=t/52|0)r=ej(t%52)+r;return(ej(t%52)+r).replace(ev,"$1-$2")}let eS=(e,t)=>{let r=t.length;for(;r;)e=33*e^t.charCodeAt(--r);return e};function eO(e){return e_(eS(5381,e)>>>0)}function eC(e){return"string"==typeof e}let eR=Symbol.for("react.memo"),eE=Symbol.for("react.forward_ref"),eN={contextType:!0,defaultProps:!0,displayName:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,propTypes:!0,type:!0},eP={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},eA={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},ek={[eE]:{$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},[eR]:eA};function eT(e){return("type"in e&&e.type.$$typeof)===eR?eA:"$$typeof"in e?ek[e.$$typeof]:eN}let eI=Object.defineProperty,eF=Object.getOwnPropertyNames,e$=Object.getOwnPropertySymbols,ez=Object.getOwnPropertyDescriptor,eD=Object.getPrototypeOf,eL=Object.prototype;function eB(e){return"function"==typeof e}let eU=Symbol.for("react.forward_ref");function eM(e){return null!=e&&("object"==typeof e||"function"==typeof e)&&e.$$typeof===eU&&"styledComponentId"in e}function eq(e,t){return e&&t?e+" "+t:e||t||""}function eX(e,t){return e.join(t||"")}function eW(e){return null!==e&&"object"==typeof e&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function eH(e,t){Object.defineProperty(e,"toString",{value:t})}let eG=class{constructor(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e,this._cGroup=0,this._cIndex=0}indexOfGroup(e){if(e===this._cGroup)return this._cIndex;let t=this._cIndex;if(e>this._cGroup)for(let r=this._cGroup;r<e;r++)t+=this.groupSizes[r];else for(let r=this._cGroup-1;r>=e;r--)t-=this.groupSizes[r];return this._cGroup=e,this._cIndex=t,t}insertRules(e,t){if(e>=this.groupSizes.length){let t=this.groupSizes,r=t.length,n=r;for(;e>=n;)if((n<<=1)<0)throw el(16,`${e}`);this.groupSizes=new Uint32Array(n),this.groupSizes.set(t),this.length=n;for(let e=r;e<n;e++)this.groupSizes[e]=0}let r=this.indexOfGroup(e+1),n=0;for(let i=0,o=t.length;i<o;i++)this.tag.insertRule(r,t[i])&&(this.groupSizes[e]++,r++,n++);n>0&&this._cGroup>e&&(this._cIndex+=n)}clearGroup(e){if(e<this.length){let t=this.groupSizes[e],r=this.indexOfGroup(e),n=r+t;this.groupSizes[e]=0;for(let e=r;e<n;e++)this.tag.deleteRule(r);t>0&&this._cGroup>e&&(this._cIndex-=t)}}getGroup(e){let t="";if(e>=this.length||0===this.groupSizes[e])return t;let r=this.groupSizes[e],n=this.indexOfGroup(e),i=n+r;for(let e=n;e<i;e++)t+=this.tag.getRule(e)+er;return t}},eY=`style[${Q}][${ee}="${et}"]`,eJ=RegExp(`^${Q}\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)`),eV=e=>"u">typeof ShadowRoot&&e instanceof ShadowRoot||"host"in e&&11===e.nodeType,eK=e=>{if(!e)return document;if(eV(e))return e;if("getRootNode"in e){let t=e.getRootNode();if(eV(t))return t}return document},eQ=(e,t,r)=>{let n,i=r.split(",");for(let r=0,o=i.length;r<o;r++)(n=i[r])&&e.registerName(t,n)},eZ=(e,t)=>{var r;let n=(null!=(r=t.textContent)?r:"").split(er),i=[];for(let t=0,r=n.length;t<r;t++){let r=n[t].trim();if(!r)continue;let o=r.match(eJ);if(o){let t=0|parseInt(o[1],10),r=o[2];0!==t&&(ef(r,t),eQ(e,r,o[3]),e.getTag().insertRules(t,i)),i.length=0}else i.push(r)}},e0=e=>{let t=eK(e.options.target).querySelectorAll(eY);for(let r=0,n=t.length;r<n;r++){let n=t[r];n&&n.getAttribute(Q)!==Z&&(eZ(e,n),n.parentNode&&n.parentNode.removeChild(n))}},e1=!1,e2=(e,t)=>{let r,n=document.head,i=e||n,o=document.createElement("style"),a=(r=Array.from(i.querySelectorAll(`style[${Q}]`)))[r.length-1],s=void 0!==a?a.nextSibling:null;o.setAttribute(Q,Z),o.setAttribute(ee,et);let l=t||function(){if(!1!==e1)return e1;if("u">typeof document){let e=document.head.querySelector('meta[property="csp-nonce"]');if(e)return e1=e.nonce||e.getAttribute("content")||void 0;let t=document.head.querySelector('meta[name="sc-nonce"]');if(t)return e1=t.getAttribute("content")||void 0}return e1="u">typeof __webpack_nonce__?__webpack_nonce__:void 0}();return l&&o.setAttribute("nonce",l),i.insertBefore(o,s),o},e5=class{constructor(e,t){this.element=e2(e,t),this.element.appendChild(document.createTextNode("")),this.sheet=(e=>{var t;if(e.sheet)return e.sheet;let r=null!=(t=e.getRootNode().styleSheets)?t:document.styleSheets;for(let t=0,n=r.length;t<n;t++){let n=r[t];if(n.ownerNode===e)return n}throw el(17)})(this.element),this.length=0}insertRule(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return!1}}deleteRule(e){this.sheet.deleteRule(e),this.length--}getRule(e){let t=this.sheet.cssRules[e];return t&&t.cssText?t.cssText:""}},e4=class{constructor(e,t){this.element=e2(e,t),this.nodes=this.element.childNodes,this.length=0}insertRule(e,t){if(e<=this.length&&e>=0){let r=document.createTextNode(t);return this.element.insertBefore(r,this.nodes[e]||null),this.length++,!0}return!1}deleteRule(e){this.element.removeChild(this.nodes[e]),this.length--}getRule(e){return e<this.length?this.nodes[e].textContent:""}},e3=en,e8={isServer:!en,useCSSOMInjection:!eo};class e9{static registerId(e){return ep(e)}constructor(e=em,t={},r){this.options=Object.assign(Object.assign({},e8),e),this.gs=t,this.keyframeIds=new Set,this.names=new Map(r),this.server=!!e.isServer,!this.server&&en&&e3&&(e3=!1,e0(this)),eH(this,()=>(e=>{let t=e.getTag(),{length:r}=t,n="";for(let i=0;i<r;i++){let r=eh(i);if(void 0===r)continue;let o=e.names.get(r);if(void 0===o||!o.size)continue;let a=t.getGroup(i);if(0===a.length)continue;let s=Q+".g"+i+'[id="'+r+'"]',l="";for(let e of o)e.length>0&&(l+=e+",");n+=a+s+'{content:"'+l+'"}'+er}return n})(this))}rehydrate(){!this.server&&en&&e0(this)}reconstructWithOptions(e,t=!0){let r=new e9(Object.assign(Object.assign({},this.options),e),this.gs,t&&this.names||void 0);return r.keyframeIds=new Set(this.keyframeIds),!this.server&&en&&e.target!==this.options.target&&eK(this.options.target)!==eK(e.target)&&e0(r),r}allocateGSInstance(e){return this.gs[e]=(this.gs[e]||0)+1}getTag(){return this.tag||(this.tag=new eG((({useCSSOMInjection:e,target:t,nonce:r})=>e?new e5(t,r):new e4(t,r))(this.options)))}hasNameForId(e,t){var r,n;return null!=(n=null==(r=this.names.get(e))?void 0:r.has(t))&&n}registerName(e,t){ep(e),e.startsWith(ea)&&this.keyframeIds.add(e);let r=this.names.get(e);r?r.add(t):this.names.set(e,new Set([t]))}insertRules(e,t,r){this.registerName(e,t),this.getTag().insertRules(ep(e),r)}clearNames(e){this.names.has(e)&&this.names.get(e).clear()}clearRules(e){this.getTag().clearGroup(ep(e)),this.clearNames(e)}clearTag(){this.tag=void 0}}let e6=new WeakSet,e7={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexShrink:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,scale:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1};function te(e){if(45===e.charCodeAt(0)&&45===e.charCodeAt(1))return e;let t="";for(let r=0;r<e.length;r++){let n=e.charCodeAt(r);t+=n>=65&&n<=90?"-"+String.fromCharCode(n+32):e[r]}return t.startsWith("ms-")?"-"+t:t}let tt=Symbol.for("sc-keyframes");function tr(e){return eB(e)&&!(e.prototype&&e.prototype.isReactComponent)}let tn=e=>null==e||!1===e||""===e,ti=Symbol.for("react.client.reference");function to(e){return e.$$typeof===ti}function ta(e,t,r,n,i=[]){if(tn(e))return i;let o=typeof e;if("string"===o)return i.push(e),i;if("function"===o)return to(e)?i:tr(e)&&t?ta(e(t),t,r,n,i):(i.push(e),i);if(Array.isArray(e)){for(let o=0;o<e.length;o++)ta(e[o],t,r,n,i);return i}return eM(e)?i.push(`.${e.styledComponentId}`):"object"==typeof e&&null!==e&&tt in e?r?(e.inject(r,n),i.push(e.getName(n))):i.push(e):to(e)||(eW(e)?e.toString!==Object.prototype.toString?i.push(e.toString()):function e(t,r){for(let n in t){let i=t[n];t.hasOwnProperty(n)&&!tn(i)&&(Array.isArray(i)&&e6.has(i)||eB(i)?r.push(te(n)+":",i,";"):eW(i)?(r.push(n+" {"),e(i,r),r.push("}")):r.push(te(n)+": "+(null==i||"boolean"==typeof i||""===i?"":"number"!=typeof i||0===i||n in e7||n.startsWith("--")?String(i).trim():i+"px")+";"))}}(e,i):i.push(e.toString())),i}let ts=eS(5381,et);class tl{constructor(e,t,r){this.rules=e,this.componentId=t,this.baseHash=eS(ts,t),this.baseStyle=r,e9.registerId(t)}generateAndInjectStyles(e,t,r){let n=this.baseStyle?this.baseStyle.generateAndInjectStyles(e,t,r):"";{let i="";for(let n=0;n<this.rules.length;n++){let o=this.rules[n];if("string"==typeof o)i+=o;else if(o)if(tr(o)){let n=o(e);"string"==typeof n?i+=n:null!=n&&!1!==n&&(i+=eX(ta(n,e,t,r)))}else i+=eX(ta(o,e,t,r))}if(i){this.dynamicNameCache||(this.dynamicNameCache=new Map);let e=r.hash?r.hash+i:i,o=this.dynamicNameCache.get(e);if(!o){if(o=e_(eS(eS(this.baseHash,r.hash),i)>>>0),this.dynamicNameCache.size>=200){let e=this.dynamicNameCache.keys().next().value;void 0!==e&&this.dynamicNameCache.delete(e)}this.dynamicNameCache.set(e,o)}if(!t.hasNameForId(this.componentId,o)){let e=r(i,"."+o,void 0,this.componentId);t.insertRules(this.componentId,o,e)}n=eq(n,o)}}return n}}let td=/&/g;function tc(e,t){let r=0;for(;--t>=0&&92===e.charCodeAt(t);)r++;return!(1&~r)}function tu(e){let t=e.length,r="",n=0,i=0,o=0,a=!1,s=!1;for(let l=0;l<t;l++){let d=e.charCodeAt(l);if(0!==o||a||47!==d||42!==e.charCodeAt(l+1))if(a)42===d&&47===e.charCodeAt(l+1)&&(a=!1,l++);else if(34!==d&&39!==d||tc(e,l)){if(0===o)if(123===d)i++;else if(125===d){if(--i<0){s=!0;let r=l+1;for(;r<t;){let t=e.charCodeAt(r);if(59===t||10===t)break;r++}r<t&&59===e.charCodeAt(r)&&r++,i=0,l=r-1,n=r;continue}0===i&&(r+=e.substring(n,l+1),n=l+1)}else 59===d&&0===i&&(r+=e.substring(n,l+1),n=l+1)}else 0===o?o=d:o===d&&(o=0);else a=!0,l++}return s||0!==i||0!==o?(n<t&&0===i&&0===o&&(r+=e.substring(n)),r):e}let tp=new e9,th=function({options:e=em,plugins:t=eg}=em){var r,n,i;let o,a,s,l=(e,t,r)=>r.startsWith(a)&&r.endsWith(a)&&r.replaceAll(a,"").length>0?`.${o}`:e,d=t.slice();d.push(e=>{e.type===w&&e.value.includes("&")&&(s||(s=RegExp(`\\${a}\\b`,"g")),e.props[0]=e.props[0].replace(td,a).replace(s,l))}),e.prefix&&d.push(J),d.push(Y);let c=[],u=(i=(n=d.concat((r=e=>c.push(e),function(e){!e.root&&(e=e.return)&&r(e)}))).length,function(e,t,r,o){for(var a="",s=0;s<i;s++)a+=n[s](e,t,r,o)||"";return a}),p=(t,r="",n="",i="&")=>{var l,d,p;o=i,a=r,s=void 0;let h=function(e){let t=-1!==e.indexOf("//"),r=-1!==e.indexOf("}");if(!t&&!r)return e;if(!t)return tu(e);let n=e.length,i="",o=0,a=0,s=0,l=0,d=0,c=!1;for(;a<n;){let t=e.charCodeAt(a);if(34!==t&&39!==t||tc(e,a))if(0===s)if(47===t&&a+1<n&&42===e.charCodeAt(a+1)){for(a+=2;a+1<n&&(42!==e.charCodeAt(a)||47!==e.charCodeAt(a+1));)a++;a+=2}else if(40!==t)if(41!==t)if(l>0)a++;else if(42===t&&a+1<n&&47===e.charCodeAt(a+1))i+=e.substring(o,a),a+=2,o=a,c=!0;else if(47===t&&a+1<n&&47===e.charCodeAt(a+1)){for(i+=e.substring(o,a);a<n&&10!==e.charCodeAt(a);)a++;o=a,c=!0}else 123===t?d++:125===t&&d--,a++;else l>0&&l--,a++;else l++,a++;else a++;else 0===s?s=t:s===t&&(s=0),a++}return c?(o<n&&(i+=e.substring(o)),0===d?i:tu(i)):0===d?e:tu(e)}(t),f=(p=function e(t,r,n,i,o,a,s,l,d){for(var c,u,p,h,f=0,g=0,m=s,b=0,y=0,w=0,v=1,j=1,O=1,C=0,T="",$=o,U=a,M=i,G=T;j;)switch(w=C,C=q()){case 40:if(108!=w&&58==N(G,m-1)){-1!=E(G+=R(H(C),"&","&\f"),"&\f",_(f?l[f-1]:0))&&(O=-1);break}case 34:case 39:case 91:G+=H(C);break;case 9:case 10:case 13:case 32:G+=function(e){for(;D=X();)if(D<33)q();else break;return W(e)>2||W(D)>3?"":" "}(w);break;case 92:G+=function(e,t){for(var r;--t&&q()&&!(D<48)&&!(D>102)&&(!(D>57)||!(D<65))&&(!(D>70)||!(D<97)););return r=z+(t<6&&32==X()&&32==q()),P(L,e,r)}(z-1,7);continue;case 47:switch(X()){case 42:case 47:k((c=function(e,t){for(;q();)if(e+D===57)break;else if(e+D===84&&47===X())break;return"/*"+P(L,t,z-1)+"*"+S(47===e?e:q())}(q(),z),u=r,p=n,h=d,B(c,u,p,x,S(D),P(c,2,-2),0,h)),d),(5==W(w||1)||5==W(X()||1))&&A(G)&&" "!==P(G,-1,void 0)&&(G+=" ");break;default:G+="/"}break;case 123*v:l[f++]=A(G)*O;case 125*v:case 59:case 0:switch(C){case 0:case 125:j=0;case 59+g:-1==O&&(G=R(G,/\f/g,"")),y>0&&(A(G)-m||0===v&&47===w)&&k(y>32?K(G+";",i,n,m-1,d):K(R(G," ","")+";",i,n,m-2,d),d);break;case 59:G+=";";default:if(k(M=V(G,r,n,f,g,o,l,T,$=[],U=[],m,a),a),123===C)if(0===g)e(G,r,M,M,$,a,m,l,U);else{switch(b){case 99:if(110===N(G,3))break;case 108:if(97===N(G,2))break;default:g=0;case 100:case 109:case 115:}g?e(t,M,M,i&&k(V(t,M,M,0,0,o,l,T,o,$=[],m,U),U),o,U,m,l,i?$:U):e(G,M,M,M,[""],U,0,l,U)}}f=g=y=0,v=O=1,T=G="",m=s;break;case 58:m=1+A(G),y=w;default:if(v<1){if(123==C)--v;else if(125==C&&0==v++&&125==(D=z>0?N(L,--z):0,F--,10===D&&(F=1,I--),D))continue}switch(G+=S(C),C*v){case 38:O=g>0?1:(G+="\f",-1);break;case 44:l[f++]=(A(G)-1)*O,O=1;break;case 64:45===X()&&(G+=H(q())),b=X(),g=m=A(T=G+=function(e){for(;!W(X());)q();return P(L,e,z)}(z)),C++;break;case 45:45===w&&2==A(G)&&(v=0)}}return a}("",null,null,null,[""],(d=l=n||r?n+" "+r+" { "+h+" }":h,I=F=1,$=A(L=d),z=0,l=[]),0,[0],l),L="",p);return e.namespace&&(f=function e(t,r){let n=r+" ",i=","+n;for(let o=0;o<t.length;o++){let a=t[o];if("rule"===a.type){a.value=(n+a.value).replaceAll(",",i);let e=a.props,t=[];for(let r=0;r<e.length;r++)t[r]=n+e[r];a.props=t}Array.isArray(a.children)&&"@keyframes"!==a.type&&e(a.children,r)}return t}(f,e.namespace)),c=[],G(f,u),c},h=5381;for(let e=0;e<t.length;e++)t[e].name||el(15),h=eS(h,t[e].name);return(null==e?void 0:e.namespace)&&(h=eS(h,e.namespace)),(null==e?void 0:e.prefix)&&(h=eS(h,"p")),p.hash=5381!==h?h.toString():"",p}(),tf=f.default.createContext({shouldForwardProp:void 0,styleSheet:tp,stylis:th,stylisPlugins:void 0});function tg(){return f.default.useContext(tf)}tf.Consumer;let tm=f.default.createContext(void 0);tm.Consumer;let tb=Object.prototype.hasOwnProperty,ty={};function tx(e,t,r){var n,i;let o,a,s=eM(e),l=!eC(e),{attrs:d=eg,componentId:c=(n=t.displayName,i=t.parentComponentId,ty[o="string"!=typeof n?"sc":ew(n)]=(ty[o]||0)+1,a=o+"-"+eO(et+o+ty[o]),i?i+"-"+a:a),displayName:u=eC(e)?`styled.${e}`:`Styled(${e.displayName||e.name||"Component"})`}=t,p=t.displayName&&t.componentId?ew(t.displayName)+"-"+t.componentId:t.componentId||c,h=s&&e.attrs?e.attrs.concat(d).filter(Boolean):d,{shouldForwardProp:g}=t;if(s&&e.shouldForwardProp){let r=e.shouldForwardProp;if(t.shouldForwardProp){let e=t.shouldForwardProp;g=(t,n)=>r(t,n)&&e(t,n)}else g=r}let m=new tl(r,p,s?e.componentStyle:void 0);function b(e,t){return function(e,t,r){let n,i,{attrs:o,componentStyle:a,defaultProps:s,foldedComponentIds:l,styledComponentId:d,target:c}=e,u=f.default.useContext(tm),p=tg(),h=e.shouldForwardProp||p.shouldForwardProp,g=eb(t,u,s)||em;{let e=f.default.useRef(null),r=e.current;if(null!==r&&r[1]===g&&r[2]===p.styleSheet&&r[3]===p.stylis&&r[7]===a&&function(e,t,r){let n=0;for(let r in t)if(tb.call(t,r)&&(n++,e[r]!==t[r]))return!1;return n===r}(r[0],t,r[4]))n=r[5],i=r[6];else{n=function(e,t,r){let n=Object.assign(Object.assign({},t),{className:void 0,theme:r}),i=e.length>1;for(let r=0;r<e.length;r++){let o=e[r],a=eB(o)?o(i?Object.assign({},n):n):o;for(let e in a)"className"===e?n.className=eq(n.className,a[e]):"style"===e?n.style=Object.assign(Object.assign({},n.style),a[e]):e in t&&void 0===t[e]||(n[e]=a[e])}return"className"in t&&"string"==typeof t.className&&(n.className=eq(n.className,t.className)),n}(o,t,g),i=a.generateAndInjectStyles(n,p.styleSheet,p.stylis);let r=0;for(let e in t)tb.call(t,e)&&r++;e.current=[t,g,p.styleSheet,p.stylis,r,n,i,a]}}let m=n.as||c,b=function(e,t,r,n){let i={};for(let o in e)void 0===e[o]||"$"===o[0]||"as"===o||"theme"===o&&e.theme===r||("forwardedAs"===o?i.as=e.forwardedAs:n&&!n(o,t)||(i[o]=e[o]));return i}(n,m,g,h),y=eq(l,d);return i&&(y+=" "+i),n.className&&(y+=" "+n.className),b[eC(m)&&m.includes("-")?"class":"className"]=y,r&&(b.ref=r),(0,f.createElement)(m,b)}(y,e,t)}b.displayName=u;let y=f.default.forwardRef(b);return y.attrs=h,y.componentStyle=m,y.displayName=u,y.shouldForwardProp=g,y.foldedComponentIds=s?eq(e.foldedComponentIds,e.styledComponentId):"",y.styledComponentId=p,y.target=s?e.target:e,Object.defineProperty(y,"defaultProps",{get(){return this._foldedDefaultProps},set(t){this._foldedDefaultProps=s?function(e,...t){for(let r of t)!function e(t,r,n=!1){if(!n&&!eW(t)&&!Array.isArray(t))return r;if(Array.isArray(r))for(let n=0;n<r.length;n++)t[n]=e(t[n],r[n]);else if(eW(r))for(let n in r)t[n]=e(t[n],r[n]);return t}(e,r,!0);return e}({},e.defaultProps,t):t}}),eH(y,()=>`.${y.styledComponentId}`),l&&function e(t,r,n){if("string"!=typeof r){let i=eD(r);i&&i!==eL&&e(t,i,n);let o=eF(r).concat(e$(r)),a=eT(t),s=eT(r);for(let e=0;e<o.length;++e){let i=o[e];if(!(i in eP||n&&n[i]||s&&i in s||a&&i in a)){let e=ez(r,i);try{eI(t,i,e)}catch(e){}}}}return t}(y,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),y}var tw=new Set(["a","abbr","address","area","article","aside","audio","b","bdi","bdo","blockquote","body","button","br","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","main","map","mark","menu","meter","nav","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","slot","small","span","strong","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","switch","symbol","text","textPath","tspan","use"]);function tv(e,t){let r=[e[0]];for(let n=0,i=t.length;n<i;n+=1)r.push(t[n],e[n+1]);return r}let tj=e=>(e6.add(e),e);function t_(e,...t){return eB(e)||eW(e)?tj(ta(tv(eg,[e,...t]))):0===t.length&&1===e.length&&"string"==typeof e[0]?ta(e):tj(ta(tv(e,t)))}let tS=e=>(function e(t,r,n=em){if(!r)throw el(1,r);let i=(e,...i)=>t(r,n,t_(e,...i));return i.attrs=i=>e(t,r,Object.assign(Object.assign({},n),{attrs:Array.prototype.concat(n.attrs,i).filter(Boolean)})),i.withConfig=i=>e(t,r,Object.assign(Object.assign({},n),i)),i})(tx,e);tw.forEach(e=>{tS[e]=tS(e)});class tO{constructor(e,t){this.instanceRules=new Map,this.rules=e,this.componentId=t,this.isStatic=function(e){for(let t=0;t<e.length;t+=1){let r=e[t];if(eB(r)&&!eM(r))return!1}return!0}(e),e9.registerId(this.componentId)}removeStyles(e,t){this.instanceRules.delete(e),this.rebuildGroup(t)}renderStyles(e,t,r,n){let i=this.componentId;if(this.isStatic){if(r.hasNameForId(i,i+e))this.instanceRules.has(e)||this.computeRules(e,t,r,n);else{let o=this.computeRules(e,t,r,n);r.insertRules(i,o.name,o.rules)}return}let o=this.instanceRules.get(e);if(this.computeRules(e,t,r,n),!r.server&&o){let t=o.rules,r=this.instanceRules.get(e).rules;if(t.length===r.length){let e=!0;for(let n=0;n<t.length;n++)if(t[n]!==r[n]){e=!1;break}if(e)return}}this.rebuildGroup(r)}computeRules(e,t,r,n){let i=eX(ta(this.rules,t,r,n)),o={name:this.componentId+e,rules:n(i,"")};return this.instanceRules.set(e,o),o}rebuildGroup(e){let t=this.componentId;for(let r of(e.clearRules(t),this.instanceRules.values()))e.insertRules(t,r.name,r.rules)}}class tC{constructor(e,t){this[u]=!0,this.inject=(e,t=th)=>{let r=this.getName(t);if(!e.hasNameForId(this.id,r)){let n=t(this.rules,r,"@keyframes");e.insertRules(this.id,r,n)}},this.name=e,this.id=ea+e,this.rules=t,ep(this.id),eH(this,()=>{throw el(12,String(this.name))})}getName(e=th){return e.hash?this.name+e_(e.hash>>>0):this.name}}function tR(e,...t){let r=eX(t_(e,...t));return new tC(eO(r),r)}u=tt;var tE=e.i(38936),tN=e.i(34454);let tP=tR`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`,tA=tS.div.withConfig({displayName:"ThankYouCard__Card",componentId:"sc-677354c6-0"})`
  width: 920px;
  max-width: 100%;
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,255,250,0.9));
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 12px 30px rgba(20, 40, 80, 0.08), inset 0 1px 0 rgba(255,255,255,0.6);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    padding: 2.5rem 1.25rem;
    gap: 1rem;
    border-radius: 20px;
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
`,tk=tS.div.withConfig({displayName:"ThankYouCard__IconWrapper",componentId:"sc-677354c6-1"})`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  animation: ${tP} 3s ease-in-out infinite;
  
  @media (max-width: 640px) {
    width: 70px;
    height: 70px;
  }
`,tT=tS.svg.withConfig({displayName:"ThankYouCard__CheckIcon",componentId:"sc-677354c6-2"})`
  width: 60px;
  height: 60px;
  stroke: white;
  stroke-width: 3;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  
  @media (max-width: 640px) {
    width: 42px;
    height: 42px;
    stroke-width: 3.5;
  }
`,tI=tS.h2.withConfig({displayName:"ThankYouCard__Title",componentId:"sc-677354c6-3"})`
  margin: 0;
  color: #0b2b4a;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  
  @media (max-width: 640px) {
    font-size: 1.6rem;
  }
`,tF=tS.p.withConfig({displayName:"ThankYouCard__Message",componentId:"sc-677354c6-4"})`
  margin: 0;
  color: #3c5a78;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  
  @media (max-width: 640px) {
    font-size: 0.95rem;
    line-height: 1.5;
    padding: 0 0.5rem;
  }
`,t$=tS.p.withConfig({displayName:"ThankYouCard__SubMessage",componentId:"sc-677354c6-5"})`
  margin: 0;
  color: #6b7f99;
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 550px;
  
  @media (max-width: 640px) {
    font-size: 0.85rem;
    line-height: 1.65;
    padding: 0 0.5rem;
  }
`,tz=tS.div.withConfig({displayName:"ThankYouCard__InfoBox",componentId:"sc-677354c6-6"})`
  margin-top: 1rem;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, rgba(43, 123, 227, 0.08), rgba(94, 200, 255, 0.05));
  border-radius: 12px;
  border: 1px solid rgba(43, 123, 227, 0.15);
  max-width: 550px;
  width: 100%;
  
  @media (max-width: 640px) {
    padding: 1rem;
    margin-top: 0.5rem;
    border-radius: 10px;
  }
`,tD=tS.p.withConfig({displayName:"ThankYouCard__InfoText",componentId:"sc-677354c6-7"})`
  margin: 0;
  color: #2b7be3;
  font-size: 0.9rem;
  line-height: 1.6;
  font-weight: 500;
  word-break: break-word;
  
  @media (max-width: 640px) {
    font-size: 0.8rem;
    line-height: 1.7;
  }
`;function tL({lang:e}){let t={en:{title:"Thank You!",message:"Your registration has been successfully submitted.",subMessage:"We've received your information and our team will review it shortly. You'll receive a confirmation email within 24-48 hours.",infoText:"If you have any urgent questions, feel free to contact us at purchasing@pospal.com.au"},zh:{title:"谢谢！",message:"您的注册已成功提交。",subMessage:"我们已收到您的信息，我们的团队将很快进行审核。您将在 24-48 小时内收到确认电子邮件。",infoText:"如果您有任何紧急问题，请随时通过 purchasing@pospal.com.au 联系我们"}}[e];return(0,h.jsxs)(tA,{children:[(0,h.jsx)(tk,{children:(0,h.jsx)(tT,{viewBox:"0 0 24 24",children:(0,h.jsx)("polyline",{points:"20 6 9 17 4 12"})})}),(0,h.jsx)(tI,{children:t.title}),(0,h.jsx)(tF,{children:t.message}),(0,h.jsx)(t$,{children:t.subMessage}),(0,h.jsx)(tz,{children:(0,h.jsx)(tD,{children:t.infoText})})]})}var tB=e.i(54170);function tU(e,t){return function(){return e.apply(t,arguments)}}let{toString:tM}=Object.prototype,{getPrototypeOf:tq}=Object,{iterator:tX,toStringTag:tW}=Symbol,tH=(({hasOwnProperty:e})=>(t,r)=>e.call(t,r))(Object.prototype),tG=e=>"string"==typeof e&&("__proto__"===e||"constructor"===e||"prototype"===e),tY=(e,t,r)=>e===Object.prototype||!r&&null===t,tJ=(e,t)=>{let r=e,n=[];for(;null!=r&&-1===n.indexOf(r);){n.push(r);let i=tq(r);if(tY(r,i,r===e))break;if(tH(r,t))return!0;r=i}return!1},tV=(t=Object.create(null),e=>{let r=tM.call(e);return t[r]||(t[r]=r.slice(8,-1).toLowerCase())}),tK=e=>(e=e.toLowerCase(),t=>tV(t)===e),tQ=e=>t=>typeof t===e,{isArray:tZ}=Array,t0=tQ("undefined");function t1(e){return null!==e&&!t0(e)&&null!==e.constructor&&!t0(e.constructor)&&t4(e.constructor.isBuffer)&&e.constructor.isBuffer(e)}let t2=tK("ArrayBuffer"),t5=tQ("string"),t4=tQ("function"),t3=tQ("number"),t8=e=>null!==e&&"object"==typeof e,t9=e=>{if(!t8(e))return!1;let t=tq(e);return(null===t||t===Object.prototype||null===tq(t))&&!tJ(e,tW)&&!tJ(e,tX)},t6=tK("Date"),t7=tK("File"),re=tK("Blob"),rt=tK("FileList"),rr=tK("Set"),rn="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:e.g,ri=void 0!==rn.FormData?rn.FormData:void 0,ro=tK("URLSearchParams"),[ra,rs,rl,rd]=["ReadableStream","Request","Response","Headers"].map(tK);function rc(e,t,{allOwnKeys:r=!1}={}){let n,i;if(null!=e)if("object"!=typeof e&&(e=[e]),tZ(e))for(n=0,i=e.length;n<i;n++)t.call(null,e[n],n,e);else{let i;if(t1(e))return;let o=r?Object.getOwnPropertyNames(e):Object.keys(e),a=o.length;for(n=0;n<a;n++)i=o[n],t.call(null,e[i],i,e)}}function ru(e,t){let r;if(t1(e))return null;t=t.toLowerCase();let n=Object.keys(e),i=n.length;for(;i-- >0;)if(t===(r=n[i]).toLowerCase())return r;return null}let rp="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:e.g,rh=e=>!t0(e)&&e!==rp,rf=(r="u">typeof Uint8Array&&tq(Uint8Array),e=>r&&e instanceof r),rg=tK("HTMLFormElement"),{propertyIsEnumerable:rm}=Object.prototype,rb=tK("RegExp"),ry=(e,t)=>{let r=Object.getOwnPropertyDescriptors(e),n={};rc(r,(r,i)=>{let o;!1!==(o=t(r,i,e))&&(n[i]=o||r)}),Object.defineProperties(e,n)},rx=tK("AsyncFunction"),rw=(o="function"==typeof setImmediate,a=t4(rp.postMessage),o?setImmediate:a?(s=`axios@${Math.random()}`,l=[],rp.addEventListener("message",({source:e,data:t})=>{e===rp&&t===s&&l.length&&l.shift()()},!1),e=>{l.push(e),rp.postMessage(s,"*")}):e=>setTimeout(e)),rv="u">typeof queueMicrotask?queueMicrotask.bind(rp):void 0!==p.default&&p.default.nextTick||rw,rj=e=>null!=e&&t4(e[tX]),r_={isArray:tZ,isArrayBuffer:t2,isBuffer:t1,isFormData:e=>{if(!e)return!1;if(ri&&e instanceof ri)return!0;let t=tq(e);if(!t||t===Object.prototype||!t4(e.append))return!1;let r=tV(e);return"formdata"===r||"object"===r&&t4(e.toString)&&"[object FormData]"===e.toString()},isArrayBufferView:function(e){return"u">typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&t2(e.buffer)},isString:t5,isNumber:t3,isBoolean:e=>!0===e||!1===e,isObject:t8,isPlainObject:t9,isEmptyObject:e=>{if(!t8(e)||t1(e))return!1;try{return 0===Object.keys(e).length&&Object.getPrototypeOf(e)===Object.prototype}catch(e){return!1}},isReadableStream:ra,isRequest:rs,isResponse:rl,isHeaders:rd,isUndefined:t0,isDate:t6,isFile:t7,isReactNativeBlob:e=>!!(e&&void 0!==e.uri),isReactNative:e=>e&&void 0!==e.getParts,isBlob:re,isRegExp:rb,isFunction:t4,isStream:e=>t8(e)&&t4(e.pipe),isURLSearchParams:ro,isTypedArray:rf,isFileList:rt,forEach:rc,merge:function e(...t){let{caseless:r,skipUndefined:n}=rh(this)&&this||{},i={},o=(t,o)=>{if("__proto__"===o||"constructor"===o||"prototype"===o)return;let a=r&&"string"==typeof o&&ru(i,o)||o,s=tH(i,a)?i[a]:void 0;t9(s)&&t9(t)?i[a]=e(s,t):t9(t)?i[a]=e({},t):tZ(t)?i[a]=t.slice():n&&t0(t)||(i[a]=t)};for(let e=0,r=t.length;e<r;e++){let r=t[e];if(!r||t1(r)||(rc(r,o),"object"!=typeof r||tZ(r)))continue;let n=Object.getOwnPropertySymbols(r);for(let e=0;e<n.length;e++){let t=n[e];rm.call(r,t)&&o(r[t],t)}}return i},extend:(e,t,r,{allOwnKeys:n}={})=>(rc(t,(t,n)=>{r&&t4(t)?Object.defineProperty(e,n,{__proto__:null,value:tU(t,r),writable:!0,enumerable:!0,configurable:!0}):Object.defineProperty(e,n,{__proto__:null,value:t,writable:!0,enumerable:!0,configurable:!0})},{allOwnKeys:n}),e),trim:e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""),stripBOM:e=>(65279===e.charCodeAt(0)&&(e=e.slice(1)),e),inherits:(e,t,r,n)=>{e.prototype=Object.create(t.prototype,n),Object.defineProperty(e.prototype,"constructor",{__proto__:null,value:e,writable:!0,enumerable:!1,configurable:!0}),Object.defineProperty(e,"super",{__proto__:null,value:t.prototype}),r&&Object.assign(e.prototype,r)},toFlatObject:(e,t,r,n)=>{let i,o,a,s={};if(t=t||{},null==e)return t;do{for(o=(i=Object.getOwnPropertyNames(e)).length;o-- >0;)a=i[o],(!n||n(a,e,t))&&!s[a]&&(t[a]=e[a],s[a]=!0);e=!1!==r&&tq(e)}while(e&&(!r||r(e,t))&&e!==Object.prototype)return t},kindOf:tV,kindOfTest:tK,endsWith:(e,t,r)=>{e=String(e),(void 0===r||r>e.length)&&(r=e.length),r-=t.length;let n=e.indexOf(t,r);return -1!==n&&n===r},toArray:e=>{if(!e)return null;if(tZ(e))return e;let t=e.length;if(!t3(t))return null;let r=Array(t);for(;t-- >0;)r[t]=e[t];return r},forEachEntry:(e,t)=>{let r,n=(e&&e[tX]).call(e);for(;(r=n.next())&&!r.done;){let n=r.value;t.call(e,n[0],n[1])}},matchAll:(e,t)=>{let r,n=[];for(;null!==(r=e.exec(t));)n.push(r);return n},isHTMLForm:rg,hasOwnProperty:tH,hasOwnProp:tH,hasOwnInPrototypeChain:tJ,getSafeProp:(e,t)=>null!=e&&tJ(e,t)?e[t]:void 0,toSafeFlatObject:e=>{if(null==e||"object"!=typeof e&&"function"!=typeof e)return e;let t=tq(e);if(null===t&&(e=>{if(!Object.isExtensible(e))return!1;let t=Object.getOwnPropertyNames(e);return Object.getOwnPropertySymbols&&t.push(...Object.getOwnPropertySymbols(e)),t.every(t=>{if(tG(t))return!1;let r=Object.getOwnPropertyDescriptor(e,t);return!!r&&r.configurable&&!0===r.writable})})(e))return e;let r=Object.create(null),n=Object.create(null),i=[],o=e;for(;null!=o&&-1===i.indexOf(o);){i.push(o);let a=o===e?t:tq(o);if(tY(o,a,o===e))break;let s=Object.getOwnPropertyNames(o);for(let t of(Object.getOwnPropertySymbols&&s.push(...Object.getOwnPropertySymbols(o)),s))!tG(t)&&(tH(n,t)||(r[t]=e[t],n[t]=!0));o=a}return r},reduceDescriptors:ry,freezeMethods:e=>{ry(e,(t,r)=>{if(t4(e)&&["arguments","caller","callee"].includes(r))return!1;if(t4(e[r])){if(t.enumerable=!1,"writable"in t){t.writable=!1;return}t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+r+"'")})}})},toObjectSet:(e,t)=>{let r={};return(tZ(e)?e:String(e).split(t)).forEach(e=>{r[e]=!0}),r},toCamelCase:e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(e,t,r){return t.toUpperCase()+r}),noop:()=>{},toFiniteNumber:(e,t)=>null!=e&&Number.isFinite(e*=1)?e:t,findKey:ru,global:rp,isContextDefined:rh,isSpecCompliantForm:function(e){return!!(e&&t4(e.append)&&"FormData"===e[tW]&&e[tX])},toJSONObject:e=>{let t=new WeakSet,r=e=>{if(t8(e)){if(t.has(e))return;if(t1(e))return e;if(!("toJSON"in e)){let n;if(t.add(e),rr(e))for(let t of(n=[],e)){let e=r(t);t0(e)||n.push(e)}else n=tZ(e)?[]:{},rc(e,(e,t)=>{let i=r(e);t0(i)||(n[t]=i)});return t.delete(e),n}}return e};return r(e)},isAsyncFn:rx,isThenable:e=>e&&(t8(e)||t4(e))&&t4(e.then)&&t4(e.catch),setImmediate:rw,asap:rv,isIterable:rj,isSafeIterable:e=>null!=e&&tJ(e,tX)&&rj(e)},rS=r_.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),rO=RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+","g"),rC=RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+","g");function rR(e,t){return r_.isArray(e)?e.map(e=>rR(e,t)):function(e){let t=0,r=e.length;for(;t<r;){let r=e.charCodeAt(t);if(9!==r&&32!==r)break;t+=1}for(;r>t;){let t=e.charCodeAt(r-1);if(9!==t&&32!==t)break;r-=1}return 0===t&&r===e.length?e:e.slice(t,r)}(String(e).replace(t,""))}function rE(e){let t=Object.create(null);return r_.forEach(e.toJSON(),(e,r)=>{t[r]=rR(e,rC)}),t}let rN=Symbol("internals");function rP(e){return e&&String(e).trim().toLowerCase()}function rA(e){return!1===e||null==e?e:r_.isArray(e)?e.map(rA):rR(String(e),rO)}let rk=/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;function rT(e){let t=0,r=e.length;for(;t<r;){let r=e.charCodeAt(t);if(9!==r&&32!==r)break;t+=1}for(;r>t;){let t=e.charCodeAt(r-1);if(9!==t&&32!==t)break;r-=1}return 0===t&&r===e.length?e:e.slice(t,r)}function rI(e,t,r,n,i){if(r_.isFunction(n))return n.call(this,t,r);if(i&&(t=r),r_.isString(t)){if(r_.isString(n))return -1!==t.indexOf(n);if(r_.isRegExp(n))return n.test(t)}}class rF{constructor(e){e&&this.set(e)}set(e,t,r){let n=this;function i(e,t,r){let i=rP(t);if(!i)return;let o=r_.findKey(n,i);o&&void 0!==n[o]&&!0!==r&&(void 0!==r||!1===n[o])||(n[o||t]=rA(e))}let o=(e,t)=>r_.forEach(e,(e,r)=>i(e,r,t));if(r_.isPlainObject(e)||e instanceof this.constructor)o(e,t);else{let n;if(r_.isString(e)&&(e=e.trim())&&(n=e,!/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(n.trim()))){var a;let r,n,i,s;o((s={},(a=e)&&a.split("\n").forEach(function(e){i=e.indexOf(":"),r=e.substring(0,i).trim().toLowerCase(),n=e.substring(i+1).trim();let t=r_.hasOwnProp(s,r);!r||t&&r_.hasOwnProp(rS,r)||("set-cookie"===r?t?s[r].push(n):s[r]=[n]:s[r]=t?s[r]+", "+n:n)}),s),t)}else if(r_.isObject(e)&&r_.isSafeIterable(e)){let r=Object.create(null),n,i;for(let t of e){if(!r_.isArray(t))throw TypeError("Object iterator must return a key-value pair");i=t[0],r_.hasOwnProp(r,i)?(n=r[i],r[i]=r_.isArray(n)?[...n,t[1]]:[n,t[1]]):r[i]=t[1]}o(r,t)}else null!=e&&i(t,e,r)}return this}get(e,t){if(e=rP(e)){let r=r_.findKey(this,e);if(r){let e=this[r];if(!t)return e;if(!0===t){let t,r=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;for(;t=n.exec(e);)r[t[1]]=t[2];return r}if(r_.isFunction(t))return t.call(this,e,r);if(r_.isRegExp(t))return t.exec(e);throw TypeError("parser must be boolean|regexp|function")}}}has(e,t){if(e=rP(e)){let r=r_.findKey(this,e);return!!(r&&void 0!==this[r]&&(!t||rI(this,this[r],r,t)))}return!1}delete(e,t){let r=this,n=!1;function i(e){if(e=rP(e)){let i=r_.findKey(r,e);i&&(!t||rI(r,r[i],i,t))&&(delete r[i],n=!0)}}return r_.isArray(e)?e.forEach(i):i(e),n}clear(e){let t=Object.keys(this),r=t.length,n=!1;for(;r--;){let i=t[r];(!e||rI(this,this[i],i,e,!0))&&(delete this[i],n=!0)}return n}normalize(e){let t=this,r={};return r_.forEach(this,(n,i)=>{let o=r_.findKey(r,i);if(o){t[o]=rA(n),delete t[i];return}let a=e?i.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(e,t,r)=>t.toUpperCase()+r):String(i).trim();a!==i&&delete t[i],t[a]=rA(n),r[a]=!0}),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){let t=Object.create(null);return r_.forEach(this,(r,n)=>{null!=r&&!1!==r&&(t[n]=e&&r_.isArray(r)?r.join(", "):r)}),t}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([e,t])=>e+": "+t).join("\n")}getSetCookie(){let e=this.get("set-cookie");return r_.isArray(e)?e:null==e||!1===e?[]:[e]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(e){return e instanceof this?e:new this(e)}static parseParameters(e){return function(e){let t=Object.create(null),r=String(e),n=0,i=!1,o=!1;function a(e){let i=rT(r.slice(n,e)),o=i.indexOf("=");if(o<1)return;let a=rT(i.slice(0,o));if(!rk.test(a))return;let s=a.toLowerCase();if("__proto__"===s||"constructor"===s||"prototype"===s)return;let l=rT(i.slice(o+1));t[s]=function(e){let t=e.length-1;if(t<1||34!==e.charCodeAt(0)||34!==e.charCodeAt(t))return e;let r="";for(let n=1;n<t;n++){let i=e.charCodeAt(n);if(34===i||92===i&&(n+=1)>=t)return e;r+=e[n]}return r}(l)}for(let e=0;e<r.length;e++){let t=r.charCodeAt(e);i?o?o=!1:92===t?o=!0:34===t&&(i=!1):34===t?i=!0:(44===t||59===t)&&(a(e),n=e+1)}return a(r.length),t}(e)}static concat(e,...t){let r=new this(e);return t.forEach(e=>r.set(e)),r}static accessor(e){let t=(this[rN]=this[rN]={accessors:{}}).accessors,r=this.prototype;function n(e){let n=rP(e);if(!t[n]){let i;i=r_.toCamelCase(" "+e),["get","set","has"].forEach(t=>{Object.defineProperty(r,t+i,{__proto__:null,value:function(r,n,i){return this[t].call(this,e,r,n,i)},configurable:!0})}),t[n]=!0}}return r_.isArray(e)?e.forEach(n):n(e),this}}rF.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]),r_.reduceDescriptors(rF.prototype,({value:e},t)=>{let r=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(e){this[r]=e}}}),r_.freezeMethods(rF);let r$="[REDACTED ****]";function rz(e){try{return String(e)}catch(e){return""}}class rD extends Error{static from(e,t,r,n,i,o){let a=e.message;!a&&r_.isArray(e.errors)&&e.errors.length&&(a=e.errors.map(e=>{try{return e&&e.message?rz(e.message):rz(e)}catch(e){return""}}).filter(Boolean).join("; ")||e.name||"AggregateError");let s=new rD(a,t||e.code,r,n,i);return Object.defineProperty(s,"cause",{__proto__:null,value:e,writable:!0,enumerable:!1,configurable:!0}),s.name=e.name,null!=e.status&&null==s.status&&(s.status=e.status),o&&Object.assign(s,o),s}constructor(e,t,r,n,i){super(e),Object.defineProperty(this,"message",{__proto__:null,value:e,enumerable:!0,writable:!0,configurable:!0}),this.name="AxiosError",this.isAxiosError=!0,t&&(this.code=t),r&&(this.config=r),n&&(this.request=n),i&&(this.response=i,this.status=i.status)}toJSON(){let e,t,r,n=this.config,i=n&&r_.hasOwnProp(n,"redact")?n.redact:void 0,o=r_.isArray(i)&&i.length>0?(e=new Set(i.map(e=>String(e).toLowerCase())),t=[],(r=n=>{let i;if(null===n||"object"!=typeof n||r_.isBuffer(n))return n;if(-1===t.indexOf(n)){if(n instanceof rF&&(n=n.toJSON()),t.push(n),r_.isArray(n))i=[],n.forEach((e,t)=>{let n=r(e);r_.isUndefined(n)||(i[t]=n)});else{if(!r_.isPlainObject(n)&&function(e){if(r_.hasOwnProp(e,"toJSON"))return!0;let t=Object.getPrototypeOf(e);for(;t&&t!==Object.prototype;){if(r_.hasOwnProp(t,"toJSON"))return!0;t=Object.getPrototypeOf(t)}return!1}(n))return t.pop(),n;for(let[t,o]of(i=Object.create(null),Object.entries(n))){let n=e.has(t.toLowerCase())?r$:r(o);r_.isUndefined(n)||(i[t]=n)}}return t.pop(),i}})(n)):r_.toJSONObject(n);return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:o,code:this.code,status:this.status}}}rD.ERR_BAD_OPTION_VALUE="ERR_BAD_OPTION_VALUE",rD.ERR_BAD_OPTION="ERR_BAD_OPTION",rD.ECONNABORTED="ECONNABORTED",rD.ETIMEDOUT="ETIMEDOUT",rD.ECONNREFUSED="ECONNREFUSED",rD.ERR_NETWORK="ERR_NETWORK",rD.ERR_FR_TOO_MANY_REDIRECTS="ERR_FR_TOO_MANY_REDIRECTS",rD.ERR_DEPRECATED="ERR_DEPRECATED",rD.ERR_BAD_RESPONSE="ERR_BAD_RESPONSE",rD.ERR_BAD_REQUEST="ERR_BAD_REQUEST",rD.ERR_CANCELED="ERR_CANCELED",rD.ERR_NOT_SUPPORT="ERR_NOT_SUPPORT",rD.ERR_INVALID_URL="ERR_INVALID_URL",rD.ERR_FORM_DATA_DEPTH_EXCEEDED="ERR_FORM_DATA_DEPTH_EXCEEDED";let rL=rD;function rB(e){return r_.isPlainObject(e)||r_.isArray(e)}function rU(e){return r_.endsWith(e,"[]")?e.slice(0,-2):e}function rM(e,t,r){return e?e.concat(t).map(function(e,t){return e=rU(e),!r&&t?"["+e+"]":e}).join(r?".":""):t}let rq=r_.toFlatObject(r_,{},null,function(e){return/^is[A-Z]/.test(e)}),rX=function(e,t,r){if(!r_.isObject(e))throw TypeError("target must be an object");t=t||new FormData;let n=(e,t)=>{let n=r_.getSafeProp(r,e);return r_.isUndefined(n)?t:n},i=n("metaTokens",!0),o=n("visitor")||f,a=n("dots",!1),s=n("indexes",!1),l=n("Blob")||"u">typeof Blob&&Blob,d=n("maxDepth",100),c=l&&r_.isSpecCompliantForm(t),u=[];if(!r_.isFunction(o))throw TypeError("visitor must be a function");function p(e){if(null===e)return"";if(r_.isDate(e))return e.toISOString();if(r_.isBoolean(e))return e.toString();if(!c&&r_.isBlob(e))throw new rL("Blob is not supported. Use a Buffer instead.");if(r_.isArrayBuffer(e)||r_.isTypedArray(e)){if(c&&"function"==typeof l)return new l([e]);throw new rL("Blob is not supported. Use a Buffer instead.",rL.ERR_NOT_SUPPORT)}return e}function h(e){if(e>d)throw new rL("Object is too deeply nested ("+e+" levels). Max depth: "+d,rL.ERR_FORM_DATA_DEPTH_EXCEEDED)}function f(e,r,n){let o=e;if(r_.isReactNative(t)&&r_.isReactNativeBlob(e))return t.append(rM(n,r,a),p(e)),!1;if(e&&!n&&"object"==typeof e)if(r_.endsWith(r,"{}"))r=i?r:r.slice(0,-2),e=function(e){if(d===1/0)return JSON.stringify(e);let t=[];return JSON.stringify(e,function(e,r){if(!r_.isObject(r))return r;for(;t.length&&t[t.length-1]!==this;)t.pop();return t.push(r),h(1+t.length-1),r})}(e);else{var l;if(r_.isArray(e)&&(l=e,r_.isArray(l)&&!l.some(rB))||(r_.isFileList(e)||r_.endsWith(r,"[]"))&&(o=r_.toArray(e)))return r=rU(r),o.forEach(function(e,n){r_.isUndefined(e)||null===e||t.append(!0===s?rM([r],n,a):null===s?r:r+"[]",p(e))}),!1}return!!rB(e)||(t.append(rM(n,r,a),p(e)),!1)}let g=Object.assign(rq,{defaultVisitor:f,convertValue:p,isVisitable:rB});if(!r_.isObject(e))throw TypeError("data must be an object");return!function e(r,n,i=0){if(!r_.isUndefined(r)){if(h(i),-1!==u.indexOf(r))throw Error("Circular reference detected in "+n.join("."));u.push(r),r_.forEach(r,function(r,a){!0===(!(r_.isUndefined(r)||null===r)&&o.call(t,r,r_.isString(a)?a.trim():a,n,g))&&e(r,n?n.concat(a):[a],i+1)}),u.pop()}}(e),t};function rW(e){let t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"};return encodeURIComponent(e).replace(/[!'()~]|%20/g,function(e){return t[e]})}function rH(e,t){this._pairs=[],e&&rX(e,this,t)}let rG=rH.prototype;function rY(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function rJ(e,t,r){let n;if(!t)return e;e=e||"";let i=r_.isFunction(r)?{serialize:r}:r,o=r_.getSafeProp(i,"encode")||rY,a=r_.getSafeProp(i,"serialize");if(n=a?a(t,i):r_.isURLSearchParams(t)?t.toString():new rH(t,i).toString(o)){let t=e.indexOf("#");-1!==t&&(e=e.slice(0,t)),e+=(-1===e.indexOf("?")?"?":"&")+n}return e}rG.append=function(e,t){this._pairs.push([e,t])},rG.toString=function(e){let t=e?t=>e.call(this,t,rW):rW;return this._pairs.map(function(e){return t(e[0])+"="+t(e[1])},"").join("&")};let rV=Symbol("internals");function rK(e){return e?e.length:0}function rQ(e){if(e)for(;e.length&&null===e[e.length-1];)e.pop()}function rZ(e,t){let r=e.handlers,n=rK(r);r!==t.handlersRef?(t.handlersRef=r,t.handlerEntries.clear()):n!==t.handlersLength&&(n?t.handlerEntries.forEach(function(e,n){r[e.index]!==e.handler&&t.handlerEntries.delete(n)}):t.handlerEntries.clear()),t.handlersLength=n}let r0=class{constructor(){this.handlers=[],this[rV]={handlersRef:this.handlers,handlersLength:this.handlers.length,handlerEntries:new Map,iterationDepth:0,nextId:0}}use(e,t,r){let n={fulfilled:e,rejected:t,synchronous:!!r&&r.synchronous,runWhen:r?r.runWhen:null},i=this[rV];null==this.handlers&&(this.handlers=[]),rZ(this,i);let o=i.nextId++;return this.handlers.push(n),i.handlerEntries.set(o,{handler:n,index:this.handlers.length-1}),i.handlersLength=this.handlers.length,o}eject(e){let t=this[rV];rZ(this,t);let r=t.handlerEntries.get(e);if(r){if(t.handlerEntries.delete(e),this.handlers[r.index]!==r.handler)return;this.handlers[r.index]=null,t.iterationDepth||(rQ(this.handlers),t.handlersLength=this.handlers.length)}}clear(){this.handlers&&(this.handlers=[],rZ(this,this[rV]))}forEach(e){let t=this[rV];rZ(this,t),t.iterationDepth++;try{r_.forEach(this.handlers,function(t){null!==t&&e(t)})}finally{--t.iterationDepth||(rZ(this,t),rQ(this.handlers),t.handlersLength=rK(this.handlers))}}},r1={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1,legacyInterceptorReqResOrdering:!0,advertiseZstdAcceptEncoding:!1,validateStatusUndefinedResolves:!0},r2="u">typeof URLSearchParams?URLSearchParams:rH,r5="u">typeof FormData?FormData:null,r4="u">typeof Blob?Blob:null,r3="u">typeof window&&"u">typeof document,r8="object"==typeof navigator&&navigator||void 0,r9=r3&&(!r8||0>["ReactNative","NativeScript","NS"].indexOf(r8.product)),r6="u">typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&"function"==typeof self.importScripts,r7=r3&&window.location.href||"http://localhost";e.s(["hasBrowserEnv",0,r3,"hasStandardBrowserEnv",0,r9,"hasStandardBrowserWebWorkerEnv",0,r6,"navigator",0,r8,"origin",0,r7],96267);let ne={...e.i(96267),isBrowser:!0,classes:{URLSearchParams:r2,FormData:r5,Blob:r4},protocols:["http","https","file","blob","url","data"]};function nt(e){if(e>100)throw new rL("FormData field is too deeply nested ("+e+" levels). Max depth: 100",rL.ERR_FORM_DATA_DEPTH_EXCEEDED)}let nr=function(e){if(r_.isFormData(e)&&r_.isFunction(e.entries)){let t={};return r_.forEachEntry(e,(e,r)=>{!function e(t,r,n,i){nt(i);let o=t[i++];if("__proto__"===o)return!0;let a=Number.isFinite(+o),s=i>=t.length;return(o=!o&&r_.isArray(n)?n.length:o,s)?r_.hasOwnProp(n,o)?n[o]=r_.isArray(n[o])?n[o].concat(r):[n[o],r]:n[o]=r:(r_.hasOwnProp(n,o)&&r_.isObject(n[o])||(n[o]=[]),e(t,r,n[o],i)&&r_.isArray(n[o])&&(n[o]=function(e){let t,r,n={},i=Object.keys(e),o=i.length;for(t=0;t<o;t++)n[r=i[t]]=e[r];return n}(n[o]))),!a}(function(e){let t,r=[],n=/[^.[\]]+|\[([^.[\]]*)]/g;for(;null!==(t=n.exec(e));)nt(r.length),r.push("[]"===t[0]?"":t[1]||t[0]);return r}(e),r,t,0)}),t}return null},nn=Object.freeze(["get","delete","head","options","post","put","patch","purge","link","unlink","query"]),ni=(e,t)=>null!=e&&r_.hasOwnProp(e,t)?e[t]:void 0,no={transitional:r1,adapter:["xhr","http","fetch"],transformRequest:[function(e,t){let r,n=t.getContentType()||"",i=n.indexOf("application/json")>-1,o=r_.isObject(e);if(o&&r_.isHTMLForm(e)&&(e=new FormData(e)),r_.isFormData(e))return i?JSON.stringify(nr(e)):e;if(r_.isArrayBuffer(e)||r_.isBuffer(e)||r_.isStream(e)||r_.isFile(e)||r_.isBlob(e)||r_.isReadableStream(e))return e;if(r_.isArrayBufferView(e))return e.buffer;if(r_.isURLSearchParams(e))return t.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),e.toString();if(o){let t=ni(this,"formSerializer");if(n.indexOf("application/x-www-form-urlencoded")>-1)return rX(e,new ne.classes.URLSearchParams,{visitor:function(e,t,r,n){return ne.isNode&&r_.isBuffer(e)?(this.append(t,e.toString("base64")),!1):n.defaultVisitor.apply(this,arguments)},...t}).toString();if((r=r_.isFileList(e))||n.indexOf("multipart/form-data")>-1){let n=ni(this,"env"),i=n&&n.FormData;return rX(r?{"files[]":e}:e,i&&new i,t)}}if(o||i){t.setContentType("application/json",!1);var a=e;if(r_.isString(a))try{return(0,JSON.parse)(a),r_.trim(a)}catch(e){if("SyntaxError"!==e.name)throw e}return(0,JSON.stringify)(a)}return e}],transformResponse:[function(e){let t=ni(this,"transitional")||no.transitional,r=t&&t.forcedJSONParsing,n=ni(this,"responseType"),i="json"===n;if(r_.isResponse(e)||r_.isReadableStream(e))return e;if(e&&r_.isString(e)&&(r&&!n||i)){let r=t&&t.silentJSONParsing;try{return JSON.parse(e,ni(this,"parseReviver"))}catch(e){if(!r&&i){if("SyntaxError"===e.name)throw rL.from(e,rL.ERR_BAD_RESPONSE,this,null,ni(this,"response"));throw e}}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:ne.classes.FormData,Blob:ne.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};function na(e,t){let r=this||no,n=t||r,i=rF.from(n.headers),o=n.data;return r_.forEach(e,function(e){o=e.call(r,o,i.normalize(),t?t.status:void 0)}),i.normalize(),o}function ns(e){return!!(e&&e.__CANCEL__)}r_.forEach(nn,e=>{no.headers[e]={}});let nl=class extends rL{constructor(e,t,r){super(null==e?"canceled":e,rL.ERR_CANCELED,t,r),this.name="CanceledError",this.__CANCEL__=!0}};function nd(e,t,r){let n=r.config.validateStatus;!r.status||!n||n(r.status)?e(r):t(new rL("Request failed with status code "+r.status,r.status>=400&&r.status<500?rL.ERR_BAD_REQUEST:rL.ERR_BAD_RESPONSE,r.config,r.request,r))}let nc=/[\t\n\r]/g;function nu(e){if("string"!=typeof e)return e;let t=0;for(;t<e.length&&32>=e.charCodeAt(t);)t++;return e.slice(t).replace(nc,"")}function np(e){let t=/^([-+\w]{1,25}):(?:\/\/)?/.exec(e);return t&&t[1]||""}let nh=function(e,t){let r,n=Array(e=e||10),i=Array(e),o=0,a=0;return t=void 0!==t?t:1e3,function(s){let l=Date.now(),d=i[a];r||(r=l),n[o]=s,i[o]=l;let c=a,u=0;for(;c!==o;)u+=n[c++],c%=e;if((o=(o+1)%e)===a&&(a=(a+1)%e),l-r<t)return;let p=d&&l-d;return p?Math.round(1e3*u/p):void 0}},nf=function(e,t){let r,n,i=0,o=1e3/t,a=(t,o=Date.now())=>{i=o,r=null,n&&(clearTimeout(n),n=null),e(...t)};return[(...e)=>{let t=Date.now(),s=t-i;s>=o?a(e,t):(r=e,n||(n=setTimeout(()=>{n=null,a(r)},o-s)))},()=>r&&a(r),(...e)=>a(e)]},ng=(e,t,r=3)=>{let n=0,i=nh(50,250);return nf(r=>{if(!r||!r_.isNumber(r.loaded))return;let o=r.loaded,a=r.lengthComputable?r.total:void 0,s=Math.max(0,null!=a?Math.min(o,a):o),l=Math.max(0,s-n),d=i(l);n=Math.max(n,s),e({loaded:s,total:a,progress:a?s/a:void 0,bytes:l,rate:d||void 0,estimated:d&&a?(a-s)/d:void 0,event:r,lengthComputable:null!=a,[t?"download":"upload"]:!0})},r)},nm=(e,t)=>{let r=null!=e;return[n=>t[0]({lengthComputable:r,total:e,loaded:n}),t[1]]},nb=(e,t=r_.asap)=>(...r)=>t(()=>e(...r)),ny=ne.hasStandardBrowserEnv?(n=new URL(ne.origin),i=ne.navigator&&/(msie|trident)/i.test(ne.navigator.userAgent),e=>(e=new URL(e,ne.origin),n.protocol===e.protocol&&n.host===e.host&&(i||n.port===e.port))):()=>!0,nx=ne.hasStandardBrowserEnv?{write(e,t,r,n,i,o,a){if("u"<typeof document)return;let s=[`${e}=${encodeURIComponent(t)}`];r_.isNumber(r)&&s.push(`expires=${new Date(r).toUTCString()}`),r_.isString(n)&&s.push(`path=${n}`),r_.isString(i)&&s.push(`domain=${i}`),!0===o&&s.push("secure"),r_.isString(a)&&s.push(`SameSite=${a}`),document.cookie=s.join("; ")},read(e){if("u"<typeof document)return null;let t=document.cookie.split(";");for(let r=0;r<t.length;r++){let n=t[r].replace(/^\s+/,""),i=n.indexOf("=");if(-1!==i&&n.slice(0,i)===e)try{return decodeURIComponent(n.slice(i+1))}catch(e){return n.slice(i+1)}}return null},remove(e){this.write(e,"",Date.now()-864e5,"/")}}:{write(){},read:()=>null,remove(){}},nw=/^https?:(?!\/\/)/i;function nv(e,t){if("string"==typeof e){let n=nu(e);if(nw.test(n)){var r;let e,i,o;throw new rL(`Invalid URL ${JSON.stringify((o=(-1===(i=(e=n.replace(/^(https?:\/{0,2})[^/?#]*@/i,`$1${r$}@`)).indexOf("#"))?e:e.slice(0,i)).replace(/([?&][^=&#]*=)[^&#]*/g,`$1${r$}`),-1===i?o:`${o}#${!(r=e.slice(i+1))?r:r.replace(/(^|&)([^=&]*=)?[^&]+/g,(e,t,r="")=>`${t}${r}${r$}`)}`))}: missing "//" after protocol`,rL.ERR_INVALID_URL,t)}}}function nj(e,t,r,n){nv(t,n);let i=!("string"==typeof t&&/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t));if(e&&(i||!1===r)){nv(e,n);if(!t)return e;let r=e.length;for(;r>0&&47===e.charCodeAt(r-1);)r--;return e.slice(0,r)+"/"+t.replace(/^\/+/,"")}return t}let n_=e=>e instanceof rF?{...e}:e;function nS(e,t){var r;e=e||{},t=t||{};let n=Object.create(null);function i(e,t,r,n){return r_.isPlainObject(e)&&r_.isPlainObject(t)?r_.merge.call({caseless:n},e,t):r_.isPlainObject(t)?r_.merge({},t):r_.isArray(t)?t.slice():t}function o(e,t,r,n){return r_.isUndefined(t)?r_.isUndefined(e)?void 0:i(void 0,e,r,n):i(e,t,r,n)}function a(e,t){if(!r_.isUndefined(t))return i(void 0,t)}function s(e,t){return r_.isUndefined(t)?r_.isUndefined(e)?void 0:i(void 0,e):i(void 0,t)}function l(r,n,o){return r_.hasOwnProp(t,o)?i(r,n):r_.hasOwnProp(e,o)?i(void 0,r):void 0}Object.defineProperty(n,"hasOwnProperty",{__proto__:null,value:Object.prototype.hasOwnProperty,enumerable:!1,writable:!0,configurable:!0});let d={url:a,method:a,data:a,baseURL:s,transformRequest:s,transformResponse:s,paramsSerializer:s,timeout:s,timeoutErrorMessage:s,withCredentials:s,withXSRFToken:s,adapter:s,responseType:s,xsrfCookieName:s,xsrfHeaderName:s,onUploadProgress:s,onDownloadProgress:s,decompress:s,maxContentLength:s,maxBodyLength:s,beforeRedirect:s,transport:s,httpAgent:s,httpsAgent:s,cancelToken:s,socketPath:s,allowedSocketPaths:s,responseEncoding:s,validateStatus:l,headers:(e,t,r)=>o(n_(e),n_(t),r,!0)};return r_.forEach((r={...e,...t},Object.getOwnPropertySymbols&&Object.getOwnPropertyDescriptor?Object.keys(r).concat(Object.getOwnPropertySymbols(r).filter(e=>Object.getOwnPropertyDescriptor(r,e).enumerable)):Object.keys(r)),function(r){if("__proto__"===r||"constructor"===r||"prototype"===r)return;let i=r_.hasOwnProp(d,r)?d[r]:o,a=i(r_.hasOwnProp(e,r)?e[r]:void 0,r_.hasOwnProp(t,r)?t[r]:void 0,r);r_.isUndefined(a)&&i!==l||(n[r]=a)}),r_.hasOwnProp(t,"validateStatus")&&r_.isUndefined(t.validateStatus)&&!1===function(r){let n=r_.hasOwnProp(t,"transitional")?t.transitional:void 0;if(!r_.isUndefined(n)){if(!r_.isPlainObject(n))return;else if(r_.hasOwnProp(n,r))return n[r]}let i=r_.hasOwnProp(e,"transitional")?e.transitional:void 0;if(r_.isPlainObject(i)&&r_.hasOwnProp(i,r))return i[r]}("validateStatusUndefinedResolves")&&(r_.hasOwnProp(e,"validateStatus")?n.validateStatus=i(void 0,e.validateStatus):delete n.validateStatus),n}let nO=["content-type","content-length"],nC=function(e){let t=nS({},e),r=e=>r_.hasOwnProp(t,e)?t[e]:void 0,n=r("data"),i=r("withXSRFToken"),o=r("xsrfHeaderName"),a=r("xsrfCookieName"),s=r("headers"),l=r("auth"),d=r("baseURL"),c=r("allowAbsoluteUrls"),u=r("url");if(t.headers=s=rF.from(s),t.url=rJ(nj(d,u,c,t),r("params"),r("paramsSerializer")),l){let t=r_.getSafeProp(l,"username")||"",r=r_.getSafeProp(l,"password")||"";try{s.set("Authorization","Basic "+btoa(t+":"+(r?encodeURIComponent(r).replace(/%([0-9A-F]{2})/gi,(e,t)=>String.fromCharCode(parseInt(t,16))):"")))}catch(t){throw rL.from(t,rL.ERR_BAD_OPTION_VALUE,e)}}if(r_.isFormData(n)){let e=r_.getSafeProp(n,"getHeaders");if(ne.hasStandardBrowserEnv||ne.hasStandardBrowserWebWorkerEnv||r_.isReactNative(n))s.setContentType(void 0);else{var p,h;r_.isFunction(e)&&(p=s,h=e.call(n),"content-only"!==r("formDataHeaderPolicy")?p.set(h):Object.entries(h||{}).forEach(([e,t])=>{nO.includes(e.toLowerCase())&&p.set(e,t)}))}}if(ne.hasStandardBrowserEnv&&(r_.isFunction(i)&&(i=i(t)),!0===i||null==i&&ny(t.url))){let e=o&&a&&nx.read(a);e&&s.set(o,e)}return t},nR="u">typeof XMLHttpRequest&&function(e){return new Promise(function(t,r){let n,i,o,a,s,l,d=nC(e),c=d.data,u=rF.from(d.headers).normalize(),{responseType:p,onUploadProgress:h,onDownloadProgress:f}=d;function g(){a&&a(),s&&s(),d.cancelToken&&d.cancelToken.unsubscribe(n),d.signal&&d.signal.removeEventListener("abort",n)}let m=new XMLHttpRequest;function b(n){if(!m)return;if(0===m.status&&"file"!==(np(nu(d.url))||np(ne.origin))&&!(m.responseURL&&m.responseURL.startsWith("file:"))){r(new rL("Request aborted",rL.ECONNABORTED,e,m)),g(),m=null;return}try{n?l&&l(n):s&&s()}catch(e){setTimeout(()=>{throw e})}if(!m)return;let i=rF.from("getAllResponseHeaders"in m&&m.getAllResponseHeaders());nd(function(e){t(e),g()},function(e){r(e),g()},{data:p&&"text"!==p&&"json"!==p?m.response:m.responseText,status:m.status,statusText:m.statusText,headers:i,config:e,request:m}),m=null}m.open(d.method.toUpperCase(),d.url,!0),m.timeout=d.timeout,"onloadend"in m?m.onloadend=b:m.onreadystatechange=function(){!m||4!==m.readyState||(0!==m.status||m.responseURL&&m.responseURL.startsWith("file:"))&&setTimeout(b)},m.onabort=function(){m&&(r(new rL("Request aborted",rL.ECONNABORTED,e,m)),g(),m=null)},m.onerror=function(t){let n=new rL(t&&t.message?t.message:"Network Error",rL.ERR_NETWORK,e,m);n.event=t||null,r(n),g(),m=null},m.ontimeout=function(){let t=d.timeout?"timeout of "+d.timeout+"ms exceeded":"timeout exceeded",n=d.transitional||r1;d.timeoutErrorMessage&&(t=d.timeoutErrorMessage),r(new rL(t,n.clarifyTimeoutError?rL.ETIMEDOUT:rL.ECONNABORTED,e,m)),g(),m=null},void 0===c&&u.setContentType(null),"setRequestHeader"in m&&r_.forEach(rE(u),function(e,t){m.setRequestHeader(t,e)}),r_.isUndefined(d.withCredentials)||(m.withCredentials=!!d.withCredentials),p&&"json"!==p&&(m.responseType=d.responseType),f&&([o,s,l]=ng(f,!0),m.addEventListener("progress",o)),h&&m.upload&&([i,a]=ng(h),m.upload.addEventListener("progress",i),m.upload.addEventListener("loadend",a)),(d.cancelToken||d.signal)&&(n=t=>{m&&(r(!t||t.type?new nl(null,e,m):t),m.abort(),g(),m=null)},d.cancelToken&&d.cancelToken.subscribe(n),d.signal&&(d.signal.aborted?n():d.signal.addEventListener("abort",n)));let y=np(d.url);if(y&&!ne.protocols.includes(y)){r(new rL("Unsupported protocol "+y+":",rL.ERR_BAD_REQUEST,e)),g();return}m.send(c||null)})},nE=function*(e,t){let r,n=e.byteLength;if(!t||n<t)return void(yield e);let i=0;for(;i<n;)r=i+t,yield e.slice(i,r),i=r},nN=async function*(e,t){for await(let r of nP(e))yield*nE(r,t)},nP=async function*(e){if(e[Symbol.asyncIterator])return void(yield*e);let t=e.getReader();try{for(;;){let{done:e,value:r}=await t.read();if(e)break;yield r}}finally{await t.cancel()}},nA=(e,t,r,n)=>{let i,o=nN(e,t),a=0,s=e=>{!i&&(i=!0,n&&n(e))};return new ReadableStream({async pull(e){try{let{done:t,value:n}=await o.next();if(t){s(),e.close();return}let i=n.byteLength;if(r){let e=a+=i;r(e)}e.enqueue(new Uint8Array(n))}catch(e){throw s(e),e}},cancel:e=>(s(e),o.return())},{highWaterMark:2})},nk=e=>e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102,nT=(e,t,r)=>t+2<r&&nk(e.charCodeAt(t+1))&&nk(e.charCodeAt(t+2)),nI=e=>e<=57?e-48:(223&e)-55,nF=e=>e>=65&&e<=90||e>=97&&e<=122||e>=48&&e<=57||43===e||47===e||45===e||95===e,n$=e=>9===e||10===e||12===e||13===e||32===e,nz=e=>{var t;let r,n,i=e.length,o=0,a=0,s=!1;for(let t=0;t<i;t++){let r=e.charCodeAt(t);if(37===r&&nT(e,t,i)&&(r=16*nI(e.charCodeAt(t+1))+nI(e.charCodeAt(t+2)),t+=2),!n$(r)){if(61===r){a++;continue}if(!nF(r)||a>0){s=!0;continue}o++}}if(s||a>2||a>0&&(o+a)%4!=0||o%4==1){let t,r;return t=e.length,r=0,t>0&&61===e.charCodeAt(t-1)&&(r++,t>1&&61===e.charCodeAt(t-2)&&r++),Math.floor((t-r)*3/4)}return r=Math.floor((t=o)/4),3*r+(2==(n=t%4)?1:2*(3===n))},nD="1.20.0",nL={cache:"default",redirect:"follow",referrer:"about:client",referrerPolicy:"",mode:"cors",integrity:"",keepalive:!1,priority:"auto",window:null},{isFunction:nB}=r_,nU=e=>{if(!r_.isString(e))return e;try{return decodeURIComponent(e)}catch(t){return e}},nM=(e,...t)=>{try{return!!e(...t)}catch(e){return!1}},nq=e=>{let t,r=void 0!==r_.global&&null!==r_.global?r_.global:globalThis,{ReadableStream:n,TextEncoder:i}=r,{fetch:o,Request:a,Response:s}=e=r_.merge.call({skipUndefined:!0},{Request:r.Request,Response:r.Response},e),l=o?nB(o):"function"==typeof fetch,d=nB(a),c=nB(s);if(!l)return!1;let u=l&&nB(n),p=l&&("function"==typeof i?(t=new i,e=>t.encode(e)):async e=>new Uint8Array(await new a(e).arrayBuffer())),h=d&&u&&nM(()=>{let e=!1,t=new a(ne.origin,{body:new n,method:"POST",get duplex(){return e=!0,"half"}}),r=t.headers.has("Content-Type");return null!=t.body&&t.body.cancel(),e&&!r}),f=c&&u&&nM(()=>r_.isReadableStream(new s("").body)),g={stream:f&&(e=>e.body)};l&&["text","arrayBuffer","blob","formData","stream"].forEach(e=>{g[e]||(g[e]=(t,r)=>{let n=t&&t[e];if(n)return n.call(t);throw new rL(`Response type '${e}' is not supported`,rL.ERR_NOT_SUPPORT,r)})});let m=async e=>{if(null==e)return 0;if(r_.isBlob(e))return e.size;if(r_.isSpecCompliantForm(e)){let t=new a(ne.origin,{method:"POST",body:e});return(await t.arrayBuffer()).byteLength}return r_.isArrayBufferView(e)||r_.isArrayBuffer(e)?e.byteLength:(r_.isURLSearchParams(e)&&(e+=""),r_.isString(e))?(await p(e)).byteLength:void 0},b=async(e,t)=>{let r=r_.toFiniteNumber(e.getContentLength());return null==r?m(t):r};return async e=>{let t,{url:r,method:n,data:l,signal:c,cancelToken:p,timeout:y,onDownloadProgress:x,onUploadProgress:w,responseType:v,headers:j,withCredentials:_="same-origin",fetchOptions:S,maxContentLength:O,maxBodyLength:C,maxRedirects:R}=nC(e),E=r_.isNumber(O)&&O>-1,N=r_.isNumber(C)&&C>-1,P=o||fetch;v=v?(v+"").toLowerCase():"text";let A=((e,t)=>{if(e=e?e.filter(Boolean):[],!t&&!e.length)return;let r=new AbortController,n=!1,i=function(e){if(!n){n=!0,a();let t=e instanceof Error?e:this.reason;r.abort(t instanceof rL?t:new nl(t instanceof Error?t.message:t))}},o=t&&setTimeout(()=>{o=null,i(new rL(`timeout of ${t}ms exceeded`,rL.ETIMEDOUT))},t),a=()=>{e&&(o&&clearTimeout(o),o=null,e.forEach(e=>{e.unsubscribe?e.unsubscribe(i):e.removeEventListener("abort",i)}),e=null)};e.forEach(e=>{if(!n){if(e.aborted)return void i.call(e);e.addEventListener("abort",i,{once:!0})}});let{signal:s}=r;return s.unsubscribe=()=>r_.asap(a),s})([c,p&&p.toAbortSignal()],y),k=null,T=A&&A.unsubscribe&&(()=>{A.unsubscribe()}),I=null,F=()=>new rL("Request body larger than maxBodyLength limit",rL.ERR_BAD_REQUEST,e,k);try{var $,z;let o,c,p,y,D=(c="auth",r_.hasOwnProp(e,c)?e[c]:void 0);if(D){let e=r_.getSafeProp(D,"username")||"",t=r_.getSafeProp(D,"password")||"";o={username:e,password:t}}if(p=($=r).indexOf("://"),y=$,-1!==p&&(y=y.slice(p+3)),y.includes("@")||y.includes(":")){let e=new URL(r,ne.origin);if(!o&&(e.username||e.password)){let t=nU(e.username),r=nU(e.password);o={username:t,password:r}}(e.username||e.password)&&(e.username="",e.password="",r=e.href)}if(o){let e;j.delete("authorization"),j.set("Authorization","Basic "+btoa((e=(o.username||"")+":"+(o.password||""),encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi,(e,t)=>String.fromCharCode(parseInt(t,16))))))}if(E&&"string"==typeof r&&r.startsWith("data:")){let t;if(z=r,t="string"==typeof z?z.indexOf("#"):-1,((e,t)=>{if(!e||"string"!=typeof e||!e.startsWith("data:"))return 0;let r=e.indexOf(",");if(r<0)return 0;let n=e.slice(5,r),i=e.slice(r+1);if(/;base64/i.test(n))return t(i);let o=0;for(let e=0,t=i.length;e<t;e++){let r=i.charCodeAt(e);if(37===r&&nT(i,e,t))o+=1,e+=2;else if(r<128)o+=1;else if(r<2048)o+=2;else if(r>=55296&&r<=56319&&e+1<t){let t=i.charCodeAt(e+1);t>=56320&&t<=57343?(o+=4,e++):o+=3}else o+=3}return o})(-1===t?z:z.slice(0,t),nz)>O)throw new rL("maxContentLength size of "+O+" exceeded",rL.ERR_BAD_RESPONSE,e,k)}if(N&&"get"!==n&&"head"!==n){let e=await m(l);if("number"==typeof e&&isFinite(e)&&(t=e,e>C))throw F()}let L=N&&(r_.isReadableStream(l)||r_.isStream(l)),B=(e,t,r)=>nA(e,65536,e=>{if(N&&e>C)throw I=F();t&&t(e)},r);if(h&&"get"!==n&&"head"!==n&&(w||L)){if(t=null==t?await b(j,l):t,0!==t||L){let e,n=new a(r,{method:"POST",body:l,duplex:"half"});if(r_.isFormData(l)&&(e=n.headers.get("content-type"))&&j.setContentType(e),n.body){let[e,r]=w&&nm(t,ng(nb(w)))||[];l=B(n.body,e,r)}}}else if(L&&!d&&u&&"get"!==n&&"head"!==n)l=B(l);else if(L&&d&&!h&&"get"!==n&&"head"!==n)throw new rL("Stream request bodies are not supported by the current fetch implementation",rL.ERR_NOT_SUPPORT,e,k);r_.isString(_)||(_=_?"include":"omit");let U=d&&"credentials"in a.prototype;if(r_.isFormData(l)){let e=j.getContentType();e&&/^multipart\/form-data/i.test(e)&&!/boundary=/i.test(e)&&j.delete("content-type")}j.set("User-Agent","axios/"+nD,!1);let M=null==S?S:Object.assign(Object.create(null),S);M&&(delete M.body,delete M.headers,delete M.method,delete M.signal,delete M.duplex,delete M.credentials);let q=Object.assign(Object.create(null),M,{signal:A,method:n.toUpperCase(),headers:rE(j.normalize()),body:l,duplex:"half",credentials:U?_:void 0});d&&(r_.forEach(nL,(e,t)=>{void 0===q[t]&&(q[t]=e)}),void 0===q.signal&&(q.signal=null),void 0===q.body&&(q.body=null)),0===R&&(q.redirect="manual",M&&(M.redirect="manual")),k=d&&new a(r,q);let X=await (d?P(k,M):P(r,q)),W=rF.from(X.headers);if(E){let t=r_.toFiniteNumber(W.getContentLength());if(null!=t&&t>O)throw new rL("maxContentLength size of "+O+" exceeded",rL.ERR_BAD_RESPONSE,e,k)}let H=f&&("stream"===v||"response"===v);if(f&&X.body&&(x||E||H&&T)){let t={};["status","statusText","headers"].forEach(e=>{t[e]=X[e]});let r=r_.toFiniteNumber(W.getContentLength()),[n,i]=x&&nm(r,ng(nb(x),!0))||[];X=new s(nA(X.body,65536,t=>{if(E&&t>O)throw new rL("maxContentLength size of "+O+" exceeded",rL.ERR_BAD_RESPONSE,e,k);n&&n(t)},()=>{i&&i(),T&&T()}),t)}v=v||"text";let G=await g[r_.findKey(g,v)||"text"](X,e);if(E&&!f&&!H){let t;if(null!=G&&("number"==typeof G.byteLength?t=G.byteLength:"number"==typeof G.size?t=G.size:"string"==typeof G&&(t="function"==typeof i?new i().encode(G).byteLength:G.length)),"number"==typeof t&&t>O)throw new rL("maxContentLength size of "+O+" exceeded",rL.ERR_BAD_RESPONSE,e,k)}return!H&&T&&T(),await new Promise((t,r)=>{nd(t,r,{data:G,headers:rF.from(X.headers),status:X.status,statusText:X.statusText,config:e,request:k})})}catch(t){if(T&&T(),A&&A.aborted&&A.reason instanceof rL){let r=A.reason;throw r.config=e,k&&(r.request=k),t!==r&&Object.defineProperty(r,"cause",{__proto__:null,value:t,writable:!0,enumerable:!1,configurable:!0}),r}if(I)throw k&&!I.request&&(I.request=k),I;if(t instanceof rL)throw k&&!t.request&&(t.request=k),t;if(t&&"TypeError"===t.name&&/Load failed|fetch/i.test(t.message)){let r=new rL("Network Error",rL.ERR_NETWORK,e,k,t&&t.response);throw Object.defineProperty(r,"cause",{__proto__:null,value:t.cause||t,writable:!0,enumerable:!1,configurable:!0}),r}throw rL.from(t,t&&t.code,e,k,t&&t.response)}}},nX=new Map,nW=e=>{let t=e&&e.env||{},{fetch:r,Request:n,Response:i}=t,o=[n,i,r],a=o.length,s,l,d=nX;for(;a--;)s=o[a],void 0===(l=d.get(s))&&d.set(s,l=a?new Map:nq(t)),d=l;return l};nW();let nH={http:null,xhr:nR,fetch:{get:nW}};r_.forEach(nH,(e,t)=>{if(e){try{Object.defineProperty(e,"name",{__proto__:null,value:t})}catch(e){}Object.defineProperty(e,"adapterName",{__proto__:null,value:t})}});let nG=e=>`- ${e}`,nY=e=>r_.isFunction(e)||null===e||!1===e,nJ=function(e,t){let r,n,{length:i}=e=r_.isArray(e)?e:[e],o={};for(let a=0;a<i;a++){let i;if(n=r=e[a],!nY(r)&&void 0===(n=nH[(i=String(r)).toLowerCase()]))throw new rL(`Unknown adapter '${i}'`);if(n&&(r_.isFunction(n)||(n=n.get(t))))break;o[i||"#"+a]=n}if(!n){let e=Object.entries(o).map(([e,t])=>`adapter ${e} `+(!1===t?"is not supported by the environment":"is not available in the build"));throw new rL("There is no suitable adapter to dispatch the request "+(i?e.length>1?"since :\n"+e.map(nG).join("\n"):" "+nG(e[0]):"as no adapter specified"),rL.ERR_NOT_SUPPORT)}return n};function nV(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new nl(null,e)}function nK(e){let t=r_.toSafeFlatObject(e);return nV(t),t.headers=rF.from(r_.getSafeProp(t,"headers")),t.data=na.call(t,t.transformRequest),-1!==["post","put","patch"].indexOf(t.method)&&t.headers.setContentType("application/x-www-form-urlencoded",!1),nJ(t.adapter||no.adapter,t)(t).then(function(e){nV(t),t.response=e;try{e.data=na.call(t,t.transformResponse,e)}finally{delete t.response}return e.headers=rF.from(e.headers),e},function(e){if(!ns(e)&&(nV(t),e&&e.response)){t.response=e.response;try{e.response.data=na.call(t,t.transformResponse,e.response)}finally{delete t.response}e.response.headers=rF.from(e.response.headers)}return Promise.reject(e)})}let nQ={};["object","boolean","number","function","string","symbol"].forEach((e,t)=>{nQ[e]=function(r){return typeof r===e||"a"+(t<1?"n ":" ")+e}});let nZ={};nQ.transitional=function(e,t,r){function n(e,t){return"[Axios v"+nD+"] Transitional option '"+e+"'"+t+(r?". "+r:"")}return(r,i,o)=>{if(!1===e)throw new rL(n(i," has been removed"+(t?" in "+t:"")),rL.ERR_DEPRECATED);return t&&!nZ[i]&&(nZ[i]=!0,console.warn(n(i," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(r,i,o)}},nQ.spelling=function(e){return(t,r)=>(console.warn(`${r} is likely a misspelling of ${e}`),!0)};let n0=function(e,t,r){if("object"!=typeof e||null===e)throw new rL("options must be an object",rL.ERR_BAD_OPTION_VALUE);let n=Object.keys(e),i=n.length;for(;i-- >0;){let o=n[i],a=Object.prototype.hasOwnProperty.call(t,o)?t[o]:void 0;if(a){let t=e[o],r=void 0===t||a(t,o,e);if(!0!==r)throw new rL("option "+o+" must be "+r,rL.ERR_BAD_OPTION_VALUE);continue}if(!0!==r)throw new rL("Unknown option "+o,rL.ERR_BAD_OPTION)}};class n1{constructor(e){this.defaults=e||{},this.interceptors={request:new r0,response:new r0}}async request(e,t){try{return await this._request(e,t)}catch(e){if(e instanceof Error)try{let t={};Error.captureStackTrace?Error.captureStackTrace(t):t=Error();let r=t.stack,n="";if("string"==typeof r){let e=r.indexOf("\n");n=-1===e?"":r.slice(e+1)}if(e.stack){if(n){let t=n.indexOf("\n"),r=-1===t?-1:n.indexOf("\n",t+1),i=-1===r?"":n.slice(r+1);String(e.stack).endsWith(i)||(e.stack+="\n"+n)}}else e.stack=n}catch(e){}throw e}}_request(e,t){let r,n;"string"==typeof e?(t=t||{}).url=e:t=e||{};let{transitional:i,paramsSerializer:o,headers:a}=t=nS(this.defaults,t);void 0!==i&&n0(i,{silentJSONParsing:nQ.transitional(nQ.boolean),forcedJSONParsing:nQ.transitional(nQ.boolean),clarifyTimeoutError:nQ.transitional(nQ.boolean),legacyInterceptorReqResOrdering:nQ.transitional(nQ.boolean),advertiseZstdAcceptEncoding:nQ.transitional(nQ.boolean),validateStatusUndefinedResolves:nQ.transitional(nQ.boolean)},!1),null!=o&&(r_.isFunction(o)?t.paramsSerializer={serialize:o}:n0(o,{encode:nQ.function,serialize:nQ.function},!0)),void 0!==t.allowAbsoluteUrls||(void 0!==this.defaults.allowAbsoluteUrls?t.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:t.allowAbsoluteUrls=!0),n0(t,{baseUrl:nQ.spelling("baseURL"),withXsrfToken:nQ.spelling("withXSRFToken")},!0),t.method=(r_.getSafeProp(t,"method")||r_.getSafeProp(this.defaults,"method")||"get").toLowerCase();let s=a&&r_.merge(a.common,a[t.method]);a&&r_.forEach(nn.concat("common"),e=>{delete a[e]}),t.headers=rF.concat(s,a);let l=[],d=!0;this.interceptors.request.forEach(function(e){if("function"==typeof e.runWhen&&!1===e.runWhen(t))return;d=d&&e.synchronous;let r=t.transitional||r1;r&&r.legacyInterceptorReqResOrdering?l.unshift(e.fulfilled,e.rejected):l.push(e.fulfilled,e.rejected)});let c=[];this.interceptors.response.forEach(function(e){c.push(e.fulfilled,e.rejected)});let u=0;if(!d){let e=[nK.bind(this),void 0];for(e.unshift(...l),e.push(...c),n=e.length,r=Promise.resolve(t);u<n;)r=r.then(e[u++],e[u++]);return r}n=l.length;let p=t;for(;u<n;){let e=l[u++],t=l[u++];try{p=e?e(p):p}catch(e){if(!t){r=Promise.reject(e);break}try{let n=t.call(this,e);r_.isThenable(n)&&(r=Promise.resolve(n).then(()=>nK.call(this,p)))}catch(e){r=Promise.reject(e)}break}}if(!r)try{r=nK.call(this,p)}catch(e){r=Promise.reject(e)}for(u=0,n=c.length;u<n;)r=r.then(c[u++],c[u++]);return r}getUri(e){return rJ(nj((e=nS(this.defaults,e)).baseURL,e.url,e.allowAbsoluteUrls,e),e.params,e.paramsSerializer)}}r_.forEach(["delete","get","head","options"],function(e){n1.prototype[e]=function(t,r){return this.request(nS(r||{},{method:e,url:t,data:r&&r_.hasOwnProp(r,"data")?r.data:void 0}))}}),r_.forEach(["post","put","patch","query"],function(e){function t(t){return function(r,n,i){return this.request(nS(i||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:r,data:n}))}}n1.prototype[e]=t(),"query"!==e&&(n1.prototype[e+"Form"]=t(!0))});let n2=class e{constructor(e){let t;if("function"!=typeof e)throw TypeError("executor must be a function.");this.promise=new Promise(function(e){t=e});const r=this;this.promise.then(e=>{if(!r._listeners)return;let t=r._listeners.length;for(;t-- >0;)r._listeners[t](e);r._listeners=null}),this.promise.then=e=>{let t,n=new Promise(e=>{r.subscribe(e),t=e}).then(e);return n.cancel=function(){r.unsubscribe(t)},n},e(function(e,n,i){r.reason||(r.reason=new nl(e,n,i),t(r.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;let t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}toAbortSignal(){let e=new AbortController,t=t=>{e.abort(t)};return this.subscribe(t),e.signal.unsubscribe=()=>this.unsubscribe(t),e.signal}static source(){let t;return{token:new e(function(e){t=e}),cancel:t}}},n5={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,ContentTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,UnprocessableContent:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511,WebServerReturnsAnUnknownError:520,WebServerIsDown:521,ConnectionTimedOut:522,OriginIsUnreachable:523,TimeoutOccurred:524,SslHandshakeFailed:525,InvalidSslCertificate:526};Object.entries(n5).forEach(([e,t])=>{void 0===n5[t]&&(n5[t]=e)});let n4=function e(t){let r=new n1(t),n=tU(n1.prototype.request,r);return r_.extend(n,n1.prototype,r,{allOwnKeys:!0}),r_.extend(n,r,null,{allOwnKeys:!0}),n.create=function(r){return e(nS(t,r))},n}(no);n4.Axios=n1,n4.CanceledError=nl,n4.CancelToken=n2,n4.isCancel=ns,n4.VERSION=nD,n4.toFormData=rX,n4.AxiosError=rL,n4.Cancel=n4.CanceledError,n4.all=function(e){return Promise.all(e)},n4.spread=function(e){return function(t){return e.apply(null,t)}},n4.isAxiosError=function(e){return r_.isObject(e)&&!0===e.isAxiosError},n4.mergeConfig=nS,n4.AxiosHeaders=rF,n4.formToJSON=e=>nr(r_.isHTMLForm(e)?new FormData(e):e),n4.getAdapter=nJ,n4.HttpStatusCode=n5,n4.default=n4;let n3={en:tE.default,zh:tN.default},n8=new Set(["contact_email","contact_name","contact_phone","messaging_app_type","quote_number","business_name","abn","registered_address","registered_suburb","registered_postcode","registered_state","registered_country","eftpos_integration","alipay_option","ready_by","heard_about","heard_other","menu_files","menu_send_later","notes"]),n9=tR`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`,n6=tR`
  from { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
  to { 
    opacity: 0; 
    transform: translateX(-50%) scale(0.9); 
  }
`,n7=tR`
  from { 
    opacity: 0; 
    transform: translateX(50%) scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
`;tR`
  0%, 100% { 
    box-shadow: 0 8px 20px rgba(43,123,227,0.18), 0 0 0 0 rgba(43,123,227,0.4);
  }
  50% { 
    box-shadow: 0 12px 28px rgba(43,123,227,0.25), 0 0 0 8px rgba(43,123,227,0);
  }
`;let ie=tR`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,it=tR`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`,ir=tR`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
`,ii=tR`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 12px rgba(231, 76, 60, 0);
  }
`,io=tS.div.withConfig({displayName:"OnboardingForm__StatusCard",componentId:"sc-e9894832-0"})`
  text-align: center;
  padding: 4rem 2rem;
  animation: ${it} 500ms ease both;
`;tS.div.withConfig({displayName:"OnboardingForm__StatusIcon",componentId:"sc-e9894832-1"})`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  ${e=>"loading"===e.$type&&`
    animation: ${ie} 2s linear infinite;
  `}
  ${e=>"error"===e.$type&&`
    animation: ${ir} 0.6s ease-in-out;
  `}
`;let ia=tS.div.withConfig({displayName:"OnboardingForm__WarningIconWrapper",componentId:"sc-e9894832-2"})`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
  animation: ${ir} 0.6s ease-in-out, ${it} 500ms ease both;
`,is=tS.div.withConfig({displayName:"OnboardingForm__WarningIconCircle",componentId:"sc-e9894832-3"})`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(255, 107, 107, 0.1));
  border-radius: 50%;
  animation: ${ii} 2s ease-in-out infinite;
`,il=tS.svg.withConfig({displayName:"OnboardingForm__WarningIconSvg",componentId:"sc-e9894832-4"})`
  position: relative;
  z-index: 1;
  width: 64px;
  height: 64px;
  filter: drop-shadow(0 4px 12px rgba(231, 76, 60, 0.3));
`,id=tS.div.withConfig({displayName:"OnboardingForm__StatusTitle",componentId:"sc-e9894832-5"})`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${e=>"error"===e.$type?"#e74c3c":"#2b7be3"};
`,ic=tS.div.withConfig({displayName:"OnboardingForm__StatusMessage",componentId:"sc-e9894832-6"})`
  color: #567;
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
`,iu=tS.div.withConfig({displayName:"OnboardingForm__InfoBox",componentId:"sc-e9894832-7"})`
  background: linear-gradient(135deg, rgba(43,123,227,0.08), rgba(94,200,255,0.05));
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 12px;
  padding: 1.5rem;
  font-size: 0.95rem;
  color: #456;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(43,123,227,0.08);
`,ip=tS.div.withConfig({displayName:"OnboardingForm__Spinner",componentId:"sc-e9894832-8"})`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(43,123,227,0.15);
  border-top-color: #2b7be3;
  border-radius: 50%;
  animation: ${ie} 0.8s linear infinite;
  margin: 0 auto 1.5rem;
`,ih=(function(e,...t){let r=t_(e,...t),n=`sc-global-${eO(JSON.stringify(r))}`,i=new tO(r,n),o=e=>{let t,r=tg(),o=f.default.useContext(tm);{let e=f.default.useRef(null);null===e.current&&(e.current=r.styleSheet.allocateGSInstance(n)),t=e.current}r.styleSheet.server&&a(t,e,r.styleSheet,o,r.stylis);{let s=i.isStatic?[t,r.styleSheet,i]:[t,e,r.styleSheet,o,r.stylis,i],l=f.default.useRef(i);f.default.useLayoutEffect(()=>{r.styleSheet.server||(l.current!==i&&(r.styleSheet.clearRules(n),l.current=i),a(t,e,r.styleSheet,o,r.stylis))},s),f.default.useLayoutEffect(()=>()=>{r.styleSheet.server||i.removeStyles(t,r.styleSheet)},[t,r.styleSheet,i])}return r.styleSheet.server&&i.instanceRules.delete(t),null};function a(e,t,r,n,a){if(i.isStatic)i.renderStyles(e,es,r,a);else{let s=Object.assign(Object.assign({},t),{theme:eb(t,n,o.defaultProps)});i.renderStyles(e,s,r,a)}}return f.default.memo(o)})`
  html {
    min-height: 100%;
    margin: 0;
    font-family: 'Stack Sans Text', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(180deg, rgba(30, 64, 175, 0.05) 0%, rgba(59, 130, 246, 0.02) 60%, rgba(147, 197, 253, 0.03) 100%);
    background-image:
      radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.08), transparent 12%),
      radial-gradient(circle at 90% 90%, rgba(147, 197, 253, 0.06), transparent 10%),
      linear-gradient(180deg, rgba(30, 64, 175, 0.05) 0%, rgba(59, 130, 246, 0.02) 60%, rgba(147, 197, 253, 0.03) 100%);
    background-attachment: fixed;
  }
  
  body {
    margin: 0;
    min-height: 100vh;
  }
  
  #root { 
    min-height: 100vh; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
  }
`,ig=tS.section.withConfig({displayName:"OnboardingForm__Container",componentId:"sc-e9894832-9"})`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  animation: ${n9} 400ms ease both;
  &.slide-out {
    animation: ${n6} 600ms cubic-bezier(0.4, 0.0, 0.2, 1) both;
  }
  &.slide-in {
    animation: ${n7} 600ms cubic-bezier(0.4, 0.0, 0.2, 1) both;
  }
`,im=tS.div.withConfig({displayName:"OnboardingForm__Card",componentId:"sc-e9894832-10"})`
  width: 920px;
  max-width: 96%;
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9));
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 12px 30px rgba(30, 64, 175, 0.12), inset 0 1px 0 rgba(255,255,255,0.7);
  border: 1px solid rgba(147, 197, 253, 0.2);
  transition: transform 240ms ease, box-shadow 240ms ease;
  &:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(30, 64, 175, 0.18); }
`,ib=tS.div.withConfig({displayName:"OnboardingForm__HeroHeader",componentId:"sc-e9894832-11"})`
  text-align: center;
  padding: 3rem 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(43,123,227,0.08), rgba(94,200,255,0.05));
  margin: -2rem -2rem 2.5rem;
  border-radius: 16px 16px 0 0;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 640px) {
    padding: 2rem 1rem 1.5rem;
    padding-top: 4rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2b7be3, #5ec8ff, #2b7be3);
    background-size: 200% 100%;
    animation: gradientShift 3s ease infinite;
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`,iy=tS.div.withConfig({displayName:"OnboardingForm__LogosContainer",componentId:"sc-e9894832-12"})`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 640px) {
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
`;tS.img.withConfig({displayName:"OnboardingForm__LogoImage",componentId:"sc-e9894832-13"})`
  height: 40px;
  object-fit: contain;
`;let ix=tS.div.withConfig({displayName:"OnboardingForm__LogoDivider",componentId:"sc-e9894832-14"})`
  width: 1px;
  height: 30px;
  background: rgba(43,123,227,0.2);
`,iw=tS.div.withConfig({displayName:"OnboardingForm__LangDropdownFixed",componentId:"sc-e9894832-15"})`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 20;
  
  @media (max-width: 640px) {
    top: 0.75rem;
    right: 0.75rem;
    left: 0.75rem;
    display: flex;
    justify-content: flex-end;
  }
`,iv=tS.h1.withConfig({displayName:"OnboardingForm__HeroTitle",componentId:"sc-e9894832-16"})`
  margin: 0 0 0.75rem;
  color: #0b2b4a;
  font-size: 2.2rem;
  letter-spacing: 0.5px;
  font-weight: 900;
  line-height: 1.2;
  background: linear-gradient(135deg, #0b2b4a 0%, #2b7be3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${n9} 600ms ease both;
  animation-delay: 200ms;

  @media (max-width: 640px) {
    font-size: 1.75rem;
  }
`,ij=tS.p.withConfig({displayName:"OnboardingForm__HeroSubtitle",componentId:"sc-e9894832-17"})`
  margin: 0 0 1rem;
  color: #567;
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto;
  animation: ${n9} 600ms ease both;
  animation-delay: 300ms;

  @media (max-width: 640px) {
    font-size: 0.95rem;
  }
`;tS.div.withConfig({displayName:"OnboardingForm__HeroBadge",componentId:"sc-e9894832-18"})`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.9);
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 24px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2b7be3;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(43,123,227,0.12);
  animation: ${n9} 600ms ease both;
  animation-delay: 400ms;
  
  &::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #2b7be3, #5ec8ff);
    color: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 700;
  }
`,tS.div.withConfig({displayName:"OnboardingForm__TitleSection",componentId:"sc-e9894832-19"})`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`,tS.div.withConfig({displayName:"OnboardingForm__TitleRow",componentId:"sc-e9894832-20"})`
  display: flex;
  align-items: center;
  gap: 1rem;
`,tS.h2.withConfig({displayName:"OnboardingForm__Title",componentId:"sc-e9894832-21"})`
  margin: 0;
  color: #0b2b4a;
  font-size: 1.75rem;
  letter-spacing: 0.2px;
  font-weight: 800;
  background: linear-gradient(135deg, #0b2b4a 0%, #2b7be3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,tS.span.withConfig({displayName:"OnboardingForm__Badge",componentId:"sc-e9894832-22"})`
  padding: 0.35rem 0.75rem;
  background: linear-gradient(135deg, rgba(43,123,227,0.1), rgba(94,200,255,0.08));
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #2b7be3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,tS.div.withConfig({displayName:"OnboardingForm__ProgressBar",componentId:"sc-e9894832-23"})`
  height: 4px;
  background: rgba(43,123,227,0.1);
  border-radius: 2px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: 30%;
    background: linear-gradient(90deg, #2b7be3, #5ec8ff);
    animation: ${n9} 600ms ease;
  }
`,tS.p.withConfig({displayName:"OnboardingForm__Subtitle",componentId:"sc-e9894832-24"})`
  margin: 0;
  color: #567;
  font-size: 0.95rem;
  padding-left: 60px;
`,tS.select.withConfig({displayName:"OnboardingForm__LanguageSelect",componentId:"sc-e9894832-25"})`
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(60,90,120,0.12);
  background: #fff;
  font-weight: 600;
  color: #0b2b4a;
  cursor: pointer;
`;let i_=tS.div.withConfig({displayName:"OnboardingForm__Grid",componentId:"sc-e9894832-26"})`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (max-width: 920px) { 
    grid-template-columns: 1fr; 
  }
`,iS=tS.form.withConfig({displayName:"OnboardingForm__Form",componentId:"sc-e9894832-27"})`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
`,iO=tS.div.withConfig({displayName:"OnboardingForm__Field",componentId:"sc-e9894832-28"})`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  position: relative;
`,iC=tS.label.withConfig({displayName:"OnboardingForm__Label",componentId:"sc-e9894832-29"})`
  font-weight: 600;
  color: #3c5a78;
  font-size: 0.9rem;
`,iR=tS.input.withConfig({displayName:"OnboardingForm__Input",componentId:"sc-e9894832-30"})`
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(60,90,120,0.12);
  background: linear-gradient(180deg, #fff, #fbfdff);
  transition: border-color 160ms ease, box-shadow 160ms ease;
  &:focus { outline: none; border-color: #2b7be3; box-shadow: 0 6px 18px rgba(43,123,227,0.12); }
  &.error { 
    border-color: #e74c3c; 
  }
  &.error:focus { 
    border-color: #e74c3c; 
    box-shadow: 0 6px 18px rgba(231,76,60,0.15); 
  }
`,iE=tS.textarea.withConfig({displayName:"OnboardingForm__Textarea",componentId:"sc-e9894832-31"})`
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(60,90,120,0.12);
  min-height: 120px;
  resize: vertical;
  transition: border-color 160ms ease, box-shadow 160ms ease;
  &:focus { outline: none; border-color: #2b7be3; box-shadow: 0 6px 18px rgba(43,123,227,0.12); }
  &.error { 
    border-color: #e74c3c; 
  }
  &.error:focus { 
    border-color: #e74c3c; 
    box-shadow: 0 6px 18px rgba(231,76,60,0.15); 
  }
`,iN=tS.select.withConfig({displayName:"OnboardingForm__Select",componentId:"sc-e9894832-32"})`
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(60,90,120,0.12);
  background: linear-gradient(180deg, #fff, #fbfdff);
  cursor: pointer;
  transition: border-color 160ms ease, box-shadow 160ms ease;
  font-size: 1rem;
  color: #3c5a78;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  /* Improve mobile appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233c5a78' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
  
  @media (max-width: 640px) {
    font-size: 16px;
    padding: 0.9rem 1rem;
    padding-right: 2.5rem;
  }
  
  &:focus { 
    outline: none; 
    border-color: #2b7be3; 
    box-shadow: 0 6px 18px rgba(43,123,227,0.12);
  }
  
  &.error { 
    border-color: #e74c3c; 
  }
  
  &.error:focus { 
    border-color: #e74c3c; 
    box-shadow: 0 6px 18px rgba(231,76,60,0.15); 
  }
  
  /* Style for options */
  option {
    padding: 0.75rem;
    background: white;
    color: #3c5a78;
    font-size: 1rem;
    
    @media (max-width: 640px) {
      font-size: 16px;
      padding: 1rem;
    }
  }
`,iP=tS.div.withConfig({displayName:"OnboardingForm__ErrorText",componentId:"sc-e9894832-33"})`
  font-size: 0.8rem;
  color: #e74c3c;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  animation: ${n9} 300ms ease;
`,iA=tS.label.withConfig({displayName:"OnboardingForm__FileUploadButton",componentId:"sc-e9894832-34"})`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #2b7be3, #5ec8ff);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  border: none;
  
  input[type="file"] {
    display: none;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(43,123,227,0.25);
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`,ik=tS.div.withConfig({displayName:"OnboardingForm__FileList",componentId:"sc-e9894832-35"})`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`,iT=tS.div.withConfig({displayName:"OnboardingForm__FileItem",componentId:"sc-e9894832-36"})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: rgba(43,123,227,0.05);
  border-radius: 6px;
  font-size: 0.85rem;
  color: #3c5a78;
`,iI=tS.button.withConfig({displayName:"OnboardingForm__RemoveFileButton",componentId:"sc-e9894832-37"})`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  transition: color 150ms ease;
  
  &:hover {
    color: #c0392b;
  }
`,iF=tS.aside.withConfig({displayName:"OnboardingForm__Side",componentId:"sc-e9894832-38"})`
  display:flex;
  flex-direction:column;
  gap:0.75rem;
`,i$=tS.div.withConfig({displayName:"OnboardingForm__CardBox",componentId:"sc-e9894832-39"})`
  padding:1rem;
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,249,255,0.98));
  border-radius:12px;
  border: 1px solid rgba(60,90,120,0.06);
`,iz=tS.button.withConfig({displayName:"OnboardingForm__Submit",componentId:"sc-e9894832-40"})`
  margin-top: 1rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #2b7be3 0%, #5ec8ff 100%);
  color: white;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(43,123,227,0.18);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(43,123,227,0.25);
    background: linear-gradient(135deg, #1e6ad9 0%, #4ab8f0 100%);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active { 
    transform: translateY(0px);
    box-shadow: 0 6px 16px rgba(43,123,227,0.2);
  }
  
  &:disabled { 
    opacity: 0.7;
    cursor: not-allowed; 
    transform: none;
    box-shadow: 0 4px 12px rgba(43,123,227,0.12);
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      margin-left: 10px;
      border: 2px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 640px) {
    width: 100%;
    padding: 1.1rem 1.5rem;
  }
`,iD=tS.div.withConfig({displayName:"OnboardingForm__SubmitWrapper",componentId:"sc-e9894832-41"})`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`,iL=tS.div.withConfig({displayName:"OnboardingForm__SubmitHint",componentId:"sc-e9894832-42"})`
  font-size: 0.85rem;
  color: #567;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  svg {
    width: 16px;
    height: 16px;
    color: #10b981;
  }
`,iB=tS.div.withConfig({displayName:"OnboardingForm__LangDropdown",componentId:"sc-e9894832-43"})`
  position: relative;
`,iU=tS.button.withConfig({displayName:"OnboardingForm__LangButton",componentId:"sc-e9894832-44"})`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: 2px solid rgba(60,90,120,0.12);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
  color: #2b7be3;
  transition: all 200ms ease;
  font-size: 0.9rem;
  &:hover {
    border-color: #2b7be3;
    box-shadow: 0 4px 12px rgba(43,123,227,0.15);
    transform: translateY(-2px);
  }
`,iM=tS.div.withConfig({displayName:"OnboardingForm__DropdownMenu",componentId:"sc-e9894832-45"})`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 2px solid rgba(60,90,120,0.12);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(30, 64, 175, 0.15);
  overflow: hidden;
  opacity: ${e=>+!!e.$show};
  visibility: ${e=>e.$show?"visible":"hidden"};
  transform: ${e=>e.$show?"translateY(0)":"translateY(-8px)"};
  transition: all 200ms ease;
  min-width: 140px;
  z-index: 10;
`,iq=tS.button.withConfig({displayName:"OnboardingForm__MenuItem",componentId:"sc-e9894832-46"})`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: ${e=>e.$active?"rgba(43,123,227,0.1)":"transparent"};
  color: ${e=>e.$active?"#2b7be3":"#3c5a78"};
  text-align: left;
  cursor: pointer;
  font-weight: ${e=>e.$active?"700":"500"};
  transition: background 150ms ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  &:hover {
    background: rgba(43,123,227,0.08);
  }
  &:not(:last-child) {
    border-bottom: 1px solid rgba(60,90,120,0.06);
  }
`,iX=()=>(0,h.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[(0,h.jsx)("circle",{cx:"12",cy:"12",r:"10"}),(0,h.jsx)("line",{x1:"2",y1:"12",x2:"22",y2:"12"}),(0,h.jsx)("path",{d:"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"})]}),iW=({open:e})=>(0,h.jsx)("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",style:{transition:"transform 200ms ease",transform:e?"rotate(180deg)":"rotate(0deg)"},children:(0,h.jsx)("polyline",{points:"6 9 12 15 18 9"})});tS.div.withConfig({displayName:"OnboardingForm__FieldGroup",componentId:"sc-e9894832-47"})`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(43,123,227,0.03), rgba(94,200,255,0.02));
  border-radius: 12px;
  border: 1px solid rgba(43,123,227,0.08);
`,tS.div.withConfig({displayName:"OnboardingForm__GroupTitle",componentId:"sc-e9894832-48"})`
  font-weight: 700;
  color: #3c5a78;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 18px;
    background: linear-gradient(180deg, #2b7be3, #5ec8ff);
    border-radius: 2px;
  }
`,tS.div.withConfig({displayName:"OnboardingForm__AccordionSection",componentId:"sc-e9894832-49"})`
  border-radius: 12px;
  transition: max-height 300ms ease, opacity 300ms ease;
  background: ${e=>e.$expanded?"rgba(43,123,227,0.03)":"transparent"};
  border: 1px solid ${e=>e.$expanded?"rgba(43,123,227,0.08)":"rgba(43,123,227,0.05)"};
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`,tS.div.withConfig({displayName:"OnboardingForm__AccordionHeader",componentId:"sc-e9894832-50"})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  cursor: pointer;
  font-weight: 600;
  color: #0b2b4a;
  background: rgba(255,255,255,0.9);
  transition: background 200ms ease;
  font-size: 0.95rem;
  border-radius: 11px 11px 0 0;
  
  @media (max-width: 640px) {
    padding: 0.9rem 1rem;
    font-size: 0.9rem;
  }
  
  &:hover {
    background: rgba(255,255,255,1);
  }
`,tS.div.withConfig({displayName:"OnboardingForm__AccordionContent",componentId:"sc-e9894832-51"})`
  padding: ${e=>e.$expanded?"1rem 1.25rem 1.5rem":"0 1.25rem"};
  max-height: ${e=>e.$expanded?"3000px":"0"};
  opacity: ${e=>+!!e.$expanded};
  overflow: ${e=>e.$expanded?"visible":"hidden"};
  transition: padding 300ms ease, max-height 400ms ease, opacity 300ms ease;
  
  @media (max-width: 640px) {
    padding: ${e=>e.$expanded?"1rem 1rem 1.25rem":"0 1rem"};
  }
`;let iH=tS.div.withConfig({displayName:"OnboardingForm__ReferenceImagesContainer",componentId:"sc-e9894832-52"})`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`,iG=tS.div.withConfig({displayName:"OnboardingForm__ReferenceImageWrapper",componentId:"sc-e9894832-53"})`
  flex: 1;
  min-width: 140px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(43,123,227,0.15);
  box-shadow: 0 4px 12px rgba(43,123,227,0.1);
  transition: all 200ms ease;
  background: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(43,123,227,0.2);
    border-color: rgba(43,123,227,0.3);
  }
`,iY=tS.div.withConfig({displayName:"OnboardingForm__ReferenceImage",componentId:"sc-e9894832-54"})`
  position: relative;
  width: 100%;
  padding-bottom: 60%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`,iJ=tS.div.withConfig({displayName:"OnboardingForm__ImageCaption",componentId:"sc-e9894832-55"})`
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: #567;
  text-align: center;
  background: rgba(43,123,227,0.03);
  font-weight: 600;
`,iV=p.default.env.NEXT_PUBLIC_API_BASE_URL||"https://dbapi.vend88.com";e.s(["default",0,function(){let e=(0,g.useRouter)(),{token:t}=e.query,r="u">typeof navigator&&navigator.language.startsWith("zh")?"zh":"en",[n,i]=(0,f.useState)(r),[o,a]=(0,f.useState)(!1),[s,l]=(0,f.useState)(!1),[d,c]=(0,f.useState)(!1),[u,p]=(0,f.useState)(!0),[m,b]=(0,f.useState)(!1),[y,x]=(0,f.useState)(null),[w,v]=(0,f.useState)([]),[j,_]=(0,f.useState)({});(0,f.useEffect)(()=>{e.isReady&&(!t||"string"!=typeof t)&&window.location.replace("https://vend88.com.au")},[e.isReady,t]),(0,f.useEffect)(()=>{let r=async()=>{if(t&&"string"==typeof t)try{let e=await n4.get(`${iV}/registration/validate-token/${t}`),r=e.data.data||e.data;if((e.data.success||r.valid)&&r.valid&&!r.used&&!r.expired)b(!0),x(null),v(r.form_fields||[]);else{let e=r.reason||(r.used?"zh"===n?"此注册表单已提交。每个链接只能使用一次。如需更改，请联系管理员。":"This registration form has already been submitted. Each link can only be used once. Please contact the admin if you need to make changes.":r.expired?"zh"===n?"注册令牌已过期。请联系管理员获取新链接。":"Registration token has expired. Please contact the admin for a new link.":"zh"===n?"无效的注册令牌。":"Invalid registration token.");x(e),b(!1)}}catch(e){console.error("Token validation error:",e),x(e.response?.data?.error||("zh"===n?"验证令牌时出错。请稍后重试。":"Error validating token. Please try again later.")),b(!1)}finally{p(!1)}};e.isReady&&r()},[t,e.isReady,n]);let S=n3[n],[O,C]=(0,f.useState)({businessName:"",ownerName:"",email:"",quoteNumber:"",abn:"",registeredAddress:"",registeredSuburb:"",registeredPostcode:"",registeredState:"",registeredCountry:"Australia",phone:"",messagingAppType:"",messagingAppId:"",notes:""}),[R,E]=(0,f.useState)(""),[N,P]=(0,f.useState)(""),[A,k]=(0,f.useState)(""),[T,I]=(0,f.useState)(""),[F,$]=(0,f.useState)(""),[z,D]=(0,f.useState)(""),[L,B]=(0,f.useState)([]),[U,M]=(0,f.useState)(!1),[q,X]=(0,f.useState)(!1),[W,H]=(0,f.useState)(!1),[G,Y]=(0,f.useState)(null),[J,V]=(0,f.useState)({}),K=e=>0===w.length||w.some(t=>t.id===e),Q=w.filter(e=>!n8.has(e.id)),Z=(e,t)=>{_(r=>({...r,[e]:t}));let r=`custom_${e}`;J[r]&&V(e=>{let t={...e};return delete t[r],t}),G&&Y(null)},ee=e=>{let{name:t,value:r}=e.target;C(e=>({...e,[t]:r})),J[t]&&V(e=>{let r={...e};return delete r[t],r}),G&&Y(null)},et=async e=>{e.preventDefault(),V({}),Y(null);let r={};if(O.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(O.email)||(r.email="en"===n?"Please enter a valid email address":"请输入有效的电子邮箱"):r.email="en"===n?"Email address is required":"电子邮箱为必填项",O.ownerName.trim()||(r.ownerName="en"===n?"Full name is required":"全名为必填项"),O.quoteNumber.trim()||(r.quoteNumber="en"===n?"Quote or invoice number is required":"报价单或发票号码为必填项"),O.businessName.trim()||(r.businessName="en"===n?"Business trading name is required":"公司交易名称为必填项"),O.abn.trim()){let e;e=O.abn.replace(/\s/g,""),/^\d{11}$/.test(e)||(r.abn="en"===n?"ABN must be exactly 11 digits":"ABN 必须为 11 位数字")}else r.abn="en"===n?"ABN is required":"ABN 为必填项";if(O.registeredAddress.trim()||(r.registeredAddress="en"===n?"Street address is required":"街道地址为必填项"),O.registeredSuburb.trim()||(r.registeredSuburb="en"===n?"City/Suburb is required":"城市/郊区为必填项"),O.registeredPostcode.trim()?/^\d{4}$/.test(O.registeredPostcode)||(r.registeredPostcode="en"===n?"Postcode must be exactly 4 digits":"邮政编码必须为 4 位数字"):r.registeredPostcode="en"===n?"Postcode is required":"邮政编码为必填项",O.registeredState||(r.registeredState="en"===n?"Please select a state/territory":"请选择州/领地"),O.registeredCountry||(r.registeredCountry="en"===n?"Please select a country":"请选择国家"),O.phone.trim()){let e;"Australia"!==O.registeredCountry||(e=O.phone.replace(/\s/g,"").replace(/\+61/,"0"),/^04\d{8}$/.test(e))||(r.phone="en"===n?"Please enter a valid Australian mobile (e.g., 04XX XXX XXX or +61 4XX XXX XXX)":"请输入有效的澳大利亚手机号码（例如：04XX XXX XXX 或 +61 4XX XXX XXX）")}else r.phone="en"===n?"Contact phone number is required":"联系电话为必填项";if(R||(r.eftposIntegration="en"===n?"Please select Yes or No":"请选择是或否"),N||(r.alipayOption="en"===n?"Please select an option from the dropdown":"请从下拉列表中选择一个选项"),"other"!==N||A.trim()||(r.alipayOther="en"===n?"Please describe your payment provider":"请描述您的支付提供商"),T.trim()||(r.readyBy="en"===n?"Expected deployment date is required":"预期部署时间为必填项"),F||(r.heardAbout="en"===n?"Please tell us how you heard about us":"请告诉我们您是如何了解我们的"),"other"!==F||z.trim()||(r.heardOther="en"===n?"Please describe how you heard about us":"请描述您是如何了解我们的"),0!==L.length||U||(r.menuUpload="en"===n?"Please upload menu files or check 'I will send it later'":'请上传菜单文件或勾选"我稍后再发送"'),q||(r.terms="en"===n?"You must agree to the terms and conditions before submitting":"提交前您必须同意条款和条件"),Q.forEach(e=>{if(e.required){let t=j[e.id];if(!t||(Array.isArray(t)?0===t.length:""===t.trim())){let t=e.label||e.id.replace(/_/g," ");r[e.id]="en"===n?`${t} is required`:`${t}为必填项`}}}),w.length>0){let e={email:"contact_email",ownerName:"contact_name",phone:"contact_phone",quoteNumber:"quote_number",businessName:"business_name",abn:"abn",registeredAddress:"registered_address",registeredSuburb:"registered_suburb",registeredPostcode:"registered_postcode",registeredState:"registered_state",registeredCountry:"registered_country",eftposIntegration:"eftpos_integration",alipayOption:"alipay_option",alipayOther:"alipay_option",readyBy:"ready_by",heardAbout:"heard_about",heardOther:"heard_about",menuUpload:"menu_files"};Object.keys(r).forEach(t=>{let n=e[t];n&&!K(n)&&delete r[t]})}if(Object.keys(r).length>0){V(r);let e=Object.keys(r).length;Y("en"===n?`Please fix ${e} error${1===e?"":"s"} above before submitting`:`提交前请修正上述 ${e} 个错误`),setTimeout(()=>{let e=document.querySelector(".error");e&&e.scrollIntoView({behavior:"smooth",block:"center"})},100);return}H(!0);try{let e={token:t,contact_email:O.email,contact_name:O.ownerName,contact_phone:O.phone,messaging_app_type:O.messagingAppType||null,messaging_app_id:O.messagingAppId||null,quote_number:O.quoteNumber,business_name:O.businessName,abn:O.abn,registered_address:O.registeredAddress,registered_suburb:O.registeredSuburb,registered_postcode:O.registeredPostcode,registered_state:O.registeredState,registered_country:O.registeredCountry,eftpos_integration:R,alipay_option:N,alipay_other:"other"===N?A:null,ready_by:T,heard_about:F,heard_other:"other"===F?z:null,menu_files:L.map(e=>({filename:e.name,mime_type:e.type})),menu_send_later:U,notes:O.notes,custom_fields:Object.keys(j).length>0?j:void 0};console.log("=== SUBMITTING FORM DATA ==="),console.log("Form Data:",JSON.stringify(e,null,2));let r=await n4.post(`${iV}/registration/submit`,e,{headers:{"Content-Type":"application/json"}});if(console.log("=== API RESPONSE ==="),console.log("Status:",r.status),console.log("Response Data:",JSON.stringify(r.data,null,2)),console.log("Full Response:",r),r.data.success)H(!1),l(!0),setTimeout(()=>{a(!0),l(!1)},600);else throw Error(r.data.error||"Submission failed")}catch(e){H(!1),console.error("=== SUBMISSION ERROR ==="),console.error("Error:",e),console.error("Error Response:",e.response),console.error("Error Status:",e.response?.status),console.error("Error Data:",JSON.stringify(e.response?.data,null,2)),e.response?.status===409?Y("zh"===n?"此令牌已被使用。每个注册链接只能使用一次。":"This token has already been used. Each registration link can only be used once."):e.response?.status===400?Y("zh"===n?"无效或过期的令牌。":"Invalid or expired token."):Y(e.response?.data?.error||("zh"===n?"提交失败。请稍后重试。":"Submission failed. Please try again later."))}};return(f.default.useEffect(()=>{let e=e=>{e.target.closest("[data-lang-dropdown]")||c(!1)};if(d)return document.addEventListener("click",e),()=>document.removeEventListener("click",e)},[d]),o)?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(ih,{}),(0,h.jsx)(ig,{className:"slide-in",children:(0,h.jsx)(tL,{lang:n})})]}):e.isReady&&t?u?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(ih,{}),(0,h.jsx)(ig,{children:(0,h.jsx)(im,{children:(0,h.jsxs)(io,{children:[(0,h.jsx)(ip,{}),(0,h.jsx)(id,{$type:"loading",children:"zh"===n?"验证注册链接":"Validating Registration Link"}),(0,h.jsx)(ic,{children:"zh"===n?"请稍候，我们正在验证您的注册令牌...":"Please wait while we verify your registration token..."})]})})})]}):!m||y?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(ih,{}),(0,h.jsx)(ig,{children:(0,h.jsx)(im,{children:(0,h.jsxs)(io,{children:[(0,h.jsxs)(ia,{children:[(0,h.jsx)(is,{}),(0,h.jsxs)(il,{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[(0,h.jsx)("path",{d:"M12 2L2 20h20L12 2z",fill:"#FFA500",stroke:"#FF6B00",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,h.jsx)("path",{d:"M12 9v4M12 17h.01",stroke:"#FFFFFF",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round"})]})]}),(0,h.jsx)(id,{$type:"error",children:"zh"===n?"无效的注册链接":"Invalid Registration Link"}),(0,h.jsx)(ic,{children:y}),(0,h.jsx)(iu,{children:"zh"===n?"如果您认为这是错误，请联系管理员获取新的注册链接。":"If you believe this is an error, please contact the admin for a new registration link."})]})})})]}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(ih,{}),(0,h.jsx)(ig,{className:s?"slide-out":"",children:(0,h.jsx)(im,{children:(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(ib,{children:[(0,h.jsx)(iw,{children:(0,h.jsxs)(iB,{"data-lang-dropdown":!0,children:[(0,h.jsxs)(iU,{onClick:()=>c(!d),children:[(0,h.jsx)(iX,{}),(0,h.jsx)("span",{children:"en"===n?"EN":"中文"}),(0,h.jsx)(iW,{open:d})]}),(0,h.jsxs)(iM,{$show:d,children:[(0,h.jsx)(iq,{$active:"en"===n,onClick:()=>{i("en"),c(!1)},children:"🇦🇺 English"}),(0,h.jsx)(iq,{$active:"zh"===n,onClick:()=>{i("zh"),c(!1)},children:"🇨🇳 中文"})]})]})}),(0,h.jsxs)(iy,{children:[(0,h.jsx)(tB.default,{src:"/logos/vend88.png",alt:"Vend88",width:150,height:50,style:{height:"50px",width:"auto",maxWidth:"40vw"},onError:()=>console.error("Vend88 logo failed to load")}),(0,h.jsx)(ix,{}),(0,h.jsx)(tB.default,{src:"/logos/pospal.png",alt:"PosPal",width:180,height:70,style:{height:"70px",width:"auto",maxWidth:"40vw"},onError:()=>console.error("PosPal logo failed to load")})]}),(0,h.jsx)(iv,{children:S.onboarding.title}),(0,h.jsx)(ij,{children:"en"===n?"Please fill out this registration form to begin your onboarding process":"请填写此注册表以开始您的入驻流程"})]}),(0,h.jsxs)(i_,{children:[(0,h.jsxs)(iS,{onSubmit:et,children:[(0,h.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:[(0,h.jsxs)(iO,{style:{display:K("contact_email")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.email," *"]}),(0,h.jsx)(iR,{className:J.email?"error":"",type:"email",name:"email",value:O.email,onChange:ee,placeholder:S.onboarding.emailPlaceholder}),J.email&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.email]})]}),(0,h.jsxs)(iO,{style:{display:K("contact_name")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.fullName," *"]}),(0,h.jsx)(iR,{className:J.ownerName?"error":"",name:"ownerName",value:O.ownerName,onChange:ee,placeholder:S.onboarding.fullNamePlaceholder}),J.ownerName&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.ownerName]})]}),(0,h.jsxs)(iO,{style:{display:K("contact_phone")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.phone," *"]}),(0,h.jsx)(iR,{className:J.phone?"error":"",name:"phone",value:O.phone,onChange:ee,placeholder:S.onboarding.phonePlaceholder,type:"tel"}),J.phone&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.phone]}),(0,h.jsx)("div",{style:{fontSize:11,color:"#789",marginTop:4},children:"en"===n?"Australian mobile: 04XX XXX XXX or +61 4XX XXX XXX":"澳大利亚手机: 04XX XXX XXX 或 +61 4XX XXX XXX"})]}),(0,h.jsxs)(iO,{style:{display:K("messaging_app_type")?void 0:"none"},children:[(0,h.jsx)(iC,{children:"en"===n?"Messaging App Contact (Optional)":"即时通讯联系方式（可选）"}),(0,h.jsxs)(iN,{name:"messagingAppType",value:O.messagingAppType||"",onChange:ee,children:[(0,h.jsx)("option",{value:"",children:"en"===n?"-- Select app --":"-- 选择应用 --"}),(0,h.jsx)("option",{value:"wechat",children:"en"===n?"WeChat ID":"微信号"}),(0,h.jsx)("option",{value:"whatsapp",children:"en"===n?"WhatsApp Number":"WhatsApp 号码"})]}),O.messagingAppType&&(0,h.jsx)(iR,{name:"messagingAppId",value:O.messagingAppId||"",onChange:ee,placeholder:"wechat"===O.messagingAppType?"en"===n?"Enter your WeChat ID":"输入您的微信号":"en"===n?"Enter your WhatsApp number":"输入您的 WhatsApp 号码",style:{marginTop:8}}),(0,h.jsx)("div",{style:{fontSize:11,color:"#789",marginTop:4},children:"en"===n?"Provide an alternative way for us to reach you":"提供其他联系方式以便我们与您联系"})]}),(0,h.jsxs)(iO,{style:{display:K("quote_number")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.quoteNumber," *"]}),(0,h.jsx)(iR,{className:J.quoteNumber?"error":"",name:"quoteNumber",value:O.quoteNumber,onChange:ee,placeholder:S.onboarding.quoteNumberPlaceholder}),J.quoteNumber&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.quoteNumber]})]}),(0,h.jsxs)(iO,{style:{display:K("business_name")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.businessName," *"]}),(0,h.jsx)(iR,{className:J.businessName?"error":"",name:"businessName",value:O.businessName,onChange:ee,placeholder:S.onboarding.businessNamePlaceholder}),J.businessName&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.businessName]}),(0,h.jsx)("div",{style:{fontSize:12,color:"#567",marginTop:6},children:S.onboarding.businessNameHint})]}),(0,h.jsxs)(iO,{style:{display:K("abn")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.abn," *"]}),(0,h.jsx)(iR,{className:J.abn?"error":"",name:"abn",value:O.abn,onChange:ee,placeholder:S.onboarding.abnPlaceholder}),J.abn&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.abn]}),(0,h.jsx)("div",{style:{fontSize:11,color:"#789",marginTop:4},children:"en"===n?"11-digit number":"11 位数字"})]}),(0,h.jsx)("div",{style:{fontSize:"12px",color:"#567",marginBottom:"8px",display:K("registered_address")||K("registered_suburb")||K("registered_postcode")||K("registered_state")||K("registered_country")?void 0:"none"},children:S.onboarding.storeAddressHint}),(0,h.jsxs)(iO,{style:{display:K("registered_address")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:["en"===n?"Street Address":"街道地址"," *"]}),(0,h.jsx)(iR,{className:J.registeredAddress?"error":"",name:"registeredAddress",value:O.registeredAddress,onChange:ee,placeholder:"en"===n?"e.g., 123 Main Street":"例如：123 主街"}),J.registeredAddress&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.registeredAddress]})]}),(0,h.jsxs)(iO,{style:{display:K("registered_suburb")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:["en"===n?"City / Suburb":"城市/郊区"," *"]}),(0,h.jsx)(iR,{className:J.registeredSuburb?"error":"",name:"registeredSuburb",value:O.registeredSuburb,onChange:ee,placeholder:"en"===n?"e.g., Sydney":"例如：悉尼"}),J.registeredSuburb&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.registeredSuburb]})]}),(0,h.jsxs)("div",{style:{display:K("registered_postcode")||K("registered_state")?"grid":"none",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},className:"mobile-stack",children:[(0,h.jsxs)(iO,{children:[(0,h.jsxs)(iC,{children:["en"===n?"Postcode":"邮政编码"," *"]}),(0,h.jsx)(iR,{className:J.registeredPostcode?"error":"",name:"registeredPostcode",value:O.registeredPostcode,onChange:ee,placeholder:"en"===n?"e.g., 2000":"例如：2000",maxLength:4}),J.registeredPostcode&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.registeredPostcode]})]}),(0,h.jsxs)(iO,{children:[(0,h.jsxs)(iC,{children:[S.onboarding.registeredState," *"]}),(0,h.jsxs)(iN,{className:J.registeredState?"error":"",name:"registeredState",value:O.registeredState,onChange:ee,children:[(0,h.jsx)("option",{value:"",children:S.onboarding.registeredStatePlaceholder}),(0,h.jsx)("option",{value:"NSW",children:"NSW"}),(0,h.jsx)("option",{value:"VIC",children:"VIC"}),(0,h.jsx)("option",{value:"QLD",children:"QLD"}),(0,h.jsx)("option",{value:"WA",children:"WA"}),(0,h.jsx)("option",{value:"SA",children:"SA"}),(0,h.jsx)("option",{value:"TAS",children:"TAS"}),(0,h.jsx)("option",{value:"ACT",children:"ACT"}),(0,h.jsx)("option",{value:"NT",children:"NT"})]}),J.registeredState&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.registeredState]})]})]}),(0,h.jsxs)(iO,{style:{display:K("registered_country")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.registeredCountry," *"]}),(0,h.jsx)(iN,{className:J.registeredCountry?"error":"",name:"registeredCountry",value:O.registeredCountry,onChange:ee,children:(0,h.jsx)("option",{value:"Australia",children:"Australia"})}),J.registeredCountry&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.registeredCountry]})]}),(0,h.jsxs)(iO,{style:{display:K("eftpos_integration")?void 0:"none"},children:[(0,h.jsxs)(iH,{children:[(0,h.jsxs)(iG,{children:[(0,h.jsx)(iY,{children:(0,h.jsx)(tB.default,{src:"/pictures/tyro-card.png",alt:"Tyro Card Terminal",fill:!0,style:{objectFit:"cover"}})}),(0,h.jsx)(iJ,{children:"en"===n?"Tyro Card Terminal":"Tyro 刷卡终端"})]}),(0,h.jsxs)(iG,{children:[(0,h.jsx)(iY,{children:(0,h.jsx)(tB.default,{src:"/pictures/tyro-payments.png",alt:"Tyro Payment Process",fill:!0,style:{objectFit:"cover"}})}),(0,h.jsx)(iJ,{children:"en"===n?"Payment Process":"支付流程"})]})]}),(0,h.jsxs)(iC,{children:[S.onboarding.eftposIntegration," *"]}),(0,h.jsxs)("div",{style:{display:"flex",gap:12,marginTop:6,paddingLeft:4},children:[(0,h.jsxs)("label",{style:{cursor:"pointer"},children:[(0,h.jsx)("input",{type:"radio",name:"eftpos",checked:"yes"===R,onChange:()=>{E("yes"),J.eftposIntegration&&V(e=>{let t={...e};return delete t.eftposIntegration,t})}})," ","en"===n?"Yes":"是"]}),(0,h.jsxs)("label",{style:{cursor:"pointer"},children:[(0,h.jsx)("input",{type:"radio",name:"eftpos",checked:"no"===R,onChange:()=>{E("no"),J.eftposIntegration&&V(e=>{let t={...e};return delete t.eftposIntegration,t})}})," ","en"===n?"No":"否"]})]}),J.eftposIntegration&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.eftposIntegration]}),(0,h.jsx)("div",{style:{fontSize:12,color:"#567",marginTop:6},children:S.onboarding.eftposHint})]}),(0,h.jsx)(iO,{style:{display:K("alipay_option")?void 0:"none"},children:(0,h.jsxs)(iH,{children:[(0,h.jsxs)(iG,{children:[(0,h.jsx)(iY,{children:(0,h.jsx)(tB.default,{src:"/pictures/alipay-payment.png",alt:"Alipay Payment",fill:!0,style:{objectFit:"cover"}})}),(0,h.jsx)(iJ,{children:"en"===n?"Alipay Payment":"支付宝支付"})]}),(0,h.jsxs)(iG,{children:[(0,h.jsx)(iY,{children:(0,h.jsx)(tB.default,{src:"/pictures/wechat-payment.png",alt:"WeChat Pay",fill:!0,style:{objectFit:"cover"}})}),(0,h.jsx)(iJ,{children:"en"===n?"WeChat Pay":"微信支付"})]})]})}),(0,h.jsxs)(iO,{style:{display:K("alipay_option")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.alipayPayment," *"]}),(0,h.jsxs)(iN,{className:J.alipayOption?"error":"",value:N,onChange:e=>{P(e.target.value),J.alipayOption&&V(e=>{let t={...e};return delete t.alipayOption,t})},children:[(0,h.jsx)("option",{value:"",children:"-- select --"}),(0,h.jsx)("option",{value:"open",children:S.onboarding.alipayOpen}),(0,h.jsx)("option",{value:"not-interested",children:S.onboarding.alipayNotInterested}),(0,h.jsx)("option",{value:"superpay",children:S.onboarding.alipaySuperpay}),(0,h.jsx)("option",{value:"royalpay",children:S.onboarding.alipayRoyalpay}),(0,h.jsx)("option",{value:"other",children:S.onboarding.alipayOther})]}),J.alipayOption&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.alipayOption]}),"other"===N&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(iR,{className:J.alipayOther?"error":"",name:"alipayOther",value:A,onChange:e=>{k(e.target.value),J.alipayOther&&V(e=>{let t={...e};return delete t.alipayOther,t})},placeholder:"en"===n?"Please describe":"请描述",style:{marginTop:8}}),J.alipayOther&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.alipayOther]})]})]}),(0,h.jsxs)(iO,{style:{display:K("ready_by")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.readyBy," *"]}),(0,h.jsx)(iE,{className:J.readyBy?"error":"",name:"readyBy",value:T,onChange:e=>{I(e.target.value),J.readyBy&&V(e=>{let t={...e};return delete t.readyBy,t})},placeholder:S.onboarding.readyByPlaceholder}),J.readyBy&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.readyBy]}),(0,h.jsx)("div",{style:{fontSize:12,color:"#567",marginTop:6},children:S.onboarding.readyByHint})]}),(0,h.jsxs)(iO,{style:{display:K("heard_about")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.heardAbout," *"]}),(0,h.jsxs)(iN,{className:J.heardAbout?"error":"",value:F,onChange:e=>{$(e.target.value),J.heardAbout&&V(e=>{let t={...e};return delete t.heardAbout,t})},children:[(0,h.jsx)("option",{value:"",children:"-- select --"}),(0,h.jsx)("option",{value:"friend",children:S.onboarding.heardFriend}),(0,h.jsx)("option",{value:"google",children:S.onboarding.heardGoogle}),(0,h.jsx)("option",{value:"wechat",children:S.onboarding.heardWechat}),(0,h.jsx)("option",{value:"saw",children:S.onboarding.heardSaw}),(0,h.jsx)("option",{value:"other",children:S.onboarding.heardOther})]}),J.heardAbout&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.heardAbout]}),"other"===F&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(iR,{className:J.heardOther?"error":"",name:"heardOther",value:z,onChange:e=>{D(e.target.value),J.heardOther&&V(e=>{let t={...e};return delete t.heardOther,t})},placeholder:"en"===n?"Please describe":"请描述",style:{marginTop:8}}),J.heardOther&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.heardOther]})]})]}),(0,h.jsxs)(iO,{style:{display:K("menu_files")?void 0:"none"},children:[(0,h.jsxs)(iC,{children:[S.onboarding.menuUpload," *"]}),(0,h.jsx)("div",{style:{fontSize:12,color:"#567",marginBottom:8},children:S.onboarding.menuUploadHint}),(0,h.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:8},children:[(0,h.jsxs)(iA,{className:U?"disabled":"",children:[(0,h.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[(0,h.jsx)("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),(0,h.jsx)("polyline",{points:"17 8 12 3 7 8"}),(0,h.jsx)("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),"en"===n?"Choose Files":"选择文件",(0,h.jsx)("input",{type:"file",accept:".pdf,.doc,.docx,.xls,.xlsx",onChange:e=>{if(e.target.files&&e.target.files.length>0){let t=Array.from(e.target.files);B(e=>[...e,...t]),M(!1),J.menuUpload&&V(e=>{let t={...e};return delete t.menuUpload,t})}},disabled:U,multiple:!0})]}),(0,h.jsx)("div",{style:{fontSize:11,color:"#789",fontStyle:"italic"},children:S.onboarding.multipleFilesNote}),L.length>0&&(0,h.jsx)(ik,{children:L.map((e,t)=>(0,h.jsxs)(iT,{children:[(0,h.jsxs)("span",{children:["📄 ",e.name]}),(0,h.jsx)(iI,{onClick:()=>{B(e=>e.filter((e,r)=>r!==t))},children:"✕"})]},t))}),(0,h.jsxs)("label",{style:{display:"flex",alignItems:"center",gap:8},children:[(0,h.jsx)("input",{type:"checkbox",checked:U,onChange:e=>{M(e.target.checked),e.target.checked&&B([]),J.menuUpload&&V(e=>{let t={...e};return delete t.menuUpload,t})}}),(0,h.jsx)("span",{style:{fontSize:14},children:S.onboarding.menuSendLater})]}),J.menuUpload&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.menuUpload]})]}),(0,h.jsx)("div",{style:{fontSize:11,color:"#567",marginTop:6},children:S.onboarding.menuContactInfo})]}),(0,h.jsxs)(iO,{style:{display:K("notes")?void 0:"none"},children:[(0,h.jsx)(iC,{children:S.onboarding.notes}),(0,h.jsx)(iE,{name:"notes",value:O.notes,onChange:ee,placeholder:S.onboarding.notesPlaceholder})]}),Q.length>0&&Q.map(e=>{let t=e.id,r=e.label||t.replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase()),i=e.required,o=j[t]??"";return(0,h.jsxs)(iO,{children:[(0,h.jsxs)(iC,{children:[r,i?" *":""]}),"textarea"===e.type?(0,h.jsx)(iE,{value:"string"==typeof o?o:"",onChange:e=>Z(t,e.target.value),placeholder:r}):"select"===e.type&&e.options?(0,h.jsxs)(iN,{value:"string"==typeof o?o:"",onChange:e=>Z(t,e.target.value),children:[(0,h.jsx)("option",{value:"",children:"zh"===n?"请选择...":"Please select..."}),e.options.map(e=>(0,h.jsx)("option",{value:e,children:e},e))]}):"multiple_choice"===e.type&&e.options?(0,h.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:6},children:e.options.map(r=>{let n=Array.isArray(o)?o:[],i="multiple"===e.choiceMode;return(0,h.jsxs)("label",{style:{display:"flex",alignItems:"center",gap:8,cursor:"pointer"},children:[(0,h.jsx)("input",{type:i?"checkbox":"radio",name:t,checked:i?n.includes(r):o===r,onChange:()=>{i?Z(t,n.includes(r)?n.filter(e=>e!==r):[...n,r]):Z(t,r)}}),(0,h.jsx)("span",{children:r})]},r)})}):(0,h.jsx)(iR,{type:"number"===e.type?"number":"date"===e.type?"date":"email"===e.type?"email":"text",value:"string"==typeof o?o:"",onChange:e=>Z(t,e.target.value),placeholder:r}),J[t]&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J[t]]})]},t)})]}),(0,h.jsxs)(iO,{children:[(0,h.jsxs)("label",{style:{display:"flex",alignItems:"center",gap:8},children:[(0,h.jsx)("input",{type:"checkbox",checked:q,onChange:e=>{X(e.target.checked),J.terms&&V(e=>{let t={...e};return delete t.terms,t})}}),(0,h.jsxs)("span",{children:[S.onboarding.termsAgreed," *"]})]}),J.terms&&(0,h.jsxs)(iP,{children:[(0,h.jsx)("span",{children:"⚠"}),J.terms]})]}),(0,h.jsxs)(i$,{style:{marginBottom:"1rem"},children:[(0,h.jsx)(iC,{children:S.onboarding.helpTitle}),(0,h.jsx)("div",{style:{color:"#567",fontSize:"0.95rem",marginTop:6},children:S.onboarding.helpText})]}),(0,h.jsxs)(iD,{children:[(0,h.jsx)(iz,{type:"submit",disabled:W,children:W?(0,h.jsx)("span",{children:S.onboarding.sending}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("span",{children:S.onboarding.submit}),(0,h.jsx)("span",{style:{marginLeft:"8px"},children:"→"})]})}),!W&&q&&(0,h.jsxs)(iL,{children:[(0,h.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:(0,h.jsx)("path",{d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})}),"en"===n?"Ready to submit":"准备提交"]}),G&&(0,h.jsxs)(iP,{style:{justifyContent:"center",marginTop:0},children:[(0,h.jsx)("span",{children:"⚠"}),G]})]})]}),(0,h.jsx)(iF,{})]})]})})})]}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(ih,{}),(0,h.jsx)(ig,{})]})}],68103)},70595,(e,t,r)=>{"use strict";e.i(14726),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return d}});let n=e.r(85274),i=e.r(40248),o=e.r(20786),a=["-moz-initial","fill","none","scale-down",void 0];function s(e){return void 0!==e.default}function l(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function d({src:e,sizes:t,unoptimized:r=!1,priority:c=!1,preload:u=!1,loading:p,className:h,quality:f,width:g,height:m,fill:b=!1,style:y,overrideSrc:x,onLoad:w,onLoadingComplete:v,placeholder:j="empty",blurDataURL:_,fetchPriority:S,decoding:O="async",layout:C,objectFit:R,objectPosition:E,lazyBoundary:N,lazyRoot:P,...A},k){var T;let I,F,$,{imgConf:z,showAltText:D,blurComplete:L,defaultLoader:B}=k,U=z||o.imageConfigDefault;if("allSizes"in U)I=U;else{let e=[...U.deviceSizes,...U.imageSizes].sort((e,t)=>e-t),t=U.deviceSizes.sort((e,t)=>e-t),r=U.qualities?.sort((e,t)=>e-t);I={...U,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===B)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let M=A.loader||B;delete A.loader,delete A.srcSet;let q="__next_img_default"in M;if(q){if("custom"===I.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=M;M=t=>{let{config:r,...n}=t;return e(n)}}if(C){"fill"===C&&(b=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[C];e&&(y={...y,...e});let r={responsive:"100vw",fill:"100vw"}[C];r&&!t&&(t=r)}let X="",W=l(g),H=l(m);if((T=e)&&"object"==typeof T&&(s(T)||void 0!==T.src)){let t=s(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(F=t.blurWidth,$=t.blurHeight,_=_||t.blurDataURL,X=t.src,!b)if(W||H){if(W&&!H){let e=W/t.width;H=Math.round(t.height*e)}else if(!W&&H){let e=H/t.height;W=Math.round(t.width*e)}}else W=t.width,H=t.height}let G=!c&&!u&&("lazy"===p||void 0===p);(!(e="string"==typeof e?e:X)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,G=!1),I.unoptimized&&(r=!0),q&&!I.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let Y=l(f),J=Object.assign(b?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:R,objectPosition:E}:{},D?{}:{color:"transparent"},y),V=L||"empty"===j?null:"blur"===j?`url("data:image/svg+xml;charset=utf-8,${(0,i.getImageBlurSvg)({widthInt:W,heightInt:H,blurWidth:F,blurHeight:$,blurDataURL:_||"",objectFit:J.objectFit})}")`:`url("${j}")`,K=a.includes(J.objectFit)?"fill"===J.objectFit?"100% 100%":"cover":J.objectFit,Q=V?{backgroundSize:K,backgroundPosition:J.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:V}:{},Z=function({config:e,src:t,unoptimized:r,width:i,quality:o,sizes:a,loader:s}){if(r){if(t.startsWith("/")&&!t.startsWith("//")){let e=(0,n.getDeploymentId)();if(t.includes("/_next/static/immutable")&&!(0,n.getAssetToken)())e=void 0;else if(e){let r=t.indexOf("?");if(-1!==r){let n=new URLSearchParams(t.slice(r+1));n.get("dpl")||(n.append("dpl",e),t=t.slice(0,r)+"?"+n.toString())}else t+=`?dpl=${e}`}}return{src:t,srcSet:void 0,sizes:void 0}}let{widths:l,kind:d}=function({deviceSizes:e,allSizes:t},r,n){if(n){let r=/(^|\s)(1?\d?\d)vw/g,i=[];for(let e;e=r.exec(n);)i.push(parseInt(e[2]));if(i.length){let r=.01*Math.min(...i);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,i,a),c=l.length-1;return{sizes:a||"w"!==d?a:"100vw",srcSet:l.map((r,n)=>`${s({config:e,src:t,quality:o,width:r})} ${"w"===d?r:n+1}${d}`).join(", "),src:s({config:e,src:t,quality:o,width:l[c]})}}({config:I,src:e,unoptimized:r,width:W,quality:Y,sizes:t,loader:M}),ee=G?"lazy":p;return{props:{...A,loading:ee,fetchPriority:S,width:W,height:H,decoding:O,className:h,style:{...J,...Q},sizes:Z.sizes,srcSet:Z.srcSet,src:x||Z.src},meta:{unoptimized:r,preload:u||c,placeholder:j,fill:b}}}},40248,(e,t,r)=>{"use strict";function n({widthInt:e,heightInt:t,blurWidth:r,blurHeight:i,blurDataURL:o,objectFit:a}){let s=r?40*r:e,l=i?40*i:t,d=s&&l?`viewBox='0 0 ${s} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${d}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${d?"none":"contain"===a?"xMidYMid":"cover"===a?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${o}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return n}})},7599,(e,t,r)=>{t.exports=e.r(42895)},46522,(e,t,r)=>{t.exports=e.r(92845)},38936,(e,t,r)=>{t.exports={welcome:"Welcome",login:{title:"Login",username:"Username",password:"Password",submit:"Login"},dashboard:{title:"Dashboard",greeting:"Hello",statistics:"Statistics",recentActivities:"Recent Activities"},errors:{network:"Network error. Please try again.",unauthorized:"Unauthorized access."},footer:{copyright:"© 2025 All rights reserved."},onboarding:{title:"Registration Form",email:"Email Address",emailPlaceholder:"your.email@company.com",fullName:"Full Name",fullNamePlaceholder:"John Smith",quoteNumber:"Quote or Invoice Number",quoteNumberPlaceholder:"Q-12345 / INV-001",businessName:"Business Trading Name",businessNamePlaceholder:"Trading name shown on receipts",businessNameHint:"This will be used to register your account and will appear on receipts generated from the POS terminal.",abn:"ABN (Australian Business Number)",abnPlaceholder:"12 345 678 901",registeredAddress:"Trading / Registered Address",registeredAddressPlaceholder:"Registered business address",registeredState:"State / Territory",registeredStatePlaceholder:"-- Select state --",registeredCountry:"Country",storeAddressHint:"Your store address will be displayed on receipts",phone:"Best Contact Phone Number",phonePlaceholder:"+61 4XX XXX XXX",eftposIntegration:"Do you need an EFTPOS terminal with Tyro integration?",eftposHint:"We currently integrate with Tyro Eftpos terminals. Select 'Yes' if you'd like to integrate or register with Tyro, and we'll contact you to assist with the process.",alipayPayment:"Do you plan to enable Alipay / WeChat Pay?",alipayOpen:"I don't have an account and would like to open one",alipayNotInterested:"Not interested",alipaySuperpay:"I currently use Superpay",alipayRoyalpay:"I currently use Royalpay",alipayOther:"Other payment provider",readyBy:"Expected Deployment Date",readyByPlaceholder:"Approximate deployment date or timeline",readyByHint:"If your service includes on-site setup and menu configuration, we typically require 2 weeks lead time before deployment. Large custom hardware orders may require additional time.",menuUpload:"Menu or Product List Upload",menuUploadHint:"If your menu or product list is ready, please upload it in PDF, Word, or Excel format.",multipleFilesNote:"Note: You can upload multiple files",menuSendLater:"I will send it later",menuContactInfo:"No worries if you're not ready yet. When available, please provide it at least 1-2 weeks before POS terminal deployment. Send to purchasing@pospal.com.au or via your preferred method (e.g., WeChat) to your account manager.",heardAbout:"How did you hear about us?",heardFriend:"Friend referral",heardGoogle:"Google search",heardWechat:"WeChat",heardSaw:"Saw our POS at another store",heardOther:"Other source",notes:"Additional Notes",notesPlaceholder:"Anything else we should know?",termsAgreed:"I agree to the terms and conditions",submit:"Submit",sending:"Sending...",submitSuccess:"Form submitted successfully!",submitError:"Submission failed. Please try again.",helpTitle:"Need Help?",helpText:"Contact customer service at purchasing@pospal.com.au",registeredAddressGroup:"Registered Business Address"},logos:{vend88:"/logos/vend88.png",pospal:"/logos/pospal.png"}}},34454,(e,t,r)=>{t.exports={welcome:"欢迎",login:{title:"登录",username:"用户名",password:"密码",submit:"登录"},dashboard:{title:"仪表板",greeting:"您好",statistics:"统计数据",recentActivities:"最近活动"},errors:{network:"网络错误,请重试。",unauthorized:"未授权访问。"},footer:{copyright:"© 2025 版权所有。"},onboarding:{title:"注册表格",email:"电子邮箱",emailPlaceholder:"你的邮箱@公司.com",fullName:"您的全名",fullNamePlaceholder:"张三",quoteNumber:"报价单或发票号码",quoteNumberPlaceholder:"Q-12345 / INV-001",businessName:"公司交易名称",businessNamePlaceholder:"显示在收据上的交易名称",businessNameHint:"这将用于注册您的账户,并显示在 POS 终端生成的收据上。",abn:"ABN（澳大利亚商业号码）",abnPlaceholder:"12 345 678 901",registeredAddress:"交易/注册地址",registeredAddressPlaceholder:"注册营业地址",registeredState:"州/领地",registeredStatePlaceholder:"-- 选择州 --",registeredCountry:"国家",storeAddressHint:"您的店铺地址位置将用于显示在收据上",phone:"最佳联系电话",phonePlaceholder:"+61 4XX XXX XXX",eftposIntegration:"是否需要 EFTPOS 终端并与 Tyro 集成?",eftposHint:'我们目前已集成 Tyro Eftpos 终端。如果您希望集成或注册 Tyro,请选择"是",我们将联系您协助此过程。',alipayPayment:"是否计划开通支付宝/微信支付?",alipayOpen:"我目前没有支付宝/微信支付账户,希望开通一个。",alipayNotInterested:"我不感兴趣。",alipaySuperpay:"我目前使用 Superpay。",alipayRoyalpay:"我目前使用 Royalpay。",alipayOther:"其他",readyBy:"预期部署时间",readyByPlaceholder:"大致部署日期或时间表",readyByHint:"如果您的服务包含现场服务和菜单设置,通常我们需要在部署前 2 周准备。大量定制硬件订单可能需要更长时间。",menuUpload:"菜单或产品清单上传",menuUploadHint:"如果您的菜单或产品清单已准备好,请以 PDF、Word 或 Excel 格式上传。",multipleFilesNote:"注意：您可以上传多个文件",menuSendLater:"我稍后再发送",menuContactInfo:"如果您现在还没有准备好也没关系。当您准备好后,请在 POS 终端部署前至少 1-2 周提供给我们。请发送至 purchasing@pospal.com.au 或通过首选方式(例如微信)发送给您的客户经理。",heardAbout:"您是如何了解我们的?",heardFriend:"朋友推荐",heardGoogle:"谷歌搜索",heardWechat:"微信",heardSaw:"在其他商店看到我们的 POS",heardOther:"其他",notes:"备注信息",notesPlaceholder:"还有什么我们应该知道的吗?",termsAgreed:"我同意条款和条件中规定的使用条款",submit:"提交",sending:"发送中...",submitSuccess:"表单提交成功!",submitError:"提交失败,请重试。",helpTitle:"需要帮助?",helpText:"请联系客服 purchasing@pospal.com.au",registeredAddressGroup:"注册营业地址"}}}]);