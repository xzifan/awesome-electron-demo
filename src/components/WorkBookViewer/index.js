import { ArrowRightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Menu, Modal } from 'antd'
import React, { useState } from 'react'
import XLSX from 'xlsx';
import WorkSheetViewer from '../WorkSheetViewer';
import './index.scss';

function getFormattedDate(data) {
  const date = new Date(data)
  return date.getFullYear()+'-'+date.getMonth()+'-' + date.getDay()+'- ' + date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
}

function Viewer (props){
  const workbook = props.workbook
  const [currentSheet, setCurrentSheet] = useState(workbook.SheetNames.length ? workbook.SheetNames[0] : undefined)

  const onConfirmSheet = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: <div>
          <span style={{ lineHeight: '22px',fontWeight: 600}}>{ workbook.Source.FileName}</span> <br/>
          <div style={{marginTop: '16px'}}>是否将工作表 <span style={{fontWeight: 600}}>{currentSheet}</span> 进行转换</div>
        </div>,
      okText: '确定',
      cancelText:'取消',
      onOk() {
        console.log('OK');
        
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  return <div className="viewer-container">
    <span className="workbook-name" style={{ fontSize: '16px',fontWeight: 600}}>
      源文件：{ workbook && workbook.Source.FileName } <br/>
    </span>
    <span className="workbook-desc">
      最近修改：{ workbook && (getFormattedDate(workbook.Source.LastModified))}
      <Button className="worksheet-confirm-btn" type="primary" onClick={onConfirmSheet}>转换该表 <ArrowRightOutlined /></Button>
    </span>
    {/* <div className="workbook-desc">选择工作表:</div> */}
    {
      workbook && currentSheet!==undefined && <div className="workbook-sheets" style={{display:'flex'}}>
        <Menu mode="horizontal" onClick={(e)=>{
            console.log(e.key)
            setCurrentSheet(e.key)
          }}
          defaultSelectedKeys={workbook.SheetNames[0]}
        >
          {
            workbook.SheetNames.map((title,index)=>
              <Menu.Item key={title}>
                {title}
              </Menu.Item>
            )
          }
        </Menu>
      </div>
    }
    
    {(workbook.Sheets && (currentSheet !== undefined)) && <WorkSheetViewer currentSheet={workbook.Sheets[currentSheet]} />}
  </div>
}

export default Viewer