import { Tag, Space} from 'antd';
import { useNavigate } from 'react-router-dom';
import './tag.css'

function TagComponent({navItem}){
    const navigate = useNavigate();
    // console.log('navItem:', navItem.label);
    function handleClose(){
        navigate('/home');
    };
    return (
        <Space size={[0,8]} wrap>
            <Tag>首页</Tag>
            <Tag closeIcon color='#55acee' onClose={() => {handleClose()}}>{navItem.label}</Tag>
        </Space>
    )
}

export default TagComponent;