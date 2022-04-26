
const URL = "http://localhost:8000/products";
let products = [];

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
            actionsTD.appendChild(editIcon);

            let deleteIcon = document.createElement("i");
            deleteIcon.className = "icon text-danger fa-solid fa-trash-can";
            actionsTD.appendChild(deleteIcon);

            tr.appendChild(actionsTD);

            document.getElementById("products_data").appendChild(tr);


        }
    );

}

// function to get the data from input fields
function getData(){
    let dataObj = {};
    dataObj.id = document.getElementById("id").value;
    dataObj.name = document.getElementById("name").value;
    dataObj.price = document.getElementById("price").value;
    dataObj.quantity = document.getElementById("quantity").value;
    return dataObj;
}

function addProduct(){

    let data = getData();
    
    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
    .catch((err)=>{
        console.log(err);
    });

}