page = {
    qrcode: document.getElementById('j_qrcode')
}

function interval(qrcode){
    send('GET',null,`/check?code=${qrcode}`,function(data){
        console.log(data)
        if(data !== 1){
            interval()
        } else {
            window.location.href = '/photos';
        }
    })
}

window.onload = function(){
    let qrcode = '';
    send('GET',null,'/qrcode',function(data){
        qrcode = data;
        new QRCode(page.qrcode, {
            text: data,
            width: 150,
            height: 150,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        interval(qrcode)
        // send('GET',null,`/check?code=${qrcode}`)
    });
}