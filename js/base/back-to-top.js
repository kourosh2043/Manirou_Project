(function(){"use strict";var SHOW_AFTER=400;var btn=document.getElementById("backToTop");if(!btn)return;var prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var ticking=false;function updateVisibility(){var y=window.scrollY||window.pageYOffset;btn.classList.toggle("is-visible",y>SHOW_AFTER);ticking=false;}
function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(updateVisibility);}
function scrollToTop(){if(typeof window.maniroScrollTo==="function"){window.maniroScrollTo(0);return;}
if(prefersReducedMotion||!("scrollTo"in window)){window.scrollTo(0,0);return;}
window.scrollTo({top:0,left:0,behavior:"smooth"});}
btn.addEventListener("click",scrollToTop);window.addEventListener("resize",updateVisibility,{passive:true});window.addEventListener("scroll",onScroll,{passive:true});updateVisibility();})();