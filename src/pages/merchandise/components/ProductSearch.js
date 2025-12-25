import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import './ProductSearch.css';

const ProductSearch = ({ 
    placeholder = "输入商品名称搜索", 
    onSearch, 
    allowClear = true 
}) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchValue);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        if (onSearch) {
            onSearch('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="product-search-container">
            <div className="product-search-input-wrapper">
                <Input
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="product-search-input"
                />
                <div className="product-search-buttons">
                    {allowClear && searchValue && (
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={handleClear}
                            className="product-search-clear-btn"
                        />
                    )}
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        className="product-search-btn"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductSearch;