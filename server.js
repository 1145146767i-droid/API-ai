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
 glm:{
  name:"GLM / Z.ai",
  models:[
   {id:"glm-5.3",name:"GLM-5.3",family:"GLM-5.3",type:"旗舰 / 推理 / 编程"},
   {id:"glm-5.3-flash",name:"GLM-5.3-Flash",family:"GLM-5.3",type:"快速 / 多模态"},
   {id:"glm-5.2",name:"GLM-5.2",family:"GLM-5",type:"通用 / Agent"},
   {id:"glm-5",name:"GLM-5",family:"GLM-5",type:"通用"},
   {id:"glm-4.7",name:"GLM-4.7",family:"GLM-4",type:"通用 / 编程"},
   {id:"glm-4.7-flash",name:"GLM-4.7-Flash",family:"GLM-4",type:"快速"}
  ]
 },
 doubao:{
  name:"豆包 / 火山方舟",
  models:[
   {id:"doubao-seed-2-1-pro-260628",name:"Doubao-Seed-2.1-Pro",family:"Seed 2.1",type:"旗舰 / 推理"},
   {id:"doubao-seed-2-1-turbo-260528",name:"Doubao-Seed-2.1-Turbo",family:"Seed 2.1",type:"高速通用"},
   {id:"doubao-seed-2-1-lite-260528",name:"Doubao-Seed-2.1-Lite",family:"Seed 2.1",type:"轻量"},
   {id:"doubao-seed-2-0-pro-260215",name:"Doubao-Seed-2.0-Pro",family:"Seed 2.0",type:"旗舰"},
   {id:"doubao-seed-2-0-lite-260215",name:"Doubao-Seed-2.0-Lite",family:"Seed 2.0",type:"轻量"},
   {id:"doubao-seed-2-0-mini-260215",name:"Doubao-Seed-2.0-Mini",family:"Seed 2.0",type:"快速 / 轻量"},
   {id:"doubao-seed-2-0-code-260215",name:"Doubao-Seed-2.0-Code",family:"Seed 2.0 Code",type:"编程"}
  ]
 },
 grok:{
  name:"Grok / xAI",
  models:[
   {id:"grok-4.7",name:"Grok 4.7",family:"Grok 4",type:"旗舰 / 编程 / Agent"},
   {id:"grok-4.6",name:"Grok 4.6",family:"Grok 4",type:"旗舰 / 通用"},
   {id:"grok-4.20",name:"Grok 4.20",family:"Grok 4",type:"新一代"},
   {id:"grok-4.1",name:"Grok 4.1",family:"Grok 4",type:"通用"},
   {id:"grok-4",name:"Grok 4",family:"Grok 4",type:"推理 / 通用"},
   {id:"grok-3",name:"Grok 3",family:"Grok 3",type:"通用"}
  ]
 },
 meta:{
  name:"Meta AI / Meta Model API",
  models:[
   {id:"muse-spark-1.3",name:"Muse Spark 1.3",family:"Muse Spark",type:"旗舰 / Agent / 多模态"},
   {id:"muse-spark-1.2",name:"Muse Spark 1.2",family:"Muse Spark",type:"推理 / 多模态"},
   {id:"muse-spark-1.1",name:"Muse Spark 1.1",family:"Muse Spark",type:"推理 / 多模态"},
   {id:"muse-spark-1.3-contributor",name:"Muse Spark 1.3 Contributor",family:"Muse Spark",type:"Contributor / 低成本"}
  ]
 },
 microsoft:{
  name:"Microsoft AI / Foundry",
  models:[
   {id:"azure-deployment",name:"Azure 部署模型（自定义 Deployment ID）",family:"Microsoft Foundry",type:"自定义部署"},
   {id:"azure-openai",name:"Azure OpenAI（自定义 Deployment ID）",family:"Azure OpenAI",type:"OpenAI 兼容"}
  ]
 },
 kimi:{
  name:"Kimi / Moonshot AI",
  models:[
   {id:"kimi-k2.5",name:"Kimi K2.5",family:"Kimi K2",type:"旗舰 / 多模态"},
   {id:"kimi-k2",name:"Kimi K2",family:"Kimi K2",type:"推理 / 编程"},
   {id:"kimi-k2-thinking",name:"Kimi K2 Thinking",family:"Kimi K2",type:"深度推理"},
   {id:"kimi-k2-thinking-turbo",name:"Kimi K2 Thinking Turbo",family:"Kimi K2",type:"高速推理"}
  ]
 },
 minimax:{
  name:"MiniMax",
  models:[
   {id:"MiniMax-M3",name:"MiniMax M3",family:"MiniMax M3",type:"旗舰 / Agent / 多模态"},
   {id:"MiniMax-M2.7",name:"MiniMax M2.7",family:"MiniMax M2",type:"通用 / 编程"},
   {id:"MiniMax-M2.7-highspeed",name:"MiniMax M2.7 Highspeed",family:"MiniMax M2",type:"高速 / 编程"}
  ]
 },
 baidu:{
  name:"百度文心 / 千帆",
  models:[
   {id:"ernie-5.0",name:"ERNIE 5.0",family:"ERNIE 5",type:"旗舰 / 原生多模态 / 推理"},
   {id:"ernie-5.0-thinking-preview",name:"ERNIE 5.0 Thinking Preview",family:"ERNIE 5",type:"深度推理"},
   {id:"ernie-x1.1-preview",name:"ERNIE X1.1 Preview",family:"ERNIE X",type:"推理 / Agent"},
   {id:"ernie-4.5-turbo",name:"ERNIE 4.5 Turbo",family:"ERNIE 4.5",type:"高速通用"},
   {id:"deepseek-v4-pro",name:"DeepSeek-V4-Pro（千帆）",family:"DeepSeek V4",type:"第三方模型"},
   {id:"deepseek-v4-flash",name:"DeepSeek-V4-Flash（千帆）",family:"DeepSeek V4",type:"第三方模型"}
  ]
 },
 mimo:{
  name:"小米 MiMo",
  models:[
   {id:"mimo-v2.6-pro",name:"MiMo-V2.6-Pro",family:"MiMo V2.6",type:"旗舰 / Agent / 多模态"},
   {id:"mimo-v2.6-flash",name:"MiMo-V2.6-Flash",family:"MiMo V2.6",type:"高速 / 推理 / 编程"},
   {id:"mimo-v2-pro",name:"MiMo-V2-Pro",family:"MiMo V2",type:"Agent / 1M上下文"},
   {id:"mimo-v2-flash",name:"MiMo-V2-Flash",family:"MiMo V2",type:"高速 / 推理 / 编程"}
  ]
 },
 stepfun:{
  name:"阶跃星辰 / StepFun",
  models:[
   {id:"step-5-preview",name:"Step 5 Preview",family:"Step 5",type:"旗舰 / 前沿模型"},
   {id:"step-3.7-flash",name:"Step 3.7 Flash",family:"Step 3.7",type:"高速通用"},
   {id:"step-3.5-flash",name:"Step 3.5 Flash",family:"Step 3.5",type:"高速通用"},
   {id:"step-audio-3-realtime",name:"StepAudio 3 Realtime",family:"StepAudio 3",type:"实时语音"}
  ]
 },
 hunyuan:{
  name:"腾讯混元 / Tencent HY",
  models:[
   {id:"hunyuan-turbos-latest",name:"混元 Turbo",family:"混元 Turbo",type:"通用"},
   {id:"hunyuan-pro",name:"混元 Pro",family:"混元 Pro",type:"旗舰"},
   {id:"hunyuan-standard",name:"混元 Standard",family:"混元 Standard",type:"通用"}
  ]
 },
 longcat:{
  name:"LongCat / 美团",
  models:[
   {id:"LongCat-2.5-Preview",name:"LongCat-2.5-Preview",family:"LongCat 2.5",type:"旗舰 / Agent / 多模态"},
   {id:"LongCat-2.0",name:"LongCat-2.0",family:"LongCat 2",type:"Agent / 通用"}
  ]
 },
 pangu:{
  name:"盘古 / 华为云",
  models:[
   {id:"pangu-nlp-n1-32k",name:"Pangu-NLP-N1-32K",family:"盘古 NLP",type:"通用文本"},
   {id:"custom-pangu-model",name:"自定义盘古部署模型",family:"盘古 MaaS",type:"自定义 Deployment Model ID"}
  ]
 },
 sensetime:{
  name:"商汤 / SenseNova",
  models:[
   {id:"SenseNova-V6.5-Pro",name:"SenseNova V6.5 Pro",family:"SenseNova V6.5",type:"旗舰 / 多模态"},
   {id:"SenseNova-V6.5-Turbo",name:"SenseNova V6.5 Turbo",family:"SenseNova V6.5",type:"高速 / 多模态"},
   {id:"SenseChat-Character-Pro",name:"SenseChat Character Pro",family:"SenseNova Character",type:"角色对话"}
  ]
 },
 mistral:{
  name:"Mistral AI",
  models:[
   {id:"mistral-large-latest",name:"Mistral Large",family:"Mistral Large",type:"旗舰 / 通用"},
   {id:"mistral-medium-latest",name:"Mistral Medium",family:"Mistral Medium",type:"通用"},
   {id:"mistral-small-latest",name:"Mistral Small",family:"Mistral Small",type:"轻量 / 高性价比"},
   {id:"codestral-latest",name:"Codestral",family:"Codestral",type:"编程"}
  ]
 },
 ollama:{
  name:"Ollama",
  models:[
   {id:"llama3.2",name:"Llama 3.2（本地示例）",family:"Ollama Local",type:"本地模型 / 可自定义"},
   {id:"gemma4:31b",name:"Gemma 4 31B（云端示例）",family:"Ollama Cloud",type:"云端模型 / 可自定义"},
   {id:"custom-ollama-model",name:"自定义 Ollama 模型",family:"Ollama",type:"填写本地或云端模型 ID"}
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
 qwen:process.env.QWEN_BASE_URL||"https://dashscope-us.aliyuncs.com/compatible-mode/v1",
 glm:process.env.GLM_BASE_URL||"https://api.z.ai/api/paas/v4",
 doubao:process.env.DOUBAO_BASE_URL||"https://ark.cn-beijing.volces.com/api/v3",
 grok:process.env.XAI_BASE_URL||"https://api.x.ai/v1",
 baidu:process.env.BAIDU_BASE_URL||"https://qianfan.baidubce.com/v2",
 mimo:process.env.MIMO_BASE_URL||"",
 stepfun:process.env.STEPFUN_BASE_URL||"https://api.stepfun.com/v1",
 meta:process.env.META_BASE_URL||"https://api.meta.ai/v1",
 microsoft:process.env.MICROSOFT_BASE_URL||"",
 kimi:process.env.KIMI_BASE_URL||"https://api.moonshot.cn/v1",
 minimax:process.env.MINIMAX_BASE_URL||"https://api.minimax.io/v1",
 hunyuan:process.env.HUNYUAN_BASE_URL||"https://api.hunyuan.cloud.tencent.com/v1",
 longcat:process.env.LONGCAT_BASE_URL||"https://api.longcat.chat/openai/v1",
 pangu:process.env.PANGU_BASE_URL||"",
 sensetime:process.env.SENSETIME_BASE_URL||"https://api.sensenova.cn/compatible-mode/v1",
 mistral:process.env.MISTRAL_BASE_URL||"https://api.mistral.ai/v1",
 ollama:process.env.OLLAMA_BASE_URL||"http://localhost:11434/v1"
};
const KEYS={openai:"OPENAI_API_KEY",deepseek:"DEEPSEEK_API_KEY",claude:"ANTHROPIC_API_KEY",qwen:"DASHSCOPE_API_KEY",glm:"ZAI_API_KEY",doubao:"ARK_API_KEY",grok:"XAI_API_KEY",baidu:"BAIDU_API_KEY",mimo:"MIMO_API_KEY",stepfun:"STEPFUN_API_KEY",meta:"META_API_KEY",microsoft:"MICROSOFT_API_KEY",kimi:"KIMI_API_KEY",minimax:"MINIMAX_API_KEY",hunyuan:"HUNYUAN_API_KEY",gemini:"GEMINI_API_KEY",longcat:"LONGCAT_API_KEY",pangu:"PANGU_API_KEY",sensetime:"SENSETIME_API_KEY",mistral:"MISTRAL_API_KEY",ollama:"OLLAMA_API_KEY"};

function json(res,status,data){
 res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type, Authorization","Access-Control-Allow-Methods":"GET,POST,OPTIONS"});
 res.end(JSON.stringify(data));
}
function read(req){return new Promise((ok,fail)=>{let s="";req.on("data",c=>s+=c);req.on("end",()=>{try{ok(JSON.parse(s||"{}"))}catch(e){fail(e)}})})}
function extractText(content){return typeof content==="string"?content:JSON.stringify(content||"")}
function fileContext(files=[]){
 if(!Array.isArray(files)||!files.length)return "";
 return "\n\n【用户上传文件】\n"+files.map((f,i)=>{
  const name=f.name||("file-"+(i+1)),type=f.type||"application/octet-stream",text=f.text||"";
  return "["+(i+1)+"] "+name+" ("+type+")\n"+String(text).slice(0,200000);
 }).join("\n\n");
}
function normalizeSearchMode(mode){
 return mode==="always"||mode==="off"?""+mode:"auto";
}
function keyFor(provider){
 const k=KEYS[provider]?process.env[KEYS[provider]]:"";
 if(provider==="ollama" && !k)return "";
 if(!k)throw new Error("服务器没有配置 "+KEYS[provider]);
 return k;
}
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

async function geminiChat(messages,model,search,systemPrompt="",temperature=0.7){
 const key=keyFor("gemini");
 const input=messages.map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:String(m.content)}]}));
 const body={contents:input,generationConfig:{temperature}};
 if(systemPrompt)body.systemInstruction={parts:[{text:systemPrompt}]};
 if(search)body.tools=[{google_search:{}}];
 const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(model)+":generateContent?key="+encodeURIComponent(key),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
 const d=await r.json();if(!r.ok)throw new Error(d.error?.message||("Gemini API 错误："+r.status));
 const text=(d.candidates?.[0]?.content?.parts||[]).filter(p=>p.text).map(p=>p.text).join("");
 return {provider:"gemini",model:d.modelVersion||model,content:text,webSearch:!!search,grounding:d.candidates?.[0]?.groundingMetadata||null};
}

async function longcatChat(messages,model,systemPrompt="",temperature=0.7){
  const url=joinUrl(PROVIDERS.longcat.baseUrl,"chat/completions");
  const body={model,messages,temperature:Math.max(0,Math.min(1,temperature))};
  const r=await fetchJson(url,{method:"POST",headers:{"Authorization":"Bearer "+requireKey("longcat"),"Content-Type":"application/json"},body});
  return {provider:"longcat",model:r.model||model,content:r.choices?.[0]?.message?.content||"",webSearch:false};
}

async function chat(provider,messages,model,searchMode="auto",files=[],systemPrompt="",temperature=0.7){

 if(!CATALOG[provider])throw new Error("不支持的 AI 家族："+provider);
 if(!allowed(provider,model))throw new Error("模型不在当前家族目录中："+model);

 if(provider==="mimo" && !BASE.mimo) throw new Error("MiMo 需要配置 MIMO_BASE_URL（请从小米 MiMo 开发者平台复制当前 API Endpoint）");
 if(provider==="microsoft" && model==="azure-deployment") model=process.env.AZURE_MODEL_DEPLOYMENT||"";
 if(provider==="microsoft" && model==="azure-openai") model=process.env.AZURE_MODEL_DEPLOYMENT||"";
 if(provider==="microsoft" && !model)throw new Error("Microsoft Foundry/Azure 需要配置 AZURE_MODEL_DEPLOYMENT");
 if(provider==="longcat")return longcatChat(messages,model,systemPrompt,temperature);
 if(provider==="pangu" && !BASE.pangu) throw new Error("盘古需要配置 PANGU_BASE_URL（请填写华为云 MaaS 的区域 Endpoint）");
 if(provider==="ollama" && !BASE.ollama) throw new Error("Ollama 需要配置 OLLAMA_BASE_URL");
 if(provider==="pangu" && model==="custom-pangu-model") model=process.env.PANGU_MODEL||"";
 if(provider==="pangu" && !model) throw new Error("盘古需要配置 PANGU_MODEL");
 if(provider==="ollama" && model==="custom-ollama-model") model=process.env.OLLAMA_MODEL||"";
 if(provider==="ollama" && !model) throw new Error("Ollama 需要配置 OLLAMA_MODEL");
  if(provider==="gemini"){const mode=normalizeSearchMode(searchMode);const q=[...messages].reverse().find(m=>m.role==="user")?.content;const shouldSearch=mode==="always" || (mode==="auto" && /^(查|搜索|搜一下|联网|最新|今天|现在|新闻|价格|官网|资料|查找|检索)/.test(String(q||"")));return geminiChat(messages,model,shouldSearch,systemPrompt,temperature)}

 let finalMessages=messages.map(m=>({...m}));
 if(systemPrompt)finalMessages=[{role:"system",content:String(systemPrompt)},...finalMessages];
 const fc=fileContext(files);
 if(fc){
  const last=finalMessages.length-1;
  if(last>=0 && finalMessages[last].role==="user") finalMessages[last]={...finalMessages[last],content:extractText(finalMessages[last].content)+fc};
 }
 let searchData=null;
 const mode=normalizeSearchMode(searchMode);
 const q=[...finalMessages].reverse().find(m=>m.role==="user")?.content;
 const shouldSearch=mode==="always" || (mode==="auto" && /^(查|搜索|搜一下|联网|最新|今天|现在|新闻|价格|官网|资料|查找|检索)/.test(String(q||"")));
 if(shouldSearch){
  if(!q)throw new Error("联网搜索需要用户问题");
  if(!q)throw new Error("联网搜索需要用户问题");
  searchData=await webSearch(String(q));
  const context=searchContext(searchData);
  finalMessages=[...finalMessages.filter(m=>m.role==="system"),{role:"system",content:"你可以参考下面的联网搜索结果回答用户。请优先使用搜索结果中的最新事实；不要编造不存在的来源。如果给出来源，请保留 URL。"+context},...finalMessages.filter(m=>m.role!=="system")];
 }

 const key=keyFor(provider);

 if(provider==="claude"){
  const system=finalMessages.filter(m=>m.role==="system").map(m=>m.content).join("\n\n");
  const userMessages=finalMessages.filter(m=>m.role!=="system");
  const body={model,max_tokens:4096,messages:userMessages,temperature};if(system)body.system=system;
  const r=await fetch(BASE.claude+"/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},body:JSON.stringify(body)});
  const d=await r.json();if(!r.ok)throw new Error(d.error?.message||("Claude API 错误："+r.status));
  return {provider,model:d.model||model,content:(d.content||[]).filter(x=>x.type==="text").map(x=>x.text).join("\n"),webSearch:shouldSearch};
 }

 const headers={"Content-Type":"application/json"};
 if(key)headers.Authorization="Bearer "+key;
 if(provider==="microsoft" && process.env.AZURE_API_VERSION) headers["api-version"]=process.env.AZURE_API_VERSION;
 const r=await fetch(BASE[provider]+"/chat/completions",{method:"POST",headers,body:JSON.stringify({model,messages:finalMessages,temperature})});
 const d=await r.json();if(!r.ok)throw new Error(d.error?.message||("上游 API 错误："+r.status));
 return {provider,model:d.model||model,content:d.choices?.[0]?.message?.content||"",webSearch:shouldSearch};
}

const server=http.createServer(async(req,res)=>{
 if(req.method==="OPTIONS")return json(res,204,{});
 if(req.method==="GET"&&req.url==="/api/catalog")return json(res,200,Object.fromEntries(Object.entries(CATALOG).map(([id,p])=>[id,{name:p.name,models:p.models,configured:!!process.env[KEYS[id]]}])));
 if(req.method==="POST"&&req.url==="/api/search"){try{const b=await read(req);if(!b.query)return json(res,400,{error:"query 不能为空"});return json(res,200,await webSearch(String(b.query)))}catch(e){return json(res,500,{error:e.message})}}
 if(req.method==="GET"&&req.url==="/v1/models"){
  if(process.env.GATEWAY_API_KEY && req.headers.authorization!=="Bearer "+process.env.GATEWAY_API_KEY)return json(res,401,{error:{message:"Invalid gateway API key",type:"invalid_request_error"}});
  const data=Object.entries(CATALOG).flatMap(([provider,p])=>p.models.map(m=>({id:provider+"/"+m.id,object:"model",created:Date.now(),owned_by:p.name,provider,model:m.id})));
  return json(res,200,{object:"list",data});
 }
 if(req.method==="POST"&&req.url==="/v1/chat/completions"){try{
  if(process.env.GATEWAY_API_KEY && req.headers.authorization!=="Bearer "+process.env.GATEWAY_API_KEY)return json(res,401,{error:{message:"Invalid gateway API key",type:"invalid_request_error"}});
  const b=await read(req);
  if(!Array.isArray(b.messages)||!b.messages.length)return json(res,400,{error:{message:"messages 不能为空",type:"invalid_request_error"}});
  if(b.stream)return json(res,400,{error:{message:"当前聚合网关暂未开启 SSE 流式输出，请使用 stream:false",type:"invalid_request_error"}});
  let provider,model;
  if(String(b.model||"").includes("/"))[provider,model]=String(b.model).split(/\/(.+)/);
  else {
   const found=Object.entries(CATALOG).flatMap(([p,v])=>v.models.map(m=>({provider:p,model:m.id}))).find(x=>x.model===b.model);
   if(!found)return json(res,400,{error:{message:"未知模型："+b.model,type:"invalid_request_error"}});
   provider=found.provider;model=found.model;
  }
  const out=await chat(provider,b.messages,model,b.searchMode||"auto",b.files||[],b.systemPrompt||"",Number.isFinite(Number(b.temperature))?Math.max(0,Math.min(2,Number(b.temperature))):0.7);
  return json(res,200,{id:"chatcmpl-"+Date.now(),object:"chat.completion",created:Math.floor(Date.now()/1000),model:provider+"/"+out.model,choices:[{index:0,message:{role:"assistant",content:out.content},finish_reason:"stop"}],usage:out.usage||undefined});
 }catch(e){return json(res,500,{error:{message:e.message,type:"api_error"}})}}
 if(req.method==="POST"&&req.url==="/api/chat"){try{const b=await read(req);if(!Array.isArray(b.messages)||!b.messages.length)return json(res,400,{error:"messages 不能为空"});return json(res,200,await chat(b.provider||"openai",b.messages,b.model,b.searchMode||"auto",b.files||[],b.systemPrompt||"",Number.isFinite(Number(b.temperature))?Math.max(0,Math.min(2,Number(b.temperature))):0.7))}catch(e){return json(res,500,{error:e.message})}}
 return json(res,404,{error:"Not Found"});
});
server.listen(PORT,()=>console.log("API-AI running on port "+PORT));