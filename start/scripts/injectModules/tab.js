var elem = $(":input, a[href], area[href], iframe").eq(count); 
elem.css({"border" : "2px solid red"});
elem.focus();