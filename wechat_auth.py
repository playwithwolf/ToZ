import requests
import json
import hashlib
import time
import urllib.parse
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

class WeChatAuth:
    """微信登录认证类"""
    
    def __init__(self):
        self.app_id = os.getenv("WECHAT_APP_ID")
        self.app_secret = os.getenv("WECHAT_APP_SECRET")
        self.redirect_uri = os.getenv("REDIRECT_URI")
        
    def get_auth_url(self, state: str = "STATE") -> str:
        """获取微信授权URL"""
        params = {
            'appid': self.app_id,
            'redirect_uri': self.redirect_uri,
            'response_type': 'code',
            'scope': 'snsapi_login',
            'state': state
        }
        
        base_url = "https://open.weixin.qq.com/connect/qrconnect"
        return f"{base_url}?{urllib.parse.urlencode(params)}#wechat_redirect"
    
    def get_access_token(self, code: str) -> Optional[Dict[str, Any]]:
        """通过code获取access_token"""
        url = "https://api.weixin.qq.com/sns/oauth2/access_token"
        params = {
            'appid': self.app_id,
            'secret': self.app_secret,
            'code': code,
            'grant_type': 'authorization_code'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if 'access_token' in data:
                return data
            else:
                print(f"获取access_token失败: {data}")
                return None
                
        except Exception as e:
            print(f"请求access_token异常: {e}")
            return None
    
    def get_user_info(self, access_token: str, openid: str) -> Optional[Dict[str, Any]]:
        """获取用户信息"""
        url = "https://api.weixin.qq.com/sns/userinfo"
        params = {
            'access_token': access_token,
            'openid': openid
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if 'openid' in data:
                return data
            else:
                print(f"获取用户信息失败: {data}")
                return None
                
        except Exception as e:
            print(f"请求用户信息异常: {e}")
            return None
    
    def refresh_access_token(self, refresh_token: str) -> Optional[Dict[str, Any]]:
        """刷新access_token"""
        url = "https://api.weixin.qq.com/sns/oauth2/refresh_token"
        params = {
            'appid': self.app_id,
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if 'access_token' in data:
                return data
            else:
                print(f"刷新access_token失败: {data}")
                return None
                
        except Exception as e:
            print(f"刷新access_token异常: {e}")
            return None
    
    def check_access_token(self, access_token: str, openid: str) -> bool:
        """检验access_token是否有效"""
        url = "https://api.weixin.qq.com/sns/auth"
        params = {
            'access_token': access_token,
            'openid': openid
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            return data.get('errcode') == 0
            
        except Exception as e:
            print(f"检验access_token异常: {e}")
            return False

class HoroscopeService:
    """星座服务类"""
    
    # 星座数据
    ZODIAC_SIGNS = {
        'aries': '白羊座',
        'taurus': '金牛座', 
        'gemini': '双子座',
        'cancer': '巨蟹座',
        'leo': '狮子座',
        'virgo': '处女座',
        'libra': '天秤座',
        'scorpio': '天蝎座',
        'sagittarius': '射手座',
        'capricorn': '摩羯座',
        'aquarius': '水瓶座',
        'pisces': '双鱼座'
    }
    
    @classmethod
    def get_horoscope_data(cls, sign: str) -> Dict[str, Any]:
        """获取星座运势数据（模拟）"""
        import random
        from datetime import datetime
        
        # 模拟运势数据
        fortunes = [
            "今日运势极佳，万事如意",
            "运势平稳，保持积极心态", 
            "小有波折，但终将顺利",
            "贵人相助，事半功倍",
            "需要耐心等待时机"
        ]
        
        love_fortunes = [
            "桃花运旺盛，单身者有望脱单",
            "感情稳定，适合深入交流",
            "需要多关心伴侣感受",
            "有机会遇到心仪对象",
            "感情需要更多包容理解"
        ]
        
        career_fortunes = [
            "工作顺利，有晋升机会",
            "团队合作愉快，效率提升",
            "需要加强学习提升技能",
            "有新项目机会出现",
            "保持专注，避免分心"
        ]
        
        wealth_fortunes = [
            "财运亨通，投资有收益",
            "收入稳定，适合储蓄",
            "避免冲动消费",
            "有意外收入可能",
            "理财需要更加谨慎"
        ]
        
        health_fortunes = [
            "身体健康，精力充沛",
            "注意休息，避免过劳",
            "适合运动锻炼",
            "饮食要规律健康",
            "保持良好作息习惯"
        ]
        
        colors = ["红色", "蓝色", "绿色", "紫色", "金色", "银色", "粉色", "橙色"]
        
        return {
            "sign": cls.ZODIAC_SIGNS.get(sign, sign),
            "sign_en": sign,
            "date": datetime.now().strftime("%Y年%m月%d日"),
            "fortune": {
                "overall": random.choice(fortunes),
                "love": random.choice(love_fortunes),
                "career": random.choice(career_fortunes),
                "wealth": random.choice(wealth_fortunes),
                "health": random.choice(health_fortunes)
            },
            "lucky_number": random.randint(1, 99),
            "lucky_color": random.choice(colors),
            "compatibility": random.choice(list(cls.ZODIAC_SIGNS.values()))
        }
    
    @classmethod
    def get_compatibility(cls, sign1: str, sign2: str) -> Dict[str, Any]:
        """获取星座配对数据"""
        import random
        
        compatibility_scores = [85, 92, 78, 88, 95, 82, 90, 76, 87, 93]
        compatibility_desc = [
            "天作之合，非常般配",
            "性格互补，相处融洽", 
            "需要磨合，但前景良好",
            "默契十足，心有灵犀",
            "互相吸引，充满激情"
        ]
        
        return {
            "sign1": cls.ZODIAC_SIGNS.get(sign1, sign1),
            "sign2": cls.ZODIAC_SIGNS.get(sign2, sign2),
            "score": random.choice(compatibility_scores),
            "description": random.choice(compatibility_desc),
            "advice": "多沟通交流，理解对方想法，感情会更加稳固。"
        }

# 全局实例
wechat_auth = WeChatAuth()
horoscope_service = HoroscopeService()