

//setCookie("a",10, 1000)
function setCookie(nume, val, timpExpirare){//timpExpirare in milisecunde
    d=new Date();
    d.setTime(d.getTime()+timpExpirare)
    document.cookie=`${nume}=${val}; expires=${d.toUTCString()};path=/`;
}

function getCookie(nume){
    vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"]
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume+"="))
            return param.split("=")[1]
    }
    return null;
}

function deleteCookie(nume){
    console.log(`${nume}; expires=${(new Date()).toUTCString()}`)
    document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`;
}

function deleteAllCookies(){
    vectorParametri=document.cookie.split(";")
    for(let param of vectorParametri){
        deleteCookie(param);
    }
}
function setUltimulProdusAccesatCookie(produs) {
    setCookie("ultimulProdusAccesat", produs, 10000); // Exemplu de expirare: 1 an
  }

window.addEventListener("load", function(){
    if (getCookie("acceptat_banner")){
        document.getElementById("banner").style.display="none";
    }

    this.document.getElementById("ok_cookies").onclick=function(){
        setCookie("acceptat_banner",true,60000);
        document.getElementById("banner").style.display="none"
    }
})
