const fs = require('fs');
const http = require('http');
const url = require('url');


http.createServer((req,res)=>{

    res.writeHead(200, {
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Headers": "*"
    });

    let products = fs.readFileSync("./data.json", {encoding:"utf-8"});
    let product = JSON.parse(products);
    let parsedURL = url.parse(req.url, true);
    let id = parsedURL.query.id;
    
    if(req.method === "GET" && parsedURL.pathname==="/products"){
        
        if(!id){
            res.write(products);
        } else {

            let pro = product.find((product, index)=>{
                return Number(product.id) === Number(id);
            })

            let decision = pro!==undefined ? pro : {message: "Invalid ID passed.", description: "Product with entered id does not exist."};

            res.write(JSON.stringify(decision));

        }

        res.end();

    } 
    else if(req.method==="DELETE" && parsedURL.pathname==="/products"){

        if(!id){

            res.write(JSON.stringify({message: "Product with entered Id does not exists."}));

        } else {
            let productIndex = product.findIndex((pro,index)=>{
                return Number(pro.id) === Number(id);
            });

            product.splice(productIndex, 1);

            fs.writeFileSync("./data.json", JSON.stringify(product));

            res.write(JSON.stringify({message: "Product Deleted."}));

        }

        res.end();

    }
    else if(req.method==="POST" && parsedURL.pathname==="/products"){
        
        let data = "";
        req.on("data", (chunk)=>{
            data += chunk;
        })

        req.on("end", ()=>{
            
            product.push(JSON.parse(data));

            fs.writeFile("./data.json", JSON.stringify(product), (err)=>{
                if(!err){
                    res.write(JSON.stringify({message: "Product Added."}));
                    res.end();
                } else {
                    res.write(JSON.stringify({message: "Error Adding Product."}));
                    res.end();
                }
            })
        })
    }
    else if(req.method==="PUT" && parsedURL.pathname==="/products"){
        
        let data = "";
        req.on("data", (chunk)=>{
            data += chunk;
        });

        req.on("end", ()=>{

            let indexToBeUpdated = product.findIndex((pro, index)=>{
                return Number(pro.id) === Number(id);
            })

            console.log(indexToBeUpdated);
            if(indexToBeUpdated > 0){
                product[indexToBeUpdated] = JSON.parse(data);

                fs.writeFile("./data.json", JSON.stringify(product), (err)=>{
                    if(!err){
                        res.write(JSON.stringify({message: "Product Details Updated."}));
                        res.end();
                    } else {
                        res.write(JSON.stringify({message: "Error Updating Details in Product."}));
                        res.end();
                    }
                })
            } else {
                res.write(JSON.stringify({message: "Product with such ID does not exists", description: "Product Details can not be updated"}));
                res.end();
            }
        })
    }
    else {
        res.write(JSON.stringify({message: "Invalid Request Type"}));
        res.end();
    }
}).listen(8000, ()=>{
    console.log("Server is up and running at 8000");
})