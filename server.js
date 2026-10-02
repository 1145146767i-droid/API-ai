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
 },
 claude:{
  name:"Claude / Anthropic",
  models:[
   {id:"claude-opus-5",name:"Claude Opus 5",family:"Claude 5",type:"旗舰 / 推理"},
   {id:"claude-sonnet-5",name:"Claude Sonnet 5",family:"Claude 5",type:"高性能通用"},
   {id:"claude-fable-5",name:"Claude Fable 5",family:"Claude 5",type:"通用"},
   {id:"claude-opus-4-8",name:"Claude Opus 4.8",family:"Claude 4",type:"旗舰"},
   {id:"claude-opus-4-7",name:"Claude Opus 4.7",family:"Claude 4",type:"旗舰"},
   {id:"claude-opus-4-6",name:"Claude Opus 4.6",family:"Claude 4",type:"推理"},
   {id:"claude-sonnet-4-6",name:"Claude Sonnet 4.6",family:"Claude 4",type:"通用 / 编程"},
   {id:"claude-sonnet-4-5-20250929",name:"Claude Sonnet 4.5",family:"Claude 4",type:"通用"},
   {id:"claude-haiku-4-5-20251001",name:"Claude Haiku 4.5",family:"Claude 4",type:"快速 / 轻量"}
  ]
 },
 qwen:{
  name:"Qwen / 通义千问",
  models:[
   {id:"qwen3.8-max",name:"Qwen3.8-Max",family:"Qwen Max",type:"旗舰 / 通用"},
   {id:"qwen3.7-max",name:"Qwen3.7-Max",family:"Qwen Max",type:"旗舰"},
   {id:"qwen3.7-plus",name:"Qwen3.7-Plus",family:"Qwen Plus",type:"高性能通用"},
   {id:"qwen3.5-plus",name:"Qwen3.5-Plus",family:"Qwen Plus",type:"通用"},
   {id:"qwen3.7-flash",name:"Qwen3.7-Flash",family:"Qwen Flash",type:"快速 / 高吞吐"},
   {id:"qwen3.5-flash",name:"Qwen3.5-Flash",family:"Qwen Flash",type:"快速"},
   {id:"qwen3-vl-plus",name:"Qwen3-VL-Plus",family:"Qwen VL",type:"视觉 / 多模态"},
   {id:"qwen3.6-coder",name:"Qwen3.6-Coder",family:"Qwen Coder",type:"编程"}
  ]
 }
};
const BASE={openai:"https://api.openai.com/v1",deepseek:"https://api.deepseek.com/v1",claude:"https://api.anthropic.com/v1",qwen:process.env.QWEN_BASE_URL||"https://dashscope-us.aliyuncs.com/compatible-mode/v1"};
const KEYS={openai:"OPENAI_API_KEY",deepseek:"DEEPSEEK_API_KEY",claude:"ANTHROPIC_API_KEY",qwen:"DASHSCOPE_API_KEY"};
function json(res,status,data){res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type, Authorization","Access-Control-Allow-Methods":"GET,POST,OPTIONS"});res.end(JSON.stringify(data))}
function read(req){return new Promise((ok,fail)=>{let s="";req.on("data",c=>s+=c);req.on("end",()=>{try{ok(JSON.parse(s||"{}"))}catch(e){fail(e)}})})}
async function chat(provider,messages,model){
 if(!CATALOG[provider])throw new Error("不支持的家族："+provider);
 const key=process.env[KEYS[provider]];if(!key)throw new Error("服务器没有配置 "+KEYS[provider]);
 const allowed=CATALOG[provider].models.some(x=>x.id===model);
 if(!allowed)throw new Error("模型不在当前家族目录中："+model);
 if(provider==="claude"){
  const system=messages.filter(m=>m.role==="system").map(m=>m.content).join("\n\n");
  const userMessages=messages.filter(m=>m.role!=="system");
  const body={model,max_tokens:4096,messages:userMessages};
  if(system)body.system=system;
  const r=await fetch(BASE.claude+"/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},body:JSON.stringify(body)});
  const d=await r.json();if(!r.ok)throw new Error(d.error?.message||("Claude API 错误："+r.status));
  return {provider,model:d.model||model,content:(d.content||[]).filter(x=>x.type==="text").map(x=>x.text).join("\n")};
 }
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