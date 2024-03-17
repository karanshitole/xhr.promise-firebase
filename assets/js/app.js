const cl = console.log;

const photoform= document.getElementById("photoform");
const titleControl= document.getElementById("title");
const urlphotoControl= document.getElementById("url");
const thumbnailurlControl= document.getElementById("thumbnailurl");
const albumIdControl= document.getElementById("albumId");
const submitBtn= document.getElementById("submitBtn");
const updateBtn= document.getElementById("updateBtn");
const cardContainer= document.getElementById("cardContainer");
const loader= document.getElementById("loader");

const baseUrl=`https://jsonplaceholder.typicode.com`

const posturl=`${baseUrl}/photos`

const onDelete=(ele)=>{
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            deleteId=ele.closest(".card").id
            let deleteUrl=`${baseUrl}/photos/${deleteId}`
            makeApicall("DELETE",deleteUrl)
            .then((data)=>{
                cl(data)
                document.getElementById(deleteId).remove()
            })
          Swal.fire({
            title: "phots successfully Deleted!",
            icon: "success",
            timer:2000
          });
        }
      });
   
    
}

const onEdit=(ele)=>{
    editId=ele.closest(".card").id;
    localStorage.setItem("editId",editId)
   let editUrl=`${baseUrl}/photos/${editId}`
    makeApicall("GET",editUrl)
    .then((data)=>{
        titleControl.value=data.title;
        urlphotoControl.value=data.url;
        thumbnailurlControl.value=data.thumbnailUrl;
        albumIdControl.value=data.albumId
     
    })
    
    .catch((err)=>{
        cl(err)
   
    })
    .finally(()=>{
           submitBtn.classList.add("d-none")
        updateBtn.classList.remove("d-none");
    })
}

const createSingle=(newObj)=>{
    card=document.createElement("div");
    card.id=newObj.id
    card.className="card m-0"
    card.innerHTML= `
                <div class="card-header">
                <h4 class="m-0">${newObj.title}</h4>
            </div>
            <div class="card-body">
                <p class="m-0">${newObj.url}</p>
             <p class="m-0">${newObj.thumbnailurl}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <div class="button btn btn-primary" onclick="onEdit(this)">Edit</div>
                <div class="button btn btn-danger" onclick="onDelete(this)">Delete</div>
            </div>
    `
    cardContainer.append(card)
}

const ctreateTemplating=(arr)=>{
    cardContainer.innerHTML=arr.map(res=>{
        return `
        <div class="card mt-4" id="${res.id}">
        <div class="card-header">
            <h4 class="m-0">${res.title}</h4>
        </div>
        <div class="card-body">
             <p class="m-0">${res.url}</p>
             <p class="m-0">${res.thumbnailUrl}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
            <div class="button btn btn-primary" onclick="onEdit(this)">Edit</div>
            <div class="button btn btn-danger" onclick="onDelete(this)">Delete</div>
        </div>
    </div>
        `
    }).join("")
}
const makeApicall=(MethoName,apiurl,msgBody=null)=>{
    return new Promise((resolve, reject) => {
        let xhr= new XMLHttpRequest();
        xhr.open(MethoName,apiurl)
        xhr.send(JSON.stringify(msgBody))
        xhr.onload= function(){
            if(xhr.status>=200 && xhr.status<300){
                resolve(JSON.parse(xhr.response))
            }else{
                reject('something went is worng')
            }
        }
    })
}

const postmakeApi=()=>{
    makeApicall("Get",posturl)
    .then(res=>{
        ctreateTemplating(res)
    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{

    })
}
postmakeApi()

const onSubmitBtn=(eve)=>{
    eve.preventDefault();
    let newObj={
        title:titleControl.value,
        url:urlphotoControl.value,
        thumbnailurl:thumbnailurlControl.value,
        albumId:albumIdControl.value

    }
    cl(newObj)
     makeApicall("POST",posturl,newObj)
    .then((data)=>{
        cl(data)
        createSingle(newObj)
    })
    .catch((err)=>{
        cl(err)
    })
    .finally(()=>{
        photoform.reset()
    })
}
const onupdateBtn=()=>{
    let updatedObj={
    title:titleControl.value,
    url:urlphotoControl.value,
    thumbnailurl:thumbnailurlControl.value,
    albumId:albumIdControl.value
    }
    cl(updatedObj)
   let updatedId= localStorage.getItem("editId")
    let updateurl =`${baseUrl}/photos/${updatedId}`
    makeApicall("PATCH",updateurl,updatedObj)
    .then((data)=>{
    cl(data)
    // data.id=updatedObj
    updatedObj.id=data.id
    let card=[...document.getElementById(updatedObj.id).children]
    card[0].innerHTML=`<h4 class="m-0">${updatedObj.title}</h4>`
    card[1].innerHTML=`<p class="m-0">${updatedObj.url}</p>
                       <p class="m-0">${updatedObj.thumbnailurl}</p>`
                        
Swal.fire({
            title: "phots successfully Updated!",
            icon: "success",
            timer:2000
          });
    })

   .catch((err)=>{
    cl(err)
   })
   .finally(()=>{
    photoform.reset()
      submitBtn.classList.remove("d-none")
    updateBtn.classList.add("d-none");
        
   })
}

photoform.addEventListener("submit",onSubmitBtn)
updateBtn.addEventListener("click",onupdateBtn)

