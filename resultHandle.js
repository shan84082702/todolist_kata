function resultHandle(res,todos){
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
        "Access-Control-Allow-Origin": "*", //讓所以伺服器IP造訪
        "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE", //允許的method
        "Content-Type": "application/json"
    }

    res.writeHead(200, headers);
    res.write(JSON.stringify({
        "status" : "success",
        "data" : todos
    }));
    res.end();
}

module.exports = resultHandle;