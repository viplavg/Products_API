
// the API url 
const URL = "http://localhost:8000/products";

// to use array from API globally we need a empty array 
let products = [];

// function to get the data from API on load 
function getData(){

    fetch(URL, {
        method: 'GET'
    })
    .then(res => res.json())
    .then((data)=>{
        products = data;
        displayData(products);
    })
    .catch((err)=>{
        console.log(err);
    });

}

getData();


// function to display any data coming in the form of array
function displayData(arr){

    document.getElementById("products_data").innerHTML = "";

    arr.forEach(
        (product, index) => {

            let tr = document.createElement("tr");

            let idTD = document.createElement("td");
            idTD.innerText = index+1;
            tr.appendChild(idTD);

            let nameTD = document.createElement("td");
            nameTD.innerText = product.name;
            tr.appendChild(nameTD);

            let priceTD = document.createElement("td");
            priceTD.innerText = product.price;
            tr.appendChild(priceTD);

            let quantityTD = document.createElement("td");
            quantityTD.innerText = product.quantity;
            tr.appendChild(quantityTD);

            let actionsTD = document.createElement("td");

            let editIcon = document.createElement("i");
            editIcon.className = "icon text-success fa-solid fa-pen-to-square";
            editIcon.setAttribute("data-bs-toggle", "modal");
            editIcon.setAttribute("data-bs-target", "#exampleModal");
            editIcon.addEventListener('click', ()=>{
                updateProduct(product.id);
            });
            actionsTD.appendChild(editIcon);

            let deleteIcon = document.createElement("i");
            deleteIcon.className = "icon text-danger fa-solid fa-trash-can";
            deleteIcon.addEventListener('click', ()=>{
                deleteProduct(product.id);
            })
            actionsTD.appendChild(deleteIcon);

            tr.appendChild(actionsTD);

            document.getElementById("products_data").appendChild(tr);


        }
    );

}

// function to get the data from input fields
function getDataFromInputFields(){
    let dataObj = {};
    dataObj.id = document.getElementById("id").value;
    dataObj.name = document.getElementById("name").value;
    dataObj.price = Number(document.getElementById("price").value);
    dataObj.quantity = Number(document.getElementById("quantity").value);
    return dataObj;
}

// function to add a product
function addProduct(){

    let new_data = getDataFromInputFields();
    
    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_data)
    })
    .then(res => res.json())
    .then(msg => {
        
        products.push(new_data);
        displayData(products);
        toggleToast(msg.message, true);

    })
    .catch((err)=>{
        console.log(err);
    });

    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";

}

// function to delete a product
function deleteProduct(id) {

    fetch(`${URL}?id=${id}`, {
        method: "DELETE",
    })
    .then(res => res.json())
    .then(msg => {
        
        if(msg.success){
            let indexToBeDeleted = products.findIndex((pro,index)=>{
                return Number(pro.id) === Number(id);
            })
    
            products.splice(indexToBeDeleted, 1);
            displayData(products);
            toggleToast(msg.message, true);
        }
        
        toggleToast(msg.message, false);

    })
    .catch((err)=>{
        console.log(err);
    })

}

//function to update a existing product
let idToUpdate = null;
function updateProduct(id){

    let productTobeUpdated = products.find((pro,index)=>{
        return Number(pro.id) === Number(id);
    })

    idToUpdate = productTobeUpdated.id;

    document.getElementById("update_id").value = productTobeUpdated.id;
    document.getElementById("update_name").value = productTobeUpdated.name;
    document.getElementById("update_price").value = productTobeUpdated.price;
    document.getElementById("update_quantity").value = productTobeUpdated.quantity;
}

// function to update Product Data into API 
function UpdateData(){

    let updatedProductObj = {};
    updatedProductObj.id = document.getElementById("update_id").value;
    updatedProductObj.name = document.getElementById("update_name").value;
    updatedProductObj.price = Number(document.getElementById("update_price").value);
    updatedProductObj.quantity = Number(document.getElementById("update_quantity").value);

    fetch(`${URL}?id=${idToUpdate}`, {
        method: "PUT",
        body: JSON.stringify(updatedProductObj),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then((msg)=>{

        let productIndex = products.findIndex((pro,index)=>{
            return Number(pro.id) === Number(idToUpdate);
        })

        products[productIndex]=updatedProductObj;

        displayData(products);
        toggleToast(msg.message);
        
    })

}

// function to toggle Toast 
function toggleToast(message, success){
    document.getElementById("toast_message").style.right="10px";
    document.getElementById("toast_message").innerText = 
    message;

    if(success){
        document.getElementById("toast_message").classList.add("success_msg");
        document.getElementById("toast_message").classList.remove("error_msg");
    } else {
        document.getElementById("toast_message").classList.add("error_msg");
        document.getElementById("toast_message").classList.remove("success_msg");
    }

    setTimeout(()=>{
        document.getElementById("toast_message").style.right="-300px";
    },3000);
}