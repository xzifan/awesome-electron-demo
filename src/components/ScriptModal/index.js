import React, { useState } from 'react';
import { Modal, Radio, Space } from 'antd';
import './index.scss';

function ScriptModal (props){
  const [selected, setSelected] = useState(1)
  return (<Modal
    visible={props.showSelectScript}
    title='请选择脚本'
    onCancel={()=>props.setShowSelectScript(false)}
    closable={false}
    onOk={()=>{
      props.setShowSelectScript(false)
    }}
  >
    <Radio.Group value={selected} onChange={(e)=>setSelected(e.target.value)}>
      <Space direction="vertical">
        <Radio value={1}>弱光明细汇总 210814</Radio>
      </Space>
    </Radio.Group>
  </Modal>)
}

export default ScriptModal;