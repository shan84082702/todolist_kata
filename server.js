const http = require('http');
const { v4: uuidv4 } = require('uuid');
const resultHandle = require("./resultHandle");
const errorHandle = require("./errorHandle");

let todos = [];

const requestListener = (req, res) => {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
        "Access-Control-Allow-Origin": "*", //讓所以伺服器IP造訪
        "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE", //允許的method
        "Content-Type": "application/json"
    }

    let body= "";
    req.on('data' , chunk=>{
        body+=chunk;
    });

    if(req.url == "/todos" && req.method == "GET"){
        resultHandle(res,todos);
    }
    else if(req.url == "/todos" && req.method == "POST"){
        req.on('end', ()=>{
            try{
                const title = JSON.parse(body).title;
                if(title !== undefined){
                    const todo = {
                        "title" : title,
                        "id" : uuidv4()
                    };
                    todos.push(todo);
                    resultHandle(res,todos);
                }
                else{
                    errorHandle(res);
                }
            }
            catch(error){
                errorHandle(res);
            }
        });
    }
    else if(req.url == "/todos" && req.method == "DELETE"){
        todos.length = 0;
        resultHandle(res,todos);
    }
    else if(req.url.startsWith("/todos/") && req.method == "DELETE"){
        const id = req.url.split("/").pop();
        const index = todos.findIndex(element => element.id == id);
        if(index !== -1){
            todos.splice(index,1);
            resultHandle(res,todos);
        }
        else{
            errorHandle(res);
        }
    }
    else if(req.url.startsWith("/todos/") && req.method == "PATCH"){
        req.on('end', ()=>{
            try{
                const title = JSON.parse(body).title;
                const id = req.url.split("/").pop();
                const index = todos.findIndex(element => element.id == id);

                if(title !== undefined && index !== -1){
                    todos[index].title = title;
                    resultHandle(res,todos);
                }
                else{
                    errorHandle(res);
                }
            }
            catch(error){
                errorHandle(res);
            }
        })
    }
    else if(req.method == "OPTIONS"){
        res.writeHead(200, headers);
        res.end();
    }
    else{
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status" : "fail",
            "msg" : "not found"
        }));
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(process.env.POST || 3015);