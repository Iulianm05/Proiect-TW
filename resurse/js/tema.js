// window.addEventListener("load",function(){
//     let tema=localStorage.getItem("tema");
//     if(tema)
//         document.body.classList.add("dark");

//     document.getElementById("tema").onclick = function(){
//         // document.body.classList.toggle("dark");
//         if(document.body.classList.contains("dark")){
//             document.body.classList.remove("dark")
//             localStorage.removeItem("tema");
//         }
//         else{
//             document.body.classList.add("dark");
//             localStorage.setItem("tema","dark");
//         }
//     }
// })


    // let tema=localStorage.getItem("tema");
    // let temabtn=document.getElementById("tema");
    // if(tema)
    //     document.body.classList.add("dark");
        
    // window.addEventListener("DOMContentLoaded", function(){
    // document.getElementById("tema").onclick= function(){
    //     if(document.body.classList.contains("dark")){
    //         document.body.classList.remove("dark")
    //         localStorage.removeItem("tema");
    //         localStorage.setItem("temaChecked", temaCheckbox.checked);
    //     }
    //     else{
    //         document.body.classList.add("dark")
    //         localStorage.setItem("tema","dark");
    //         localStorage.setItem("temaChecked", temaCheckbox.checked);  
    //     }
    // }
    // });

// window.onload = function(){
//     document.getElementById("tema").onclick = function(){
//         document.body.classList.toggle("dark");
//     }
// }

window.addEventListener("DOMContentLoaded", function() {
    var temaCheckbox = document.getElementById("tema");
    var tema = localStorage.getItem("tema");
  
    if (tema === "dark") {
      document.body.classList.add("dark");
      temaCheckbox.checked = true;
    } else {
      document.body.classList.remove("dark");
      temaCheckbox.checked = false;
    }
  
    temaCheckbox.onclick = function() {
      if (temaCheckbox.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("tema", "dark");
      } else {
        document.body.classList.remove("dark");
        localStorage.removeItem("tema");
      }
    };
  
    // Verificăm starea butonului la încărcarea paginii și actualizăm localStorage
    temaCheckbox.onchange = function() {
      if (temaCheckbox.checked) {
        localStorage.setItem("tema", "dark");
      } else {
        localStorage.removeItem("tema");
      }
    };
  });
  