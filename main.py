from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import httpx
import json
import os
from datetime import datetime
from wechat_auth import WeChatAuth, HoroscopeService
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = FastAPI(title="星座微信登录网站", description="基于微信登录的星座主题网站")

# 挂载静态文件
app.mount("/static", StaticFiles(directory="static"), name="static")

# 微信登录配置
WECHAT_CONFIG = {
    "APP_ID": os.getenv("WECHAT_APP_ID", "your_wechat_app_id"),
    "APP_SECRET": os.getenv("WECHAT_APP_SECRET", "your_wechat_app_secret"),
    "REDIRECT_URI": os.getenv("WECHAT_REDIRECT_URI", "https://your-domain.com/auth/callback")
}

# 初始化微信认证和星座服务
wechat_auth = WeChatAuth()
horoscope_service = HoroscopeService()

# 存储用户会话（生产环境应使用数据库）
user_sessions = {}

@app.get("/", response_class=HTMLResponse)
async def home():
    """首页"""
    with open("static/index.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.get("/horoscope", response_class=HTMLResponse)
async def horoscope():
    """星座运势页面"""
    with open("static/horoscope.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.get("/compatibility", response_class=HTMLResponse)
async def compatibility():
    """星座配对页面"""
    with open("static/compatibility.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.get("/search", response_class=HTMLResponse)
async def search():
    """星座查询页面"""
    with open("static/search.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.get("/about", response_class=HTMLResponse)
async def about():
    """关于我们页面"""
    with open("static/about.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.get("/shop", response_class=HTMLResponse)
async def shop():
    """礼品商城页面"""
    with open("static/shop.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.get("/profile", response_class=HTMLResponse)
async def profile():
    """用户资料页面"""
    with open("static/profile.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.get("/auth/login")
async def wechat_login():
    """微信登录重定向"""
    auth_url = wechat_auth.get_auth_url(WECHAT_CONFIG["REDIRECT_URI"])
    return RedirectResponse(url=auth_url)

@app.get("/auth/callback")
async def wechat_callback(code: str = None, state: str = None):
    """微信登录回调"""
    if not code:
        raise HTTPException(status_code=400, detail="授权失败")
    
    try:
        # 获取access_token
        token_url = "https://api.weixin.qq.com/sns/oauth2/access_token"
        token_params = {
            'appid': WECHAT_CONFIG["APP_ID"],
            'secret': WECHAT_CONFIG["APP_SECRET"],
            'code': code,
            'grant_type': 'authorization_code'
        }
        
        token_response = requests.get(token_url, params=token_params)
        token_data = token_response.json()
        
        if 'access_token' not in token_data:
            raise HTTPException(status_code=400, detail="获取access_token失败")
        
        access_token = token_data['access_token']
        openid = token_data['openid']
        
        # 获取用户信息
        user_info_url = "https://api.weixin.qq.com/sns/userinfo"
        user_info_params = {
            'access_token': access_token,
            'openid': openid
        }
        
        user_response = requests.get(user_info_url, params=user_info_params)
        user_data = user_response.json()
        
        # 存储用户会话
        user_sessions[openid] = {
            'openid': openid,
            'nickname': user_data.get('nickname', ''),
            'headimgurl': user_data.get('headimgurl', ''),
            'login_time': datetime.now().isoformat()
        }
        
        # 重定向到用户资料页面
        response = RedirectResponse(url=f"/profile?openid={openid}")
        response.set_cookie(key="user_openid", value=openid, max_age=86400)  # 24小时
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"登录处理失败: {str(e)}")

@app.get("/api/user/{openid}")
async def get_user_info(openid: str):
    """获取用户信息API"""
    if openid not in user_sessions:
        raise HTTPException(status_code=404, detail="用户未找到")
    
    return user_sessions[openid]

@app.get("/api/horoscope/{sign}")
async def get_horoscope(sign: str):
    """获取星座运势API（模拟数据）"""
    horoscope_data = {
        "sign": sign,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "fortune": {
            "overall": "今日运势不错，适合做重要决定",
            "love": "感情运势平稳，单身者有机会遇到心仪对象",
            "career": "工作上会有新的机遇，把握好时机",
            "wealth": "财运一般，避免大额投资",
            "health": "身体状况良好，注意休息"
        },
        "lucky_number": 7,
        "lucky_color": "蓝色"
    }
    return horoscope_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)