import './form.css'
// 用户信息表单
function UserInfoForm({handleInputChange, formData}) {
    return (
        <div>
            <form className='modal-form'>
                    <label><span className="required-asterisk">*</span>姓名：</label>
                        <input 
                        type="text" 
                        name='name' 
                        placeholder="    请输入姓名" 
                        value={formData.name}
                        onChange={(e) => handleInputChange(e)}
                        required /><br />
                    <label><span className="required-asterisk">*</span>年龄：</label>
                        <input 
                        type="number" 
                        name='age' 
                        placeholder="    请输入年龄"
                        value={formData.age}
                        onChange={(e) => handleInputChange(e)}
                        required /><br />
                    <label><span className="required-asterisk">*</span>性别：</label>
                        <div style={{marginLeft: '35px', display: 'inline'}}>
                            <input 
                            type="radio" 
                            name='gender' 
                            value={1}
                            checked={formData.gender === 1}
                            onChange={(e) => handleInputChange(e)}
                            required/>男
                            <input 
                            type="radio" 
                            name='gender' 
                            value={0}
                            checked={formData.gender === 0}
                            onChange={(e) => handleInputChange(e)}
                            required/>女
                        </div><br />
                    <label><span className="required-asterisk">*</span>地址：</label>
                        <input 
                        type="text" 
                        name='addr' 
                        placeholder="    请输入地址" 
                        value={formData.addr}
                        onChange={(e) => handleInputChange(e)}
                        required/><br />
                    <label><span className="required-asterisk">*</span>出生日期：</label>
                        <input 
                        type="date" 
                        name='birth'
                        style={{marginLeft: '22px', width: '150px'}}
                        placeholder="    请输入出生日期" 
                        value={formData.birth}
                        onChange={(e) => handleInputChange(e)}
                        required/>
                </form>
        </div>
    )
}

export default UserInfoForm;