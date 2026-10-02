const http=require("http");
const PORT=process.env.PORT||3000;

const PROVIDERS={
  openai:{base:"https://api.openai.com/v1",key:"OPENAI_API_KEY",model:process.env.OPENAI_MODEL||"gpt-6-luna"},
  deepseek:{base:"https://api.deepseek.com/v1",key:"DEEPSEEK_API_KEY",model:process.env.DEEPSEEK_MODEL||"deepseek-chat"}
};

function json(res,status,data){res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type, Authorization","Access-Control-Allow-Methods":"GET,POST,OPTIONS"});res.end(JSON.stringify(data))}
function read(req){return new Promise((ok,fail)=>{let s="";req.on("data",c=>s+=c);req.on("end",()=>{try{ok(JSON.parse(s||"{}"))}catch(e){fail(e)}})})}

async function chat(provider,messages,model){
 const p=PROVIDERS[provider];
 if(!p) throw new Error("不支持的 provider："+provider);
 const key=process.env[p.key];
 if(!key) throw new Error("服务器没有配置 "+p.key);
 const response=await fetch(p.base+"/chat/completions",{
  method:"POST",
  headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},
  body:JSON.stringify({model:model||p.model,messages,temperature:0.7})
 });
 const data=await response.json();
 if(!response.ok) throw new Error(data.error?.message||("上游 API 错误："+response.status));
 return {provider,model:data.model||model||p.model,content:data.choices?.[0]?.message?.content||""};
}

const server=http.createServer(async(req,res)=>{
 if(req.method==="OPTIONS")return json(res,204,{});
 if(req.method==="GET"&&req.url==="/api/models")return json(res,200,{
  providers:[
   {id:"openai",name:"GPT",configured:!!process.env.OPENAI_API_KEY,model:PROVIDERS.openai.model},
   {id:"deepseek",name:"DeepSeek",configured:!!process.env.DEEPSEEK_API_KEY,model:PROVIDERS.deepseek.model}
  ]
 });
 if(req.method==="POST"&&req.url==="/api/chat"){
  try{
   const body=await read(req);
   if(!Array.isArray(body.messages)||body.messages.length===0)return json(res,400,{error:"messages 不能为空"});
   const result=await chat(body.provider||"openai",body.messages,body.model);
   return json(res,200,result);
  }catch(e){return json(res,500,{error:e.message})}
 }
 return json(res,404,{error:"Not Found"});
});
server.listen(PORT,()=>console.log("API-AI running on port "+PORT));