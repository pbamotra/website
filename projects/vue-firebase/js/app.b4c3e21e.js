(function(e){function t(t){for(var a,o,c=t[0],u=t[1],s=t[2],l=0,f=[];l<c.length;l++)o=c[l],r[o]&&f.push(r[o][0]),r[o]=0;for(a in u)Object.prototype.hasOwnProperty.call(u,a)&&(e[a]=u[a]);d&&d(t);while(f.length)f.shift()();return i.push.apply(i,s||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],a=!0,c=1;c<n.length;c++){var u=n[c];0!==r[u]&&(a=!1)}a&&(i.splice(t--,1),e=o(o.s=n[0]))}return e}var a={},r={1:0},i=[];function o(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=a,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(n,a,function(t){return e[t]}.bind(null,a));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],u=c.push.bind(c);c.push=t,c=c.slice();for(var s=0;s<c.length;s++)t(c[s]);var d=u;i.push([3,0]),n()})({3:function(e,t,n){e.exports=n("zUnb")},Gn8c:function(e,t,n){},Jcew:function(e,t,n){"use strict";var a=n("ZYdS"),r=n.n(a);r.a},ZYdS:function(e,t,n){},boi5:function(e,t,n){},nBKC:function(e,t,n){"use strict";var a=n("Gn8c"),r=n.n(a);r.a},nNx0:function(e,t,n){"use strict";var a=n("boi5"),r=n.n(a);r.a},zUnb:function(e,t,n){"use strict";n.r(t);n("VRzm");var a,r=n("Kw5r"),i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("h3",[e._v("Note: To use this app you have to allow popups and sign in using Github.")]),n("CardTable"),n("Modify",{staticStyle:{"margin-top":"30px"},attrs:{"the-id":"hey"}})],1)},o=[],c=n("xmWZ"),u=n("3Aqn"),s=n("qpph"),d=n("0yhX"),l=n("EdlT"),f=n("mrSG"),p=n("YKMj"),v=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("button",{on:{click:function(t){e.loadData()}}},[e._v("\n      Load Data\n  ")]),e.cards.length>0?n("table",[e._m(0),n("tbody",e._l(e.cards,function(t){return n("tr",[n("td",[e._v("\n          "+e._s(t.id)+"\n        ")]),n("td",[e._v("\n          "+e._s(t.front)+"\n        ")]),n("td",[e._v("\n          "+e._s(t.back)+"\n        ")]),n("td",[e._v("\n          "+e._s(t.period||0)+"\n        ")]),n("td",[n("button",{on:{click:function(n){e.deleteCard(t.id)}}},[e._v("\n                Delete\n            ")])])])}))]):e._e()])},h=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("thead",[n("tr",[n("th",[e._v("CARD ID")]),n("th",[e._v("FRONT")]),n("th",[e._v("BACK")]),n("th",[e._v("PERIOD")])])])}],b=(n("rGqo"),n("yt8O"),n("RW0V"),n("yT7P")),m=n("Wcq6"),g=(n("Zs65"),n("6nsN"),n("6blF"));(function(e){e["apiKey"]="AIzaSyA3Q_UZcxxVgIZ9rnnq0gmhFMVYc3W-fKA",e["authDomain"]="vue-firebase-test-6cf48.firebaseapp.com",e["databaseURL"]="https://vue-firebase-test-6cf48.firebaseio.com",e["projectId"]="vue-firebase-test-6cf48",e["storageBucket"]="vue-firebase-test-6cf48.appspot.com",e["messagingSenderId"]="996663181930"})(a||(a={}));var y=function(){function e(){Object(c["a"])(this,e),this.config={apiKey:a.apiKey,authDomain:a.authDomain,databaseURL:a.databaseURL,projectId:a.projectId,storageBucket:a.storageBucket,messagingSenderId:a.messagingSenderId},this.app=m["initializeApp"](this.config),this.auth=this.app.auth(),this.authProvider=new m["auth"].GithubAuthProvider,this.database=this.app.database(),this.cardRef=this.database.ref("/card")}return Object(s["a"])(e,[{key:"onCardChange$",value:function(){var e=this;return this.cardChange$||(this.cardChange$=g["a"].create(function(t){e.cardRef.on("value",function(e){e&&e.val()&&t.next(_(e))})})),this.cardChange$}},{key:"updateCard",value:function(e,t){var n=this;return new Promise(function(a,r){n.database.ref("card/".concat(e.trim())).set(t,function(e){e?r(e):a()})})}},{key:"getCard",value:function(e){return this.database.ref("card/".concat(e.trim())).once("value").then(function(t){return Object(b["a"])({id:e},t.val())})}},{key:"createCard",value:function(e){var t=this,n=this.database.ref().child("cards").push().key;return n?new Promise(function(a,r){t.database.ref("card/".concat(n)).set(Object(b["a"])({period:0},e),function(t){t?r(t):a(Object(b["a"])({},e,{id:n,period:0}))})}):Promise.reject("No key generated")}},{key:"deleteCard",value:function(e){var t=this;return new Promise(function(n,a){t.database.ref("card/".concat(e)).remove(function(e){e?a(e):n()})})}},{key:"getCards",value:function(){return this.cardRef.once("value").then(function(e){return _(e)})}},{key:"requestAuth",value:function(){return this.auth.signInWithPopup(this.authProvider)}}]),e}();function _(e){var t=e.val();if(null===t)return[];var n=Object.keys(t);return n.length<=0?[]:n.map(function(e){return Object(b["a"])({id:e},t[e])})}var k=new y,j=function(e){function t(){var e;return Object(c["a"])(this,t),e=Object(d["a"])(this,Object(l["a"])(t).apply(this,arguments)),e.storage=k,e.cards=[],e}return Object(s["a"])(t,[{key:"mounted",value:function(){var e=this;this.storage.onCardChange$().subscribe(function(t){return e.cards=t})}},{key:"loadData",value:function(){var e=this;this.storage.getCards().then(function(t){return e.cards=t})}},{key:"deleteCard",value:function(e){this.storage.deleteCard(e)}}]),Object(u["a"])(t,e),t}(p["b"]);j=f["a"]([p["a"]],j);var O=j,C=O,x=(n("Jcew"),n("KHd+")),w=Object(x["a"])(C,v,h,!1,null,"4744b4c2",null),P=w.exports,I=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("select",{directives:[{name:"model",rawName:"v-model",value:e.select,expression:"select"}],on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.select=t.target.multiple?n:n[0]}}},[n("option",{attrs:{value:"create"}},[e._v("Create")]),n("option",{attrs:{value:"update"}},[e._v("Update")])]),"create"===e.select?n("div",[n("h3",[e._v("\n            Create Card\n        ")]),n("ul",[n("li",[e._v("\n                Front: "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.front,expression:"front"}],attrs:{type:"text",placeholder:"Front"},domProps:{value:e.front},on:{input:function(t){t.target.composing||(e.front=t.target.value)}}})]),n("li",[e._v("\n                Back: "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.back,expression:"back"}],attrs:{type:"text",placeholder:"Back"},domProps:{value:e.back},on:{input:function(t){t.target.composing||(e.back=t.target.value)}}})])])]):e._e(),"update"===e.select?n("div",[n("h3",[e._v("\n            Update Card\n        ")]),n("ul",[n("li",[e._v("\n                Card Id: "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedId,expression:"selectedId"}],attrs:{type:"text",placeholder:"Front"},domProps:{value:e.selectedId},on:{input:function(t){t.target.composing||(e.selectedId=t.target.value)}}}),e._v(" "),n("button",{on:{click:function(t){e.loadCard()}}},[e._v("Load")])]),n("li",[e._v("\n                Front: "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.front,expression:"front"}],attrs:{type:"text",placeholder:"Front"},domProps:{value:e.front},on:{input:function(t){t.target.composing||(e.front=t.target.value)}}})]),n("li",[e._v("\n                Back: "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.back,expression:"back"}],attrs:{type:"text",placeholder:"Back"},domProps:{value:e.back},on:{input:function(t){t.target.composing||(e.back=t.target.value)}}})]),n("li",[e._v("\n                Period: "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.period,expression:"period"}],attrs:{type:"text",placeholder:"Back"},domProps:{value:e.period},on:{input:function(t){t.target.composing||(e.period=t.target.value)}}})])])]):e._e(),n("button",{on:{click:function(t){e.submit()}}},[e._v("\n        SUBMIT\n    ")])])},S=[],N=(n("KKXr"),function(e){function t(){var e;return Object(c["a"])(this,t),e=Object(d["a"])(this,Object(l["a"])(t).apply(this,arguments)),e.select="create",e.selectedId="",e.front="",e.back="",e.period=0,e.storage=k,e}return Object(s["a"])(t,[{key:"submit",value:function(){var e=this;if("create"===this.select){if(this.front.trim().split("").length<=0)return;if(this.front.trim().split("").length<=0)return;this.storage.createCard({front:this.front,back:this.back}).then(function(){return e.$emit("created")})}else if("update"===this.select){if(this.selectedId.trim().split("").length<=0)return;this.storage.updateCard(this.selectedId,{front:this.front,back:this.back,period:this.period})}}},{key:"loadCard",value:function(){var e=this;this.storage.getCard(this.selectedId).then(function(t){e.selectedId=t.id,e.front=t.front,e.back=t.back,e.period=t.period})}}]),Object(u["a"])(t,e),t}(p["b"]));N=f["a"]([p["a"]],N);var B=N,K=B,A=(n("nBKC"),Object(x["a"])(K,I,S,!1,null,"3fd8448e",null)),R=A.exports,$=function(e){function t(){return Object(c["a"])(this,t),Object(d["a"])(this,Object(l["a"])(t).apply(this,arguments))}return Object(s["a"])(t,[{key:"mounted",value:function(){k.requestAuth()}}]),Object(u["a"])(t,e),t}(p["b"]);$=f["a"]([Object(p["a"])({components:{CardTable:P,Modify:R}})],$);var D=$,T=D,M=(n("nNx0"),Object(x["a"])(T,i,o,!1,null,null,null)),U=M.exports;r["default"].config.productionTip=!1,new r["default"]({render:function(e){return e(U)}}).$mount("#app")}});
//# sourceMappingURL=app.b4c3e21e.js.map