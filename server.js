const http=require("http");
const PORT=process.env.PORT||3000;
const CATALOG={
 openai:{
  name:"OpenAI / GPT",
  models:[
   {id:"gpt-6-astra",name:"GPT-6 Astra",family:"GPT-6",type:"旗舰 / 推理与编程"},
   {id:"gpt-6.1-sol",name:"GPT-6.1 Sol",family:"GPT-6",type:"高性能通用"},
   {id:"gpt-6-luna",name:"GPT-6 Luna",family:"GPT-6",type:"高性价比通用"},
   {id:"gpt-5.6-sol",name:"GPT-5.6 Sol",family:"GPT-5.6",type:"通用"},
   {id:"gpt-5.3-codex",name:"GPT-5.3 Codex",family:"Codex",type:"编程"},
   {id:"chat-latest",name:"Chat Latest",family:"ChatGPT",type:"聊天"},
   {id:"gpt-image-2.5-sunburst",name:"GPT-Image-2.5 Sunburst",family:"GPT-Image",type:"图像生成（非文本聊天）"}
  ]
 },
 deepseek:{
  name:"DeepSeek",
  models:[
   {id:"deepseek-flash",name:"DeepSeek-V4.1-Flash",family:"DeepSeek V4",type:"快速 / 多模态"},
   {id:"deepseek-v4-pro",name:"DeepSeek-V4-Pro",family:"DeepSeek V4",type:"旗舰 / 推理"}
  ]
 }
};
const BASE={openai:"https://api.openai.com/v1",deepseek:"https://api.deepseek.com/v1"};
const KEYS={openai:"OPENAI_API_KEY",deepseek:"DEEPSEEK_API_KEY"};
function json(res,status,data){res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type, Authorization","Access-Control-Allow-Methods":"GET,POST,OPTIONS"});res.end(JSON.stringify(data))}
function read(req){return new Promise((ok,fail)=>{let s="";req.on("data",c=>s+=c);req.on("end",()=>{try{ok(JSON.parse(s||"{}"))}catch(e){fail(e)}})})}
async function chat(provider,messages,model){
 if(!CATALOG[provider])throw new Error("不支持的家族："+provider);
 const key=process.env[KEYS[provider]];if(!key)throw new Error("服务器没有配置 "+KEYS[provider]);
 const allowed=CATALOG[provider].models.some(x=>x.id===model);
 if(!allowed)throw new Error("模型不在当前家族目录中："+model);
 const r=await fetch(BASE[provider]+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model,messages,temperature:0.7})});
 const d=await r.json();if(!r.ok)throw new Error(d.error?.message||("上游 API 错误："+r.status));
 return {provider,model:d.model||model,content:d.choices?.[0]?.message?.content||""};
}
const server=http.createServer(async(req,res)=>{
 if(req.method==="OPTIONS")return json(res,204,{});
 if(req.method==="GET"&&req.url==="/api/catalog")return json(res,200,Object.fromEntries(Object.entries(CATALOG).map(([id,p])=>[id,{name:p.name,models:p.models,configured:!!process.env[KEYS[id]]}])));
 if(req.method==="POST"&&req.url==="/api/chat"){try{const b=await read(req);if(!Array.isArray(b.messages)||!b.messages.length)return json(res,400,{error:"messages 不能为空"});return json(res,200,await chat(b.provider||"openai",b.messages,b.model))}catch(e){return json(res,500,{error:e.message})}}
 return json(res,404,{error:"Not Found"});
});
server.listen(PORT,()=>console.log("API-AI running on port "+PORT));