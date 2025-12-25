/**
 * JWT工具函数 - 用于解析JWT token中的用户信息
 */

/**
 * 解析JWT token
 * @param {string} token - JWT token字符串
 * @returns {object|null} 解析后的payload对象，如果解析失败返回null
 */
export function parseJWT(token) {
    try {
        // JWT token格式: header.payload.signature
        const base64Url = token.split('.')[1];
        if (!base64Url) {
            return null;
        }
        
        // 将base64Url转换为base64
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // 解码base64字符串
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('JWT解析失败:', error);
        return null;
    }
}

/**
 * 从JWT token中获取用户信息
 * @param {string} token - JWT token字符串
 * @returns {object|null} 用户信息对象，包含userId, username, role等字段
 */
export function getUserInfoFromToken(token) {
    const payload = parseJWT(token);
    if (!payload) {
        return null;
    }
    
    // 根据常见的JWT payload结构提取用户信息
    return {
        userId: payload.userId || payload.sub || payload.id,
        username: payload.username || payload.name || payload.preferred_username,
        role: payload.role || payload.roles?.[0] || 'sales'
    };
}

/**
 * 检查token是否过期
 * @param {string} token - JWT token字符串
 * @returns {boolean} true表示已过期，false表示未过期
 */
export function isTokenExpired(token) {
    const payload = parseJWT(token);
    if (!payload || !payload.exp) {
        return true;
    }
    
    // exp是Unix时间戳（秒），需要转换为毫秒
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
}

/**
 * 获取当前登录用户信息
 * @returns {object|null} 当前登录用户信息
 */
export function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    
    // 检查token是否过期
    if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        return null;
    }
    
    return getUserInfoFromToken(token);
}