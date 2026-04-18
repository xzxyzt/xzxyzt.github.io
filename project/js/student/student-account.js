// ==================== 学生账号管理模块 ====================

function initStudentAccount() {
    loadStudentAccountPage();
}

function loadStudentAccountPage() {
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
            
            <div class="account-tabs">
                <button class="account-tab active" data-tab="basic-info">基本信息</button>
                <button class="account-tab" data-tab="password">密码修改</button>
            </div>
            
            <!-- 基本信息标签页 -->
            <div class="account-tab-content active" id="basic-info-tab">
                <div class="account-info">
                    <div class="account-avatar" id="student-account-avatar">${currentUser?.name?.charAt(0) || '学'}</div>
                    <div class="account-info-text">
                        <h3 id="account-name">${currentUser?.name || '学生'}</h3>
                        <p id="account-id">学号：${currentUser?.id || '-'}</p>
                        <p id="account-major">专业：${currentUser?.major || '未设置'}</p>
                        <p id="account-class">班级：${currentUser?.className || '未设置'}</p>
                    </div>
                </div>
                
                <form class="account-form" id="basic-info-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">姓名</label>
                            <input type="text" class="form-control" id="account-name-input" value="${currentUser?.name || ''}" placeholder="请输入姓名">
                        </div>
                        <div class="form-group">
                            <label class="form-label">学号</label>
                            <input type="text" class="form-control" id="account-id-input" value="${currentUser?.id || ''}" readonly>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">学院</label>
                            <select class="form-control" id="account-college">
                                <option value="">请选择学院</option>
                                ${colleges.map(c => `<option value="${c}" ${currentUser?.college === c ? 'selected' : ''}>${c}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">专业</label>
                            <select class="form-control" id="account-major-input">
                                ${majorOptions}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">班级</label>
                            <select class="form-control" id="account-class">
                                ${classOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">联系方式</label>
                            <input type="text" class="form-control" id="account-phone" value="${currentUser?.phone || ''}" placeholder="请输入手机号">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">电子邮箱</label>
                            <input type="email" class="form-control" id="account-email" value="${currentUser?.email || ''}" placeholder="请输入邮箱">
                        </div>
                        <div class="form-group">
                            <label class="form-label">入学年份</label>
                            <input type="text" class="form-control" id="account-enrollment-year" value="${currentUser?.enrollmentYear || ''}" placeholder="请输入入学年份">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" id="cancel-basic-info">取消</button>
                        <button type="button" class="save-btn" id="save-basic-info">保存修改</button>
                    </div>
                </form>
            </div>
            
            <!-- 密码修改标签页 -->
            <div class="account-tab-content" id="password-tab">
                <!-- 密码修改表单保持不变 -->
                <form class="account-form" id="password-form">
                    <div class="form-group">
                        <label class="form-label">当前密码</label>
                        <input type="password" class="form-control" id="current-password" placeholder="请输入当前密码">
                    </div>
                    <div class="form-group">
                        <label class="form-label">新密码</label>
                        <input type="password" class="form-control" id="new-password" placeholder="请输入新密码（至少6位）">
                        <div class="password-strength"><div class="password-strength-bar" id="password-strength-bar"></div></div>
                        <div class="password-hint" id="password-hint">密码强度：弱</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">确认新密码</label>
                        <input type="password" class="form-control" id="confirm-new-password" placeholder="请再次输入新密码">
                    </div>
                    <div class="form-group">
                        <label class="form-label">手机验证码</label>
                        <div class="verification-row">
                            <input type="text" class="form-control" id="verification-code" placeholder="请输入验证码">
                            <button type="button" class="verification-btn" id="send-verification-code">获取验证码</button>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" id="cancel-password">取消</button>
                        <button type="button" class="save-btn" id="save-password">修改密码</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    bindStudentAccountEvents();

    // 学院、专业、班级联动
    const collegeSelect = document.getElementById('account-college');
    const majorSelect = document.getElementById('account-major-input');
    const classSelect = document.getElementById('account-class');

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
}

function bindStudentAccountEvents() {
    // ... 其他事件绑定保持不变 ...

    // 保存基本信息（修改后包含学院、专业、班级）
    const saveBasicBtn = document.getElementById('save-basic-info');
    if (saveBasicBtn) {
        saveBasicBtn.addEventListener('click', function () {
            const name = document.getElementById('account-name-input').value;
            const college = document.getElementById('account-college').value;
            const major = document.getElementById('account-major-input').value;
            const className = document.getElementById('account-class').value;
            const phone = document.getElementById('account-phone').value;
            const email = document.getElementById('account-email').value;
            const enrollmentYear = document.getElementById('account-enrollment-year').value;

            if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
                showToast('手机号格式不正确', true);
                return;
            }

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('邮箱格式不正确', true);
                return;
            }

            const currentUser = window.currentUser;
            if (currentUser) {
                currentUser.name = name;
                currentUser.college = college;
                currentUser.major = major;
                currentUser.className = className;
                currentUser.phone = phone;
                currentUser.email = email;
                currentUser.enrollmentYear = enrollmentYear;

                // 更新显示
                document.getElementById('account-name').textContent = name;
                document.getElementById('account-major').textContent = `专业：${major || '未设置'}`;
                document.getElementById('account-class').textContent = `班级：${className || '未设置'}`;
                document.getElementById('student-user-name').textContent = name;
                document.getElementById('student-user-avatar').textContent = name.charAt(0);
                document.getElementById('student-account-avatar').textContent = name.charAt(0);

                // 更新全局数据
                const userIndex = window.appData.studentUsers.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    window.appData.studentUsers[userIndex] = currentUser;
                }

                showToast('基本信息更新成功');
            }
        });
    }

    // ... 其余代码保持不变 ...
}