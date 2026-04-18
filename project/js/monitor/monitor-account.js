// ==================== 班委账号管理模块 ====================

function initMonitorAccount() {
    loadMonitorAccountPage();
}

function loadMonitorAccountPage() {
    const container = document.getElementById('account-page');
    const currentUser = window.currentUser;

    if (!container) return;

    // 获取学院和专业选项
    const colleges = window.appData.colleges;
    const majors = window.appData.majors;
    const classes = window.appData.classes;

    // 根据当前学院获取专业选项
    let majorOptions = '<option value="">请选择专业</option>';
    if (currentUser?.college && majors[currentUser.college]) {
        majors[currentUser.college].forEach(m => {
            majorOptions += `<option value="${m}" ${currentUser.major === m ? 'selected' : ''}>${m}</option>`;
        });
    }

    // 根据当前专业获取班级选项
    let classOptions = '<option value="">请选择班级</option>';
    if (currentUser?.major && classes[currentUser.major]) {
        classes[currentUser.major].forEach(c => {
            classOptions += `<option value="${c}" ${currentUser.className === c ? 'selected' : ''}>${c}</option>`;
        });
    }

    container.innerHTML = `
        <div class="section">
            <div class="section-title">账号管理</div>
            
            <div class="account-info">
                <div class="account-avatar" id="monitor-account-avatar">${currentUser?.name?.charAt(0) || '班'}</div>
                <div class="account-info-text">
                    <h3>${currentUser?.name || '班委'}</h3>
                    <p>学号：${currentUser?.id || '-'}</p>
                    <p>学院：${currentUser?.college || '未设置'}</p>
                    <p>专业：${currentUser?.major || '未设置'}</p>
                    <p>班级：${currentUser?.className || '未设置'}</p>
                    <p>职务：${currentUser?.monitorType || '班委'}</p>
                </div>
            </div>
            
            <form class="account-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">姓名</label>
                        <input type="text" class="form-control" id="monitor-name" value="${currentUser?.name || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">学号</label>
                        <input type="text" class="form-control" value="${currentUser?.id || ''}" readonly>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">学院</label>
                        <select class="form-control" id="monitor-college">
                            <option value="">请选择学院</option>
                            ${colleges.map(c => `<option value="${c}" ${currentUser?.college === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">专业</label>
                        <select class="form-control" id="monitor-major">
                            ${majorOptions}
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">班级</label>
                        <select class="form-control" id="monitor-class">
                            ${classOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">职务</label>
                        <input type="text" class="form-control" value="${currentUser?.monitorType || '班委'}" readonly>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">联系方式</label>
                        <input type="text" class="form-control" id="monitor-phone" value="${currentUser?.phone || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">电子邮箱</label>
                        <input type="email" class="form-control" id="monitor-email" value="${currentUser?.email || ''}">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cancel-btn" id="monitor-cancel-btn">取消</button>
                    <button type="button" class="save-btn" id="monitor-save-btn">保存修改</button>
                </div>
            </form>
        </div>
    `;

    // 学院、专业、班级联动
    const collegeSelect = document.getElementById('monitor-college');
    const majorSelect = document.getElementById('monitor-major');
    const classSelect = document.getElementById('monitor-class');

    if (collegeSelect) {
        collegeSelect.addEventListener('change', function () {
            const college = this.value;
            const majors = window.appData.majors;
            if (college && majors[college]) {
                majorSelect.innerHTML = `<option value="">请选择专业</option>${majors[college].map(m => `<option value="${m}">${m}</option>`).join('')}`;
                classSelect.innerHTML = '<option value="">请先选择专业</option>';
            } else {
                majorSelect.innerHTML = '<option value="">请先选择学院</option>';
                classSelect.innerHTML = '<option value="">请先选择专业</option>';
            }
        });
    }

    if (majorSelect) {
        majorSelect.addEventListener('change', function () {
            const major = this.value;
            const classes = window.appData.classes;
            if (major && classes[major]) {
                classSelect.innerHTML = `<option value="">请选择班级</option>${classes[major].map(c => `<option value="${c}">${c}</option>`).join('')}`;
            } else {
                classSelect.innerHTML = '<option value="">请先选择专业</option>';
            }
        });
    }

    // 头像点击
    const avatar = document.getElementById('monitor-account-avatar');
    if (avatar) {
        avatar.addEventListener('click', function () {
            const colors = ['#d4a017', '#b8860b', '#a0522d', '#8b4513'];
            this.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            showNotification('头像颜色已更新');
        });
    }

    // 保存
    const saveBtn = document.getElementById('monitor-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = document.getElementById('monitor-name').value;
            const college = document.getElementById('monitor-college').value;
            const major = document.getElementById('monitor-major').value;
            const className = document.getElementById('monitor-class').value;
            const phone = document.getElementById('monitor-phone').value;
            const email = document.getElementById('monitor-email').value;

            const currentUser = window.currentUser;
            if (currentUser) {
                currentUser.name = name;
                currentUser.college = college;
                currentUser.major = major;
                currentUser.className = className;
                currentUser.phone = phone;
                currentUser.email = email;

                // 更新显示
                document.getElementById('monitor-user-name').textContent = name;
                document.getElementById('monitor-user-avatar').textContent = name.charAt(0);
                document.getElementById('monitor-account-avatar').textContent = name.charAt(0);

                // 更新account-info-text中的显示
                const infoText = document.querySelector('#monitorSystem .account-info-text');
                if (infoText) {
                    infoText.innerHTML = `
                        <h3>${name}</h3>
                        <p>学号：${currentUser.id || '-'}</p>
                        <p>学院：${college || '未设置'}</p>
                        <p>专业：${major || '未设置'}</p>
                        <p>班级：${className || '未设置'}</p>
                        <p>职务：${currentUser.monitorType || '班委'}</p>
                    `;
                }

                const userIndex = window.appData.studentUsers.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    window.appData.studentUsers[userIndex] = currentUser;
                }

                showToast('信息保存成功');
            }
        });
    }

    // 取消
    const cancelBtn = document.getElementById('monitor-cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const currentUser = window.currentUser;
            if (currentUser) {
                document.getElementById('monitor-name').value = currentUser.name || '';
                document.getElementById('monitor-college').value = currentUser.college || '';
                document.getElementById('monitor-major').value = currentUser.major || '';
                document.getElementById('monitor-class').value = currentUser.className || '';
                document.getElementById('monitor-phone').value = currentUser.phone || '';
                document.getElementById('monitor-email').value = currentUser.email || '';
            }
            showToast('已取消修改');
        });
    }
}