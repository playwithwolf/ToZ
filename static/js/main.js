// 星座网站主要JavaScript功能

// 星座数据
const ZODIAC_DATA = {
    'aries': { name: '白羊座', icon: '♈', dates: '3月21日 - 4月19日', element: '火象星座' },
    'taurus': { name: '金牛座', icon: '♉', dates: '4月20日 - 5月20日', element: '土象星座' },
    'gemini': { name: '双子座', icon: '♊', dates: '5月21日 - 6月20日', element: '风象星座' },
    'cancer': { name: '巨蟹座', icon: '♋', dates: '6月21日 - 7月22日', element: '水象星座' },
    'leo': { name: '狮子座', icon: '♌', dates: '7月23日 - 8月22日', element: '火象星座' },
    'virgo': { name: '处女座', icon: '♍', dates: '8月23日 - 9月22日', element: '土象星座' },
    'libra': { name: '天秤座', icon: '♎', dates: '9月23日 - 10月22日', element: '风象星座' },
    'scorpio': { name: '天蝎座', icon: '♏', dates: '10月23日 - 11月21日', element: '水象星座' },
    'sagittarius': { name: '射手座', icon: '♐', dates: '11月22日 - 12月21日', element: '火象星座' },
    'capricorn': { name: '摩羯座', icon: '♑', dates: '12月22日 - 1月19日', element: '土象星座' },
    'aquarius': { name: '水瓶座', icon: '♒', dates: '1月20日 - 2月18日', element: '风象星座' },
    'pisces': { name: '双鱼座', icon: '♓', dates: '2月19日 - 3月20日', element: '水象星座' }
};

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    // 添加页面加载动画
    addFadeInAnimation();
    
    // 初始化导航
    initializeNavigation();
    
    // 检查用户登录状态
    checkUserLoginStatus();
    
    // 初始化页面特定功能
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'horoscope':
            initializeHoroscopePage();
            break;
        case 'compatibility':
            initializeCompatibilityPage();
            break;
        case 'search':
            initializeSearchPage();
            break;
        case 'profile':
            initializeProfilePage();
            break;
    }
}

// 获取当前页面
function getCurrentPage() {
    const path = window.location.pathname;
    if (path === '/' || path.includes('index')) return 'index';
    if (path.includes('horoscope')) return 'horoscope';
    if (path.includes('compatibility')) return 'compatibility';
    if (path.includes('search')) return 'search';
    if (path.includes('profile')) return 'profile';
    return 'index';
}

// 添加淡入动画
function addFadeInAnimation() {
    const elements = document.querySelectorAll('.zodiac-card, .feature-card, .form-container');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 初始化导航
function initializeNavigation() {
    // 高亮当前页面导航
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath === '/' && link.getAttribute('href') === '/')) {
            link.style.color = '#667eea';
            link.style.fontWeight = 'bold';
        }
    });
}

// 检查用户登录状态
function checkUserLoginStatus() {
    const userOpenid = getCookie('user_openid');
    const loginBtn = document.querySelector('.login-btn');
    
    if (userOpenid && loginBtn) {
        // 用户已登录，更新登录按钮
        fetchUserInfo(userOpenid).then(userInfo => {
            if (userInfo) {
                loginBtn.textContent = userInfo.nickname || '用户中心';
                loginBtn.href = '/profile';
            }
        });
    }
}

// 获取Cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// 获取用户信息
async function fetchUserInfo(openid) {
    try {
        const response = await fetch(`/api/user/${openid}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
    return null;
}

// 初始化首页
function initializeHomePage() {
    // 创建星座卡片
    createZodiacCards();
    
    // 添加星座卡片点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.zodiac-card')) {
            const card = e.target.closest('.zodiac-card');
            const sign = card.dataset.sign;
            if (sign) {
                window.location.href = `/horoscope?sign=${sign}`;
            }
        }
    });
}

// 创建星座卡片
function createZodiacCards() {
    const zodiacGrid = document.querySelector('.zodiac-grid');
    if (!zodiacGrid) return;
    
    Object.entries(ZODIAC_DATA).forEach(([key, data]) => {
        const card = document.createElement('div');
        card.className = 'zodiac-card';
        card.dataset.sign = key;
        
        card.innerHTML = `
            <span class="zodiac-icon">${data.icon}</span>
            <h3>${data.name}</h3>
            <div class="date-range">${data.dates}</div>
            <div class="description">${data.element}</div>
        `;
        
        zodiacGrid.appendChild(card);
    });
}

// 初始化运势页面
function initializeHoroscopePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const sign = urlParams.get('sign');
    
    if (sign) {
        loadHoroscope(sign);
    }
    
    // 星座选择表单
    const form = document.getElementById('horoscope-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedSign = document.getElementById('zodiac-select').value;
            if (selectedSign) {
                loadHoroscope(selectedSign);
            }
        });
    }
}

// 加载星座运势
async function loadHoroscope(sign) {
    const resultContainer = document.getElementById('horoscope-result');
    if (!resultContainer) return;
    
    // 显示加载状态
    resultContainer.innerHTML = '<div class="loading"></div><p>正在获取运势...</p>';
    resultContainer.classList.remove('hidden');
    
    try {
        const response = await fetch(`/api/horoscope/${sign}`);
        const data = await response.json();
        
        if (response.ok) {
            displayHoroscope(data);
        } else {
            showError('获取运势失败，请稍后重试');
        }
    } catch (error) {
        console.error('获取运势错误:', error);
        showError('网络错误，请检查网络连接');
    }
}

// 显示星座运势
function displayHoroscope(data) {
    const resultContainer = document.getElementById('horoscope-result');
    
    resultContainer.innerHTML = `
        <div class="result-header">
            <h2>${data.sign} 今日运势</h2>
            <div class="result-date">${data.date}</div>
        </div>
        
        <div class="fortune-grid">
            <div class="fortune-item">
                <h4>综合运势</h4>
                <p>${data.fortune.overall}</p>
            </div>
            <div class="fortune-item">
                <h4>爱情运势</h4>
                <p>${data.fortune.love}</p>
            </div>
            <div class="fortune-item">
                <h4>事业运势</h4>
                <p>${data.fortune.career}</p>
            </div>
            <div class="fortune-item">
                <h4>财运</h4>
                <p>${data.fortune.wealth}</p>
            </div>
            <div class="fortune-item">
                <h4>健康运势</h4>
                <p>${data.fortune.health}</p>
            </div>
        </div>
        
        <div class="lucky-info">
            <div class="lucky-item">
                <h4>幸运数字</h4>
                <span>${data.lucky_number}</span>
            </div>
            <div class="lucky-item">
                <h4>幸运颜色</h4>
                <span>${data.lucky_color}</span>
            </div>
            <div class="lucky-item">
                <h4>最佳配对</h4>
                <span>${data.compatibility}</span>
            </div>
        </div>
    `;
}

// 初始化配对页面
function initializeCompatibilityPage() {
    const form = document.getElementById('compatibility-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const sign1 = document.getElementById('sign1-select').value;
            const sign2 = document.getElementById('sign2-select').value;
            
            if (sign1 && sign2) {
                loadCompatibility(sign1, sign2);
            }
        });
    }
}

// 加载星座配对
async function loadCompatibility(sign1, sign2) {
    const resultContainer = document.getElementById('compatibility-result');
    if (!resultContainer) return;
    
    // 显示加载状态
    resultContainer.innerHTML = '<div class="loading"></div><p>正在分析配对...</p>';
    resultContainer.classList.remove('hidden');
    
    try {
        // 模拟API调用
        const data = await simulateCompatibilityAPI(sign1, sign2);
        displayCompatibility(data);
    } catch (error) {
        console.error('获取配对信息错误:', error);
        showError('获取配对信息失败，请稍后重试');
    }
}

// 模拟配对API
function simulateCompatibilityAPI(sign1, sign2) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const scores = [85, 92, 78, 88, 95, 82, 90, 76, 87, 93];
            const descriptions = [
                '天作之合，非常般配',
                '性格互补，相处融洽',
                '需要磨合，但前景良好',
                '默契十足，心有灵犀',
                '互相吸引，充满激情'
            ];
            
            resolve({
                sign1: ZODIAC_DATA[sign1]?.name || sign1,
                sign2: ZODIAC_DATA[sign2]?.name || sign2,
                score: scores[Math.floor(Math.random() * scores.length)],
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                advice: '多沟通交流，理解对方想法，感情会更加稳固。'
            });
        }, 1000);
    });
}

// 显示配对结果
function displayCompatibility(data) {
    const resultContainer = document.getElementById('compatibility-result');
    
    resultContainer.innerHTML = `
        <div class="result-header">
            <h2>${data.sign1} ❤️ ${data.sign2}</h2>
            <div class="compatibility-score">
                <div style="font-size: 2rem; color: #667eea; margin: 1rem 0;">${data.score}分</div>
            </div>
        </div>
        
        <div class="compatibility-content">
            <div class="compatibility-description">
                <h3>配对分析</h3>
                <p>${data.description}</p>
            </div>
            
            <div class="compatibility-advice">
                <h3>相处建议</h3>
                <p>${data.advice}</p>
            </div>
        </div>
    `;
}

// 初始化搜索页面
function initializeSearchPage() {
    const form = document.getElementById('search-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const birthday = document.getElementById('birthday').value;
            if (birthday) {
                const sign = getZodiacSign(birthday);
                displaySearchResult(sign, birthday);
            }
        });
    }
}

// 根据生日获取星座
function getZodiacSign(birthday) {
    const date = new Date(birthday);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
    
    return 'aries'; // 默认
}

// 显示搜索结果
function displaySearchResult(sign, birthday) {
    const resultContainer = document.getElementById('search-result');
    if (!resultContainer) return;
    
    const zodiacInfo = ZODIAC_DATA[sign];
    
    resultContainer.innerHTML = `
        <div class="result-header">
            <h2>您的星座是：${zodiacInfo.name}</h2>
            <div class="zodiac-icon" style="font-size: 4rem; margin: 1rem 0;">${zodiacInfo.icon}</div>
        </div>
        
        <div class="zodiac-info">
            <p><strong>生日：</strong>${birthday}</p>
            <p><strong>星座日期：</strong>${zodiacInfo.dates}</p>
            <p><strong>星座属性：</strong>${zodiacInfo.element}</p>
        </div>
        
        <div style="margin-top: 2rem; text-align: center;">
            <a href="/horoscope?sign=${sign}" class="cta-button">查看今日运势</a>
        </div>
    `;
    
    resultContainer.classList.remove('hidden');
}

// 初始化用户资料页面
function initializeProfilePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const openid = urlParams.get('openid') || getCookie('user_openid');
    
    if (openid) {
        loadUserProfile(openid);
        setupProfileEventListeners();
    } else {
        showLoginPrompt();
    }
}

// 设置用户资料页面事件监听器
function setupProfileEventListeners() {
    // 刷新按钮
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const openid = getCookie('user_openid');
            if (openid) {
                loadUserProfile(openid);
                showSuccess('信息已刷新');
            }
        });
    }
    
    // 退出登录按钮
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                logout();
            }
        });
    }
}

// 退出登录
function logout() {
    // 清除cookie
    document.cookie = 'user_openid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // 显示成功消息
    showSuccess('已成功退出登录');
    
    // 延迟跳转到首页
    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
}

// 加载用户资料
async function loadUserProfile(openid) {
    try {
        const userInfo = await fetchUserInfo(openid);
        if (userInfo) {
            displayUserProfile(userInfo);
        } else {
            showLoginPrompt();
        }
    } catch (error) {
        console.error('加载用户资料失败:', error);
        showError('加载用户资料失败');
    }
}

// 显示用户资料
function displayUserProfile(userInfo) {
    // 隐藏登录提示，显示用户资料
    const loginPrompt = document.getElementById('login-prompt');
    const userProfile = document.getElementById('user-profile');
    const userStats = document.getElementById('user-stats');
    
    if (loginPrompt) loginPrompt.classList.add('hidden');
    if (userProfile) userProfile.classList.remove('hidden');
    if (userStats) userStats.classList.remove('hidden');
    
    // 更新用户头像
    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar && userInfo.headimgurl) {
        userAvatar.innerHTML = `<img src="${userInfo.headimgurl}" alt="用户头像" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    }
    
    // 更新用户昵称
    const userNickname = document.getElementById('user-nickname');
    if (userNickname) {
        userNickname.textContent = userInfo.nickname || '微信用户';
    }
    
    // 更新用户地区
    const userLocation = document.getElementById('user-location');
    if (userLocation) {
        const location = [];
        if (userInfo.country) location.push(userInfo.country);
        if (userInfo.province) location.push(userInfo.province);
        if (userInfo.city) location.push(userInfo.city);
        userLocation.textContent = location.length > 0 ? location.join(' ') : '未知地区';
    }
}

// 显示登录提示
function showLoginPrompt() {
    const loginPrompt = document.getElementById('login-prompt');
    const userProfile = document.getElementById('user-profile');
    const userStats = document.getElementById('user-stats');
    
    if (loginPrompt) loginPrompt.classList.remove('hidden');
    if (userProfile) userProfile.classList.add('hidden');
    if (userStats) userStats.classList.add('hidden');
}

// 显示错误信息
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.main-content');
    if (container) {
        container.insertBefore(errorDiv, container.firstChild);
        
        // 3秒后自动移除
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// 显示成功信息
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'message success';
    successDiv.textContent = message;
    
    const container = document.querySelector('.main-content');
    if (container) {
        container.insertBefore(successDiv, container.firstChild);
        
        // 3秒后自动移除
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

// 工具函数：填充星座选择框
function populateZodiacSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    Object.entries(ZODIAC_DATA).forEach(([key, data]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = data.name;
        select.appendChild(option);
    });
}