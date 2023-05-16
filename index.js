const express = require("express");
const fs= require('fs');
const path=require('path');
const sharp = require('sharp');
const sass = require('sass');
const {Client} =require('pg');
const AccesBD = require("./module_proprii/accesbd");

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname,"resurse/scss"),
    folderCss: path.join(__dirname,"resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
    optiuniMeniu:[]
}


var client= new Client({database:"Proiect Web",
        user:"iulian",
        password:"123456",
        host:"localhost",
        port:5432});
client.connect();
AccesBD.getInstanta().select({
    tabel:"jocuri",
    campuri:["nume","pret"],
    conditiiAnd:["pret>70"]
})
client.query("select * from unnest(enum_range(null::tipuri_jocuri ))", function(err, rezCategorie){
    if(err){
        console.log(err);
    }
    else{
        obGlobal.optiuniMeniu=rezCategorie.rows;
    }
})
app= express();
console.log("Folder proiect", __dirname);
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd());

vectorFoldere = ["temp","temp1","backup"]
for(let folder of vectorFoldere){
    let caleFolder=path.join(__dirname, folder)
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}

function compileazaScss(caleScss, caleCss){
    if(!caleCss){
        // let vectorCale = caleScss.split("\\")
        // let numeFisExt=vectorCale[vectorCale.length-1];
        let numeFisExt=path.basename(caleScss)
        let numeFis=numeFisExt.split(".")[0]
        caleCss=numeFis+".css";
    }
    if(!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss,caleScss)
    if(!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss)
    //la acest punct avem cai absolute in caleScss si caleCss    
    // let vectorCale = caleCss.split("\\");
    // let numeFisCss = vectorCale[vectorCale.length-1];
    let caleBackup=path.join(obGlobal.folderBackup,"resurse/css");
    if(!fs.existsSync(caleBackup)){
        fs.mkdirSync(caleBackup,{recursive:true});
    }
    let numeFisCss=path.basename(caleCss);
    if(fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, numeFisCss))
    
    }
    let rez = sass.compile(caleScss,{"sourceMap":true})
    fs.writeFileSync(caleCss,rez.css)
    console.log("Compilare SCSS",rez)
}   

// compileazaScss("a.scss")

fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis)
    if(eveniment == "change" ||eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if(fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

app.set("view engine","ejs");

app.use("/resurse", express.static(__dirname+"/resurse"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

app.use("/*", function(req,res,next){
    res.locals.optiuniMeniu = obGlobal.optiuniMeniu;
    next();
})

app.use(/^\/resurse(\/[a-zA-Z0-9]*)*$/, function(req,res){
    afisareEroare(res,403);
});


app.get("/favicon.ico", function(req,res){
    res.sendFile(__dirname+"/resurse/ico/favicon.ico");
})

app.get("/ceva", function(req, res){
    console.log("cale:",req.url)
    res.send("<h1>altceva</h1> ip:"+req.ip);
})



app.get(["/index","/","/home" ], function(req, res){
    res.render("pagini/index" , {ip: req.ip, a: 10, b:20,imagini:obGlobal.obImagini.imagini});

})
app.get(["/galerie"],function(req, res){
    res.render("pagini/galerie",{ip: req.ip, a: 10, b:20,imagini:obGlobal.obImagini.imagini})
})
app.get("/produse",function(req, res){


    //TO DO query pentru a selecta toate produsele
    //TO DO se adauaga filtrarea dupa tipul produsului
    //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura
    client.query("select * from unnest(enum_range(null::cerinte_joc))", function(err, rezCategorie){
        if(err){
            console.log(err);
        }
        else{
            let conditieWhere=""; 
            if(req.query.tip){
                conditieWhere=` where tip_produs='${req.query.tip}'`
            }
            client.query("select * from jocuri "+conditieWhere , function( err, rez){
                console.log(300)
                if(err){
                    console.log(err);
                    afisareEroare(res, 2);
                }
                else{
                    console.log(rez);
                    res.render("pagini/produse", {produse:rez.rows, optiuni:rezCategorie.rows});
                }
                    
            });
        }
    })    
    
   


});


app.get("/produs/:id",function(req, res){
    console.log(req.params);
   
    client.query(`select * from jocuri where id=${req.params.id}  `, function( err, rezultat){
        if(err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rezultat.rows[0]});
    });
});

client.query("select * from unnest(enum_range(null::cerinte_joc))",function(err, rez){
    console.log(err);
    console.log(rez);
})


// ^\w+\.ejs$
app.get("/*.ejs",function(req, res){
    afisareEroare(res,400);
})

app.get("/*",function(req, res){
    try{
        res.render("pagini"+req.url, function(err, rezRandare){
            if(err){
                console.log(err);
                if(err.message.startsWith("Failed to lookup view"))
                //afisareEroare(res,{_identificator:404, _titlu:"ceva"});
                    afisareEroare(res,404,);
                else
                    afisareEroare(res);
            }
            else{
                console.log(rezRandare);
                res.send(rezRandare);
            }
        } );
    } catch(err){
        if(err.message.startsWith("Cannot find module"))
        //afisareEroare(res,{_identificator:404, _titlu:"ceva"});
            afisareEroare(res,404);
        else
            afisareEroare(res);
    }
})


function initErori(){
    var continut= fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8");
    console.log(continut);
    obGlobal.obErori=JSON.parse(continut);
    let vErori=obGlobal.obErori.info_erori;
    //for (let i=0; i< vErori.length; i++ )
    for (let eroare of vErori){
        eroare.imagine="/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;
    }
}
initErori();

function initImagini(){
    var continut= fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");
    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleAbs=path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleAbsMed=path.join(caleAbs,"mediu");
    if(!fs.existsSync(caleAbsMed))
    {
        fs.mkdirSync(caleAbsMed)
    }
    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini){
        // eroare.imagine="/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;
        [numeFis,ext]=imag.cale_relativa.split(".");
        let caleFisAbs= path.join(caleAbs, imag.cale_relativa);
        let caleFisMedAbs = path.join(caleAbsMed, numeFis+".webp");
        sharp(caleFisAbs).resize(400).toFile(caleFisMedAbs);
        imag.fisier_mediu = "/"+path.join(obGlobal.obImagini.cale_galerie,"mediu", numeFis+".webp");
        imag.cale_relativa = "/"+path.join(obGlobal.obImagini.cale_galerie,imag.cale_relativa)
    }
}
initImagini();

/*
daca  programatorul seteaza titlul, se ia titlul din argument
daca nu e setat, se ia cel din json
daca nu avem titluk nici in JSOn se ia titlul de valoarea default
idem pentru celelalte
*/

//function afisareEroare(res, {_identificator, _titlu, _text, _imagine}={} ){
function afisareEroare(res, _identificator, _titlu="titlu default", _text, _imagine ){
    let vErori=obGlobal.obErori.info_erori;
    let eroare=vErori.find(function(elem) {return elem.identificator==_identificator;} )
    if(eroare){
        let titlu1= _titlu=="titlu default" ? (eroare.titlu || _titlu) : _titlu;
        let text1= _text || eroare.text;
        let imagine1= _imagine || eroare.imagine;
        if(eroare.status)
            res.status(eroare.identificator).render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
        else
            res.render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
    }
    else{
        let errDef=obGlobal.obErori.eroare_default;
        res.render("pagini/eroare", {titlu:errDef.titlu, text:errDef.text, imagine:obGlobal.obErori.cale_baza+"/"+errDef.imagine});
    }
    

}


app.listen(8080);
console.log("Serverul a pornit");