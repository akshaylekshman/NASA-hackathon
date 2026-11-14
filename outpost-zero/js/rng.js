(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.OZ_RNG=api;})(typeof window!=='undefined'?window:globalThis,function(){
function seedNumber(seed){if(typeof seed==='number'&&Number.isFinite(seed))return seed>>>0;let h=2166136261;for(const c of String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function create(seed){let a=seedNumber(seed);return {next(){a=(a+0x6D2B79F5)|0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;},getState(){return a>>>0;}};}
return {create,seedNumber};
});
