// 修复链接跳转的核心代码
// 在 app.js 文件中找到 handleLinkClick 函数并进行以下修改

// 修改前的代码（注释掉了实际跳转）：
// setTimeout(() => {
//     // 在实际应用中，这里应该是实际跳转
//     // window.open(link.url, '_blank');
//     
//     // 这里我们只显示一个提示
//     console.log(`正在跳转到: ${link.url}`);
//     alert(`即将跳转到: ${link.title}\nURL: ${link.url}\n响应时间: ${responseTime.toFixed(2)}ms`);
// }, 100);

// 修改后的代码（启用实际跳转）：
function handleLinkClick(link) {
    const startTime = performance.now();
    
    // 添加点击动画
    const card = document.querySelector(`.link-card[data-id="${link.id}"]`);
    if (card) {
        card.classList.add('clicked');
        setTimeout(() => {
            card.classList.remove('clicked');
        }, 300);
    }
    
    // 更新点击统计
    link.clicks = (link.clicks || 0) + 1;
    link.lastClick = new Date().toISOString();
    appData.totalClicks = (appData.totalClicks || 0) + 1;
    
    // 记录点击历史
    if (!appData.clickHistory) appData.clickHistory = [];
    appData.clickHistory.push({
        linkId: link.id,
        linkTitle: link.title,
        timestamp: new Date().toISOString(),
        responseTime: 0
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
    
    // 修复跳转逻辑 - 启用实际跳转
    setTimeout(() => {
        // 验证URL格式
        if (!link.url || link.url.trim() === '') {
            console.error('URL为空，无法跳转');
            alert('该链接的URL未设置，请联系管理员');
            return;
        }
        
        // 确保URL包含协议
        let targetUrl = link.url.trim();
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }
        
        try {
            // 在新标签页打开链接
            const newWindow = window.open(targetUrl, '_blank');
            
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                // 如果被浏览器拦截，给用户提示
                if (confirm(`跳转被浏览器阻止。\n\n目标地址：${link.title}\nURL：${targetUrl}\n\n是否手动复制链接？`)) {
                    // 复制链接到剪贴板
                    navigator.clipboard.writeText(targetUrl).then(() => {
                        alert('链接已复制到剪贴板，请手动粘贴访问');
                    }).catch(() => {
                        prompt('请手动复制以下链接：', targetUrl);
                    });
                }
            } else {
                // 跳转成功，记录日志
                console.log(`成功跳转到: ${link.title}, URL: ${targetUrl}, 响应时间: ${responseTime.toFixed(2)}ms`);
            }
        } catch (error) {
            console.error('跳转失败:', error);
            alert('跳转失败，请检查链接地址是否正确');
        }
    }, 50); // 减少延迟时间，使跳转更快响应
}

// 如果希望在当前页面跳转（而不是新标签页），可以使用以下替代方案：
function handleLinkClickCurrentWindow(link) {
    // ... 前面的统计代码相同 ...
    
    setTimeout(() => {
        // 验证URL格式
        if (!link.url || link.url.trim() === '') {
            console.error('URL为空，无法跳转');
            alert('该链接的URL未设置，请联系管理员');
            return;
        }
        
        // 确保URL包含协议
        let targetUrl = link.url.trim();
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }
        
        try {
            // 在当前窗口跳转
            window.location.href = targetUrl;
            console.log(`在当前窗口跳转到: ${link.title}, URL: ${targetUrl}`);
        } catch (error) {
            console.error('跳转失败:', error);
            alert('跳转失败，请检查链接地址是否正确');
        }
    }, 50);
}

// 辅助函数：更新链接卡片显示
function updateLinkCard(linkId) {
    if (!appData.links) return;
    
    const link = appData.links.find(l => l.id === linkId);
    if (!link) return;
    
    const card = document.querySelector(`.link-card[data-id="${link.id}"]`);
    if (card) {
        const clickCount = card.querySelector('.click-count');
        const lastClick = card.querySelector('.link-stats div:nth-child(2)');
        
        if (clickCount) {
            clickCount.textContent = link.clicks || 0;
        }
        
        if (lastClick) {
            lastClick.textContent = link.lastClick ? formatDate(link.lastClick) : '尚未点击';
        }
    }
}

// 辅助函数：初始化链接卡片点击事件
function initLinkCards() {
    const linksContainer = document.getElementById('links-container');
    if (!linksContainer) return;
    
    linksContainer.innerHTML = '';
    
    // 确保links数组存在
    if (!appData.links || appData.links.length === 0) {
        appData.links = [...defaultLinks];
        saveAppData();
    }
    
    appData.links.forEach(link => {
        const linkCard = document.createElement('div');
        linkCard.className = 'link-card';
        linkCard.dataset.id = link.id;
        
        const iconClass = link.icon || getDefaultIcon(link.id);
        const colorClass = link.color || 1;
        
        linkCard.innerHTML = `
            <div class="link-icon" style="background: ${getColorGradient(colorClass)};">
                <i class="${iconClass}"></i>
            </div>
            <h3 class="link-title">${link.title || '未命名链接'}</h3>
            <p class="link-desc">${link.description || '暂无描述'}</p>
            <div class="link-stats">
                <div>点击次数: <span class="click-count">${link.clicks || 0}</span></div>
                <div>${link.lastClick ? formatDate(link.lastClick) : '尚未点击'}</div>
            </div>
        `;
        
        // 修复：添加点击事件监听器
        linkCard.addEventListener('click', function(e) {
            e.preventDefault();
            handleLinkClick(link);
        });
        
        // 修复：允许通过键盘访问
        linkCard.setAttribute('tabindex', '0');
        linkCard.setAttribute('role', 'button');
        linkCard.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLinkClick(link);
            }
        });
        
        linksContainer.appendChild(linkCard);
    });
}

// 修复：确保应用数据正确加载
function loadAppData() {
    const savedData = localStorage.getItem('appData');
    
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            appData = { ...appData, ...parsedData };
        } catch (e) {
            console.error('加载数据失败，使用默认数据:', e);
            appData.links = [...defaultLinks];
        }
    } else {
        appData.links = [...defaultLinks];
    }
    
    // 确保links数组存在
    if (!appData.links || appData.links.length === 0) {
        appData.links = [...defaultLinks];
    }
    
    // 确保其他必要字段存在
    if (appData.totalClicks === undefined) appData.totalClicks = 0;
    if (appData.clickHistory === undefined) appData.clickHistory = [];
    
    saveAppData();
}

// 默认链接数据（确保存在）
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 加载应用数据
    loadAppData();
    
    // 初始化链接卡片
    initLinkCards();
    
    // 初始化事件监听器
    const cards = document.querySelectorAll('.link-card');
    cards.forEach(card => {
        const linkId = parseInt(card.dataset.id);
        const link = appData.links.find(l => l.id === linkId);
        if (link) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                handleLinkClick(link);
            });
        }
    });
});
