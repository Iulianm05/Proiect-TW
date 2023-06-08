// window.onload = function(){
//     document.getElementById("filtrare").onclick = function(){
//         let val_nume = document.getElementById("inp-nume").value.toLowerCase();
//         let radiobuttons=document.getElementsByName("gr_rad");
//         var produse = document.getElementsByClassName("produs");

//         for(let r of radiobuttons){
//             if(r.checked){
//                 val_calorii = r.value;
//                 break;
//             }
//         }
//         if(val_calorii!="toate")
//         {
//             var cal_a, cal_b;
//             [cal_a,cal_b]=val_calorii.split(":");
//             cal_a=parseInt(cal_a);
//             cal_b=parseInt(cal_b);
//         }
//         for(let prod of produse){
//             prod.style.display = "none";
//             let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
//             let cond1 = (nume.startsWith(val_nume));
//             let calorii = parseInt(prod.getElementsByClassName("val-calorii")[0].innerHTML);
//             let cond2=(val_calorii=="toate" || cal_a<=calorii && calorii<cal_b);
//             if(cond1){
//                 prod.style.display = "block";
//             }
//         }
//     }
// }






window.addEventListener("load",function(){

    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`;
    }
    document.getElementById("resetare").onclick= function(){
       if(confirm("Esti sigur ca vrei sa continui?")){
        document.getElementById("inp-nume").value="";
       
        document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
        document.getElementById("inp-categorie").value="toate";
        document.getElementById("i_rad4").checked=true;
        document.getElementById("infoRange").innerHTML="(0)";
        var produse=document.getElementsByClassName("produs");
 
        for (let prod of produse){
            prod.style.display="block";
        }
       }
       
    }
    function sortare(semn){
        var produse = document.getElementsByClassName("produs");
        var v_produse = Array.from(produse);
        v_produse.sort(function(a,b){
            let pret_a= parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            let pret_b= parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a==pret_b){
                let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
                let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(pret_a-pret_b);
        });
        for(let prod of v_produse){
            prod.parentElement.appendChild(prod);
        }

    }
    document.getElementById("sortCrescNume").onclick=function(){
        sortare(1);
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sortare(-1);
    }
    document.getElementById("filtrare").onclick = function(){
        let val_nume = document.getElementById("inp-nume").value.toLowerCase();
        let radiobuttons=document.getElementsByName("gr_rad");
        var produse = document.getElementsByClassName("produs");
        let val_pret=document.getElementById("inp-pret").value;
        let luni = document.getElementById("i_sel_multiplu").options;
        let checkboxes = document.getElementsByName("gr_chck");
        let selectSimplu = document.getElementById("inp-categorie").value;
        var monthNames = [
            "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie",
            "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
        ];
        var luniSelectate=new Array;
        var optiuniDiscount = new Array;
        var contor=0;
        for(let l of luni ){
            if(l.selected){
                luniSelectate[contor]=l.value;
                contor++;
            }
        }
        for(let ch of checkboxes){
            if(ch.checked){
                optiuniDiscount.push(ch.value);
                console.log(optiuniDiscount);
            }
        }

        for(let prod of produse){
            prod.style.display = "none";
            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let cond1 = (nume.startsWith(val_nume));
            // let calorii = parseInt(prod.getElementsByClassName("val-calorii")[0].innerHTML);
            // let cond2=(val_calorii=="toate" || cal_a<=calorii && calorii<cal_b);
            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML)
            // console.log(prod.getMonth())
            let data = prod.getElementsByClassName("val-data-adaugare")[0].innerHTML;
            luna =data.split("-");
            let format=false;
            if(prod.getElementsByClassName("val-fizic")[0].innerHTML=="DA")
                format = true;
            else format = false;
            format = format.toString();
            let jocuriPentru = prod.getElementsByClassName("val-pentru")[0].innerHTML;
            let Pentru = jocuriPentru.split(",");
            let Categorii = prod.getElementsByClassName("val-pentru")[0].innerHTML;
            
            let cond2= (pret>=val_pret)
            let cond3=(luniSelectate.includes(luna[1]));
            var pentruCopii = false;
            for(let val of Pentru){
                if(optiuniDiscount.includes(val))
                    pentruCopii=true;
            }
            let cond4=(optiuniDiscount.includes(format)||pentruCopii||optiuniDiscount.includes(luna[1]));
            if(optiuniDiscount.length==0) cond4=true;
            let cond5=Categorii.includes(selectSimplu);
            if(selectSimplu="toate")
                cond5=true;
            console.log("cond4:",cond4,"cond1",cond1,"cond5",cond5);
            // let  categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML;
            if(cond1&&cond2&&cond3&&cond4&&cond5){
                prod.style.display = "block";
            }
        }
    }
    document.getElementById("calcsuma").onclick=function(){
        
            if(document.getElementById("info-suma"))
                return
            var produse = document.getElementsByClassName("produs");
            let suma=0;
            for(let prod of produse){
                if(prod.style.display!="none"){
                    let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                    suma+=pret;
                }
                
            } 
            suma=suma.toFixed(2);   
            let p=document.createElement("p");
            p.innerHTML="Suma totala a produselor de pe ecran este:"+suma;  
            p.id="info-suma"
            ps=document.getElementById("p-suma")
            container = ps.parentNode;
            frate=ps.nextElementSibling;
            container.insertBefore(p, frate);
            setTimeout(function(){
            info=document.getElementById("info-suma");
                if(info)
                    info.remove();
            },2000)
        
    }
})