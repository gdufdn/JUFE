// 后台管理逻辑文件
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 初始化事件监听器
    initAdminEventListeners();
    
    // 初始化链接表单
    initLinksForm();
    
    // 初始化数据分析表格
    initAnalyticsTable();
});

// 检查登录状态
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showAdminPage();
    } else {
        showLoginPage();
    }
}

// 显示登录页面
function showLoginPage() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('admin-page').style.display = 'none';
}

// 显示管理页面
function showAdminPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('admin-page').style.display = 'flex';
    
    // 加载应用数据
    loadAppDataForAdmin();
    
    // 初始化管理面板
    initAdminPanels();
}

// 加载应用数据（用于后台管理）
function loadAppDataForAdmin() {
    const savedData = localStorage.getItem('appData');
    let appData = {};
    
    if (savedData) {
        try {
            appData = JSON.parse(savedData);
        } catch (e) {
            console.error('加载数据失败:', e);
            appData = getDefaultAppData();
        }
    } else {
        appData = getDefaultAppData();
    }
    
    // 更新管理页面上的数据
    updateAdminDataDisplay(appData);
    
    return appData;
}

// 获取默认应用数据
function getDefaultAppData() {
    return {
        links: [
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
        ],
        totalClicks: 0,
        todayVisits: 0,
        announcement: "欢迎使用应用服务平台！系统运行稳定，所有功能均可正常使用。最新版本已上线，带来更流畅的使用体验。",
        maintenanceTime: "每周日凌晨 2:00-4:00",
        version: "v2.1.5"
    };
}

// 更新管理页面数据显示
function updateAdminDataDisplay(appData) {
    // 更新总点击量
    document.getElementById('admin-total-clicks').textContent = appData.totalClicks || 0;
    
    // 更新活跃链接数
    const activeLinks = appData.links ? appData.links.length : 0;
    document.getElementById('admin-active-links').textContent = activeLinks;
    
    // 更新今日访问量
    document.getElementById('admin-today-visits').textContent = appData.todayVisits || 0;
    
    // 更新公告内容
    const announcementTextarea = document.getElementById('announcement-content');
    if (announcementTextarea && appData.announcement) {
        announcementTextarea.value = appData.announcement;
    }
    
    // 更新维护时间
    const maintenanceInput = document.getElementById('maintenance-schedule');
    if (maintenanceInput && appData.maintenanceTime) {
        maintenanceInput.value = appData.maintenanceTime;
    }
    
    // 更新版本号
    const versionInput = document.getElementById('version-number');
    if (versionInput && appData.version) {
        versionInput.value = appData.version;
    }
}

// 初始化事件监听器
function initAdminEventListeners() {
    // 登录表单提交
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // 侧边栏菜单点击
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (item.dataset.panel) {
            item.addEventListener('click', function() {
                // 移除所有active类
                menuItems.forEach(mi => mi.classList.remove('active'));
                // 添加当前active类
                this.classList.add('active');
                // 显示对应的面板
                showPanel(this.dataset.panel);
            });
        }
    });
    
    // 保存公告按钮
    const saveAnnouncementBtn = document.getElementById('save-announcement');
    if (saveAnnouncementBtn) {
        saveAnnouncementBtn.addEventListener('click', saveAnnouncement);
    }
    
    // 保存链接按钮
    const saveLinksBtn = document.getElementById('save-links');
    if (saveLinksBtn) {
        saveLinksBtn.addEventListener('click', saveLinks);
    }
    
    // 保存维护设置按钮
    const saveMaintenanceBtn = document.getElementById('save-maintenance');
    if (saveMaintenanceBtn) {
        saveMaintenanceBtn.addEventListener('click', saveMaintenanceSettings);
    }
    
    // 重置统计数据按钮
    const resetStatsBtn = document.getElementById('reset-stats');
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', resetStatistics);
    }
    
    // 导出数据按钮
    const exportStatsBtn = document.getElementById('export-stats');
    if (exportStatsBtn) {
        exportStatsBtn.addEventListener('click', exportStatistics);
    }
}

// 处理登录
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    // 简单的模拟登录验证
    // 在实际应用中，这里应该与后端API进行验证
    if (username === 'admin' && password === 'admin123') {
        // 登录成功
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminPage();
    } else {
        // 登录失败
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
}

// 登出
function logout() {
    localStorage.removeItem('adminLoggedIn');
    showLoginPage();
}

// 显示指定面板
function showPanel(panelId) {
    // 隐藏所有面板
    const panels = document.querySelectorAll('.admin-panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // 显示选中的面板
    const targetPanel = document.getElementById(`${panelId}-panel`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
    
    // 更新面板标题
    const panelTitles = {
        'dashboard': '仪表板',
        'announcement': '公告管理',
        'links': '链接管理',
        'maintenance': '维护设置',
        'analytics': '数据分析'
    };
    
    const panelTitle = document.getElementById('panel-title');
    if (panelTitle && panelTitles[panelId]) {
        panelTitle.textContent = panelTitles[panelId];
    }
}

// 初始化管理面板
function initAdminPanels() {
    // 默认显示仪表板
    showPanel('dashboard');
}

// 初始化链接表单
function initLinksForm() {
    const appData = loadAppDataForAdmin();
    const linksFormContainer = document.getElementById('links-form-container');
    
    if (!linksFormContainer || !appData.links) return;
    
    linksFormContainer.innerHTML = '';
    
    appData.links.forEach((link, index) => {
        const linkForm = createLinkForm(link, index);
        linksFormContainer.appendChild(linkForm);
    });
}

// 创建链接表单
function createLinkForm(link, index) {
    const form = document.createElement('div');
    form.className = 'link-form';
    form.style.marginBottom = '20px';
    form.style.padding = '20px';
    form.style.backgroundColor = '#f8f9fa';
    form.style.borderRadius = '10px';
    
    form.innerHTML = `
        <h3 style="margin-bottom: 15px; color: #4a6bff;">链接 ${index + 1}</h3>
        <div class="form-group">
            <label for="link-title-${link.id}">链接标题</label>
            <input type="text" id="link-title-${link.id}" class="form-control" value="${link.title || ''}" placeholder="请输入链接标题">
        </div>
        <div class="form-group">
            <label for="link-desc-${link.id}">链接描述</label>
            <textarea id="link-desc-${link.id}" class="form-control" placeholder="请输入链接描述" rows="3">${link.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label for="link-icon-${link.id}">图标类名 (FontAwesome)</label>
            <input type="text" id="link-icon-${link.id}" class="form-control" value="${link.icon || ''}" placeholder="例如: fas fa-download">
            <small style="color: #666; font-size: 0.9rem;">使用FontAwesome图标类名，如: fas fa-download, fas fa-book等</small>
        </div>
        <div class="form-group">
            <label for="link-url-${link.id}">链接地址</label>
            <input type="text" id="link-url-${link.id}" class="form-control" value="${link.url || ''}" placeholder="https://example.com">
        </div>
        <div class="form-group">
            <label for="link-color-${link.id}">颜色主题 (1-5)</label>
            <input type="number" id="link-color-${link.id}" class="form-control" value="${link.color || 1}" min="1" max="5">
        </div>
    `;
    
    return form;
}

// 保存公告
function saveAnnouncement() {
    const announcementContent = document.getElementById('announcement-content').value;
    
    if (!announcementContent.trim()) {
        alert('公告内容不能为空！');
        return;
    }
    
    // 获取当前应用数据
    const appData = loadAppDataForAdmin();
    
    // 更新公告
    appData.announcement = announcementContent;
    
    // 保存到localStorage
    localStorage.setItem('appData', JSON.stringify(appData));
    
    // 触发前端页面更新
    window.dispatchEvent(new Event('appDataUpdated'));
    
    // 显示成功消息
    alert('公告保存成功！');
    
    // 更新管理页面显示
    updateAdminDataDisplay(appData);
}

// 保存链接
function saveLinks() {
    const appData = loadAppDataForAdmin();
    
    // 更新每个链接的数据
    appData.links.forEach(link => {
        const titleInput = document.getElementById(`link-title-${link.id}`);
        const descInput = document.getElementById(`link-desc-${link.id}`);
        const iconInput = document.getElementById(`link-icon-${link.id}`);
        const urlInput = document.getElementById(`link-url-${link.id}`);
        const colorInput = document.getElementById(`link-color-${link.id}`);
        
        if (titleInput) link.title = titleInput.value;
        if (descInput) link.description = descInput.value;
        if (iconInput) link.icon = iconInput.value;
        if (urlInput) link.url = urlInput.value;
        if (colorInput) link.color = parseInt(colorInput.value) || 1;
    });
    
    // 保存到localStorage
    localStorage.setItem('appData', JSON.stringify(appData));
    
    // 触发前端页面更新
    window.dispatchEvent(new Event('appDataUpdated'));
    
    // 显示成功消息
    alert('链接保存成功！');
    
    // 更新管理页面显示
    updateAdminDataDisplay(appData);
}

// 保存维护设置
function saveMaintenanceSettings() {
    const maintenanceSchedule = document.getElementById('maintenance-schedule').value;
    const versionNumber = document.getElementById('version-number').value;
    
    if (!maintenanceSchedule.trim() || !versionNumber.trim()) {
        alert('维护时间和版本号都不能为空！');
        return;
    }
    
    // 获取当前应用数据
    const appData = loadAppDataForAdmin();
    
    // 更新设置
    appData.maintenanceTime = maintenanceSchedule;
    appData.version = versionNumber;
    
    // 保存到localStorage
    localStorage.setItem('appData', JSON.stringify(appData));
    
    // 触发前端页面更新
    window.dispatchEvent(new Event('appDataUpdated'));
    
    // 显示成功消息
    alert('维护设置保存成功！');
    
    // 更新管理页面显示
    updateAdminDataDisplay(appData);
}

// 初始化数据分析表格
function initAnalyticsTable() {
    const appData = loadAppDataForAdmin();
    const analyticsTable = document.getElementById('analytics-table');
    
    if (!analyticsTable || !appData.links) return;
    
    analyticsTable.innerHTML = '';
    
    appData.links.forEach(link => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${link.title}</td>
            <td>${link.clicks || 0}</td>
            <td>${link.lastClick ? formatDate(link.lastClick) : '尚未点击'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="viewLinkDetails(${link.id})">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="resetLinkStats(${link.id})">
                        <i class="fas fa-redo"></i> 重置
                    </button>
                </div>
            </td>
        `;
        
        analyticsTable.appendChild(row);
    });
}

// 查看链接详情
function viewLinkDetails(linkId) {
    const appData = loadAppDataForAdmin();
    const link = appData.links.find(l => l.id === linkId);
    
    if (link) {
        let details = `链接详情:\n\n`;
        details += `标题: ${link.title}\n`;
        details += `描述: ${link.description}\n`;
        details += `URL: ${link.url}\n`;
        details += `图标: ${link.icon}\n`;
        details += `点击次数: ${link.clicks}\n`;
        details += `最后点击: ${link.lastClick ? formatDate(link.lastClick) : '尚未点击'}\n`;
        
        alert(details);
    }
}

// 重置链接统计
function resetLinkStats(linkId) {
    if (!confirm('确定要重置此链接的统计数据吗？此操作不可撤销。')) {
        return;
    }
    
    const appData = loadAppDataForAdmin();
    const linkIndex = appData.links.findIndex(l => l.id === linkId);
    
    if (linkIndex !== -1) {
        appData.links[linkIndex].clicks = 0;
        appData.links[linkIndex].lastClick = null;
        
        // 重新计算总点击量
        appData.totalClicks = appData.links.reduce((total, link) => total + link.clicks, 0);
        
        // 保存到localStorage
        localStorage.setItem('appData', JSON.stringify(appData));
        
        // 触发前端页面更新
        window.dispatchEvent(new Event('appDataUpdated'));
        
        // 更新表格
        initAnalyticsTable();
        updateAdminDataDisplay(appData);
        
        alert('链接统计数据已重置！');
    }
}

// 重置所有统计
function resetStatistics() {
    if (!confirm('确定要重置所有统计数据吗？此操作将清除所有点击记录，不可撤销。')) {
        return;
    }
    
    const appData = loadAppDataForAdmin();
    
    // 重置所有链接的统计
    appData.links.forEach(link => {
        link.clicks = 0;
        link.lastClick = null;
    });
    
    // 重置总点击量
    appData.totalClicks = 0;
    appData.clickHistory = [];
    
    // 保存到localStorage
    localStorage.setItem('appData', JSON.stringify(appData));
    
    // 触发前端页面更新
    window.dispatchEvent(new Event('appDataUpdated'));
    
    // 更新表格和显示
    initAnalyticsTable();
    updateAdminDataDisplay(appData);
    
    alert('所有统计数据已重置！');
}

// 导出统计数据
function exportStatistics() {
    const appData = loadAppDataForAdmin();
    
    // 准备导出数据
    const exportData = {
        exportTime: new Date().toISOString(),
        summary: {
            totalClicks: appData.totalClicks || 0,
            todayVisits: appData.todayVisits || 0,
            totalLinks: appData.links ? appData.links.length : 0
        },
        links: appData.links || [],
        clickHistory: appData.clickHistory || []
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// 工具函数：格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
}
