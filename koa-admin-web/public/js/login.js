page = {
    qrcode: document.getElementById('j_qrcode'),
    warning: document.getElementById('j_warning'),
    codeContainer: document.getElementById('j_container')
}

function interval(qrcode){
    send('GET',null,`/token?code=${qrcode}`,function(data){
        let _data = JSON.parse(data);
        if(_data.status === 0){
            send('GET',null,`/check`,function(data){
                let _data = JSON.parse(data);
                if(_data.isAdmin){
                    window.location.href = '/photos';
                } else {
                    addClass(page.warning,'login-warning');
                }
            })
        } else {
            interval(qrcode)
        }
    })
}

window.onload = function(){
    addClass(page.codeContainer, 'code-container-display');
    addClass(page.qrcode, 'qrcode-display')
    let qrcode = '';
    send('GET',null,'/qrcode',function(data){
        qrcode = data;
        new QRCode(page.qrcode, {
            text: data,
            width: 150,
            height: 150,
            colorDark : "#000000",
            colorLight : "#ffffff"
        });
        interval(qrcode);
    });
}