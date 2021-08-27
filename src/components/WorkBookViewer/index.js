import {  Menu } from 'antd'
import React, { useState } from 'react'
import WorkSheetViewer from '../WorkSheetViewer';
import './index.scss';

function getFormattedDate(data) {
  const date = new Date(data)
  return date.getFullYear()+'-'+date.getMonth()+'-' + date.getDay()+'- ' + date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
}

function Viewer (props){
  const workbook = props.workbook
  const [currentSheet, setCurrentSheet] = useState(workbook.SheetNames.length ? workbook.SheetNames[0] : undefined)
  return <div className="viewer-container">
    <span className="workbook-name" style={{ fontSize: '16px',fontWeight: 600}}>
      源文件：{ workbook && workbook.Source.FileName } <br/>
    </span>
    <span className="workbook-desc">
      最近修改：{ workbook && (getFormattedDate(workbook.Source.LastModified))}
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
    
    {(workbook.Sheets && (currentSheet !== undefined)) && <WorkSheetViewer workbookParams={{...workbook.Source, selectedSheet: currentSheet }} sheetName={currentSheet} currentSheet={workbook.Sheets[currentSheet]} />}
  </div>
}

export default Viewer