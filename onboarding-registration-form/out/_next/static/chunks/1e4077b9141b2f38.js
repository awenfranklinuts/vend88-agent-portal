(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,7599,(e,t,r)=>{t.exports=e.r(42895)},46522,(e,t,r)=>{t.exports=e.r(92845)},23584,(e,t,r)=>{t.exports=function(e,t,r,n){var i=r?r.call(n,e,t):void 0;if(void 0!==i)return!!i;if(e===t)return!0;if("object"!=typeof e||!e||"object"!=typeof t||!t)return!1;var o=Object.keys(e),a=Object.keys(t);if(o.length!==a.length)return!1;for(var s=Object.prototype.hasOwnProperty.bind(t),l=0;l<o.length;l++){var c=o[l];if(!s(c))return!1;var d=e[c],u=t[c];if(!1===(i=r?r.call(n,d,u,c):void 0)||void 0===i&&d!==u)return!1}return!0}},40248,(e,t,r)=>{"use strict";function n({widthInt:e,heightInt:t,blurWidth:r,blurHeight:n,blurDataURL:i,objectFit:o}){let a=r?40*r:e,s=n?40*n:t,l=a&&s?`viewBox='0 0 ${a} ${s}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${l}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${l?"none":"contain"===o?"xMidYMid":"cover"===o?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${i}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return n}})},70595,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return l}}),e.r(62404);let n=e.r(40248),i=e.r(20786),o=["-moz-initial","fill","none","scale-down",void 0];function a(e){return void 0!==e.default}function s(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function l({src:e,sizes:t,unoptimized:r=!1,priority:l=!1,preload:c=!1,loading:d,className:u,quality:f,width:p,height:h,fill:g=!1,style:m,overrideSrc:b,onLoad:y,onLoadingComplete:x,placeholder:v="empty",blurDataURL:w,fetchPriority:j,decoding:S="async",layout:E,objectFit:C,objectPosition:O,lazyBoundary:_,lazyRoot:A,...N},R){var k;let I,P,T,{imgConf:F,showAltText:B,blurComplete:z,defaultLoader:$}=R,L=F||i.imageConfigDefault;if("allSizes"in L)I=L;else{let e=[...L.deviceSizes,...L.imageSizes].sort((e,t)=>e-t),t=L.deviceSizes.sort((e,t)=>e-t),r=L.qualities?.sort((e,t)=>e-t);I={...L,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===$)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let U=N.loader||$;delete N.loader,delete N.srcSet;let D="__next_img_default"in U;if(D){if("custom"===I.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=U;U=t=>{let{config:r,...n}=t;return e(n)}}if(E){"fill"===E&&(g=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[E];e&&(m={...m,...e});let r={responsive:"100vw",fill:"100vw"}[E];r&&!t&&(t=r)}let M="",X=s(p),q=s(h);if((k=e)&&"object"==typeof k&&(a(k)||void 0!==k.src)){let t=a(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(P=t.blurWidth,T=t.blurHeight,w=w||t.blurDataURL,M=t.src,!g)if(X||q){if(X&&!q){let e=X/t.width;q=Math.round(t.height*e)}else if(!X&&q){let e=q/t.height;X=Math.round(t.width*e)}}else X=t.width,q=t.height}let W=!l&&!c&&("lazy"===d||void 0===d);(!(e="string"==typeof e?e:M)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,W=!1),I.unoptimized&&(r=!0),D&&!I.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let Y=s(f),H=Object.assign(g?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:C,objectPosition:O}:{},B?{}:{color:"transparent"},m),G=z||"empty"===v?null:"blur"===v?`url("data:image/svg+xml;charset=utf-8,${(0,n.getImageBlurSvg)({widthInt:X,heightInt:q,blurWidth:P,blurHeight:T,blurDataURL:w||"",objectFit:H.objectFit})}")`:`url("${v}")`,J=o.includes(H.objectFit)?"fill"===H.objectFit?"100% 100%":"cover":H.objectFit,V=G?{backgroundSize:J,backgroundPosition:H.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:G}:{},K=function({config:e,src:t,unoptimized:r,width:n,quality:i,sizes:o,loader:a}){if(r)return{src:t,srcSet:void 0,sizes:void 0};let{widths:s,kind:l}=function({deviceSizes:e,allSizes:t},r,n){if(n){let r=/(^|\s)(1?\d?\d)vw/g,i=[];for(let e;e=r.exec(n);)i.push(parseInt(e[2]));if(i.length){let r=.01*Math.min(...i);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,n,o),c=s.length-1;return{sizes:o||"w"!==l?o:"100vw",srcSet:s.map((r,n)=>`${a({config:e,src:t,quality:i,width:r})} ${"w"===l?r:n+1}${l}`).join(", "),src:a({config:e,src:t,quality:i,width:s[c]})}}({config:I,src:e,unoptimized:r,width:X,quality:Y,sizes:t,loader:U}),Q=W?"lazy":d;return{props:{...N,loading:Q,fetchPriority:j,width:X,height:q,decoding:S,className:u,style:{...H,...V},sizes:K.sizes,srcSet:K.srcSet,src:b||K.src},meta:{unoptimized:r,preload:c||l,placeholder:v,fill:g}}}},49190,(e,t,r)=>{"use strict";function n(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,0):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return n}})},21787,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return o}});let n=e.r(49190);function i({config:e,src:t,width:r,quality:i}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let o=(0,n.findClosestQuality)(i,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${o}${t.startsWith("/_next/static/media/"),""}`}i.__next_img_default=!0;let o=i},15840,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return i}});let n=e.r(68086);function i(e,t){let r=(0,n.useRef)(null),i=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(r.current=o(e,n)),t&&(i.current=o(t,n))},[e,t])}function o(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},15048,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return v}});let n=e.r(30322),i=e.r(54689),o=e.r(29196),a=i._(e.r(68086)),s=n._(e.r(15421)),l=n._(e.r(42895)),c=e.r(70595),d=e.r(20786),u=e.r(36607);e.r(62404);let f=e.r(36299),p=n._(e.r(21787)),h=e.r(15840),g={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image/",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0};function m(e,t,r,n,i,o,a){let s=e?.src;e&&e["data-loaded-src"]!==s&&(e["data-loaded-src"]=s,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&i(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let n=!1,i=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>n,isPropagationStopped:()=>i,persist:()=>{},preventDefault:()=>{n=!0,t.preventDefault()},stopPropagation:()=>{i=!0,t.stopPropagation()}})}n?.current&&n.current(e)}}))}function b(e){return a.use?{fetchPriority:e}:{fetchpriority:e}}"undefined"==typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let y=(0,a.forwardRef)(({src:e,srcSet:t,sizes:r,height:n,width:i,decoding:s,className:l,style:c,fetchPriority:d,placeholder:u,loading:f,unoptimized:p,fill:g,onLoadRef:y,onLoadingCompleteRef:x,setBlurComplete:v,setShowAltText:w,sizesInput:j,onLoad:S,onError:E,...C},O)=>{let _=(0,a.useCallback)(e=>{e&&(E&&(e.src=e.src),e.complete&&m(e,u,y,x,v,p,j))},[e,u,y,x,v,E,p,j]),A=(0,h.useMergedRef)(O,_);return(0,o.jsx)("img",{...C,...b(d),loading:f,width:i,height:n,decoding:s,"data-nimg":g?"fill":"1",className:l,style:c,sizes:r,srcSet:t,src:e,ref:A,onLoad:e=>{m(e.currentTarget,u,y,x,v,p,j)},onError:e=>{w(!0),"empty"!==u&&v(!0),E&&E(e)}})});function x({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...b(t.fetchPriority)};return e&&s.default.preload?(s.default.preload(t.src,r),null):(0,o.jsx)(l.default,{children:(0,o.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let v=(0,a.forwardRef)((e,t)=>{let r=(0,a.useContext)(f.RouterContext),n=(0,a.useContext)(u.ImageConfigContext),i=(0,a.useMemo)(()=>{let e=g||n||d.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),i=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:i,localPatterns:"undefined"==typeof window?n?.localPatterns:e.localPatterns}},[n]),{onLoad:s,onLoadingComplete:l}=e,h=(0,a.useRef)(s);(0,a.useEffect)(()=>{h.current=s},[s]);let m=(0,a.useRef)(l);(0,a.useEffect)(()=>{m.current=l},[l]);let[b,v]=(0,a.useState)(!1),[w,j]=(0,a.useState)(!1),{props:S,meta:E}=(0,c.getImgProps)(e,{defaultLoader:p.default,imgConf:i,blurComplete:b,showAltText:w});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(y,{...S,unoptimized:E.unoptimized,placeholder:E.placeholder,fill:E.fill,onLoadRef:h,onLoadingCompleteRef:m,setBlurComplete:v,setShowAltText:j,sizesInput:e.sizes,ref:t}),E.preload?(0,o.jsx)(x,{isAppRouter:!r,imgAttributes:S}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},31374,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return d},getImageProps:function(){return c}};for(var i in n)Object.defineProperty(r,i,{enumerable:!0,get:n[i]});let o=e.r(30322),a=e.r(70595),s=e.r(15048),l=o._(e.r(21787));function c(e){let{props:t}=(0,a.getImgProps)(e,{defaultLoader:l.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image/",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let d=s.Image},54170,(e,t,r)=>{t.exports=e.r(31374)},8568,(e,t,r)=>{var n={675:function(e,t){"use strict";t.byteLength=function(e){var t=l(e),r=t[0],n=t[1];return(r+n)*3/4-n},t.toByteArray=function(e){var t,r,o=l(e),a=o[0],s=o[1],c=new i((a+s)*3/4-s),d=0,u=s>0?a-4:a;for(r=0;r<u;r+=4)t=n[e.charCodeAt(r)]<<18|n[e.charCodeAt(r+1)]<<12|n[e.charCodeAt(r+2)]<<6|n[e.charCodeAt(r+3)],c[d++]=t>>16&255,c[d++]=t>>8&255,c[d++]=255&t;return 2===s&&(t=n[e.charCodeAt(r)]<<2|n[e.charCodeAt(r+1)]>>4,c[d++]=255&t),1===s&&(t=n[e.charCodeAt(r)]<<10|n[e.charCodeAt(r+1)]<<4|n[e.charCodeAt(r+2)]>>2,c[d++]=t>>8&255,c[d++]=255&t),c},t.fromByteArray=function(e){for(var t,n=e.length,i=n%3,o=[],a=0,s=n-i;a<s;a+=16383)o.push(function(e,t,n){for(var i,o=[],a=t;a<n;a+=3)i=(e[a]<<16&0xff0000)+(e[a+1]<<8&65280)+(255&e[a+2]),o.push(r[i>>18&63]+r[i>>12&63]+r[i>>6&63]+r[63&i]);return o.join("")}(e,a,a+16383>s?s:a+16383));return 1===i?o.push(r[(t=e[n-1])>>2]+r[t<<4&63]+"=="):2===i&&o.push(r[(t=(e[n-2]<<8)+e[n-1])>>10]+r[t>>4&63]+r[t<<2&63]+"="),o.join("")};for(var r=[],n=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,s=o.length;a<s;++a)r[a]=o[a],n[o.charCodeAt(a)]=a;function l(e){var t=e.length;if(t%4>0)throw Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");-1===r&&(r=t);var n=r===t?0:4-r%4;return[r,n]}n[45]=62,n[95]=63},72:function(e,t,r){"use strict";var n=r(675),i=r(783),o="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;function a(e){if(e>0x7fffffff)throw RangeError('The value "'+e+'" is invalid for option "size"');var t=new Uint8Array(e);return Object.setPrototypeOf(t,s.prototype),t}function s(e,t,r){if("number"==typeof e){if("string"==typeof t)throw TypeError('The "string" argument must be of type string. Received type number');return d(e)}return l(e,t,r)}function l(e,t,r){if("string"==typeof e){var n=e,i=t;if(("string"!=typeof i||""===i)&&(i="utf8"),!s.isEncoding(i))throw TypeError("Unknown encoding: "+i);var o=0|p(n,i),l=a(o),c=l.write(n,i);return c!==o&&(l=l.slice(0,c)),l}if(ArrayBuffer.isView(e))return u(e);if(null==e)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(N(e,ArrayBuffer)||e&&N(e.buffer,ArrayBuffer)||"undefined"!=typeof SharedArrayBuffer&&(N(e,SharedArrayBuffer)||e&&N(e.buffer,SharedArrayBuffer)))return function(e,t,r){var n;if(t<0||e.byteLength<t)throw RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw RangeError('"length" is outside of buffer bounds');return Object.setPrototypeOf(n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),s.prototype),n}(e,t,r);if("number"==typeof e)throw TypeError('The "value" argument must not be of type number. Received type number');var d=e.valueOf&&e.valueOf();if(null!=d&&d!==e)return s.from(d,t,r);var h=function(e){if(s.isBuffer(e)){var t=0|f(e.length),r=a(t);return 0===r.length||e.copy(r,0,0,t),r}return void 0!==e.length?"number"!=typeof e.length||function(e){return e!=e}(e.length)?a(0):u(e):"Buffer"===e.type&&Array.isArray(e.data)?u(e.data):void 0}(e);if(h)return h;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return s.from(e[Symbol.toPrimitive]("string"),t,r);throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function c(e){if("number"!=typeof e)throw TypeError('"size" argument must be of type number');if(e<0)throw RangeError('The value "'+e+'" is invalid for option "size"')}function d(e){return c(e),a(e<0?0:0|f(e))}function u(e){for(var t=e.length<0?0:0|f(e.length),r=a(t),n=0;n<t;n+=1)r[n]=255&e[n];return r}t.Buffer=s,t.SlowBuffer=function(e){return+e!=e&&(e=0),s.alloc(+e)},t.INSPECT_MAX_BYTES=50,t.kMaxLength=0x7fffffff,s.TYPED_ARRAY_SUPPORT=function(){try{var e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(e){return!1}}(),s.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(s.prototype,"parent",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.byteOffset}}),s.poolSize=8192,s.from=function(e,t,r){return l(e,t,r)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array),s.alloc=function(e,t,r){return(c(e),e<=0)?a(e):void 0!==t?"string"==typeof r?a(e).fill(t,r):a(e).fill(t):a(e)},s.allocUnsafe=function(e){return d(e)},s.allocUnsafeSlow=function(e){return d(e)};function f(e){if(e>=0x7fffffff)throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");return 0|e}function p(e,t){if(s.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||N(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);var r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;for(var i=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return C(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return _(e).length;default:if(i)return n?-1:C(e).length;t=(""+t).toLowerCase(),i=!0}}function h(e,t,r){var i,o,a,s=!1;if((void 0===t||t<0)&&(t=0),t>this.length||((void 0===r||r>this.length)&&(r=this.length),r<=0||(r>>>=0)<=(t>>>=0)))return"";for(e||(e="utf8");;)switch(e){case"hex":return function(e,t,r){var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var i="",o=t;o<r;++o)i+=R[e[o]];return i}(this,t,r);case"utf8":case"utf-8":return y(this,t,r);case"ascii":return function(e,t,r){var n="";r=Math.min(e.length,r);for(var i=t;i<r;++i)n+=String.fromCharCode(127&e[i]);return n}(this,t,r);case"latin1":case"binary":return function(e,t,r){var n="";r=Math.min(e.length,r);for(var i=t;i<r;++i)n+=String.fromCharCode(e[i]);return n}(this,t,r);case"base64":return i=this,o=t,a=r,0===o&&a===i.length?n.fromByteArray(i):n.fromByteArray(i.slice(o,a));case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return function(e,t,r){for(var n=e.slice(t,r),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1]);return i}(this,t,r);default:if(s)throw TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),s=!0}}function g(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}function m(e,t,r,n,i){var o;if(0===e.length)return -1;if("string"==typeof r?(n=r,r=0):r>0x7fffffff?r=0x7fffffff:r<-0x80000000&&(r=-0x80000000),(o=r*=1)!=o&&(r=i?0:e.length-1),r<0&&(r=e.length+r),r>=e.length)if(i)return -1;else r=e.length-1;else if(r<0)if(!i)return -1;else r=0;if("string"==typeof t&&(t=s.from(t,n)),s.isBuffer(t))return 0===t.length?-1:b(e,t,r,n,i);if("number"==typeof t){if(t&=255,"function"==typeof Uint8Array.prototype.indexOf)if(i)return Uint8Array.prototype.indexOf.call(e,t,r);else return Uint8Array.prototype.lastIndexOf.call(e,t,r);return b(e,[t],r,n,i)}throw TypeError("val must be string, number or Buffer")}function b(e,t,r,n,i){var o,a=1,s=e.length,l=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return -1;a=2,s/=2,l/=2,r/=2}function c(e,t){return 1===a?e[t]:e.readUInt16BE(t*a)}if(i){var d=-1;for(o=r;o<s;o++)if(c(e,o)===c(t,-1===d?0:o-d)){if(-1===d&&(d=o),o-d+1===l)return d*a}else -1!==d&&(o-=o-d),d=-1}else for(r+l>s&&(r=s-l),o=r;o>=0;o--){for(var u=!0,f=0;f<l;f++)if(c(e,o+f)!==c(t,f)){u=!1;break}if(u)return o}return -1}s.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==s.prototype},s.compare=function(e,t){if(N(e,Uint8Array)&&(e=s.from(e,e.offset,e.byteLength)),N(t,Uint8Array)&&(t=s.from(t,t.offset,t.byteLength)),!s.isBuffer(e)||!s.isBuffer(t))throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;for(var r=e.length,n=t.length,i=0,o=Math.min(r,n);i<o;++i)if(e[i]!==t[i]){r=e[i],n=t[i];break}return r<n?-1:+(n<r)},s.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(e,t){if(!Array.isArray(e))throw TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return s.alloc(0);if(void 0===t)for(r=0,t=0;r<e.length;++r)t+=e[r].length;var r,n=s.allocUnsafe(t),i=0;for(r=0;r<e.length;++r){var o=e[r];if(N(o,Uint8Array)&&(o=s.from(o)),!s.isBuffer(o))throw TypeError('"list" argument must be an Array of Buffers');o.copy(n,i),i+=o.length}return n},s.byteLength=p,s.prototype._isBuffer=!0,s.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)g(this,t,t+1);return this},s.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)g(this,t,t+3),g(this,t+1,t+2);return this},s.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)g(this,t,t+7),g(this,t+1,t+6),g(this,t+2,t+5),g(this,t+3,t+4);return this},s.prototype.toString=function(){var e=this.length;return 0===e?"":0==arguments.length?y(this,0,e):h.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(e){if(!s.isBuffer(e))throw TypeError("Argument must be a Buffer");return this===e||0===s.compare(this,e)},s.prototype.inspect=function(){var e="",r=t.INSPECT_MAX_BYTES;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},o&&(s.prototype[o]=s.prototype.inspect),s.prototype.compare=function(e,t,r,n,i){if(N(e,Uint8Array)&&(e=s.from(e,e.offset,e.byteLength)),!s.isBuffer(e))throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),t<0||r>e.length||n<0||i>this.length)throw RangeError("out of range index");if(n>=i&&t>=r)return 0;if(n>=i)return -1;if(t>=r)return 1;if(t>>>=0,r>>>=0,n>>>=0,i>>>=0,this===e)return 0;for(var o=i-n,a=r-t,l=Math.min(o,a),c=this.slice(n,i),d=e.slice(t,r),u=0;u<l;++u)if(c[u]!==d[u]){o=c[u],a=d[u];break}return o<a?-1:+(a<o)},s.prototype.includes=function(e,t,r){return -1!==this.indexOf(e,t,r)},s.prototype.indexOf=function(e,t,r){return m(this,e,t,r,!0)},s.prototype.lastIndexOf=function(e,t,r){return m(this,e,t,r,!1)};function y(e,t,r){r=Math.min(e.length,r);for(var n=[],i=t;i<r;){var o,a,s,l,c=e[i],d=null,u=c>239?4:c>223?3:c>191?2:1;if(i+u<=r)switch(u){case 1:c<128&&(d=c);break;case 2:(192&(o=e[i+1]))==128&&(l=(31&c)<<6|63&o)>127&&(d=l);break;case 3:o=e[i+1],a=e[i+2],(192&o)==128&&(192&a)==128&&(l=(15&c)<<12|(63&o)<<6|63&a)>2047&&(l<55296||l>57343)&&(d=l);break;case 4:o=e[i+1],a=e[i+2],s=e[i+3],(192&o)==128&&(192&a)==128&&(192&s)==128&&(l=(15&c)<<18|(63&o)<<12|(63&a)<<6|63&s)>65535&&l<1114112&&(d=l)}null===d?(d=65533,u=1):d>65535&&(d-=65536,n.push(d>>>10&1023|55296),d=56320|1023&d),n.push(d),i+=u}var f=n,p=f.length;if(p<=4096)return String.fromCharCode.apply(String,f);for(var h="",g=0;g<p;)h+=String.fromCharCode.apply(String,f.slice(g,g+=4096));return h}function x(e,t,r){if(e%1!=0||e<0)throw RangeError("offset is not uint");if(e+t>r)throw RangeError("Trying to access beyond buffer length")}function v(e,t,r,n,i,o){if(!s.isBuffer(e))throw TypeError('"buffer" argument must be a Buffer instance');if(t>i||t<o)throw RangeError('"value" argument is out of bounds');if(r+n>e.length)throw RangeError("Index out of range")}function w(e,t,r,n,i,o){if(r+n>e.length||r<0)throw RangeError("Index out of range")}function j(e,t,r,n,o){return t*=1,r>>>=0,o||w(e,t,r,4,34028234663852886e22,-34028234663852886e22),i.write(e,t,r,n,23,4),r+4}function S(e,t,r,n,o){return t*=1,r>>>=0,o||w(e,t,r,8,17976931348623157e292,-17976931348623157e292),i.write(e,t,r,n,52,8),r+8}s.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else if(isFinite(t))t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");var i,o,a,s,l,c,d,u,f=this.length-t;if((void 0===r||r>f)&&(r=f),e.length>0&&(r<0||t<0)||t>this.length)throw RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var p=!1;;)switch(n){case"hex":return function(e,t,r,n){r=Number(r)||0;var i=e.length-r;n?(n=Number(n))>i&&(n=i):n=i;var o=t.length;n>o/2&&(n=o/2);for(var a=0;a<n;++a){var s,l=parseInt(t.substr(2*a,2),16);if((s=l)!=s)break;e[r+a]=l}return a}(this,e,t,r);case"utf8":case"utf-8":return i=t,o=r,A(C(e,this.length-i),this,i,o);case"ascii":return a=t,s=r,A(O(e),this,a,s);case"latin1":case"binary":return function(e,t,r,n){return A(O(t),e,r,n)}(this,e,t,r);case"base64":return l=t,c=r,A(_(e),this,l,c);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return d=t,u=r,A(function(e,t){for(var r,n,i=[],o=0;o<e.length&&!((t-=2)<0);++o)n=(r=e.charCodeAt(o))>>8,i.push(r%256),i.push(n);return i}(e,this.length-d),this,d,u);default:if(p)throw TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),p=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},s.prototype.slice=function(e,t){var r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var n=this.subarray(e,t);return Object.setPrototypeOf(n,s.prototype),n},s.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||x(e,t,this.length);for(var n=this[e],i=1,o=0;++o<t&&(i*=256);)n+=this[e+o]*i;return n},s.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||x(e,t,this.length);for(var n=this[e+--t],i=1;t>0&&(i*=256);)n+=this[e+--t]*i;return n},s.prototype.readUInt8=function(e,t){return e>>>=0,t||x(e,1,this.length),this[e]},s.prototype.readUInt16LE=function(e,t){return e>>>=0,t||x(e,2,this.length),this[e]|this[e+1]<<8},s.prototype.readUInt16BE=function(e,t){return e>>>=0,t||x(e,2,this.length),this[e]<<8|this[e+1]},s.prototype.readUInt32LE=function(e,t){return e>>>=0,t||x(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+0x1000000*this[e+3]},s.prototype.readUInt32BE=function(e,t){return e>>>=0,t||x(e,4,this.length),0x1000000*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},s.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||x(e,t,this.length);for(var n=this[e],i=1,o=0;++o<t&&(i*=256);)n+=this[e+o]*i;return n>=(i*=128)&&(n-=Math.pow(2,8*t)),n},s.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||x(e,t,this.length);for(var n=t,i=1,o=this[e+--n];n>0&&(i*=256);)o+=this[e+--n]*i;return o>=(i*=128)&&(o-=Math.pow(2,8*t)),o},s.prototype.readInt8=function(e,t){return(e>>>=0,t||x(e,1,this.length),128&this[e])?-((255-this[e]+1)*1):this[e]},s.prototype.readInt16LE=function(e,t){e>>>=0,t||x(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?0xffff0000|r:r},s.prototype.readInt16BE=function(e,t){e>>>=0,t||x(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?0xffff0000|r:r},s.prototype.readInt32LE=function(e,t){return e>>>=0,t||x(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},s.prototype.readInt32BE=function(e,t){return e>>>=0,t||x(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},s.prototype.readFloatLE=function(e,t){return e>>>=0,t||x(e,4,this.length),i.read(this,e,!0,23,4)},s.prototype.readFloatBE=function(e,t){return e>>>=0,t||x(e,4,this.length),i.read(this,e,!1,23,4)},s.prototype.readDoubleLE=function(e,t){return e>>>=0,t||x(e,8,this.length),i.read(this,e,!0,52,8)},s.prototype.readDoubleBE=function(e,t){return e>>>=0,t||x(e,8,this.length),i.read(this,e,!1,52,8)},s.prototype.writeUIntLE=function(e,t,r,n){if(e*=1,t>>>=0,r>>>=0,!n){var i=Math.pow(2,8*r)-1;v(this,e,t,r,i,0)}var o=1,a=0;for(this[t]=255&e;++a<r&&(o*=256);)this[t+a]=e/o&255;return t+r},s.prototype.writeUIntBE=function(e,t,r,n){if(e*=1,t>>>=0,r>>>=0,!n){var i=Math.pow(2,8*r)-1;v(this,e,t,r,i,0)}var o=r-1,a=1;for(this[t+o]=255&e;--o>=0&&(a*=256);)this[t+o]=e/a&255;return t+r},s.prototype.writeUInt8=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,1,255,0),this[t]=255&e,t+1},s.prototype.writeUInt16LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},s.prototype.writeUInt16BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},s.prototype.writeUInt32LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0xffffffff,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},s.prototype.writeUInt32BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0xffffffff,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},s.prototype.writeIntLE=function(e,t,r,n){if(e*=1,t>>>=0,!n){var i=Math.pow(2,8*r-1);v(this,e,t,r,i-1,-i)}var o=0,a=1,s=0;for(this[t]=255&e;++o<r&&(a*=256);)e<0&&0===s&&0!==this[t+o-1]&&(s=1),this[t+o]=(e/a|0)-s&255;return t+r},s.prototype.writeIntBE=function(e,t,r,n){if(e*=1,t>>>=0,!n){var i=Math.pow(2,8*r-1);v(this,e,t,r,i-1,-i)}var o=r-1,a=1,s=0;for(this[t+o]=255&e;--o>=0&&(a*=256);)e<0&&0===s&&0!==this[t+o+1]&&(s=1),this[t+o]=(e/a|0)-s&255;return t+r},s.prototype.writeInt8=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},s.prototype.writeInt16LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},s.prototype.writeInt16BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},s.prototype.writeInt32LE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0x7fffffff,-0x80000000),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},s.prototype.writeInt32BE=function(e,t,r){return e*=1,t>>>=0,r||v(this,e,t,4,0x7fffffff,-0x80000000),e<0&&(e=0xffffffff+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},s.prototype.writeFloatLE=function(e,t,r){return j(this,e,t,!0,r)},s.prototype.writeFloatBE=function(e,t,r){return j(this,e,t,!1,r)},s.prototype.writeDoubleLE=function(e,t,r){return S(this,e,t,!0,r)},s.prototype.writeDoubleBE=function(e,t,r){return S(this,e,t,!1,r)},s.prototype.copy=function(e,t,r,n){if(!s.isBuffer(e))throw TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r||0===e.length||0===this.length)return 0;if(t<0)throw RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw RangeError("Index out of range");if(n<0)throw RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var i=n-r;if(this===e&&"function"==typeof Uint8Array.prototype.copyWithin)this.copyWithin(t,r,n);else if(this===e&&r<t&&t<n)for(var o=i-1;o>=0;--o)e[o+t]=this[o+r];else Uint8Array.prototype.set.call(e,this.subarray(r,n),t);return i},s.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw TypeError("encoding must be a string");if("string"==typeof n&&!s.isEncoding(n))throw TypeError("Unknown encoding: "+n);if(1===e.length){var i,o=e.charCodeAt(0);("utf8"===n&&o<128||"latin1"===n)&&(e=o)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=Number(e));if(t<0||this.length<t||this.length<r)throw RangeError("Out of range index");if(r<=t)return this;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(i=t;i<r;++i)this[i]=e;else{var a=s.isBuffer(e)?e:s.from(e,n),l=a.length;if(0===l)throw TypeError('The value "'+e+'" is invalid for argument "value"');for(i=0;i<r-t;++i)this[i+t]=a[i%l]}return this};var E=/[^+/0-9A-Za-z-_]/g;function C(e,t){t=t||1/0;for(var r,n=e.length,i=null,o=[],a=0;a<n;++a){if((r=e.charCodeAt(a))>55295&&r<57344){if(!i){if(r>56319||a+1===n){(t-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(t-=3)>-1&&o.push(239,191,189),i=r;continue}r=(i-55296<<10|r-56320)+65536}else i&&(t-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((t-=1)<0)break;o.push(r)}else if(r<2048){if((t-=2)<0)break;o.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128)}else if(r<1114112){if((t-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}else throw Error("Invalid code point")}return o}function O(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}function _(e){return n.toByteArray(function(e){if((e=(e=e.split("=")[0]).trim().replace(E,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function A(e,t,r,n){for(var i=0;i<n&&!(i+r>=t.length)&&!(i>=e.length);++i)t[i+r]=e[i];return i}function N(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}var R=function(){for(var e="0123456789abcdef",t=Array(256),r=0;r<16;++r)for(var n=16*r,i=0;i<16;++i)t[n+i]=e[r]+e[i];return t}()},783:function(e,t){t.read=function(e,t,r,n,i){var o,a,s=8*i-n-1,l=(1<<s)-1,c=l>>1,d=-7,u=r?i-1:0,f=r?-1:1,p=e[t+u];for(u+=f,o=p&(1<<-d)-1,p>>=-d,d+=s;d>0;o=256*o+e[t+u],u+=f,d-=8);for(a=o&(1<<-d)-1,o>>=-d,d+=n;d>0;a=256*a+e[t+u],u+=f,d-=8);if(0===o)o=1-c;else{if(o===l)return a?NaN:1/0*(p?-1:1);a+=Math.pow(2,n),o-=c}return(p?-1:1)*a*Math.pow(2,o-n)},t.write=function(e,t,r,n,i,o){var a,s,l,c=8*o-i-1,d=(1<<c)-1,u=d>>1,f=5960464477539062e-23*(23===i),p=n?0:o-1,h=n?1:-1,g=+(t<0||0===t&&1/t<0);for(isNaN(t=Math.abs(t))||t===1/0?(s=+!!isNaN(t),a=d):(a=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-a))<1&&(a--,l*=2),a+u>=1?t+=f/l:t+=f*Math.pow(2,1-u),t*l>=2&&(a++,l/=2),a+u>=d?(s=0,a=d):a+u>=1?(s=(t*l-1)*Math.pow(2,i),a+=u):(s=t*Math.pow(2,u-1)*Math.pow(2,i),a=0));i>=8;e[r+p]=255&s,p+=h,s/=256,i-=8);for(a=a<<i|s,c+=i;c>0;e[r+p]=255&a,p+=h,a/=256,c-=8);e[r+p-h]|=128*g}}},i={};function o(e){var t=i[e];if(void 0!==t)return t.exports;var r=i[e]={exports:{}},a=!0;try{n[e](r,r.exports,o),a=!1}finally{a&&delete i[e]}return r.exports}o.ab="/ROOT/onboarding-registration-form/node_modules/next/dist/compiled/buffer/",t.exports=o(72)},68103,e=>{"use strict";let t,r,n,i;var o,a,s,l,c=e.i(29196),d=e.i(68086),u=e.i(46522),f=e.i(14726),p=function(){return(p=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};function h(e,t,r){if(r||2==arguments.length)for(var n,i=0,o=t.length;i<o;i++)!n&&i in t||(n||(n=Array.prototype.slice.call(t,0,i)),n[i]=t[i]);return e.concat(n||Array.prototype.slice.call(t))}"function"==typeof SuppressedError&&SuppressedError;Object.create(null);var g=e.i(23584),m="-ms-",b="-moz-",y="-webkit-",x="comm",v="rule",w="decl",j="@keyframes",S=Math.abs,E=String.fromCharCode,C=Object.assign;function O(e,t){return(e=t.exec(e))?e[0]:e}function _(e,t,r){return e.replace(t,r)}function A(e,t,r){return e.indexOf(t,r)}function N(e,t){return 0|e.charCodeAt(t)}function R(e,t,r){return e.slice(t,r)}function k(e){return e.length}function I(e,t){return t.push(e),e}function P(e,t){return e.filter(function(e){return!O(e,t)})}var T=1,F=1,B=0,z=0,$=0,L="";function U(e,t,r,n,i,o,a,s){return{value:e,root:t,parent:r,type:n,props:i,children:o,line:T,column:F,length:a,return:"",siblings:s}}function D(e,t){return C(U("",null,null,"",null,null,0,e.siblings),e,{length:-e.length},t)}function M(e){for(;e.root;)e=D(e.root,{children:[e]});I(e,e.siblings)}function X(){return $=z<B?N(L,z++):0,F++,10===$&&(F=1,T++),$}function q(){return N(L,z)}function W(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function Y(e){var t,r;return(t=z-1,r=function e(t){for(;X();)switch($){case t:return z;case 34:case 39:34!==t&&39!==t&&e($);break;case 40:41===t&&e(t);break;case 92:X()}return z}(91===e?e+2:40===e?e+1:e),R(L,t,r)).trim()}function H(e,t){for(var r="",n=0;n<e.length;n++)r+=t(e[n],n,e,t)||"";return r}function G(e,t,r,n){switch(e.type){case"@layer":if(e.children.length)break;case"@import":case w:return e.return=e.return||e.value;case x:return"";case j:return e.return=e.value+"{"+H(e.children,n)+"}";case v:if(!k(e.value=e.props.join(",")))return""}return k(r=H(e.children,n))?e.return=e.value+"{"+r+"}":""}function J(e,t,r,n){if(e.length>-1&&!e.return)switch(e.type){case w:e.return=function e(t,r,n){var i;switch(i=r,45^N(t,0)?(((i<<2^N(t,0))<<2^N(t,1))<<2^N(t,2))<<2^N(t,3):0){case 5103:return y+"print-"+t+t;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return y+t+t;case 4789:return b+t+t;case 5349:case 4246:case 4810:case 6968:case 2756:return y+t+b+t+m+t+t;case 5936:switch(N(t,r+11)){case 114:return y+t+m+_(t,/[svh]\w+-[tblr]{2}/,"tb")+t;case 108:return y+t+m+_(t,/[svh]\w+-[tblr]{2}/,"tb-rl")+t;case 45:return y+t+m+_(t,/[svh]\w+-[tblr]{2}/,"lr")+t}case 6828:case 4268:case 2903:return y+t+m+t+t;case 6165:return y+t+m+"flex-"+t+t;case 5187:return y+t+_(t,/(\w+).+(:[^]+)/,y+"box-$1$2"+m+"flex-$1$2")+t;case 5443:return y+t+m+"flex-item-"+_(t,/flex-|-self/g,"")+(O(t,/flex-|baseline/)?"":m+"grid-row-"+_(t,/flex-|-self/g,""))+t;case 4675:return y+t+m+"flex-line-pack"+_(t,/align-content|flex-|-self/g,"")+t;case 5548:return y+t+m+_(t,"shrink","negative")+t;case 5292:return y+t+m+_(t,"basis","preferred-size")+t;case 6060:return y+"box-"+_(t,"-grow","")+y+t+m+_(t,"grow","positive")+t;case 4554:return y+_(t,/([^-])(transform)/g,"$1"+y+"$2")+t;case 6187:return _(_(_(t,/(zoom-|grab)/,y+"$1"),/(image-set)/,y+"$1"),t,"")+t;case 5495:case 3959:return _(t,/(image-set\([^]*)/,y+"$1$`$1");case 4968:return _(_(t,/(.+:)(flex-)?(.*)/,y+"box-pack:$3"+m+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+y+t+t;case 4200:if(!O(t,/flex-|baseline/))return m+"grid-column-align"+R(t,r)+t;break;case 2592:case 3360:return m+_(t,"template-","")+t;case 4384:case 3616:if(n&&n.some(function(e,t){return r=t,O(e.props,/grid-\w+-end/)}))return~A(t+(n=n[r].value),"span",0)?t:m+_(t,"-start","")+t+m+"grid-row-span:"+(~A(n,"span",0)?O(n,/\d+/):O(n,/\d+/)-O(t,/\d+/))+";";return m+_(t,"-start","")+t;case 4896:case 4128:return n&&n.some(function(e){return O(e.props,/grid-\w+-start/)})?t:m+_(_(t,"-end","-span"),"span ","")+t;case 4095:case 3583:case 4068:case 2532:return _(t,/(.+)-inline(.+)/,y+"$1$2")+t;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(k(t)-1-r>6)switch(N(t,r+1)){case 109:if(45!==N(t,r+4))break;case 102:return _(t,/(.+:)(.+)-([^]+)/,"$1"+y+"$2-$3$1"+b+(108==N(t,r+3)?"$3":"$2-$3"))+t;case 115:return~A(t,"stretch",0)?e(_(t,"stretch","fill-available"),r,n)+t:t}break;case 5152:case 5920:return _(t,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,function(e,r,n,i,o,a,s){return m+r+":"+n+s+(i?m+r+"-span:"+(o?a:a-n)+s:"")+t});case 4949:if(121===N(t,r+6))return _(t,":",":"+y)+t;break;case 6444:switch(N(t,45===N(t,14)?18:11)){case 120:return _(t,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+y+(45===N(t,14)?"inline-":"")+"box$3$1"+y+"$2$3$1"+m+"$2box$3")+t;case 100:return _(t,":",":"+m)+t}break;case 5719:case 2647:case 2135:case 3927:case 2391:return _(t,"scroll-","scroll-snap-")+t}return t}(e.value,e.length,r);return;case j:return H([D(e,{value:_(e.value,"@","@"+y)})],n);case v:if(e.length){var i,o;return i=r=e.props,o=function(t){switch(O(t,n=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":M(D(e,{props:[_(t,/:(read-\w+)/,":"+b+"$1")]})),M(D(e,{props:[t]})),C(e,{props:P(r,n)});break;case"::placeholder":M(D(e,{props:[_(t,/:(plac\w+)/,":"+y+"input-$1")]})),M(D(e,{props:[_(t,/:(plac\w+)/,":"+b+"$1")]})),M(D(e,{props:[_(t,/:(plac\w+)/,m+"input-$1")]})),M(D(e,{props:[t]})),C(e,{props:P(r,n)})}return""},i.map(o).join("")}}}function V(e,t,r,n,i,o,a,s,l,c,d,u){for(var f=i-1,p=0===i?o:[""],h=p.length,g=0,m=0,b=0;g<n;++g)for(var y=0,x=R(e,f+1,f=S(m=a[g])),w=e;y<h;++y)(w=(m>0?p[y]+" "+x:_(x,/&\f/g,p[y])).trim())&&(l[b++]=w);return U(e,t,r,0===i?v:s,l,c,d,u)}function K(e,t,r,n,i){return U(e,t,r,w,R(e,0,n),R(e,n+1,-1),n,i)}var Q={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},Z=void 0!==f.default&&void 0!==f.default.env&&(f.default.env.REACT_APP_SC_ATTR||f.default.env.SC_ATTR)||"data-styled",ee="active",et="data-styled-version",er="6.1.19",en="/*!sc*/\n",ei="undefined"!=typeof window&&"undefined"!=typeof document,eo=!!("boolean"==typeof SC_DISABLE_SPEEDY?SC_DISABLE_SPEEDY:void 0!==f.default&&void 0!==f.default.env&&void 0!==f.default.env.REACT_APP_SC_DISABLE_SPEEDY&&""!==f.default.env.REACT_APP_SC_DISABLE_SPEEDY?"false"!==f.default.env.REACT_APP_SC_DISABLE_SPEEDY&&f.default.env.REACT_APP_SC_DISABLE_SPEEDY:void 0!==f.default&&void 0!==f.default.env&&void 0!==f.default.env.SC_DISABLE_SPEEDY&&""!==f.default.env.SC_DISABLE_SPEEDY&&"false"!==f.default.env.SC_DISABLE_SPEEDY&&f.default.env.SC_DISABLE_SPEEDY),ea={},es=Object.freeze([]),el=Object.freeze({});function ec(e,t,r){return void 0===r&&(r=el),e.theme!==r.theme&&e.theme||t||r.theme}var ed=new Set(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","u","ul","use","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"]),eu=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,ef=/(^-|-$)/g;function ep(e){return e.replace(eu,"-").replace(ef,"")}var eh=/(a)(d)/gi,eg=function(e){return String.fromCharCode(e+(e>25?39:97))};function em(e){var t,r="";for(t=Math.abs(e);t>52;t=t/52|0)r=eg(t%52)+r;return(eg(t%52)+r).replace(eh,"$1-$2")}var eb,ey=function(e,t){for(var r=t.length;r;)e=33*e^t.charCodeAt(--r);return e},ex=function(e){return ey(5381,e)};function ev(e){return em(ex(e)>>>0)}function ew(e){return"string"==typeof e}var ej="function"==typeof Symbol&&Symbol.for,eS=ej?Symbol.for("react.memo"):60115,eE=ej?Symbol.for("react.forward_ref"):60112,eC={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},eO={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},e_={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},eA=((eb={})[eE]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},eb[eS]=e_,eb);function eN(e){return("type"in e&&e.type.$$typeof)===eS?e_:"$$typeof"in e?eA[e.$$typeof]:eC}var eR=Object.defineProperty,ek=Object.getOwnPropertyNames,eI=Object.getOwnPropertySymbols,eP=Object.getOwnPropertyDescriptor,eT=Object.getPrototypeOf,eF=Object.prototype;function eB(e){return"function"==typeof e}function ez(e){return"object"==typeof e&&"styledComponentId"in e}function e$(e,t){return e&&t?"".concat(e," ").concat(t):e||t||""}function eL(e,t){if(0===e.length)return"";for(var r=e[0],n=1;n<e.length;n++)r+=t?t+e[n]:e[n];return r}function eU(e){return null!==e&&"object"==typeof e&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function eD(e,t){Object.defineProperty(e,"toString",{value:t})}function eM(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(e," for more information.").concat(t.length>0?" Args: ".concat(t.join(", ")):""))}var eX=function(){function e(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e}return e.prototype.indexOfGroup=function(e){for(var t=0,r=0;r<e;r++)t+=this.groupSizes[r];return t},e.prototype.insertRules=function(e,t){if(e>=this.groupSizes.length){for(var r=this.groupSizes,n=r.length,i=n;e>=i;)if((i<<=1)<0)throw eM(16,"".concat(e));this.groupSizes=new Uint32Array(i),this.groupSizes.set(r),this.length=i;for(var o=n;o<i;o++)this.groupSizes[o]=0}for(var a=this.indexOfGroup(e+1),s=(o=0,t.length);o<s;o++)this.tag.insertRule(a,t[o])&&(this.groupSizes[e]++,a++)},e.prototype.clearGroup=function(e){if(e<this.length){var t=this.groupSizes[e],r=this.indexOfGroup(e),n=r+t;this.groupSizes[e]=0;for(var i=r;i<n;i++)this.tag.deleteRule(r)}},e.prototype.getGroup=function(e){var t="";if(e>=this.length||0===this.groupSizes[e])return t;for(var r=this.groupSizes[e],n=this.indexOfGroup(e),i=n+r,o=n;o<i;o++)t+="".concat(this.tag.getRule(o)).concat(en);return t},e}(),eq=new Map,eW=new Map,eY=1,eH=function(e){if(eq.has(e))return eq.get(e);for(;eW.has(eY);)eY++;var t=eY++;return eq.set(e,t),eW.set(t,e),t},eG=function(e,t){eY=t+1,eq.set(e,t),eW.set(t,e)},eJ="style[".concat(Z,"][").concat(et,'="').concat(er,'"]'),eV=new RegExp("^".concat(Z,'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')),eK=function(e,t,r){for(var n,i=r.split(","),o=0,a=i.length;o<a;o++)(n=i[o])&&e.registerName(t,n)},eQ=function(e,t){for(var r,n=(null!=(r=t.textContent)?r:"").split(en),i=[],o=0,a=n.length;o<a;o++){var s=n[o].trim();if(s){var l=s.match(eV);if(l){var c=0|parseInt(l[1],10),d=l[2];0!==c&&(eG(d,c),eK(e,d,l[3]),e.getTag().insertRules(c,i)),i.length=0}else i.push(s)}}},eZ=function(e){for(var t=document.querySelectorAll(eJ),r=0,n=t.length;r<n;r++){var i=t[r];i&&i.getAttribute(Z)!==ee&&(eQ(e,i),i.parentNode&&i.parentNode.removeChild(i))}};function e0(){return"undefined"!=typeof __webpack_nonce__?__webpack_nonce__:null}var e1=function(e){var t,r=document.head,n=e||r,i=document.createElement("style"),o=(t=Array.from(n.querySelectorAll("style[".concat(Z,"]"))))[t.length-1],a=void 0!==o?o.nextSibling:null;i.setAttribute(Z,ee),i.setAttribute(et,er);var s=e0();return s&&i.setAttribute("nonce",s),n.insertBefore(i,a),i},e2=function(){function e(e){this.element=e1(e),this.element.appendChild(document.createTextNode("")),this.sheet=function(e){if(e.sheet)return e.sheet;for(var t=document.styleSheets,r=0,n=t.length;r<n;r++){var i=t[r];if(i.ownerNode===e)return i}throw eM(17)}(this.element),this.length=0}return e.prototype.insertRule=function(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return!1}},e.prototype.deleteRule=function(e){this.sheet.deleteRule(e),this.length--},e.prototype.getRule=function(e){var t=this.sheet.cssRules[e];return t&&t.cssText?t.cssText:""},e}(),e5=function(){function e(e){this.element=e1(e),this.nodes=this.element.childNodes,this.length=0}return e.prototype.insertRule=function(e,t){if(e<=this.length&&e>=0){var r=document.createTextNode(t);return this.element.insertBefore(r,this.nodes[e]||null),this.length++,!0}return!1},e.prototype.deleteRule=function(e){this.element.removeChild(this.nodes[e]),this.length--},e.prototype.getRule=function(e){return e<this.length?this.nodes[e].textContent:""},e}(),e3=function(){function e(e){this.rules=[],this.length=0}return e.prototype.insertRule=function(e,t){return e<=this.length&&(this.rules.splice(e,0,t),this.length++,!0)},e.prototype.deleteRule=function(e){this.rules.splice(e,1),this.length--},e.prototype.getRule=function(e){return e<this.length?this.rules[e]:""},e}(),e4=ei,e8={isServer:!ei,useCSSOMInjection:!eo},e6=function(){function e(e,t,r){void 0===e&&(e=el),void 0===t&&(t={});var n=this;this.options=p(p({},e8),e),this.gs=t,this.names=new Map(r),this.server=!!e.isServer,!this.server&&ei&&e4&&(e4=!1,eZ(this)),eD(this,function(){for(var e=n.getTag(),t=e.length,r="",i=0;i<t;i++)!function(t){var i=eW.get(t);if(void 0===i)return;var o=n.names.get(i),a=e.getGroup(t);if(void 0!==o&&o.size&&0!==a.length){var s="".concat(Z,".g").concat(t,'[id="').concat(i,'"]'),l="";void 0!==o&&o.forEach(function(e){e.length>0&&(l+="".concat(e,","))}),r+="".concat(a).concat(s,'{content:"').concat(l,'"}').concat(en)}}(i);return r})}return e.registerId=function(e){return eH(e)},e.prototype.rehydrate=function(){!this.server&&ei&&eZ(this)},e.prototype.reconstructWithOptions=function(t,r){return void 0===r&&(r=!0),new e(p(p({},this.options),t),this.gs,r&&this.names||void 0)},e.prototype.allocateGSInstance=function(e){return this.gs[e]=(this.gs[e]||0)+1},e.prototype.getTag=function(){var e,t,r;return this.tag||(this.tag=(t=(e=this.options).useCSSOMInjection,r=e.target,new eX(e.isServer?new e3(r):t?new e2(r):new e5(r))))},e.prototype.hasNameForId=function(e,t){return this.names.has(e)&&this.names.get(e).has(t)},e.prototype.registerName=function(e,t){if(eH(e),this.names.has(e))this.names.get(e).add(t);else{var r=new Set;r.add(t),this.names.set(e,r)}},e.prototype.insertRules=function(e,t,r){this.registerName(e,t),this.getTag().insertRules(eH(e),r)},e.prototype.clearNames=function(e){this.names.has(e)&&this.names.get(e).clear()},e.prototype.clearRules=function(e){this.getTag().clearGroup(eH(e)),this.clearNames(e)},e.prototype.clearTag=function(){this.tag=void 0},e}(),e9=/&/g,e7=/^\s*\/\/.*$/gm;function te(e){var t,r,n,i=void 0===e?el:e,o=i.options,a=void 0===o?el:o,s=i.plugins,l=void 0===s?es:s,c=function(e,n,i){return i.startsWith(r)&&i.endsWith(r)&&i.replaceAll(r,"").length>0?".".concat(t):e},d=l.slice();d.push(function(e){e.type===v&&e.value.includes("&")&&(e.props[0]=e.props[0].replace(e9,r).replace(n,c))}),a.prefix&&d.push(J),d.push(G);var u=function(e,i,o,s){void 0===i&&(i=""),void 0===o&&(o=""),void 0===s&&(s="&"),t=s,r=i,n=RegExp("\\".concat(r,"\\b"),"g");var l,c,u,f,p,h,g=e.replace(e7,""),m=(p=function e(t,r,n,i,o,a,s,l,c){for(var d,u,f,p,h=0,g=0,m=s,b=0,y=0,v=0,w=1,j=1,C=1,O=0,P="",B=o,D=a,M=i,H=P;j;)switch(v=O,O=X()){case 40:if(108!=v&&58==N(H,m-1)){-1!=A(H+=_(Y(O),"&","&\f"),"&\f",S(h?l[h-1]:0))&&(C=-1);break}case 34:case 39:case 91:H+=Y(O);break;case 9:case 10:case 13:case 32:H+=function(e){for(;$=q();)if($<33)X();else break;return W(e)>2||W($)>3?"":" "}(v);break;case 92:H+=function(e,t){for(var r;--t&&X()&&!($<48)&&!($>102)&&(!($>57)||!($<65))&&(!($>70)||!($<97)););return r=z+(t<6&&32==q()&&32==X()),R(L,e,r)}(z-1,7);continue;case 47:switch(q()){case 42:case 47:I((d=function(e,t){for(;X();)if(e+$===57)break;else if(e+$===84&&47===q())break;return"/*"+R(L,t,z-1)+"*"+E(47===e?e:X())}(X(),z),u=r,f=n,p=c,U(d,u,f,x,E($),R(d,2,-2),0,p)),c);break;default:H+="/"}break;case 123*w:l[h++]=k(H)*C;case 125*w:case 59:case 0:switch(O){case 0:case 125:j=0;case 59+g:-1==C&&(H=_(H,/\f/g,"")),y>0&&k(H)-m&&I(y>32?K(H+";",i,n,m-1,c):K(_(H," ","")+";",i,n,m-2,c),c);break;case 59:H+=";";default:if(I(M=V(H,r,n,h,g,o,l,P,B=[],D=[],m,a),a),123===O)if(0===g)e(H,r,M,M,B,a,m,l,D);else switch(99===b&&110===N(H,3)?100:b){case 100:case 108:case 109:case 115:e(t,M,M,i&&I(V(t,M,M,0,0,o,l,P,o,B=[],m,D),D),o,D,m,l,i?B:D);break;default:e(H,M,M,M,[""],D,0,l,D)}}h=g=y=0,w=C=1,P=H="",m=s;break;case 58:m=1+k(H),y=v;default:if(w<1){if(123==O)--w;else if(125==O&&0==w++&&125==($=z>0?N(L,--z):0,F--,10===$&&(F=1,T--),$))continue}switch(H+=E(O),O*w){case 38:C=g>0?1:(H+="\f",-1);break;case 44:l[h++]=(k(H)-1)*C,C=1;break;case 64:45===q()&&(H+=Y(X())),b=q(),g=m=k(P=H+=function(e){for(;!W(q());)X();return R(L,e,z)}(z)),O++;break;case 45:45===v&&2==k(H)&&(w=0)}}return a}("",null,null,null,[""],(f=u=o||i?"".concat(o," ").concat(i," { ").concat(g," }"):g,T=F=1,B=k(L=f),z=0,u=[]),0,[0],u),L="",p);a.namespace&&(m=function e(t,r){return t.map(function(t){return"rule"===t.type&&(t.value="".concat(r," ").concat(t.value),t.value=t.value.replaceAll(",",",".concat(r," ")),t.props=t.props.map(function(e){return"".concat(r," ").concat(e)})),Array.isArray(t.children)&&"@keyframes"!==t.type&&(t.children=e(t.children,r)),t})}(m,a.namespace));var b=[];return H(m,(c=(l=d.concat((h=function(e){return b.push(e)},function(e){!e.root&&(e=e.return)&&h(e)}))).length,function(e,t,r,n){for(var i="",o=0;o<c;o++)i+=l[o](e,t,r,n)||"";return i})),b};return u.hash=l.length?l.reduce(function(e,t){return t.name||eM(15),ey(e,t.name)},5381).toString():"",u}var tt=new e6,tr=te(),tn=d.default.createContext({shouldForwardProp:void 0,styleSheet:tt,stylis:tr}),ti=(tn.Consumer,d.default.createContext(void 0));function to(){return(0,d.useContext)(tn)}function ta(e){var t=(0,d.useState)(e.stylisPlugins),r=t[0],n=t[1],i=to().styleSheet,o=(0,d.useMemo)(function(){var t=i;return e.sheet?t=e.sheet:e.target&&(t=t.reconstructWithOptions({target:e.target},!1)),e.disableCSSOMInjection&&(t=t.reconstructWithOptions({useCSSOMInjection:!1})),t},[e.disableCSSOMInjection,e.sheet,e.target,i]),a=(0,d.useMemo)(function(){return te({options:{namespace:e.namespace,prefix:e.enableVendorPrefixes},plugins:r})},[e.enableVendorPrefixes,e.namespace,r]);(0,d.useEffect)(function(){(0,g.default)(r,e.stylisPlugins)||n(e.stylisPlugins)},[e.stylisPlugins]);var s=(0,d.useMemo)(function(){return{shouldForwardProp:e.shouldForwardProp,styleSheet:o,stylis:a}},[e.shouldForwardProp,o,a]);return d.default.createElement(tn.Provider,{value:s},d.default.createElement(ti.Provider,{value:a},e.children))}var ts=function(){function e(e,t){var r=this;this.inject=function(e,t){void 0===t&&(t=tr);var n=r.name+t.hash;e.hasNameForId(r.id,n)||e.insertRules(r.id,n,t(r.rules,n,"@keyframes"))},this.name=e,this.id="sc-keyframes-".concat(e),this.rules=t,eD(this,function(){throw eM(12,String(r.name))})}return e.prototype.getName=function(e){return void 0===e&&(e=tr),this.name+e.hash},e}();function tl(e){for(var t="",r=0;r<e.length;r++){var n=e[r];if(1===r&&"-"===n&&"-"===e[0])return e;n>="A"&&n<="Z"?t+="-"+n.toLowerCase():t+=n}return t.startsWith("ms-")?"-"+t:t}var tc=function(e){return null==e||!1===e||""===e},td=function(e){var t=[];for(var r in e){var n=e[r];e.hasOwnProperty(r)&&!tc(n)&&(Array.isArray(n)&&n.isCss||eB(n)?t.push("".concat(tl(r),":"),n,";"):eU(n)?t.push.apply(t,h(h(["".concat(r," {")],td(n),!1),["}"],!1)):t.push("".concat(tl(r),": ").concat(null==n||"boolean"==typeof n||""===n?"":"number"!=typeof n||0===n||r in Q||r.startsWith("--")?String(n).trim():"".concat(n,"px"),";")))}return t};function tu(e,t,r,n){if(tc(e))return[];if(ez(e))return[".".concat(e.styledComponentId)];if(eB(e))return!eB(e)||e.prototype&&e.prototype.isReactComponent||!t?[e]:tu(e(t),t,r,n);return e instanceof ts?r?(e.inject(r,n),[e.getName(n)]):[e]:eU(e)?td(e):Array.isArray(e)?Array.prototype.concat.apply(es,e.map(function(e){return tu(e,t,r,n)})):[e.toString()]}function tf(e){for(var t=0;t<e.length;t+=1){var r=e[t];if(eB(r)&&!ez(r))return!1}return!0}var tp=ex(er),th=function(){function e(e,t,r){this.rules=e,this.staticRulesId="",this.isStatic=(void 0===r||r.isStatic)&&tf(e),this.componentId=t,this.baseHash=ey(tp,t),this.baseStyle=r,e6.registerId(t)}return e.prototype.generateAndInjectStyles=function(e,t,r){var n=this.baseStyle?this.baseStyle.generateAndInjectStyles(e,t,r):"";if(this.isStatic&&!r.hash)if(this.staticRulesId&&t.hasNameForId(this.componentId,this.staticRulesId))n=e$(n,this.staticRulesId);else{var i=eL(tu(this.rules,e,t,r)),o=em(ey(this.baseHash,i)>>>0);if(!t.hasNameForId(this.componentId,o)){var a=r(i,".".concat(o),void 0,this.componentId);t.insertRules(this.componentId,o,a)}n=e$(n,o),this.staticRulesId=o}else{for(var s=ey(this.baseHash,r.hash),l="",c=0;c<this.rules.length;c++){var d=this.rules[c];if("string"==typeof d)l+=d;else if(d){var u=eL(tu(d,e,t,r));s=ey(s,u+c),l+=u}}if(l){var f=em(s>>>0);t.hasNameForId(this.componentId,f)||t.insertRules(this.componentId,f,r(l,".".concat(f),void 0,this.componentId)),n=e$(n,f)}}return n},e}(),tg=d.default.createContext(void 0);tg.Consumer;var tm={};function tb(e,t,r){var n,i,o,a,s=ez(e),l=!ew(e),c=t.attrs,u=void 0===c?es:c,f=t.componentId,h=void 0===f?(n=t.displayName,i=t.parentComponentId,tm[o="string"!=typeof n?"sc":ep(n)]=(tm[o]||0)+1,a="".concat(o,"-").concat(ev(er+o+tm[o])),i?"".concat(i,"-").concat(a):a):f,g=t.displayName,m=void 0===g?ew(e)?"styled.".concat(e):"Styled(".concat(e.displayName||e.name||"Component",")"):g,b=t.displayName&&t.componentId?"".concat(ep(t.displayName),"-").concat(t.componentId):t.componentId||h,y=s&&e.attrs?e.attrs.concat(u).filter(Boolean):u,x=t.shouldForwardProp;if(s&&e.shouldForwardProp){var v=e.shouldForwardProp;if(t.shouldForwardProp){var w=t.shouldForwardProp;x=function(e,t){return v(e,t)&&w(e,t)}}else x=v}var j=new th(r,b,s?e.componentStyle:void 0);function S(e,t){return function(e,t,r){var n,i=e.attrs,o=e.componentStyle,a=e.defaultProps,s=e.foldedComponentIds,l=e.styledComponentId,c=e.target,u=d.default.useContext(tg),f=to(),h=e.shouldForwardProp||f.shouldForwardProp,g=ec(t,u,a)||el,m=function(e,t,r){for(var n,i=p(p({},t),{className:void 0,theme:r}),o=0;o<e.length;o+=1){var a=eB(n=e[o])?n(i):n;for(var s in a)i[s]="className"===s?e$(i[s],a[s]):"style"===s?p(p({},i[s]),a[s]):a[s]}return t.className&&(i.className=e$(i.className,t.className)),i}(i,t,g),b=m.as||c,y={};for(var x in m)void 0===m[x]||"$"===x[0]||"as"===x||"theme"===x&&m.theme===g||("forwardedAs"===x?y.as=m.forwardedAs:h&&!h(x,b)||(y[x]=m[x]));var v=(n=to(),o.generateAndInjectStyles(m,n.styleSheet,n.stylis)),w=e$(s,l);return v&&(w+=" "+v),m.className&&(w+=" "+m.className),y[ew(b)&&!ed.has(b)?"class":"className"]=w,r&&(y.ref=r),(0,d.createElement)(b,y)}(E,e,t)}S.displayName=m;var E=d.default.forwardRef(S);return E.attrs=y,E.componentStyle=j,E.displayName=m,E.shouldForwardProp=x,E.foldedComponentIds=s?e$(e.foldedComponentIds,e.styledComponentId):"",E.styledComponentId=b,E.target=s?e.target:e,Object.defineProperty(E,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(t){this._foldedDefaultProps=s?function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];for(var n=0;n<t.length;n++)!function e(t,r,n){if(void 0===n&&(n=!1),!n&&!eU(t)&&!Array.isArray(t))return r;if(Array.isArray(r))for(var i=0;i<r.length;i++)t[i]=e(t[i],r[i]);else if(eU(r))for(var i in r)t[i]=e(t[i],r[i]);return t}(e,t[n],!0);return e}({},e.defaultProps,t):t}}),eD(E,function(){return".".concat(E.styledComponentId)}),l&&function e(t,r,n){if("string"!=typeof r){if(eF){var i=eT(r);i&&i!==eF&&e(t,i,n)}var o=ek(r);eI&&(o=o.concat(eI(r)));for(var a=eN(t),s=eN(r),l=0;l<o.length;++l){var c=o[l];if(!(c in eO||n&&n[c]||s&&c in s||a&&c in a)){var d=eP(r,c);try{eR(t,c,d)}catch(e){}}}}return t}(E,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),E}function ty(e,t){for(var r=[e[0]],n=0,i=t.length;n<i;n+=1)r.push(t[n],e[n+1]);return r}var tx=function(e){return Object.assign(e,{isCss:!0})};function tv(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];return eB(e)||eU(e)?tx(tu(ty(es,h([e],t,!0)))):0===t.length&&1===e.length&&"string"==typeof e[0]?tu(e):tx(tu(ty(e,t)))}var tw=function(e){return function e(t,r,n){if(void 0===n&&(n=el),!r)throw eM(1,r);var i=function(e){for(var i=[],o=1;o<arguments.length;o++)i[o-1]=arguments[o];return t(r,n,tv.apply(void 0,h([e],i,!1)))};return i.attrs=function(i){return e(t,r,p(p({},n),{attrs:Array.prototype.concat(n.attrs,i).filter(Boolean)}))},i.withConfig=function(i){return e(t,r,p(p({},n),i))},i}(tb,e)};ed.forEach(function(e){tw[e]=tw(e)});var tj=function(){function e(e,t){this.rules=e,this.componentId=t,this.isStatic=tf(e),e6.registerId(this.componentId+1)}return e.prototype.createStyles=function(e,t,r,n){var i=n(eL(tu(this.rules,t,r,n)),""),o=this.componentId+e;r.insertRules(o,o,i)},e.prototype.removeStyles=function(e,t){t.clearRules(this.componentId+e)},e.prototype.renderStyles=function(e,t,r,n){e>2&&e6.registerId(this.componentId+e),this.removeStyles(e,r),this.createStyles(e,t,r,n)},e}();function tS(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];var n=eL(tv.apply(void 0,h([e],t,!1)));return new ts(ev(n),n)}function tE(){var e=this;this._emitSheetCSS=function(){var t=e.instance.toString();if(!t)return"";var r=e0(),n=eL([r&&'nonce="'.concat(r,'"'),"".concat(Z,'="true"'),"".concat(et,'="').concat(er,'"')].filter(Boolean)," ");return"<style ".concat(n,">").concat(t,"</style>")},this.getStyleTags=function(){if(e.sealed)throw eM(2);return e._emitSheetCSS()},this.getStyleElement=function(){if(e.sealed)throw eM(2);var t,r=e.instance.toString();if(!r)return[];var n=((t={})[Z]="",t[et]=er,t.dangerouslySetInnerHTML={__html:r},t),i=e0();return i&&(n.nonce=i),[d.default.createElement("style",p({},n,{key:"sc-0-0"}))]},this.seal=function(){e.sealed=!0},this.instance=new e6({isServer:!0}),this.sealed=!1}tE.prototype.collectStyles=function(e){if(this.sealed)throw eM(2);return d.default.createElement(ta,{sheet:this.instance},e)},tE.prototype.interleaveWithNodeStream=function(e){throw eM(3)};var tC=e.i(21837),tO=e.i(95478);let t_=tS`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`,tA=tw.div.withConfig({displayName:"ThankYouCard__Card",componentId:"sc-677354c6-0"})`
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
`,tN=tw.div.withConfig({displayName:"ThankYouCard__IconWrapper",componentId:"sc-677354c6-1"})`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  animation: ${t_} 3s ease-in-out infinite;
  
  @media (max-width: 640px) {
    width: 70px;
    height: 70px;
  }
`,tR=tw.svg.withConfig({displayName:"ThankYouCard__CheckIcon",componentId:"sc-677354c6-2"})`
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
`,tk=tw.h2.withConfig({displayName:"ThankYouCard__Title",componentId:"sc-677354c6-3"})`
  margin: 0;
  color: #0b2b4a;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  
  @media (max-width: 640px) {
    font-size: 1.6rem;
  }
`,tI=tw.p.withConfig({displayName:"ThankYouCard__Message",componentId:"sc-677354c6-4"})`
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
`,tP=tw.p.withConfig({displayName:"ThankYouCard__SubMessage",componentId:"sc-677354c6-5"})`
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
`,tT=tw.div.withConfig({displayName:"ThankYouCard__InfoBox",componentId:"sc-677354c6-6"})`
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
`,tF=tw.p.withConfig({displayName:"ThankYouCard__InfoText",componentId:"sc-677354c6-7"})`
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
`;function tB({lang:e}){let t={en:{title:"Thank You!",message:"Your registration has been successfully submitted.",subMessage:"We've received your information and our team will review it shortly. You'll receive a confirmation email within 24-48 hours.",infoText:"If you have any urgent questions, feel free to contact us at purchasing@pospal.com.au"},zh:{title:"谢谢！",message:"您的注册已成功提交。",subMessage:"我们已收到您的信息，我们的团队将很快进行审核。您将在 24-48 小时内收到确认电子邮件。",infoText:"如果您有任何紧急问题，请随时通过 purchasing@pospal.com.au 联系我们"}}[e];return(0,c.jsxs)(tA,{children:[(0,c.jsx)(tN,{children:(0,c.jsx)(tR,{viewBox:"0 0 24 24",children:(0,c.jsx)("polyline",{points:"20 6 9 17 4 12"})})}),(0,c.jsx)(tk,{children:t.title}),(0,c.jsx)(tI,{children:t.message}),(0,c.jsx)(tP,{children:t.subMessage}),(0,c.jsx)(tT,{children:(0,c.jsx)(tF,{children:t.infoText})})]})}var tz=e.i(54170);function t$(e,t){return function(){return e.apply(t,arguments)}}let{toString:tL}=Object.prototype,{getPrototypeOf:tU}=Object,{iterator:tD,toStringTag:tM}=Symbol,tX=(t=Object.create(null),e=>{let r=tL.call(e);return t[r]||(t[r]=r.slice(8,-1).toLowerCase())}),tq=e=>(e=e.toLowerCase(),t=>tX(t)===e),tW=e=>t=>typeof t===e,{isArray:tY}=Array,tH=tW("undefined");function tG(e){return null!==e&&!tH(e)&&null!==e.constructor&&!tH(e.constructor)&&tK(e.constructor.isBuffer)&&e.constructor.isBuffer(e)}let tJ=tq("ArrayBuffer"),tV=tW("string"),tK=tW("function"),tQ=tW("number"),tZ=e=>null!==e&&"object"==typeof e,t0=e=>{if("object"!==tX(e))return!1;let t=tU(e);return(null===t||t===Object.prototype||null===Object.getPrototypeOf(t))&&!(tM in e)&&!(tD in e)},t1=tq("Date"),t2=tq("File"),t5=tq("Blob"),t3=tq("FileList"),t4=tq("URLSearchParams"),[t8,t6,t9,t7]=["ReadableStream","Request","Response","Headers"].map(tq);function re(e,t,{allOwnKeys:r=!1}={}){let n,i;if(null!=e)if("object"!=typeof e&&(e=[e]),tY(e))for(n=0,i=e.length;n<i;n++)t.call(null,e[n],n,e);else{let i;if(tG(e))return;let o=r?Object.getOwnPropertyNames(e):Object.keys(e),a=o.length;for(n=0;n<a;n++)i=o[n],t.call(null,e[i],i,e)}}function rt(e,t){let r;if(tG(e))return null;t=t.toLowerCase();let n=Object.keys(e),i=n.length;for(;i-- >0;)if(t===(r=n[i]).toLowerCase())return r;return null}let rr="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:e.g,rn=e=>!tH(e)&&e!==rr,ri=(r="undefined"!=typeof Uint8Array&&tU(Uint8Array),e=>r&&e instanceof r),ro=tq("HTMLFormElement"),ra=(({hasOwnProperty:e})=>(t,r)=>e.call(t,r))(Object.prototype),rs=tq("RegExp"),rl=(e,t)=>{let r=Object.getOwnPropertyDescriptors(e),n={};re(r,(r,i)=>{let o;!1!==(o=t(r,i,e))&&(n[i]=o||r)}),Object.defineProperties(e,n)},rc=tq("AsyncFunction"),rd=(o="function"==typeof setImmediate,a=tK(rr.postMessage),o?setImmediate:a?(s=`axios@${Math.random()}`,l=[],rr.addEventListener("message",({source:e,data:t})=>{e===rr&&t===s&&l.length&&l.shift()()},!1),e=>{l.push(e),rr.postMessage(s,"*")}):e=>setTimeout(e)),ru="undefined"!=typeof queueMicrotask?queueMicrotask.bind(rr):void 0!==f.default&&f.default.nextTick||rd,rf={isArray:tY,isArrayBuffer:tJ,isBuffer:tG,isFormData:e=>{let t;return e&&("function"==typeof FormData&&e instanceof FormData||tK(e.append)&&("formdata"===(t=tX(e))||"object"===t&&tK(e.toString)&&"[object FormData]"===e.toString()))},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&tJ(e.buffer)},isString:tV,isNumber:tQ,isBoolean:e=>!0===e||!1===e,isObject:tZ,isPlainObject:t0,isEmptyObject:e=>{if(!tZ(e)||tG(e))return!1;try{return 0===Object.keys(e).length&&Object.getPrototypeOf(e)===Object.prototype}catch(e){return!1}},isReadableStream:t8,isRequest:t6,isResponse:t9,isHeaders:t7,isUndefined:tH,isDate:t1,isFile:t2,isBlob:t5,isRegExp:rs,isFunction:tK,isStream:e=>tZ(e)&&tK(e.pipe),isURLSearchParams:t4,isTypedArray:ri,isFileList:t3,forEach:re,merge:function e(){let{caseless:t,skipUndefined:r}=rn(this)&&this||{},n={},i=(i,o)=>{let a=t&&rt(n,o)||o;t0(n[a])&&t0(i)?n[a]=e(n[a],i):t0(i)?n[a]=e({},i):tY(i)?n[a]=i.slice():r&&tH(i)||(n[a]=i)};for(let e=0,t=arguments.length;e<t;e++)arguments[e]&&re(arguments[e],i);return n},extend:(e,t,r,{allOwnKeys:n}={})=>(re(t,(t,n)=>{r&&tK(t)?e[n]=t$(t,r):e[n]=t},{allOwnKeys:n}),e),trim:e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""),stripBOM:e=>(65279===e.charCodeAt(0)&&(e=e.slice(1)),e),inherits:(e,t,r,n)=>{e.prototype=Object.create(t.prototype,n),e.prototype.constructor=e,Object.defineProperty(e,"super",{value:t.prototype}),r&&Object.assign(e.prototype,r)},toFlatObject:(e,t,r,n)=>{let i,o,a,s={};if(t=t||{},null==e)return t;do{for(o=(i=Object.getOwnPropertyNames(e)).length;o-- >0;)a=i[o],(!n||n(a,e,t))&&!s[a]&&(t[a]=e[a],s[a]=!0);e=!1!==r&&tU(e)}while(e&&(!r||r(e,t))&&e!==Object.prototype)return t},kindOf:tX,kindOfTest:tq,endsWith:(e,t,r)=>{e=String(e),(void 0===r||r>e.length)&&(r=e.length),r-=t.length;let n=e.indexOf(t,r);return -1!==n&&n===r},toArray:e=>{if(!e)return null;if(tY(e))return e;let t=e.length;if(!tQ(t))return null;let r=Array(t);for(;t-- >0;)r[t]=e[t];return r},forEachEntry:(e,t)=>{let r,n=(e&&e[tD]).call(e);for(;(r=n.next())&&!r.done;){let n=r.value;t.call(e,n[0],n[1])}},matchAll:(e,t)=>{let r,n=[];for(;null!==(r=e.exec(t));)n.push(r);return n},isHTMLForm:ro,hasOwnProperty:ra,hasOwnProp:ra,reduceDescriptors:rl,freezeMethods:e=>{rl(e,(t,r)=>{if(tK(e)&&-1!==["arguments","caller","callee"].indexOf(r))return!1;if(tK(e[r])){if(t.enumerable=!1,"writable"in t){t.writable=!1;return}t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+r+"'")})}})},toObjectSet:(e,t)=>{let r={};return(tY(e)?e:String(e).split(t)).forEach(e=>{r[e]=!0}),r},toCamelCase:e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(e,t,r){return t.toUpperCase()+r}),noop:()=>{},toFiniteNumber:(e,t)=>null!=e&&Number.isFinite(e*=1)?e:t,findKey:rt,global:rr,isContextDefined:rn,isSpecCompliantForm:function(e){return!!(e&&tK(e.append)&&"FormData"===e[tM]&&e[tD])},toJSONObject:e=>{let t=Array(10),r=(e,n)=>{if(tZ(e)){if(t.indexOf(e)>=0)return;if(tG(e))return e;if(!("toJSON"in e)){t[n]=e;let i=tY(e)?[]:{};return re(e,(e,t)=>{let o=r(e,n+1);tH(o)||(i[t]=o)}),t[n]=void 0,i}}return e};return r(e,0)},isAsyncFn:rc,isThenable:e=>e&&(tZ(e)||tK(e))&&tK(e.then)&&tK(e.catch),setImmediate:rd,asap:ru,isIterable:e=>null!=e&&tK(e[tD])};var rp=e.i(8568);function rh(e,t,r,n,i){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=Error().stack,this.message=e,this.name="AxiosError",t&&(this.code=t),r&&(this.config=r),n&&(this.request=n),i&&(this.response=i,this.status=i.status?i.status:null)}rf.inherits(rh,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:rf.toJSONObject(this.config),code:this.code,status:this.status}}});let rg=rh.prototype,rm={};function rb(e){return rf.isPlainObject(e)||rf.isArray(e)}function ry(e){return rf.endsWith(e,"[]")?e.slice(0,-2):e}function rx(e,t,r){return e?e.concat(t).map(function(e,t){return e=ry(e),!r&&t?"["+e+"]":e}).join(r?".":""):t}["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach(e=>{rm[e]={value:e}}),Object.defineProperties(rh,rm),Object.defineProperty(rg,"isAxiosError",{value:!0}),rh.from=(e,t,r,n,i,o)=>{let a=Object.create(rg);rf.toFlatObject(e,a,function(e){return e!==Error.prototype},e=>"isAxiosError"!==e);let s=e&&e.message?e.message:"Error",l=null==t&&e?e.code:t;return rh.call(a,s,l,r,n,i),e&&null==a.cause&&Object.defineProperty(a,"cause",{value:e,configurable:!0}),a.name=e&&e.name||"Error",o&&Object.assign(a,o),a};let rv=rf.toFlatObject(rf,{},null,function(e){return/^is[A-Z]/.test(e)}),rw=function(e,t,r){if(!rf.isObject(e))throw TypeError("target must be an object");t=t||new FormData;let n=(r=rf.toFlatObject(r,{metaTokens:!0,dots:!1,indexes:!1},!1,function(e,t){return!rf.isUndefined(t[e])})).metaTokens,i=r.visitor||c,o=r.dots,a=r.indexes,s=(r.Blob||"undefined"!=typeof Blob&&Blob)&&rf.isSpecCompliantForm(t);if(!rf.isFunction(i))throw TypeError("visitor must be a function");function l(e){if(null===e)return"";if(rf.isDate(e))return e.toISOString();if(rf.isBoolean(e))return e.toString();if(!s&&rf.isBlob(e))throw new rh("Blob is not supported. Use a Buffer instead.");return rf.isArrayBuffer(e)||rf.isTypedArray(e)?s&&"function"==typeof Blob?new Blob([e]):rp.Buffer.from(e):e}function c(e,r,i){let s=e;if(e&&!i&&"object"==typeof e)if(rf.endsWith(r,"{}"))r=n?r:r.slice(0,-2),e=JSON.stringify(e);else{var c;if(rf.isArray(e)&&(c=e,rf.isArray(c)&&!c.some(rb))||(rf.isFileList(e)||rf.endsWith(r,"[]"))&&(s=rf.toArray(e)))return r=ry(r),s.forEach(function(e,n){rf.isUndefined(e)||null===e||t.append(!0===a?rx([r],n,o):null===a?r:r+"[]",l(e))}),!1}return!!rb(e)||(t.append(rx(i,r,o),l(e)),!1)}let d=[],u=Object.assign(rv,{defaultVisitor:c,convertValue:l,isVisitable:rb});if(!rf.isObject(e))throw TypeError("data must be an object");return!function e(r,n){if(!rf.isUndefined(r)){if(-1!==d.indexOf(r))throw Error("Circular reference detected in "+n.join("."));d.push(r),rf.forEach(r,function(r,o){!0===(!(rf.isUndefined(r)||null===r)&&i.call(t,r,rf.isString(o)?o.trim():o,n,u))&&e(r,n?n.concat(o):[o])}),d.pop()}}(e),t};function rj(e){let t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g,function(e){return t[e]})}function rS(e,t){this._pairs=[],e&&rw(e,this,t)}let rE=rS.prototype;function rC(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function rO(e,t,r){let n;if(!t)return e;let i=r&&r.encode||rC;rf.isFunction(r)&&(r={serialize:r});let o=r&&r.serialize;if(n=o?o(t,r):rf.isURLSearchParams(t)?t.toString():new rS(t,r).toString(i)){let t=e.indexOf("#");-1!==t&&(e=e.slice(0,t)),e+=(-1===e.indexOf("?")?"?":"&")+n}return e}rE.append=function(e,t){this._pairs.push([e,t])},rE.toString=function(e){let t=e?function(t){return e.call(this,t,rj)}:rj;return this._pairs.map(function(e){return t(e[0])+"="+t(e[1])},"").join("&")};let r_=class{constructor(){this.handlers=[]}use(e,t,r){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!r&&r.synchronous,runWhen:r?r.runWhen:null}),this.handlers.length-1}eject(e){this.handlers[e]&&(this.handlers[e]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(e){rf.forEach(this.handlers,function(t){null!==t&&e(t)})}},rA={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},rN="undefined"!=typeof URLSearchParams?URLSearchParams:rS,rR="undefined"!=typeof FormData?FormData:null,rk="undefined"!=typeof Blob?Blob:null,rI="undefined"!=typeof window&&"undefined"!=typeof document,rP="object"==typeof navigator&&navigator||void 0,rT=rI&&(!rP||0>["ReactNative","NativeScript","NS"].indexOf(rP.product)),rF="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&"function"==typeof self.importScripts,rB=rI&&window.location.href||"http://localhost";e.s(["hasBrowserEnv",()=>rI,"hasStandardBrowserEnv",()=>rT,"hasStandardBrowserWebWorkerEnv",()=>rF,"navigator",()=>rP,"origin",()=>rB],96267);let rz={...e.i(96267),isBrowser:!0,classes:{URLSearchParams:rN,FormData:rR,Blob:rk},protocols:["http","https","file","blob","url","data"]},r$=function(e){if(rf.isFormData(e)&&rf.isFunction(e.entries)){let t={};return rf.forEachEntry(e,(e,r)=>{!function e(t,r,n,i){let o=t[i++];if("__proto__"===o)return!0;let a=Number.isFinite(+o),s=i>=t.length;return(o=!o&&rf.isArray(n)?n.length:o,s)?rf.hasOwnProp(n,o)?n[o]=[n[o],r]:n[o]=r:(n[o]&&rf.isObject(n[o])||(n[o]=[]),e(t,r,n[o],i)&&rf.isArray(n[o])&&(n[o]=function(e){let t,r,n={},i=Object.keys(e),o=i.length;for(t=0;t<o;t++)n[r=i[t]]=e[r];return n}(n[o]))),!a}(rf.matchAll(/\w+|\[(\w*)]/g,e).map(e=>"[]"===e[0]?"":e[1]||e[0]),r,t,0)}),t}return null},rL={transitional:rA,adapter:["xhr","http","fetch"],transformRequest:[function(e,t){let r,n=t.getContentType()||"",i=n.indexOf("application/json")>-1,o=rf.isObject(e);if(o&&rf.isHTMLForm(e)&&(e=new FormData(e)),rf.isFormData(e))return i?JSON.stringify(r$(e)):e;if(rf.isArrayBuffer(e)||rf.isBuffer(e)||rf.isStream(e)||rf.isFile(e)||rf.isBlob(e)||rf.isReadableStream(e))return e;if(rf.isArrayBufferView(e))return e.buffer;if(rf.isURLSearchParams(e))return t.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),e.toString();if(o){if(n.indexOf("application/x-www-form-urlencoded")>-1){var a,s;return(a=e,s=this.formSerializer,rw(a,new rz.classes.URLSearchParams,{visitor:function(e,t,r,n){return rz.isNode&&rf.isBuffer(e)?(this.append(t,e.toString("base64")),!1):n.defaultVisitor.apply(this,arguments)},...s})).toString()}if((r=rf.isFileList(e))||n.indexOf("multipart/form-data")>-1){let t=this.env&&this.env.FormData;return rw(r?{"files[]":e}:e,t&&new t,this.formSerializer)}}if(o||i){t.setContentType("application/json",!1);var l=e;if(rf.isString(l))try{return(0,JSON.parse)(l),rf.trim(l)}catch(e){if("SyntaxError"!==e.name)throw e}return(0,JSON.stringify)(l)}return e}],transformResponse:[function(e){let t=this.transitional||rL.transitional,r=t&&t.forcedJSONParsing,n="json"===this.responseType;if(rf.isResponse(e)||rf.isReadableStream(e))return e;if(e&&rf.isString(e)&&(r&&!this.responseType||n)){let r=t&&t.silentJSONParsing;try{return JSON.parse(e,this.parseReviver)}catch(e){if(!r&&n){if("SyntaxError"===e.name)throw rh.from(e,rh.ERR_BAD_RESPONSE,this,null,this.response);throw e}}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:rz.classes.FormData,Blob:rz.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};rf.forEach(["delete","get","head","post","put","patch"],e=>{rL.headers[e]={}});let rU=rf.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),rD=Symbol("internals");function rM(e){return e&&String(e).trim().toLowerCase()}function rX(e){return!1===e||null==e?e:rf.isArray(e)?e.map(rX):String(e)}function rq(e,t,r,n,i){if(rf.isFunction(n))return n.call(this,t,r);if(i&&(t=r),rf.isString(t)){if(rf.isString(n))return -1!==t.indexOf(n);if(rf.isRegExp(n))return n.test(t)}}class rW{constructor(e){e&&this.set(e)}set(e,t,r){let n=this;function i(e,t,r){let i=rM(t);if(!i)throw Error("header name must be a non-empty string");let o=rf.findKey(n,i);o&&void 0!==n[o]&&!0!==r&&(void 0!==r||!1===n[o])||(n[o||t]=rX(e))}let o=(e,t)=>rf.forEach(e,(e,r)=>i(e,r,t));if(rf.isPlainObject(e)||e instanceof this.constructor)o(e,t);else{let n;if(rf.isString(e)&&(e=e.trim())&&(n=e,!/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(n.trim()))){var a;let r,n,i,s;o((s={},(a=e)&&a.split("\n").forEach(function(e){i=e.indexOf(":"),r=e.substring(0,i).trim().toLowerCase(),n=e.substring(i+1).trim(),!r||s[r]&&rU[r]||("set-cookie"===r?s[r]?s[r].push(n):s[r]=[n]:s[r]=s[r]?s[r]+", "+n:n)}),s),t)}else if(rf.isObject(e)&&rf.isIterable(e)){let r={},n,i;for(let t of e){if(!rf.isArray(t))throw TypeError("Object iterator must return a key-value pair");r[i=t[0]]=(n=r[i])?rf.isArray(n)?[...n,t[1]]:[n,t[1]]:t[1]}o(r,t)}else null!=e&&i(t,e,r)}return this}get(e,t){if(e=rM(e)){let r=rf.findKey(this,e);if(r){let e=this[r];if(!t)return e;if(!0===t){let t,r=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;for(;t=n.exec(e);)r[t[1]]=t[2];return r}if(rf.isFunction(t))return t.call(this,e,r);if(rf.isRegExp(t))return t.exec(e);throw TypeError("parser must be boolean|regexp|function")}}}has(e,t){if(e=rM(e)){let r=rf.findKey(this,e);return!!(r&&void 0!==this[r]&&(!t||rq(this,this[r],r,t)))}return!1}delete(e,t){let r=this,n=!1;function i(e){if(e=rM(e)){let i=rf.findKey(r,e);i&&(!t||rq(r,r[i],i,t))&&(delete r[i],n=!0)}}return rf.isArray(e)?e.forEach(i):i(e),n}clear(e){let t=Object.keys(this),r=t.length,n=!1;for(;r--;){let i=t[r];(!e||rq(this,this[i],i,e,!0))&&(delete this[i],n=!0)}return n}normalize(e){let t=this,r={};return rf.forEach(this,(n,i)=>{let o=rf.findKey(r,i);if(o){t[o]=rX(n),delete t[i];return}let a=e?i.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(e,t,r)=>t.toUpperCase()+r):String(i).trim();a!==i&&delete t[i],t[a]=rX(n),r[a]=!0}),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){let t=Object.create(null);return rf.forEach(this,(r,n)=>{null!=r&&!1!==r&&(t[n]=e&&rf.isArray(r)?r.join(", "):r)}),t}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([e,t])=>e+": "+t).join("\n")}getSetCookie(){return this.get("set-cookie")||[]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(e){return e instanceof this?e:new this(e)}static concat(e,...t){let r=new this(e);return t.forEach(e=>r.set(e)),r}static accessor(e){let t=(this[rD]=this[rD]={accessors:{}}).accessors,r=this.prototype;function n(e){let n=rM(e);if(!t[n]){let i;i=rf.toCamelCase(" "+e),["get","set","has"].forEach(t=>{Object.defineProperty(r,t+i,{value:function(r,n,i){return this[t].call(this,e,r,n,i)},configurable:!0})}),t[n]=!0}}return rf.isArray(e)?e.forEach(n):n(e),this}}function rY(e,t){let r=this||rL,n=t||r,i=rW.from(n.headers),o=n.data;return rf.forEach(e,function(e){o=e.call(r,o,i.normalize(),t?t.status:void 0)}),i.normalize(),o}function rH(e){return!!(e&&e.__CANCEL__)}function rG(e,t,r){rh.call(this,null==e?"canceled":e,rh.ERR_CANCELED,t,r),this.name="CanceledError"}function rJ(e,t,r){let n=r.config.validateStatus;!r.status||!n||n(r.status)?e(r):t(new rh("Request failed with status code "+r.status,[rh.ERR_BAD_REQUEST,rh.ERR_BAD_RESPONSE][Math.floor(r.status/100)-4],r.config,r.request,r))}rW.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]),rf.reduceDescriptors(rW.prototype,({value:e},t)=>{let r=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(e){this[r]=e}}}),rf.freezeMethods(rW),rf.inherits(rG,rh,{__CANCEL__:!0});let rV=function(e,t){let r,n=Array(e=e||10),i=Array(e),o=0,a=0;return t=void 0!==t?t:1e3,function(s){let l=Date.now(),c=i[a];r||(r=l),n[o]=s,i[o]=l;let d=a,u=0;for(;d!==o;)u+=n[d++],d%=e;if((o=(o+1)%e)===a&&(a=(a+1)%e),l-r<t)return;let f=c&&l-c;return f?Math.round(1e3*u/f):void 0}},rK=function(e,t){let r,n,i=0,o=1e3/t,a=(t,o=Date.now())=>{i=o,r=null,n&&(clearTimeout(n),n=null),e(...t)};return[(...e)=>{let t=Date.now(),s=t-i;s>=o?a(e,t):(r=e,n||(n=setTimeout(()=>{n=null,a(r)},o-s)))},()=>r&&a(r)]},rQ=(e,t,r=3)=>{let n=0,i=rV(50,250);return rK(r=>{let o=r.loaded,a=r.lengthComputable?r.total:void 0,s=o-n,l=i(s);n=o,e({loaded:o,total:a,progress:a?o/a:void 0,bytes:s,rate:l||void 0,estimated:l&&a&&o<=a?(a-o)/l:void 0,event:r,lengthComputable:null!=a,[t?"download":"upload"]:!0})},r)},rZ=(e,t)=>{let r=null!=e;return[n=>t[0]({lengthComputable:r,total:e,loaded:n}),t[1]]},r0=e=>(...t)=>rf.asap(()=>e(...t)),r1=rz.hasStandardBrowserEnv?(n=new URL(rz.origin),i=rz.navigator&&/(msie|trident)/i.test(rz.navigator.userAgent),e=>(e=new URL(e,rz.origin),n.protocol===e.protocol&&n.host===e.host&&(i||n.port===e.port))):()=>!0,r2=rz.hasStandardBrowserEnv?{write(e,t,r,n,i,o,a){if("undefined"==typeof document)return;let s=[`${e}=${encodeURIComponent(t)}`];rf.isNumber(r)&&s.push(`expires=${new Date(r).toUTCString()}`),rf.isString(n)&&s.push(`path=${n}`),rf.isString(i)&&s.push(`domain=${i}`),!0===o&&s.push("secure"),rf.isString(a)&&s.push(`SameSite=${a}`),document.cookie=s.join("; ")},read(e){if("undefined"==typeof document)return null;let t=document.cookie.match(RegExp("(?:^|; )"+e+"=([^;]*)"));return t?decodeURIComponent(t[1]):null},remove(e){this.write(e,"",Date.now()-864e5,"/")}}:{write(){},read:()=>null,remove(){}};function r5(e,t,r){let n=!/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t);return e&&(n||!1==r)?t?e.replace(/\/?\/$/,"")+"/"+t.replace(/^\/+/,""):e:t}let r3=e=>e instanceof rW?{...e}:e;function r4(e,t){t=t||{};let r={};function n(e,t,r,n){return rf.isPlainObject(e)&&rf.isPlainObject(t)?rf.merge.call({caseless:n},e,t):rf.isPlainObject(t)?rf.merge({},t):rf.isArray(t)?t.slice():t}function i(e,t,r,i){return rf.isUndefined(t)?rf.isUndefined(e)?void 0:n(void 0,e,r,i):n(e,t,r,i)}function o(e,t){if(!rf.isUndefined(t))return n(void 0,t)}function a(e,t){return rf.isUndefined(t)?rf.isUndefined(e)?void 0:n(void 0,e):n(void 0,t)}function s(r,i,o){return o in t?n(r,i):o in e?n(void 0,r):void 0}let l={url:o,method:o,data:o,baseURL:a,transformRequest:a,transformResponse:a,paramsSerializer:a,timeout:a,timeoutMessage:a,withCredentials:a,withXSRFToken:a,adapter:a,responseType:a,xsrfCookieName:a,xsrfHeaderName:a,onUploadProgress:a,onDownloadProgress:a,decompress:a,maxContentLength:a,maxBodyLength:a,beforeRedirect:a,transport:a,httpAgent:a,httpsAgent:a,cancelToken:a,socketPath:a,responseEncoding:a,validateStatus:s,headers:(e,t,r)=>i(r3(e),r3(t),r,!0)};return rf.forEach(Object.keys({...e,...t}),function(n){let o=l[n]||i,a=o(e[n],t[n],n);rf.isUndefined(a)&&o!==s||(r[n]=a)}),r}let r8=e=>{let t=r4({},e),{data:r,withXSRFToken:n,xsrfHeaderName:i,xsrfCookieName:o,headers:a,auth:s}=t;if(t.headers=a=rW.from(a),t.url=rO(r5(t.baseURL,t.url,t.allowAbsoluteUrls),e.params,e.paramsSerializer),s&&a.set("Authorization","Basic "+btoa((s.username||"")+":"+(s.password?unescape(encodeURIComponent(s.password)):""))),rf.isFormData(r)){if(rz.hasStandardBrowserEnv||rz.hasStandardBrowserWebWorkerEnv)a.setContentType(void 0);else if(rf.isFunction(r.getHeaders)){let e=r.getHeaders(),t=["content-type","content-length"];Object.entries(e).forEach(([e,r])=>{t.includes(e.toLowerCase())&&a.set(e,r)})}}if(rz.hasStandardBrowserEnv&&(n&&rf.isFunction(n)&&(n=n(t)),n||!1!==n&&r1(t.url))){let e=i&&o&&r2.read(o);e&&a.set(i,e)}return t},r6="undefined"!=typeof XMLHttpRequest&&function(e){return new Promise(function(t,r){var n;let i,o,a,s,l,c,d=r8(e),u=d.data,f=rW.from(d.headers).normalize(),{responseType:p,onUploadProgress:h,onDownloadProgress:g}=d;function m(){s&&s(),l&&l(),d.cancelToken&&d.cancelToken.unsubscribe(i),d.signal&&d.signal.removeEventListener("abort",i)}let b=new XMLHttpRequest;function y(){if(!b)return;let n=rW.from("getAllResponseHeaders"in b&&b.getAllResponseHeaders());rJ(function(e){t(e),m()},function(e){r(e),m()},{data:p&&"text"!==p&&"json"!==p?b.response:b.responseText,status:b.status,statusText:b.statusText,headers:n,config:e,request:b}),b=null}b.open(d.method.toUpperCase(),d.url,!0),b.timeout=d.timeout,"onloadend"in b?b.onloadend=y:b.onreadystatechange=function(){!b||4!==b.readyState||(0!==b.status||b.responseURL&&0===b.responseURL.indexOf("file:"))&&setTimeout(y)},b.onabort=function(){b&&(r(new rh("Request aborted",rh.ECONNABORTED,e,b)),b=null)},b.onerror=function(t){let n=new rh(t&&t.message?t.message:"Network Error",rh.ERR_NETWORK,e,b);n.event=t||null,r(n),b=null},b.ontimeout=function(){let t=d.timeout?"timeout of "+d.timeout+"ms exceeded":"timeout exceeded",n=d.transitional||rA;d.timeoutErrorMessage&&(t=d.timeoutErrorMessage),r(new rh(t,n.clarifyTimeoutError?rh.ETIMEDOUT:rh.ECONNABORTED,e,b)),b=null},void 0===u&&f.setContentType(null),"setRequestHeader"in b&&rf.forEach(f.toJSON(),function(e,t){b.setRequestHeader(t,e)}),rf.isUndefined(d.withCredentials)||(b.withCredentials=!!d.withCredentials),p&&"json"!==p&&(b.responseType=d.responseType),g&&([a,l]=rQ(g,!0),b.addEventListener("progress",a)),h&&b.upload&&([o,s]=rQ(h),b.upload.addEventListener("progress",o),b.upload.addEventListener("loadend",s)),(d.cancelToken||d.signal)&&(i=t=>{b&&(r(!t||t.type?new rG(null,e,b):t),b.abort(),b=null)},d.cancelToken&&d.cancelToken.subscribe(i),d.signal&&(d.signal.aborted?i():d.signal.addEventListener("abort",i)));let x=(n=d.url,(c=/^([-+\w]{1,25})(:?\/\/|:)/.exec(n))&&c[1]||"");x&&-1===rz.protocols.indexOf(x)?r(new rh("Unsupported protocol "+x+":",rh.ERR_BAD_REQUEST,e)):b.send(u||null)})},r9=function*(e,t){let r,n=e.byteLength;if(!t||n<t)return void(yield e);let i=0;for(;i<n;)r=i+t,yield e.slice(i,r),i=r},r7=async function*(e,t){for await(let r of ne(e))yield*r9(r,t)},ne=async function*(e){if(e[Symbol.asyncIterator])return void(yield*e);let t=e.getReader();try{for(;;){let{done:e,value:r}=await t.read();if(e)break;yield r}}finally{await t.cancel()}},nt=(e,t,r,n)=>{let i,o=r7(e,t),a=0,s=e=>{!i&&(i=!0,n&&n(e))};return new ReadableStream({async pull(e){try{let{done:t,value:n}=await o.next();if(t){s(),e.close();return}let i=n.byteLength;if(r){let e=a+=i;r(e)}e.enqueue(new Uint8Array(n))}catch(e){throw s(e),e}},cancel:e=>(s(e),o.return())},{highWaterMark:2})},{isFunction:nr}=rf,nn=(({Request:e,Response:t})=>({Request:e,Response:t}))(rf.global),{ReadableStream:ni,TextEncoder:no}=rf.global,na=(e,...t)=>{try{return!!e(...t)}catch(e){return!1}},ns=e=>{let t,{fetch:r,Request:n,Response:i}=e=rf.merge.call({skipUndefined:!0},nn,e),o=r?nr(r):"function"==typeof fetch,a=nr(n),s=nr(i);if(!o)return!1;let l=o&&nr(ni),c=o&&("function"==typeof no?(t=new no,e=>t.encode(e)):async e=>new Uint8Array(await new n(e).arrayBuffer())),d=a&&l&&na(()=>{let e=!1,t=new n(rz.origin,{body:new ni,method:"POST",get duplex(){return e=!0,"half"}}).headers.has("Content-Type");return e&&!t}),u=s&&l&&na(()=>rf.isReadableStream(new i("").body)),f={stream:u&&(e=>e.body)};o&&["text","arrayBuffer","blob","formData","stream"].forEach(e=>{f[e]||(f[e]=(t,r)=>{let n=t&&t[e];if(n)return n.call(t);throw new rh(`Response type '${e}' is not supported`,rh.ERR_NOT_SUPPORT,r)})});let p=async e=>{if(null==e)return 0;if(rf.isBlob(e))return e.size;if(rf.isSpecCompliantForm(e)){let t=new n(rz.origin,{method:"POST",body:e});return(await t.arrayBuffer()).byteLength}return rf.isArrayBufferView(e)||rf.isArrayBuffer(e)?e.byteLength:(rf.isURLSearchParams(e)&&(e+=""),rf.isString(e))?(await c(e)).byteLength:void 0},h=async(e,t)=>{let r=rf.toFiniteNumber(e.getContentLength());return null==r?p(t):r};return async e=>{let t,{url:o,method:s,data:l,signal:c,cancelToken:p,timeout:g,onDownloadProgress:m,onUploadProgress:b,responseType:y,headers:x,withCredentials:v="same-origin",fetchOptions:w}=r8(e),j=r||fetch;y=y?(y+"").toLowerCase():"text";let S=((e,t)=>{let{length:r}=e=e?e.filter(Boolean):[];if(t||r){let r,n=new AbortController,i=function(e){if(!r){r=!0,a();let t=e instanceof Error?e:this.reason;n.abort(t instanceof rh?t:new rG(t instanceof Error?t.message:t))}},o=t&&setTimeout(()=>{o=null,i(new rh(`timeout ${t} of ms exceeded`,rh.ETIMEDOUT))},t),a=()=>{e&&(o&&clearTimeout(o),o=null,e.forEach(e=>{e.unsubscribe?e.unsubscribe(i):e.removeEventListener("abort",i)}),e=null)};e.forEach(e=>e.addEventListener("abort",i));let{signal:s}=n;return s.unsubscribe=()=>rf.asap(a),s}})([c,p&&p.toAbortSignal()],g),E=null,C=S&&S.unsubscribe&&(()=>{S.unsubscribe()});try{if(b&&d&&"get"!==s&&"head"!==s&&0!==(t=await h(x,l))){let e,r=new n(o,{method:"POST",body:l,duplex:"half"});if(rf.isFormData(l)&&(e=r.headers.get("content-type"))&&x.setContentType(e),r.body){let[e,n]=rZ(t,rQ(r0(b)));l=nt(r.body,65536,e,n)}}rf.isString(v)||(v=v?"include":"omit");let r=a&&"credentials"in n.prototype,c={...w,signal:S,method:s.toUpperCase(),headers:x.normalize().toJSON(),body:l,duplex:"half",credentials:r?v:void 0};E=a&&new n(o,c);let p=await (a?j(E,w):j(o,c)),g=u&&("stream"===y||"response"===y);if(u&&(m||g&&C)){let e={};["status","statusText","headers"].forEach(t=>{e[t]=p[t]});let t=rf.toFiniteNumber(p.headers.get("content-length")),[r,n]=m&&rZ(t,rQ(r0(m),!0))||[];p=new i(nt(p.body,65536,r,()=>{n&&n(),C&&C()}),e)}y=y||"text";let O=await f[rf.findKey(f,y)||"text"](p,e);return!g&&C&&C(),await new Promise((t,r)=>{rJ(t,r,{data:O,headers:rW.from(p.headers),status:p.status,statusText:p.statusText,config:e,request:E})})}catch(t){if(C&&C(),t&&"TypeError"===t.name&&/Load failed|fetch/i.test(t.message))throw Object.assign(new rh("Network Error",rh.ERR_NETWORK,e,E),{cause:t.cause||t});throw rh.from(t,t&&t.code,e,E)}}},nl=new Map,nc=e=>{let t=e&&e.env||{},{fetch:r,Request:n,Response:i}=t,o=[n,i,r],a=o.length,s,l,c=nl;for(;a--;)s=o[a],void 0===(l=c.get(s))&&c.set(s,l=a?new Map:ns(t)),c=l;return l};nc();let nd={http:null,xhr:r6,fetch:{get:nc}};rf.forEach(nd,(e,t)=>{if(e){try{Object.defineProperty(e,"name",{value:t})}catch(e){}Object.defineProperty(e,"adapterName",{value:t})}});let nu=e=>`- ${e}`,nf=e=>rf.isFunction(e)||null===e||!1===e,np=function(e,t){let r,n,{length:i}=e=rf.isArray(e)?e:[e],o={};for(let a=0;a<i;a++){let i;if(n=r=e[a],!nf(r)&&void 0===(n=nd[(i=String(r)).toLowerCase()]))throw new rh(`Unknown adapter '${i}'`);if(n&&(rf.isFunction(n)||(n=n.get(t))))break;o[i||"#"+a]=n}if(!n){let e=Object.entries(o).map(([e,t])=>`adapter ${e} `+(!1===t?"is not supported by the environment":"is not available in the build"));throw new rh("There is no suitable adapter to dispatch the request "+(i?e.length>1?"since :\n"+e.map(nu).join("\n"):" "+nu(e[0]):"as no adapter specified"),"ERR_NOT_SUPPORT")}return n};function nh(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new rG(null,e)}function ng(e){return nh(e),e.headers=rW.from(e.headers),e.data=rY.call(e,e.transformRequest),-1!==["post","put","patch"].indexOf(e.method)&&e.headers.setContentType("application/x-www-form-urlencoded",!1),np(e.adapter||rL.adapter,e)(e).then(function(t){return nh(e),t.data=rY.call(e,e.transformResponse,t),t.headers=rW.from(t.headers),t},function(t){return!rH(t)&&(nh(e),t&&t.response&&(t.response.data=rY.call(e,e.transformResponse,t.response),t.response.headers=rW.from(t.response.headers))),Promise.reject(t)})}let nm="1.13.2",nb={};["object","boolean","number","function","string","symbol"].forEach((e,t)=>{nb[e]=function(r){return typeof r===e||"a"+(t<1?"n ":" ")+e}});let ny={};nb.transitional=function(e,t,r){function n(e,t){return"[Axios v"+nm+"] Transitional option '"+e+"'"+t+(r?". "+r:"")}return(r,i,o)=>{if(!1===e)throw new rh(n(i," has been removed"+(t?" in "+t:"")),rh.ERR_DEPRECATED);return t&&!ny[i]&&(ny[i]=!0,console.warn(n(i," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(r,i,o)}},nb.spelling=function(e){return(t,r)=>(console.warn(`${r} is likely a misspelling of ${e}`),!0)};let nx=function(e,t,r){if("object"!=typeof e)throw new rh("options must be an object",rh.ERR_BAD_OPTION_VALUE);let n=Object.keys(e),i=n.length;for(;i-- >0;){let o=n[i],a=t[o];if(a){let t=e[o],r=void 0===t||a(t,o,e);if(!0!==r)throw new rh("option "+o+" must be "+r,rh.ERR_BAD_OPTION_VALUE);continue}if(!0!==r)throw new rh("Unknown option "+o,rh.ERR_BAD_OPTION)}};class nv{constructor(e){this.defaults=e||{},this.interceptors={request:new r_,response:new r_}}async request(e,t){try{return await this._request(e,t)}catch(e){if(e instanceof Error){let t={};Error.captureStackTrace?Error.captureStackTrace(t):t=Error();let r=t.stack?t.stack.replace(/^.+\n/,""):"";try{e.stack?r&&!String(e.stack).endsWith(r.replace(/^.+\n.+\n/,""))&&(e.stack+="\n"+r):e.stack=r}catch(e){}}throw e}}_request(e,t){let r,n;"string"==typeof e?(t=t||{}).url=e:t=e||{};let{transitional:i,paramsSerializer:o,headers:a}=t=r4(this.defaults,t);void 0!==i&&nx(i,{silentJSONParsing:nb.transitional(nb.boolean),forcedJSONParsing:nb.transitional(nb.boolean),clarifyTimeoutError:nb.transitional(nb.boolean)},!1),null!=o&&(rf.isFunction(o)?t.paramsSerializer={serialize:o}:nx(o,{encode:nb.function,serialize:nb.function},!0)),void 0!==t.allowAbsoluteUrls||(void 0!==this.defaults.allowAbsoluteUrls?t.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:t.allowAbsoluteUrls=!0),nx(t,{baseUrl:nb.spelling("baseURL"),withXsrfToken:nb.spelling("withXSRFToken")},!0),t.method=(t.method||this.defaults.method||"get").toLowerCase();let s=a&&rf.merge(a.common,a[t.method]);a&&rf.forEach(["delete","get","head","post","put","patch","common"],e=>{delete a[e]}),t.headers=rW.concat(s,a);let l=[],c=!0;this.interceptors.request.forEach(function(e){("function"!=typeof e.runWhen||!1!==e.runWhen(t))&&(c=c&&e.synchronous,l.unshift(e.fulfilled,e.rejected))});let d=[];this.interceptors.response.forEach(function(e){d.push(e.fulfilled,e.rejected)});let u=0;if(!c){let e=[ng.bind(this),void 0];for(e.unshift(...l),e.push(...d),n=e.length,r=Promise.resolve(t);u<n;)r=r.then(e[u++],e[u++]);return r}n=l.length;let f=t;for(;u<n;){let e=l[u++],t=l[u++];try{f=e(f)}catch(e){t.call(this,e);break}}try{r=ng.call(this,f)}catch(e){return Promise.reject(e)}for(u=0,n=d.length;u<n;)r=r.then(d[u++],d[u++]);return r}getUri(e){return rO(r5((e=r4(this.defaults,e)).baseURL,e.url,e.allowAbsoluteUrls),e.params,e.paramsSerializer)}}rf.forEach(["delete","get","head","options"],function(e){nv.prototype[e]=function(t,r){return this.request(r4(r||{},{method:e,url:t,data:(r||{}).data}))}}),rf.forEach(["post","put","patch"],function(e){function t(t){return function(r,n,i){return this.request(r4(i||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:r,data:n}))}}nv.prototype[e]=t(),nv.prototype[e+"Form"]=t(!0)});class nw{constructor(e){let t;if("function"!=typeof e)throw TypeError("executor must be a function.");this.promise=new Promise(function(e){t=e});const r=this;this.promise.then(e=>{if(!r._listeners)return;let t=r._listeners.length;for(;t-- >0;)r._listeners[t](e);r._listeners=null}),this.promise.then=e=>{let t,n=new Promise(e=>{r.subscribe(e),t=e}).then(e);return n.cancel=function(){r.unsubscribe(t)},n},e(function(e,n,i){r.reason||(r.reason=new rG(e,n,i),t(r.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;let t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}toAbortSignal(){let e=new AbortController,t=t=>{e.abort(t)};return this.subscribe(t),e.signal.unsubscribe=()=>this.unsubscribe(t),e.signal}static source(){let e;return{token:new nw(function(t){e=t}),cancel:e}}}let nj={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511,WebServerIsDown:521,ConnectionTimedOut:522,OriginIsUnreachable:523,TimeoutOccurred:524,SslHandshakeFailed:525,InvalidSslCertificate:526};Object.entries(nj).forEach(([e,t])=>{nj[t]=e});let nS=function e(t){let r=new nv(t),n=t$(nv.prototype.request,r);return rf.extend(n,nv.prototype,r,{allOwnKeys:!0}),rf.extend(n,r,null,{allOwnKeys:!0}),n.create=function(r){return e(r4(t,r))},n}(rL);nS.Axios=nv,nS.CanceledError=rG,nS.CancelToken=nw,nS.isCancel=rH,nS.VERSION=nm,nS.toFormData=rw,nS.AxiosError=rh,nS.Cancel=nS.CanceledError,nS.all=function(e){return Promise.all(e)},nS.spread=function(e){return function(t){return e.apply(null,t)}},nS.isAxiosError=function(e){return rf.isObject(e)&&!0===e.isAxiosError},nS.mergeConfig=r4,nS.AxiosHeaders=rW,nS.formToJSON=e=>r$(rf.isHTMLForm(e)?new FormData(e):e),nS.getAdapter=np,nS.HttpStatusCode=nj,nS.default=nS;let nE={en:tC.default,zh:tO.default},nC=tS`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`,nO=tS`
  from { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
  to { 
    opacity: 0; 
    transform: translateX(-50%) scale(0.9); 
  }
`,n_=tS`
  from { 
    opacity: 0; 
    transform: translateX(50%) scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
`;tS`
  0%, 100% { 
    box-shadow: 0 8px 20px rgba(43,123,227,0.18), 0 0 0 0 rgba(43,123,227,0.4);
  }
  50% { 
    box-shadow: 0 12px 28px rgba(43,123,227,0.25), 0 0 0 8px rgba(43,123,227,0);
  }
`;let nA=tS`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,nN=tS`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`,nR=tS`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
`,nk=tS`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 12px rgba(231, 76, 60, 0);
  }
`,nI=tw.div.withConfig({displayName:"OnboardingForm__StatusCard",componentId:"sc-e9894832-0"})`
  text-align: center;
  padding: 4rem 2rem;
  animation: ${nN} 500ms ease both;
`;tw.div.withConfig({displayName:"OnboardingForm__StatusIcon",componentId:"sc-e9894832-1"})`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  ${e=>"loading"===e.$type&&`
    animation: ${nA} 2s linear infinite;
  `}
  ${e=>"error"===e.$type&&`
    animation: ${nR} 0.6s ease-in-out;
  `}
`;let nP=tw.div.withConfig({displayName:"OnboardingForm__WarningIconWrapper",componentId:"sc-e9894832-2"})`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
  animation: ${nR} 0.6s ease-in-out, ${nN} 500ms ease both;
`,nT=tw.div.withConfig({displayName:"OnboardingForm__WarningIconCircle",componentId:"sc-e9894832-3"})`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(255, 107, 107, 0.1));
  border-radius: 50%;
  animation: ${nk} 2s ease-in-out infinite;
`,nF=tw.svg.withConfig({displayName:"OnboardingForm__WarningIconSvg",componentId:"sc-e9894832-4"})`
  position: relative;
  z-index: 1;
  width: 64px;
  height: 64px;
  filter: drop-shadow(0 4px 12px rgba(231, 76, 60, 0.3));
`,nB=tw.div.withConfig({displayName:"OnboardingForm__StatusTitle",componentId:"sc-e9894832-5"})`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${e=>"error"===e.$type?"#e74c3c":"#2b7be3"};
`,nz=tw.div.withConfig({displayName:"OnboardingForm__StatusMessage",componentId:"sc-e9894832-6"})`
  color: #567;
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
`,n$=tw.div.withConfig({displayName:"OnboardingForm__InfoBox",componentId:"sc-e9894832-7"})`
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
`,nL=tw.div.withConfig({displayName:"OnboardingForm__Spinner",componentId:"sc-e9894832-8"})`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(43,123,227,0.15);
  border-top-color: #2b7be3;
  border-radius: 50%;
  animation: ${nA} 0.8s linear infinite;
  margin: 0 auto 1.5rem;
`,nU=(function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];var n=tv.apply(void 0,h([e],t,!1)),i="sc-global-".concat(ev(JSON.stringify(n))),o=new tj(n,i),a=function(e){var t=to(),r=d.default.useContext(tg),n=d.default.useRef(t.styleSheet.allocateGSInstance(i)).current;return t.styleSheet.server&&s(n,e,t.styleSheet,r,t.stylis),d.default.useLayoutEffect(function(){if(!t.styleSheet.server)return s(n,e,t.styleSheet,r,t.stylis),function(){return o.removeStyles(n,t.styleSheet)}},[n,e,t.styleSheet,r,t.stylis]),null};function s(e,t,r,n,i){if(o.isStatic)o.renderStyles(e,ea,r,i);else{var s=p(p({},t),{theme:ec(t,n,a.defaultProps)});o.renderStyles(e,s,r,i)}}return d.default.memo(a)})`
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
`,nD=tw.section.withConfig({displayName:"OnboardingForm__Container",componentId:"sc-e9894832-9"})`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  animation: ${nC} 400ms ease both;
  &.slide-out {
    animation: ${nO} 600ms cubic-bezier(0.4, 0.0, 0.2, 1) both;
  }
  &.slide-in {
    animation: ${n_} 600ms cubic-bezier(0.4, 0.0, 0.2, 1) both;
  }
`,nM=tw.div.withConfig({displayName:"OnboardingForm__Card",componentId:"sc-e9894832-10"})`
  width: 920px;
  max-width: 96%;
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9));
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 12px 30px rgba(30, 64, 175, 0.12), inset 0 1px 0 rgba(255,255,255,0.7);
  border: 1px solid rgba(147, 197, 253, 0.2);
  transition: transform 240ms ease, box-shadow 240ms ease;
  &:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(30, 64, 175, 0.18); }
`,nX=tw.div.withConfig({displayName:"OnboardingForm__HeroHeader",componentId:"sc-e9894832-11"})`
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
`,nq=tw.div.withConfig({displayName:"OnboardingForm__LogosContainer",componentId:"sc-e9894832-12"})`
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
`;tw.img.withConfig({displayName:"OnboardingForm__LogoImage",componentId:"sc-e9894832-13"})`
  height: 40px;
  object-fit: contain;
`;let nW=tw.div.withConfig({displayName:"OnboardingForm__LogoDivider",componentId:"sc-e9894832-14"})`
  width: 1px;
  height: 30px;
  background: rgba(43,123,227,0.2);
`,nY=tw.div.withConfig({displayName:"OnboardingForm__LangDropdownFixed",componentId:"sc-e9894832-15"})`
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
`,nH=tw.h1.withConfig({displayName:"OnboardingForm__HeroTitle",componentId:"sc-e9894832-16"})`
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
  animation: ${nC} 600ms ease both;
  animation-delay: 200ms;

  @media (max-width: 640px) {
    font-size: 1.75rem;
  }
`,nG=tw.p.withConfig({displayName:"OnboardingForm__HeroSubtitle",componentId:"sc-e9894832-17"})`
  margin: 0 0 1rem;
  color: #567;
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto;
  animation: ${nC} 600ms ease both;
  animation-delay: 300ms;

  @media (max-width: 640px) {
    font-size: 0.95rem;
  }
`;tw.div.withConfig({displayName:"OnboardingForm__HeroBadge",componentId:"sc-e9894832-18"})`
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
  animation: ${nC} 600ms ease both;
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
`,tw.div.withConfig({displayName:"OnboardingForm__TitleSection",componentId:"sc-e9894832-19"})`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`,tw.div.withConfig({displayName:"OnboardingForm__TitleRow",componentId:"sc-e9894832-20"})`
  display: flex;
  align-items: center;
  gap: 1rem;
`,tw.h2.withConfig({displayName:"OnboardingForm__Title",componentId:"sc-e9894832-21"})`
  margin: 0;
  color: #0b2b4a;
  font-size: 1.75rem;
  letter-spacing: 0.2px;
  font-weight: 800;
  background: linear-gradient(135deg, #0b2b4a 0%, #2b7be3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,tw.span.withConfig({displayName:"OnboardingForm__Badge",componentId:"sc-e9894832-22"})`
  padding: 0.35rem 0.75rem;
  background: linear-gradient(135deg, rgba(43,123,227,0.1), rgba(94,200,255,0.08));
  border: 1.5px solid rgba(43,123,227,0.2);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #2b7be3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,tw.div.withConfig({displayName:"OnboardingForm__ProgressBar",componentId:"sc-e9894832-23"})`
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
    animation: ${nC} 600ms ease;
  }
`,tw.p.withConfig({displayName:"OnboardingForm__Subtitle",componentId:"sc-e9894832-24"})`
  margin: 0;
  color: #567;
  font-size: 0.95rem;
  padding-left: 60px;
`,tw.select.withConfig({displayName:"OnboardingForm__LanguageSelect",componentId:"sc-e9894832-25"})`
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(60,90,120,0.12);
  background: #fff;
  font-weight: 600;
  color: #0b2b4a;
  cursor: pointer;
`;let nJ=tw.div.withConfig({displayName:"OnboardingForm__Grid",componentId:"sc-e9894832-26"})`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (max-width: 920px) { 
    grid-template-columns: 1fr; 
  }
`,nV=tw.form.withConfig({displayName:"OnboardingForm__Form",componentId:"sc-e9894832-27"})`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
`,nK=tw.div.withConfig({displayName:"OnboardingForm__Field",componentId:"sc-e9894832-28"})`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  position: relative;
`,nQ=tw.label.withConfig({displayName:"OnboardingForm__Label",componentId:"sc-e9894832-29"})`
  font-weight: 600;
  color: #3c5a78;
  font-size: 0.9rem;
`,nZ=tw.input.withConfig({displayName:"OnboardingForm__Input",componentId:"sc-e9894832-30"})`
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
`,n0=tw.textarea.withConfig({displayName:"OnboardingForm__Textarea",componentId:"sc-e9894832-31"})`
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
`,n1=tw.select.withConfig({displayName:"OnboardingForm__Select",componentId:"sc-e9894832-32"})`
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
`,n2=tw.div.withConfig({displayName:"OnboardingForm__ErrorText",componentId:"sc-e9894832-33"})`
  font-size: 0.8rem;
  color: #e74c3c;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  animation: ${nC} 300ms ease;
`,n5=tw.label.withConfig({displayName:"OnboardingForm__FileUploadButton",componentId:"sc-e9894832-34"})`
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
`,n3=tw.div.withConfig({displayName:"OnboardingForm__FileList",componentId:"sc-e9894832-35"})`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`,n4=tw.div.withConfig({displayName:"OnboardingForm__FileItem",componentId:"sc-e9894832-36"})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: rgba(43,123,227,0.05);
  border-radius: 6px;
  font-size: 0.85rem;
  color: #3c5a78;
`,n8=tw.button.withConfig({displayName:"OnboardingForm__RemoveFileButton",componentId:"sc-e9894832-37"})`
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
`,n6=tw.aside.withConfig({displayName:"OnboardingForm__Side",componentId:"sc-e9894832-38"})`
  display:flex;
  flex-direction:column;
  gap:0.75rem;
`,n9=tw.div.withConfig({displayName:"OnboardingForm__CardBox",componentId:"sc-e9894832-39"})`
  padding:1rem;
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,249,255,0.98));
  border-radius:12px;
  border: 1px solid rgba(60,90,120,0.06);
`,n7=tw.button.withConfig({displayName:"OnboardingForm__Submit",componentId:"sc-e9894832-40"})`
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
`,ie=tw.div.withConfig({displayName:"OnboardingForm__SubmitWrapper",componentId:"sc-e9894832-41"})`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`,it=tw.div.withConfig({displayName:"OnboardingForm__SubmitHint",componentId:"sc-e9894832-42"})`
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
`,ir=tw.div.withConfig({displayName:"OnboardingForm__LangDropdown",componentId:"sc-e9894832-43"})`
  position: relative;
`,ii=tw.button.withConfig({displayName:"OnboardingForm__LangButton",componentId:"sc-e9894832-44"})`
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
`,io=tw.div.withConfig({displayName:"OnboardingForm__DropdownMenu",componentId:"sc-e9894832-45"})`
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
`,ia=tw.button.withConfig({displayName:"OnboardingForm__MenuItem",componentId:"sc-e9894832-46"})`
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
`,is=()=>(0,c.jsxs)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[(0,c.jsx)("circle",{cx:"12",cy:"12",r:"10"}),(0,c.jsx)("line",{x1:"2",y1:"12",x2:"22",y2:"12"}),(0,c.jsx)("path",{d:"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"})]}),il=({open:e})=>(0,c.jsx)("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",style:{transition:"transform 200ms ease",transform:e?"rotate(180deg)":"rotate(0deg)"},children:(0,c.jsx)("polyline",{points:"6 9 12 15 18 9"})});tw.div.withConfig({displayName:"OnboardingForm__FieldGroup",componentId:"sc-e9894832-47"})`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(43,123,227,0.03), rgba(94,200,255,0.02));
  border-radius: 12px;
  border: 1px solid rgba(43,123,227,0.08);
`,tw.div.withConfig({displayName:"OnboardingForm__GroupTitle",componentId:"sc-e9894832-48"})`
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
`;let ic=tw.div.withConfig({displayName:"OnboardingForm__AccordionSection",componentId:"sc-e9894832-49"})`
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
`,id=tw.div.withConfig({displayName:"OnboardingForm__AccordionHeader",componentId:"sc-e9894832-50"})`
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
`,iu=tw.div.withConfig({displayName:"OnboardingForm__AccordionContent",componentId:"sc-e9894832-51"})`
  padding: ${e=>e.$expanded?"1rem 1.25rem 1.5rem":"0 1.25rem"};
  max-height: ${e=>e.$expanded?"3000px":"0"};
  opacity: ${e=>+!!e.$expanded};
  overflow: ${e=>e.$expanded?"visible":"hidden"};
  transition: padding 300ms ease, max-height 400ms ease, opacity 300ms ease;
  
  @media (max-width: 640px) {
    padding: ${e=>e.$expanded?"1rem 1rem 1.25rem":"0 1rem"};
  }
`,ip=tw.div.withConfig({displayName:"OnboardingForm__ReferenceImagesContainer",componentId:"sc-e9894832-52"})`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`,ih=tw.div.withConfig({displayName:"OnboardingForm__ReferenceImageWrapper",componentId:"sc-e9894832-53"})`
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
`,ig=tw.div.withConfig({displayName:"OnboardingForm__ReferenceImage",componentId:"sc-e9894832-54"})`
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
`,im=tw.div.withConfig({displayName:"OnboardingForm__ImageCaption",componentId:"sc-e9894832-55"})`
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: #567;
  text-align: center;
  background: rgba(43,123,227,0.03);
  font-weight: 600;
`;function ib(){let e=(0,u.useRouter)(),{token:t}=e.query,r="undefined"!=typeof navigator&&navigator.language.startsWith("zh")?"zh":"en",[n,i]=(0,d.useState)(r),[o,a]=(0,d.useState)(!1),[s,l]=(0,d.useState)(!1),[f,p]=(0,d.useState)(!1),[h,g]=(0,d.useState)({contact:!0,business:!0,address:!0,payment:!0,additional:!0}),[m,b]=(0,d.useState)(!0),[y,x]=(0,d.useState)(!1),[v,w]=(0,d.useState)(null);(0,d.useEffect)(()=>{let r=async()=>{if(!t||"string"!=typeof t){w("zh"===n?"缺少注册令牌。请使用有效的注册链接。":"Missing registration token. Please use a valid registration link."),b(!1);return}try{let e=await nS.get(`https://dev.vend88.com/registration/validate-token/${t}`);if(e.data.success&&e.data.data.valid&&!e.data.data.used&&!e.data.data.expired)x(!0),w(null);else{let t=e.data.data.reason||(e.data.data.used?"zh"===n?"此注册表单已提交。每个链接只能使用一次。如需更改，请联系管理员。":"This registration form has already been submitted. Each link can only be used once. Please contact the admin if you need to make changes.":e.data.data.expired?"zh"===n?"注册令牌已过期。请联系管理员获取新链接。":"Registration token has expired. Please contact the admin for a new link.":"zh"===n?"无效的注册令牌。":"Invalid registration token.");w(t),x(!1)}}catch(e){console.error("Token validation error:",e),w(e.response?.data?.error||("zh"===n?"验证令牌时出错。请稍后重试。":"Error validating token. Please try again later.")),x(!1)}finally{b(!1)}};e.isReady&&r()},[t,e.isReady,n]);let j=nE[n],[S,E]=(0,d.useState)({businessName:"",ownerName:"",email:"",quoteNumber:"",abn:"",registeredAddress:"",registeredSuburb:"",registeredPostcode:"",registeredState:"",registeredCountry:"Australia",phone:"",messagingAppType:"",messagingAppId:"",notes:""}),[C,O]=(0,d.useState)(""),[_,A]=(0,d.useState)(""),[N,R]=(0,d.useState)(""),[k,I]=(0,d.useState)(""),[P,T]=(0,d.useState)(""),[F,B]=(0,d.useState)(""),[z,$]=(0,d.useState)([]),[L,U]=(0,d.useState)(!1),[D,M]=(0,d.useState)(!1),[X,q]=(0,d.useState)(!1),[W,Y]=(0,d.useState)(null),[H,G]=(0,d.useState)({}),J=e=>{let{name:t,value:r}=e.target;E(e=>({...e,[t]:r})),H[t]&&G(e=>{let r={...e};return delete r[t],r}),W&&Y(null)},V=async e=>{e.preventDefault(),G({}),Y(null);let r={};if(S.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.email)||(r.email="en"===n?"Please enter a valid email address":"请输入有效的电子邮箱"):r.email="en"===n?"Email address is required":"电子邮箱为必填项",S.ownerName.trim()||(r.ownerName="en"===n?"Full name is required":"全名为必填项"),S.quoteNumber.trim()||(r.quoteNumber="en"===n?"Quote or invoice number is required":"报价单或发票号码为必填项"),S.businessName.trim()||(r.businessName="en"===n?"Business trading name is required":"公司交易名称为必填项"),S.abn.trim()){let e;e=S.abn.replace(/\s/g,""),/^\d{11}$/.test(e)||(r.abn="en"===n?"ABN must be exactly 11 digits":"ABN 必须为 11 位数字")}else r.abn="en"===n?"ABN is required":"ABN 为必填项";if(S.registeredAddress.trim()||(r.registeredAddress="en"===n?"Street address is required":"街道地址为必填项"),S.registeredSuburb.trim()||(r.registeredSuburb="en"===n?"City/Suburb is required":"城市/郊区为必填项"),S.registeredPostcode.trim()?/^\d{4}$/.test(S.registeredPostcode)||(r.registeredPostcode="en"===n?"Postcode must be exactly 4 digits":"邮政编码必须为 4 位数字"):r.registeredPostcode="en"===n?"Postcode is required":"邮政编码为必填项",S.registeredState||(r.registeredState="en"===n?"Please select a state/territory":"请选择州/领地"),S.registeredCountry||(r.registeredCountry="en"===n?"Please select a country":"请选择国家"),S.phone.trim()){let e;"Australia"!==S.registeredCountry||(e=S.phone.replace(/\s/g,"").replace(/\+61/,"0"),/^04\d{8}$/.test(e))||(r.phone="en"===n?"Please enter a valid Australian mobile (e.g., 04XX XXX XXX or +61 4XX XXX XXX)":"请输入有效的澳大利亚手机号码（例如：04XX XXX XXX 或 +61 4XX XXX XXX）")}else r.phone="en"===n?"Contact phone number is required":"联系电话为必填项";if(C||(r.eftposIntegration="en"===n?"Please select Yes or No":"请选择是或否"),_||(r.alipayOption="en"===n?"Please select an option from the dropdown":"请从下拉列表中选择一个选项"),"other"!==_||N.trim()||(r.alipayOther="en"===n?"Please describe your payment provider":"请描述您的支付提供商"),k.trim()||(r.readyBy="en"===n?"Expected deployment date is required":"预期部署时间为必填项"),P||(r.heardAbout="en"===n?"Please tell us how you heard about us":"请告诉我们您是如何了解我们的"),"other"!==P||F.trim()||(r.heardOther="en"===n?"Please describe how you heard about us":"请描述您是如何了解我们的"),0!==z.length||L||(r.menuUpload="en"===n?"Please upload menu files or check 'I will send it later'":'请上传菜单文件或勾选"我稍后再发送"'),D||(r.terms="en"===n?"You must agree to the terms and conditions before submitting":"提交前您必须同意条款和条件"),Object.keys(r).length>0){G(r);let e=Object.keys(r).length;Y("en"===n?`Please fix ${e} error${1===e?"":"s"} above before submitting`:`提交前请修正上述 ${e} 个错误`),setTimeout(()=>{let e=document.querySelector(".error");e&&e.scrollIntoView({behavior:"smooth",block:"center"})},100);return}q(!0);try{let e={token:t,contact_email:S.email,owner_name:S.ownerName,contact_phone:S.phone,messaging_app_type:S.messagingAppType||null,messaging_app_id:S.messagingAppId||null,quote_number:S.quoteNumber,business_name:S.businessName,abn:S.abn,registered_address:S.registeredAddress,registered_suburb:S.registeredSuburb,registered_postcode:S.registeredPostcode,registered_state:S.registeredState,registered_country:S.registeredCountry,eftpos_integration:C,alipay_option:_,alipay_other:"other"===_?N:null,ready_by:k,heard_about:P,heard_other:"other"===P?F:null,menu_files:z.map(e=>({filename:e.name,mime_type:e.type})),menu_send_later:L,notes:S.notes};console.log("=== SUBMITTING FORM DATA ==="),console.log("Form Data:",JSON.stringify(e,null,2));let r=await nS.post("https://dev.vend88.com/registration/submit",e,{headers:{"Content-Type":"application/json"}});if(console.log("=== API RESPONSE ==="),console.log("Status:",r.status),console.log("Response Data:",JSON.stringify(r.data,null,2)),console.log("Full Response:",r),r.data.success)q(!1),l(!0),setTimeout(()=>{a(!0),l(!1)},600);else throw Error(r.data.error||"Submission failed")}catch(e){q(!1),console.error("=== SUBMISSION ERROR ==="),console.error("Error:",e),console.error("Error Response:",e.response),console.error("Error Status:",e.response?.status),console.error("Error Data:",JSON.stringify(e.response?.data,null,2)),e.response?.status===409?Y("zh"===n?"此令牌已被使用。每个注册链接只能使用一次。":"This token has already been used. Each registration link can only be used once."):e.response?.status===400?Y("zh"===n?"无效或过期的令牌。":"Invalid or expired token."):Y(e.response?.data?.error||("zh"===n?"提交失败。请稍后重试。":"Submission failed. Please try again later."))}};d.default.useEffect(()=>{let e=e=>{e.target.closest("[data-lang-dropdown]")||p(!1)};if(f)return document.addEventListener("click",e),()=>document.removeEventListener("click",e)},[f]);let K=e=>{g(t=>({...t,[e]:!t[e]}))};return o?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(nU,{}),(0,c.jsx)(nD,{className:"slide-in",children:(0,c.jsx)(tB,{lang:n})})]}):m?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(nU,{}),(0,c.jsx)(nD,{children:(0,c.jsx)(nM,{children:(0,c.jsxs)(nI,{children:[(0,c.jsx)(nL,{}),(0,c.jsx)(nB,{$type:"loading",children:"zh"===n?"验证注册链接":"Validating Registration Link"}),(0,c.jsx)(nz,{children:"zh"===n?"请稍候，我们正在验证您的注册令牌...":"Please wait while we verify your registration token..."})]})})})]}):!y||v?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(nU,{}),(0,c.jsx)(nD,{children:(0,c.jsx)(nM,{children:(0,c.jsxs)(nI,{children:[(0,c.jsxs)(nP,{children:[(0,c.jsx)(nT,{}),(0,c.jsxs)(nF,{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[(0,c.jsx)("path",{d:"M12 2L2 20h20L12 2z",fill:"#FFA500",stroke:"#FF6B00",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,c.jsx)("path",{d:"M12 9v4M12 17h.01",stroke:"#FFFFFF",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round"})]})]}),(0,c.jsx)(nB,{$type:"error",children:"zh"===n?"无效的注册链接":"Invalid Registration Link"}),(0,c.jsx)(nz,{children:v}),(0,c.jsx)(n$,{children:"zh"===n?"如果您认为这是错误，请联系管理员获取新的注册链接。":"If you believe this is an error, please contact the admin for a new registration link."})]})})})]}):(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(nU,{}),(0,c.jsx)(nD,{className:s?"slide-out":"",children:(0,c.jsx)(nM,{children:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)(nX,{children:[(0,c.jsx)(nY,{children:(0,c.jsxs)(ir,{"data-lang-dropdown":!0,children:[(0,c.jsxs)(ii,{onClick:()=>p(!f),children:[(0,c.jsx)(is,{}),(0,c.jsx)("span",{children:"en"===n?"EN":"中文"}),(0,c.jsx)(il,{open:f})]}),(0,c.jsxs)(io,{$show:f,children:[(0,c.jsx)(ia,{$active:"en"===n,onClick:()=>{i("en"),p(!1)},children:"🇦🇺 English"}),(0,c.jsx)(ia,{$active:"zh"===n,onClick:()=>{i("zh"),p(!1)},children:"🇨🇳 中文"})]})]})}),(0,c.jsxs)(nq,{children:[(0,c.jsx)(tz.default,{src:"/logos/vend88.png",alt:"Vend88",width:150,height:50,style:{height:"50px",width:"auto",maxWidth:"40vw"},onError:()=>console.error("Vend88 logo failed to load")}),(0,c.jsx)(nW,{}),(0,c.jsx)(tz.default,{src:"/logos/pospal.png",alt:"PosPal",width:180,height:70,style:{height:"70px",width:"auto",maxWidth:"40vw"},onError:()=>console.error("PosPal logo failed to load")})]}),(0,c.jsx)(nH,{children:j.onboarding.title}),(0,c.jsx)(nG,{children:"en"===n?"Please fill out this registration form to begin your onboarding process":"请填写此注册表以开始您的入驻流程"})]}),(0,c.jsxs)(nJ,{children:[(0,c.jsxs)(nV,{onSubmit:V,children:[(0,c.jsxs)(ic,{$expanded:h.contact,children:[(0,c.jsxs)(id,{onClick:()=>K("contact"),children:[(0,c.jsx)("span",{children:"en"===n?"📧 Contact Information":"📧 联系信息"}),(0,c.jsx)(il,{open:h.contact})]}),(0,c.jsx)(iu,{$expanded:h.contact,children:(0,c.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:[(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.email," *"]}),(0,c.jsx)(nZ,{className:H.email?"error":"",type:"email",name:"email",value:S.email,onChange:J,placeholder:j.onboarding.emailPlaceholder}),H.email&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.email]})]}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.fullName," *"]}),(0,c.jsx)(nZ,{className:H.ownerName?"error":"",name:"ownerName",value:S.ownerName,onChange:J,placeholder:j.onboarding.fullNamePlaceholder}),H.ownerName&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.ownerName]})]}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.phone," *"]}),(0,c.jsx)(nZ,{className:H.phone?"error":"",name:"phone",value:S.phone,onChange:J,placeholder:j.onboarding.phonePlaceholder,type:"tel"}),H.phone&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.phone]}),(0,c.jsx)("div",{style:{fontSize:11,color:"#789",marginTop:4},children:"en"===n?"Australian mobile: 04XX XXX XXX or +61 4XX XXX XXX":"澳大利亚手机: 04XX XXX XXX 或 +61 4XX XXX XXX"})]}),(0,c.jsxs)(nK,{children:[(0,c.jsx)(nQ,{children:"en"===n?"Messaging App Contact (Optional)":"即时通讯联系方式（可选）"}),(0,c.jsxs)(n1,{name:"messagingAppType",value:S.messagingAppType||"",onChange:J,children:[(0,c.jsx)("option",{value:"",children:"en"===n?"-- Select app --":"-- 选择应用 --"}),(0,c.jsx)("option",{value:"wechat",children:"en"===n?"WeChat ID":"微信号"}),(0,c.jsx)("option",{value:"whatsapp",children:"en"===n?"WhatsApp Number":"WhatsApp 号码"})]}),S.messagingAppType&&(0,c.jsx)(nZ,{name:"messagingAppId",value:S.messagingAppId||"",onChange:J,placeholder:"wechat"===S.messagingAppType?"en"===n?"Enter your WeChat ID":"输入您的微信号":"en"===n?"Enter your WhatsApp number":"输入您的 WhatsApp 号码",style:{marginTop:8}}),(0,c.jsx)("div",{style:{fontSize:11,color:"#789",marginTop:4},children:"en"===n?"Provide an alternative way for us to reach you":"提供其他联系方式以便我们与您联系"})]})]})})]}),(0,c.jsxs)(ic,{$expanded:h.business,children:[(0,c.jsxs)(id,{onClick:()=>K("business"),children:[(0,c.jsx)("span",{children:"en"===n?"🏢 Business Information":"🏢 商业信息"}),(0,c.jsx)(il,{open:h.business})]}),(0,c.jsx)(iu,{$expanded:h.business,children:(0,c.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:[(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.quoteNumber," *"]}),(0,c.jsx)(nZ,{className:H.quoteNumber?"error":"",name:"quoteNumber",value:S.quoteNumber,onChange:J,placeholder:j.onboarding.quoteNumberPlaceholder}),H.quoteNumber&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.quoteNumber]})]}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.businessName," *"]}),(0,c.jsx)(nZ,{className:H.businessName?"error":"",name:"businessName",value:S.businessName,onChange:J,placeholder:j.onboarding.businessNamePlaceholder}),H.businessName&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.businessName]}),(0,c.jsx)("div",{style:{fontSize:12,color:"#567",marginTop:6},children:j.onboarding.businessNameHint})]}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.abn," *"]}),(0,c.jsx)(nZ,{className:H.abn?"error":"",name:"abn",value:S.abn,onChange:J,placeholder:j.onboarding.abnPlaceholder}),H.abn&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.abn]}),(0,c.jsx)("div",{style:{fontSize:11,color:"#789",marginTop:4},children:"en"===n?"11-digit number":"11 位数字"})]})]})})]}),(0,c.jsxs)(ic,{$expanded:h.address,children:[(0,c.jsxs)(id,{onClick:()=>K("address"),children:[(0,c.jsx)("span",{children:"en"===n?"📍 Registered Business Address":"📍 注册商业地址"}),(0,c.jsx)(il,{open:h.address})]}),(0,c.jsx)(iu,{$expanded:h.address,children:(0,c.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:[(0,c.jsx)("div",{style:{fontSize:"12px",color:"#567",marginBottom:"8px"},children:j.onboarding.storeAddressHint}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:["en"===n?"Street Address":"街道地址"," *"]}),(0,c.jsx)(nZ,{className:H.registeredAddress?"error":"",name:"registeredAddress",value:S.registeredAddress,onChange:J,placeholder:"en"===n?"e.g., 123 Main Street":"例如：123 主街"}),H.registeredAddress&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.registeredAddress]})]}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:["en"===n?"City / Suburb":"城市/郊区"," *"]}),(0,c.jsx)(nZ,{className:H.registeredSuburb?"error":"",name:"registeredSuburb",value:S.registeredSuburb,onChange:J,placeholder:"en"===n?"e.g., Sydney":"例如：悉尼"}),H.registeredSuburb&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.registeredSuburb]})]}),(0,c.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"},className:"mobile-stack",children:[(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:["en"===n?"Postcode":"邮政编码"," *"]}),(0,c.jsx)(nZ,{className:H.registeredPostcode?"error":"",name:"registeredPostcode",value:S.registeredPostcode,onChange:J,placeholder:"en"===n?"e.g., 2000":"例如：2000",maxLength:4}),H.registeredPostcode&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.registeredPostcode]})]}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.registeredState," *"]}),(0,c.jsxs)(n1,{className:H.registeredState?"error":"",name:"registeredState",value:S.registeredState,onChange:J,children:[(0,c.jsx)("option",{value:"",children:j.onboarding.registeredStatePlaceholder}),(0,c.jsx)("option",{value:"NSW",children:"NSW"}),(0,c.jsx)("option",{value:"VIC",children:"VIC"}),(0,c.jsx)("option",{value:"QLD",children:"QLD"}),(0,c.jsx)("option",{value:"WA",children:"WA"}),(0,c.jsx)("option",{value:"SA",children:"SA"}),(0,c.jsx)("option",{value:"TAS",children:"TAS"}),(0,c.jsx)("option",{value:"ACT",children:"ACT"}),(0,c.jsx)("option",{value:"NT",children:"NT"})]}),H.registeredState&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.registeredState]})]})]}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.registeredCountry," *"]}),(0,c.jsx)(n1,{className:H.registeredCountry?"error":"",name:"registeredCountry",value:S.registeredCountry,onChange:J,children:(0,c.jsx)("option",{value:"Australia",children:"Australia"})}),H.registeredCountry&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.registeredCountry]})]})]})})]}),(0,c.jsxs)(ic,{$expanded:h.payment,children:[(0,c.jsxs)(id,{onClick:()=>K("payment"),children:[(0,c.jsx)("span",{children:"en"===n?"💳 Payment & Integration":"💳 支付与集成"}),(0,c.jsx)(il,{open:h.payment})]}),(0,c.jsx)(iu,{$expanded:h.payment,children:(0,c.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:[(0,c.jsxs)(nK,{children:[(0,c.jsxs)(ip,{children:[(0,c.jsxs)(ih,{children:[(0,c.jsx)(ig,{children:(0,c.jsx)(tz.default,{src:"/pictures/tyro-card.png",alt:"Tyro Card Terminal",fill:!0,style:{objectFit:"cover"}})}),(0,c.jsx)(im,{children:"en"===n?"Tyro Card Terminal":"Tyro 刷卡终端"})]}),(0,c.jsxs)(ih,{children:[(0,c.jsx)(ig,{children:(0,c.jsx)(tz.default,{src:"/pictures/tyro-payments.png",alt:"Tyro Payment Process",fill:!0,style:{objectFit:"cover"}})}),(0,c.jsx)(im,{children:"en"===n?"Payment Process":"支付流程"})]})]}),(0,c.jsxs)(nQ,{children:[j.onboarding.eftposIntegration," *"]}),(0,c.jsxs)("div",{style:{display:"flex",gap:12,marginTop:6,paddingLeft:4},children:[(0,c.jsxs)("label",{style:{cursor:"pointer"},children:[(0,c.jsx)("input",{type:"radio",name:"eftpos",checked:"yes"===C,onChange:()=>{O("yes"),H.eftposIntegration&&G(e=>{let t={...e};return delete t.eftposIntegration,t})}})," ","en"===n?"Yes":"是"]}),(0,c.jsxs)("label",{style:{cursor:"pointer"},children:[(0,c.jsx)("input",{type:"radio",name:"eftpos",checked:"no"===C,onChange:()=>{O("no"),H.eftposIntegration&&G(e=>{let t={...e};return delete t.eftposIntegration,t})}})," ","en"===n?"No":"否"]})]}),H.eftposIntegration&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.eftposIntegration]}),(0,c.jsx)("div",{style:{fontSize:12,color:"#567",marginTop:6},children:j.onboarding.eftposHint})]}),(0,c.jsx)(nK,{children:(0,c.jsxs)(ip,{children:[(0,c.jsxs)(ih,{children:[(0,c.jsx)(ig,{children:(0,c.jsx)(tz.default,{src:"/pictures/alipay-payment.png",alt:"Alipay Payment",fill:!0,style:{objectFit:"cover"}})}),(0,c.jsx)(im,{children:"en"===n?"Alipay Payment":"支付宝支付"})]}),(0,c.jsxs)(ih,{children:[(0,c.jsx)(ig,{children:(0,c.jsx)(tz.default,{src:"/pictures/wechat-payment.png",alt:"WeChat Pay",fill:!0,style:{objectFit:"cover"}})}),(0,c.jsx)(im,{children:"en"===n?"WeChat Pay":"微信支付"})]})]})}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.alipayPayment," *"]}),(0,c.jsxs)(n1,{className:H.alipayOption?"error":"",value:_,onChange:e=>{A(e.target.value),H.alipayOption&&G(e=>{let t={...e};return delete t.alipayOption,t})},children:[(0,c.jsx)("option",{value:"",children:"-- select --"}),(0,c.jsx)("option",{value:"open",children:j.onboarding.alipayOpen}),(0,c.jsx)("option",{value:"not-interested",children:j.onboarding.alipayNotInterested}),(0,c.jsx)("option",{value:"superpay",children:j.onboarding.alipaySuperpay}),(0,c.jsx)("option",{value:"royalpay",children:j.onboarding.alipayRoyalpay}),(0,c.jsx)("option",{value:"other",children:j.onboarding.alipayOther})]}),H.alipayOption&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.alipayOption]}),"other"===_&&(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(nZ,{className:H.alipayOther?"error":"",name:"alipayOther",value:N,onChange:e=>{R(e.target.value),H.alipayOther&&G(e=>{let t={...e};return delete t.alipayOther,t})},placeholder:"en"===n?"Please describe":"请描述",style:{marginTop:8}}),H.alipayOther&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.alipayOther]})]})]})]})})]}),(0,c.jsxs)(ic,{$expanded:h.additional,children:[(0,c.jsxs)(id,{onClick:()=>K("additional"),children:[(0,c.jsx)("span",{children:"en"===n?"📋 Additional Information":"📋 附加信息"}),(0,c.jsx)(il,{open:h.additional})]}),(0,c.jsx)(iu,{$expanded:h.additional,children:(0,c.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:[(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.readyBy," *"]}),(0,c.jsx)(n0,{className:H.readyBy?"error":"",name:"readyBy",value:k,onChange:e=>{I(e.target.value),H.readyBy&&G(e=>{let t={...e};return delete t.readyBy,t})},placeholder:j.onboarding.readyByPlaceholder}),H.readyBy&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.readyBy]}),(0,c.jsx)("div",{style:{fontSize:12,color:"#567",marginTop:6},children:j.onboarding.readyByHint})]}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.heardAbout," *"]}),(0,c.jsxs)(n1,{className:H.heardAbout?"error":"",value:P,onChange:e=>{T(e.target.value),H.heardAbout&&G(e=>{let t={...e};return delete t.heardAbout,t})},children:[(0,c.jsx)("option",{value:"",children:"-- select --"}),(0,c.jsx)("option",{value:"friend",children:j.onboarding.heardFriend}),(0,c.jsx)("option",{value:"google",children:j.onboarding.heardGoogle}),(0,c.jsx)("option",{value:"wechat",children:j.onboarding.heardWechat}),(0,c.jsx)("option",{value:"saw",children:j.onboarding.heardSaw}),(0,c.jsx)("option",{value:"other",children:j.onboarding.heardOther})]}),H.heardAbout&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.heardAbout]}),"other"===P&&(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(nZ,{className:H.heardOther?"error":"",name:"heardOther",value:F,onChange:e=>{B(e.target.value),H.heardOther&&G(e=>{let t={...e};return delete t.heardOther,t})},placeholder:"en"===n?"Please describe":"请描述",style:{marginTop:8}}),H.heardOther&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.heardOther]})]})]}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)(nQ,{children:[j.onboarding.menuUpload," *"]}),(0,c.jsx)("div",{style:{fontSize:12,color:"#567",marginBottom:8},children:j.onboarding.menuUploadHint}),(0,c.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:8},children:[(0,c.jsxs)(n5,{className:L?"disabled":"",children:[(0,c.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[(0,c.jsx)("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),(0,c.jsx)("polyline",{points:"17 8 12 3 7 8"}),(0,c.jsx)("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),"en"===n?"Choose Files":"选择文件",(0,c.jsx)("input",{type:"file",accept:".pdf,.doc,.docx,.xls,.xlsx",onChange:e=>{if(e.target.files&&e.target.files.length>0){let t=Array.from(e.target.files);$(e=>[...e,...t]),U(!1),H.menuUpload&&G(e=>{let t={...e};return delete t.menuUpload,t})}},disabled:L,multiple:!0})]}),(0,c.jsx)("div",{style:{fontSize:11,color:"#789",fontStyle:"italic"},children:j.onboarding.multipleFilesNote}),z.length>0&&(0,c.jsx)(n3,{children:z.map((e,t)=>(0,c.jsxs)(n4,{children:[(0,c.jsxs)("span",{children:["📄 ",e.name]}),(0,c.jsx)(n8,{onClick:()=>{$(e=>e.filter((e,r)=>r!==t))},children:"✕"})]},t))}),(0,c.jsxs)("label",{style:{display:"flex",alignItems:"center",gap:8},children:[(0,c.jsx)("input",{type:"checkbox",checked:L,onChange:e=>{U(e.target.checked),e.target.checked&&$([]),H.menuUpload&&G(e=>{let t={...e};return delete t.menuUpload,t})}}),(0,c.jsx)("span",{style:{fontSize:14},children:j.onboarding.menuSendLater})]}),H.menuUpload&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.menuUpload]})]}),(0,c.jsx)("div",{style:{fontSize:11,color:"#567",marginTop:6},children:j.onboarding.menuContactInfo})]}),(0,c.jsxs)(nK,{children:[(0,c.jsx)(nQ,{children:j.onboarding.notes}),(0,c.jsx)(n0,{name:"notes",value:S.notes,onChange:J,placeholder:j.onboarding.notesPlaceholder})]})]})})]}),(0,c.jsxs)(nK,{children:[(0,c.jsxs)("label",{style:{display:"flex",alignItems:"center",gap:8},children:[(0,c.jsx)("input",{type:"checkbox",checked:D,onChange:e=>{M(e.target.checked),H.terms&&G(e=>{let t={...e};return delete t.terms,t})}}),(0,c.jsxs)("span",{children:[j.onboarding.termsAgreed," *"]})]}),H.terms&&(0,c.jsxs)(n2,{children:[(0,c.jsx)("span",{children:"⚠"}),H.terms]})]}),(0,c.jsxs)(n9,{style:{marginBottom:"1rem"},children:[(0,c.jsx)(nQ,{children:j.onboarding.helpTitle}),(0,c.jsx)("div",{style:{color:"#567",fontSize:"0.95rem",marginTop:6},children:j.onboarding.helpText})]}),(0,c.jsxs)(ie,{children:[(0,c.jsx)(n7,{type:"submit",disabled:X,children:X?(0,c.jsx)("span",{children:j.onboarding.sending}):(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("span",{children:j.onboarding.submit}),(0,c.jsx)("span",{style:{marginLeft:"8px"},children:"→"})]})}),!X&&D&&(0,c.jsxs)(it,{children:[(0,c.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:(0,c.jsx)("path",{d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})}),"en"===n?"Ready to submit":"准备提交"]}),W&&(0,c.jsxs)(n2,{style:{justifyContent:"center",marginTop:0},children:[(0,c.jsx)("span",{children:"⚠"}),W]})]})]}),(0,c.jsx)(n6,{})]})]})})})]})}e.s(["default",()=>ib],68103)}]);