try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class i extends n{constructor(e,t,s){super(({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}const r=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class c{constructor(){this.t=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const{params:n,route:i}=this.findMatchingRoute({url:s,request:e,event:t});let r,c=i&&i.handler;if(!c&&this.s&&(c=this.s),c){try{r=c.handle({url:s,request:e,event:t,params:n})}catch(e){r=Promise.reject(e)}return r instanceof Promise&&this.i&&(r=r.catch(n=>this.i.handle({url:s,request:e,event:t}))),r}}findMatchingRoute({url:e,request:t,event:s}){const n=this.t.get(t.method)||[];for(const i of n){let n;const r=i.match({url:e,request:t,event:s});if(r)return n=r,(Array.isArray(r)&&0===r.length||r.constructor===Object&&0===Object.keys(r).length||"boolean"==typeof r)&&(n=void 0),{route:i,params:n}}return{}}setDefaultHandler(e){this.s=s(e)}setCatchHandler(e){this.i=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let a;const o=()=>(a||(a=new c,a.addFetchListener(),a.addCacheListener()),a);const h={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},u=e=>[h.prefix,e,h.suffix].filter(e=>e&&e.length>0).join("-"),l=e=>e||u(h.precache),f=e=>e||u(h.runtime);function d(e){e.then(()=>{})}const w=new Set;class p{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this.o=null,this.h=e,this.u=t,this.l=s,this.p=n||(()=>this.close())}get db(){return this.o}async open(){if(!this.o)return this.o=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this.h,this.u);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this.l&&this.l(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this.p.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:i,includeKeys:r=!1}={}){return await this.transaction([e],"readonly",(c,a)=>{const o=c.objectStore(e),h=t?o.index(t):o,u=[],l=h.openCursor(s,n);l.onsuccess=()=>{const e=l.result;e?(u.push(r?e:e.value),i&&u.length>=i?a(u):e.continue()):a(u)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,i)=>{const r=this.o.transaction(e,t);r.onabort=()=>i(r.error),r.oncomplete=()=>n(),s(r,e=>n(e))})}async g(e,t,s,...n){return await this.transaction([t],s,(s,i)=>{const r=s.objectStore(t),c=r[e].apply(r,n);c.onsuccess=()=>i(c.result)})}close(){this.o&&(this.o.close(),this.o=null)}}p.prototype.OPEN_TIMEOUT=2e3;const y={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(y))for(const s of t)s in IDBObjectStore.prototype&&(p.prototype[s]=async function(t,...n){return await this.g(s,t,e,...n)});try{self["workbox:expiration:5.1.3"]&&_()}catch(e){}const g=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class m{constructor(e){this.m=e,this.o=new p("workbox-expiration",1,{onupgradeneeded:e=>this.v(e)})}v(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})})(this.m)}async setTimestamp(e,t){const s={url:e=g(e),timestamp:t,cacheName:this.m,id:this.q(e)};await this.o.put("cache-entries",s)}async getTimestamp(e){return(await this.o.get("cache-entries",this.q(e))).timestamp}async expireEntries(e,t){const s=await this.o.transaction("cache-entries","readwrite",(s,n)=>{const i=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),r=[];let c=0;i.onsuccess=()=>{const s=i.result;if(s){const n=s.value;n.cacheName===this.m&&(e&&n.timestamp<e||t&&c>=t?r.push(s.value):c++),s.continue()}else n(r)}}),n=[];for(const e of s)await this.o.delete("cache-entries",e.id),n.push(e.url);return n}q(e){return this.m+"|"+g(e)}}class b{constructor(e,t={}){this.R=!1,this._=!1,this.U=t.maxEntries,this.L=t.maxAgeSeconds,this.m=e,this.N=new m(e)}async expireEntries(){if(this.R)return void(this._=!0);this.R=!0;const e=this.L?Date.now()-1e3*this.L:0,t=await this.N.expireEntries(e,this.U),s=await self.caches.open(this.m);for(const e of t)await s.delete(e);this.R=!1,this._&&(this._=!1,d(this.expireEntries()))}async updateTimestamp(e){await this.N.setTimestamp(e,Date.now())}async isURLExpired(e){if(this.L){return await this.N.getTimestamp(e)<Date.now()-1e3*this.L}return!1}async delete(){this._=!1,await this.N.expireEntries(1/0)}}const v=(e,t)=>e.filter(e=>t in e),q=async({request:e,mode:t,plugins:s=[]})=>{const n=v(s,"cacheKeyWillBeUsed");let i=e;for(const e of n)i=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:i}),"string"==typeof i&&(i=new Request(i));return i},R=async({cacheName:e,request:t,event:s,matchOptions:n,plugins:i=[]})=>{const r=await self.caches.open(e),c=await q({plugins:i,request:t,mode:"read"});let a=await r.match(c,n);for(const t of i)if("cachedResponseWillBeUsed"in t){const i=t.cachedResponseWillBeUsed;a=await i.call(t,{cacheName:e,event:s,matchOptions:n,cachedResponse:a,request:c})}return a},x=async({cacheName:e,request:s,response:n,event:i,plugins:c=[],matchOptions:a})=>{const o=await q({plugins:c,request:s,mode:"write"});if(!n)throw new t("cache-put-with-no-response",{url:r(o.url)});const h=await(async({request:e,response:t,event:s,plugins:n=[]})=>{let i=t,r=!1;for(const t of n)if("cacheWillUpdate"in t){r=!0;const n=t.cacheWillUpdate;if(i=await n.call(t,{request:e,response:i,event:s}),!i)break}return r||(i=i&&200===i.status?i:void 0),i||null})({event:i,plugins:c,response:n,request:o});if(!h)return;const u=await self.caches.open(e),l=v(c,"cacheDidUpdate"),f=l.length>0?await R({cacheName:e,matchOptions:a,request:o}):null;try{await u.put(o,h)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of w)await e()}(),e}for(const t of l)await t.cacheDidUpdate.call(t,{cacheName:e,event:i,oldResponse:f,newResponse:h,request:o})},U=R,L=async({request:e,fetchOptions:s,event:n,plugins:i=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const r=v(i,"fetchDidFail"),c=r.length>0?e.clone():null;try{for(const t of i)if("requestWillFetch"in t){const s=t.requestWillFetch,i=e.clone();e=await s.call(t,{request:i,event:n})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const a=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of i)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:n,request:a,response:t}));return t}catch(e){for(const t of r)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:c.clone(),request:a.clone()});throw e}};try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const E={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};let N;async function M(e,t){const s=e.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},i=t?t(n):n,r=function(){if(void 0===N){const e=new Response("");if("body"in e)try{new Response(e.body),N=!0}catch(e){N=!1}N=!1}return N}()?s.body:await s.blob();return new Response(r,i)}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}function T(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(n,location.href),r=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:r.href}}class D{constructor(e){this.m=l(e),this.M=new Map,this.T=new Map,this.D=new Map}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:i}=T(n),r="string"!=typeof n&&n.revision?"reload":"default";if(this.M.has(i)&&this.M.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.M.get(i),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.D.has(e)&&this.D.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.D.set(e,n.integrity)}if(this.M.set(i,e),this.T.set(i,r),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const s=[],n=[],i=await self.caches.open(this.m),r=await i.keys(),c=new Set(r.map(e=>e.url));for(const[e,t]of this.M)c.has(t)?n.push(e):s.push({cacheKey:t,url:e});const a=s.map(({cacheKey:s,url:n})=>{const i=this.D.get(s),r=this.T.get(n);return this.C({cacheKey:s,cacheMode:r,event:e,integrity:i,plugins:t,url:n})});return await Promise.all(a),{updatedURLs:s.map(e=>e.url),notUpdatedURLs:n}}async activate(){const e=await self.caches.open(this.m),t=await e.keys(),s=new Set(this.M.values()),n=[];for(const i of t)s.has(i.url)||(await e.delete(i),n.push(i.url));return{deletedURLs:n}}async C({cacheKey:e,url:s,cacheMode:n,event:i,plugins:r,integrity:c}){const a=new Request(s,{integrity:c,cache:n,credentials:"same-origin"});let o,h=await L({event:i,plugins:r,request:a});for(const e of r||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:i,request:a,response:h}):h.status<400))throw new t("bad-precaching-response",{url:s,status:h.status});h.redirected&&(h=await M(h)),await x({event:i,plugins:r,response:h,request:e===s?a:new Request(e),cacheName:this.m,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.M}getCachedURLs(){return[...this.M.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.M.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.m)).match(s)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new t("missing-precache-entry",{cacheName:this.m,url:s instanceof Request?s.url:s})}catch(t){if(e)return fetch(s);throw t}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const n=this.createHandler(s),i=new Request(e);return()=>n({request:i})}}let C;const K=()=>(C||(C=new D),C);const j=(e,t)=>{const s=K().getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t,directoryIndex:s,cleanURLs:n,urlManipulation:i}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const c=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(r,t);if(yield c.href,s&&c.pathname.endsWith("/")){const e=new URL(c.href);e.pathname+=s,yield e.href}if(n){const e=new URL(c.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:r});for(const t of e)yield t.href}}(e,t)){const e=s.get(n);if(e)return e}};let P=!1;function O(e){P||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:n}={})=>{const i=l();self.addEventListener("fetch",r=>{const c=j(r.request.url,{cleanURLs:s,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:n});if(!c)return;let a=self.caches.open(i).then(e=>e.match(c)).then(e=>e||fetch(c));r.respondWith(a)})})(e),P=!0)}const k=[],I={get:()=>k,add(e){k.push(...e)}},A=e=>{const t=K(),s=I.get();e.waitUntil(t.install({event:e,plugins:s}).catch(e=>{throw e}))},S=e=>{const t=K();e.waitUntil(t.activate())};var W;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),W={},function(e){K().addToCacheList(e),e.length>0&&(self.addEventListener("install",A),self.addEventListener("activate",S))}([{url:"_next/static/CTzncMd6xEDfcg17tio5n/_buildManifest.js",revision:"6b84ff94c26bffe26127ccc36bdec486"},{url:"_next/static/CTzncMd6xEDfcg17tio5n/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"_next/static/CTzncMd6xEDfcg17tio5n/pages/_app.js",revision:"9d176ba3a8af8039c1372a54fec06ec0"},{url:"_next/static/CTzncMd6xEDfcg17tio5n/pages/_error.js",revision:"5d77bda7b124ccd079351ad3fa116120"},{url:"_next/static/CTzncMd6xEDfcg17tio5n/pages/index.js",revision:"e72685afeb8aff2ceecde2999c8b2a37"},{url:"_next/static/chunks/11ab9254307c60a99b40b3574d66abac828f168c.a6ab1da7bec89356a6ec.js",revision:"32b7b80d47515d9f1b12b44a2462efc4"},{url:"_next/static/chunks/commons.e1b2ad18fb0165fbb70f.js",revision:"71b992184f06207f640d082b112fffe1"},{url:"_next/static/chunks/d13b22cf076048d27690f05f3e24541a571e80c5.1cbda6a83153e586f4f9.js",revision:"b8b615b0fd9da84be002da2be6380069"},{url:"_next/static/chunks/framework.126679bf45d7d49475d8.js",revision:"8e6204793e3d11a8bedf359bfb6e110d"},{url:"_next/static/css/b84dbdc246f35c889b21.css",revision:"6e4532164e4cfaa03303257f7fb08c29"},{url:"_next/static/css/f97293389b4f686bf4db.css",revision:"b1b31929154512baae27cf35eec6502c"},{url:"_next/static/runtime/main-75961e2dffcf8493588a.js",revision:"6585a6f6347d05a89f9e7d144d3a49f6"},{url:"_next/static/runtime/polyfills-e862ef0c868eff85814a.js",revision:"5bfa136ec68f677879330aff02ce23b7"},{url:"_next/static/runtime/webpack-1c5199ff66550d26e499.js",revision:"40b4095b5b68a142c856f388ccb756f2"}]),O(W),function(e,s,r){let c;if("string"==typeof e){const t=new URL(e,location.href);c=new n(({url:e})=>e.href===t.href,s,r)}else if(e instanceof RegExp)c=new i(e,s,r);else if("function"==typeof e)c=new n(e,s,r);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});c=e}o().registerRoute(c)}(/^https?.*/,new class{constructor(e={}){if(this.m=f(e.cacheName),e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this.K=t?e.plugins:[E,...e.plugins]}else this.K=[E];this.j=e.networkTimeoutSeconds||0,this.P=e.fetchOptions,this.O=e.matchOptions}async handle({event:e,request:s}){const n=[];"string"==typeof s&&(s=new Request(s));const i=[];let r;if(this.j){const{id:t,promise:c}=this.k({request:s,event:e,logs:n});r=t,i.push(c)}const c=this.I({timeoutId:r,request:s,event:e,logs:n});i.push(c);let a=await Promise.race(i);if(a||(a=await c),!a)throw new t("no-response",{url:s.url});return a}k({request:e,logs:t,event:s}){let n;return{promise:new Promise(t=>{n=setTimeout(async()=>{t(await this.A({request:e,event:s}))},1e3*this.j)}),id:n}}async I({timeoutId:e,request:t,logs:s,event:n}){let i,r;try{r=await L({request:t,event:n,fetchOptions:this.P,plugins:this.K})}catch(e){i=e}if(e&&clearTimeout(e),i||!r)r=await this.A({request:t,event:n});else{const e=r.clone(),s=x({cacheName:this.m,request:t,response:e,event:n,plugins:this.K});if(n)try{n.waitUntil(s)}catch(e){}}return r}A({event:e,request:t}){return U({cacheName:this.m,request:t,event:e,matchOptions:this.O,plugins:this.K})}}({cacheName:"offlineCache",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const i=this.S(n),r=this.W(s);d(r.expireEntries());const c=r.updateTimestamp(t.url);if(e)try{e.waitUntil(c)}catch(e){}return i?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this.W(e);await s.updateTimestamp(t.url),await s.expireEntries()},this.B=e,this.L=e.maxAgeSeconds,this.F=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),w.add(t))}W(e){if(e===f())throw new t("expire-custom-caches-only");let s=this.F.get(e);return s||(s=new b(e,this.B),this.F.set(e,s)),s}S(e){if(!this.L)return!0;const t=this.H(e);return null===t||t>=Date.now()-1e3*this.L}H(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this.F)await self.caches.delete(e),await t.delete();this.F=new Map}}({maxEntries:200,purgeOnQuotaError:!0})]}),"GET");
