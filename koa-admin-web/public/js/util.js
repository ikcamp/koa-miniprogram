function hasClass( elements,cName ){
    return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
};

function addClass( elements,cName ){
    if( !hasClass( elements,cName ) ){
        elements.className += " " + cName;
    };
};

function removeClass( elements,cName ){
    if( hasClass( elements,cName ) ){
        elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" ),"" ); // replace方法是替换
    };
};

function send(type,data,url,callback){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == XMLHttpRequest.DONE){
            if(xmlhttp.status == 200){
                if(callback){
                    callback(xmlhttp.response);
                }
            } else {
                console.log("Oops!Something wrong happened~");
            }
        }
    };
    xmlhttp.open(type,url,true);
    xmlhttp.setRequestHeader("Content-type","application/json");
    xmlhttp.send(JSON.stringify(data));
};

function count(num, callback){
    let _time = 0;
    let count = setInterval(function(){
        _time ++;
        if(_time > num){
            callback();
            clearInterval(count);
        }
    },1000);

}

