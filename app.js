// 应用主逻辑文件
document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initApp();
});

// 初始化应用
function initApp() {
    // 从localStorage加载数据或使用默认数据
    loadAppData();
    
    // 初始化链接卡片
    initLinkCards();
    
    // 初始化数据面板
    initDataPanel();
    
    // 初始化事件监听器
    initEventListeners();
    
    // 更新数据面板
    updateDataPanel();
}

// 应用数据模型
let appData = {
    links: [],
    totalClicks: 0,
    todayVisits: 0,
    lastVisit: null,
    clickHistory: [],
    announcement: "欢迎使用应用服务平台！系统运行稳定，所有功能均可正常使用。最新版本已上线，带来更流畅的使用体验。",
    maintenanceTime: "每周日凌晨 2:00-4:00",
    version: "v2.1.5"
};

// 默认链接数据
const defaultLinks = [
    {
        id: 1,
        title: "应用下载中心",
        description: "获取最新版本的应用和工具，支持多平台下载",
        icon: "fas fa-download",
        url: "https://example.com/download",
        clicks: 0,
        lastClick: null,
        color: 1
    },
    {
        id: 2,
        title: "用户指南文档",
        description: "详细的使用教程和常见问题解答，帮助您快速上手",
        icon: "fas fa-book",
        url: "https://example.com/docs",
        clicks: 0,
        lastClick: null,
        color: 2
    },
    {
        id: 3,
        title: "在线技术支持",
        description: "7x24小时在线技术支持，随时为您解决问题",
        icon: "fas fa-headset",
        url: "https://example.com/support",
        clicks: 0,
        lastClick: null,
        color: 3
    },
    {
        id: 4,
        title: "社区论坛",
        description: "加入用户社区，分享使用心得和交流经验",
        icon: "fas fa-users",
        url: "https://example.com/community",
        clicks: 0,
        lastClick: null,
        color: 4
    },
    {
        id: 5,
        title: "系统状态监控",
        description: "实时查看系统运行状态和服务可用性",
        icon: "fas fa-server",
        url: "https://example.com/status",
        clicks: 0,
        lastClick: null,
        color: 5
    }
];

// 加载应用数据
function loadAppData() {
    const savedData = localStorage.getItem('appData');
    
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            appData = { ...appData, ...parsedData };
            
            // 确保links数组存在且完整
            if (!appData.links || appData.links.length === 0) {
                appData.links = [...defaultLinks];
            }
        } catch (e) {
            console.error('加载数据失败，使用默认数据:', e);
            appData.links = [...defaultLinks];
        }
    } else {
        appData.links = [...defaultLinks];
    }
    
    // 更新页面显示的数据
    document.getElementById('announcement-text').textContent = appData.announcement;
    document.getElementById('maintenance-time').textContent = appData.maintenanceTime;
    document.getElementById('version-number').textContent = appData.version;
    
    // 更新今日访问量
    const today = new Date().toDateString();
    if (!appData.lastVisit || new Date(appData.lastVisit).toDateString() !== today) {
        appData.todayVisits = 0;
    }
    appData.todayVisits++;
    appData.lastVisit = new Date().toISOString();
    
    // 保存更新后的数据
    saveAppData();
}

// 保存应用数据
function saveAppData() {
    try {
        localStorage.setItem('appData', JSON.stringify(appData));
    } catch (e) {
        console.error('保存数据失败:', e);
    }
}

// 初始化链接卡片
function initLinkCards() {
    const linksContainer = document.getElementById('links-container');
    linksContainer.innerHTML = '';
    
    appData.links.forEach(link => {
        const linkCard = createLinkCard(link);
        linksContainer.appendChild(linkCard);
    });
}

// 创建链接卡片
function createLinkCard(link) {
    const card = document.createElement('div');
    card.className = 'link-card';
    card.dataset.id = link.id;
    
    const iconClass = link.icon || getDefaultIcon(link.id);
    const colorClass = link.color || 1;
    
    card.innerHTML = `
        <div class="link-icon" style="background: ${getColorGradient(colorClass)};">
            <i class="${iconClass}"></i>
        </div>
        <h3 class="link-title">${link.title}</h3>
        <p class="link-desc">${link.description}</p>
        <div class="link-stats">
            <div>点击次数: <span class="click-count">${link.clicks}</span></div>
            <div>${link.lastClick ? formatDate(link.lastClick) : '尚未点击'}</div>
        </div>
    `;
    
    // 添加点击事件
    card.addEventListener('click', function(e) {
        e.preventDefault();
        handleLinkClick(link);
    });
    
    return card;
}

// 获取颜色渐变
function getColorGradient(colorNum) {
    const gradients = [
        'linear-gradient(135deg, #667eea, #764ba2)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #fa709a, #fee140)'
    ];
    
    return gradients[colorNum - 1] || gradients[0];
}

// 获取默认图标
function getDefaultIcon(id) {
    const icons = [
        'fas fa-download',
        'fas fa-book',
        'fas fa-headset',
        'fas fa-users',
        'fas fa-server'
    ];
    
    return icons[id - 1] || 'fas fa-external-link-alt';
}

// 处理链接点击
function handleLinkClick(link) {
    const startTime = performance.now();
    
    // 添加点击动画
    const card = document.querySelector(`.link-card[data-id="${link.id}"]`);
    card.classList.add('clicked');
    setTimeout(() => {
        card.classList.remove('clicked');
    }, 300);
    
    // 更新点击统计
    link.clicks++;
    link.lastClick = new Date().toISOString();
    appData.totalClicks++;
    
    // 记录点击历史
    appData.clickHistory.push({
        linkId: link.id,
        linkTitle: link.title,
        timestamp: new Date().toISOString(),
        responseTime: 0 // 将在后面计算
    });
    
    // 保存数据
    saveAppData();
    
    // 更新UI
    updateLinkCard(link.id);
    updateDataPanel();
    
    // 计算响应时间
    const responseTime = performance.now() - startTime;
    
    // 更新最后一次点击的响应时间
    if (appData.clickHistory.length > 0) {
        appData.clickHistory[appData.clickHistory.length - 1].responseTime = responseTime;
    }
    
    // 模拟网络请求延迟，然后跳转
    setTimeout(() => {
        // 在实际应用中，这里应该是实际跳转
        // window.open(link.url, '_blank');
        
        // 这里我们只显示一个提示
        console.log(`正在跳转到: ${link.url}`);
        alert(`即将跳转到: ${link.title}\nURL: ${link.url}\n响应时间: ${responseTime.toFixed(2)}ms`);
    }, 100);
}

// 更新链接卡片显示
function updateLinkCard(linkId) {
    const link = appData.links.find(l => l.id === linkId);
    if (!link) return;
    
    const card = document.querySelector(`.link-card[data-id="${link.id}"]`);
    if (card) {
        const clickCount = card.querySelector('.click-count');
        const lastClick = card.querySelector('.link-stats div:nth-child(2)');
        
        if (clickCount) {
            clickCount.textContent = link.clicks;
        }
        
        if (lastClick) {
            lastClick.textContent = link.lastClick ? formatDate(link.lastClick) : '尚未点击';
        }
    }
}

// 初始化数据面板
function initDataPanel() {
    // 设置初始值
    document.getElementById('total-clicks').textContent = appData.totalClicks;
    document.getElementById('user-activity').textContent = '0%';
    document.getElementById('response-time').textContent = '0ms';
    
    // 查找最受欢迎的链接
    updatePopularLink();
}

// 更新数据面板
function updateDataPanel() {
    // 更新总点击量
    document.getElementById('total-clicks').textContent = appData.totalClicks;
    
    // 更新总点击量进度条
    const totalProgress = document.getElementById('total-progress');
    const maxClicks = Math.max(...appData.links.map(l => l.clicks), 1);
    const totalProgressPercent = Math.min((appData.totalClicks / (maxClicks * 5)) * 100, 100);
    totalProgress.style.width = `${totalProgressPercent}%`;
    
    // 更新最受欢迎的链接
    updatePopularLink();
    
    // 更新用户活跃度
    updateUserActivity();
    
    // 更新响应时间
    updateResponseTime();
}

// 更新最受欢迎的链接
function updatePopularLink() {
    if (appData.links.length === 0) {
        document.getElementById('popular-link').textContent = '-';
        return;
    }
    
    // 找出点击最多的链接
    let maxClicks = 0;
    let popularLink = null;
    
    appData.links.forEach(link => {
        if (link.clicks > maxClicks) {
            maxClicks = link.clicks;
            popularLink = link;
        }
    });
    
    if (popularLink) {
        document.getElementById('popular-link').textContent = popularLink.title;
        
        // 更新进度条
        const popularProgress = document.getElementById('popular-progress');
        const maxClicksAll = Math.max(...appData.links.map(l => l.clicks), 1);
        const popularProgressPercent = (popularLink.clicks / maxClicksAll) * 100;
        popularProgress.style.width = `${popularProgressPercent}%`;
    }
}

// 更新用户活跃度
function updateUserActivity() {
    // 简单的活跃度计算：基于今日点击次数
    let activity = 0;
    
    if (appData.totalClicks > 0) {
        // 假设每个链接平均点击次数为10次时活跃度为100%
        const maxExpectedClicks = appData.links.length * 10;
        activity = Math.min((appData.totalClicks / maxExpectedClicks) * 100, 100);
    }
    
    document.getElementById('user-activity').textContent = `${activity.toFixed(1)}%`;
    
    // 更新进度条
    const activityProgress = document.getElementById('activity-progress');
    activityProgress.style.width = `${activity}%`;
}

// 更新响应时间
function updateResponseTime() {
    if (appData.clickHistory.length === 0) {
        document.getElementById('response-time').textContent = '0ms';
        return;
    }
    
    // 计算平均响应时间
    let totalResponseTime = 0;
    let count = 0;
    
    // 只计算最近10次点击
    const recentClicks = appData.clickHistory.slice(-10);
    
    recentClicks.forEach(click => {
        if (click.responseTime > 0) {
            totalResponseTime += click.responseTime;
            count++;
        }
    });
    
    if (count === 0) {
        document.getElementById('response-time').textContent = '0ms';
        return;
    }
    
    const avgResponseTime = totalResponseTime / count;
    document.getElementById('response-time').textContent = `${avgResponseTime.toFixed(1)}ms`;
    
    // 更新进度条（响应时间越短越好，所以是反向的）
    const responseProgress = document.getElementById('response-progress');
    let responsePercent = 0;
    
    if (avgResponseTime > 0) {
        // 假设100ms为最差，0ms为最佳
        responsePercent = Math.max(0, 100 - (avgResponseTime / 100) * 100);
    }
    
    responseProgress.style.width = `${responsePercent}%`;
}

// 初始化事件监听器
function initEventListeners() {
    // 检查localStorage变化（用于后台管理更新）
    window.addEventListener('storage', function(e) {
        if (e.key === 'appData') {
            try {
                const newData = JSON.parse(e.newValue);
                appData = { ...appData, ...newData };
                initLinkCards();
                updateDataPanel();
                
                // 更新公告
                document.getElementById('announcement-text').textContent = appData.announcement;
                document.getElementById('maintenance-time').textContent = appData.maintenanceTime;
                document.getElementById('version-number').textContent = appData.version;
            } catch (error) {
                console.error('同步数据失败:', error);
            }
        }
    });
    
    // 模拟后台管理更新（在同一页面内）
    window.addEventListener('appDataUpdated', function() {
        loadAppData();
        initLinkCards();
        updateDataPanel();
    });
}

// 工具函数：格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
        return '刚刚';
    } else if (diffMins < 60) {
        return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
        return `${diffHours}小时前`;
    } else if (diffDays < 7) {
        return `${diffDays}天前`;
    } else {
        return date.toLocaleDateString('zh-CN');
    }
}

// 导出数据函数（用于后台管理）
function exportData() {
    const dataStr = JSON.stringify(appData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `app-data-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
