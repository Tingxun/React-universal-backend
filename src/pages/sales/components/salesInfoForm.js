import './salesInfoForm.css'
// 商户信息表单
function SalesInfoForm({handleInputChange, formData, editType}) {
    return (
        <div>
            <form className='modal-form'>
                <label><span className="required-asterisk">*</span>商户名称：</label>
                <input 
                    type="text" 
                    name='merchantName' 
                    placeholder="请输入商户名称" 
                    value={formData.merchantName}
                    onChange={(e) => handleInputChange(e)}
                    required /><br />
                
                <label><span className="required-asterisk">*</span>联系人：</label>
                <input 
                    type="text" 
                    name='contactPerson' 
                    placeholder="请输入联系人姓名" 
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange(e)}
                    required /><br />
                
                <label><span className="required-asterisk">*</span>联系电话：</label>
                <input 
                    type="tel" 
                    name='phone' 
                    placeholder="请输入联系电话" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange(e)}
                    required /><br />
                
                <label><span className="required-asterisk">*</span>邮箱：</label>
                <input 
                    type="email" 
                    name='email' 
                    placeholder="请输入邮箱地址" 
                    value={formData.email}
                    onChange={(e) => handleInputChange(e)}
                    required /><br />
                
                <label>地址：</label>
                <input 
                    type="text" 
                    name='address' 
                    placeholder="请输入商户地址" 
                    value={formData.address}
                    onChange={(e) => handleInputChange(e)} /><br />
                
                <label>营业执照号：</label>
                <input 
                    type="text" 
                    name='businessLicense' 
                    placeholder="请输入营业执照号" 
                    value={formData.businessLicense}
                    onChange={(e) => handleInputChange(e)} /><br />
                
                {editType === 'add' && (
                    <>
                        <label><span className="required-asterisk">*</span>用户名：</label>
                        <input 
                            type="text" 
                            name='username' 
                            placeholder="请输入登录用户名" 
                            value={formData.username}
                            onChange={(e) => handleInputChange(e)}
                            required /><br />
                        
                        <label><span className="required-asterisk">*</span>密码：</label>
                        <input 
                            type="password" 
                            name='password' 
                            placeholder="请输入登录密码" 
                            value={formData.password}
                            onChange={(e) => handleInputChange(e)}
                            required /><br />
                    </>
                )}
                
                <label>状态：</label>
                <select 
                    name='status' 
                    value={formData.status}
                    onChange={(e) => handleInputChange(e)}
                    style={{marginLeft: '35px', width: '150px'}}>
                    <option value="PENDING">待审核</option>
                    <option value="ACTIVE">活跃</option>
                    <option value="INACTIVE">停用</option>
                </select><br />
            </form>
        </div>
    )
}

export default SalesInfoForm;