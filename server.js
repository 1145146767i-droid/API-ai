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
   {id:"gpt-5.3-codex",name:"GPT-5.3 Codex",family:"Codex",type:"编程"}
  ]
 },
 deepseek:{
  name:"DeepSeek",
  models:[
   {id:"deepseek-flash",name:"DeepSeek-V4.1-Flash",family:"DeepSeek V4",type:"快速 / 多模态"},
   {id:"deepseek-v4-pro",name:"DeepSeek-V4-Pro",family:"DeepSeek V4",type:"旗舰 / 推理"},
   {id:"deepseek-v4-flash",name:"DeepSeek-V4-Flash（兼容别名）",family:"DeepSeek V4",type:"旧名称 / 实际路由至 V4.1-Flash"},
   {id:"deepseek-v4-flash-vision-exp",name:"DeepSeek-V4-Flash-Vision-Exp（兼容别名）",family:"DeepSeek V4",type:"旧名称 / 实际路由至 V4.1-Flash"}
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
 },
 gemini:{
  name:"Gemini / Google",
  models:[
   {id:"gemini-3.8-flash",name:"Gemini 3.8 Flash",family:"Gemini 3.8",type:"旗舰 Flash / 通用 / Agent"},
   {id:"gemini-3.8-live",name:"Gemini 3.8 Live",family:"Gemini 3.8 Live",type:"实时语音"},
   {id:"gemini-3.8-live-extended-thinking",name:"Gemini 3.8 Live Extended Thinking",family:"Gemini 3.8 Live",type:"实时语音 / 深度推理"},
   {id:"gemini-3.8-flash-tts",name:"Gemini 3.8 Flash TTS",family:"Gemini 3.8 Audio",type:"文本转语音"},
   {id:"gemini-3.8-flash-lite-tts",name:"Gemini 3.8 Flash-Lite TTS",family:"Gemini 3.8 Audio",type:"轻量 TTS"},
   {id:"gemini-3.7-flash",name:"Gemini 3.7 Flash",family:"Gemini 3.7",type:"编程 / Agent"},
   {id:"gemini-3.6-flash",name:"Gemini 3.6 Flash",family:"Gemini 3.x",type:"通用"},
   {id:"gemini-3.5-flash",name:"Gemini 3.5 Flash",family:"Gemini 3.x",type:"通用"},
   {id:"gemini-3.5-flash-lite",name:"Gemini 3.5 Flash-Lite",family:"Gemini 3.x",type:"轻量"},
   {id:"gemini-3.1-pro-preview",name:"Gemini 3.1 Pro",family:"Gemini 3.1",type:"Pro / 推理"},
   {id:"gemini-3.1-flash-lite",name:"Gemini 3.1 Flash-Lite",family:"Gemini 3.1",type:"轻量"}
  ]
 }
};

const BASE={
 openai:"https://api.openai.com/v1",
 deepseek:"https://api.deepseek.com",
 claude:"https://api.anthropic.com/v1",
 qwen:process.env.QWEN_BASE_URL||"https://dashscope-us.aliyuncs.com/compatible-mode/v1"
};
const KEYS={openai:"OPENAI_API_KEY",deepseek:"DEEPSEEK_API_KEY",claude:"ANTHROPIC_API_KEY",qwen:"DASHSCOPE_API_KEY",gemini:"GEMINI_API_KEY"};

function json(res,status,data){
 res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type, Authorization","Access-Control-Allow-Methods":"GET,POST,OPTIONS"});
 res.end(JSON.stringify(data));
}
function read(req){return new Promise((ok,fail)=>{let s="";req.on("data",c=>s+=c);req.on("end",()=>{try{ok(JSON.parse(s||"{}"))}catch(e){fail(e)}})})}
function keyFor(provider){const k=process.env[KEYS[provider]];if(!k)throw new Error("服务器没有配置 "+KEYS[provider]);return k}
function allowed(provider,model){return CATALOG[provider]?.models.some(x=>x.id===model)}
function messagesToText(messages){return messages.map(m=>m.role.toUpperCase()+": "+(typeof m.content==="string"?m.content:JSON.stringify(m.content))).join("\n")}

async function webSearch(query){
 const key=process.env.TAVILY_API_KEY;
 if(!key)throw new Error("开启联网搜索需要配置 TAVILY_API_KEY");
 const r=await fetch(process.env.TAVILY_BASE_URL||"https://api.tavily.com/search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({api_key:key,query,search_depth:"advanced",max_results:5,include_answer:true})});
 const d=await r.json();if(!r.ok)throw new Error(d.detail||d.error||("搜索 API 错误："+r.status));
 return {answer:d.answer||"",results:(d.results||[]).map(x=>({title:x.title,url:x.url,content:x.content}))};
}
function searchContext(s){
 return "\n\n【联网搜索结果，仅供回答参考】\n"+(s.answer?"搜索摘要："+s.answer+"\n":"")+s.results.map((x,i)=>"["+String(i+1)+"] "+x.title+"\nURL: "+x.url+"\n"+x.content).join("\n\n");
}

async function geminiChat(messages,model,search){
 const key=keyFor("gemini");
 const input=messages.map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:String(m.content)}]}));
 const body={contents:input};
 if(search)body.tools=[{google_search:{}}];
 const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(model)+":generateContent?key="+encodeURIComponent(key),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
 const d=await r.json();if(!r.ok)throw new Error(d.error?.message||("Gemini API 错误："+r.status));
 const text=(d.candidates?.[0]?.content?.parts||[]).filter(p=>p.text).map(p=>p.text).join("");
 return {provider:"gemini",model:d.modelVersion||model,content:text,webSearch:!!search,grounding:d.candidates?.[0]?.groundingMetadata||null};
}

async function chat(provider,messages,model,search){
 if(!CATALOG[provider])throw new Error("不支持的 AI 家族："+provider);
 if(!allowed(provider,model))throw new Error("模型不在当前家族目录中："+model);

 if(provider==="gemini")return geminiChat(messages,model,search);

 let finalMessages=messages;
 let searchData=null;
 if(search){
  const q=[...messages].reverse().find(m=>m.role==="user")?.content;
  if(!q)throw new Error("联网搜索需要用户问题");
  searchData=await webSearch(String(q));
  const context=searchContext(searchData);
  finalMessages=[{role:"system",content:"你可以参考下面的联网搜索结果回答用户。请优先使用搜索结果中的最新事实；不要编造不存在的来源。如果给出来源，请保留 URL。"+context},...messages];
 }

 const key=keyFor(provider);

 if(provider==="claude"){
  const system=finalMessages.filter(m=>m.role==="system").map(m=>m.content).join("\n\n");
  const userMessages=finalMessages.filter(m=>m.role!=="system");
  const body={model,max_tokens:4096,messages:userMessages};if(system)body.system=system;
  const r=await fetch(BASE.claude+"/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},body:JSON.stringify(body)});
  const d=await r.json();if(!r.ok)throw new Error(d.error?.message||("Claude API 错误："+r.status));
  return {provider,model:d.model||model,content:(d.content||[]).filter(x=>x.type==="text").map(x=>x.text).join("\n"),webSearch:!!search};
 }

 const r=await fetch(BASE[provider]+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model,messages:finalMessages,temperature:0.7})});
 const d=await r.json();if(!r.ok)throw new Error(d.error?.message||("上游 API 错误："+r.status));
 return {provider,model:d.model||model,content:d.choices?.[0]?.message?.content||"",webSearch:!!search};
}

const server=http.createServer(async(req,res)=>{
 if(req.method==="OPTIONS")return json(res,204,{});
 if(req.method==="GET"&&req.url==="/api/catalog")return json(res,200,Object.fromEntries(Object.entries(CATALOG).map(([id,p])=>[id,{name:p.name,models:p.models,configured:!!process.env[KEYS[id]]}])));
 if(req.method==="POST"&&req.url==="/api/search"){try{const b=await read(req);if(!b.query)return json(res,400,{error:"query 不能为空"});return json(res,200,await webSearch(String(b.query)))}catch(e){return json(res,500,{error:e.message})}}
 if(req.method==="POST"&&req.url==="/api/chat"){try{const b=await read(req);if(!Array.isArray(b.messages)||!b.messages.length)return json(res,400,{error:"messages 不能为空"});return json(res,200,await chat(b.provider||"openai",b.messages,b.model,!!b.webSearch))}catch(e){return json(res,500,{error:e.message})}}
 return json(res,404,{error:"Not Found"});
});
server.listen(PORT,()=>console.log("API-AI running on port "+PORT));