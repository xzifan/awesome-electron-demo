import './App.scss';
import { Button, message, Icon, Menu } from 'antd';
import { useState } from 'react';
import Excel from './components/Excel';
import TopBar from './components/TopBar';
import { EllipsisOutlined, FileExcelOutlined } from '@ant-design/icons';

function App() {
  const [current, setCurrent] = useState('main')
  return (
    <div className="App">
      <TopBar />
      {/* <Menu className="app-menu" onClick={(e) => setCurrent(e.key)} selectedKeys={[current]} >
        <Menu.Item key="main">
          <FileExcelOutlined /> &nbsp;Excel
        </Menu.Item>
        <Menu.Item key="other">
          <EllipsisOutlined /> &nbsp;其他
        </Menu.Item>
      </Menu>
      <div className="app-content">
        {current==='main' && <Excel />}
      </div> */}
      <div className="app-content">
        <Excel />
      </div>
    </div>
  );
}

export default App;
